import { Component, OnInit, Input, NgZone,ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonService } from "../../../../../services/commonServices";
import { BodegaComprasService } from "../bodega-compras.service";
import { CommonVarService } from '../../../../../services/common-var.services';
import { Router } from "@angular/router";
import moment from "moment";
import * as myVarGlobals from "../../../../../global";
import "sweetalert2/src/sweetalert2.scss";
import { CcSpinerProcesarComponent } from '../../../../../config/custom/cc-spiner-procesar.component';
import Swal from 'sweetalert2';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
standalone: false,
  selector: 'app-view-fac-compra',
  templateUrl: './view-fac-compra.component.html',
  styleUrls: ['./view-fac-compra.component.scss']
})
export class ViewFacCompraComponent implements OnInit {
  
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
   @Input() dts: any = {};
    data:any;
   	vmButtons: any = [];
    permissions:any;
    dataUser:any;
    nameUsersPrint: any;
    dtFaCompra: Array<any> = [];
    arrayDt: Array<any> = [];
    validaDtUser: any = false;
    empresLogo: any;
    locality:any;
    date: Date = new Date();
    fecha = this.date.getDate() + '-' + (this.date.getMonth() + 1) + '-' + this.date.getFullYear();
    hora = this.date.getHours() + ':' + this.date.getMinutes() + ':' + this.date.getSeconds();
  constructor(public activeModal: NgbActiveModal,
    private router: Router,
    private zone: NgZone,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private bodegaRecepcSrv: BodegaComprasService,
    private commonVarSrvice: CommonVarService,private dialogRef: MatDialogRef <ViewFacCompraComponent>) { }

  ngOnInit(): void {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.vmButtons = [
      { orig: "btnsViewFac", paramAccion: "", boton: { icon: "fas fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false,printSection: "PrintSecondContent", imprimir: true},
      { orig: "btnsViewFac", paramAccion: "", boton: { icon: "fas fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false, imprimir: false},
    ];

  setTimeout(() => {
        this.validatePermission();
        }, 10);
  }

/* validation  */
    validatePermission() {
      this.lcargando.ctlSpinner(true);
      let params = {
        codigo: myVarGlobals.fBodegaCompras,
        id_rol: this.dataUser.id_rol,
      };
      this.commonServices.getPermisionsGlobas(params).subscribe(
        (res) => {
          this.permissions = res["data"][0];
          if (this.permissions.ver == "0") {
            this.toastr.info(
              "Usuario no tiene Permiso para ver la Factura de Compra"
            );
            this.vmButtons = [];
            this.dialogRef.close(false);
          } else {
            setTimeout(() => {
            this.getDtCompras();
            }, 10);
          }
        },
      );
    }

  savePrint() {
    let data = {
      ip: this.commonServices.getIpAddress(),
      accion: "Registro de impresion de Bodega-Compra",
      id_controlador: myVarGlobals.fBodegaCompras
    }
    this.bodegaRecepcSrv.printData(data).subscribe(res => {
    }, error => {
      this.toastr.info(error.error.mesagge);
    })
  }

	metodoGlobal(evento: any) {
		switch (evento.items.boton.texto) {
			case "IMPRIMIR":

       if(this.permissions[0].imprimir == "0"){
         this.vmButtons[0].habilitar = true;
         this.toastr.info("Usuario no Puede Imprimir");
       }else{
          this.savePrint();
       }
		  	break;
        case "CERRAR":
          this.dialogRef.close(false);
          break;
		}
	}

  getDtCompras() {
  		this.bodegaRecepcSrv.getDtCompra().subscribe(res => {
        this.validaDtUser = true;
  			this.arrayDt = res['data'];
        let modalDoc = this.arrayDt.filter((e) => e.fk_compras_cab == this.dts.id_compra);
        this.dtFaCompra = modalDoc;
        this.lcargando.ctlSpinner(false);
  		}, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      })
  	}

	formatNumber(params) {
		this.locality = 'en-EN';
		params = parseFloat(params).toLocaleString(this.locality, {
			minimumFractionDigits: 2
		})
		params = params.replace(/[,.]/g, function (m) {
			return m === ',' ? '.' : ',';
		});
		return params;
	}


}
