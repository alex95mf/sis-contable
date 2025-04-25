import { Injectable } from "@angular/core";
import { ApiServices } from "../../../../services/api.service";

@Injectable({
  providedIn: "root",
})
export class EstadoCuentaService {
  constructor(private apiService: ApiServices) {}

  getGrupos() {
    return this.apiService.apiCall("productos/get-grupos", "POST", {});
  }

  getSucursales() {
    return this.apiService.apiCall("administracion/get-sucursal", "POST", {});
  }

  getContribuyentesData(data?:any) {
    if(data){
      return this.apiService.apiCall('contribuyente/get-contribuyentes', 'POST', data);
    } else {
      return this.apiService.apiCall('contribuyente/get-contribuyentes', 'POST', {})
    }
  }

  getDeudas(data: any = {}) {
    return this.apiService.apiCall("contribuyente/get-deudas", "POST", data);
  }

  getConceptosLiquidacion(data) {
    return this.apiService.apiCall("liquidacion/get-conceptos-liquidacion", "POST", data);
  }

  getConceptosLiquidacionTodas(data) {
    return this.apiService.apiCall("liquidacion/get-conceptos-liquidacion-todas", "POST", data);
  }
  getConceptosLiquidacionRp(data) {
    return this.apiService.apiCall("liquidacion/get-conceptos-liquidacion-rp", "POST", data);
  }
  getConceptosLiquidacionTa(data) {
    return this.apiService.apiCall("liquidacion/get-conceptos-liquidacion-ta", "POST", data);
  }

  cargarDetallesIntereses(data: any) {
    return this.apiService.apiCall('contribuyente/get-detalles-intereses','POST', data);
  }

  getConceptos() {
    return this.apiService.apiCall('recaudacion/get-conceptos', 'POST', {})
  }



}
