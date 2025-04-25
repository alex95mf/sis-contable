import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AmortizacionService {

  constructor(private api: ApiServices) { }
  
 
  getAmortizaciones(data: any) {
    return this.api.apiCall('amortizacion/get-amortizacion','POST', data);
  }
  getAmortizacionesActualizar(data: any) {
    return this.api.apiCall('amortizacion/get-amortizacion-Actualizar','POST', data);
  }
  
  listarCuotas(data: any) {
    return this.api.apiCall('amortizacion/get-cuotas','POST', data);
  }

  guardarAmortizacion(data: any) {
    return this.api.apiCall('amortizacion/guardar-amortizacion','POST', data);
  }

  actualizarAmortizacion(data: any) {
    return this.api.apiCall('amortizacion/actualizar-amortizacion','POST', data);
  }

  eliminarDetalleAmortizacion(data: any) {
    return this.api.apiCall('amortizacion/eliminar-detalle-amortizacion','POST', data);
  }

  actualizarEstadoCerrado(data: any) {
    return this.api.apiCall('amortizacion/actualizar-estado-cerrado','POST', data);
  }

  modificarEstado(data: any) {
    return this.api.apiCall('amortizacion/modificarEstado','POST', data);
  }

  getIdCabecera(data: any) {
    return this.api.apiCall('amortizacion/getIdCabecera','POST', data);
  }

  generarDetalleAmortizacion(data: any) {
    return this.api.apiCall('amortizacion/updateDetalle','POST', data);
  }

aprobarAmortizacion(data: any = {}) {
  return new Promise((resolve, reject) => {
    this.api.apiCall('amortizacion/aprobar-amortizacion', 'POST', data).subscribe(
      (res: any) => resolve(res.data),
      (err: any) => reject(err)
    )
  })
}
  

}