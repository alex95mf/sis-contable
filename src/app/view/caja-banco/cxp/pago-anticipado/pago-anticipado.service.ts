
import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class PagoAnticipadoService {

  constructor(private apiService: ApiServices) { }
  
  obtenerPagosAnticipados(data:any) {
    return this.apiService.apiCall('compras/obtenerPagosAnticipados', 'POST', data);
  }

  getAvailableCxP(data) {
    return this.apiService.apiCall('cxp/get-available', 'POST', data);
  }

  getAvailableCxPSpecific(data) {
    return this.apiService.apiCall('cxp/get-available-filters', 'POST', data);
  }

  obtenerCuentasPorPagar(data) {
    return this.apiService.apiCall('compras/obtenerCuentasPorPagar', 'POST', data);
  }
  
  getProveedores() {
    return this.apiService.apiCall('proveedores/show-table-proveedor', 'POST', {});
  }

  guardarPagoAnticipado(data:any) {
    return this.apiService.apiCall('compras/guardarPagoAnticipado', 'POST', data);
  }

  modificarPagoAnticipado(data:any) {
    return this.apiService.apiCall('compras/modificarPagoAnticipado', 'POST', data);
  }

  getBoxSmallXUsuario() {
    return this.apiService.apiCall('boxSmall/get-box-small-x-usuuario', 'POST', {});
  }

  getAccountsByDetails(data) {
    return this.apiService.apiCall('diario/accounts/get-details-banks', 'POST', data);
  }

  saveComprobante(data) {
    return this.apiService.apiCall('comprobanteEgreso/save-comprobante', 'POST', data);
  }

  getParametrosCuentas(data) {
    return this.apiService.apiCall('compras/getParametrosCuentas', 'POST', data);
  }

  getComprobanteEgreso(data) {
    return this.apiService.apiCall('compras/getComprobanteEgreso', 'POST', data);
  }

  getSucursales() {
    return this.apiService.apiCall('administracion/get-sucursal', 'POST', {});
  }

  anularPagoAnticipado(data) {
    return this.apiService.apiCall('compras/anularPagoAnticipado', 'POST', data);
  }

  getMovimientos(data) {
    return this.apiService.apiCall('compras/getMovimientos', 'POST', data);
  }

}
