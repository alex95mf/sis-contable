import { Injectable } from '@angular/core';
import { ApiServices } from '../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class EgresosService {

  constructor(private apiService: ApiServices) { }

  getStockXSucursal() {
    return this.apiService.apiCall('proveeduria/get-productos-egress', 'POST', {});
  }

  getUsuario() {
    return this.apiService.apiCall('buy/get-usuario', 'POST', {});
  }

  getGrupo() {
    return this.apiService.apiCall('administracion/get-grupos', 'POST', {});
  }

  saveEgresProv(data) {
    return this.apiService.apiCall('proveeduria/save-productos-egress', 'POST', data);
  }

}
