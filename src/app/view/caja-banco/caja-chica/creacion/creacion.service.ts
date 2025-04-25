import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CreacionService {

  constructor(private apiService: ApiServices) { }

  getUsuario() {
    return this.apiService.apiCall('buy/get-usuario', 'POST', {});
  }

  getAccountsByDetails(data) {
    return this.apiService.apiCall('diario/accounts/get-details', 'POST', data);
  }

  getBoxSmall() {
    return this.apiService.apiCall('boxSmall/get-box-small', 'POST', {});
  }

  saveBoxSmall(data) {
    return this.apiService.apiCall('boxSmall/save-box-small', 'POST', data);
  }

  getbank(data) {
    return this.apiService.apiCall('diario/accounts/get-details-banks', 'POST', data);
  }

  updatedBoxSmall(data) {
    return this.apiService.apiCall('boxSmall/updated-box-small', 'POST', data);
  }

  getAvailableBanks(data) {
    return this.apiService.apiCall('bancos/get-available', 'POST', data);
  }

  getAccountsByDetailsCaja(data) {
    return this.apiService.apiCall('boxSmall/get-details-account', 'POST', data);
  }

}
