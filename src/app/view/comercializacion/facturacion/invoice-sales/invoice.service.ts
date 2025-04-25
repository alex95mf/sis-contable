import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private apiService: ApiServices) { }

  getCatalogos(data) {
    return this.apiService.apiCall('productos/get-catalogos', 'POST', data);
  }

  getCustomers() {
    return this.apiService.apiCall("clientes/get-all-clients", "POST", {});
  }

  getImpuestos() {
    return this.apiService.apiCall('ordenes/get-impuestos', 'POST', {});
  }

  searchProduct(data) {
    return this.apiService.apiCall('productos/search-product-table', 'POST', data);
  }

  getDetQuotes(data) {
    return this.apiService.apiCall('quotes/get-Detail-Quotes', 'POST', data);
  }

  saveSales(data) {
    return this.apiService.apiCall('sales/save-sales', 'POST', data);
  }

  getTypeDocument(data) {
    return this.apiService.apiCall('sales/get-type-document', 'POST', data);
  }

  getNumautNumFac(data) {
    return this.apiService.apiCall('sales/get-numaut-numfac', 'POST', data);
  }

  validateStock(data) {
    return this.apiService.apiCall('sales/validate-stock', 'POST', data);
  }

  validateInvoicePend(data) {
    return this.apiService.apiCall('sales/validate-invoices-pendientes', 'POST', data);
  }
}
