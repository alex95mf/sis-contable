import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class GeneracionCompraTerrenoService {
  selectArriendo$ = new EventEmitter<any>()

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
    return this.api.apiCall('concepto/get-detalle-compra-terreno', 'POST', data);
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

  aprobarLiquidacion(id) {
    return this.api.apiCall(`aranceles/cobrarCTerreno/${id}`, 'POST', {});
  }

  setLiquidaciones(data: any = {})
  {
    return this.api.apiCall('liquidacion/set-liquidacionCTerreno', 'POST', data)
  }

  getPropiedades(id) {
    return this.api.apiCall("propiedad/get-propiedades/" + id, "POST", {});
  }

  updateContribuyente(data){
    return this.api.apiCall("contribuyente/editar-supervivencia","POST",data);
  }

  getCatalogos(data) {
    return this.api.apiCall("proveedores/get-catalogo", "POST", data);
  }

  getArriendos(data: any = {}) {
    return this.api.apiCall('aranceles/get-liquidaciones-ar', 'POST', data) as any
  }

}
