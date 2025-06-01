import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CierreMesService {

  constructor(private apiService: ApiServices) { }

  obtenerCierresPeriodoPresupuesto(data) {
    return this.apiService.apiCall('presupuesto/obtenerEstatusCierreMes', 'POST', data);
  }


  obtenerCierresPeriodoPorMes(data) {
    return this.apiService.apiCall('cierremes/obtenerEstatusCierreMes', 'POST', data);
  }

  updateEstadoMesPresupuesto(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall('presupuesto/update-estado-mes', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getNuevoPeriodo() {
    return this.apiService.apiCall('presupuesto/get-ultimo-periodo', 'POST', {}) as any
  }

  generarPeriodoPresupuesto(data: any = {}) {
    return this.apiService.apiCall('presupuesto/generar-periodo', 'POST', data) as any
    /* return new Promise((resolve, reject) => {
      this.apiService.apiCall('presupuesto/generar-periodo', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    }) */
  }

  getPeriodos(data: any = {}) {
    return new Promise<any[]>((resolve, reject) => {
      this.apiService.apiCall('planificacion/get-periodos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }


}
