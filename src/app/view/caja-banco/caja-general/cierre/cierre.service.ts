import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CierreService {

  constructor(private apiService: ApiServices) { }

  getInfoUserOpenBox(data){
    return this.apiService.apiCall('caja/get-users-openBox', 'POST', data);
  }

  getCajas() {
    return this.apiService.apiCall('caja/get-cajas', 'POST', {});
  }

  getDenominations() {
    return this.apiService.apiCall('caja/get-denominaciones', 'POST', {});
  }

  closeBox(data) {
    return this.apiService.apiCall('caja/close-box', 'POST', data);
  }

  getUsuario() {
    return this.apiService.apiCall('buy/get-usuario', 'POST', {});
  }

  getAccountsByDetails(data) {
    return this.apiService.apiCall('diario/accounts/get-details-banks', 'POST', data);
  }

  getTipeDoc() {
    return this.apiService.apiCall('caja/get-tipe-doc', 'POST', {});
  }

  
}
