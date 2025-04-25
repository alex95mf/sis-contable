import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class LiquidacionesService {

  constructor(private apiService: ApiServices) { }

  getCurrencys() {
    return this.apiService.apiCall('bancos/get-currencys', 'POST', {});
  }

  getPedidosCerradosLiq() {
    return this.apiService.apiCall('importacion/get-pedido-cerrados-liquidacion', 'POST', {});
  }

  getSecuencia(data) {
    return this.apiService.apiCall('importacion/get-secuencia', 'POST', data);
  }

  saveLiquidacion(data) {
    return this.apiService.apiCall('importacion/save-liquidacion-pedido', 'POST', data);
  }

  getLiquidaciones() {
    return this.apiService.apiCall('importacion/get-liquidacion-pedidos', 'POST', {});
  }

  deleteLiquidacion(data) {
    return this.apiService.apiCall('importacion/delete-liquidacion-pedidos', 'POST', data);
  }

  updateLiquidacion(data) {
    return this.apiService.apiCall('importacion/update-liquidacion-pedidos', 'POST', data);
  }

  getAvailableAranceles() {
    return this.apiService.apiCall('arancel/get-available', 'POST', {});
  }

  updateLiquidacionCierre(data) {
    return this.apiService.apiCall('importacion/update-liquidacion-cierre', 'POST', data);
  }

  getTipoRubross() {
    return this.apiService.apiCall('importacion/get-tipo-gastos', 'POST', {});
  }
  
}
