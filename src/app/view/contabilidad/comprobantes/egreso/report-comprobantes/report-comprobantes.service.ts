import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})

export class  ReportComprobantesService {

  constructor(private apiSrv: ApiServices) { }
  getReportComprobantes() {
    return this.apiSrv.apiCall('reporteComprob/get-allshowComprobante', 'POST', {});
  }

  getAllComprobantes(data) {
    return this.apiSrv.apiCall('reporteComprob/get-searchComprobante', 'POST', data);
  }

  getAllComprobantesDT() {
    return this.apiSrv.apiCall('reporteComprob/get-allshowComprobanteDt', 'POST',{});
  }

  getCommonInformationFormule(data) {
    return this.apiSrv.apiCall('parameters/search-types-catalog', 'POST', data);
  }
}
