import {Component,  Inject, OnInit, ViewChild, Input  } from '@angular/core';
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import "sweetalert2/src/sweetalert2.scss";
import { ToastrService } from "ngx-toastr";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "../../../../../services/commonServices";
import { CommonVarService } from "../../../../../services/common-var.services";
import { ConsultaGService } from "../consulta.service";
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-view-consulta-gasto',
  templateUrl: './view-consulta-gasto.component.html',
  styleUrls: ['./view-consulta-gasto.component.scss']
})
export class ViewConsultaGastoComponent implements OnInit {
	
	@Input() dt: any;
  vmButtons: any = [];
  dataUser: any;
  dataEnvio: any = {
    numSec: "", aplica_a: "", nombreGrupo: "", tipo_pago: "",
    numPedido: "", tipoDocumento: "", forma_pago: "",ruc: "",
    razon_social: "", num_doc_gasto: "", fecha: "", subTotal: "",
    iva: "", total: "", num_cuotas: "", estado: ""
  };

  arrayPedidos: Array < any > = [];
  arrayLiquidaciones: Array < any > = [];
  prueba: Array < any > = [];
  arrayDt: Array < any > = [];
  constructor(private toastr: ToastrService,
		private router: Router,
		public activeModal: NgbActiveModal,
		private commonServices: CommonService,
		private commonVarSrv: CommonVarService,
		private reportesSrv: ConsultaGService,
		private dialogRef: MatDialogRef <ViewConsultaGastoComponent>) { }

    ngOnInit(): void {
      this.vmButtons = [
        { orig: "btnCuenta", paramAccion: "", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false}
      ];

        this.getDataDt();
        this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    }

    metodoGlobal(evento: any) {
      switch (evento.items.boton.texto) {
        case "CERRAR":
          this.dialogRef.close(false);
          break;
      }
    }

    getDataDt(){
      this.dataEnvio.numSec = this.dt.secuencia.toString().padStart(10,'0');
      this.dataEnvio.aplica_a = this.dt.aplica_a;
      this.dataEnvio.nombreGrupo  = this.dt.nombreGrupo;
      this.dataEnvio.tipo_pago = this.dt.tipo_pago;
      this.dataEnvio.tipoDocumento = this.dt.nombre;   
      this.dataEnvio.forma_pago = this.dt.forma_pago;
      this.dataEnvio.razon_social = this.dt.razon_social;
      this.dataEnvio.num_doc_gasto = this.dt.num_doc_gasto;
      this.dataEnvio.fecha = this.dt.fecha;
      this.dataEnvio.subTotal = this.commonServices.formatNumber(this.dt.subTotal);
      this.dataEnvio.iva = this.commonServices.formatNumber(this.dt.iva);
      this.dataEnvio.total = this.commonServices.formatNumber(this.dt.total);
      this.dataEnvio.num_cuotas = this.dt.num_cuotas;
      this.dataEnvio.estado = this.dt.estado;
      this.dataEnvio.ruc = this.dt.ruc;
      this.getDtview();
      if(this.dt.aplica_a == 'Pedido'){
        this.reportesSrv.getPedidosGastosAll().subscribe(res => {
          this.arrayPedidos = res['data'];
          this.dataEnvio.numPedido = this.arrayPedidos.find((e) => e.id == this.dt.fk_ped_liq)['num_doc'].toString().padStart(10,'0');
          this.dataEnvio.numPedido != undefined ? this.dataEnvio.numPedido = this.arrayPedidos.find((e) => e.id == this.dt.fk_ped_liq)['num_doc'].toString().padStart(10,'0')  : this.dataEnvio.numPedido = '';
        }, error => {
          this.toastr.info(error.error.message);
        })
      }else{
        this.reportesSrv.getLiquidacionesGastos().subscribe(res => {
          this.arrayLiquidaciones = res['data'];
          this.dataEnvio.numPedido = this.arrayLiquidaciones.find((e) => e.id == this.dt.fk_ped_liq)['num_doc'].toString().padStart(10,'0');
          this.dataEnvio.numPedido != undefined ? this.dataEnvio.numPedido  = this.arrayLiquidaciones.find((e) => e.id == this.dt.fk_ped_liq)['num_doc'].toString().padStart(10,'0') : this.dataEnvio.numPedido = '';
        }, error => {
          this.toastr.info(error.error.message);
        })
    }


    }

    getDtview() {
      this.reportesSrv.getDtGastoView().subscribe(res => {
        this.arrayDt = res['data'].filter((e) => e.id == this.dt.id);
      }, error => {
        this.toastr.info(error.error.message);
      })
    }
}
