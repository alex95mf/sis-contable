import { Injectable,EventEmitter } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TrasladoService {

  constructor(
    private apiService: ApiServices
  ) { }
  
  listaBienes$ = new EventEmitter<any>();

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
 
  saveTrasladoBienes(data) {
    return this.apiService.apiCall('bienes/movimientos/save-traslado-bienes', 'POST', data);
  }
  
  getRecDocumentos(data) {
    return this.apiService.apiCall("ordenPago/get-rec-documento", "POST", data);
  }
  
  getTraladoBienesData(data) {
    return this.apiService.apiCall("bienes/movimientos/get-traslado-bienes", "POST", data);
  }

  
  getBodegas() {
    return this.apiService.apiCall('bodega/get-bodegaGeneral', 'POST', {});
  }
  getGrupoProducto(data) {
    return this.apiService.apiCall('productos/get-grupo-producto', 'POST', data);
  }
  getDetalleProducto(data) {
    return this.apiService.apiCall('bienes/movimientos/get-detalles-bienes', 'POST', data);
  }
  
  getProductos(data) {
    return this.apiService.apiCall("gestion-bienes/get-productos", "POST", data);
  }
  getFotoProducto(data) {
    return this.apiService.apiCall("productos/get-producto-fotos", "POST", data);
  }

  getBienesCustodiados(data){
    return this.apiService.apiCall("productos/get-bienes-custodiados", "POST", data);
  }
  getProductosEX(data,fk_grupo){
    return this.apiService.apiCall(`gestion-bienes/get-productos-traslado/${fk_grupo}`, 'POST',data);
 }

 getTrasladoConfig() {
  return this.apiService.apiCall("bienes/movimientos/get-traslado-config", "POST", {});
}

 
  


  
}