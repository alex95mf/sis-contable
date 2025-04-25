import { EventEmitter, Injectable } from "@angular/core";
import { ApiServices } from "../../../../services/api.service";

@Injectable({
  providedIn: "root",
})
export class ContribuyenteService {
  constructor(private apiService: ApiServices) {}

  uploadResolucion$ = new EventEmitter();

  getCatalogs(data) {
    return this.apiService.apiCall("proveedores/get-catalogo", "POST", data);
  }

  getGrupos() {
    return this.apiService.apiCall("productos/get-grupos", "POST", {});
  }

  getSucursales() {
    return this.apiService.apiCall("administracion/get-sucursal", "POST", {});
  }

  validateEmailContacto(data) {
    return this.apiService.apiCall("contribuyente/validate-email-contribuyente", "POST", data);
  }

  saveContribuyente(data) {
    return this.apiService.apiCall("contribuyente/save-contribuyente", "POST", data);
  }

  getContribuyentes() {
    return this.apiService.apiCall("contribuyente/get-contribuyentes", "POST", {});
  }

  deleteContribuyente(data) {
    return this.apiService.apiCall("contribuyente/delete-contribuyentes", "POST", data);
  }

  updateContribuyente(data) {
    return this.apiService.apiCall("contribuyente/update-contribuyente", "POST", data);
  }

  getAgentRetencion(data) {
    return this.apiService.apiCall("available/agent-retencion", "POST", data);
  }

  filterProvinceCity(data) {
    return this.apiService.apiCall("proveedores/filter-province-city", "POST", data);
  }

  getLocalesComerciales(data) {
    return this.apiService.apiCall('inspeccion/get-locales-contribuyente', 'POST', data)
  }

  getPropiedades(id) {
    return this.apiService.apiCall("propiedad/get-propiedades/" + id, "POST", {});
  }

  getDeudas(data) {
    return this.apiService.apiCall("contribuyente/get-deudas", "POST", data);
  }

  getDeudasAnuladas(data) {
    return this.apiService.apiCall("contribuyente/get-deudas-anuladas", "POST", data);
  }

  getContratosById(data){
    return this.apiService.apiCall(`mercados/get-contratos-byId`, "POST", data);
  }

  deleteAnexo(data: any = {}) {
    return this.apiService.apiCall('general/delete-files', 'POST', data)
  }

  downloadAnexo(data: any = {}) {
    return this.apiService.getTipoBlob('/general/download-files', data)
  }

  uploadAnexo(file, payload?: any) {
    return this.apiService.apiCallFile('general/upload-files', 'POST', file, payload)
  }

  getAnexos(data: any = {}) {
    return this.apiService.apiCall('general/search-files', 'POST', data)
  }

  getActivosByContribuyente(data) {
    return this.apiService.apiCall('inspeccion/get-activos-by-contribuyente','POST',data);
  }

  deleteActivo(data) {
    return this.apiService.apiCall('inspeccion/eliminar-activo','POST',data);
  }

  deleteActivoCiudad(data) {
    return this.apiService.apiCall('contribuyente/delete-ingreso-ciudad','POST',data);
  }

  saveActivos(data) {
    return this.apiService.apiCall('inspeccion/guardar-activos','POST',data);
  }

  getContribuyentesByFilter(data:any = {}) {
    return this.apiService.apiCall('contribuyente/get-contribuyentes', 'POST', data);
  }

  getLocal(data: any = {}) {
    return this.apiService.apiCall('inspeccion/get-local', 'POST', data)
  }

  getCatalogos(data: any = {}) {
    return this.apiService.apiCall('proveedores/get-catalogo', 'POST', data)
  }

  getActivosByCiudad(data) {
    return this.apiService.apiCall('contribuyente/get-ingreso-ciudad','POST',data);
  }

  saveActivosCiudad(data){
    return this.apiService.apiCall('contribuyente/create-ingreso-ciudad', 'POST', data)
  }

  getSupervivencia(data){
    return this.apiService.apiCall('contribuyente/get-supervivencia', 'POST', data)
  }

  

  getLoteContribucion(data){
    return this.apiService.apiCall('contribuyente/get-contribuespecial', 'POST', data)
  }

  createLoteContribucion(data){
    return this.apiService.apiCall('contribuyente/create-contribuespecial', 'POST', data)
  }

  deleteLoteContribucion(data){
    return this.apiService.apiCall('contribuyente/delete-contribuespecial', 'POST', data)
  }

  getRecDocumentos(data) {
    return this.apiService.apiCall("liquidacion/get-rec-documentoById", "POST", data);
  }

  getRecDocumentosConve(data) {
    return this.apiService.apiCall("liquidacion/get-rec-documento", "POST", data);
  }

  getHistorial(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall(`contribuyente/get-historial/${data.id_cliente}`, 'GET', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getCatalogoAsync(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall(`catalogos/DCFD`, 'GET', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  uploadArchivo(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall('contribuyente/folder/store', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getDocumentos(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall('contribuyente/folder/list', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  eliminarArchivo(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall('contribuyente/folder/delete', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getResolucion(data: any = {}) {
    return this.apiService.apiCall('contribuyente/get-resolucion-tercera', 'POST', data).toPromise();
  }

  saveContribuyenteRelaciones(data) {
    return this.apiService.apiCall("contribuyente/save-contribuyente-relaciones", "POST", data);
  }

  saveContribuyenteLotes(data) {
    return this.apiService.apiCall("contribuyente/save-contribuyente-lotes", "POST", data);
  }

  inactivarLote(id) {
    return this.apiService.apiCall(`contribuyente/inactivar-lote/${id}`,"POST",{});
  }
  activarLote(id) {
    return this.apiService.apiCall(`contribuyente/activar-lote/${id}`,"POST",{});
  }

  cargarDetallesIntereses(data: any) {
    return this.apiService.apiCall('contribuyente/get-detalles-intereses','POST', data);
  }

  getConceptos() {
    return this.apiService.apiCall('recaudacion/get-conceptos', 'POST', {})
  }

  

}
