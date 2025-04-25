import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class GeneracionService {

  constructor(private api: ApiServices) { }

  getContribuyentes(data:any = {}) {
    return this.api.apiCall('contribuyente/get-contribuyentes', 'POST', data);
  }

  getInspecciones(data: any = {}){
    return this.api.apiCall('inspeccion/get-ordenes-filter', 'POST', data);
  }

  getExoneraciones(data: any = {}) {
    return this.api.apiCall('aranceles/get-exoneraciones', 'POST', data);
  }

  getConceptoDetalle(data: any = {}) {
    return this.api.apiCall('concepto/get-detalle', 'POST', data);
  }

  getConceptoBy(data: any = {}) {
    return this.api.apiCall('concepto/get-concepto-by', 'POST', data)
  }

  getConceptoDetByCod(data) {
    return this.api.apiCall('concepto/get-detalle-by-codigo','POST',data);
  }

  getLiquidaciones(data) {
    return this.api.apiCall("aranceles/get-liquidaciones", "POST", data);
  }
  getLiquidacionesLC(data) {
    return this.api.apiCall("aranceles/get-liquidaciones-localesC", "POST", data);
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

  setLiquidacionLC(data) {
    return this.api.apiCall("liquidacion/set-liquidacion-comercial", "POST", data);
  }

  getValues(data: any = {}) {
    return this.api.apiCall("inspeccion/get-valores", "POST", data);
  }

  getValorImpuestos(data: any = {}) {
    return this.api.apiCall('local-comercial/get-valor-impuestos', 'POST', data)
  }

  getValoresPorCobrar(data: any = {}) {
    return this.api.apiCall('local-comercial/get-valor-por-cobrar', 'POST', data)
  }

  aprobarLiquidacion(id) {
    return this.api.apiCall(`aranceles/cobrar/${id}`, 'POST', {});
  }

  getConceptoByNombre(data: any = {}) {
    return this.api.apiCall('rentas/get-concepto-nombre', 'POST', data);
  }
  /*getPropiedades(id) {
    return this.api.apiCall("propiedad/get-propiedades/" + id, "POST", {});
  }

  getCalculoSubtotal(data, arancel) {
    return this.api.apiCall("aranceles/get-monto/" + arancel, "POST", data);
  }

  anularLiquidacion(id) {
    return this.api.apiCall('aranceles/anular/'+id,'POST',{});
  }*/

}
