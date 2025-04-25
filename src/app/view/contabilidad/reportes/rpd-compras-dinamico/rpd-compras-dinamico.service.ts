import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';  

@Injectable({
  providedIn: 'root'
})
export class RpdComprasDinamicoService {

  constructor(private apiService: ApiServices) { }



  getConfiguracionReport( id : number){
    return this.apiService.apiCall(`contabilidad/reporte_dinamic/${id}`, 'GETV1', {});
  }

  getTypeDocument(data) {
    return this.apiService.apiCall('sales/get-type-document', 'POST', data);
  }


  updateAsignaCampo(data) {
    return this.apiService.apiCall('contabilidad/reporte_dinamic/update', 'POST', data);
  }


  getReportXlsx(data) {
    return this.apiService.apiCall('contabilidad/reporte_dinamic/get_report', 'POST', data);
  }
  

}
