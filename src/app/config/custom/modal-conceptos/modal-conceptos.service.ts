import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ModalConceptosService {

  constructor(private api: ApiServices) { }

  getConceptoDetFiltro(data) {
    return this.api.apiCall('concepto/get-detalle-filtro','POST',data);
  }

  getConceptoDetByCod(data) {
    return this.api.apiCall('concepto/get-detalle-by-codigo','POST',data);
  }
}
