import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class OfertasServices {
  constructor(private apiService: ApiServices) { }

  tablaProducto(data) {
    return this.apiService.apiCall('ofertas/producto-show', 'POST', data);
  }

  getProducts() {
    return this.apiService.apiCall('solicitud/search-producto', 'POST', {});
  }
  getGrupos() {
    return this.apiService.apiCall('productos/get-grupos', 'POST', {});
  }

  tablaProductodos(data) {
    return this.apiService.apiCall('ofertas/producto-showDos', 'POST', data);
  }

  getPrecio() {
    return this.apiService.apiCall('precios/group-price', 'POST', {});
  }

  tablaOferts() {
    return this.apiService.apiCall('ofertas/descuentos', 'POST', {});
  }

  SaveOferta(data) {
    return this.apiService.apiCall('ofertas/saveOferta', 'POST', data);
  }

}