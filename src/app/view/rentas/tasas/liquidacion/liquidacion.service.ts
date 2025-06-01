import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class LiquidacionService {

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
    return this.api.apiCall('aranceles/get-exoneraciones', 'POST', data);
  }

  getExoneracionesCodigo(data) {
    return this.api.apiCall('aranceles/get-exoneraciones-codigo', 'POST', data);
  }



  getConceptoDetalle(data) {
    return this.api.apiCall('concepto/get-detalle', 'POST', data);
  }

  getLiquidaciones(data) {
    return this.api.apiCall("liquidacion-Ren-Tasas/get-liquidaciones", "POST", data);
  }

  getLiquidacionCompleta(data) {
    return this.api.apiCall(`liquidacion-Ren-Tasas/get-liquidacion-completa/${data}`, 'POST', {})
  }

  getInspeccion(data) {
    return this.api.apiCall('inspeccion/get-inspeccion', 'POST', data);
  }

  setLiquidacion(data) {
    return this.api.apiCall("liquidacion-Ren-Tasas/set-liquidacion", "POST", data);
  }

  setLiquidacionTA(data) {
    return this.api.apiCall("liquidacion/set-liquidacion-tasas", "POST", data);
  }

  getConceptos() {
    return this.api.apiCall('concepto/get-conceptos', 'POST', {})
  }

  getCatalogo(data) {
    return this.api.apiCall("rentas/tasas/tasas-varias/getCatalogo", "POST", data);
  }

  getTasasVarias(data:any = {}) {
    return this.api.apiCall("rentas/tasas/tasas-varias/obtenerTasasVarias","POST",data);
  }

  getTablasConfig(data:any = {}) {
    return this.api.apiCall("tasas-configuracion/obtenerTasasConfiguracion","POST",data);
  }

  getLiquidacionesByCod(data) {
    return this.api.apiCall("liquidacion/get-liquidaciones-by-codigo", "POST", data);
  }

  aprobarLiquidacion(id) {
    return this.api.apiCall(`aranceles/cobrar/${id}`, 'POST', {});
  }

  getStaConcepto(data) {
    return this.api.apiCall('concepto/get-sta-concepto', 'POST', data);
  }

  // createTasasVarias(data:any) {
  //   return this.api.apiCall("rentas/tasas/tasas-varias/guardarTasasVarias","POST",data);
  // }
  // editTasasVarias(id, data) {
  //   return this.api.apiCall(`rentas/tasas/tasas-varias/editarTasasVarias/${id}`,"POST",data);
  // }

  // deleteTasasVarias(id) {
  //   return this.api.apiCall(`rentas/tasas/tasas-varias/deleteTasasVarias/${id}`,"POST",{});
  // }

  getUltimoRegistro(data: any = {}) {
    return this.api.apiCall('liquidacion/get-ultima-liquidacion', 'POST', data) as any
  }

}
