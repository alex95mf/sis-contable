import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
    providedIn: 'root'
})
export class IngresoService {
    constructor(private apiService: ApiServices) { }

    getAccountsByDetails(data) {
        return this.apiService.apiCall('diario/accounts/get-details', 'POST', data);
    }

    getCommonInformationFormule(data) {
        return this.apiService.apiCall('parameters/search-types-catalog', 'POST', data);
    }

    getProductInformation(data) {
        return this.apiService.apiCall('productos/get-products-information', 'POST', data);
    }

    getGrupos() {
        return this.apiService.apiCall('productos/get-grupos', 'POST', {});
    }

    getCatalogos(data) {
        return this.apiService.apiCall('productos/get-catalogos', 'POST', data);
    }

    getValidaNameGlobal(data) {
        return this.apiService.apiCall('parameters/validate-catalog', 'POST', data);
    }

    saveRowCatalogo(data) {
        return this.apiService.apiCall('parameters/signup-catalog', 'POST', data);
    }

    validateSecuencial(data) {
        return this.apiService.apiCall('productos/validate-secuencial', 'POST', data);
    }

    validateProducto(data) {
        return this.apiService.apiCall('productos/validate-producto', 'POST', data);
    }

    getUDM() {
        return this.apiService.apiCall('productos/UDM', 'POST', {});
    }

    getMaxCodeChildren(data) {
        return this.apiService.apiCall('productos/get-max-code', 'POST', data);
    }

    searchProduct(data) {
        return this.apiService.apiCall('productos/search-product', 'POST', data);
    }

    deleteProduct(data) {
        return this.apiService.apiCall('productos/delete-product', 'POST', data);
    }

    saveProduct(data) {
        return this.apiService.apiCall('productos/create-product', 'POST', data);
    }

    updateProduct(data) {
        return this.apiService.apiCall('productos/update-product', 'POST', data);
    }

    fileService(file, payload?: any) {
        return this.apiService.apiCallFile('general/upload-files', 'POST', file, payload);
    }

    updateFile(file, payload?: any) {
        return this.apiService.apiCallFile('proveedores/patch-files', 'POST', file, payload);
    }

    patchFile(file, payload?: any) {
        return this.apiService.apiCallFile('general/patch-files', 'POST', file, payload);
    }

    getSucursalInformation() {
        return this.apiService.apiCall('administracion/get-sucursal', 'POST', {});
    }

    getUDMMagnitudeConversion(data) {
        return this.apiService.apiCall('udm/get-conversions', 'POST', data);
    }

    getAvailableAranceles() {
        return this.apiService.apiCall('arancel/get-available', 'POST', {});
    }

    filterProvinceCity(data) {
        return this.apiService.apiCall("proveedores/filter-province-city", "POST", data);
    }

    getCurrencys() {
        return this.apiService.apiCall('bancos/get-currencys', 'POST', {});
    }

    descargar(data) {
        return this.apiService.getTipoBlob("/general/download-files", data);
    }
}