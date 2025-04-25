import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { BandejaTrabajoService } from '../../bandeja-trabajo/bandeja-trabajo.service';  
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import * as myVarGlobals from "../../../../../global";

@Component({
  selector: 'app-reasignar-usuario',
  templateUrl: './reasignar-usuario.component.html',
  styleUrls: ['./reasignar-usuario.component.scss']
})
export class ReasignarUsuarioComponent implements OnInit {

  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  validaciones = new ValidacionesFactory;
  categorias: any = {};
  subCategorias: any = {};

  dataUser: any;
  vmButtons: any;
  ticketEdit: any = { categoria:0, sub_categoria:0};
  needRefresh: boolean = false;
  deshabilitar: boolean = false;
  ticketSegui=[];

  gesTicket: any = {};
  categoriaGuard: any;
  usuariospre: any = [];
  usuario: any;


  
  @Input() module_comp: any;
  @Input() isNew: any;
  @Input() data: any;
  @Input() permissions: any;
  @Input() fTitle: any;
  @Input() ticket: any;

 
  constructor(public activeModal: NgbActiveModal,
      private toastr: ToastrService,
      private commonSrv: CommonService,
      private bandejaTraSrv: BandejaTrabajoService,
      private commonVarSrv: CommonVarService,
  ) {}

  ngOnInit(): void {

    this.vmButtons = [
      {
          orig: "btnReTicketForm",
          paramAccion: "",
          boton: { icon: "fas fa-save", texto: " GUARDAR" },
          permiso: true,
          showtxt: true,
          showimg: true,
          showbadge: false,
          clase: "btn btn-success boton btn-sm",
          habilitar: false,
      },
      {
          orig: "btnReTicketForm",
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

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    this.ticketEdit = {
      fecha: "",
      fk_tramite: 0,
      observacion: "",
      categoria: 0,
      subcategoria: 0,
      estado: 0,
      prioridad: "",
    }

    this.gesTicket = {
      observacion: "",
      estado: 0,
    }

    if(!this.isNew){
    this.ticketEdit = JSON.parse(JSON.stringify(this.data));
    console.log(this.ticketEdit.estado)
    this.deshabilitar=true;
    this.commonVarSrv.bandTrabTicket.next();
  }
  setTimeout(()=> {
    this.validaPermisos();
    this.cargarUsuarios();
  }, 0);

  }

  validaPermisos = () => {
    this.mensajeSppiner = 'Cargando Permisos de Usuario...';
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
   // this.empresLogo = this.dataUser.logoEmpresa;
    
    let params = {
      codigo: myVarGlobals.fRTTickets,
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
        case " GUARDAR":
            this.reasignarTicket();
            break;
        default:
            break;
    }
     
  }
  cargarUsuarios(){
    // console.log('ejecuto');
     this.mensajeSppiner = "Cargando lista de Usuarios...";
     this.lcargando.ctlSpinner(true);
     this.bandejaTraSrv.getUsuariosReasignar({}).subscribe(
       (res)=>{
        // console.log(res['data']);
         res['data'].map((data)=>{
           data['id_flujo_usuarios'] =  0
         })
         
         this.usuariospre = res['data']
         // console.log('Usuarios '+this.usuariospre);
         this.lcargando.ctlSpinner(false);
       }
     )
   }

  reasignarTicket() {

    console.log(this.usuario)
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea reasignar este Ticket a el usuario "+this.usuario.nombre+"?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
      }).then((result) => {
          if (result.isConfirmed) {
              this.mensajeSppiner = "Reasignando Ticket...";
              this.lcargando.ctlSpinner(true);
  
              let data = {
                params: {
                  id_ticket: this.data.id_ticket,
                  usuario_asignado: this.usuario.id_usuario,
                }
              }
  
              this.bandejaTraSrv.reasignarTicket(data).subscribe(
                  (res) => {
                     // console.log(res);
                      if (res["status"] == 1) {
                      this.needRefresh = true;
                      this.lcargando.ctlSpinner(false);
                      Swal.fire({
                          icon: "success",
                          title: "Ticket reasignado con éxito",
                          text: res['message'],
                          showCloseButton: true,
                          confirmButtonText: "Aceptar",
                          confirmButtonColor: '#20A8D8',
                      }).then((result) => {
                        if (result.isConfirmed) {
                          this.needRefresh = true;
                          this.closeModal();
                        }
                      });
                      } else {
                      this.lcargando.ctlSpinner(false);
                      Swal.fire({
                          icon: "error",
                          title: "Error",
                          text: res['message'],
                          showCloseButton: true,
                          confirmButtonText: "Aceptar",
                          confirmButtonColor: '#20A8D8',
                      });
                      }
                  },
                      (error) => {
                          this.lcargando.ctlSpinner(false);
                          this.toastr.info(error.error.message);
                  }
              )
        }
    });
  }

  closeModal() {
    this.commonVarSrv.seguiTicket.next(this.needRefresh);
    this.activeModal.dismiss();
  }
}
