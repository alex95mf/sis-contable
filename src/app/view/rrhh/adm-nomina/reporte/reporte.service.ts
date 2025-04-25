import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ReporteNominaService {

  constructor(private apiService: ApiServices) { }
  exportExcel$ = new EventEmitter();
  exportCargasExcel$ = new EventEmitter();

  loadingSpinner$ = new EventEmitter();

  getNomDepart() {
    return this.apiService.apiCall('parameters/get-groups', 'POST', {});
  }

  getNomEmpleados(data) {
    return this.apiService.apiCall('report-nomina/get-empleados', 'POST', data);
  }

  getPersonalDe(data) {
    return this.apiService.apiCall('report-nomina/get-personal-nomina', 'POST', data);
  }

  getPersonalCumple(data) {
    return this.apiService.apiCall('report-nomina/get-personal-cumple', 'POST', data);
  }

  getPersonalAll() {
    return this.apiService.apiCall('prestamos/show-personal', 'POST', {});
  }
  
  getPersonalCarga(data) {
    return this.apiService.apiCall('report-nomina/get-personal-carga', 'POST', data);
  }

  getEmpleados(data:any = {}) {
    return this.apiService.apiCall('nomina/get-empleados', 'POST', data);
  }
}
