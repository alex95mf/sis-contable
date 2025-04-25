import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class EstadoFinancieroService {

  constructor(private apiService: ApiServices) { }

  getParametersFilter(data) {
    return this.apiService.apiCall('estadoresultado/reports/balance-comprobacion', 'POST', data);
  }  

  getBalanceInit() {
    return this.apiService.apiCall('estadoresultado/estado-financiero/get-estado-resultado', 'POST', {});
  } 

  getBalanceFilter(data) {
    return this.apiService.apiCall('estadoresultado/estado-financiero/get-estado-resultado-filter', 'POST', data);
  } 

  printData(data){
    return this.apiService.apiCall('plandecuentas/save-data-print', 'POST', data);
  }

  ListaCentroCostos() {
    return this.apiService.apiCall('centroCosto/lista-centroCosto-activos', 'POST', {});
  }

  ObtenerEstadoResultado(data) {
    return this.apiService.apiCall('reportes/estados_finanieros/eresultado', 'POST', data);
  }
 
  MayorizarEstadosFinancieros(data) {
    return this.apiService.apiCall('cierremes/mayorizacion', 'POST', data);
  }
  
}