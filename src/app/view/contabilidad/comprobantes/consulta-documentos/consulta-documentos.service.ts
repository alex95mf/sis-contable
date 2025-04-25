import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ConsultaDocumentosService {

  constructor(private api: ApiServices) { }
  getRecDocumento(data) {
    return this.api.apiCall("multas/get-consultas", "POST", data);
  }
  guardarObservacion(data) {
    return this.api.apiCall("multas/update-consultas", "POST", data);
  }
  getRecDocumentoFiltro(data) {
    return this.api.apiCall("multas/get-consultas-filtro", "POST", data);
  }
}
