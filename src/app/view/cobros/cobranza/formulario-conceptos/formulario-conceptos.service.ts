import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class FormularioConceptosService {

  constructor(
    private api: ApiServices
  ) { }

  getLiqByContribuyente(data) {
    return this.api.apiCall("liquidacion/get-liquidacionesPg", "POST", data);
  }

  getConceptos() {
    return this.api.apiCall('concepto/get-conceptos', 'POST', {});
  }

  getPermisionsGlobas(data) {
    return this.api.apiCall('menu/get-permisions', 'POST', data);
  }

  getLiqByContribuyenteExport(data) {
    return this.api.apiCall("liquidacion/get-liquidacionesALL", "POST", data);
  }

  
}
