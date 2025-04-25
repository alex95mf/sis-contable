import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ReporteCobranzasService {

  constructor(private apiService: ApiServices) { }

  getCuentasXCobrar() {
    return this.apiService.apiCall('reportsCobranzas/get-data', 'POST', {});
  }
  
  tablaReportdos(data) {
    return this.apiService.apiCall('reportsCobranzas/get-data-dos', 'POST', data);
  }

  getCliente() {
    return this.apiService.apiCall('reportsInvoice/get-cliente', 'POST', {});
  }

  getFactura() {
    return this.apiService.apiCall('reportsCobranzas/get-dataFV', 'POST', {});
  }
 
  getRetencion() {
    return this.apiService.apiCall('reportsCobranzas/get-dataRT', 'POST', {});
  }

  getCuentasXCobrarDT() {
    return this.apiService.apiCall('reportsCobranzas/get-data-dt', 'POST', {});
  }

  getDocument() {
    return this.apiService.apiCall('reportsCobranzas/get-documento', 'POST', {});
  }

  
}
