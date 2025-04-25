import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AdquisicionesService {

  constructor(private apiService: ApiServices) { }

  validateSecuencial(data) {
      return this.apiService.apiCall('activos/validation-code', 'POST', data);
  }

  getInfoDEpreciaciones() {
    return this.apiService.apiCall('activos/get-depreciaciones', 'POST', {});
  }

  getCurrencys() {
    return this.apiService.apiCall('bancos/get-currencys', 'POST', {});
  }

  filterProvinceCity(data) {
    return this.apiService.apiCall("proveedores/filter-province-city", "POST", data);
  }

  getCatalogos(data) {
    return this.apiService.apiCall('productos/get-catalogos', 'POST', data);
  }

  saveRowCatalogo(data) {
    return this.apiService.apiCall('parameters/signup-catalog', 'POST', data);
  }

  getValidaNameGlobal(data) {
    return this.apiService.apiCall('parameters/validate-catalog', 'POST', data);
  }

  getTypeDocument(data) {
    return this.apiService.apiCall('sales/get-type-document', 'POST', data);
  }

  getProveedores() {
    return this.apiService.apiCall('proveedores/get-proveedor', 'POST', {});
  }

  getImpuestos() {
    return this.apiService.apiCall('ordenes/get-impuestos', 'POST', {});
  }

  searchActivos() {
    return this.apiService.apiCall('activos/get-adquisiciones', 'POST', {});
  }

  saveActivo(data) {
    return this.apiService.apiCall('activos/add-adquisiciones', 'POST', data);
  }

  updatedActivo(data) {
    return this.apiService.apiCall('activos/set-adquisiciones', 'POST', data);
  }

}
