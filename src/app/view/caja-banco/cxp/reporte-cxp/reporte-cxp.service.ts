import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ReporteCxpService {

  constructor(private apiService: ApiServices) { }

 
  getReportCXP(data) {
    return this.apiService.apiCall('reporte-cxp/get-show', 'POST', data);
  }

  getProveedores() {
    return this.apiService.apiCall('reports/get-Proveedores', 'POST', {});
  }

  getFactura() {
    return this.apiService.apiCall('reporte-cxp/get-dataFC', 'POST', {});
  }
 
  getRetencion() {
    return this.apiService.apiCall('reportsCobranzas/get-dataRT', 'POST', {});
  }

  
  getDocument() {
    return this.apiService.apiCall('reportsCobranzas/get-documento', 'POST', {});
  }

  getCuentasXpagarDT() {
    return this.apiService.apiCall('reportsDt/get-data-dt', 'POST', {});
  }


  getUsers(){
    return this.apiService.apiCall('buy/get-usuario', 'POST', {});
  }
   
  

}
