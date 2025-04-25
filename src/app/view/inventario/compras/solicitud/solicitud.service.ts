import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class SolicitudService {

  constructor(private apiService: ApiServices, private http: HttpClient) { }

  getUsuario() {
    return this.apiService.apiCall('solicitud/get-documento', 'POST', {});
  }

  searchProducto() {
    return this.apiService.apiCall('solicitud/search-producto', 'POST', {});
  }

  saveSolicitud(data) {
    return this.apiService.apiCall("solicitud/save-solicitudes", "POST", data);
  }
  
  deleteSolicitudes(dt) {
    return this.apiService.apiCall("solicitud/delete-solicitudes", "POST", dt);
  }

  updateSolicitud(data) {
    return this.apiService.apiCall("solicitud/update-solicitudes", "POST", data);
  }

  updatePermissions(data) {
    return this.apiService.apiCall('solicitud/update-status-solicitud', 'POST', data);
  }

  getVigenciaSolicitud() {
    return this.apiService.apiCall('solicitud/get-fecha-caducidad', 'POST', {});
  }

  descargar(data) {
    return this.apiService.getTipoBlob("/general/download-files", data);
  }

}