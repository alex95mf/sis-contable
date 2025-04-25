import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class RecepcionService {

  constructor(private apiService: ApiServices) { }

  getCatalogos(data) {
    return this.apiService.apiCall('productos/get-catalogos', 'POST', data);
  }

  getCurrencys() {
    return this.apiService.apiCall('bancos/get-currencys', 'POST', {});
  }

  getProveedores() {
    return this.apiService.apiCall('proveedores/get-proveedor', 'POST', {});
  }
  
  searchProduct(data) {
    return this.apiService.apiCall('productos/get-product-type', 'POST', data);
  }

  getImpuestos() {
    return this.apiService.apiCall('ordenes/get-impuestos', 'POST', {});
  }

  getIcoterms() {
    return this.apiService.apiCall('importacion/get-icoterms', 'POST', {});
  }

  getPedidos() {
    return this.apiService.apiCall('importacion/get-pedido-cerrados-received', 'POST', {});
  }

  saveRecepcionPedido(data) {
    return this.apiService.apiCall('importacion/save-pedido-recibido', 'POST', data);
  }

  deleteRecepcionPedido(data) {
    return this.apiService.apiCall('importacion/delete-pedido-recibido', 'POST', data);
  }
  
}
