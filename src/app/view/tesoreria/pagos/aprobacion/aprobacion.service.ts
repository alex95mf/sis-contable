import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AprobacionService {

  constructor(private api: ApiServices) { }

  getCatalogoConcepto(data) {
    return this.api.apiCall("proveedores/get-catalogo", "POST", data);
  }

  getRecDocumentos(data) {
    return this.api.apiCall("ordenPago/get-rec-documento", "POST", data);
  }

  getRecDocumentosAprobar(data) {
    return this.api.apiCall("ordenPago/get-rec-documento-aprobar", "POST", data);
  }

  gestionOrdenPago(id, data) {
    return this.api.apiCall(`ordenPago/gestion-orden-pago/${id}`,"POST",data);
  }

  getRecDocumentosExport(data) {
    return this.api.apiCall("ordenPago/get-excel", "POST", data);
  }

  updateFecha(data,id) {
    return this.api.apiCall(`pagos/edit-orden-pago/${id}`, 'POST', data);
  }

  anularAprobacion(data: any = {}) {
    return this.api.apiCall('ordenPago/anular-aprobacion', 'POST', data) as any;
  }
}
