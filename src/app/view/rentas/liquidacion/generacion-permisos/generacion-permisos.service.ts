import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class GeneracionPermisosService {

  constructor(private api: ApiServices) { }

  getContribuyentes(data?:any) {
    if(data){
      return this.api.apiCall('contribuyente/get-contribuyentes', 'POST', data);
    } else {
      return this.api.apiCall('contribuyente/get-contribuyentes', 'POST', {})
    }
  }

  getLiquidaciones(data) {
    return this.api.apiCall("aranceles/get-liquidaciones", "POST", data);
  }
  

  getExoneraciones(data) {
    return this.api.apiCall('aranceles/get-exoneraciones-codigo', 'POST', data);
  }

  getConceptoDetalle(data) {
    return this.api.apiCall('concepto/get-detalle', 'POST', data);
  }


  getLiquidacionCompleta(data) {
    return this.api.apiCall(`liquidacion-Ren-Tasas/get-liquidacion-completa/${data}`, 'POST', {})
  }

  getInspeccion(data) {
    return this.api.apiCall('inspeccion/get-inspeccion', 'POST', data);
  }

  setLiquidacion(data) {
    return this.api.apiCall("liquidacion/set-liquidacion", "POST", data);
  }

  // liquidacion-Ren-Tasas/set-liquidacion ,url anterior nose a cual redirige?,

  aprobarLiquidacion(id) {
    return this.api.apiCall(`aranceles/cobrarPermisos/${id}`, 'POST', {});
  }
  
  setLiquidaciones(data: any = {})
  {
    return this.api.apiCall('liquidacion/set-liquidacionPermisos', 'POST', data)
  }

  getPropiedades(id) {
    return this.api.apiCall("propiedad/get-propiedades/" + id, "POST", {});
  }

  crearCSupervivencia(data){
    return this.api.apiCall("contribuyente/crear-supervivencia","POST",data);
  }
  
  updateContribuyente(data){
    return this.api.apiCall("contribuyente/editar-supervivencia","POST",data);
  }
  

}
