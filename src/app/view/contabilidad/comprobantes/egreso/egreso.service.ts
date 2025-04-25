import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';


@Injectable({
  providedIn: 'root'
})
export class EgresoService {
  constructor(private apiService: ApiServices) { }

  getAccountsByDetails(data) {
    return this.apiService.apiCall('diario/accounts/get-details', 'POST', data);
  }

  getCatalogs(data) {
    return this.apiService.apiCall("proveedores/get-catalogo", "POST", data);
  }

  getValidaNameGlobal(data) {
    return this.apiService.apiCall('parameters/validate-catalog', 'POST', data);
  }

  saveRowCatalogo(data) {
    return this.apiService.apiCall('parameters/signup-catalog', 'POST', data);
  }

  filterProvinceCity(data) {
    return this.apiService.apiCall("proveedores/filter-province-city", "POST", data);
  }

  getCatalogos(data) {
    return this.apiService.apiCall('productos/get-catalogos', 'POST', data);
  }

  saveComprobante(data) {
    return this.apiService.apiCall('comprobanteEgreso/save-comprobante', 'POST', data);
  }

  getCommonInformationFormule(data) {
    return this.apiService.apiCall('parameters/search-types-catalog', 'POST', data);
  }

  getAvailableMoney(data) {
    return this.apiService.apiCall('get-available-money', 'POST', data);
  }

  getVouchers() {
    return this.apiService.apiCall('comprobanteEgreso/get-vouchers', 'POST', {});
  }

  updatedComprobante(data) {
    return this.apiService.apiCall('comprobanteEgreso/updated-comprobante', 'POST', data);
  }

  getCentroCosto() {
    return this.apiService.apiCall('boxSmall/get-centro-costo', 'POST', {});
  }

  getSucursales() {
    return this.apiService.apiCall('administracion/get-sucursal', 'POST', {});
  }

  deleteComprobante(data) {
    return this.apiService.apiCall('comprobanteEgreso/delete-comprobante', 'POST', data);
  }

  getNotasDebito(data) {
    return this.apiService.apiCall("notascreditodebito/get-notas-credito-debito-all", "POST", data);
  }

}
