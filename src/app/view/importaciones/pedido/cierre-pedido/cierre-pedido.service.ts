import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CierrePedidoService {

  constructor(private apiService: ApiServices) { }

  getPedidosGastos() {
    return this.apiService.apiCall('importacion/get-pedido-cierre', 'POST', {});
  }

  saveCierrePedido(data) {
    return this.apiService.apiCall('importacion/save-pedido-cierre', 'POST', data);
  }

  getPedidosCerrados() {
    return this.apiService.apiCall('importacion/get-pedido-cerrados', 'POST', {});
  }

  deletePedidosCerrados(data) {
    return this.apiService.apiCall('importacion/revert-pedido-cerrados', 'POST', data);
  }

}
