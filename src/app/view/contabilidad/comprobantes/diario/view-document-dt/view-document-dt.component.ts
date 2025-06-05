import { Component, OnInit, Input,ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonService } from "../../../../../services/commonServices";
import { DiarioService } from "../../../comprobantes/diario/diario.service";
import { CommonVarService } from '../../../../../services/common-var.services';
import { CcSpinerProcesarComponent } from '../../../../../config/custom/cc-spiner-procesar.component';
import { Router } from "@angular/router";
import * as moment from "moment";
import * as myVarGlobals from "../../../../../global";
import "sweetalert2/src/sweetalert2.scss";
import Swal from 'sweetalert2';
@Component({
standalone: false,
  selector: 'app-view-document-dt',
  templateUrl: './view-document-dt.component.html',
  styleUrls: ['./view-document-dt.component.scss']
})
export class ViewDocumentDtComponent implements OnInit {
  
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @Input() dt: any;
  @Input() datas: any;
  dataUser: any;
  permisions: any;
  dtView: Array<any> = [];
  valorAsiento:any;
  locality:any;
  vmButtons: any = [];
  empresLogo: any;
  date: Date = new Date();
  fecha = this.date.getDate() + '-' + (this.date.getMonth() + 1) + '-' + this.date.getFullYear();
  hora = this.date.getHours() + ':' + this.date.getMinutes() + ':' + this.date.getSeconds();
  constructor(   public activeModal: NgbActiveModal,
    private router: Router,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private diarioSrv: DiarioService,
    private commonVarSrvice: CommonVarService) {}

  ngOnInit(): void {
    console.log(this.dt)
    setTimeout(() => {
      this.commonVarSrvice.updPerm.next(true);
    }, 50);

    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.vmButtons = [
      { orig: "btnsDTasiento", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false, printSection: "Printsection", imprimir: true},
      { orig: "btnsDTasiento", paramAccion: "", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false}
    ];

    setTimeout(() => {
    this.getPermisions();
    }, 60);
  }


  getPermisions() {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.empresLogo = this.dataUser.logoEmpresa;
    let id_rol = this.dataUser.id_rol;
    let data = {
      codigo: myVarGlobals.fRClienteConsulta,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'][0];
      if (this.permisions.ver == "0") {
        this.toastr.info("Usuario no tiene permiso para ver Detalle Asiento Diario");
        this.vmButtons = [];
        this.commonVarSrvice.updPerm.next(false);
      } else {
        this.getDetalle();
      }
    }, error => {
      this.commonVarSrvice.updPerm.next(false);
      this.toastr.info(error.error.message);
    })
  }

  getDetalle() {
		this.diarioSrv.getViewDtMov().subscribe(res => {
      this.dtView = res["data"].filter((e) => e.fk_cont_mov_cab == this.dt.id);
      this.commonVarSrvice.updPerm.next(false);
		},error=>{
      this.commonVarSrvice.updPerm.next(false);
    });
	}

  metodoGlobal(evento: any) {
		switch (evento.items.boton.texto) {
			case "IMPRIMIR":
        this.savePrint();
      break;
      case "CERRAR":
        this.closeModal();
      break;
		}
	}

  /* actions modals */
  closeModal() {
    this.activeModal.dismiss();
  }

  savePrint() {
		if (this.permisions.imprimir == "0") {
			this.toastr.info("Usuario no tiene Permiso para imprimir");
		} else {
			let data = {
				ip: this.commonServices.getIpAddress(),
				accion: "Registro de Impresón de Detalle Asiento Diario",
				id_controlador: myVarGlobals.fComDiario
			}
			this.diarioSrv.printData(data).subscribe(res => {}, error => {
				this.toastr.info(error.error.mesagge);
			})
		}
	}

  formatNumber(params) {
		this.locality = 'en-EN';
		params = parseFloat(params).toLocaleString(this.locality, {
			minimumFractionDigits: 4
		})
		params = params.replace(/[,.]/g, function (m) {
			return m === ',' ? '.' : ',';
		});
		return params;
	}
}
