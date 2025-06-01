import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  constructor(
    private apiServices: ApiServices,
  ) { }

  getPermisos(data: any = {}) {
    return this.apiServices.apiCall('menu/get-permisions', 'POST', data) as any;
  }

  getUsuario(data: any = {}) {
    return this.apiServices.apiCall('seguridad/get-users', 'POST', data) as any;
  }

  getCatalogos(data: any = {}) {
    return this.apiServices.apiCall('proveedores/get-catalogo', 'POST', data) as any;
  }

  getRoles(data: any = {}) {
    return this.apiServices.apiCall('seguridad/get-roles', 'POST', data) as any;
  }

  getAnexos(data: any = {}) {
    return this.apiServices.apiCall('general/search-files', 'POST', data) as any;
  }

  fileService(file, payload?: any) {
    return this.apiServices.apiCallFile('general/upload-files', 'POST', file, payload) as any
  }

  deleteAnexo(data: any = {}) {
    return this.apiServices.apiCall('general/delete-files', 'POST', data);
  }

  downloadAnexo(data: any = {}) {
    return this.apiServices.getTipoBlob('/general/download-files', data);
  }

  setAvatar(data: any = {}) {
    return this.apiServices.apiCall('users/set-avatar', 'POST', data) as any;
  }
}
