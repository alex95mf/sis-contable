import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class FormComisariaService {

  constructor(private apiServices: ApiServices) { }

  getCatalogos(data) {
    return this.apiServices.apiCall("proveedores/get-catalogo", "POST", data);
  }

  getInspeccionBy(id){
    return this.apiServices.apiCall('inspeccion/get-by-id/'+id,'POST',{});
  }

  getInspecciones(data){
    return this.apiServices.apiCall('inspeccion/mostrar-resultados-cab-filtro','POST',data);
  }

  updateInspeccion(data) {
    return this.apiServices.apiCall("inspeccion/actualizar-inspeccion", "POST", data);
  }

  habilitar(id){
    return this.apiServices.apiCall('inspeccion/habilitar/'+id,'POST',{});
  }

  deleteAnexo(data)
  {
    return this.apiServices.apiCall('general/delete-files', 'POST', data)
  }

  downloadAnexo(data)
  {
    return this.apiServices.getTipoBlob('/general/download-files', data)
  }

  fileService(file, payload?: any) {
    return this.apiServices.apiCallFile('general/upload-files', 'POST', file, payload);
  }

  getAnexos(data: any = {}) {
    return this.apiServices.apiCall('general/search-files', 'POST', data)
  }

  obtenerCatalogos(datos) {
    return this.apiServices.apiCall("proveedores/get-catalogo", "POST", datos);
  }

  getVehiculosByInspeccion(data) {
    return this.apiServices.apiCall('inspeccion/get-vehiculos-by-local','POST',data);
  }

  saveVehiculos(data) {
    return this.apiServices.apiCall('inspeccion/guardar-vehiculos','POST',data);
  }

  deleteVehiculo(data) {
    return this.apiServices.apiCall('inspeccion/eliminar-vehiculo','POST',data);
  }

}
