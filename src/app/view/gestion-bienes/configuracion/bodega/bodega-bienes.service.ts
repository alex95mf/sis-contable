import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class BodegaBienesService {

  constructor(private apiService: ApiServices) { }


  public getInformationCellar(data) {
    return this.apiService.apiCall('bodega/get-bodegasEloq', 'POST', data);
  }

  getCiudades(data) {
    return this.apiService.apiCall('bodega/get-catalogo', 'POST', data);
  }

  updateBodega(data) {
    return this.apiService.apiCall('bodega/updateEloq-celler', 'POST', data);
  }

  saveBodega(data) {
    return this.apiService.apiCall('bodega/saveEloq-celler', 'POST', data);
  }

  validaCodeStruture(data) {
    return this.apiService.apiCall('bodega/consult-code-struct', 'POST', data);
  }

  
  getInformationCellarGeneral() {
    return this.apiService.apiCall('bodega/get-bodegaGeneral', 'POST', {});
  }

  getEstruture(data) {
    return this.apiService.apiCall('bodega/get-estructure', 'POST', data);
  }

  getEmpresa() {
    return this.apiService.apiCall('bodegas/get-empresas', 'POST', {});
  }

  saveEstruture(data) {
    return this.apiService.apiCall('bodega/save-estructure', 'POST', data);
  }

  updateEstruture(data) {
    return this.apiService.apiCall('bodega/update-estructure', 'POST', data);
  }

  
  getSucursales(data) {
    return this.apiService.apiCall('seguridad/get-sucursal', 'POST', data);
  }

  getUser(data) {
    return this.apiService.apiCall('bodega/get-users', 'POST', data);
  }

}
