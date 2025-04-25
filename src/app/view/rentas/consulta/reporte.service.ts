import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  constructor(
    private apiService: ApiServices
  ) { }

  getConceptos(data: any = {}) {
    return this.apiService.apiCall('concepto/get-conceptos', 'POST', data);
  }

  getReporte(data: any = {}) {
    return this.apiService.getTipoBlob('/reports/reporte-jasper', data);
    // return this.apiService.apiCall('reports/reporte-jasper', 'POST', data);
  }

  getTiposReporte(data: any = {}) {
    return this.apiService.apiCall('rentas/get-reportes', 'POST', data);
  }
  getConsultaReportes(data: any) {
    return this.apiService.apiCall('rentas/get-consulta-reportes', 'POST', data);
  }

  getConceptosDet(data:any = {}) {
    return this.apiService.apiCall("concepto/obtener-concepto-filtro","POST",data);
  }
}

