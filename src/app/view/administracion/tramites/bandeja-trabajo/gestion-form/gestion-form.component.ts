import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { BandejaTrabajoService } from '../../../mesa-ayuda/bandeja-trabajo/bandeja-trabajo.service';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import * as moment from 'moment';
import * as myVarGlobals from 'src/app/global';

@Component({
standalone: false,
  selector: 'app-gestion-form',
  templateUrl: './gestion-form.component.html',
  styleUrls: ['./gestion-form.component.scss']
})
export class GestionFormComponent implements OnInit {
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  validaciones = new ValidacionesFactory;
  categorias: any = {};
  subCategorias: any = {};

  dataUser: any;
  vmButtons: any;
  ticketEdit: any = {};
  tarea: any = {};
  usuario: any = {};
  tramite: any = {};
  flujoPasos: any = {};
  flujoPasosTodos: any  = {};
  needRefresh: boolean = false;
  deshabilitar: boolean = false;
  fileList: FileList;
  siguiente_paso: any = ''
  titulo: any = ''

  gesTicket: any = {};

  siguiente_paso_si:any = ''
  siguiente_paso_no:any = ''

  @Input() module_comp: any;
  @Input() isNew: any;
  @Input() data: any;
  @Input() permissions: any;
  @Input() fTitle: any= '';
  @Input() ticket: any;

  estadoList = [

    {value: "P",label: "PENDIENTE"},
    {value: "C",label: "CERRADO"}
  ]
  prioridadList = [
    {value: "A",label: "ALTA"},
    {value: "M",label: "MEDIA"},
    {value: "B",label: "BAJA"},

  ]

  respuestaList = [
    {value: "S",label: "SI"},
    {value: "N",label: "NO"}
  ]
  respuestaFlujoList = [
    {value: "S",label: "SI"},
    {value: "N",label: "NO"}
  ]

  fecha_maxima: any
  vencimientoT: any
  diasT: any
  classT:any
  dias_trans: any



  constructor(public activeModal: NgbActiveModal,
      private toastr: ToastrService,
      private commonSrv: CommonService,
      private bandejaTraSrv: BandejaTrabajoService,
      private commonVarSrv: CommonVarService,
  ) { }

  ngOnInit(): void {

    this.vmButtons = [
      {
          orig: "btnGestionTicketForm",
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
          orig: "btnGestionTicketForm",
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
      nro_paso:0,
      siguiente_paso:0,
      tramites:{
        prioridad:"",
        fecha:undefined,
        observacion:"",
        tipo:"",
      },
      usuario:{
        nombre:""
      },
      tareas:{
        nombre:""
      },
      estado: 0,
      prioridad: "",
      fk_tramite:"",
    }

    this.gesTicket = {
      observacion: "",
      estado: 0,
      terminaFlujo: 0,
    }
    this.gesTicket.respuesta_flujo='N';
    console.log(this.data)
    this.titulo = 'Gestión'
    if(!this.isNew){
    this.ticketEdit = JSON.parse(JSON.stringify(this.data));
    this.tarea = JSON.parse(JSON.stringify(this.data['tareas']));
    this.tramite = JSON.parse(JSON.stringify(this.data['tramites']));
    this.usuario = JSON.parse(JSON.stringify(this.data['usuario']));
    this.flujoPasos = JSON.parse(JSON.stringify(this.data['flujo_pasos']));
    this.flujoPasosTodos = JSON.parse(JSON.stringify(this.data['flujo_pasos_dos']));
    console.log(this.flujoPasosTodos)
    this.titulo = this.titulo +' No. '+ this.tramite.nro_tramite

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

  //  if(this.flujoPasosTodos.length > 0){
  //   if(this.ticketEdit.siguiente_paso != undefined){
  //     let pasoSigFilter = this.flujoPasosTodos.filter(e => e.nro_paso == this.ticketEdit.siguiente_paso)[0];
  //     console.log(pasoSigFilter.descripcion)
  //     this.siguiente_paso = pasoSigFilter.descripcion
  //   }
  //  }
   if(this.flujoPasosTodos.length > 0){
    let pasoSigFilter = this.flujoPasosTodos.filter(e => e.nro_paso == this.ticketEdit?.siguiente_paso)[0];
    let pasoSigSiFilter = this.flujoPasosTodos.filter(e => e.nro_paso == this.ticketEdit?.siguiente_paso_si)[0];
    let pasoSigNoFilter = this.flujoPasosTodos.filter(e => e.nro_paso == this.ticketEdit?.siguiente_paso_no)[0];
    // console.log(pasoSigFilter?.descripcion)
     this.siguiente_paso = pasoSigFilter?.descripcion
     this.siguiente_paso_si = pasoSigSiFilter?.descripcion
     this.siguiente_paso_no = pasoSigNoFilter?.descripcion
   }



    console.log(this.ticketEdit.siguiente_paso);
    this.deshabilitar=true;
    this.gesTicket.estado = this.tramite.estado
    console.log(this.gesTicket.estado);
    this.gesTicket.respuesta=this.ticketEdit.respuesta;
    this.gesTicket.observacion=this.ticketEdit.observacion;
  }


  }
  gestionTicket(dt) {
    this.commonVarSrv.bandTrabTicket.next(dt);
    this.closeModal();
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
        case " REGRESAR":
            this.closeModal();
            break;
        case " GUARDAR":
            this.validaGestionTramite();
            break;
    }

  }

  async validaGestionTramite() {
    if(this.isNew && this.permissions.guardar=="0") {
      this.toastr.warning("No tiene permisos para gestionar Trámites");

    } else if (!this.isNew && this.permissions.editar == "0") {
      this.toastr.warning("No tiene permisos para gestionar Trámites.", this.fTitle);
    } else {
        let resp = await this.validaDataGlobal().then((respuesta) => {

          if(respuesta) {
              this.gestionarTramite();
          }
        });
    }
  }
  validaDataGlobal() {
    let flag = false;
    return new Promise((resolve, reject) => {

      if(
        this.flujoPasos.pregunta_texto!=null && this.gesTicket.respuesta == 0 ||  this.flujoPasos.pregunta_texto!=null && this.gesTicket.respuesta == undefined
      ) {
        this.toastr.info("El campo Respuesta no puede ser vacio");
        flag = true;
      }
      else if(
        this.gesTicket.observacion == "" ||
        this.gesTicket.observacion == undefined
      ) {
        this.toastr.info("El campo Observación no puede ser vacio");
        flag = true;
      }

      !flag ? resolve(true) : resolve(false);
    })
  }

  gestionarTramite() {


    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea guardar la gestión del Trámite?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
      }).then((result) => {
          if (result.isConfirmed) {
              this.mensajeSppiner = "Gestionando Trámite...";
              this.lcargando.ctlSpinner(true);

              let data = {
                gesTicket: {
                  fk_tramite:this.ticketEdit.fk_tramite,
                  id_tramite_seguimiento: this.ticketEdit.id_tramite_seguimiento,
                  nro_paso:this.ticketEdit.nro_paso,
                  observacion: this.gesTicket.observacion,
                  pregunta:this.flujoPasos.pregunta_texto,
                  respuesta:this.gesTicket.respuesta,
                  siguiente_paso:this.ticketEdit.siguiente_paso,
                  tipo_tramite:this.tramite.tipo,
                  fk_flujo_paso:this.flujoPasos.id_flujo_pasos,
                  estado: this.gesTicket.estado,
                  respuesta_flujo: this.gesTicket.respuesta_flujo,
                  prioridad:this.tramite.prioridad,
                  fk_rol:this.ticketEdit.fk_rol,
                  fk_usuario_atiende:this.dataUser.id_usuario,
                  fk_flujo:this.tarea.id_flujo,
                  termina_flujo:this.flujoPasos.termina_flujo
                }
              }

              this.bandejaTraSrv.gestionTramiteSeguimiento(data).subscribe(
                  (res) => {
                      console.log(res);
                      if (res["status"] == 1) {
                      this.needRefresh = true;
                      this.lcargando.ctlSpinner(false);
                      Swal.fire({
                          icon: "success",
                          title: "Trámite gestionado con éxito",
                          text: res['message'],
                          showCloseButton: true,
                          confirmButtonText: "Aceptar",
                          confirmButtonColor: '#20A8D8',
                      }).then((result) => {
                        if (result.isConfirmed) {
                          this.needRefresh = true;
                          this.closeModal();
                        }
                        // if (this.fileList != undefined) {
                        //   this.uploadFile()
                        // }
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
    this.commonVarSrv.bandTrabTicket.next(this.needRefresh);
    this.activeModal.dismiss();
  }

  cargaArchivo(archivos) {
    if (archivos.length > 0) {
      this.fileList = archivos
      setTimeout(() => {
        this.toastr.info('Ha seleccionado ' + this.fileList.length + ' archivo(s).', 'Anexos de gestión de trámite')
      }, 50)
    }
  }
  uploadFile() {
    console.log('sube archivo')
    this.mensajeSppiner = "Guardando Archivo...";
    this.lcargando.ctlSpinner(true);
    let data = {
      module: this.permissions.id_modulo,
      component: myVarGlobals.fRTGesTramites,
      identifier: this.ticketEdit.id_tramite_seguimiento,
      id_controlador: myVarGlobals.fRTGesTramites,
      accion: `Nuevo anexo para seguimiento de paso ${this.ticketEdit.id_tramite_seguimiento}`,
      ip: this.commonSrv.getIpAddress(),
      description: 'GESTION-TRAMITES'
    }

    for (let i = 0; i < this.fileList.length; i++) {
      this.UploadService(this.fileList[i], data);
    }

  }

  UploadService(file, payload?: any, custom1?: any): void {
    let cont = 0
    console.log('Se ejecuto con:', payload);
    this.bandejaTraSrv.uploadAnexo(file, payload).toPromise().then(res => {
      console.log('aqui', res);
    }).then(res => {
      this.commonVarSrv.contribAnexoLoad.next({ id_cliente: this.ticketEdit.id_tramite_seguimiento, condi: 'dis' })
      setTimeout(() => {
        this.toastr.info('Carga exitosa', 'Anexos de trámite')
        this.lcargando.ctlSpinner(false)
      }, 10)
    })
  }



 async  limpiarInputArchivo(event)
  {
    const result = await Swal.fire({
      title: "Atención!!",
      text: "Esta seguro que desea limpiar el campo?",
      //icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#DC3545",
      confirmButtonColor: "#13A1EA",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    })

    if (result.isConfirmed) {
      if(this.fileList !== undefined){
        this.fileList = undefined
      }
    }

  }

  getEstadoClass(value: string): string {
    switch(value) {
        case 'P': return 'fas fa-circle text-primary';
        case 'C': return 'fas fa-circle text-danger';
        default: return 'fas fa-circle';
    }
  }

  getEstadoTooltip(value: string): string {
      switch(value) {
          case 'P': return 'Pendiente';
          case 'C': return 'Cerrado';
          default: return '';
      }
  }

  getEstadoLabel(value: string): string {
    console.log(value)
    switch(value) {
        case 'P': return 'Pendiente';
        case 'C': return 'Cerrado';
        case 'R': return 'Retornado';
        default: return '';
    }

  }

  getEstadoLabelClass(value: string): string {
    console.log(value)
    switch(value) {
        case 'P': return 'fas fa-circle text-primary';
        case 'C': return 'fas fa-circle text-danger';
        case 'R': return 'fas fa-circle text-warning';
        default: return 'fas fa-circle';
    }
  }


}
