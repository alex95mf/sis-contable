import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConsultaGService {
constructor(private apiService: ApiServices, private http: HttpClient) { }

 /*  getGatosAll() {
    return this.apiService.apiCall('consulta-imp-gasto/get-show-gastos', 'POST', {});
  } */

  getGastos() {
    return this.apiService.apiCall('importacion/get-gastos-importacion', 'POST', {});
  }

  getProveedores() {
    return this.apiService.apiCall('proveedores/get-proveedor', 'POST', {});
  }

  getTipoGastos() {
    return this.apiService.apiCall('importacion/get-tipo-gastos', 'POST', {});
  }

  getImportacionGastos(data) {
    return this.apiService.apiCall('consulta-imp-gasto/get-show', 'POST', data);
  }

  getTypeDocument(data) {
    return this.apiService.apiCall('sales/get-type-document', 'POST', data);
  }

  getLiquidacionesGastos() {
    return this.apiService.apiCall('importacion/get-liquidaciones-gastos', 'POST', {});
  }

  getPedidosGastos() {
    return this.apiService.apiCall('importacion/get-pedidos-gastos', 'POST', {});
  }

  getPedidosGastosAll() {
    return this.apiService.apiCall('importacion/get-pedidos-gastosAll', 'POST', {});
  }

  getDtGastoView(){
    return this.apiService.apiCall('consulta-imp-gasto/get-show-DT', 'POST', {});
  }
}
