import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class EmisionExpedienteService {

  constructor(private api: ApiServices) { }
  
  getLiqByContribuyente(data) {
    return this.api.apiCall("liquidacion/get-liquidacionesPg", "POST", data);
  }

  setNotificador(data: any = {}) {
    return this.api.apiCall('cobros/set-notificador', 'POST', data)
  }

  getNotificacionCobro(data) {
    return this.api.apiCall("cobros/get-notificaciones-recibidas", "POST", data);
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


  generarExpedientes(data: any = {}) {
    return this.api.apiCall('cobros/generar-expedientes', 'POST', data);
  }


  getLoteNotificacion(data: any = {}) {
    return this.api.apiCall('cobros/set-lote', 'POST', data);
  }

  getConceptosLiquidacionTodas(data) {
    return this.api.apiCall("liquidacion/get-conceptos-liquidacion-todas", "POST", data);
  }
  getConceptosLiquidacionRp(data) {
    return this.api.apiCall("liquidacion/get-conceptos-liquidacion-rp", "POST", data);
  }
  getConceptosLiquidacionTa(data) {
    return this.api.apiCall("liquidacion/get-conceptos-liquidacion-ta", "POST", data);
  }
  getConceptosLiquidacionEp(data) {
    return this.api.apiCall("liquidacion/get-conceptos-liquidacion-ep", "POST", data);
  }
}
