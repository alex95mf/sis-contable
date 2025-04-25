import { Component, OnInit, Input } from '@angular/core';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../../services/commonServices';
import { CommonVarService } from '../../../../../services/common-var.services';
import { BodegaDespachoService } from '../../bodega-despacho/bodega-despacho.service';
import * as myVarGlobals from '../../../../../global';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
//import { ThrowStmt } from '@angular/compiler';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-confirm-invoice',
  templateUrl: './confirm-invoice.component.html',
  styleUrls: ['./confirm-invoice.component.scss']
})
export class ConfirmInvoiceComponent implements OnInit {
  @Input() invoice: any;
  @Input() params: any;
  @Input() form: any;
  /* @Input() nombre: any; */
  processing: any = false;
  detInvocice: any = [];
  detInvociceAux: any = [];
  flag: any = false;
  validateCheckAll: any = false;
  flagDispached: any = false;
  dataUser: any;
  nombre: any;
  vmButtons: any = [];

  constructor(
    private bodegaService: BodegaDespachoService,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private commonVarService: CommonVarService,
    private dialogRef: MatDialogRef<ConfirmInvoiceComponent>
  ) { }

  ngOnInit(): void {

    setTimeout(() => {
      this.commonVarService.updPerm.next(true);
    }, 50);

    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.vmButtons = [
      { orig: "btnDespachoData", paramAccion: "", boton: { icon: "", texto: "ENTREGAR TODO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false, imprimir: false },
      { orig: "btnDespachoData", paramAccion: "", boton: { icon: "fas fa-check", texto: "CONFIRMAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false, imprimir: false },
      { orig: "btnDespachoData", paramAccion: "", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false },
    ];

    setTimeout(() => {
      this.nombre = this.dataUser.nombre;
      this.bodegaService.getDetFactura({ id: this.invoice.id_venta }).subscribe(res => {
        this.commonVarService.updPerm.next(false);
        this.detInvocice = res['data'];
        this.detInvocice.forEach(element => {
          element['cantidadEntregada'] = 0;
          if (element['stock'] == 0) {
            this.flag = true;
            element['activatedStock'] = true;
            this.vmButtons[0].habilitar = true;
            this.vmButtons[1].habilitar = true;
          } else {
            element['activatedStock'] = false;
            this.vmButtons[0].habilitar = false;
            this.vmButtons[1].habilitar = false;
          }
        });
        localStorage.setItem('dispachedProduct', JSON.stringify(this.detInvocice));
        this.processing = true;
      }, error => {
        this.commonVarService.updPerm.next(false);
        this.processing = true;
      })
    }, 10);
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "CERRAR":
        this.dialogRef.close(false);
        localStorage.removeItem('dispachedProduct');
        break;
      case "ENTREGAR TODO":
        this.dispachedAll();
        break;
      case "CONFIRMAR":
        this.validateDispached();
        break;
    }
  }

  closeModal() {
    localStorage.removeItem('dispachedProduct');
    this.activeModal.dismiss();
  }

  validateCantidadPendiente(post) {
    this.detInvocice[post]['cant_pendiente'] = this.detInvocice[post]['pendiente_aux'] - this.detInvocice[post]['cantidadEntregada'];
  }

  async validateDispached() {
    if (this.params.perSave == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      let resp = await this.validateDataGlobal().then(respuesta => {
        if (respuesta) {
          this.confirmSave("Seguro desea guardar el despacho de la factura?", "SAVE_DISPACHED");
        }
      })
    }
  }

  validateDataGlobal() {
    let flag = false;
    return new Promise((resolve, reject) => {
      for (let index = 0; index < this.detInvocice.length; index++) {
        if ((this.detInvocice[index].cantidadEntregada == 0 || this.detInvocice[index].cantidadEntregada == null)
          && !this.detInvocice[index]['activatedStock']) {
          this.toastr.info("Revise la cantidad entregada de los productos, no puede estar vacio o ser 0");
          flag = true; break;
        } else if (this.detInvocice[index].cantidadEntregada > this.detInvocice[index].pendiente_aux) {
          this.toastr.info("Revise la cantidad entregada, no puede ser mayor a la cantidad pendiente");
          flag = true; break;
        } else if (this.detInvocice[index].cantidadEntregada > this.detInvocice[index].stock) {
          this.toastr.info("Revise la cantidad entregada, no puede ser mayor al stock Actual");
          flag = true; break;
        }
      }
      (!flag) ? resolve(true) : resolve(false);
    });
  }

  async confirmSave(message, action) {
    Swal.fire({
      title: "Atención!!",
      text: message,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#DC3545',
      confirmButtonColor: '#13A1EA',
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.value) {
        if (action == "SAVE_DISPACHED") {
          this.saveDispached();
        }
      }
    })
  }

  saveDispached() {
    this.commonVarService.updPerm.next(true);
    let data = {
      id_venta: this.invoice.id_venta,
      info: this.detInvocice,
      num_doc: this.invoice.num_doc,
      ip: this.commonServices.getIpAddress(),
      accion: `Despacho de factura # ${this.invoice.num_doc} por el usuario ${this.nombre}`,
      id_controlador: this.form
    }
    this.bodegaService.saveDispached(data).subscribe(res => {
      this.commonVarService.updPerm.next(false);
      this.commonVarService.listenDispached.next();
      this.toastr.success(res['message']);
      this.dialogRef.close(false);
      this.closeModal();
    }, error => {
      this.commonVarService.updPerm.next(false);
      this.toastr.info(error.error.message);
    })
  }

  dispachedAll() {
    this.validateCheckAll = !this.validateCheckAll;
    if (this.validateCheckAll) {
      this.detInvocice = JSON.parse(localStorage.getItem('dispachedProduct'));
      this.flagDispached = true;
      Object.keys(this.detInvocice).forEach(key => {
        if (this.detInvocice[key]['stock'] == 0) {
          this.detInvocice[key]['cantidadEntregada'] = 0;
        } else {
          if (this.detInvocice[key]['stock'] > this.detInvocice[key]['cant_pendiente']) {
            this.detInvocice[key]['cantidadEntregada'] = this.detInvocice[key]['cant_pendiente'];
          } else {
            this.detInvocice[key]['cantidadEntregada'] = this.detInvocice[key]['stock'];
          }
        }
        this.detInvocice[key]['cant_pendiente'] = this.detInvocice[key]['pendiente_aux'] - this.detInvocice[key]['cantidadEntregada'];
      })
    } else {
      this.flagDispached = false;
      this.detInvocice = JSON.parse(localStorage.getItem('dispachedProduct'))
    }
  }

}
