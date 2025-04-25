import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class FormularioNuevoService {

  constructor(
    private api: ApiServices
  ) { }

  getLiqByContribuyente(data) {
    return this.api.apiCall("liquidacion/get-liquidacionesPg", "POST", data);
  }

  getLiquidacionDetalles(data: any = {}) {
    return this.api.apiCall(`liquidacion/get-liquidacion-detalles/${data.id_liquidacion}`, 'POST', {});
  }

  generarNotificaciones(data: any = {}) {
    return this.api.apiCall('cobros/generar-notificaciones', 'POST', data)
  }

  generarNotificacionesMasivo(data: any = {}) {
    return this.api.apiCall('cobros/generar-notificaciones-masivo', 'POST', data)
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

  
}
