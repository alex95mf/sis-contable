import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TramitesService {

  constructor(
    private apiService: ApiServices
  ) { }



  getUsuarios(data){
    return this.apiService.apiCall('Administracion/get-usuarios', 'POST', data);
  }

  getPermisionsGlobas(data) {
    return this.apiService.apiCall('menu/get-permisions', 'POST', data);
  }


  crearFlujo(data) {
    return this.apiService.apiCall('Administracion/create-flujos', 'POST', data);
  }

  crearFlujoUsuario(data) {
    return this.apiService.apiCall('Administracion/create-flujos-usuarios', 'POST', data);
  }

  crearFlujoRol(data) {
    return this.apiService.apiCall('Administracion/create-flujos-roles', 'POST', data);
  }

  crearFlujoPasos(data) {
    return this.apiService.apiCall('Administracion/create-flujos-pasos', 'POST', data);
  }

  getTarea(data) {
    return this.apiService.apiCall('Administracion/get-tareas', 'POST', data);
  }

  getUsuariosFlujo(data) {
    return this.apiService.apiCall('Administracion/get-usuariosFlujo', 'POST', data);
  }

  getRolesFlujo(data) {
    return this.apiService.apiCall('Administracion/get-rolesFlujo', 'POST', data);
  }

  getUsuariosPasos(data) {
    return this.apiService.apiCall('Administracion/get-flujo-pasos', 'POST', data);
  }


  ActualizarTarea(data) {
    return this.apiService.apiCall('Administracion/updateTareas', 'POST', data);
  }

  deleteUsuario(data) {
    return this.apiService.apiCall('Administracion/delete-usuario', 'POST', data);
  }

  deleteRol(data) {
    return this.apiService.apiCall('Administracion/delete-rol', 'POST', data);
  }

  deletePasos(data) {
    return this.apiService.apiCall('Administracion/delete-pasos', 'POST', data);
  }

  getCatalogoCategoria(data) {
    return this.apiService.apiCall("administracion/mesaAyudaTicket/getCategoria", "POST", data);
  }
  getTickets(data:any = {}) {
    return this.apiService.apiCall("Administracion/get-ticket","POST",data);
  }
  getTicketsHitos(data:any = {}) {
    return this.apiService.apiCall("Administracion/get-ticket-hitos","POST",data);
  }

  getCatalogoSubCategoria(data) {
    return this.apiService.apiCall("administracion/mesaAyudaTicket/getSubCategoria", "POST", data);
  }

  getTicketsGlobal(id,data) {
    return this.apiService.apiCall(`administracion/get-tramites/${id}`,"POST",data);
  }

  getTramitesGeneral(data) {
    return this.apiService.apiCall("administracion/get-tramites-general","POST",data);
  }

  getTramiteReportes(data) {
    return this.apiService.apiCall("administracion/get-tramites-resumen","POST",data);
  }
 
  getTareasALl(data: any = {}) {
    return this.apiService.apiCall("Administracion/getAll-tareas", "POST", data);
  }
  createTicket(data:any) {
    return this.apiService.apiCall("Administracion/create-ticket","POST",data);
  }

  createFlujo(data:any) {
    return this.apiService.apiCall("Administracion/create-tramite-flujo","POST",data);
  }
  
  actualizarFlujo(data:any) {
    return this.apiService.apiCall("Administracion/update-tramite-flujo","POST",data);
  }

  getTramiteById(data:any) {
    return this.apiService.apiCall("administracion/get-tramitesById","POST",data);
  }


  createTramiteSeguimiento(data:any) {
    return this.apiService.apiCall("administracion/create-tramitesSeguimiento","POST",data);
  }

  seguimientoTicket(data,id) {
    return this.apiService.apiCall(`administracion/seguimientos/${id}`,"POST",data);
  }

  // uploadAnexo(file, payload?: any) {
  //   return this.apiService.apiCallFile('general/upload-files', 'POST', file, payload)
  // }
  // saveContribuyente(data) {
  //   return this.apiService.apiCall("contribuyente/save-contribuyente", "POST", data);
  // }
  // getAgentRetencion(data) {
  //   return this.apiService.apiCall("available/agent-retencion", "POST", data);
  // }
  // getCatalogs(data) {
  //   return this.apiService.apiCall("proveedores/get-catalogo", "POST", data);
  // }
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

  descargarPdf(data: any = {}) {
    return this.apiService.getTipoBlob('/api/v1/tramites/descargar-pdf', data)
  }

  retornarTramiteSeguimiento(data) {
    return this.apiService.apiCall('administracion/retornarTramiteSeguimiento',"POST",data);
  }

  getRol(data) {
    return this.apiService.apiCall('seguridad/get-roles', 'POST', data);
  }


}
