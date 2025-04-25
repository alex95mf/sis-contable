import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';



@Injectable({
  providedIn: 'root'
})
export class BodegaIngresoServices {


  constructor(private apiService: ApiServices) { }

  public getInformationCellar() {
    return this.apiService.apiCall('bodega/get-bodegas', 'POST', {});
  }

  getEmpresa() {
    return this.apiService.apiCall('bodegas/get-empresas', 'POST', {});
  }

  getSucursales(data) {
    return this.apiService.apiCall('seguridad/get-sucursal', 'POST', data);
  }

  getUser(data) {
    return this.apiService.apiCall('bodega/get-users', 'POST', data);
  }

  getCiudades(data) {
    return this.apiService.apiCall('bodega/get-catalogo', 'POST', data);
  }

  saveBodega(data) {
    return this.apiService.apiCall('bodega/save-celler', 'POST', data);
  }

  updateBodega(data) {
    return this.apiService.apiCall('bodega/update-celler', 'POST', data);
  }

  getInformationCellarGeneral() {
    return this.apiService.apiCall('bodega/get-bodegaGeneral', 'POST', {});
  }

  getEstruture() {
    return this.apiService.apiCall('bodega/get-estructure', 'POST', {});
  }

  saveEstruture(data) {
    return this.apiService.apiCall('bodega/save-estructure', 'POST', data);
  }

  updateEstruture(data) {
    return this.apiService.apiCall('bodega/update-estructure', 'POST', data);
  }

  validaCodeStruture(data) {
    return this.apiService.apiCall('bodega/consult-code-struct', 'POST', data);
  }

  getStockCeller() {
    return this.apiService.apiCall('bodega/consult-stok-bodega', 'POST', {});
  }

  saveSendotherSucursal(data) {
    return this.apiService.apiCall('bodega/save-send-others-celler', 'POST', data);
  }


}