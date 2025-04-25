import { Injectable,EventEmitter } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ReciboCobroService {

  constructor(private api: ApiServices) { }
  listaAnticipos$ = new EventEmitter<any>();

  getConceptos() {
    return this.api.apiCall('concepto/get-conceptos', 'POST', {})
  }

  getLiquidacionesByCod(data) {
    return this.api.apiCall("liquidacion/get-liquidaciones-by-codigo", "POST", data);
  }

  getLiqByContribuyente(data) {
    return this.api.apiCall("liquidacion/get-liquidaciones-by-contribuyente", "POST", data);
  }

  anularRecDocument(data) {
    return this.api.apiCall("recaudacion/anular-rec-documento", "POST", data);
  }

  setRecDocumento(data) {
    return this.api.apiCall("liquidacion/set-rec-documento", "POST", data);
  }

  getRecDocumentos(data) {
    return this.api.apiCall("liquidacion/get-rec-documento", "POST", data);
  }
  getRecDocumentosCruce(data) {
    return this.api.apiCall("liquidacion/get-rec-documento-cruce", "POST", data);
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

  getConceptosLiquidacion(data) {
    return this.api.apiCall("liquidacion/get-conceptos-liquidacion", "POST", data);
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
  getListAnticipoPrecobrado(data) {
    return this.api.apiCall("liquidacion/get-list-anticipo-precobrado", "POST", data);
  }

  getJuicios(data,id){
    return this.api.apiCall(`juicio/juicio-contribuyente/${id}`, 'POST',data);
 }

 getCampaigns() {
  return this.api.apiCall('recaudacion/get-campaigns', 'POST', {})
}

 
  

}
