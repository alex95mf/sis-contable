import { Component, OnInit, ViewChild  } from '@angular/core';
import { Router } from '@angular/router'
import 'sweetalert2/src/sweetalert2.scss';
import { ToastrService } from 'ngx-toastr';
import * as myVarGlobals from '../../../../global';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { SolicitudService } from './solicitud.service';
import { CommonService } from '../../../../services/commonServices';
import { CommonVarService } from '../../../../../app/services/common-var.services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalTableComponent } from '../../../commons/modals/global-table/global-table.component';
import { Socket } from '../../../../services/socket.service';
import * as moment from "moment";
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
@Component({
standalone: false,
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.scss']
})
export class SolicitudComponent implements OnInit {

	@ViewChild(CcSpinerProcesarComponent, {
		static: false
	}) lcargando: CcSpinerProcesarComponent;
  dataUser: any;
  nameUser: any;
  idUser: any;
  fechaSP: Date = new Date;
  fecha_caducidades: any = "";
  fecha: any;
  solicitud: any = {};
  permissions: any;
  permisoSolicitud: any;
  actions: any = {
    new: false,
    search: false,
    add: true,
    edit: true,
    cancel: true,
    delete: true,
  }
  permisoCrear: any;
  permisoRevisar: any;
  permisoProcesar: any;
  permisoAprobar: any;
  presentarEstado: any;
  envio_fk_documento: any;
  usuario: any;
  estadoSolicitud: any;
  newb: any = false;
  prueba: any;
  caducidad: any;
  fechaSoliciud: any;
  fechaCaducidad: any
  dataModaldescription: any;
  id_solicitud: any;
  secuencia_sol: any;
  eliminarModal: any = true;
  numero_solicitud: any;
  filtros: any;
  filter: any;
  NexPermisions: any;
  prefict: any;
  latestStatus: any;
  position: any = false;
  filtro_doc: any;
  statusActive: any;
  deleteActive: any;
  inputAprobada: any;
  detalleAprobada: any;
  numeroSolicitud: any;
  editInfoDetalle: any = false;
  varDeleteSolicitud: any;
  anularDocumento: any;
	vmButtons: any = [];
  today: Date = new Date;
  fecha_emision = this.today.getFullYear() + '-' + (this.today.getMonth() + 1) + '-' + this.today.getDate();
  date = this.today.getFullYear() + '-' + (this.today.getMonth() + 1) + '-' + this.today.getDate();
  dataVigencia:any;
  diaCaducidad:any;
  dataValor:any = [];
  valeData: any = [];
  EstadoCreado:any = "";
  EstadoRevisado:any= "";
  EstadoProcesado:any = "";
  EstadoAprobado:any = "";
  discreado:any = false;
  disrevisado:any = false;
  disprocesado:any = false;
  disaprobado:any = false;

  constructor(private toastr: ToastrService, private router: Router, private commonServices: CommonService,
    private requestService: SolicitudService, private modalService: NgbModal,
    private socket: Socket, private commonVarSrvice: CommonVarService) {
      this.commonServices.resdetalleSolicitud.asObservable().subscribe(res => {
        this.solicitud.detalle_delete = res.detalle_delete;
        this.solicitud.detalle_modify = res.detalle_modify;
      })
      this.commonServices.resAnexosSolicitud.asObservable().subscribe(res => {
        this.solicitud.anexos_delete = res.anexos_delete;
      })
      /* envia las acciones */
      this.commonServices.actionsSearchSolicitud.asObservable().subscribe(res => {
        this.solicitud = res;
        this.id_solicitud = res.id;
        this.secuencia_sol = res.sec_documento;
        this.fecha_emision = res.fecha_emision;
        this.fecha_caducidades = res.fecha_caducidad;
        this.filtro_doc = res.filter_doc;
        if (this.filtro_doc == 4) {
          this.fechaSoliciud = false;
          this.fechaCaducidad = false;
          this.actions.new = false;
          this.actions.search = true;
          this.actions.add = true;
          this.actions.edit = true;
          this.actions.cancel = false;
          this.actions.delete = true;

          this.vmButtons[0].habilitar = false;
          this.vmButtons[1].habilitar = false;
          this.vmButtons[2].habilitar = true;
          this.vmButtons[3].habilitar = false;
          this.numero_solicitud = this.secuencia_sol.padStart(10, "0");
          this.editInfoDetalle = true;
          this.discreado = false;
          this.disrevisado = false;
          this.disprocesado = false;
          this.disaprobado = false;
        } else {
          this.fechaSoliciud = false;
          this.fechaCaducidad = false;
          this.actions.new = true;
          this.actions.search = true;
          this.actions.add = true;
          this.actions.edit = false;
          this.actions.cancel = false;
          this.actions.delete = false;
          this.vmButtons[0].habilitar = true;
          this.vmButtons[1].habilitar = false;
          this.vmButtons[2].habilitar = false;
          this.vmButtons[3].habilitar = false;
          this.numero_solicitud = this.secuencia_sol.padStart(10, "0");
          this.editInfoDetalle = true;
          if (this.filtro_doc == 1){
            this.discreado = true;
            this.disrevisado = false;
            this.disprocesado = false;
            this.disaprobado = false;
          } else if (this.filtro_doc == 2){
            this.discreado = false;
            this.disrevisado = true;
            this.disprocesado = false;
            this.disaprobado = false;
          }else if (this.filtro_doc == 3){
            this.discreado = false;
            this.disrevisado = false;
            this.disprocesado = true;
            this.disaprobado = false;
          }else if (this.filtro_doc == 4){
            this.discreado = false;
            this.disrevisado = false;
            this.disprocesado = false;
            this.disaprobado = true;
          }
        }
        this.actions.search = true;
        this.commonServices.actionsSolicitud.next(this.actions);
      })
      this.commonVarSrvice.nextStatus.asObservable().subscribe(res => {
        this.statusActive = res;
        this.nexStatus(this.statusActive, this.statusActive.filter_doc);
      })
      this.commonVarSrvice.deleteDocument.asObservable().subscribe(res => {
        this.deleteActive = res;
        this.setDeleteSolicitudes(this.deleteActive);
      })
      this.commonServices.actionDataOb.asObservable().subscribe(res => {
        let data =  (res == undefined)  ? null : res ;
        this.solicitud.observaciones = data;

    })
    this.commonServices.enviaDt.asObservable().subscribe(res => {
      this.dataValor = res;

  })

    }

    ngOnInit(): void {

    this.vmButtons = [
        { orig: "btnSolicitud", paramAccion: "", boton: { icon: "fa fa-plus-square-o", texto: "NUEVO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false},
        { orig: "btnSolicitud", paramAccion: "", boton: { icon: "fa fa-search", texto: "BUSCAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false},
        { orig: "btnSolicitud", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: true},
       /*  { orig: "btnSolicitud", paramAccion: "", boton: { icon: "fas fa-edit", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: true}, */
        { orig: "btnSolicitud", paramAccion: "", boton: { icon: "fa fa-times", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false},
        { orig: "btnSolicitudDelete", paramAccion: "", boton: { icon: "fas fa-trash", texto: "ANULAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: false},
        { orig: "btnSolicitudDelete", paramAccion: "", boton: { icon: "fa fa-times", texto: "CANCELAR " }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false}
      ];

      setTimeout(() => {
        this.lcargando.ctlSpinner(true);
      }, 50);

      this.Permission();

    }

    Permission() {
      this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
      this.permisoSolicitud = this.dataUser.permisos_doc.filter(e => e.fk_documento == 4);
      console.log(this.permisoSolicitud)
      this.estadoSolicitud = this.permisoSolicitud[0]['filtros'].split(',')[0];
      this.getVigencia();
      /*obtener el ultimo status*/
      this.prefict = this.dataUser.permisos_doc.filter(e => e.fk_documento == 4);
      if (this.prefict[0]['filtros'] != null && this.prefict[0]['filtros'] != undefined) {
        let filter = this.prefict[0]['filtros'].split(',');
        this.latestStatus = parseInt(filter[filter.length - 1]);
      }
      /*fin*/
      this.permisosData();
      let params = {
        codigo: myVarGlobals.fSolicitud,
        id_rol: this.dataUser.id_rol
      }
      this.commonServices.getPermisionsGlobas(params).subscribe(res => {
        this.permissions = res["data"][0];
        if (this.permissions.ver == "0") {
          this.lcargando.ctlSpinner(false);
          this.toastr.info("Usuario no tiene Permiso para ver el formulario de Solicitud");
          this.vmButtons = [];
        } else {

          setTimeout(() => {
            this.nameUser = this.dataUser.nombre;
            this.idUser = this.dataUser.id_usuario;
          }, 100);
          this.lcargando.ctlSpinner(false);
        }
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      });
    }

    getVigencia() {
      this.requestService.getVigenciaSolicitud().subscribe(res => {
        this.lcargando.ctlSpinner(false);
        this.dataVigencia = res['data'];
        this.diaCaducidad =  res['data'][0]["vigencia"];
        this.fecha_caducidades = this.today.getFullYear() + '-' + (this.today.getMonth() + 1) + '-' + (this.today.getDate() + this.diaCaducidad);
      })
    }

      metodoGlobal(evento: any) {
      switch (evento.items.boton.texto) {
          case "NUEVO":

          this.ActivateForm();
          break;
          case "BUSCAR":
          this.searchSolicitud();
          break;
          case "GUARDAR":
          if(this.actions.search == true &&  this.solicitud != undefined){
            this.updateClient();
          }else {
            this.saveSolicitud();
          }
          break;
         case "CANCELAR":
          this.CancelForm();
         break;
          case "ANULAR":
          this.deleteSolicitud();
          break;
         case "CANCELAR ":
          this.cancelcatalogo();
          break;
      }
    }

    permisosData() {
      this.permisoCrear = this.permisoSolicitud[0]["crear"];
      this.permisoRevisar = this.permisoSolicitud[0]["revisar"];
      this.permisoProcesar = this.permisoSolicitud[0]["procesar"];
      this.permisoAprobar = this.permisoSolicitud[0]["aprobar"];
      this.permisoCrear == 1  ? this.EstadoCreado = '- Crear' : this.EstadoCreado = "" ;
      this.permisoRevisar == 1  ? this.EstadoRevisado = '- Revisar' : this.EstadoRevisado = "" ;
      this.permisoProcesar == 1  ? this.EstadoProcesado = ' - Procesar' : this.EstadoProcesado = "" ;
      this.permisoAprobar == 1  ? this.EstadoAprobado = '- Aprobar' : this.EstadoAprobado = "" ;
    }

    ActivateForm() {
      this.CancelForm();
      this.permisoCrear = this.permisoSolicitud[0]["crear"]; //id de crear
      if (this.permisoCrear == 0) {
        this.toastr.info("Usuario no tiene Permiso para crear");
        this.actions.new = false;
        this.newb = true;
      } else {
        this.dataValor = [];
        this.actions.new = true;
        this.actions.search = false;
        this.actions.add = false;
        this.actions.edit = true;
        this.actions.cancel = false;
        this.actions.delete = true;
        this.vmButtons[2].habilitar = false;
        this.vmButtons[3].habilitar = false;
        this.fechaSoliciud = false;
        this.fechaCaducidad = false;
        this.commonServices.actionsSolicitud.next(this.actions);
      }
    }

    searchSolicitud() {
      this.actions.search = true;
      this.permisoSolicitud = this.dataUser.permisos_doc.filter(e => e.fk_documento == 4);
      this.envio_fk_documento = this.permisoSolicitud[0]["fk_documento"];
      const modalInvoice = this.modalService.open(GlobalTableComponent, { size: "lg", backdrop: 'static', windowClass: 'viewer-content' });
      modalInvoice.componentInstance.title = "SOLICITUD";
      modalInvoice.componentInstance.module = this.permissions.id_modulo;
      modalInvoice.componentInstance.component = myVarGlobals.fSolicitud;
      modalInvoice.componentInstance.documento_id = this.envio_fk_documento;
      this.CancelForm();
    }

    async saveSolicitud() {
      if (this.permissions.guardar == "0") {
        this.toastr.info("Usuario no tiene permiso para guardar");
        this.actions.new = false;
        this.newb = true;
        this.vmButtons[0].habilitar = false;
        this.vmButtons[1].habilitar = false;
        this.vmButtons[2].habilitar = true;
        this.vmButtons[3].habilitar = false;

      } else {

        let resp = await this.validacionSolicitud().then(respuesta => {
          if (respuesta) {
            // this.commonServices.detalleSolicitud.next(null);
            this.permisoSolicitud = this.dataUser.permisos_doc.filter(e => e.fk_documento == 4);
            this.filtros = this.permisoSolicitud[0]['filtros'].split(',');
            this.filter = this.filtros[0];
            if (this.commonServices.filterUser(this.filter, 4)) {
              this.commonServices.detalleSolicitud.next(null);
              this.confirmSave("Seguro desea guardar el solicitud?", "SET_SOLICITUD");
            } else {
              this.CancelForm();
              this.toastr.info("Usuario no tiene permiso para crear una solicitud de compra");
              this.actions.search = true;
            }
          }
        })
      }
    }

    /* Validation Forms Cabezera*/
    validacionSolicitud() {
     return new Promise((resolve, reject) => {
      if(this.dataValor.length == "0"){
        this.toastr.warning("Ingrese detalle Solicitud");
      } else{
        return resolve(true);
      }
      });
    }

    setSolicitud(data) {
      this.permisoSolicitud = this.dataUser.permisos_doc.filter(e => e.fk_documento == 4);
      this.envio_fk_documento = this.permisoSolicitud[0]["fk_documento"];
      this.filtros = this.permisoSolicitud[0]['filtros'].split(',');
      this.filter = this.filtros[0];
      data.solicitudesfk = this.envio_fk_documento;
      data.estado = 1;
      data.causa = this.dataModaldescription;
      data.fecha_emision = this.fecha_emision;
      data.fecha_caducidad = this.fecha_caducidades;
      data.id_controlador = myVarGlobals.fSolicitud;
      data.accion = `Se ha creado una nueva solicitud de orden compra`;
      data.ip = this.commonServices.getIpAddress();
      data.filter_doc = this.filter;
      data.notifycation = `Se ha generado una nueva solicitud de compra por el usuario ${this.dataUser.nombre}`;
      data.abbr_doc = this.permisoSolicitud[0].codigo;
      data.id_document = this.permisoSolicitud[0].fk_documento;
      data.usersFilter = this.commonServices.filterUserNotification(this.filter, 4);
      this.requestService.saveSolicitud(data).subscribe(res => {
        this.socket.onEmitNotification(this.commonServices.filterUserNotification(this.filter, 4));
        this.toastr.success(res["message"]);
        this.commonServices.saveSolicitud.next({ identifier: res['data']['id'] });
        this.CancelForm();
      /*   setTimeout(() => {
          location.reload();
        }, 300); */
      }, (error) => {
        this.toastr.info(error.error.message);
      });
    }

    nexStatus(dt, doc) {
      if (this.permissions.editar == "0") {
        this.toastr.info("Usuario no tiene Permiso para actualizar el estado");
        this.router.navigateByUrl('dashboard');
      } else {
        let permission = this.commonServices.filterPermissionStatus(doc, 4);
        if (permission == true) {
          this.NexPermisions = this.commonServices.filterNexStatus(doc, 4);
          this.confirmSave("Seguro desea cambiar de estado de la orden?", "MOD_STATUS", dt);
        } else if(permission == false) {
          this.toastr.info("Usuario no tiene Permiso para cambiar al siguiente estado");
          this.actions.search = true;
          this.CancelForm();
        } else if(permission == undefined){
          this.toastr.info("Proceso Terminado de Estado");
          this.actions.search = true;
        }
      }
    }

    updateClient() {
      this.numero_solicitud = this.secuencia_sol.padStart(10, "0");
      if (this.permissions.editar == "0") {
        this.toastr.info("Usuario no tiene Permiso para modificar ");
        this.vmButtons = [];
        this.actions.new = false;
        this.newb = true;
        this.vmButtons[0].habilitar = false;
        this.vmButtons[1].habilitar = false;
        this.vmButtons[2].habilitar = true;
        this.vmButtons[3].habilitar = false;
      } else {
        if (this.commonServices.filterUser(this.filtro_doc, 4)) {
          this.commonServices.detalleSolicitud.next(null);
          this.commonServices.anexosSolicitud.next(null);
          this.confirmSave('Seguro desea actualizar la solicitud' + ' ' + this.numero_solicitud + ' ' + '?', "MOD_SOLICITUD");
        } else {
          this.toastr.info("Usuario no tiene permiso para Modificar una solicitud orden de compra");
          this.CancelForm();
        }
      }
    }


    patchSolicitud(data) {
      delete data['anexos'];
      delete data['contactos'];
      data.id_controlador = myVarGlobals.fSolicitud;
      data.accion = `Actualización de la ${data.id}`;
      data.ip = this.commonServices.getIpAddress();
      this.requestService.updateSolicitud(data).subscribe(res => {
        this.toastr.success(res["message"]);
        this.commonServices.saveSolicitud.next({
          identifier: data.id
        });
        this.CancelForm();
  /*       setTimeout(() => {
          location.reload();
        }, 300); */
      }, (error) => {
        this.toastr.info(error.error.message);
      });
    }

    CancelForm() {
      this.dataValor  = [];
      this.editInfoDetalle = false;
      this.actions.new = false;
      this.actions.search = false;
      this.actions.add = true;
      this.actions.edit = true;
      this.actions.cancel = true;
      this.actions.delete = true;
      this.vmButtons[0].habilitar = false;
      this.vmButtons[1].habilitar = false;
      this.vmButtons[2].habilitar = true;
      this.vmButtons[3].habilitar = false;
      this.discreado = false;
      this.disrevisado = false;
      this.disprocesado = false;
      this.disaprobado = false;
      this.commonServices.actionsSolicitud.next(this.actions);
      this.ClearForm();
    }

    ClearForm() {
      this.solicitud = {};
      this.getVigencia();
      this.fecha_emision = this.today.getFullYear() + '-' + (this.today.getMonth() + 1) + '-' + this.today.getDate();
    }

    cancelcatalogo() {
      this.dataModaldescription = "";
    }

    setDeleteSolicitudes(dt) {
      this.varDeleteSolicitud = dt;
    }

    deleteSolicitud() {
      this.anularDocumento = this.varDeleteSolicitud.sec_documento.padStart(10, "0");
      if (this.permissions.eliminar == "0") {
        this.toastr.info("Usuario no tiene permiso para anular la Solicitud");
      } else {
        if (this.dataModaldescription == "" || this.dataModaldescription == undefined) {
          document.getElementById('Idcausa').focus();
          this.toastr.info("Ingrese un motivo de anulación de la Solicitud");
        } else {
          this.confirmSave('Seguro desea anular la solicitud' + ' ' + this.anularDocumento + ' ' + '?', "DELETE_SOLICITUD", this.varDeleteSolicitud);
        }
      }
    }

    destroySoliciitud(dt) {
      dt.id = dt.id;
      dt.descripcionModal = this.dataModaldescription;
      dt.id_controlador = myVarGlobals.fSolicitud;
      dt.accion = `Borrado la solicitud ${dt.id}`;
      dt.ip = this.commonServices.getIpAddress();

      this.requestService.deleteSolicitudes(dt).subscribe(res => {
        this.toastr.success(res["message"]);
        this.CancelForm();
      /*   setTimeout(() => {
          location.reload();
        }, 300); */
      }, (error) => {
        this.toastr.info(error.error.message);
      });
    }

    modStatus(order) {
      let data = {
        nexPermi: this.NexPermisions,
        id: order.id,
        ip: this.commonServices.getIpAddress(),
        accion: `Cambio de estado de la orden con id ${order.id}`,
        id_controlador: myVarGlobals.fSolicitud,
        filter_doc: this.NexPermisions,
        id_document: 4,
        abbr_doc: this.dataUser.permisos_doc.filter(e => e.fk_documento == 4)[0].codigo,
        notifycation: `Se ha cambiado de estado a la solicitud de compra por el usuario ${this.dataUser.nombre}`,
        secuence: order.sec_documento,
        observacion: this.solicitud.observaciones
      }
      let prefict = this.dataUser.permisos_doc.filter(e => e.fk_documento == 4);
      let filter = prefict[0]['filtros'].split(',');
      filter = filter[0];
      let currentStatus = this.commonServices.filterNexStatus(order.filter_doc, 4);
      if (parseInt(this.latestStatus) != parseInt(currentStatus)) {
        data['usersFilter'] = this.commonServices.filterUserNotification(currentStatus, 4);
      } else {
        data['usersFilter'] = Array.from(new Set(this.commonServices.allUserNotification(4)));
        data['anexos'] = order['anexos'];
      }
      this.requestService.updatePermissions(data).subscribe(res => {
        this.socket.onEmitNotification(data['usersFilter']);
        this.toastr.success(res['message']);
        this.CancelForm();
        /*setTimeout(() => {
          location.reload();
        }, 300); */
      }, error => {
        this.toastr.info(error.error.message);
      })
    }

    /* Confirm CRUD's */
    async confirmSave(message, action, order?: any) {
      Swal.fire({
        title: "Atención!!",
        text: message,
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: '#DC3545',
        confirmButtonColor: '#13A1EA',
        confirmButtonText: "Aceptar"
      }).then((result) => {
        if (result.value) {
          if (action == "SET_SOLICITUD") {
            this.setSolicitud(this.solicitud);
          } else if (action == "MOD_SOLICITUD") {
            this.patchSolicitud(this.solicitud);
          } else if (action == "DELETE_SOLICITUD") {
            ($('#locationModal') as any).modal('hide');
            this.destroySoliciitud(order);
          } else if (action == "MOD_STATUS") {
            this.modStatus(order);
          }
        }
      })
    }

    SetnexStatus(next) {
      this.commonVarSrvice.nextStatus.next(next);
      /* this.commonServices.actionDataOb.next(this.observacionesDt); */
    }

  }
