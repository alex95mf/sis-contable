import { Injectable,EventEmitter } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
    providedIn: 'root'
})
export class ProductoService {
    constructor(private apiService: ApiServices) { }

    bodegas$ = new EventEmitter<any>();
    setReclamo$ = new EventEmitter<any>();

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

    getValidaNameGlobalAsync(data) {
        return new Promise((resolve, reject) => {
            this.apiService.apiCall('parameters/validate-catalog', 'POST', data).subscribe(
                (res: any) => resolve(res),
                (err: any) => reject(err)
            )
        })
        // 
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

    saveProducto(data) {
        return this.apiService.apiCall('productos/create-producto', 'POST', data);
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

    getProductos(data) {
        return this.apiService.apiCall('ordenes/get-grupo-productos', 'POST', data);
    }

    countProductos(data) {
        return this.apiService.apiCall('ordenes/contar-productos', 'POST', data);
    }

    getRecDocumentos(data) {
        return this.apiService.apiCall("gestion-bienes/catalogo-bienes", "POST", data);
    }

    getSubgrupos(data) {
        return this.apiService.apiCall('gestion-bienes/get-subgruposGeneral', 'POST', data);
    }

    getSubproductos(data) {
        // return this.apiService.apiCall(`gestion-bienes/get-subgrupo-producto/${id}`, 'POST',data);
        return this.apiService.apiCall('gestion-bienes/get-newgrupo-producto', 'POST', data);
    }

    countProductosBienes(data) {
        return this.apiService.apiCall('gestion-bienes/crear-codigoBienes', 'POST', data);
    }

    listarCatalogo(data) {
        return this.apiService.apiCall('gestion-bienes/get-catalogo-producto', 'POST', data);
    }

    getProductosEX(data, id) {
        return this.apiService.apiCall(`gestion-bienes/get-productos/${id}`, 'POST', data);
    }

    getAllProducts(data) {
        return this.apiService.apiCall('gestion-bienes/get-all-products', 'POST', data);
    }

    getDepartamento(data) {
        return this.apiService.apiCall('bodega/get-departamento', 'POST', data)
    }

    updateAllIngresos(data) {
        return this.apiService.apiCall('productos/update-all-ingresos', 'POST', data);
    }

    // Carga de Producto desde Modal (getHistorialMantenimiento, getHistorialPoliza, getHistorialTraslado)
    getInfoProducto(id, data: any = {}) {
        return new Promise((resolve, reject) => {
            this.apiService.apiCall(`gestion-bienes/get-info-producto/${id}`, 'POST', data).subscribe(
                (res: any) => resolve(res.data),
                (err: any) => reject(err)
            )
        })
    }

    getCatalogo(data: any = {}) {
        return new Promise((resolve, reject) => {
            this.apiService.apiCall('proveedores/get-catalogo', 'POST', data).subscribe(
                (res: any) => resolve(res.data),
                (err: any) => reject(err)
            )
        })
    }

    getHistorialTraslado(data, id) {
        return this.apiService.apiCall(`gestion-bienes/get-traslado-producto/${id}`, 'POST', data);
    }

    getHistorialMantenimiento(data, id) {
        return this.apiService.apiCall(`gestion-bienes/get-mantenimiento-producto/${id}`, 'POST', data);
    }

    getHistorialPoliza(data, id) {
        return this.apiService.apiCall(`gestion-bienes/get-poliza-producto/${id}`, 'POST', data);
    }

    getBodegas(data: any) {
        return this.apiService.apiCall('gestion-bienes/get-bodega', 'POST', data);
    }

    guardarBodegaProducto(data: any) {
        return this.apiService.apiCall('gestion-bienes/save-detalles', 'POST', data);
    }

    getConceptos(data: any = {}) {
        return new Promise<Array<any>>((resolve, reject) => {
            this.apiService.apiCall('concepto/get-conceptos', 'POST', data).subscribe(
                (res: any) => resolve(res.data),
                (err: any) => reject(err)
            )
        })
    }

    getReporteGraficoTendencia(data, id) {
        return this.apiService.apiCall(`gestion-bienes/get-reporte-grafico-tendencia/${id}`, 'POST', data);
    }

    setCostos(id: number, data: any = {}) {
        return new Promise((resolve, reject) => {
            this.apiService.apiCall(`productos/set-costos/${id}`, 'POST', data).subscribe(
                (res: any) => resolve(res.data),
                (err: any) => reject(err)
            )
        })
    }

    delCosto(id: number, data: any = {}) {
        return new Promise((resolve, reject) => {
            this.apiService.apiCall(`productos/del-costo/${id}`, 'DELETEV1', data).subscribe(
                (res: any) => resolve(res.data),
                (err: any) => reject(err)
            )
        })
    }

    setReclamo(data: any = {}) {
        return new Promise((resolve, reject) => {
            this.apiService.apiCall('productos/set-reclamo', 'POST', data).subscribe(
                (res: any) => resolve(res.data),
                (err: any) => reject(err)
            )
        })
    }

    updateReclamo(id: number, data: any = {}) {
        return new Promise((resolve, reject) => {
            this.apiService.apiCall(`productos/update-reclamo/${id}`, 'POST', data).subscribe(
                (res: any) => resolve(res.data),
                (err: any) => reject(err)
            )
        })
    }

    createUdm(data: any = {}) {
        return new Promise((resolve, reject) => {
            this.apiService.apiCall(`gestion-bienes/create-udm`, 'POST', data).subscribe(
                (res: any) => resolve(res.data),
                (err: any) => reject(err)
            )
        })
    }

    getUdmSimple(data: any = {}) {
        return new Promise<Array<any>>((resolve, reject) => {
            this.apiService.apiCall(`gestion-bienes/get-udm-simple`, 'POST', data).subscribe(
                (res: any) => resolve(res.data),
                (err: any) => reject(err)
            )
        })
    }

    updateUdm$ = new EventEmitter();

}