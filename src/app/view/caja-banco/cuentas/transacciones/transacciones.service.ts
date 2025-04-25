import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TransaccionesService {

  constructor(private apiService: ApiServices) { }

  getAccountsByDetails(data) {
    return this.apiService.apiCall('diario/accounts/get-details-banks', 'POST', data);
  }

  getTransferencia() {
    return this.apiService.apiCall('transferencia/get-transferencia', 'POST', {});
  }

  getDocumentosGlobal() {
    return this.apiService.apiCall('transferencia/get-document', 'POST', {});
  }

  saveTransaction(data) {
    return this.apiService.apiCall('transferencia/save-transaccion', 'POST', data);
  }

  deleteTransaction(data) {
    return this.apiService.apiCall('transferencia/delete-transaccion', 'POST', data);
  }

  updateTransaction(data) {
    return this.apiService.apiCall('transferencia/update-transaccion', 'POST', data);
  }

}
