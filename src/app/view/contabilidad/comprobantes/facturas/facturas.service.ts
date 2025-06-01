import { Injectable, EventEmitter } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class FacturasService {

  constructor(private apiService: ApiServices) { }

  listaFacturas$ = new EventEmitter<any>();
  listaEgresos$ = new EventEmitter<any>();
  facturaSelected$ = new EventEmitter<any>();

  getTypeDocument(data) {
    return this.apiService.apiCall('sales/get-type-document', 'POST', data);
  }

  getImpuestos() {
    return this.apiService.apiCall('ordenes/get-impuestos', 'POST', {});
  }

  getUsuario() {
    return this.apiService.apiCall('buy/get-usuario', 'POST', {});
  }

  getCatalogos(data) {
    return this.apiService.apiCall('productos/get-catalogos', 'POST', data);
  }

  getProductProveeduria() {
    return this.apiService.apiCall('proveeduria/get-productos', 'POST', {});
  }

  saveBuyProv(data) {
    return this.apiService.apiCall('contabilidad/save-buy-factura', 'POST', data);
  }

  updatedBuyProv(data) {
    return this.apiService.apiCall('proveeduria/updated-buy-proveeduria', 'POST', data);
  }

  getInvoice() {
    return this.apiService.apiCall('proveeduria/get-invoice', 'POST', {});
  }

  ComprasRegistradas() {
    return this.apiService.apiCall('obtner-compras-registradas', 'POST', {});
  }

  getUsRucExist(data) {
    return this.apiService.apiCall('buy/get-ruc-exist', 'POST', data);
  }

  getProveedores() {
    return this.apiService.apiCall('proveedores/get-proveedor', 'POST', {});
  }

  getProveedoresTotalRegistros(data) {
    return this.apiService.apiCall('proveedores/get-proveedor-pagin_total', 'POST', data);
  }

  getComprasTotalRegistros(data) {
    return this.apiService.apiCall('proveeduria/obtner-compras-registradas-total', 'POST', data);
  }


  ListaCentroCostos() {
    return this.apiService.apiCall('centroCosto/lista-centroCosto-activos', 'POST', {});
  }

  ListaCatalogoPresupuesto(){
    return this.apiService.apiCall('catalogo-presupuesto/obtener-lista-catpresupuesto', 'POST', {});
  }

  obtenerListaConfContable(comprobante) {
    return this.apiService.apiCall(`panel_control/${comprobante}`, 'GET', {});
  }

  getFacturasGeneradas(data) {
    return this.apiService.apiCall("contabilidad/get-facturas-generadas", "POST", data);
  }

  getUltimaFactura(data: any = {}) {
    return this.apiService.apiCall('contabilidad/get-ultima-factura', 'POST', data) as any
  }

  getCatalogo(data) {
    return this.apiService.apiCall("proveedores/get-catalogo", "POST", data);
  }

  getPuntosEmision(tipo_documento :number) {
    return this.apiService.apiCall(`contabilidad/get-puntos-emision/${tipo_documento}`, 'GET',  {});
  }

  cargarEgresosBodega() {
    return this.apiService.apiCall('proveeduria/get-egreso-bodega', 'POST', {});
  }
  getEgresoBodegaData(data) {
    return this.apiService.apiCall("bienes/movimientos/get-egreso-bodega", "POST", data);
  }
  getBodegas() {
    return this.apiService.apiCall('bodega/get-bodegaGeneral', 'POST', {});
  }
  getIceSri() {
    return this.apiService.apiCall("contabilidad/get-ice-sri", "POST", {});
  }


}
