import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class GestionGarantiaService {

  constructor(private api: ApiServices) { }

  getCatalogoConcepto(data) {
    return this.api.apiCall("proveedores/get-catalogo", "POST", data);
  }

  getRecDocumentosExport(data) {
    return this.api.apiCall("ordenPago/get-excel", "POST", data);
  }

  getGestionGarantia(data) {
    return this.api.apiCall("tesoreria/gestion-garantia", "POST", data);
  }  

  guardarObservacion(data) {
    return this.api.apiCall("tesoreria/set-gestion-garantia", "POST", data);
  }

  

}
