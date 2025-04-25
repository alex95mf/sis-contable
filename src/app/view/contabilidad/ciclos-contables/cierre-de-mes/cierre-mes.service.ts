import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CierreMesService {

  constructor(private apiService: ApiServices) { }


  getParametersFilter(data) {
    return this.apiService.apiCall('balancecomprobacion/data-balance-filter', 'POST', data);
  }  

  getGrupoAccount(data) {
    return this.apiService.apiCall('balancecomprobacion/reports/get-group-account', 'POST', data);
  } 

  registrarCierresPeriodo(data) {
    return this.apiService.apiCall('cierremes/registrarCierreMes', 'POST', data);
  }  


  obtenerCierresPeriodo(data) {
    return this.apiService.apiCall('cierremes/obtenerCierreMes', 'POST', data);
  }  


  obtenerCierresPeriodoPorMes(data) {
    return this.apiService.apiCall('cierremes/obtenerEstatusCierreMes', 'POST', data);
  }  

  updateEstadoMes(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall('cierremes/update-estado-mes', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  generarPeriodo(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall('cierremes/generar-periodo', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
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
