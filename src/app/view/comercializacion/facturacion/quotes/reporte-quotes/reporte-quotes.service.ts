import { Injectable } from "@angular/core";
import { ApiServices } from "../../../../../services/api.service";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class ReporteQuotesService {

  constructor(private apiService: ApiServices, private http: HttpClient) { }

  getCliente() {
    return this.apiService.apiCall('reportsInvoice/get-cliente', 'POST', {});
  }

  getAsesor() {
    return this.apiService.apiCall('reportsInvoice/get-vendedor', 'POST', {});
  }

  getQuotes() {
    return this.apiService.apiCall('reporteCotizacion/get-showCotizaciones', 'POST', {});
  }

  getReportCotizacion(data){
    return this.apiService.apiCall('reporteCotizacion/get-allShowCotiza', 'POST', data);
  }

  getReportCotizacionDT(){
    return this.apiService.apiCall('reporteCotizacion/get-allShowCotizaDT', 'POST', {});
  }

  printData(data) {
    return this.apiService.apiCall('plandecuentas/save-data-print', 'POST', data);
  }
}

