import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class GastosService {

  constructor(private apiService: ApiServices) { }

  getProveedores() {
    return this.apiService.apiCall('proveedores/get-proveedor', 'POST', {});
  }

  getSecuencia(data) {
    return this.apiService.apiCall('importacion/get-secuencia', 'POST', data);
  }

  getPedidosGastos() {
    return this.apiService.apiCall('importacion/get-pedidos-gastos', 'POST', {});
  }

  getLiquidacionesGastos() {
    return this.apiService.apiCall('importacion/get-liquidaciones-gastos', 'POST', {});
  }

  getTipoGastos() {
    return this.apiService.apiCall('importacion/get-tipo-gastos', 'POST', {});
  }

  getCatalogos(data) {
    return this.apiService.apiCall('productos/get-catalogos', 'POST', data);
  }

  getImpuestos() {
    return this.apiService.apiCall('ordenes/get-impuestos', 'POST', {});
  }

  saveGasto(data) {
    return this.apiService.apiCall('importacion/save-gasto-importacion', 'POST', data);
  }

  getTypeDocument(data) {
    return this.apiService.apiCall('sales/get-type-document', 'POST', data);
  }

  getCuentaIvaImportacion(data) {
    return this.apiService.apiCall('importacion/get-cuenta-iva-importacion', 'POST', data);
  }

  getGastos() {
    return this.apiService.apiCall('importacion/get-gastos-importacion', 'POST', {});
  }

  deleteGastos(data) {
    return this.apiService.apiCall('importacion/delete-gastos-importacion', 'POST', data);
  }

  updateGastos(data) {
    return this.apiService.apiCall('importacion/update-gastos-importacion', 'POST', data);
  }
  
}
