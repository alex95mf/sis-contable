import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class SumasySaldosService {

  constructor(private apiService: ApiServices) { }


  obtenerBalanceComprobacion(fecha_desde :string, fecha_hasta :string, centro :string, id_empresa :number, id_usuario :number, nivel :number, anio :number, mes :number ) {
    return this.apiService.apiCall(`contabilidad/estadosfinancieros/balance_comprobacion/${fecha_desde}/${fecha_hasta}/${centro}/${id_empresa}/${id_usuario}/${nivel}/${anio}/${mes}`, 'GET',  {});
  }

  getParametersFilter(data) {
    return this.apiService.apiCall('balancecomprobacion/data-balance-filter', 'POST', data);
  }  

  getAccounts(data) {
    return this.apiService.apiCall('balancecomprobacion/reports/get-account', 'POST', data);
  } 

  getAccountsFilters(data) {
    return this.apiService.apiCall('balancecomprobacion/reports/get-account-filter', 'POST', data);
  } 

  getGrupoAccount(data) {
    return this.apiService.apiCall('balancecomprobacion/reports/get-group-account', 'POST', data);
  } 
  
  printData(data){
    return this.apiService.apiCall('plandecuentas/save-data-print', 'POST', data);
  }

  procesarSp(data: any) {
    return this.apiService.apiCall('contabilidad/reportes/sum-saldos-procesar-sp','POST', data);
  }
  getPeriodos(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall('planificacion/get-periodos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
  
}