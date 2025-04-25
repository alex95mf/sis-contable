import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {

  constructor(
    private apiService: ApiServices
  ) { }


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
 
  savePrestamoBienes(data) {
    return this.apiService.apiCall('bienes/movimientos/save-prestamo-bienes', 'POST', data);
  }
  
  getRecDocumentos(data) {
    return this.apiService.apiCall("ordenPago/get-rec-documento", "POST", data);
  }
  
  getPrestamoBienesData(data) {
    return this.apiService.apiCall("bienes/movimientos/get-prestamo-bienes", "POST", data);
  }
  getPrestamoBienesSalidaData(data) {
    return this.apiService.apiCall("bienes/movimientos/get-prestamo-bienes-salida", "POST", data);
  }

  
  getBodegas() {
    return this.apiService.apiCall('bodega/get-bodegaGeneral', 'POST', {});
  }
  getGrupoProducto(data) {
    return this.apiService.apiCall('productos/get-grupo-producto', 'POST', data);
  }
  getDetalleProducto(data) {
    return this.apiService.apiCall('bienes/movimientos/get-detalles-prestamo-bienes', 'POST', data);
  }
  
  getProductos(data) {
    return this.apiService.apiCall("gestion-bienes/get-productos", "POST", data);
  }
  getProductosPrestamo(data,id){
    return this.apiService.apiCall(`gestion-bienes/get-productos-prestamo/${id}`, 'POST',data);
 }
  uploadAnexo(file, payload?: any) {
    return this.apiService.apiCallFile('general/upload-files', 'POST', file, payload)
  }
  
  getContribuyentesByFilter(data:any = {}) {
    return this.apiService.apiCall('contribuyente/get-contribuyentes', 'POST', data);
  }
  getAgentRetencion(data) {
    return this.apiService.apiCall("available/agent-retencion", "POST", data);
  }
  filterProvinceCity(data) {
    return this.apiService.apiCall("proveedores/filter-province-city", "POST", data);
  }

  saveContribuyente(data) {
    return this.apiService.apiCall("contribuyente/save-contribuyente", "POST", data);
  }

  getSubproductos(data){
    return this.apiService.apiCall(`gestion-bienes/get-productos-prestamo`, "POST", data);
  }

  
}