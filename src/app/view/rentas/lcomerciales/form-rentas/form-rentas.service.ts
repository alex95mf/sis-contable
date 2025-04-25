import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class FormRentasService {

  constructor(private apiSrv: ApiServices) { }

  getInspecciones(data){
    return this.apiSrv.apiCall('inspeccion/mostrar-resultados-cab-filtro','POST',data);
  }

  saveResultado(data: any = {}){
    return this.apiSrv.apiCall('inspeccion/actualizar-inspeccion','POST', data);
  }

  setImpuestos(data: any = {}) {
    return this.apiSrv.apiCall('local-comercial/set-valor-impuestos', 'POST', data)
  }

  habilitar(id){
    return this.apiSrv.apiCall('inspeccion/habilitar/'+id,'POST',{});
  }

  deleteAnexo(data)
  {
    return this.apiSrv.apiCall('general/delete-files', 'POST', data)
  }

  downloadAnexo(data)
  {
    return this.apiSrv.getTipoBlob('/general/download-files', data)
  }

  fileService(file, payload?: any) {
    return this.apiSrv.apiCallFile('general/upload-files', 'POST', file, payload);
  }

  getAnexos(data: any = {}) {
    return this.apiSrv.apiCall('general/search-files', 'POST', data)
  }

  cargarInspeccionCompleta(data){
    return this.apiSrv.apiCall('inspeccion/get-inspeccion-completo','POST',data);
  }

  getActivosByContribuyente(data) {
    return this.apiSrv.apiCall('inspeccion/get-activos-by-contribuyente','POST',data);
  }

  saveActivos(data) {
    return this.apiSrv.apiCall('inspeccion/guardar-activos','POST',data);
  }

  deleteActivo(data) {
    return this.apiSrv.apiCall('inspeccion/eliminar-activo','POST',data);
  }
}
