import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class FormularioNotificacionesService {

  constructor( private api: ApiServices) { }

  getLiqByContribuyente(data) {
    return this.api.apiCall("liquidacion/get-liquidacionesPg", "POST", data);
  }

  generarNotificaciones(data: any = {}) {
    return this.api.apiCall('cobros/generar-expedientes', 'POST', data)
  }

  setNotificador(data: any = {}) {
    return this.api.apiCall('cobros/set-notificador', 'POST', data)
  }

  getNotificacionCobro(data) {
    return this.api.apiCall("cobros/notificacion", "POST", data);
  }


  updateNotificacionCobro(data) {
    return this.api.apiCall("cobros/update-notificacion", "POST", data);
  }

  getConceptos(data: any = {}) {
    return this.api.apiCall('concepto/get-conceptos', 'POST', data)
  }

  getNotificacionDetalles(data) {
    return this.api.apiCall('cobros/notificacion-detalles', 'POST', data)
  }

  getPermisionsGlobas(data) {
    return this.api.apiCall('menu/get-permisions', 'POST', data);
  }

  getCatalogs(data) {
    return this.api.apiCall("proveedores/get-catalogo", "POST", data);
  }

  getNotificacionesById(data) {
    return this.api.apiCall("cobros/notificacionById", "POST", data);
  }


  generarExpediente(data: any = {}) {
    return this.api.apiCall('cobros/generar-expedientes', 'POST', data);
  }

  uploadAnexo(file: File, payload?: any) {
    return this.api.apiCallFile('general/upload-files', 'POST', file, payload)
  }

  downloadAnexo(data: any = {}) {
    return this.api.getTipoBlob('/general/download-files', data)
  }
}
