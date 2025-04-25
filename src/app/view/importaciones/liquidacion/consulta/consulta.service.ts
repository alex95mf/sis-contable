import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  constructor(private apiService: ApiServices) { }

  getLiquidacionesCloset(data) {
    return this.apiService.apiCall('importacion/get-liquidacion-pedidos-filter', 'POST', data);
  }

  deleteLiquidacion(data) {
    return this.apiService.apiCall('importacion/delete-liquidacion-pedidos', 'POST', data);
  }
  
}
