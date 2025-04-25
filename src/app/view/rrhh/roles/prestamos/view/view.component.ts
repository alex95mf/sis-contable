import { Component, OnInit, Input, NgZone, ViewChild  } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonService } from "../../../../../services/commonServices";
import { prestamosService } from "../prestamos.service";
import { CommonVarService } from '../../../../../services/common-var.services';
import { Router } from "@angular/router";
import * as moment from "moment";
import * as myVarGlobals from "../../../../../global";
import 'sweetalert2/src/sweetalert2.scss';  
import { CcSpinerProcesarComponent } from '../../../../../config/custom/cc-spiner-procesar.component';
const Swal = require('sweetalert2');

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})

export class ViewComponent implements OnInit {
  @Input() dt: any;
  @Input() data: any;
  viewData:any;
  toDatePicker: Date = new Date();
  permissions: any;
  processing: any = false;
  processingtwo: any = false;
  botonDonwload: any = false;
  dataUser: any;
  detPrestamo: any;
  fecha:any;
 empleado:any;
 id_empleado:any;
 tipoPago:any;
 cuotas:any;
 monto:any;
 interes:any;
 montoTotal:any;
 tipo:any;
 montoCuotas:any;
 porcentaje:any;
 empresLogo: any;

 vmButtons:any = [];
 mensajeSppiner: string = "Cargando...";
@ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

   /*date*/
   hoy: Date = new Date;
   fechaPrint = this.hoy.getDate() + '-' + (this.hoy.getMonth() + 1) + '-' + this.hoy.getFullYear();
   hora = this.hoy.getHours() + ':' + this.hoy.getMinutes() + ':' + this.hoy.getSeconds();

  constructor(private toastr: ToastrService,
    private router: Router,
    private prestamosSrvc: prestamosService,
    public activeModal: NgbActiveModal,
    private commonServices: CommonService,
    private commonVarSrv: CommonVarService) { }

  ngOnInit(): void {

    this.vmButtons = [
			{ orig: "btnVsPrs", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false, printSection: "print-section", imprimir: true},
      { orig: "btnVsPrs", paramAccion: "1", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false}
    ];


    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.empresLogo = this.dataUser.logoEmpresa;
    (this.data.permisoDown == '0') ? this.botonDonwload = false : this.botonDonwload = true;
    this.viewData = this.dt;
    this.fecha =  this.dt.fecha_inicio;
    this.empleado =  this.dt.nombres + this.dt.apellidos;
    this.id_empleado = this.dt.id_empleado;
    this.tipo = this.dt.tipo;
    this.tipoPago = this.dt.tipo_pago;
    this.cuotas  = this.dt.cuotas;
    this.monto = this.dt.monto;
    this.interes   = this.dt.interes;
    this.porcentaje   = this.dt.porcentaje;
    this.montoTotal = this.dt.monto_total;  
    this.montoCuotas  = this.dt.cuotas_paga;
    this.processing = true;
    setTimeout(() => {
      if(this.data.permisoDown == '0'){
        this.vmButtons[0].habilitar = true;
      }else{
        this.vmButtons[0].habilitar = false;
      }
			this.lcargando.ctlSpinner(true);
		}, 10);

    this.validatePermission();
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

  validatePermission() {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    let params = {
      codigo: myVarGlobals.fPrestamos,
      id_rol: this.dataUser.id_rol,
    };
    this.commonServices.getPermisionsGlobas(params).subscribe((res) => {
        this.permissions = res["data"][0];
        if (this.permissions.ver == "0") {
          this.lcargando.ctlSpinner(false);
          this.toastr.info("Usuario no tiene Permiso para ver el formulario de Prestamo");  
          this.closeModal();
        } else {
          this.prestamoIdDT();
        }
      },error=>{
        this.lcargando.ctlSpinner(false);
      });
  }

  prestamoIdDT(){
    this.prestamosSrvc.getDetPrestamo({ id_prestamo: this.viewData.id_prestamo }).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.detPrestamo = res['data'];
      this.fechaEstado();
      this.processing = true;
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.processing = true;
    })
  }

  fechaEstado(){
    for (let i = 0; i < this.detPrestamo.length; i++) {
      this.detPrestamo[i]["fecha_vencimiento"];
      let fechaActual = moment(this.toDatePicker).format("YYYY-MM-DD")
      if(fechaActual  > this.detPrestamo[i]["fecha_vencimiento"] && this.detPrestamo[i]["estado"] != 'Pagado' ){
        this.detPrestamo[i]["estado"] = 'Vencido';
      }else if (fechaActual  < this.detPrestamo[i]["fecha_vencimiento"]){
        this.detPrestamo[i]["estado"] = 'Pendiente';
      }
    }
  }
   /* actions modals */
 closeModal() {
  this.activeModal.dismiss();
}

savePrint() {
  let data = {
    ip: this.commonServices.getIpAddress(),
    accion: "Registro de impresión de del prestamo" + this.empleado,
    id_controlador: myVarGlobals.fPrestamos
  }
  this.prestamosSrvc.printData(data).subscribe(res => {
  }, error => {
    this.toastr.info(error.error.mesagge);
  })
}


}
