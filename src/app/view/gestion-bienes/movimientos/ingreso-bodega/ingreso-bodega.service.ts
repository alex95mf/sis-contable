import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';
import { ProductoDetalle } from './modal-producto-detalles/IProductoDetalles';

@Injectable({
  providedIn: 'root'
})
export class IngresoBodegaService {
  constructor(private apiService: ApiServices) { }

  listaSolicitudes$ = new EventEmitter<any>();

  enviarCorreo(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall(`ordenes/send-ingreso`, 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getProducto(id: number, data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall(`productos/${id}/${data.documento.id}`, 'GET', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  setDetalles(data: any = {}) {
    return new Promise<Array<ProductoDetalle>>((resolve, reject) => {
      this.apiService.apiCall(`productos/set-detalles`, 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getDetalles(data: any = {}) {
    return this.apiService.apiCall('productos/get-detalles', 'POST', data) as any
  }

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
    return this.apiService.apiCall('ordenes/save-ingresobodega', 'POST', data);
  }

  presentaTablaOrder() {
    return this.apiService.apiCall('ordenes/get-tablebodega', 'POST', {});
  }

  deleteOrder(data) {
    return this.apiService.apiCall('ordenes/delete-ingreso', 'POST', data);
  }

  getDetOrder(data) {
    return this.apiService.apiCall('ordenes/get-det-ingreso', 'POST', data);
  }

  updatePermissions(data) {
    return this.apiService.apiCall('ordenes/update-status-ingreso', 'POST', data);
  }

  printData(data) {
    return this.apiService.apiCall('plandecuentas/save-data-print', 'POST', data);
  }

  sendMailOrder(data) {
    return this.apiService.apiCall('ordenes/send-order-attachment', 'POST', data);
  }

  getEmailsProviders(data) {
    return this.apiService.apiCall('ordenes/get-emails-providers', 'POST', data);
  }

  geUserAprobated(data) {
    return this.apiService.apiCall('ordenes/get-user-aprobated', 'POST', data);
  }

  getSucursales(data) {
    return this.apiService.apiCall('seguridad/get-sucursal', 'POST', data);
  }

  fileService(file, payload?: any) {
    return this.apiService.apiCallFile('general/upload-files', 'POST', file, payload);
  }

  getRecDocumentos(data) {
    return this.apiService.apiCall("ordenes/get-inventarios", "POST", data);
  }

  getProductos(data) {
    return this.apiService.apiCall("gestion-bienes/get-productos", "POST", data);
  }

  getBodegas() {
    return this.apiService.apiCall('bodega/get-bodegaGeneral', 'POST', {});
  }

  getSolicitudModal(data) {
    return this.apiService.apiCall('compras/get-solicitudes-modal', 'POST', data)
  }

  getSolicitudModalProceso(data) {
    return this.apiService.apiCall('compras/get-solicitudes-modal-proceso', 'POST', data)
  }



  getDepartamento(data) {
    return this.apiService.apiCall('bodega/get-departamento', 'POST', data)
  }

  getCatalogs(data) {
    return this.apiService.apiCall("proveedores/get-catalogo", "POST", data);
  }

  getGrupoProducto(data) {
    return this.apiService.apiCall('ordenes/get-grupo-productos', 'POST', data);
  }

  getCatalogoBienes(data) {
    return this.apiService.apiCall("gestion-bienes/catalogo-bienes", "POST", data);
  }

  getUDM(data) {
    return this.apiService.apiCall('productos/get-catalogos', 'POST', data);
  }
  countProductosBienes(data) {
    return this.apiService.apiCall('gestion-bienes/crear-codigoBienes', 'POST', data);
  }
  saveProducto(data) {
    return this.apiService.apiCall('productos/create-producto', 'POST', data);
  }
  getProductosEX(data, fk_grupo) {
    return this.apiService.apiCall(`gestion-bienes/get-productos/${fk_grupo}`, 'POST', data);
  }

  updateIngresoBodega(data) {
    return this.apiService.apiCall('gestion-bienes/update-ingreso-bodega', 'POST', data);
  }

  saveProductoBien(data) {
    return this.apiService.apiCall('gestion-bienes/crear-producto-bien', 'POST', data);
  }


  getSubproductos(data) {
    return this.apiService.apiCall('gestion-bienes/get-newgrupo-producto', 'POST', data);
  }

  updateExi(data, id) {
    return this.apiService.apiCall(`gestion-bienes/update-prod-exi/${id}`, "POST", data);
  }

  uploadAnexo(file, payload?: any) {
    return this.apiService.apiCallFile('general/upload-files', 'POST', file, payload)
  }


  getAnexos(data: any = {}) {
    return this.apiService.apiCall('general/search-files', 'POST', data)
  }

  deleteAnexo(data: any = {}) {
    return this.apiService.apiCall('general/delete-files', 'POST', data)
  }

  downloadAnexo(data: any = {}) {
    return this.apiService.getTipoBlob('/general/download-files', data)
  }

  getSolicitudes(data) {
    return this.apiService.apiCall('ingreso-bodega/get-solicitud', 'POST', data);
  }

  searchSolicitud(data) {
    return this.apiService.apiCall('compras/get-solicitudesByDet', 'POST', data);
  }
  listaCentroCostos() {
    return this.apiService.apiCall('centroCosto/lista-centroCosto-activos', 'POST', {});
  }

  getPerecibles(data: any = {}) {
    return this.apiService.apiCall('productos/get-perecibles', 'POST', data) as any
  }
  getSolicitudModalCatIngreso(data) {
    return this.apiService.apiCall('compras/get-cat-elec-ingreso', 'POST', data)
  }



}
