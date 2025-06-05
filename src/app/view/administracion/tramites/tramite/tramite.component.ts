import { Component, OnInit, ViewChild} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { TicketFormComponent } from './ticket-form/ticket-form.component';
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import * as myVarGlobals from 'src/app/global';
import { TramitesService } from '../tramites.service';
import { ModalContribuyentesComponent } from "src/app/config/custom/modal-contribuyentes/modal-contribuyentes.component";
import { ModalRegContribuyenteComponent } from './modal-reg-contribuyente/modal-reg-contribuyente.component';
import { ExcelService } from 'src/app/services/excel.service';
import { environment } from 'src/environments/environment';

@Component({
standalone: false,
  selector: 'app-tramite',
  templateUrl: './tramite.component.html',
  styleUrls: ['./tramite.component.scss']
})
export class TramiteComponent implements OnInit {


  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  fTitle = "Trámites";
  mensajeSpinner: string = "Cargando...";
  vmButtons = [];
  dataUser: any;
  permissions: any;
  tareas: any = {};
  subCategorias: any = {};

  fileList: FileList;

  ticket: any = {};

  ticketNew: any = { fk_tipo_flujo: 0, tipo: 0 };

  tramiteSelect: any;
  firstday: any;
  today: any;
  tomorrow: any;
  disabledCampos: boolean= false;
  isHito:boolean = false;

  ticketsDt: any = [];
  ticketsDtPasos: any = [];
  estadoSelected = 0
  estadoList = [
    {value: "P",label: "PENDIENTE"},
    // {value: "G",label: "GESTION"},
    {value: "C",label: "CERRADO"}
  ]
  prioridadList = [
    {value: "A",label: "ALTA"},
    {value: "M",label: "MEDIA"},
    {value: "B",label: "BAJA"},
  ]

  paginate: any;
  filter: any;

  contribuyente: any;
  excelData: any = []

  documentos: any = []

  constructor(
    private ticketSrv: TramitesService,
    private commonSrv: CommonService,
    private toastr: ToastrService,
    private commonVarSrv: CommonVarService,
    private modalSrv: NgbModal,
    private excelService: ExcelService) {


      this.commonVarSrv.mesaAyuTicket.asObservable().subscribe(
        (res) => {
          console.log(res);
          if (res) {
            this.cargarTickets();
          }
        }
      )

      this.commonVarSrv.selectContribuyenteCustom.asObservable().subscribe(
        (res)=>{

          if(res.valid == 7){
            console.log(res);
            this.ticketNew.fk_contribuyente = res['razon_social']
            this.contribuyente = res;
          }

        }
      )


     }

  ngOnInit(): void {

    this.vmButtons = [
      // {
      //   orig: "btnsTicket",
      //   paramAccion: "",
      //   boton: { icon: "fa fa-plus-square", texto: " NUEVO" },
      //   permiso: true,
      //   showtxt: true,
      //   showimg: true,
      //   showbadge: false,
      //   clase: "btn btn-success boton btn-sm",
      //   habilitar: false,
      // },
      {
        orig: "btnsTicket",
        paramAccion: "",
        boton: { icon: "fad fa-save", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsTicket",
        paramAccion: "",
        boton: { icon: "fas fa-eraser", texto: " LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsTicket",
        paramAccion: "",
        boton: { icon: "fa fa-file-excel-o", texto: " EXCEL" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      }

    ];
    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
    this.filter = {
      fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      estado: undefined,
      tarea: undefined,
      tipo_tramite: undefined,
      razon_social: undefined,
      num_documento: undefined,
      nro_tramite: undefined,
      tiene_hito: 'N',
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10]
    };

    this.ticketNew = {
      fecha: "",
      id_usuario: 0,
      observacion: "",
      informacion_adicional: "",
      tipo: 0,
      estado: 0,
      fk_tipo_flujo: 0,
      fk_contribuyente: '',
      prioridad: 0,
      nro_tramite:""
    }

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    setTimeout(()=> {
      this.validaPermisos();
      this.cargarTickets();
      this.getCatalogoCategoria();
      // this.getCatalogoSubCategoria(event);
    }, 0);

  }
  metodoGlobal(event){
    switch (event.items.boton.texto) {
      case " NUEVO":
       this.showTicketForm(true, {});
       break;
      case "GUARDAR":
       this.validaTicket();
       break;
      case " MOSTRAR INACTIVOS":
      //  this.changeShowInactive(this.showInactive);
      break;
      case " LIMPIAR":
          this.limpiarForm();
      break;
      case " EXCEL":
          this.exportarExcel();
      break;
    }
  }

  validaPermisos() {
    (this as any).mensajeSpinner = "Verificando permisos del usuario...";
    this.lcargando.ctlSpinner(true);

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    let params = {
      codigo: myVarGlobals.fRTTramitesTickets,
      id_rol: this.dataUser.id_rol,
    };

    this.commonSrv.getPermisionsGlobas(params).subscribe(
      (res) => {
        console.log(res);
        this.permissions = res["data"][0];
        if (this.permissions.ver == "0") {
          this.lcargando.ctlSpinner(false);
          this.toastr.warning("No tiene permisos para ver este formulario.", this.fTitle);
          this.vmButtons = [];
        } else {

          this.cargarTickets();
        }
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }




  /**
   * Almacena en FileList los archivos a ser enviados al backend
   * @param archivos Archivo seleccionado
   */
 cargaArchivo(archivos) {
  if (archivos.length > 0) {
    this.fileList = archivos
    setTimeout(() => {
      this.toastr.info('Ha seleccionado ' + this.fileList.length + ' archivo(s).', 'Anexos de trámite')
    }, 50)
    // console.log(this.fileList)
  }
}


/**
* Se encarga de enviar los archivos al backend para su almacenado
* @param data Informacion del Formulario de Inspeccion (CAB)
*/
uploadFile(identifier) {
  console.log('Presionado una vez');
  let data = {
    // Informacion para almacenamiento de anexo
    module: this.permissions.id_modulo,
   // component: myVarGlobals.fRTTramitesTickets,
    component:myVarGlobals.fRTGesTramites,  // TODO: Actualizar cuando formulario ya tenga un ID
    identifier: identifier,
    // Informacion para almacenamiento de bitacora
   // id_controlador: myVarGlobals.fRenFormComisaria,  // TODO: Actualizar cuando formulario ya tenga un ID
    id_controlador:myVarGlobals.fRTGesTramites,
    accion: `Nuevo anexo para Ticket ${identifier}`,
    ip: this.commonSrv.getIpAddress()
  }

  for (let i = 0; i < this.fileList.length; i++) {
    console.log('File', data);
    this.UploadService(this.fileList[i], data);
  }
  this.fileList = undefined
  // this.lcargando.ctlSpinner(false)
}

/**
 * Envia un archivo al backend
 * @param file Archivo
 * @param payload Metadata
 */
UploadService(file, payload?: any): void {
  let cont = 0
  console.log('Se ejecuto');
  this.ticketSrv.uploadAnexo(file, payload).toPromise().then(res => {
    console.log('aqui', res);
  }).then(res => {
    // this.commonVarSrv.contribAnexoLoad.next({ id_cliente: '', condi: 'dis' })
  })
}


  getCatalogoCategoria() {
    (this as any).mensajeSpinner = "Cargando Tramites...";
    this.lcargando.ctlSpinner(true);
    this.ticketSrv.getTareasALl().subscribe(
      (res) => {
        this.tareas = res["data"];
        console.log(this.tareas);
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
        console.log(error)
      }
    );
  }
  // getCatalogoSubCategoria(evento: any) {
  //   // console.log('Aquiiii '+evento);
  //    this.subCategorias=0;
  //    let data = {
  //      grupo:evento
  //    };
  //    this.ticketSrv.getCatalogoSubCategoria(data).subscribe(

  //      (res) => {
  //        //console.log('AQQQQQQQQQ'+res["data"])
  //        this.subCategorias = res["data"];
  //        //console.log( this.subCategorias);
  //      },
  //      (error) => {
  //        this.lcargando.ctlSpinner(false);
  //        this.toastr.info(error.error.message);
  //      }
  //    );
  //  }


  changeTipoTramite(event){
    console.log(event);
    this.ticketNew.tipo = event.tipo
    this.tramiteSelect = event.id_flujo
    this.ticketNew.prioridad = event.prioridad

  }


   asignarEstado(evt) {
    this.filter.estado = [evt]
   }

  cargarTickets() {
    (this as any).mensajeSpinner = "Cargando listado de Tickets...";
    this.lcargando.ctlSpinner(true);

    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }

    console.log(data);
    if(this.filter.tiene_hito == 'N'){
      this.ticketSrv.getTickets(data).subscribe(
        (res: any) => {
          console.log(res);
          this.paginate.length = res.data.total;
          this.ticketsDt = (res.data.current_page == 1) ? res.data.data : Object.values(res.data.data)
          this.lcargando.ctlSpinner(false);

        },
        (error) => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.message);
          console.log(error);
        }
      )
    }else{
      this.ticketSrv.getTicketsHitos(data).subscribe(
        (res: any) => {
          console.log(res);
          this.paginate.length = res.data.total;
          this.ticketsDt = (res.data.current_page == 1) ? res.data.data : Object.values(res.data.data)
          this.ticketsDtPasos = []
          this.ticketsDt.forEach(e => {
            e.flujo_pasos.forEach(f => {
            let data = {
              nro_tramite:e.nro_tramite,
              razon_social:e.contribuyente[0]?.razon_social,
              tipo_documento:e.contribuyente[0]?.tipo_documento,
              num_documento:e.contribuyente[0]?.num_documento,
              nombre_tramite:e.flujo?.nombre,
              tipo:e.tipo,
              observacion:e.observacion,
              fecha_tramite:e.fecha,
              estado_tramite:e.estado,
              prioridad_tramite:e.prioridad,
              estado_seguimiento:f.seguimiento?.estado_seguimiento,
              observacion_seguimiento:f.seguimiento?.observacion,
              nro_paso:f.nro_paso,
              nombre_paso:f.descripcion,
              hito:f.hito,
              usuario_atiende:f.responsable?.nombre,
              departamento: f.responsable?.departamento?.dep_nombre,


            }
            this.ticketsDtPasos.push(data);

            })

          })
          this.lcargando.ctlSpinner(false);

        },
        (error) => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.message);
          console.log(error);
        }
      )
    }

  }



  async validaTicket() {
    if (this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos para crear nuevos Tickets");

    } else if ( this.permissions.editar == "0") {
      this.toastr.warning("No tiene permisos para verTickets.", this.fTitle);
    } else {
      let resp = await this.validaDataGlobal().then((respuesta) => {

        if (respuesta) {
          this.crearTicket();

        }
      });
    }
  }




  validaDataGlobal() {
    console.log(this.ticketNew);
    let flag = false;
    return new Promise((resolve, reject) => {

      if (
        this.ticketNew.tipo == 0 ||
        this.ticketNew.tipo == undefined ||
        this.ticketNew.tipo == null
      ) {
        this.toastr.info("El campo tipo de tramite no puede ser vacío");
        flag = true;
      }
      else if (
        this.ticketNew.fk_tipo_flujo == 0 ||
        this.ticketNew.fk_tipo_flujo == undefined ||
        this.ticketNew.fk_tipo_flujo == null
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
        this.ticketNew.prioridad == undefined ||
        this.ticketNew.prioridad == null
      ) {
        this.toastr.info("El campo Prioridad no puede ser vacío");
        flag = true;
      }
      else if (
        this.ticketNew.fk_contribuyente == 0 ||
        this.ticketNew.fk_contribuyente == undefined ||
        this.ticketNew.fk_contribuyente == null
      ) {
        this.toastr.info("El campo Contribuyente no puede ser vacío");
        flag = true;
      }
      // else if (
      //   this.fileList == undefined
      // ) {
      //   this.toastr.info("El campo File no puede ser vacío");
      //   flag = true;
      // }

      !flag ? resolve(true) : resolve(false);
    })
  }


  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarTickets();
  }


  selectedHito(event){
    console.log(event)
    //if (event.checked.length > 0) {
      if (event) {
      this.filter.tiene_hito= 'S';
    } else {
      this.filter.tiene_hito= 'N';

    }
    console.log(this.filter.tiene_hito)
  }



  crearTicket() {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea crear un nuevo trámite?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        (this as any).mensajeSpinner = "Guardando Ticket...";
        this.lcargando.ctlSpinner(true);
        console.log(this.dataUser);
        this.ticketNew['id_usuario'] = this.dataUser['id_usuario'];
        this.ticketNew['estado'] = 'P'
        this.ticketNew.fk_contribuyente = this.contribuyente['id_cliente']
        this.ticketNew.fk_tipo_flujo = this.tramiteSelect;
        console.log(this.ticketNew);
        this.ticketSrv.createTicket(this.ticketNew).subscribe(
          (res) => {
            console.log(res);
            if (res["status"] == 1) {
              // this.needRefresh = true;
              this.cargarTickets();
              this.lcargando.ctlSpinner(false);
              if(!!this.fileList){
                this.uploadFile(res['data']['id_tramite']);
              }
              Swal.fire({
                icon: "success",
                title: "Trámite Creado",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8',
              }).then((result) => {
                if (result.isConfirmed) {
                  console.log(res);
                  this.disabledCampos = true;
                  //this.ticketNew = res['data'];
                  this.ticketSrv.getTareasALl({}).subscribe(
                    (res2) => {
                      //this.tareas = res2["data"];
                      console.log(this.tareas);
                      res2["data"].forEach((t) => {
                        if( res['data']["fk_tipo_flujo"] == t.id_flujo){
                          Object.assign(t, { id_flujo: t.id_flujor, nombre: t.nombre});
                        }
                       });
                      this.tareas = JSON.parse(JSON.stringify(res2["data"]));
                      this.lcargando.ctlSpinner(false);
                    },
                    (error) => {
                      this.lcargando.ctlSpinner(false);
                      this.toastr.info(error.error.message);
                      console.log(error)
                    }
                  );

                  console.log(this.tareas[0].nombre)
                  this.ticketNew.fk_tipo_flujo = this.tareas[0].nombre;
                  this.ticketNew.nro_tramite = res['data']["nro_tramite"];
                  this.ticketNew.observacion = res['data']["observacion"];
                  this.ticketNew.fk_contribuyente =this.contribuyente.razon_social
                  this.commonVarSrv.mesaAyuTicket.next(res['data']);

                  this.ticketSrv.getTramiteById(res['data']).subscribe(
                    (resSegui)=>{
                      console.log(resSegui);
                      let data: any;

                      resSegui['data'][0]['pasos'].map((dato)=>{
                        if(dato['nro_paso'] == 1){
                          data={
                            fk_tramite: res['data']['id_tramite'],
                            nro_paso : 1,
                            observacion : null,
                            pregunta : dato['pregunta_texto'],
                            respuesta : null,
                            siguiente_paso:  dato['siguiente_paso'],
                            siguiente_paso_si: dato['nro_paso_si'] ,
                            siguiente_paso_no: dato['nro_paso_no'] ,
                            estado_seguimiento: 'P',
                            estado_flujo : dato['estado_flujo'] ,
                            fk_flujo_paso: dato['id_flujo_pasos'],
                            id_usuario : this.dataUser['id_usuario'] ,
                            prioridad : resSegui['data'][0]['prioridad'],
                            fk_rol: dato['fk_rol'],
                            fk_flujo: dato['fk_flujo'],
                            grupo_usuarios: dato['grupo_usuarios']
                          }
                        }
                      });
                      console.log(data);
                      this.ticketSrv.createTramiteSeguimiento(data).subscribe(
                        (res)=>{
                          console.log(res);
                        },
                        (erro)=>{
                          console.log(erro);
                        }
                      )


                    }
                  )
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


  exportarExcel() {

    (this as any).mensajeSpinner = "Generando Archivo Excel...";
    this.lcargando.ctlSpinner(true);
    this.excelData = [];
    if(this.isHito){
      Object.keys(this.ticketsDtPasos).forEach(key => {
        let filter_values = {};
        filter_values['No. Trámite'] = (this.ticketsDtPasos[key].nro_tramite != undefined) ? this.ticketsDtPasos[key].nro_tramite.trim() : "";
        filter_values['Contribuyente'] = (this.ticketsDtPasos[key].razon_social != null) ? this.ticketsDtPasos[key].razon_social.trim() : "";
        filter_values['Tipo documento'] = (this.ticketsDtPasos[key].tipo_documento != null) ? this.ticketsDtPasos[key].tipo_documento.trim() : "";
        filter_values['Número documento'] = (this.ticketsDtPasos[key].num_documento != null) ? this.ticketsDtPasos[key].num_documento.trim() : "";
        filter_values['Nombre Trámite'] = (this.ticketsDtPasos[key].nombre_tramite == null) ? 'No tiene flujo' : this.ticketsDtPasos[key].nombre_tramite.trim();
        filter_values['Tipo de Trámite'] = (this.ticketsDtPasos[key].tipo != undefined) ? (this.ticketsDtPasos[key].tipo == 'I' ? 'Interno' : 'Externo') : '';
        filter_values['Observación Trámite'] = (this.ticketsDtPasos[key].observacion != undefined) ? this.ticketsDtPasos[key].observacion : "";
        filter_values['Fecha Trámite'] = (this.ticketsDtPasos[key].fecha_tramite.split(" ")[0] != undefined) ? this.ticketsDtPasos[key].fecha_tramite.split(" ")[0] : "";
        filter_values['Estado Trámite'] = (this.ticketsDtPasos[key].estado_tramite != undefined) ? (this.ticketsDtPasos[key].estado_tramite == 'P' ? 'Pendiente' : 'Cerrado') : '';
        filter_values['Prioridad Trámite'] = (this.ticketsDtPasos[key].prioridad_tramite != undefined) ? (this.ticketsDtPasos[key].prioridad_tramite == 'M' ? 'Media' : this.ticketsDtPasos[key].prioridad == 'A' ? 'Alta' :'Baja' ) : "";
        filter_values['Estado Seguimiento'] = (this.ticketsDtPasos[key].estado_seguimiento != undefined) ? (this.ticketsDtPasos[key].estado_seguimiento == 'P' ? 'Pendiente' : 'Cerrado') : '';
        filter_values['Observación Seguimiento'] = (this.ticketsDtPasos[key].observacion_seguimiento != undefined) ? this.ticketsDtPasos[key].observacion_seguimiento : "";
        filter_values['Paso'] = (this.ticketsDtPasos[key].nro_paso != undefined) ? this.ticketsDtPasos[key].nro_paso : "";
        filter_values['Descripción paso'] = (this.ticketsDtPasos[key].nombre_paso != undefined) ? this.ticketsDtPasos[key].nombre_paso : "";
        filter_values['Hito'] = (this.ticketsDtPasos[key].hito != undefined) ? (this.ticketsDtPasos[key].hito == 'S' ? 'Si' : 'No') : '';
        filter_values['Usuario Atiende'] = (this.ticketsDtPasos[key].usuario_atiende != undefined) ? this.ticketsDtPasos[key].usuario_atiende : "";
        filter_values['Departamento'] = (this.ticketsDtPasos[key].departamento != undefined) ? this.ticketsDtPasos[key].departamento : "";


        this.excelData.push(filter_values);
      })
    }else{
      Object.keys(this.ticketsDt).forEach(key => {
        let filter_values = {};
        filter_values['ID'] = key;
        filter_values['Fecha'] = (this.ticketsDt[key].fecha.split(" ")[0] != undefined) ? this.ticketsDt[key].fecha.split(" ")[0] : "";
        filter_values['Contribuyente'] = (this.ticketsDt[key].contribuyente[0]?.razon_social != null) ? this.ticketsDt[key].contribuyente[0]?.razon_social.trim() : "";
        filter_values['No. Trámite'] = (this.ticketsDt[key].nro_tramite != undefined) ? this.ticketsDt[key].nro_tramite.trim() : "";
        filter_values['Nombre Trámite'] = (this.ticketsDt[key].flujo == null) ? 'No tiene flujo' : this.ticketsDt[key].flujo.nombre.trim();
        filter_values['Observación'] = (this.ticketsDt[key].observacion != undefined) ? this.ticketsDt[key].observacion : "";
        filter_values['Tipo de Trámite'] = (this.ticketsDt[key].tipo != undefined) ? (this.ticketsDt[key].tipo == 'I' ? 'Interno' : 'Externo') : '';
        filter_values['Estado'] = (this.ticketsDt[key].estado != undefined) ? (this.ticketsDt[key].estado == 'P' ? 'Pendiente' : 'Cerrado') : '';
        filter_values['Prioridad'] = (this.ticketsDt[key].prioridad != undefined) ? (this.ticketsDt[key].prioridad == 'M' ? 'Media' : this.ticketsDt[key].prioridad == 'A' ? 'Alta' :'Baja' ) : "";


        this.excelData.push(filter_values);
      })
    }

    this.exportAsXLSX();
    this.lcargando.ctlSpinner(false);
  }
  exportAsXLSX() {
    this.excelService.exportAsExcelFile(this.excelData, 'Excel Trámites');
  }

  async descargarPdf(tramite){
    const { value: password } = await Swal.fire({
      title: 'Ingrese su contraseña',
      input: 'password',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'Debe ingresar la contraseña del certificado.'
        }
      }
    })
    console.log(tramite.id_tramite)

    if (password) {
      this.ticketSrv.descargarPdf({id_tramite: tramite.id_tramite, phrase: password}).subscribe(
        (resultado) => {
          const url = URL.createObjectURL(resultado)
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', 'documento.pdf')
          link.click()
        },
        err => {
          console.log(err)
          this.toastr.error(err.error.message, 'Error descargando Anexo')
        }
      )
    }
    // window.open(environment.ReportingUrl + "rep_administracion_tramites_cierre.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_tramite=" + tramite.id_tramite , '_blank')
  }

  modalContirbuyente(){
    let modal =  this.modalSrv.open(ModalContribuyentesComponent,{
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modal.componentInstance.module_comp = myVarGlobals.fRTTramitesTickets
    modal.componentInstance.editar = this.permissions.editar;
    modal.componentInstance.eliminar = this.permissions.eliminar;
    modal.componentInstance.validacion = 7;
  }

  showTicketForm(isNew:boolean, data?:any) {
    // console.log(data);
    if (!isNew && this.permissions.consultar == "0") {
      this.toastr.warning("No tiene permisos para consultar Tickets.", this.fTitle);
    } else if (isNew && this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos para crear Tickets.", this.fTitle);
    } else {
      const modalInvoice = this.modalSrv.open(TicketFormComponent, {
        size: "xl",
        // backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fRTTramitesTickets;
      modalInvoice.componentInstance.fTitle = this.fTitle;
      modalInvoice.componentInstance.isNew = isNew;
      modalInvoice.componentInstance.data = data;
      modalInvoice.componentInstance.permissions = this.permissions;
      modalInvoice.componentInstance.ticket = this.ticket;

    }
  }

  showRegContribuyente(isNew:boolean, data?:any) {
    // console.log(data);
    if (!isNew && this.permissions.consultar == "0") {
      this.toastr.warning("No tiene permisos para crear Contribuyente.", this.fTitle);
    } else if (isNew && this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos para crear Contribuyente.", this.fTitle);
    } else {
      const modalInvoice = this.modalSrv.open(ModalRegContribuyenteComponent, {
        size: "xl",
        // backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fRTTramitesTickets;
      modalInvoice.componentInstance.fTitle = this.fTitle;
      modalInvoice.componentInstance.isNew = isNew;
      modalInvoice.componentInstance.data = data;
      modalInvoice.componentInstance.permissions = this.permissions;
      modalInvoice.componentInstance.ticket = this.ticket;

    }
  }



  limpiarFiltros() {
    this.filter = {
      fecha_desde: undefined,
      fecha_hasta: undefined,
      estado: undefined,
      tarea: undefined,
      tipo_tramite: undefined,
      razon_social: undefined,
      num_documento: undefined,
      nro_tramite: undefined,
      filterControl: ""
    }
    this.estadoSelected = 0
    // this.getCatalogoCategoria()
    this.isHito = false;
    this.filter.tiene_hito='N';

  }
  limpiarForm(){
     this.ticketNew = {
      fecha: "",
      id_usuario: 0,
      observacion: "",
      informacion_adicional: "",
      tipo: 0,
      estado: 0,
      fk_tipo_flujo: 0,
      fk_contribuyente: '',
      prioridad: 0,
    }
    this.disabledCampos = false;

  }

}
