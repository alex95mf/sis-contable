import { Injectable } from "@angular/core";
import { ApiServices } from "../../../../services/api.service";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DevolucionesService {

  constructor(private apiService: ApiServices, private http: HttpClient) { }

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

  saveDevolucion(data) {
    return this.apiService.apiCall('devolucion/save-devoluciones', 'POST', data);
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

  getVentasDevolucion(data){
    return this.apiService.apiCall('devoluciones/get-invoices', 'POST', data);
  }

  getVentasDevolucionXCliente(data){
    return this.apiService.apiCall('devoluciones/get-invoices-x-cliente', 'POST', data);
  }

  getDevolucion(data){
    return this.apiService.apiCall('devolucion/get-devolucion', 'POST', data);
  }

  deleteDevolucion(data){
    return this.apiService.apiCall('devolucion/delete-devolucion', 'POST', data);
  }

  updatedDevolucion(data){
    return this.apiService.apiCall('devolucion/updated-devolucion', 'POST', data);
  }

}

