import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class BodegaComprasService {
  constructor(private apiService: ApiServices) { }

  presentaTablaCompra() {
    return this.apiService.apiCall('bodega-ingreso/search-compra', 'POST', {});
  }

  printData(data) {
    return this.apiService.apiCall('plandecuentas/save-data-print', 'POST', data);
  }

  getDetCompraBodega(data) {
    return this.apiService.apiCall('bodega-ingreso/detalle-compra', 'POST', data);
  }

  saveConfirmation(data) {
    return this.apiService.apiCall('bodega-ingreso/save-compra-confirm', 'POST', data);
  }

  getDtCompra(){
    return this.apiService.apiCall('recepcion-producto-despacho/get-compra-dt', 'POST', {});
  }
}