import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { TicketService } from '../ticket.service';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import * as myVarGlobals from "../../../../../global";
import { Socket } from 'src/app/services/socket.service';

@Component({
standalone: false,
  selector: 'app-ticket-form',
  templateUrl: './ticket-form.component.html',
  styleUrls: ['./ticket-form.component.scss']
})
export class TicketFormComponent implements OnInit {

  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  validaciones = new ValidacionesFactory;
  categorias: any = [];
  subCategorias: any = [];

  ticketSegui = [];

  fileList: FileList;

  dataUser: any;
  vmButtons: any;
  ticketNew: any = {};
  needRefresh: boolean = false;
  deshabilitar: boolean = false;


  @Input() module_comp: any;
  @Input() isNew: any;
  @Input() data: any;
  @Input() permissions: any;
  @Input() fTitle: any;
  @Input() ticket: any;
  @Input() numero_max_reincidencia_ticket: any;
  @Input() reapertura_ticket: any


  prioridadList = [
    { value: "A", label: "ALTA" },
    { value: "M", label: "MEDIA" },
    { value: "B", label: "BAJA" },

  ]

  lista_historia_ticket: any[] = []
  observacionReapertura: any  = ''

  lista_tipo_alerta: any = []

  constructor(public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private ticketSrv: TicketService,
    private commonVarSrv: CommonVarService,
    private socket: Socket ,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.vmButtons = [
      {
        orig: "btnTicketForm",
        paramAccion: "",
        boton: { icon: "fas fa-save", texto: "GUARDAR" },
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
        boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" },
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
      observacion: "",
      categoria: 0,
      subcategoria: 0,
      estado: 0,
      prioridad: 0,
    }

    if (!this.isNew) {
      setTimeout(() => {
        this.cargarSeguimiento();
      }, 50);
      this.vmButtons = [
        
        {
          orig: "btnTicketForm",
          paramAccion: "",
          boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" },
          permiso: true,
          showtxt: true,
          showimg: true,
          showbadge: false,
          clase: "btn btn-danger boton btn-sm",
          habilitar: false,
        }
      ];

      this.ticketNew = JSON.parse(JSON.stringify(this.data));
      //console.log(' aquiiii '+this.ticketNew);
      this.deshabilitar = true;

      console.log(this.ticketNew)
    }

    setTimeout(() => {
      this.getCatalogoCategoria();
      this.cargarHistoriaTicket();
    }, 50);

    
    if (this.reapertura_ticket === 'S' && this.data?.id_ticket && this.data?.estado === 'C') {
      this.vmButtons.unshift({
        orig: "btnTicketForm",
        paramAccion: "",
        boton: { icon: "fas fa-sync-alt", texto: "RE-APERTURAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      });

    }

  }

 


  cargarSeguimiento() {
    if (!this.isNew) {
      this.mensajeSpinner = "Cargando Seguimiento...";
      this.lcargando.ctlSpinner(true);
    } else {

      this.lcargando.ctlSpinner(true);
    }

    this.ticketSrv.seguimientoTicket(this.data, this.data['id_ticket']).subscribe(

      (res) => {
        if (res["status"] == 1) {

          res['data'].forEach(e => {
            Object.assign(e, { fecha: e.fecha, observacion: e.observacion, usuario: e.usuario.nombre });
          })
          this.ticketSegui = JSON.parse(JSON.stringify(res['data']));
          this.getCatalogoCategoria();
          this.lcargando.ctlSpinner(false);
        }


      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "REGRESAR":
        this.closeModal();
        break;
      case "GUARDAR":
        this.validaTicket();
        break;
      case "RE-APERTURAR":
        this.validaTicket();
        break;
    }
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
            this.reabrirTicket()
            //this.editTasasVarias();
          }
        }
      });
    }
  }

  

  getCatalogoCategoria() {

    this.mensajeSpinner = "Cargando Categorías...";
    this.lcargando.ctlSpinner(true);
    let data = {
      params: "'MDA_CATEGORIA','MDA_SUBCATEGORIA', 'TIPO_NOTIFICACION_ALERTA'",
    };

    this.ticketSrv.getCatalogoCategoria(data).subscribe(

      (res) => {
        this.categorias = res["data"]['MDA_CATEGORIA'];
        this.subCategorias = res["data"]['MDA_SUBCATEGORIA'];
        this.lista_tipo_alerta =  res["data"]['TIPO_NOTIFICACION_ALERTA'] 
        // console.log('catalogos '+res);
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );

  }
  getCatalogoSubCategoria(evento: any) {
    //console.log('Aquiiii '+evento);
    //this.subCategorias=0;
    this.mensajeSpinner = "Cargando Sub Categorías...";
    this.lcargando.ctlSpinner(true);
    this.ticketNew.subcategoria = 0;
    let data = {
      grupo: [evento]
    };
    this.ticketSrv.getCatalogoSubCategoria(data).subscribe(

      (res) => {
        //console.log('AQQQQQQQQQ'+res["data"])
        this.subCategorias = res["data"];
        //console.log( this.subCategorias);
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  cargarHistoriaTicket() {
    this.mensajeSpinner = "Cargando Historia Ticket...";
    this.lcargando.ctlSpinner(true);

    let data = {
      id_empresa: this.dataUser.id_empresa
    }

    if(this.data.id_ticket !== undefined){
      this.ticketSrv.getHistoriaTickets(this.data.id_ticket, data).subscribe(
        (res) => {
          if (res['data']) {
            this.lista_historia_ticket = res['data'];
          }
          this.lcargando.ctlSpinner(false);
        },
        (error) => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.message);
        }
      )
    }

    

  }

  validaDataGlobal() {
    let flag = false;
    return new Promise((resolve, reject) => {

      if (
        this.ticketNew.categoria == 0 ||
        this.ticketNew.categoria == undefined
      ) {
        this.toastr.info("El campo Categoría no puede ser vacío");
        flag = true;
      }
      else if (
        this.ticketNew.subcategoria == 0 ||
        this.ticketNew.subcategoria == undefined
      ) {
        this.toastr.info("El campo Sub Categoría no puede ser vacío");
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
      // else if (
      //   this.fileList == undefined
      // ){
      //   this.toastr.info("El campo de Archivos no puede ser vacío");
      //   flag = true;
      // }

      !flag ? resolve(true) : resolve(false);
    })
  }



  /**
     * Almacena en FileList los archivos a ser enviados al backend
     * @param archivos Archivo seleccionado
     */
  cargaArchivo(archivos) {
    if (archivos.length > 0) {
      this.fileList = archivos
      setTimeout(() => {
        this.toastr.info('Ha seleccionado ' + this.fileList.length + ' archivo(s).', 'Anexos de ticket')
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
      component: myVarGlobals.fRTTickets,  // TODO: Actualizar cuando formulario ya tenga un ID
      identifier: identifier,
      // Informacion para almacenamiento de bitacora
      id_controlador: myVarGlobals.fRTTickets,  // TODO: Actualizar cuando formulario ya tenga un ID
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

        this.mensajeSpinner = "Guardando Ticket...";
        this.lcargando.ctlSpinner(true);

        let data = {
          ticketNew: {
            fecha: this.ticketNew.fecha,
            observacion: this.ticketNew.observacion,
            categoria: this.ticketNew.categoria,
            subcategoria: this.ticketNew.subcategoria,
            prioridad: this.ticketNew.prioridad

          }
        }

        this.ticketSrv.createTicket(data).subscribe(
          (res) => {
            //console.log(res);
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
                  this.needRefresh = true;
                  console.log(res);
                  if (!!this.fileList) {
                    this.uploadFile(res['data']['id_ticket'])
                  }

                  this.cargarTickets(res);
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

  reabrirTicket() {
    if(this.observacionReapertura === ''){
      this.toastr.warning("Debe de ingresar una observación de re-apertura")
      return;
    }

    if(this.data.numero_reincidencia_ticket === this.numero_max_reincidencia_ticket){
      this.toastr.warning("Se ha alcanzado el número máximo que un ticket puede ser re-aperturado. Debe de generar otro ticket.")
      return;
    }


    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea re-aperturar este Ticket?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {

        this.mensajeSpinner = "Re-Aperturando Ticket...";
        this.lcargando.ctlSpinner(true);

        this.data.observacionReapertura = this.observacionReapertura
        this.data.ip= this.commonSrv.getIpAddress()
        this.data.id_controlador= myVarGlobals.fRTTickets

        let data = {
          ticketNew: this.data
        }

        console.log(data)
        
        this.ticketSrv.reaperturarTicket(this.data.id_ticket, data).subscribe(
          (res) => {
            //console.log(res);
            if (res["status"] == 1) {
              this.needRefresh = true;
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "success",
                title: "Ticket Re-aperturado",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.needRefresh = true;
                  if (!!this.fileList) {
                    this.uploadFile(res['data']['id_ticket'])
                  }

                  this.cargarTickets(res);
                  this.closeModal();

                  let alertaGestion = this.lista_tipo_alerta.find(e => e.valor == 'GESTION DE MESA DE AYUDA')
                  const usersFilter = this.commonSrv.userNotificationCrm(alertaGestion.id_catalogo, this.data.id_usuario_asigando)
                  console.log(usersFilter)
                  this.socket.onEmitNotification(usersFilter);
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
  cargarTickets(dt) {
    this.commonVarSrv.mesaAyuTicket.next(dt);
  }

  closeModal() {
    this.commonVarSrv.mesaAyuTicket.next(this.needRefresh);
    this.activeModal.dismiss();
  }

  get mostrarReapertura(): boolean {
    let resultado = !this.isNew && this.reapertura_ticket === 'S' && this.data?.id_ticket && this.data?.estado === 'C';
    
    return resultado;
  }


}
