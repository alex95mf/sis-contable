import { formatDate } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogService } from '../../../../../config/custom/confirmation-dialog/confirmation-dialog.service';
import { ValidacionesFactory } from '../../../../../config/custom/utils/ValidacionesFactory';
import { CommonService } from '../../../../../services/commonServices';
import { CommonVarService } from '../../../../../services/common-var.services';
import { LstNotaDebitoComponent } from '../lst-nota-debito/lst-nota-debito.component';
import { ProveedoresService } from '../proveedores.service';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

@Component({
standalone: false,
  selector: 'app-pago-letra',
  templateUrl: './pago-letra.component.html',
  styleUrls: ['./pago-letra.component.scss']
})
export class PagoLetraComponent implements OnInit {

  constructor(
    private provSrv: ProveedoresService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<PagoLetraComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private confirmationDialogService: ConfirmationDialogService,
    private commonServices: CommonService,
    private cmVrSrv: CommonVarService
  ) {
    this.cmVrSrv.listenCxpRes.asObservable().subscribe(res =>{
      this.dialogRef.close();
    })
  }

  values: any = { method: 0, typ_acc: 0, total: 0.00, parseTotal: "0.00", accredited: 0.00, parseAccredited: "0.00", pending: 0.00, parsePending: "0.00", pay: 0.00, obs: "", ben: "" };
  catalogs:any = [];
  contacts:any = undefined;
  current_pending: any = 0.00;
  type_payments:any = [];

  vmButtons:any = [];
  postDate: any = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  validaciones: ValidacionesFactory = new ValidacionesFactory();

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnPagoLetr", paramAccion: "", boton: { icon: "fa fa-check", texto: "ACEPTAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: true, imprimir: false},
      { orig: "btnPagoLetr", paramAccion: "", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false}
    ];

    setTimeout(() => {
      this.values = this.data.valor;
      this.catalogs = this.data.catalogs;
      this.type_payments = this.data.type_payments;
      this.contacts = this.data.contacts;
      this.current_pending = this.data.current_pending;
      let f_pagos =  this.catalogs['FORMA PAGO PROVEEDOR'].filter(fp =>fp.valor != "Depósito")
      this.catalogs['FORMA PAGO PROVEEDOR'] = f_pagos;
    }, 5);

  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto+evento.items.orig) {
      case "ACEPTARbtnPagoLetr":
        if(this.values.method == 'Nota de Débito'){
          if(this.validaciones.verSiEsNull(this.valorND) == undefined || Number(this.valorND) == 0){
            this.toastr.info("Por favor seleccione una nota de débito");
            return;
          }
        }

        if(this.validaciones.verSiEsNull(this.values.obs) == undefined){
          this.toastr.info("Por favor ingrese una observación");
          return;
        }
        let valor:any = {
          valida: true,
          type_payments: this.type_payments,
          values: this.values,
          flag:true
        }
        this.cmVrSrv.listenCxp.next(valor);
        //this.dialogRef.close(valor);

        /* Swal.fire({
          title: "Atención!",
          text: "Seguro desea realizar esta acción?",
           icon: 'warning',
          showCancelButton: true,
          cancelButtonColor: '#DC3545',
          confirmButtonColor: '#13A1EA',
          confirmButtonText: "Aceptar"
        }).then((result) => {
          if (result.value) {
            let valor:any = {
              valida: true,
              type_payments: this.type_payments,
              values: this.values
            }
            this.dialogRef.close(valor);
          }
        }); */
      break;
      case "CERRARbtnPagoLetr":
        this.dialogRef.close(false);
      break;
    }
  }

  setModelMethod(evt) {
    if(evt != "Nota de Débito"){
      this.values.typ_acc = 0
      this.values.ref_doc = undefined;

      let data = {
        type: evt
      }
      this.cmVrSrv.updPerm.next(true)
      this.provSrv.getAvailableMoney(data).subscribe(response => {
        this.type_payments = response['data'];
        this.cmVrSrv.updPerm.next(false)
      }, error => {
        this.cmVrSrv.updPerm.next(false)
        this.toastr.info(error.error.message);
      });
    }
  }

  valorND:any = 0;
  presentarNota(){
    this.valorND = 0;
    this.values.pay = 0;
    this.values.valorNota = 0;
    this.values.idNota = null;
    const dialogRef = this.confirmationDialogService.openDialogMat(LstNotaDebitoComponent, {
      width: '1000px', height: 'auto',
      data: { titulo: "Listado de Nota de Débito"  }

    } );

    dialogRef.afterClosed().subscribe(resultado => {
      if(resultado!=false && resultado!=undefined){
        this.valorND = resultado.total;
        this.values.valorNota = resultado.total;
        this.values.idNota = resultado.id;
        this.values.pay = this.valorND;
      }
      this.payAmountChange();
    });
  }

  payAmountChange() {
    this.values.pending = parseFloat(this.contacts["valor"]) - parseFloat(this.contacts["valor_abono"]);
    this.values.accredited = parseFloat(this.contacts["valor_abono"]);

    this.values.parsePending = this.commonServices.formatNumber(this.values.pending);
    this.values.parseAccredited = this.commonServices.formatNumber(this.values.accredited);

    if (this.values.pay !== null) {
      this.values.pending = parseFloat((this.values.pending - parseFloat(this.values.pay)).toFixed(4));
      this.values.accredited = parseFloat((this.values.accredited + parseFloat(this.values.pay)).toFixed(4));

      this.values.parsePending = this.commonServices.formatNumber(this.values.pending);
      this.values.parseAccredited = this.commonServices.formatNumber(this.values.accredited);
    }

    if(this.values.pay === null || this.values.pay === 0 || (this.values.pay > this.current_pending)){
      this.vmButtons[0].habilitar = true;
    }else{
      this.vmButtons[0].habilitar = false;
    }
  }

}
