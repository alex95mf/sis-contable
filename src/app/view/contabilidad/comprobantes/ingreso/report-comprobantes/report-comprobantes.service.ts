import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})

export class  ReportComprobantesService {

  constructor(private apiSrvI: ApiServices) { }
  getCommonInformationFormule(data) {
    return this.apiSrvI.apiCall('parameters/search-types-catalog', 'POST', data);
  }
  
  getReportComprobantesI() {
    return this.apiSrvI.apiCall('reporte-ComprobIngreso/get-allshowComprobanteIn', 'POST', {});
  }

  getAllComprobantes(data) {
    return this.apiSrvI.apiCall('reporte-ComprobIngreso/get-searchComprobanteIn', 'POST', data);
  }


  getAllComprobantesDT() {
    return this.apiSrvI.apiCall('reporte-ComprobIngreso/get-allshowComprobanteDt', 'POST',{});
  }

 /*  getCliente() {
    return this.apiSrvI.apiCall('reportsInvoice/get-cliente', 'POST', {});
  } */

 
}
