import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class RecaudacionesEspeciesFiscalesService {
  listaAnticipos$ = new EventEmitter();

  constructor(private api: ApiServices) { }

  getConceptos() {
    return this.api.apiCall('concepto/get-conceptos', 'POST', {})
  }

  getLiquidacionesByCod(data) {
    return this.api.apiCall("liquidacion/get-liquidaciones-by-codigo", "POST", data);
  }

  getLiqByContribuyente(data) {
    return this.api.apiCall("liquidacion/get-liquidaciones-by-contribuyente", "POST", data);
  }

  setRecDocumento(data) {
    return this.api.apiCall("liquidacion/set-rec-documento", "POST", data);
  }

  getRecDocumentosCruce(data) {
    return this.api.apiCall("liquidacion/get-rec-documento-cruce", "POST", data);
  }

  getListAnticipoPrecobrado(data) {
    return this.api.apiCall("liquidacion/get-list-anticipo-precobrado", "POST", data);
  }

  setGarantia(data) {
    return this.api.apiCall("liquidacion/set-recudacion-especies", "POST", data);
  }

  getRecDocumentos(data) {
    return this.api.apiCall("liquidacion/get-rec-documento", "POST", data);
  }

  getCajaActiva(id) {
    return this.api.apiCall('recaudacion/get-caja-activa/'+id, 'POST', {})
  }

  getCajaDiaByCaja(data) {
    return this.api.apiCall('recaudacion/get-caja-dia-by-caja', 'POST', data)
  }

  getCatalogos(data) {
    return this.api.apiCall("proveedores/get-catalogo", "POST", data);
  }
  
  getInspecciones(data: any = {}){
    return this.api.apiCall('inspeccion/get-ordenes-filter', 'POST', data);
  }
  
  getInspeccion(data) {
    return this.api.apiCall('inspeccion/get-inspeccion', 'POST', data);
  }

  getPuestos(data: any = {}) {
    return this.api.apiCall('mercado/get-puestos', 'POST', data)
  }

  getEspeciesfiscales(data){
    return this.api.apiCall('tesoreria/recudacion-especies-fiscales',"POST", data);
  }

  getCatalogs(data) {
    return this.api.apiCall("proveedores/get-catalogo", "POST", data);
  }

}
