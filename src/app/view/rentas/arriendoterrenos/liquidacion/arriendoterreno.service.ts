import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ArriendoterrenoService {

  constructor(private apiarriendo: ApiServices) { }

  getLiquidaciones(data) {
   return this.apiarriendo.apiCall("aranceles/get-liquidaciones", "POST", data);
   }
  getLiquidacionesAr(data) {
    return this.apiarriendo.apiCall("aranceles/get-liquidaciones-ar", "POST", data);
    }
  getLiquidacionCompleta(data) {
    return this.apiarriendo.apiCall(`liquidacion/get-liquidacion-completa/${data}`, 'POST', {})
   }
   getLiquidacionExiste(data: any = {})
  {
    return this.apiarriendo.apiCall('liquidacion/get-liquidacionesArrExiste', 'POST', data);
  }
  setLiquidacion(data: any = {})
  {
    return this.apiarriendo.apiCall('liquidacion/set-liquidacionesArr', 'POST', data);
  }
  getContribuyentes(data?:any) {
    if(data){
      return this.apiarriendo.apiCall('contribuyente/get-contribuyentes', 'POST', data);
    } else {
      return this.apiarriendo.apiCall('contribuyente/get-contribuyentes', 'POST', {})
    }
  }
  getConceptoDetalle(data) {
    return this.apiarriendo.apiCall('concepto/get-detalle', 'POST', data);
  }
  getPropiedades(id) {
    return this.apiarriendo.apiCall("propiedad/get-propiedades/" + id, "POST", {});
  }
   getCalculoSubtotal(data, arancel) {
    return this.apiarriendo.apiCall("aranceles/get-monto/" + arancel, "POST", data);
 }
   getExoneraciones(data) {
   return this.apiarriendo.apiCall('aranceles/get-exoneraciones-codigo', 'POST', data);
   }

   //ENDPOINT PARA GENERAR COMPROBANTE DE DEUDAS
   aprobarLiquidacion(id) {
    return this.apiarriendo.apiCall(`aranceles/cobrar/${id}`, 'POST', {});
  }
  
  getArriendoTerrenoTabla(data) {
    return this.apiarriendo.apiCall("rentas/arriendos/liquidacion/getArriendoTerrenoTabla", 'POST', data);
  }

  getStaConcepto(data) {
    return this.apiarriendo.apiCall('concepto/get-sta-concepto', 'POST', data);
  }

}
