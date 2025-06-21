import { Component, Input, OnInit, ViewChild} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ConciliacionService } from '../conciliacion.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import * as myVarGlobals from "../../../../../global";

@Component({
standalone: false,
  selector: 'app-detalle-conciliacion',
  templateUrl: './detalle-conciliacion.component.html',
  styleUrls: ['./detalle-conciliacion.component.scss']
})
export class DetalleConciliacionComponent implements OnInit {
  
  @ViewChild(CcSpinerProcesarComponent, { static: false })lcargando: CcSpinerProcesarComponent;
  validaciones = new ValidacionesFactory;
  dataUser: any = {};
  vmButtons: any = {};
  needRefresh: boolean = false;
  datos: any = [];
  conciliacionDetalle: any = [];
  mes: any = '';


  @Input() module_comp: any;
  @Input() data: any;
  @Input() permissions: any;
  @Input() fTitle: any;
 
  constructor(public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private conciliacionSrv: ConciliacionService,
    private commonVarSrv: CommonVarService,
    private modalSrv: NgbModal) { }

  ngOnInit(): void {

    this.vmButtons = [
      {
          orig: "btnDetConc",
          paramAccion: "",
          boton: { icon: "fas fa-chevron-left", texto: " REGRESAR" },
          permiso: true,
          showtxt: true,
          showimg: true,
          showbadge: false,
          clase: "btn btn-danger boton btn-sm",
          habilitar: false,
      }
    ];

    this.datos = JSON.parse(JSON.stringify(this.data));
    console.log(this.datos)
    this.mes = this.convertirMes(this.datos.mes)
    this.datos.cuenta =this.datos?.name_banks+' '+this.datos?.num_cuenta


    setTimeout(()=> {
      this.validaPermisos();
      this.cargarDetallesConciliacion();
    }, 0);
//    {
//     "id_empresa": 1,
//     "id_registro": 42,
//     "anio": 2024,
//     "mes": 4,
//     "isactive": null,
//     "observacion": null,
//     "name_banks": "BANCO CENTRAL",
//     "num_cuenta": "00000222",
//     "id_banks": 7,
//     "cuenta_contable": "1.1.1.06",
//     "fecha_registro": "2024-05-17",
//     "saldo_final": "-11640.74",
//     "estado": "E",
//     "cuenta": "BANCO CENTRAL 00000222"
// }
  }

  validaPermisos = () => {
    (this as any).mensajeSpinner = 'Cargando Permisos de Usuario...';
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
   // this.empresLogo = this.dataUser.logoEmpresa;
    
    let params = {
      codigo: myVarGlobals.fConciliacionBank,
      id_rol: this.dataUser.id_rol,
    };

    this.commonSrv.getPermisionsGlobas(params).subscribe(
      res => {
        this.permissions = res["data"][0];
        if (this.permissions.abrir == "0") {
          this.lcargando.ctlSpinner(false);
          this.vmButtons = [];
          this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle);
        } else {
          this.lcargando.ctlSpinner(false);
        
           
        }
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
          this.closeModal();
          break;
       
    }
  
  }

  cargarDetallesConciliacion(){

    (this as any).mensajeSpinner = "Cargando Conciliación Bancaria...";
    this.lcargando.ctlSpinner(true);
    let data = {
      cuenta: this.datos.cuenta_contable,
      anio: this.datos.anio,
      mes: this.datos.mes,
      id_banco: this.datos.id_banks
    }

    this.conciliacionSrv.getDetallesConciliacion(data).subscribe(res => {

      console.log(res['data']);
      res['data'].forEach(e => {
        Object.assign(e,{conciliado:parseFloat(e.valor)+ parseFloat(e.final)})
      });

      this.conciliacionDetalle = res['data'];
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  closeModal() {
    //this.commonVarSrv.seguiTicket.next(this.needRefresh);
   // this.conciliacionSrv.movimientos$.emit(this.needRefresh)
    this.activeModal.dismiss();
  }

  convertirMes(evento){

    let mes_letter = "" 
    switch (evento) {
      case 1: {
        mes_letter = "ENERO";
        break;
      }
      case 2: {
        mes_letter = "FEBRERO";
        break;
      }
      case 3: {
        mes_letter = "MARZO";
        break;
      }
      case 4: {
        mes_letter = "ABRIL";
        break;
      }
      case 5: {
        mes_letter = "MAYO";
        break;
      }
      case 6: {
        mes_letter = "JUNIO";
        break;
      }
      case 7: {
        mes_letter = "JULIO";
        break;
      }
      case 8: {
        mes_letter = "AGOSTO";
        break;
      }
      case 9: {
        mes_letter = "SEPTIEMBRE";
        break;
      }
      case 10: {
        mes_letter = "OCTUBRE";
        break;
      }
      case 11: {
        mes_letter = "NOBIEMBRE";
        break;
      }
      case 12: {
        mes_letter = "DICIEMBRE";
        break;
      }
    }
    return mes_letter;
  }

}
