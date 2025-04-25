import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AperturaCajaService {

  constructor(private api: ApiServices) { }

  getCajasData() {
    return this.api.apiCall('recaudacion/get-cajas', 'POST', {})
  }

  getCajasByUser(data) {
    return this.api.apiCall('recaudacion/get-cajas-by-user', 'POST', data)
  }

  abrirCaja(data) {
    return this.api.apiCall('recaudacion/abrir-caja-dia', 'POST', data)
  }

  getCajaDiaByCaja(data) {
    return this.api.apiCall('recaudacion/get-caja-dia-by-caja', 'POST', data)
  }

  getCajaActiva(id) {
    return this.api.apiCall('recaudacion/get-caja-activa/'+id, 'POST', {})
  }

  getCatalogos(data) {
    return this.api.apiCall("proveedores/get-catalogo", "POST", data);
  }

}
