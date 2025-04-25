import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import { ModalAnexosComponent } from '../../bandeja-trabajo/seguimiento-form/modal-anexos/modal-anexos.component';
import { TramitesService } from '../../tramites.service';
import * as moment from 'moment';
import * as myVarGlobals from 'src/app/global';
import { Socket } from '../../../../../services/socket.service';
@Component({
  selector: 'app-ticket-form',
  templateUrl: './ticket-form.component.html',
  styleUrls: ['./ticket-form.component.scss']
})
export class TicketFormComponent implements OnInit {

  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  validaciones = new ValidacionesFactory;
  tareas: any = {};
  subCategorias: any = {};
  ticketSegui = [];
  
  tarea: any = {};
  usuario: any = {};
  tramite: any = {};
  flujoPasos: any = {};
  demorado: any;
  usuarioDemorado: any;

  
  dataUser: any;
  vmButtons: any;
  ticketNew: any = { fk_tipo_flujo: 0, tipo: 0 };
  needRefresh: boolean = false;
  deshabilitar: boolean = false;
  usuariospre: any = []
  width: any;

  titulo: any = ''
  contribuyente: any = []

  claseDemorado= false
  claseUsuDemorado = false


  @Input() module_comp: any;
  @Input() isNew: any;
  @Input() data: any;
  @Input() permissions: any;
  @Input() fTitle: any;
  // @Input() ticket: any;


  /*estadoList = [
    {value: "P",label: "PENDIENTE"},
    {value: "G",label: "GESTION"},
    {value: "C",label: "CERRADO"}
  ]*/

  prioridadList = [
    { value: "A", label: "ALTA" },
    { value: "M", label: "MEDIA" },
    { value: "B", label: "BAJA" },

  ]




  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private ticketSrv: TramitesService,
    private commonVarSrv: CommonVarService,
    private modal: NgbModal,
    private socket: Socket,
  ) { }

  ngOnInit(): void {

    this.vmButtons = [
      {
        orig: "btnTicketForm",
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
        orig: "btnTicketForm",
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

    this.ticketNew = {
      fecha: "",
      id_usuario: 0,
      observacion: "",
      tipo: 0,
      estado: 0,
      fk_tipo_flujo: 0,
      fk_contribuyente: 0,
      prioridad: 0,
      pregunta:"",
      respuesta:"",
      usuario: {
        nombre: ""
      }
    }
    this.titulo = 'Seguimiento del Trámite'
    if (!this.isNew) {

      // this.ticketNew = JSON.parse(JSON.stringify(this.data));
      // console.log(' aquiiii ' + this.data);
      // this.deshabilitar = true;
      // console.log(this.data);
      this.ticketNew = JSON.parse(JSON.stringify(this.data));
      this.contribuyente = this.ticketNew.contribuyente[0]
      this.titulo = this.titulo +' No. '+ this.ticketNew.nro_tramite
      console.log(this.ticketNew)
     
      // this.tarea = JSON.parse(JSON.stringify(this.data['tareas']));
      // this.tramite = JSON.parse(JSON.stringify(this.data['tramites']));
      this.usuario = JSON.parse(JSON.stringify(this.data['usuario']));
      this.flujoPasos = JSON.parse(JSON.stringify(this.data['flujo_pasos']));
      console.log(this.flujoPasos)
      // console.log(' tramites ' + this.ticketNew.tramites.id_tramite);
      this.deshabilitar = true;
      this.avanceTramite();
    }

    // this.ticketSrv.seguimientoTicket(this.data, this.data['id_ticket']).subscribe(
    //   (res) => {
    //     if (res["status"] == 1) {
    //       res['data'].forEach(e => {
    //         Object.assign(e, { fecha: e.fecha, observacion: e.observacion });
    //       })
    //       this.ticketSegui = JSON.parse(JSON.stringify(res['data']));
    //     }
    //   },
    //   (error) => {
    //     this.toastr.info(error.error.message);
    //   }
    // )

    setTimeout(()=>{
      this.getTareas();
      // this.getUsuarios();
      this.cargarSeguimiento();
    },50)
    

    //setTimeout(()=> {
    //  this.getCatalogoCategoria();
    //  this.getCatalogoSubCategoria();
    //}, 0);

  }
  verTicket(dt) {
    this.commonVarSrv.mesaAyuTicket.next(dt);
    this.closeModal();
  }
  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.closeModal();
        break;
      case " GUARDAR":
        this.validaTicket();
        break;
    }
  }

  avanceTramite(){
     console.log(this.flujoPasos.length)
     let nroPasos = this.flujoPasos.length
     let porcentaje = 100 / nroPasos
     let pasosCerrados = []
     let ultimoCerrado = []
     let clase="";
     
     this.width=porcentaje;
     
     
    
    this.flujoPasos.forEach((e: any , index) => {
      this.ticketSegui.map(s => {
        
        if(e.nro_paso == s.nro_paso && s.estado_seguimiento=='C' ){
                pasosCerrados.push(s)
                ultimoCerrado=  pasosCerrados[pasosCerrados.length-1]
                clase= 'text-success'
        }else{
          clase= 'text-primary'
        }
        
      });
      
      
        Object.assign(e, { nro_paso: e.nro_paso, descripcion: e.descripcion, porcentaje: porcentaje, clase:'text-success' });
      });
      // this.flujoPasos.forEach(e => {
      //   this.ticketSegui.map(s => {
      //     if(e.nro_paso == s.nro_paso && s.estado_seguimiento=='C' ){
      //       pasosCerrados.push(s)
      //     }
      //     Object.assign(e, { fecha: s.fecha, observacion: e.observacion });
      //   });
               
  
    console.log(pasosCerrados)
  }

  cargarSeguimiento(){
    this.mensajeSppiner = "Cargando Seguimiento...";
    // console.log("hola")
    
    this.lcargando.ctlSpinner(true);
    console.log(this.data);
    let data = {
      fk_tramite: this.data['id_tramite']
    }
    this.ticketSrv.seguimientoTicket(data, this.data['id_tramite']).subscribe(
      (res) => {
        console.log(res);
        if (res["status"] == 1) {
          res['data'].forEach(e => {
            Object.assign(e, { fecha: e.fecha, observacion: e.observacion });
            console.log(e)
          })
          this.ticketSegui = JSON.parse(JSON.stringify(res['data']));
          this.ticketSegui.forEach((e: any) => {
            if(e.flujo_pasos != null && e.flujo_pasos.dias != null){
            if(e.estado_seguimiento=='P'){
              console.log('Pendiente')
              if (e.fecha) {
                let dias_disponibles = parseInt(e.flujo_pasos.dias)
                let fecha_creacion = moment(e.fecha)
                let today = moment()
                let fecha_vencida = moment(e.fecha).add(dias_disponibles + 1, 'days')
              /*  console.log('fecha en que vence '+moment(fecha_vencida).format('YYYY/MM/DD'))
                console.log('fecha en que se creo '+moment(moment(e.fecha)).format('YYYY/MM/DD'))
                console.log('diferencia de dias ' +moment(Math.abs(moment().diff(fecha_vencida, 'days'))).format('YYYY/MM/DD'))*/
                if(fecha_vencida<=today){
                  Object.assign(e, {fecha_v:fecha_vencida, vencimiento: 'día(s) vencido(s)', dias: Math.abs(today.diff(moment(e.fecha).add(dias_disponibles, 'days'), 'days')),dias_config: dias_disponibles, class: 'text-danger'})
                }else if(fecha_vencida==today){
                  Object.assign(e, {fecha_v:fecha_vencida, vencimiento: 'día(s) para gestionar', dias: Math.abs(today.diff(fecha_vencida, 'days')),dias_config: dias_disponibles, class: 'text-warning' })
                }else if(fecha_vencida > today && today.diff(fecha_vencida, 'days') != 0){
                  Object.assign(e, { fecha_v:fecha_vencida,vencimiento: 'día(s) para gestionar', dias: Math.abs(today.diff(fecha_vencida, 'days')),dias_config: dias_disponibles, class: 'text-warning' })
                }else if(fecha_vencida > today && today.diff(fecha_vencida, 'days') == 0){
                  Object.assign(e, { fecha_v:fecha_vencida,vencimiento: 'Tiene '+dias_disponibles+' días(s) para gestionar', dias:'',dias_config: dias_disponibles, class: 'text-warning' })
                }
              }
            }else{
              console.log('diferente de Pendiente')
              if (e.updated_at) {
                let dias_disponibles = parseInt(e.flujo_pasos.dias)
                let fecha_creacion = moment(e.fecha)
                let today = moment(e.updated_at)
                let fecha_vencida = fecha_creacion.add(dias_disponibles, 'days')
  
                if(fecha_vencida<=today){
                  Object.assign(e, {fecha_v:fecha_vencida, vencimiento: 'Se gestionó en '+Math.abs(today.diff(fecha_vencida, 'days'))+' día(s)', dias: '',dias_config: dias_disponibles, class: 'text-danger'})
                }else if(fecha_vencida==today){
                  Object.assign(e, {fecha_v:fecha_vencida, vencimiento: 'día(s) para gestionar', dias: Math.abs(today.diff(fecha_vencida, 'days')),dias_config: dias_disponibles, class: 'text-warning'})
                }else if(fecha_vencida > today && today.diff(fecha_vencida, 'days') != 0){
                  Object.assign(e, { fecha_v:fecha_vencida,vencimiento: 'Se gestionó en '+Math.abs(today.diff(fecha_vencida, 'days'))+' día(s)', dias: '',dias_config: dias_disponibles, class: 'text-success' })
                  
                  // if (e.id_tramite_seguimiento==89){
                  //   console.log('fecha en que vence '+moment(fecha_vencida).format('YYYY/MM/DD'))
                  //   console.log('fecha en que se creo '+moment(moment(e.updated_at)).format('YYYY/MM/DD'))
                  //   console.log(Object.assign(e, { fecha_v:fecha_vencida,vencimiento: 'día(s) para gestionar', dias: Math.abs(today.diff(fecha_vencida, 'days')),dias_config: dias_disponibles, class: 'text-success' })
                  //   )
                  // }
  
                }else if(fecha_vencida > today && today.diff(fecha_vencida, 'days') == 0){
                  Object.assign(e, { fecha_v:fecha_vencida,vencimiento: 'Se gestionó en '+dias_disponibles+' días(s)', dias:'',dias_config: dias_disponibles, class: 'text-success'})
                }
              }
            }
          }else if(e.flujo_pasos != null && e.flujo_pasos.dias == null || e.flujo_pasos.dias == 0){
            if(e.estado_seguimiento=='P'){
              console.log('Pendiente')
              Object.assign(e, {fecha_v:'', vencimiento: 'Pendiente por gestión',dias_config: '', class: 'text-primary' })
              // if (e.fecha) {
              //   let dias_disponibles = 0
              //   let fecha_creacion = moment(e.fecha)
              //   let today = moment()
              //   let fecha_vencida = moment(e.fecha).add(dias_disponibles + 1, 'days')
             
              //   if(fecha_vencida<=today){
              //     Object.assign(e, {fecha_v:fecha_vencida, vencimiento: 'día(s) vencido(s)', dias: Math.abs(today.diff(moment(e.fecha).add(dias_disponibles, 'days'), 'days')),dias_config: dias_disponibles, class: 'text-danger'})
              //   }else if(fecha_vencida==today){
              //     Object.assign(e, {fecha_v:fecha_vencida, vencimiento: 'día(s) para gestionar', dias: Math.abs(today.diff(fecha_vencida, 'days')),dias_config: dias_disponibles, class: 'text-warning' })
              //   }else if(fecha_vencida > today && today.diff(fecha_vencida, 'days') != 0){
              //     Object.assign(e, { fecha_v:fecha_vencida,vencimiento: 'día(s) para gestionar', dias: Math.abs(today.diff(fecha_vencida, 'days')),dias_config: dias_disponibles, class: 'text-warning' })
              //   }else if(fecha_vencida > today && today.diff(fecha_vencida, 'days') == 0){
              //     Object.assign(e, { fecha_v:fecha_vencida,vencimiento: 'Tiene '+dias_disponibles+' días(s) para gestionar', dias:'',dias_config: dias_disponibles, class: 'text-warning' })
              //   }
              // }
            }else if(e.estado_seguimiento=='G'){
              console.log('gestion')
              Object.assign(e, {fecha_v:'', vencimiento: 'En gestión',dias_config: '',dias:'', class: 'text-warning' })

              // if (e.updated_at) {
              //   let dias_disponibles = 0 
              //   let fecha_creacion = moment(e.fecha)
              //   let today = moment(e.updated_at)
              //   let fecha_vencida = fecha_creacion.add(dias_disponibles, 'days')
  
              //   if(fecha_vencida<=today){
              //     Object.assign(e, {fecha_v:fecha_vencida, vencimiento: 'Se gestionó en '+Math.abs(today.diff(fecha_vencida, 'days'))+' día(s)', dias: '',dias_config: dias_disponibles, class: 'text-danger'})
              //   }else if(fecha_vencida==today){
              //     Object.assign(e, {fecha_v:fecha_vencida, vencimiento: 'día(s) para gestionar', dias: Math.abs(today.diff(fecha_vencida, 'days')),dias_config: dias_disponibles, class: 'text-warning'})
              //   }else if(fecha_vencida > today && today.diff(fecha_vencida, 'days') != 0){
              //     Object.assign(e, { fecha_v:fecha_vencida,vencimiento: 'Se gestionó en '+Math.abs(today.diff(fecha_vencida, 'days'))+' día(s)', dias: '',dias_config: dias_disponibles, class: 'text-success' })
  
              //   }else if(fecha_vencida > today && today.diff(fecha_vencida, 'days') == 0){
              //     Object.assign(e, { fecha_v:fecha_vencida,vencimiento: 'Se gestionó en '+dias_disponibles+' días(s)', dias:'',dias_config: dias_disponibles, class: 'text-success'})
              //   }
              // }
            }else if(e.estado_seguimiento=='C'){
              Object.assign(e, {fecha_v:'', vencimiento: 'Cerrada la gestion',dias_config: '',dias:'', class: 'text-success' })

            }
          }
            
          })
         
          console.log(this.ticketSegui[this.ticketSegui.length-1].class); 
          console.log(this.ticketSegui); 
          this.demorado=this.ticketSegui[this.ticketSegui.length-1].class;
          if(this.demorado == 'text-danger'){
            this.claseDemorado = true
          }
          this.usuarioDemorado=this.ticketSegui[this.ticketSegui.length-1].usuario_atiende.nombre;
          this.lcargando.ctlSpinner(false);
        }
      },
      (error) => {
        this.toastr.info(error.error.message);
        this.lcargando.ctlSpinner(false);
      }
    )
  }


  async validaTicket() {
    if (this.isNew && this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos para crear nuevos Tickets");

    } else if (!this.isNew && this.permissions.editar == "0") {
      this.toastr.warning("No tiene permisos para verTickets.", this.fTitle);
    } else {
      let resp = await this.validaDataGlobal().then((respuesta) => {

        if (respuesta) {
          if (this.isNew) {
            this.crearTicket();
          } else {
            //this.editTasasVarias();
          }
        }
      });
    }
  }

  getTareas() {
    this.mensajeSppiner = "Cargando lista de Tareas...";
    this.lcargando.ctlSpinner(true);

    this.ticketSrv.getTareasALl({}).subscribe(

      (res) => {

        this.tareas = res["data"];
        console.log(this.tareas);
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }


  // getUsuarios() {
  //   // console.log('Aquiiii '+evento);
  //   this.subCategorias = 0;
  //   this.mensajeSppiner = "Cargando lista de Usuarios...";
  //   this.lcargando.ctlSpinner(true);
  //   this.ticketSrv.getUsuarios({}).subscribe(
  //     (res) => {
  //       console.log(res['data']);
  //       res['data'].map((data) => {
  //         data['id_flujo_usuarios'] = 0
  //       })

  //       this.usuariospre = res['data']
  //       console.log(this.usuariospre);
  //       this.lcargando.ctlSpinner(false);
  //     }
  //   )
  // }

  validaDataGlobal() {
    let flag = false;
    return new Promise((resolve, reject) => {

      if (
        this.ticketNew.tipo == 0 ||
        this.ticketNew.tipo == undefined
      ) {
        this.toastr.info("El campo tipo de tramite no puede ser vacío");
        flag = true;
      }
      else if (
        this.ticketNew.fk_tipo_flujo == 0 ||
        this.ticketNew.fk_tipo_flujo == undefined
      ) {
        this.toastr.info("El campo tramite no puede ser vacío");
        flag = true;
      } else if (
        this.ticketNew.observacion == "" ||
        this.ticketNew.observacion == undefined
      ) {
        this.toastr.info("El campo Observación no puede ser vacío");
        flag = true;
      }
      else if (
        this.ticketNew.prioridad == 0 ||
        this.ticketNew.prioridad == undefined
      ) {
        this.toastr.info("El campo Prioridad no puede ser vacío");
        flag = true;
      }
      else if (
        this.ticketNew.fk_contribuyente == 0 ||
        this.ticketNew.fk_contribuyente == undefined
      ) {
        this.toastr.info("El campo Prioridad no puede ser vacío");
        flag = true;
      }

      !flag ? resolve(true) : resolve(false);
    })
  }


  crearTicket() {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea crear un nuevo Ticket?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        this.mensajeSppiner = "Guardando Ticket...";
        this.lcargando.ctlSpinner(true);
        console.log(this.dataUser);
        this.ticketNew['id_usuario'] = this.dataUser['id_usuario'];
        this.ticketNew['estado'] = 'P'

     
        
        console.log(this.ticketNew);
        this.ticketSrv.createTicket(this.ticketNew).subscribe(
          (res) => {
            console.log(res);
            if (res["status"] == 1) {
              this.needRefresh = true;
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "success",
                title: "Ticket Creado",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.closeModal();
                  this.commonVarSrv.mesaAyuTicket.next(res['data']);
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
            console.log(error);
          }
        )
      }
    });
  }

  showTicket() {
    console.log('ver ticket');
  }

  closeModal() {
    
    this.activeModal.dismiss();
  }
  verAnexos(data: any){
   
    const modalInvoice = this.modal.open(ModalAnexosComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fRTGesTramites;
    modalInvoice.componentInstance.data = data;
    modalInvoice.componentInstance.permissions = this.permissions;
}

}
