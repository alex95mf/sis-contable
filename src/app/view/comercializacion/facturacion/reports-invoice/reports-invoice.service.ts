import { DataLoader } from '@amcharts/amcharts4/core';
import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ReportsServiceInvoice {

  constructor(private apiSrv: ApiServices) { }

  getClients() {
    return this.apiSrv.apiCall('reportsInvoice/get-cliente', 'POST', {});
  }

  getVendedor() {
    return this.apiSrv.apiCall('reportsInvoice/get-vendedor', 'POST', {});
  }

  showserchReports(data){
    return this.apiSrv.apiCall('reportsInvoice/search-reports', 'POST', data);
  }

  showserchClienteDos(data){
    return this.apiSrv.apiCall('reportsInvoiceModal/search-cliente', 'POST', data);
  }

  ReportsDetalle(data){
    return this.apiSrv.apiCall('reportsInvoiceModal/search-reports-detalle', 'POST', data);
  }

  getImpuestos() {
    return this.apiSrv.apiCall('ordenes/get-impuestos', 'POST', {});
  }
}