import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class GestionMovimientoBancarioService {

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

  getMovimientoBancario(data) {
    return this.api.apiCall("tesoreria/movimiento-bancarios", "POST", data);
  }

  guardarNumeroPreImpreso(data) {
    return this.api.apiCall("tesoreria/set-movimiento-bancarios", "POST", data);
  }
  
}
