import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class BitacoraService {

  constructor(private apiService: ApiServices) { }

  getBitacora(data) {
    return this.apiService.apiCall('bitacora/get-bitacora', 'POST', data);
  }

  getConsultaAuditoria(data) {
    return this.apiService.apiCall('bitacora/get-consulta-auditoria', 'POST', data);
  }

  

  getBitacoraXDate(data) {
    return this.apiService.apiCall('bitacora/get-bitacora', 'POST', data);
  }

  getUsuario() {
    return this.apiService.apiCall('buy/get-usuario', 'POST', {});
  }

}

