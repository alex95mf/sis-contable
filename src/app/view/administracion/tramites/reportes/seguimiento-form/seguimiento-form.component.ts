import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { TramitesService } from '../../tramites.service';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import { ModalAnexosComponent } from './modal-anexos/modal-anexos.component';
import * as moment from 'moment';
import * as myVarGlobals from 'src/app/global';

@Component({
standalone: false,
  selector: 'app-seguimiento-form',
  templateUrl: './seguimiento-form.component.html',
  styleUrls: ['./seguimiento-form.component.scss']
})
export class SeguimientoFormComponent implements OnInit {
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  validaciones = new ValidacionesFactory;

  dataUser: any;
  vmButtons: any;
  ticketEdit: any = {};
  ticketSegui = [];
  tarea: any = {};
  usuario: any = {};
  tramite: any = {};
  flujoPasos: any = {};
  flujoPasosDos:any = {};
  needRefresh: boolean = false;
  deshabilitar: boolean = false;
  gesTicket: any = {};
  demorado: any;
  usuarioDemorado: any;
  width: any;
  siguiente_paso: any = ''
  titulo: any = ''

  siguiente_paso_si:any = ''
  siguiente_paso_no:any = ''

  @Input() module_comp: any;
  @Input() isNew: any;
  @Input() data: any;
  @Input() permissions: any;
  @Input() fTitle: any;
  @Input() ticket: any;

  estadoList = [
    { value: "P", label: "PENDIENTE" },
    { value: "G", label: "GESTION" },
    { value: "C", label: "CERRADO" }
  ]
  prioridadList = [
    {value: "A",label: "ALTA"},
    {value: "M",label: "MEDIA"},
    {value: "B",label: "BAJA"},
    
  ]

  fecha_maxima: any
  vencimientoT: any
  diasT: any
  classT:any
  dias_trans: any
  constructor(public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private bandejaTraSrv: TramitesService,
    private commonVarSrv: CommonVarService,
    private modal: NgbModal) {
  }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnSeguimientoTicketForm",
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
      observacion: "",
      nro_paso: 0,
      siguiente_paso: 0,
      pregunta:"",
      respuesta:"",
      tramites: {
        prioridad: "",
        fecha: undefined,
        observacion: "",
        tipo: "",
      },
      usuario: {
        nombre: ""
      },
      tareas: {
        nombre: ""
      },
      estado: 0,
      prioridad: "",
      fk_tramite: "",
    }
    this.gesTicket = {
      observacion: "",
      estado: 0,
    }
    this.titulo = 'Seguimiento del Trámite'
    if (!this.isNew) {

      this.ticketEdit = JSON.parse(JSON.stringify(this.data));
      this.tarea = JSON.parse(JSON.stringify(this.data['tareas']));
      this.tramite = JSON.parse(JSON.stringify(this.data['tramites']));
      this.usuario = JSON.parse(JSON.stringify(this.data['usuario']));
      this.flujoPasos = JSON.parse(JSON.stringify(this.data['flujo_pasos']));
      this.flujoPasosDos = JSON.parse(JSON.stringify(this.data['flujo_pasos_dos']));
      console.log(this.data);
      this.deshabilitar = true;
      this.demorado = this.ticketEdit.class;
      this.titulo = this.titulo +' No. '+ this.tramite.nro_tramite
      if(this.flujoPasosDos.length > 0){
        let pasoSigFilter = this.flujoPasosDos.filter(e => e.nro_paso == this.ticketEdit?.siguiente_paso)[0];
        let pasoSigSiFilter = this.flujoPasosDos.filter(e => e.nro_paso == this.ticketEdit?.siguiente_paso_si)[0];
        let pasoSigNoFilter = this.flujoPasosDos.filter(e => e.nro_paso == this.ticketEdit?.siguiente_paso_no)[0];
        // console.log(pasoSigFilter?.descripcion)
         this.siguiente_paso = pasoSigFilter?.descripcion
         this.siguiente_paso_si = pasoSigSiFilter?.descripcion
         this.siguiente_paso_no = pasoSigNoFilter?.descripcion
       }

      
    let today = moment()//hoy
    let fecha = new Date(this.tramite.fecha); //fecha de creacion del tramite
    let diasConf = parseInt(this.tarea.dias_totales); // Dias totales configurados
    fecha.setDate(fecha.getDate() + diasConf); // Sumamos los dias totales a la fecha
    let fechaM = moment(fecha).format('YYYY-MM-DD') //Formateamos la fecha

    let dias_trascurridos =  Math.abs(today.diff(moment(this.tramite.fecha), 'days'))
    let dias_vencidos = moment(fechaM).diff(moment(fecha), 'days')
    let dias_disponibles = parseInt(this.tarea?.dias_totales)
    this.dias_trans = dias_trascurridos

    this.fecha_maxima = fechaM

   // CALCULO DE EL TIEMPO TRASCURRIDO DESDE EL INICIO DEL TRAMITE
   if(this.tarea != null && this.tarea?.dias_totales != null){
     let today = moment()
     let fecha_vencida = moment(fechaM).add( 1, 'days')
     if(fecha_vencida<=today){
       this.vencimientoT= 'día(s) transcurrido(s)';
       this.diasT= Math.abs(dias_vencidos); 
       this.classT = 'text-danger';
     }else if(fecha_vencida==today){
      this.vencimientoT= 'día(s) para gestionar';
      this.diasT= Math.abs(today.diff(fecha_vencida, 'days')); 
      this.classT = 'text-warning';
     }else if(fecha_vencida > today && today.diff(fecha_vencida, 'days') != 0){
      this.vencimientoT= 'día(s) para gestionar';
      this.diasT= Math.abs(today.diff(fecha_vencida, 'days')); 
      this.classT = 'text-success';
     }else if(fecha_vencida > today && today.diff(fecha_vencida, 'days') == 0){
      this.vencimientoT= 'Tiene '+dias_disponibles+' días(s) para gestionar';
      this.diasT= ''; 
      this.classT = 'text-success';
     }
   }







      this.avanceTramite();
    }
    setTimeout(()=> {
      this.cargarSeguimiento();
    }, 50);
    
   
  }

  avanceTramite(){
    console.log(this.flujoPasosDos.length)
    let nroPasos = this.flujoPasosDos.length
    let porcentaje = 100 / nroPasos
    let pasosCerrados = []
    const strPOrcentaje = String(porcentaje);
    this.width='width:'+strPOrcentaje+';'
   
   this.flujoPasosDos.forEach((e: any) => {
     
       Object.assign(e, { nro_paso: e.nro_paso, descripcion: e.descripcion, porcentaje: porcentaje});
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
    this.lcargando.ctlSpinner(true);
    this.bandejaTraSrv.seguimientoTicket(this.data, this.data['id_ticket']).subscribe(
      (res) => {
        console.log(res)
        if (res["status"] == 1) {
          res['data'].forEach(e => {
            Object.assign(e, { fecha: e.fecha, observacion: e.observacion });
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
             
            }else if(e.estado_seguimiento=='G'){
              console.log('gestion')
              Object.assign(e, {fecha_v:'', vencimiento: 'En gestión',dias_config: '',dias:'', class: 'text-warning' })

             
            }else if(e.estado_seguimiento=='C'){
              Object.assign(e, {fecha_v:'', vencimiento: 'Cerrada la gestion',dias_config: '',dias:'', class: 'text-success' })

            }
          }
            
          })
          console.log(this.ticketSegui[this.ticketSegui.length-1].class); 
          console.log(this.ticketSegui); 
          this.demorado=this.ticketSegui[this.ticketSegui.length-1].class;
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

  seguiTicket(dt) {
    this.commonVarSrv.seguiTicket.next(dt);
    this.closeModal();
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.closeModal();
        break;
    }
  }

  closeModal() {
    this.commonVarSrv.seguiTicket.next(this.needRefresh);
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

