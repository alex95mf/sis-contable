import { Injectable, OnInit } from "@angular/core";
import { Subject } from 'rxjs';
import { ApiServices } from '../services/api.service';

declare const Buffer: any;
@Injectable()
export class CommonService {
  setcliDataContacto: Subject<any>;
  setDataContacto: Subject<any>;
  setDataRol: Subject<any>;
  setDataSucursal: Subject<any>;
  setCargaSucursal: Subject<any>;
  setDataDocumento: Subject<any>;
  setDataDocumentos: Subject<any>;
  setDatacliDocumentos: Subject<any>;
  setDataCatalogo: Subject<any>;
  refreshData: Subject<any>;
  refreshDataDoc: Subject<any>;
  sendAccountingInv: Subject<any>;
  setClassPills: Subject<any>;
  disabledComponent: Subject<any>;
  selectContabilidad: Subject<any>;
  selectFormula: Subject<any>;
  formulaInformation: Subject<any>;
  cancelFormula: Subject<any>;
  editDeleteData: Subject<any>;
  updateData: Subject<any>;
  setAnexos: Subject<any>;
  refreshTree: Subject<any>;
  setDataBodega: Subject<any>;
  refreshDataTable: Subject<any>;
  setDataStruc: Subject<any>;
  refreshDataTableStruct: Subject<any>;
  contactProvider: Subject<any>;
  anexosProvider: Subject<any>;
  resContactProvider: Subject<any>;
  resAnexosProvider: Subject<any>;
  saveProveedores: Subject<any>;
  actionsSuppliers: Subject<any>;
  actionsSearchProviders: Subject<any>;
  actionsClient: Subject<any>;
  saveClientes: Subject<any>;
  anexosClient: Subject<any>;
  contactClient: Subject<any>;
  resAnexosClient: Subject<any>;
  resContactClient: Subject<any>;
  actionsSearchClient: Subject<any>;
  actionsSearchProduct: Subject<any>;
  actionDocCall: Subject<any>;
  actionDocResponse: Subject<any>;
  activateSaveBtn: Subject<any>;
  actionsSolicitud: Subject<any>;
  actionsSearchSolicitud: Subject<any>;
  dtSystemDocuments: Subject<any>;
  dtSModifyDocuments: Subject<any>;
  detalleSolicitud: Subject<any>;
  resdetalleSolicitud: Subject<any>;
  saveSolicitud = new Subject<any>();
  onHandleNotification: Subject<any>;
  resAnexosSolicitud: Subject<any>;
  anexosSolicitud: Subject<any>;
  cuentaClient: Subject<any>;
  resCuentaClient:Subject<any>;
  nameClient:Subject<any>;
  datatabClient:Subject<any>;
  actionRpNomina:Subject<any>;
  actionRpcancelNomina:Subject<any>;
  actionDataOb:Subject<any>;
  enviaDt:Subject<any>;
  saveContrato:Subject<any>;
  editarTablasConfig:Subject<any>;
  updatevia:Subject<any>;
  editarTasasVarias:Subject<any>;
  mesaAyuTicket:Subject<any>;
  bandTrabTicket:Subject<any>;
  seguiTicket:Subject<any>;
  clearAnexos:Subject<any>;

  modalCargosDepar:Subject<any>;

  modalProgramaConfig: Subject<any>;


  

  constructor(private apiService: ApiServices) {
    this.setDatacliDocumentos = new Subject<any>();
    this.setcliDataContacto = new Subject<any>();
    this.setDataCatalogo = new Subject<any>();
    this.setDataRol = new Subject<any>();
    this.refreshData = new Subject<any>();
    this.refreshDataDoc = new Subject<any>();
    this.setDataSucursal = new Subject<any>();
    this.setCargaSucursal = new Subject<any>();
    this.setDataDocumento = new Subject<any>();
    this.setDataDocumentos = new Subject<any>();
    this.setDatacliDocumentos = new Subject<any>();
    this.sendAccountingInv = new Subject<any>();
    this.setClassPills = new Subject<any>();
    this.disabledComponent = new Subject<any>();
    this.selectContabilidad = new Subject<any>();
    this.selectFormula = new Subject<any>();
    this.formulaInformation = new Subject<any>();
    this.cancelFormula = new Subject<any>();
    this.editDeleteData = new Subject<any>();
    this.setDataContacto = new Subject<any>();
    this.updateData = new Subject<any>();
    this.setAnexos = new Subject<any>();
    this.refreshTree = new Subject<any>();
    this.setDataBodega = new Subject<any>();
    this.refreshDataTable = new Subject<any>();
    this.setDataStruc = new Subject<any>();
    this.refreshDataTableStruct = new Subject<any>();
    this.contactProvider = new Subject<any>();
    this.anexosProvider = new Subject<any>();
    this.anexosClient = new Subject<any>();
    this.resContactProvider = new Subject<any>();
    this.resAnexosProvider = new Subject<any>();
    this.resAnexosClient = new Subject<any>();
    this.saveProveedores = new Subject<any>();
    this.saveClientes = new Subject<any>();
    this.actionsSuppliers = new Subject<any>();
    this.actionsSearchProviders = new Subject<any>();
    this.actionsClient = new Subject<any>();
    this.saveClientes = new Subject<any>();
    this.anexosClient = new Subject<any>();
    this.contactClient = new Subject<any>();
    this.resAnexosClient = new Subject<any>();
    this.resContactClient = new Subject<any>();
    this.actionsSearchClient = new Subject<any>();
    this.actionsSearchProduct = new Subject<any>();
    this.actionDocCall = new Subject<any>();
    this.actionDocResponse = new Subject<any>();
    this.activateSaveBtn = new Subject<any>();
    this.dtSystemDocuments = new Subject<any>();
    this.dtSModifyDocuments = new Subject<any>();
    this.actionsSolicitud = new Subject<any>();
    this.actionsSearchSolicitud = new Subject<any>();
    this.detalleSolicitud = new Subject<any>();
    this.resdetalleSolicitud = new Subject<any>();
    this.saveSolicitud = new Subject<any>();
    this.onHandleNotification = new Subject<any>();
    this.resAnexosSolicitud = new Subject<any>();
    this.anexosSolicitud = new Subject<any>();
    this.cuentaClient = new Subject<any>();
    this.resCuentaClient = new Subject<any>();
    this.nameClient = new Subject<any>();
    this.datatabClient = new Subject<any>();
    this.actionRpNomina = new Subject<any>();
    this.actionRpcancelNomina = new Subject<any>();
    this.actionDataOb = new Subject<any>();
    this.enviaDt = new Subject<any>();
    this.saveContrato = new Subject<any>();
    this.editarTablasConfig = new Subject<any>();
    this.updatevia = new Subject<any>();
    this.editarTasasVarias = new Subject<any>();
    this.mesaAyuTicket = new Subject<any>();
    this.bandTrabTicket = new Subject<any>();
    this.seguiTicket = new Subject<any>();
    this.clearAnexos = new Subject<any>();

    this.modalCargosDepar = new Subject<any>();

    this.modalProgramaConfig = new Subject<any>();
    
  }

  //=================Get Ip Address======================//
  public getIpAddress() {
    return localStorage.getItem('ip');
  }

  formatNumber(params) {
    let locality = 'en-EN';
    params = parseFloat(params).toLocaleString(locality, {
      minimumFractionDigits: 4
    })
    params = params.replace(/[,.]/g, function (m) { return m === ',' ? '.' : ','; });
    return params;
  }
  formatNumberDos(params) {
    let locality = 'en-EN';
    params = parseFloat(params).toLocaleString(locality, {
      minimumFractionDigits: 2
    })
    // params = params.replace(/[,.]/g, function (m) { return m === ',' ? '.' : ','; });
    return params;
  }

  FormatDecimalVal(event): boolean {
    let key = event.which ? event.which : event.keyCode;
    if (key !== 46 && key > 31 && (key < 48 || key > 57)) {
        return false;
    }
    return true;
  }

  FormatIntegerVal(event): boolean {
    let key = event.which ? event.which : event.keyCode;
    if (key > 31 && (key < 48 || key > 57)) {
        return false;
    }
    return true;
  }

  getDataUserLogued() {
    return JSON.parse(localStorage.getItem('Datauser'));
  }

  saveBitacoraGeneral(data) {
    return this.apiService.apiCall('api/general/save-bitacora', 'POST', data);
  }

  getPermisionsGlobas(data) {
    return this.apiService.apiCall('menu/get-permisions', 'POST', data);
  }

  /*valida los permisos del siguient estado*/
  filterPermissionStatus(status, doc) {    
    let prefict = this.getDataUserLogued().permisos_doc.filter(e => e.fk_documento == doc);
    let filter = prefict[0]['filtros'].split(',');
    let position;

    for (let index = 0; index < filter.length; index++) {
      if (parseInt(filter[index]) == status) {
        position = index;
        break;
      }
    }
    let status_res = filter[position + 1];

    /* let arrayFind = prefict[0]['usr_notifier'].filter(e => e.filter_id == parseInt(status_res));
    arrayFind = arrayFind[0].users;
    
    let id_user = this.getDataUserLogued().id_usuario;
    let validaPermi = false;
    for (let i = 0; i < arrayFind.length; i++) {
      if (parseInt(arrayFind[i]) == id_user) {
        validaPermi = true;
        break;
      }
    }
    return validaPermi; */
    if(status_res != undefined){ 
      let arrayFind = prefict[0]['usr_notifier'].filter(e => e.filter_id == parseInt(status_res));
      arrayFind = arrayFind[0].users;

      let id_user = this.getDataUserLogued().id_usuario;
      let validaPermi = false;
      for (let i = 0; i < arrayFind.length; i++) {
        if (parseInt(arrayFind[i]) == id_user) {
          validaPermi = true;
          break;
        }
      }
      return validaPermi;
    }else{
      return status_res;
    }
  }

  /*devuleve el siguiente estado del docuemnto */
  filterNexStatus(status, doc) {
    let prefict = this.getDataUserLogued().permisos_doc.filter(e => e.fk_documento == doc);
    let filter = prefict[0]['filtros'].split(',');
    let position;

    for (let index = 0; index < filter.length; index++) {
      if (parseInt(filter[index]) == status) {
        position = index;
        break;
      }
    }
    let status_res = filter[position + 1];
    return status_res;
  }

  /*devuleve los usuarios del siguiente estado del docuemnto*/
  filterUserNotification(status, doc) {
    let prefict = this.getDataUserLogued().permisos_doc.filter(e => e.fk_documento == doc);
    let filter = prefict[0]['filtros'].split(',');
    let position;

    for (let index = 0; index < filter.length; index++) {
      if (parseInt(filter[index]) == status) {
        position = index;
        break;
      }
    }
    let status_res = filter[position + 1];

    let arrayFind = prefict[0]['usr_notifier'].filter(e => e.filter_id == parseInt(status_res));
    arrayFind = arrayFind[0].users;

    return arrayFind;
  }

  /*filtra los usuarios que tienen permiso por el estado actual del documento*/
  filterUser(status, doc) {
    let validaPermi = false;
    let prefict = this.getDataUserLogued().permisos_doc.filter(e => e.fk_documento == doc);
    if(prefict[0]['usr_notifier'] != undefined){
      let arrayFind = prefict[0]['usr_notifier'].filter(e => e.filter_id == parseInt(status));
      arrayFind = arrayFind[0].users;

      let id_user = this.getDataUserLogued().id_usuario;       
      for (let i = 0; i < arrayFind.length; i++) {
        if (parseInt(arrayFind[i]) == id_user) {
          validaPermi = true;
          break;
        }
      }
      return validaPermi;
    }else{
      return validaPermi;
    }
  }

  /*retorna todos los usuarios con permisos cuando el documento llegue a su estado final */
  allUserNotification(doc) {
    let prefictA = this.getDataUserLogued().permisos_doc.filter(e => e.fk_documento == doc);
    prefictA = prefictA[0]['usr_notifier'];
    let arrayCurrent = [];

    for (let index = 0; index < prefictA.length; index++) {
      for (let i = 0; i < prefictA[index]['users'].length; i++) {
        arrayCurrent.push(prefictA[index]['users'][i]);
      }
    }
    return arrayCurrent;
  }
  allUserNotificationCrm(tipo_alerta: number): number[] {
    const user = this.getDataUserLogued();
  

    if (!user || !Array.isArray(user.alertas)) {
      console.warn("El usuario logueado no tiene alertas definidas.");
      return [];
    }
  
    return user.alertas
      .filter(alerta => alerta.fk_tipo_alerta === tipo_alerta)
      .map(alerta => alerta.fk_usuario);
  }

  userNotificationCrm(tipo_alerta: number, id_usuario: number): number[] {
    console.log(id_usuario)
    const user = this.getDataUserLogued();

   

    // Verificar si el usuario tiene alertas
    if (!Array.isArray(user.alertas)) {
        return [];
    }

    // Filtrar alertas del tipo indicado y devolver solo los fk_usuario
    return user.alertas
        .filter(alerta => alerta.fk_tipo_alerta === tipo_alerta && alerta.fk_usuario == id_usuario)
        .map(alerta => alerta.fk_usuario);
  }


   /*retorna todos los usuarios con permisos cuando el documento llegue a su estado final */
  //  allUserNotificationCrm(tipo_alerta) {
  //   let prefictA = this.getDataUserLogued().alertas.filter(e => e.fk_tipo_alerta == tipo_alerta);
  //   // prefictA = prefictA[0]['usr_notifier'];
  //   let arrayUsuNotify= [];

  //   prefictA.forEach(e => {
  //     arrayUsuNotify.push(e)
  //   });
    
  //   return arrayUsuNotify;
  // }
 

}
