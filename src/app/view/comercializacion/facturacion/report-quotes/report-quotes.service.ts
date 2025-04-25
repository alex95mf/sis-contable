import { Injectable } from "@angular/core";
import { ApiServices } from "../../../../services/api.service";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ReportQuotesService {

  constructor(private apiSrv: ApiServices, private http: HttpClient) { }

  getClients() {
    return this.apiSrv.apiCall('reportsInvoice/get-cliente', 'POST', {});
  }

  getVendedor() {
    return this.apiSrv.apiCall('reportsInvoice/get-vendedor', 'POST', {});
  }

  showserchReports(data){
    return this.apiSrv.apiCall('reportsQuotes/search-reports-quotes', 'POST', data);
  }

  showserchClienteDos(data){
    return this.apiSrv.apiCall('reportsInvoiceModal/search-cliente', 'POST', data);
  }

  ReportsDetalle(params){
    return this.apiSrv.apiCall('reportsQuotes/search-reportsDet-quotes', 'POST', params);
  }

  getImpuestos() {
    return this.apiSrv.apiCall('ordenes/get-impuestos', 'POST', {});
  }

}
