import { Injectable } from '@angular/core';
import { ApiServices } from '../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class PagosServiciosService {

  constructor(private apiService: ApiServices) { }

  getCentroCosto() {
    return this.apiService.apiCall('boxSmall/get-centro-costo', 'POST', {});
  }

  getAvailablePAS() {
    return this.apiService.apiCall('pas/get-available', 'POST', {});
  }

  addPaymentAndServ(data) {
    return this.apiService.apiCall('pas/add-payment', 'POST', data);
  }

  setPaymentAndServ(data) {
    return this.apiService.apiCall('pas/set-payment', 'POST', data);
  }

  deletePaymentAndServ(data) {
    return this.apiService.apiCall('pas/delete-payment', 'POST', data);
  }
}
