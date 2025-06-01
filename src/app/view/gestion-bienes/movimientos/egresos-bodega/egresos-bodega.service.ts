import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class EgresosBodegaService {

  constructor(
    private apiService: ApiServices
  ) { }

  listaProductos$ = new EventEmitter<any>();
  cantEgreso$ = new EventEmitter<any>();
  vehiculoSelected$ = new EventEmitter<any>();


  getCatalogos(data) {
    return this.apiService.apiCall('productos/get-catalogos', 'POST', data);
  }

  getCustomers() {
    return this.apiService.apiCall("clientes/get-all-clients", "POST", {});
  }

  getImpuestos() {
    return this.apiService.apiCall('ordenes/get-impuestos', 'POST', {});
  }

  searchProduct(data) {
    return this.apiService.apiCall('productos/search-product-table', 'POST', data);
  }

  getDetQuotes(data) {
    return this.apiService.apiCall('quotes/get-Detail-Quotes', 'POST', data);
  }

  saveSales(data) {
    return this.apiService.apiCall('sales/save-sales', 'POST', data);
  }

  getTypeDocument(data) {
    return this.apiService.apiCall('sales/get-type-document', 'POST', data);
  }

  getNumautNumFac(data) {
    return this.apiService.apiCall('sales/get-numaut-numfac', 'POST', data);
  }

  validateStock(data) {
    return this.apiService.apiCall('sales/validate-stock', 'POST', data);
  }

  validateInvoicePend(data) {
    return this.apiService.apiCall('sales/validate-invoices-pendientes', 'POST', data);
  }
  saveEgresoBodega(data) {
    return this.apiService.apiCall('bienes/movimientos/save-egreso-bodega', 'POST', data);
  }
  getRecDocumentos(data) {
    return this.apiService.apiCall("ordenPago/get-rec-documento", "POST", data);
  }
  getEgresoBodegaData(data) {
    return this.apiService.apiCall("bienes/movimientos/get-egreso-bodega", "POST", data);
  }
  getBodegas() {
    return this.apiService.apiCall('bodega/get-bodegaGeneral', 'POST', {});
  }
  getGrupoProducto(data) {
    return this.apiService.apiCall('productos/get-grupo-producto', 'POST', data);
  }

  getProductos(data) {
    return this.apiService.apiCall("gestion-bienes/get-productos", "POST", data);
  }

  getProductosEX(data) {
    return this.apiService.apiCall(`gestion-bienes/get-productos-egreso`, 'POST', data);
  }

  getCatalogs(data) {
    return this.apiService.apiCall("proveedores/get-catalogo", "POST", data);
  }

  getProducto(id: number, data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall(`productos/${id}`, 'GET', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getDetalles(data: any = {}) {
    return this.apiService.apiCall('productos/get-detalles-egreso', 'POST', data) as any
  }

  putDetalles(id: number, data: any = {}) {

  }

  getBodegasAsync(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall('bodega/get-bodegas-egreso', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getVehiculos(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall('productos/get-vehiculos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
}
