import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CobranzaService {

  constructor(private apiService: ApiServices) { }

  getWalletBilling(data) {
    return this.apiService.apiCall('wallet/billing', 'POST', data);
  }

  getWalletBillingSpecific(data) {
    return this.apiService.apiCall('wallet/billing-specific', 'POST', data);
  }

  getUserBoxOpen(data) {
    return this.apiService.apiCall('caja/validate-open', 'POST', data);
  }

  getAvailableTaxes(data) {
    return this.apiService.apiCall('taxes/get-available-rt', 'POST', data);
  }

  setWalletBilling(data) {
    return this.apiService.apiCall('wallet/pay-billing', 'POST', data);
  }

  addCxCRetencion(data) {
    return this.apiService.apiCall('taxes/add-cxc-retencion', 'POST', data);
  }

  getNotasDebito(data) {
    return this.apiService.apiCall("notascreditodebito/get-notas-credito-debito", "POST", data);
  }
  
  getAccountsByDetails(data) {
    return this.apiService.apiCall('diario/accounts/get-details-banks', 'POST', data);
  }

  getAccountsCustomer(data) {
    return this.apiService.apiCall('wallet/get-account-customer', 'POST', data);
  }

  getCliente() {
    return this.apiService.apiCall('reportsInvoice/get-cliente', 'POST', {});
  }

  getCiudades(data) {
    return this.apiService.apiCall('bodega/get-catalogo', 'POST', data);
  }

  saveAccCustomer(data) {
    return this.apiService.apiCall('wallet/save-account-customer', 'POST', data);
  }

  getSumNotasCliente(data) {
    return this.apiService.apiCall('notascreditodebito/get-sum-notas-cliente', 'POST', data);
  }

}
