import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class DepositoService {

  constructor(private apiService: ApiServices) { }

  getCaja() {
    return this.apiService.apiCall("reports-bank_cajas/cajas", "POST", {});
  }

  getRegister(data) {
    return this.apiService.apiCall("deposito/get-register-box", "POST", data);
  }

  getInformationComprobantes(data) {
    return this.apiService.apiCall("deposito/get-information-comprobantes", "POST", data);
  }

  getTipeDoc() {
    return this.apiService.apiCall('caja/get-tipe-doc', 'POST', {});
  }

  getAccountsByDetails(data) {
    return this.apiService.apiCall('diario/accounts/get-details-banks', 'POST', data);
  }

  saveDeposit(data) {
    return this.apiService.apiCall('deposito/save-deposito-box', 'POST', data);
  }

}
