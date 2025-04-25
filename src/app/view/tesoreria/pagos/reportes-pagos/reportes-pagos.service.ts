import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ReportesPagosService {

  constructor(private api: ApiServices) { }

  getConceptos(data: any = {}) {
    return this.api.apiCall('concepto/get-conceptos', 'POST', data);
  }

  getReporte(data: any = {}) {
    return this.api.getTipoBlob('/reports/reporte-jasper', data);
    // return this.apiService.apiCall('reports/reporte-jasper', 'POST', data);
  }
  getTipoReportes(data) {
    return this.api.apiCall('rentas/get-tipo-reportes', 'POST', data);
    
  }
  
}