import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  constructor(private apiService: ApiServices) { }


  searchPrograma(data) {
    return this.apiService.apiCall('compras/get-programa', 'POST', data);
  }
 

  searchDepartamento(data) {
    return this.apiService.apiCall('compras/get-programa-departamento', 'POST', data);
  }
  getTipoDocumentos(data) {
    return this.apiService.apiCall('digitalizacion/getTipoDocumento', 'POST', data);
  }
  searchAtribucion(data) {
    return this.apiService.apiCall('compras/get-atribucion', 'POST', data);
  }

  searchSolicitud(data) {
    return this.apiService.apiCall('compras/get-solicitudesByDet', 'POST', data);
  }
  searchReservascab(data) {
    return this.apiService.apiCall('digitalizacion/get-reservascab', 'POST', data);
  }

  saveReservasDigUpda(data) {
    return this.apiService.apiCall('digitalizacion/save-update', 'POST', data);
  } 
  saveReservasDig(data) {
    return this.apiService.apiCall('digitalizacion/save-reservas-dig', 'POST', data);
  } 

  searchBienes(data) {
    return this.apiService.apiCall('compras/get-bienes', 'POST', data);
  }

  searchPlaAtribucion(data) {
    return this.apiService.apiCall('compras/get-pla-atribucion', 'POST', data);
  }

  crearSolicitud(data) {
    return this.apiService.apiCall('compras/crear-solicitudes', 'POST', data);
  }

  eliminarSolicitud(data) {
    return this.apiService.apiCall('compras/get-eliminar-solicitudes', 'POST', data);
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

  getPeriodos(data: any = {}) {
    return this.apiService.apiCall('planificacion/get-periodos', 'POST', data)
  }
  

  

  

  
}
