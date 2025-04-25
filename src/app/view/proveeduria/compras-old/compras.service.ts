import { Injectable } from '@angular/core';
import { ApiServices } from '../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  constructor(private apiService: ApiServices) { }

  getTypeDocument(data) {
    return this.apiService.apiCall('sales/get-type-document', 'POST', data);
  }

  getImpuestos() {
    return this.apiService.apiCall('ordenes/get-impuestos', 'POST', {});
  }

  getUsuario() {
    return this.apiService.apiCall('buy/get-usuario', 'POST', {});
  }

  getCatalogos(data) {
    return this.apiService.apiCall('productos/get-catalogos', 'POST', data);
  }

  getProductProveeduria() {
    return this.apiService.apiCall('proveeduria/get-productos', 'POST', {});
  }

  saveBuyProv(data) {
    return this.apiService.apiCall('proveeduria/save-buy-proveeduria', 'POST', data);
  }

  updatedBuyProv(data) {
    return this.apiService.apiCall('proveeduria/updated-buy-proveeduria', 'POST', data);
  }

  getInvoice() {
    return this.apiService.apiCall('proveeduria/get-invoice', 'POST', {});
  }

  getUsRucExist(data) {
    return this.apiService.apiCall('buy/get-ruc-exist', 'POST', data);
  }

  getProveedores() {
    return this.apiService.apiCall('proveedores/get-proveedor', 'POST', {});
  }

}
