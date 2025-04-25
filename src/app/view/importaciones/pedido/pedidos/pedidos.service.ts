import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

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

  getSecuencia(data) {
    return this.apiService.apiCall('importacion/get-secuencia', 'POST', data);
  }

  saveorder(data) {
    return this.apiService.apiCall('importacion/save-order-importacion', 'POST', data);
  }

  getPedidos() {
    return this.apiService.apiCall('importacion/get-pedidos', 'POST', {});
  }

  deletePedido(data) {
    return this.apiService.apiCall('importacion/delete-pedidos', 'POST', data);
  }

  updatedPedido(data) {
    return this.apiService.apiCall('importacion/updated-pedidos', 'POST', data);
  }

}
