import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from '../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  constructor(private apiService: ApiServices) { }

  listaCompras$ = new EventEmitter<any>();
  facturaXml$ = new EventEmitter<any>();

  cxpSelected$ = new EventEmitter<any>();
  retfteSelected$ = new EventEmitter<any>();
  retivaSelected$ = new EventEmitter<any>();

  getTypeDocument(data) {
    return this.apiService.apiCall('sales/get-type-document', 'POST', data);
  }

  getImpuestos() {
    return this.apiService.apiCall('ordenes/get-impuestos', 'POST', {});
  }
  getImpuestosIva() {
    return this.apiService.apiCall('ordenes/get-impuestos-iva', 'POST', {});
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
    return this.apiService.apiCall('proveeduria/save-buy-proveeduria', 'POST', data);
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


  obtenerEventos(comprobante :string) {
    return this.apiService.apiCall(`panel_control/evento/${comprobante}`, 'GET', {});
  }

  obtenerListaConfContable(comprobante) {
    return this.apiService.apiCall(`panel_control/${comprobante}`, 'GET', {});
  }


  // ListarContratos(id_proveedor :number) {
  //   return this.apiService.apiCall(`proveeduria/contratos_proveedores/${id_proveedor}`, 'GETV1',  {});
  // }
  ListarContratos(id_proveedor :number) {
    return this.apiService.apiCall(`proveeduria/contratos_proveedores/${id_proveedor}`, 'GET',  {});
  }
  ListarContratosCatElec(id_proveedor :number) {
    return this.apiService.apiCall(`proveeduria/contratos_proveedores_catalogo_electronico/${id_proveedor}`, 'GET',  {});
  }

  // AnticipoProveedores(id_proveedor :number) {
  //   return this.apiService.apiCall(`proveeduria/anticipos_proveedores/${id_proveedor}`, 'GETV1',  {});
  // }
  AnticipoProveedores(id_proveedor :number) {
    return this.apiService.apiCall(`proveeduria/anticipos-por-proveedor/${id_proveedor}`, 'GET',  {});
  }
  MultasProveedores(id_proveedor :number) {
    return this.apiService.apiCall(`proveeduria/multas-por-proveedor/${id_proveedor}`, 'GET',  {});
  }
  
 
  CondicionesProveedores(id_solicitud :number) {
    return this.apiService.apiCall(`proveeduria/condiciones_proveedores/${id_solicitud}`, 'GET',  {});
  }

  getComprasGeneradas(data) {
    return this.apiService.apiCall("proveeduria/get-compras-generadas", "POST", data);
  }

  getUltimaCompra(data: any = {}) {
    return this.apiService.apiCall('proveeduria/get-ultima-compra', 'POST', data).toPromise<any>()
  }

  cargarIngresoBodega(id_solicitud :number) {
    return this.apiService.apiCall(`proveeduria/get-ingreso-bodega/${id_solicitud}`, 'GET',  {});
  }

  getIngreso(data: any = {}) {
    return this.apiService.apiCall('proveeduria/get-ingreso', 'POST', data).toPromise<any>()
  }

  getIngresoDetalles(data: any = {}) {
    return this.apiService.apiCall(`proveeduria/get-ingreso-detalles`, 'POST', data).toPromise<any>()
  }

  obtenerCuentasCompras(data) {
    return this.apiService.apiCall("plandecuentas/obtener-cuentas-compras", "POST", data);
  }

  getAccountsByNumber(data) {
    return this.apiService.apiCall("plandecuentas/get-cuentas-number", "POST", data);
  }

  consultarProveedor(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiService.apiCall('proveeduria/consultar-proveedor', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  registrarProveedor(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall('proveedores/save-proveedores-express', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
  
  getEmpresa(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiService.apiCall('seguridad/get-empresa', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getIceSri() {
    return this.apiService.apiCall("contabilidad/get-ice-sri", "POST", {});
  }
  getEgreCorrientes(data: any) {
    return this.apiService.apiCall("proveedores/get-catalogo", "POST", data);
  }

  GeneraRetencionesCompraProv(data) {
    return this.apiService.apiCall('retenciones-sin-autorizar', 'POST',  data);
  }
  
  BuscarRetencionesCompraProv(data) {
    return this.apiService.apiCall('buscar-retencion-compras', 'POST',  data);
  }

  getCuentas(data: any = {}) {
    return this.apiService.apiCall('plandecuentas/get-cuentas-cp', 'POST', data).toPromise<any>()
  }
  getCuentasRetFte(data: any = {}) {
    return this.apiService.apiCall('plandecuentas/get-cuentas-retfte', 'POST', data).toPromise<any>()
  }
  getCuentasRetIva(data: any = {}) {
    return this.apiService.apiCall('plandecuentas/get-cuentas-retiva', 'POST', data).toPromise<any>()
  }

  anularCompra(data: any = {}) {
    return this.apiService.apiCall('proveeduria/anular-compra', 'POST', data).toPromise<any>()
  }

  getCuentasConReglas(data: any){
    return this.apiService.apiCall("proveedores/get-reglas-cuentas", "POST", data);
  }
}
