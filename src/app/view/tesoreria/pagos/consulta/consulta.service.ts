import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  constructor(private api: ApiServices) { }

  getCatalogoConcepto(data) {
    return this.api.apiCall("proveedores/get-catalogo", "POST", data);
  }

  getRecDocumentos(data) {
    return this.api.apiCall("ordenPago/get-rec-documento", "POST", data);
  }
  gestionOrdenPago(id, data) {
    return this.api.apiCall(`ordenPago/gestion-orden-pago/${id}`,"POST",data);
  }
  getRecDocumentosExport(data) {
    return this.api.apiCall("ordenPago/get-excel", "POST", data);
  }
}
