import { Injectable } from '@angular/core';
import { ApiServices } from '../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ParametroService {

  constructor(private apiService: ApiServices) { }

  presentaTablaEmpresa() {
    return this.apiService.apiCall('seguridad/get-empresas', 'POST', {});
  }

  setempresa(data) {
    return this.apiService.apiCall('parameters/signup-company', 'POST', data);
  }

  getEmailExist(data) {
    return this.apiService.apiCall('parameters/validate-company', 'POST', data);
  }

  getEmpresaExist(data) {
    return this.apiService.apiCall('parameters/validate-company', 'POST', data);
  }

  getEmailSucursal(data) {
    return this.apiService.apiCall('parameters/validate-sucursal', 'POST', data);
  }

  getUsuario(data) {
    return this.apiService.apiCall('parameters/get-users', 'POST', data);
  }

  updateEmpresa(data) {
    return this.apiService.apiCall('parameters/upgrade-company', 'POST', data);
  }

  getEmpresa() {
    return this.apiService.apiCall('seguridad/get-empresas', 'POST', {});
  }

  getSucursalExist(data) {
    return this.apiService.apiCall('parameters/validate-sucursal', 'POST', data);
  }

  getSucursal(data) {
    return this.apiService.apiCall('parameters/get-sucursal', 'POST', data);
  }

  saveRowSucursal(data) {
    return this.apiService.apiCall('parameters/signup-sucursal', 'POST', data);
  }

  updateSucursal(data) {
    return this.apiService.apiCall('parameters/upgrade-sucursal', 'POST', data);
  }

  getCatalogos(data) {
    return this.apiService.apiCall('parameters/get-catalog', 'POST', data);
  }

  getValidaNameGlobal(data) {
    return this.apiService.apiCall('parameters/validate-catalog', 'POST', data);
  }

  getPermisionsGlobas(data) {
    return this.apiService.apiCall('menu/get-permisions', 'POST', data);
  }

  saveRowCatalogo(data) {
    return this.apiService.apiCall('parameters/signup-catalog', 'POST', data);
  }

  updateCatalogo(data) {
    return this.apiService.apiCall('parameters/upgrade-catalog', 'POST', data);
  }

  getDistinctCatalog() {
    return this.apiService.apiCall('parameters/distinct-catalog', 'POST', {});
  }

  getCatalogByType(data) {
    return this.apiService.apiCall('parameters/subgroup-catalog', 'POST', data);
  }

  getSisFiltersDocuments() {
    return this.apiService.apiCall('parameters/sis-documents-filters', 'POST', {});
  }

  getSisDocuments() {
    return this.apiService.apiCall('parameters/sis-documents', 'POST', {});
  }

  updateDocument(data) {
    return this.apiService.apiCall('parameters/patch-documents', 'POST', data);
  }

  obtenerCatalogos(data) {
    return this.apiService.apiCall("proveedores/get-catalogo", "POST", data);
  }
}

