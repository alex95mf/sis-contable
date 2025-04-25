import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class BalanceGeneralService {

  constructor(private apiService: ApiServices) { }


  /*
  getParametersFilterOne(data) {
    return this.apiService.apiCall('estadoresultado/reports/balance-comprobacion', 'POST', data);
  }
  */


  obtenerBalanceGeneral(anio :number, mes :number, centro :string, id_empresa :number, nivel :number , gubernamental: string) {
    return this.apiService.apiCall(`contabilidad/reporte/balance_general/${anio}/${mes}/${centro}/${id_empresa}/${nivel}/${gubernamental}`, 'GET',  {});
  }

  obtenerBalanceGeneralMensual(anio :number, mes :number, centro :string, id_empresa :number, nivel :number , gubernamental: string) {
    return this.apiService.apiCall(`contabilidad/reporte/balance_general_mensual/${anio}/${mes}/${centro}/${id_empresa}/${nivel}/${gubernamental}`, 'GET',  {});
  }


  getParametersFilterOne(data) {
    return this.apiService.apiCall('estadoresultado/reports/balance-comprobacion', 'POST', data);
  }

  getInitialBalance(data) {
    return this.apiService.apiCall('balance/balance-general', 'POST', data);
  }

  getCompare(data) {
    return this.apiService.apiCall('estadoresultado/reports/balance-comprobacion', 'POST', data);
  }

  printData(data) {
    return this.apiService.apiCall('plandecuentas/save-data-print', 'POST', data);
  }

  getMoves() {
    return this.apiService.apiCall('balance/get-info-account', 'POST', {});
  }

  getParametersFilter(data) {
    return this.apiService.apiCall('estadoresultado/reports/balance-comprobacion', 'POST', data);
  }

  ListaCentroCostos() {
    return this.apiService.apiCall('centroCosto/lista-centroCosto-activos', 'POST', {});
  }

  MayorizarEstadosFinancieros(data) {
    return this.apiService.apiCall('cierremes/mayorizacion', 'POST', data);
  }

}