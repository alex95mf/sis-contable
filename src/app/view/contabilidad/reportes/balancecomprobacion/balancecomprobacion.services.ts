import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class BalanceComprobacionService {

  constructor(private apiService: ApiServices) { }

  getParametersFilter(data) {
    return this.apiService.apiCall('balancecomprobacion/data-balance-filter', 'POST', data);
  }  

  getAccounts(data) {
    return this.apiService.apiCall('balancecomprobacion/reports/get-account', 'POST', data);
  } 

  getAccountsFilters(data) {
    return this.apiService.apiCall('balancecomprobacion/reports/get-account-filter', 'POST', data);
  } 

  getGrupoAccount(data) {
    return this.apiService.apiCall('balancecomprobacion/reports/get-group-account', 'POST', data);
  } 
  
  printData(data){
    return this.apiService.apiCall('plandecuentas/save-data-print', 'POST', data);
  }
  
}