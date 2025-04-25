import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  constructor(private api: ApiServices) { }

  getConceptos() {
    return this.api.apiCall('concepto/get-conceptos', 'POST', {})
  }

  getTiposReporte(data: any = {}) {
    return this.api.apiCall('recaudacion/get-tipoReporte', 'POST', data);
  }

  getReporte(data: any = {}) {
    return this.api.getTipoBlob('/reports/reporte-jasper', data);
    // return this.apiService.apiCall('reports/reporte-jasper', 'POST', data);
  }
  

}