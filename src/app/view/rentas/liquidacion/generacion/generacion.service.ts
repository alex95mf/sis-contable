import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class GeneracionService {

  constructor(private api: ApiServices) { }

  exoneracionesSelected$ = new EventEmitter<any>();

  getLiquidaciones() 
  {
    return this.api.apiCall('liquidacion/get-liquidaciones', 'POST', {})
  }

  getLiquidacionFiltrada(data) {
    return this.api.apiCall('liquidacion/get-liquidaciones-filtro','POST',data);
  }

  getLiquidacionEmision(data) {
    return this.api.apiCall('liquidacion/get-liquidaciones-emision','POST',data);
  }

  getLiquidacionCompleta(data)
  {
    return this.api.apiCall(`liquidacion/get-liquidacion-completa/${data}`, 'POST', {})
  }

  setLiquidacion(data: any = {})
  {
    return this.api.apiCall('liquidacion/set-liquidacion', 'POST', data)
  }

  getContribuyentes(data?:any)
  {
    if(data){
      return this.api.apiCall('contribuyente/get-contribuyentes', 'POST', data)
    } else {
      return this.api.apiCall('contribuyente/get-contribuyentes', 'POST', {})
    }
  }

  getConceptos()
  {
    return this.api.apiCall('concepto/get-conceptos', 'POST', {})
  }

  getConceptoDetalles(data)
  {
    return this.api.apiCall('concepto/get-detalle', 'POST', data)
  }

  getTarifaById(data)
  {
    return this.api.apiCall('rentas/get-tarifa-detalles/' + data, 'POST', {})
  }

  aprobarLiquidacion(id) {
    return this.api.apiCall(`aranceles/cobrar/${id}`, 'POST', {});
  }
  getExoneraciones(data) {
    return this.api.apiCall('aranceles/get-exoneraciones-codigo', 'POST', data);
  }

  getUltimoRegistro(data: any = {}) {
    return this.api.apiCall('liquidacion/get-ultima-liquidacion', 'POST', data).toPromise<any>()
  }
}
