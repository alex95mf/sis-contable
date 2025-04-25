import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class GeneracionValorService {

  constructor(private api: ApiServices) { }

  getContribuyentes(data?:any) {
    if(data){
      return this.api.apiCall('contribuyente/get-contribuyentes', 'POST', data);
    } else {
      return this.api.apiCall('contribuyente/get-contribuyentes', 'POST', {})
    }
  }

  getInspecciones(data){
    return this.api.apiCall('contribuyente/get-ordenes-inspeccion','POST',data);
  }

  getExoneraciones(data) {
    return this.api.apiCall('aranceles/get-exoneraciones-codigo', 'POST', data);
  }

  getConceptoDetalle(data) {
    return this.api.apiCall('concepto/get-detalle', 'POST', data);
  }

  getLiquidaciones(data?) {
    if(data){
      return this.api.apiCall("aranceles/get-liquidaciones", "POST", data);
    } else {
      return this.api.apiCall('liquidacion/get-liquidaciones', 'POST', {})
    }

  }

  getLiquidacionesByCod(data) {
    return this.api.apiCall("liquidacion/get-liquidaciones-by-codigo", "POST", data);
  }

  aprobarLiquidacion(id) {
    return this.api.apiCall(`aranceles/cobrar/${id}`, 'POST', {});
  }
  

  getLiquidacionCompleta(data) {
    return this.api.apiCall(`liquidacion/get-liquidacion-completa/${data}`, 'POST', {})
  }

  getInspeccion(data) {
    return this.api.apiCall('inspeccion/get-inspeccion', 'POST', data);
  }

  setLiquidacion(data) {
    return this.api.apiCall("liquidacion/set-liquidacion", "POST", data);
  }

  getConceptos() {
    return this.api.apiCall('concepto/get-conceptos', 'POST', {})
  }
}
