import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ConciliacionService {

  constructor(private apiService: ApiServices) { }

  getAccountsByDetails(data) {
    return this.apiService.apiCall('diario/accounts/get-details-banks', 'POST', data);
  }

  getConciliation(data) {
    return this.apiService.apiCall('bancos/get-conciliation', 'POST', data);
  }

  saveConciliation(data) {
    return this.apiService.apiCall('bancos/save-conciliation', 'POST', data);
  }

}
