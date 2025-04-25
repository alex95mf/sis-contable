import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ValeService {

  constructor(private apiService: ApiServices) { }

  getAccountSmallBox() {
    return this.apiService.apiCall('boxSmall/get-cuentas-caja-chica', 'POST', {});
  }

  getTipoDoc() {
    return this.apiService.apiCall('boxSmall/get-tipo-doc', 'POST', {});
  }

  getBoxSmallXUsuario() {
    return this.apiService.apiCall('boxSmall/get-box-small-x-usuuario', 'POST', {});
  }

  getCentroCosto() {
    return this.apiService.apiCall('boxSmall/get-centro-costo', 'POST', {});
  }

  getImpuestos() {
    return this.apiService.apiCall('ordenes/get-impuestos', 'POST', {});
  }

  getMovements(data) {
    return this.apiService.apiCall('boxSmall/get-movements', 'POST', data);
  }

  saveValeCaja(data) {
    return this.apiService.apiCall('boxSmall/save-vale-caja', 'POST', data);
  }

  updateValeCaja(data) {
    return this.apiService.apiCall('boxSmall/update-vale-caja', 'POST', data);
  }

  deleteValeCaja(data) {
    return this.apiService.apiCall('boxSmall/delete-vale-caja', 'POST', data);
  }

  getbank(data) {
    return this.apiService.apiCall('diario/accounts/get-details-banks', 'POST', data);
  }

  saveReposition(data) {
    return this.apiService.apiCall('boxSmall/save-reposition-box', 'POST', data);
  }

  getAvailableBanks(data) {
    return this.apiService.apiCall('bancos/get-available', 'POST', data);
  }

  getSucursales() {
    return this.apiService.apiCall('administracion/get-sucursal', 'POST', {});
  }

}