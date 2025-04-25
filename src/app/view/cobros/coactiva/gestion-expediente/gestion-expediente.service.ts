import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class GestionExpedienteService {

  constructor(
    private api: ApiServices
  ) { }

  getExpedientes(data: any = {}) {
    return this.api.apiCall('legal/get-expedientes', 'POST', data)
  }

  getDetallesExpediente(data: any = {}) {
    return this.api.apiCall('legal/get-expediente-detalles', 'POST', data)
  }

  setNotificador(data: any = {}) {
    return this.api.apiCall('cobros/set-notificador', 'POST', data)
  }

  setJuicios(data: any = {}) {
    return this.api.apiCall('legal/set-juicios', 'POST', data)
  }


  getLiqByContribuyente(data) {
    return this.api.apiCall("liquidacion/get-liquidacionesPg", "POST", data);
  }
  
  anularExpediente(data: any = {}) {
    return this.api.apiCall(`cobros/anular-expediente/${data.expediente.id_cob_notificacion}`, 'POST', data)
  }

  getNotificacionCobro(data) {
    return this.api.apiCall("cobros/notificacion", "POST", data);
  }


  updateNotificacionCobro(data) {
    return this.api.apiCall("cobros/update-notificacion", "POST", data);
  }

  getConceptos() {
    return this.api.apiCall('concepto/get-conceptos', 'POST', {})
  }

  getNotificacionDetalles(data) {
    return this.api.apiCall('cobros/notificacion-detalles', 'POST', data)
  }

  getCatalogs(data) {
    return this.api.apiCall("proveedores/get-catalogo", "POST", data);
  }

  getNotificacionesById(data) {
    return this.api.apiCall("cobros/notificacionById", "POST", data);
  }
}
