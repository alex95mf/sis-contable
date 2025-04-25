import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class EmisionArancelesService {
  exoneracionContribuyente$ = new EventEmitter<any>()

  constructor(private api: ApiServices) { }

  getLiquidaciones(data) {
    return this.api.apiCall("aranceles/get-documentoArancel", "POST", data);
  }

  

  getLiquidacionCompleta(data) {
    return this.api.apiCall(`liquidacion/get-liquidacion-completa/${data}`, 'POST', {})
  }

  setLiquidacion(data) {
    return this.api.apiCall("aranceles/generar", "POST", data);
  }

  setArancelesEmision(data) {
    return this.api.apiCall("aranceles/emision-generar", "POST", data);
  }

  aprobacionEmision(data) {
    return this.api.apiCall("aranceles/aprobacion-generar", "POST", data);
  }

  getContribuyentes(data:any = {}) {
    return this.api.apiCall('contribuyente/get-contribuyentes', 'POST', data);
  }

  getAranceles(data:any = {}) {
    return this.api.apiCall("aranceles/get-aranceles", "POST", data);
  }

  getPropiedades(id) {
    return this.api.apiCall("propiedad/get-propiedades/" + id, "POST", {});
  }

  getCalculoSubtotal(data, arancel) {
    return this.api.apiCall("aranceles/get-monto/" + arancel, "POST", data);
  }

  getExoneraciones(data: any = {}) {
    return this.api.apiCall('aranceles/get-exoneraciones-codigo', 'POST', data)
  }

  anularLiquidacion(id) {
    return this.api.apiCall('aranceles/anular/'+id,'POST',{});
  }

  aprobarLiquidacion(id) {
    return this.api.apiCall(`aranceles/cobrar/${id}`, 'POST', {});
  }
}
