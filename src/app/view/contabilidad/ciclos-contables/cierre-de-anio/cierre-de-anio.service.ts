import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CierreDeAnioService {

  constructor(private apiService: ApiServices) { }

  getParametersFilter(data) {
    return this.apiService.apiCall('balancecomprobacion/data-balance-filter', 'POST', data);
  }  

  getGrupoAccount(data) {
    return this.apiService.apiCall('balancecomprobacion/reports/get-group-account', 'POST', data);
  } 



}
