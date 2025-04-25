import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AnulacionService {

  constructor(private api: ApiServices) { }

  getConceptos() {
    return this.api.apiCall('concepto/get-conceptos', 'POST', {})
  }

  getLiquidacionesByCod(data) {
    return this.api.apiCall("liquidacion/get-liquidaciones-by-codigo", "POST", data);
  }

  getLiqByContribuyente(data) {
    return this.api.apiCall("liquidacion/get-liquidaciones-by-contribuyente", "POST", data);
  }

  getLiqById(id) {
    return this.api.apiCall(`liquidacion/get-liquidacion/${id}`,"POST",{});
  }

  setAnulacion(data) {
    return this.api.apiCall("liquidacion/set-anulacion", "POST", data);
  }

  aprobarLiquidacion(data, id) {
    return this.api.apiCall(`aranceles/cobrar/${id}`, 'POST', data);
  }

  getCatalogos(data: any) {
    return this.api.apiCall('proveedores/get-catalogo', 'POST', data)
  }

}
