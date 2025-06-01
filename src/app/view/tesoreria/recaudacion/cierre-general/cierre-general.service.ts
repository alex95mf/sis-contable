import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CierreGeneralService {

  constructor(private api: ApiServices) { }

  getCajasDia(data) {
    return this.api.apiCall('recaudacion/get-reporte-general', 'POST', data)
  }

  getRecibosByDia(data) {
    return this.api.apiCall('recaudacion/get-recibos-by-caja-dia', 'POST', data)
  }


  getConceptos() {
    return this.api.apiCall('concepto/get-conceptos-caja-cierre-general', 'POST', {})
  }


  reabrirCaja(data) {
    return this.api.apiCall('recaudacion/reabrir-caja-dia', 'POST', data)
  }

  listarCuentasBancos(data) {
    return this.api.apiCall('pagos/getBancos', 'POST', data);
  }

  cerrarCaja(data) {
    return this.api.apiCall('recaudacion/cerrar-caja-general', 'POST', data)
  }

  getDepositos(data) {
    return this.api.apiCall('recaudacion/get-depositos-general', 'POST', data)
  }

  eliminarDeposito(data: any = {}) {
    return this.api.apiCall('recaudacion/eliminar-deposito', 'POST', data) as any
  }

}
