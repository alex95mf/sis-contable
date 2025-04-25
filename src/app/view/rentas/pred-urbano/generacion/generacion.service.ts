import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class GeneracionService {
  exoneracionContribuyente$ = new EventEmitter<any>()

  constructor(private api: ApiServices) { }

  liquidacionSelected$ = new EventEmitter<any>()

  getPeriodos(data: any = {}) {
    return this.api.apiCall('planificacion/get-periodos', 'POST', data)
  }

  getLiquidaciones(data) {
    return this.api.apiCall("aranceles/get-liquidaciones", "POST", data);
  }

  getLiquidacionCompleta(data) {
    return this.api.apiCall(`liquidacion/get-liquidacion-completa/${data}`, 'POST', {})
  }

  setLiquidacion(data) {
    return this.api.apiCall("aranceles/generar-pu", "POST", data);
  }

  updateLiquidacion(data) {
    return this.api.apiCall("aranceles/actualizar-pu", "POST", data);
  }

  getContribuyentes(data?:any) {
    if(data){
      return this.api.apiCall('contribuyente/get-contribuyentes', 'POST', data);
    } else {
      return this.api.apiCall('contribuyente/get-contribuyentes', 'POST', {})
    }
  }

  getConceptoConfig(data: any = {}) {
    return this.api.apiCall('concepto/obtener-concepto-filtro', 'POST', data).toPromise<any>();
  }

  getConceptoDetalle(data: any = {}) {
    // return this.api.apiCall('concepto/get-detalle', 'POST', data);
    return this.api.apiCall('concepto/get-detalle-by-codigo', 'POST', data);
  }

  getPropiedades(id: number, data: any = {}) {
    return this.api.apiCall("propiedad/get-propiedades/" + id, "POST", data);
  }

  getValoresPropiedad(data: any = {}) {
    return this.api.apiCall('propiedad/get-valores-propiedad', 'POST', data)
  }

  //ENDPOINT PARA GENERAR COMPROBANTE DE DEUDAS
  aprobarLiquidacion(id) {
    return this.api.apiCall(`aranceles/cobrar/${id}`, 'POST', {});
  }

  getCalculoSubtotal(data, arancel) {
    return this.api.apiCall("aranceles/get-monto/" + arancel, "POST", data);
  }

  getExoneraciones(data) {
    return this.api.apiCall('aranceles/get-exoneraciones-pu', 'POST', data);
  }

  anularLiquidacion(id) {
    return this.api.apiCall('aranceles/anular/'+id,'POST',{});
  }

  getUltimoRegistro(data: any = {}) {
    return this.api.apiCall('liquidacion/get-ultima-liquidacion', 'POST', data).toPromise<any>()
  }
}
