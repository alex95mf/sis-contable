import { Injectable, EventEmitter } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class SeguridadService {

  constructor(private apiService: ApiServices) { }

  listaRoles$ = new EventEmitter<any>();
  resetPermisosComponentes$ = new EventEmitter();

  getRol(data) {
    return this.apiService.apiCall('seguridad/get-roles', 'POST', data);
  }

  getMdaCategorias(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall('proveedores/get-catalogo', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getPerfil() {
    return this.apiService.apiCall('seguridad/get-perfiles', 'POST', {});
  }

  getComponentes(data) {
    return this.apiService.apiCall('seguridad/get-componentes', 'POST', data);
  }

  getPermisosComponentes(data) {
    return this.apiService.apiCall('seguridad/get-permisions-componentes', 'POST', data);
  }
  saveRow(data) {
    return this.apiService.apiCall('seguridad/save-new-user', 'POST', data);
  }
  saveRowdos(data) {
    return this.apiService.apiCall('seguridad/save-new-rol', 'POST', data);
  }

  presentaTablaUser(data) {
    return this.apiService.apiCall('seguridad/presenta-table-user', 'POST', data);
  }

  updatePermisions(data) {
    return this.apiService.apiCall('seguridad/get-update-permisions-componentes', 'POST', data);
  }

  updateUser(data) {
    return this.apiService.apiCall('seguridad/get-users', 'POST', data);
  }

  /* presentaTablarol(data){
    return this.apiService.apiCall('sistemas/sistemas.php', 'POST', data);
  } */

  getPermisionsGlobas(data) {
    return this.apiService.apiCall('menu/get-permisions', 'POST', data);
  }

  getEmpresa() {
    return this.apiService.apiCall('seguridad/get-empresas', 'POST', {});
  }

  getSucursales(data) {
    return this.apiService.apiCall('seguridad/get-sucursal', 'POST', data);
  }

  updateRol(data) {
    return this.apiService.apiCall('seguridad/update-rol', 'POST', data);
  }

  updateUsuario(data) {
    return this.apiService.apiCall('seguridad/update-data-user', 'POST', data);
  }

  getEmailExist(data) {
    return this.apiService.apiCall('seguridad/valida-email', 'POST', data);
  }

  getUserExist(data) {
    return this.apiService.apiCall('seguridad/valida-username', 'POST', data);
  }

  getRolExist(data) {
    return this.apiService.apiCall('seguridad/validate-rol', 'POST', data);
  }

  getDocumentsPermisions() {
    return this.apiService.apiCall('seguridad/get-documents-permisions', 'POST', {});
  }

  getFilterDocPerm(data) {
    return this.apiService.apiCall('seguridad/get-filter-documents-permisions', 'POST', data);
  }

  savetFilterDocPerm(data) {
    return this.apiService.apiCall('seguridad/save-documents-permisions', 'POST', data);
  }

  fileService(file, payload?: any) {
    return this.apiService.apiCallFile('general/upload-files', 'POST', file, payload).toPromise()
  }

  downloadAnexo(data: any = {}) {
    return this.apiService.getTipoBlob('/general/download-files', data)
  }

  deleteAnexo(data: any = {}) {
    return this.apiService.apiCall('general/delete-files', 'POST', data)
  }

  getAnexo(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall('general/search-files', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

}

