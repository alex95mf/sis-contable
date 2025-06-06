
import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})

export class BancariasService {

  constructor(private apiService: ApiServices) { }

  getCurrencys() {
    return this.apiService.apiCall('bancos/get-currencys', 'POST', {});
  }

  getCatalogos(data) {
    return this.apiService.apiCall('productos/get-catalogos', 'POST', data);
  }

  getAccountsByDetails(data) {
    return this.apiService.apiCall('bancos/get-details', 'POST', data);
  }

  getBanks() {
    return this.apiService.apiCall('bancos/get-banks', 'POST', {});
  }

  saveAccount(data){
    return this.apiService.apiCall('bancos/save-account-banks', 'POST', data);
  }

  updatedAccount(data){
    return this.apiService.apiCall('bancos/updated-account-banks', 'POST', data);
  }
  
}

