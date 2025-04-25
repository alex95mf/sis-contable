import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class BodegaDespachoService {

  constructor(private apiService: ApiServices) { }

  getSalesInvoice(data) {
    return this.apiService.apiCall('dispatch/get-sales-invoice', 'POST', data);
  }

  printData(data) {
    return this.apiService.apiCall('plandecuentas/save-data-print', 'POST', data);
  }

  getDetFactura(data) {
    return this.apiService.apiCall('dispatch/get-detail-invoice', 'POST', data);
  }

  getImpuestos() {
    return this.apiService.apiCall('ordenes/get-impuestos', 'POST', {});
  }

  saveDispached(data) {
    return this.apiService.apiCall('dispatch/save-dispached', 'POST', data);
  }

}
