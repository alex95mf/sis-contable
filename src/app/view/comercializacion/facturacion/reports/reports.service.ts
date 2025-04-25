import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private apiSrv: ApiServices) { }

  getReportQuotes(data) {
    return this.apiSrv.apiCall('reports/get-quotes', 'POST', data);
  }

  getAllReportQuotes(data) {
    return this.apiSrv.apiCall('reports/get-all-quotes', 'POST', data);
  }

  DownloadQuote(data) {
    return this.apiSrv.apiCall('reports/download-quote', 'POST', data);
  }

  DeleteQuote(data) {
    return this.apiSrv.apiCall('general/delete-file-quote', 'POST', data);
  }

  upgradeQuoteStatus(data) {
    return this.apiSrv.apiCall('quotes/change-status', 'POST', data);
  }

  upgradeFactStatus(data) {
    return this.apiSrv.apiCall('facture/change-status', 'POST', data);
  }

  deleteFacBuy(data) {
    return this.apiSrv.apiCall('sales/delete-facture', 'POST', data);
  }

  setAprobatedDoc(data) {
    return this.apiSrv.apiCall('devolucion/set-aprobated', 'POST', data);
  }

  setCancelDoc(data) {
    return this.apiSrv.apiCall('devolucion/set-cancel', 'POST', data);
  }

  getTypeDocument(data) {
    return this.apiSrv.apiCall('sales/get-type-document', 'POST', data);
  }

  descargar(data) {
    return this.apiSrv.getTipoBlob("/general/download-files", data);
  }
}
