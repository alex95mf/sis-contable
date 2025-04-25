import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ChequeProtestadoService {

  constructor(private apiService: ApiServices) { }


  getAccountsByDetails(data) {
    return this.apiService.apiCall('diario/accounts/get-details-banks', 'POST', data);
  }

  obtenerCheques(data) {
    return this.apiService.apiCall('cobranza/obtenerCheques', 'POST', data);
  }

  getBancos(data) {
    return this.apiService.apiCall('bodega/get-catalogo', 'POST', data);
  }

  obtenerMotivos() {
    return this.apiService.apiCall('cobranza/obtenerMotivos', 'POST', {});
  }

  protestarCheque(data:any) {
    return this.apiService.apiCall('cobranza/protestarCheque', 'POST', data);
  }

  getCtasChequeProtestado() {
    return this.apiService.apiCall('cobranza/getCtasChequeProtestado', 'POST', {});
  }

  getSucursales() {
    return this.apiService.apiCall('administracion/get-sucursal', 'POST', {});
  }
  
}
