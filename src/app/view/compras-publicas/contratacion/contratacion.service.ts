import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ContratacionService {

  constructor(private apiService: ApiServices) { }

  searchPrograma(data) {
    return this.apiService.apiCall('compras/get-programa', 'POST', data);
  }

  searchDepartamento(data) {
    return this.apiService.apiCall('compras/get-programa-departamento', 'POST', data);
  }

  searchAtribucion(data) {
    return this.apiService.apiCall('compras/get-atribucion', 'POST', data);
  }

  searchSolicitud(data) {
    return this.apiService.apiCall('compras/get-solicitudesCont', 'POST', data);
  }

  guardarContrato(id,data) {
    return this.apiService.apiCall(`compras/update-contratos/${id}`,"POST",data);
  }

  uploadAnexo(file, payload?: any) {
    return this.apiService.apiCallFile('general/upload-files', 'POST', file, payload)
  }

  guardarCondiciones(data){
    return this.apiService.apiCall("compras/guardar-condiciones","POST",data);
  }

  listarCondiciones(data,id) {
    return this.apiService.apiCall(`compras/get-condiciones/${id}`,"POST",data);

  }

  guardarPoliza(data){
    return this.apiService.apiCall("compras/guardar-poliza","POST",data);
  }

  listarPoliza(data,id) {
    return this.apiService.apiCall(`compras/get-poliza/${id}`,"POST",data);

  }

  listarCatalogo(data) {
    return this.apiService.apiCall('compras/get-catalogos', 'POST', data);
  }

  eliminarCondiciones(id){
    return this.apiService.apiCall(`compras/eliminar-condicion/${id}`,"POST",{});
  }

  eliminarPoliza(id){
    return this.apiService.apiCall(`compras/eliminar-poliza/${id}`,"POST",{});
  }

  crearBitacora(data){
    return this.apiService.apiCall("compras/guardar-bitacora","POST",data);
  }

  listarBitacora(data,id) {
    return this.apiService.apiCall(`compras/get-bitacora/${id}`,"POST",data);

  }

  listarAseguradoras(data) {
    return this.apiService.apiCall('compras/get-aseguradoras', 'POST', data);
  }

  listarGarantias(data) {
    return this.apiService.apiCall('compras/get-garantias', 'POST', data);
  }

  getContrataciones(data:any = {}) {
    return this.apiService.apiCall('compras/get-contrataciones-excel', 'POST', data);
  }

  getCatalogo(data: any = {}) {
    return this.apiService.apiCall('proveedores/get-catalogo', 'POST', data)
  }

  saveContratacionDetalles(data) {
    return this.apiService.apiCall('compras/set-contratacion-detalles', 'POST', data);
  }

}
