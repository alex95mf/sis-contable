import { EventEmitter,Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class MultasService {

  constructor(private api: ApiServices) { }

  listaConceptos$ = new EventEmitter<any>();

  getContribuyentes(data?:any) {
    if(data){
      return this.api.apiCall('contribuyente/get-contribuyentes', 'POST', data);
    } else {
      return this.api.apiCall('contribuyente/get-contribuyentes', 'POST', {})
    }
  }

  getInspecciones(data){
    return this.api.apiCall('inspeccion/get-ordenes-filter','POST',data);
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

  getConceptoDetFiltro(data) {
    return this.api.apiCall('concepto/get-detalle-filtro','POST',data);
  }

  getLiquidaciones(data) {
    return this.api.apiCall("aranceles/get-liquidaciones", "POST", data);
  }

  getLiquidacionesByCod(data) {
    return this.api.apiCall("liquidacion/get-liquidaciones-by-codigo", "POST", data);
  }

  getLiquidacionCompleta(data) {
    return this.api.apiCall(`liquidacion/get-liquidacion-completa/${data}`, 'POST', {})
  }

  getInspeccion(data) {
    return this.api.apiCall('inspeccion/get-inspeccion', 'POST', data);
  }

  getLocales(data) {
    return this.api.apiCall('inspeccion/get-locales-contribuyente','POST', data);
  }

  setLiquidacion(data) {
    return this.api.apiCall("liquidacion/set-liquidacion", "POST", data);
  }
  
  aprobarLiquidacion(id) {
    return this.api.apiCall(`aranceles/cobrar/${id}`, 'POST', {});
  }

  getConceptoDetByCod(data) {
    return this.api.apiCall('concepto/get-detalle-by-codigo','POST',data);
  }

  getStaConcepto(data) {
    return this.api.apiCall('concepto/get-sta-concepto', 'POST', data);
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
