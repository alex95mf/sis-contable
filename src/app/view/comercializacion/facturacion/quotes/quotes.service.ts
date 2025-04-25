import { Injectable } from "@angular/core";
import { ApiServices } from "../../../../services/api.service";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class QuotesService {

  constructor(private apiService: ApiServices, private http: HttpClient) { }

  getCustomers() {
    return this.apiService.apiCall("clientes/get-all-clients", "POST", {});
  }

  getCatalogos(data) {
    return this.apiService.apiCall('productos/get-catalogos', 'POST', data);
  }

  searchProduct(data) {
    return this.apiService.apiCall('productos/search-product-table', 'POST', data);
  }

  getImpuestos() {
    return this.apiService.apiCall('ordenes/get-impuestos', 'POST', {});
  }

  saveQuotes(data) {
    return this.apiService.apiCall('quotes/save-quotes', 'POST', data);
  }

  descargar(data) {
    return this.apiService.getTipoBlob("/general/download-files", data);
  }

  DownloadQuote(data) {
    return this.apiService.apiCall('reports/download-quote', 'POST', data);
  }

  DeleteQuote(data) {
    return this.apiService.apiCall('general/delete-file-quote', 'POST', data);
  }
}
