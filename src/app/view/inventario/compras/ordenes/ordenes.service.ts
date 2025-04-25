import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class OrdenesService {

  constructor(private apiService: ApiServices) { }

  getProveedores() {
    return this.apiService.apiCall('proveedores/get-proveedor', 'POST', {});
  }

  getUsers() {
    return this.apiService.apiCall('ordenes/get-dataUsers', 'POST', {});
  }

  searchProduct(data) {
    return this.apiService.apiCall('productos/get-product-type', 'POST', data);
  }

  getEmpleado() {
    return this.apiService.apiCall('administracion/get-empleados', 'POST', {});
  }

  getImpuestos() {
    return this.apiService.apiCall('ordenes/get-impuestos', 'POST', {});
  }

  geSolicitudes(data) {
    return this.apiService.apiCall('ordenes/get-solicitudes', 'POST', data);
  }

  getEmailExist(data) {
    return this.apiService.apiCall('administracion/validate-email', 'POST', data);
  }

  saveOrdersBuy(data) {
    return this.apiService.apiCall('ordenes/save-order-buy', 'POST', data);
  }

  presentaTablaOrder() {
    return this.apiService.apiCall('ordenes/get-table-order', 'POST', {});
  }

  deleteOrder(data) {
    return this.apiService.apiCall('ordenes/delete-order', 'POST', data);
  }

  getDetOrder(data) {
    return this.apiService.apiCall('ordenes/get-det-order', 'POST', data);
  }

  updatePermissions(data) {
    return this.apiService.apiCall('ordenes/update-status-order', 'POST', data);
  }

  printData(data){
    return this.apiService.apiCall('plandecuentas/save-data-print', 'POST', data);
  } 

  sendMailOrder(data){
    return this.apiService.apiCall('ordenes/send-order-attachment', 'POST', data);
  } 

  getEmailsProviders(data){
    return this.apiService.apiCall('ordenes/get-emails-providers', 'POST', data);
  }

  geUserAprobated(data){
    return this.apiService.apiCall('ordenes/get-user-aprobated', 'POST', data);
  }

  getSucursales(data) {
    return this.apiService.apiCall('seguridad/get-sucursal', 'POST', data);
  }

  fileService(file, payload?: any) {
    return this.apiService.apiCallFile('general/upload-files', 'POST', file, payload);
  }
  
}
