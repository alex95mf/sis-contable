import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  constructor(private apiService: ApiServices) { }

  getCentroCosto() {
    return this.apiService.apiCall('boxSmall/get-centro-costo', 'POST', {});
  }

  getAccountFather(data) {
    return this.apiService.apiCall('centroCosto/get-account-higher', 'POST', data);
  }

  getCentroCostoXCuentas(data) {
    return this.apiService.apiCall('centroCosto/get-centro-costo-cuentas', 'POST', data);
  }

  getDiario(data) {
    return this.apiService.apiCall('centroCosto/get-diario', 'POST', data);
  }
  
}
