import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {

  constructor(
    private apiServices: ApiServices,
  ) { }

  getPermisos(data: any = {}) {
    return this.apiServices.apiCall('menu/get-permisions', 'POST', data).toPromise<any>();
  }

  getUsuario(data: any = {}) {
    return this.apiServices.apiCall('seguridad/get-users', 'POST', data).toPromise<any>();
  }

  getCatalogos(data: any = {}) {
    return this.apiServices.apiCall('proveedores/get-catalogo', 'POST', data).toPromise<any>();
  }

  getRoles(data: any = {}) {
    return this.apiServices.apiCall('seguridad/get-roles', 'POST', data).toPromise<any>();
  }

  getAnexos(data: any = {}) {
    return this.apiServices.apiCall('general/search-files', 'POST', data).toPromise<any>();
  }

  fileService(file, payload?: any) {
    return this.apiServices.apiCallFile('general/upload-files', 'POST', file, payload).toPromise<any>()
  }

  deleteAnexo(data: any = {}) {
    return this.apiServices.apiCall('general/delete-files', 'POST', data);
  }

  downloadAnexo(data: any = {}) {
    return this.apiServices.getTipoBlob('/general/download-files', data);
  }

  setAvatar(data: any = {}) {
    return this.apiServices.apiCall('users/set-avatar', 'POST', data).toPromise<any>();
  }

  getMenu(data) {
    return this.apiServices.apiCall('menu/get-menu', 'POST', data);
  }
}
