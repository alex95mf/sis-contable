import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CierreCajaService {

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

  getRecibosByDia(data) {
    return this.api.apiCall('recaudacion/get-recibos-by-caja-dia', 'POST', data)
  }

  cerrarCaja(data) {
    return this.api.apiCall('recaudacion/cerrar-caja-dia', 'POST', data)
  }

  reabrirCaja(data) {
    return this.api.apiCall('recaudacion/reabrir-caja-dia', 'POST', data)
  }

  getCatalogos(data) {
    return this.api.apiCall("proveedores/get-catalogo", "POST", data);
  }

}
