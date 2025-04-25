import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {

  constructor(private apiService: ApiServices) { }

  getAvailableCxP(data) {
    return this.apiService.apiCall('cxp/get-available', 'POST', data);
  }

  getAvailableCxPSpecific(data) {
    return this.apiService.apiCall('cxp/get-available-filters', 'POST', data);
  }

  getAvailableTaxes(data) {
    return this.apiService.apiCall('taxes/get-available-rt', 'POST', data);
  }

  addCxPRetencion(data) {
    return this.apiService.apiCall('taxes/add-cxp-retencion', 'POST', data);
  }

  addPaymentCxP(data) {
    return this.apiService.apiCall('cxp/payment-letter', 'POST', data);
  }

  getAvailableMoney(data) {
    return this.apiService.apiCall('get-available-money', 'POST', data);
  }

  getSucursalInformation() {
    return this.apiService.apiCall('administracion/get-sucursal', 'POST', {});
  }

  getCommonInformationFormule(data) {
    return this.apiService.apiCall('parameters/search-types-catalog', 'POST', data);
  }

  getNotasDebito(data) {
    return this.apiService.apiCall('proveedores/getNotasDebito', 'POST', data);
  }

  getAccParams() {
    return this.apiService.apiCall('cxp/getAccParams', 'POST', {});
  }

  getUserBoxOpen(data) {
    return this.apiService.apiCall('caja/validate-open', 'POST', data);
  }

}
