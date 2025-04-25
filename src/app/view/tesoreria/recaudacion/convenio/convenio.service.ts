import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ConvenioService {

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

  getRecDocumentos(data) {
    return this.api.apiCall("liquidacion/get-rec-documento", "POST", data);
  }

  getCajaActiva(id) {
    return this.api.apiCall('recaudacion/get-caja-activa/'+id, 'POST', {})
  }

  setConvenio(data) {
    return this.api.apiCall("convenio/set-convenio", "POST", data);
  }

  uploadAnexo(file, payload?: any) {
    return this.api.apiCallFile('general/upload-files', 'POST', file, payload)
  }
  anularConvenio(data) {
    return this.api.apiCall("convenio/pre-anular-convenio", "POST", data);
  }

  updateDocuemnto(data) {
    return this.api.apiCall("convenio/update-convenio", "POST", data);

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
