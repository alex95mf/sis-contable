import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CreateRetencionService {

  constructor(private apiSrv: ApiServices) { 
    
  }

  getUserBoxOpen(data) {
    return this.apiSrv.apiCall('caja/validate-open', 'POST', data);
  }

  getAvailableCxP(data) {
    return this.apiSrv.apiCall('cxp/get-available', 'POST', data);
  }

  getAvailableTaxes(data) {
    return this.apiSrv.apiCall('taxes/get-available-rt', 'POST', data);
  }

  addCxPRetencion(data) {
    return this.apiSrv.apiCall('taxes/add-cxp-retencion', 'POST', data);
  }

  getWalletBilling(data) {
    return this.apiSrv.apiCall('wallet/billing', 'POST', data);
  }

  getAvailableTaxesCxC(data) {
    return this.apiSrv.apiCall('taxes/get-available-rt', 'POST', data);
  }

  addCxCRetencion(data) {
    return this.apiSrv.apiCall('taxes/add-cxc-retencion', 'POST', data);
  }
  
}
