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
    return this.api.apiCall('cobranza/get-tipoReporte', 'POST', data);
  }

  getReporte(data: any = {}) {
    return this.api.getTipoBlob('/reports/reporte-jasper', data);
    // return this.apiService.apiCall('reports/reporte-jasper', 'POST', data);
  }
  
  getMercados() {
    return this.api.apiCall('cobranza/get-mercados', 'POST', {})
  }

  getDataTipoReporte(data: any = {}) {
    return this.api.apiCall('cobranza/getDataReporte', 'POST', data);
  }

  getCatalogs() {
    return this.api.apiCall("cobranza/get-sector", "POST", {});
  }

  getEstado() {
    return this.api.apiCall("cobranza/get-estado", "POST", {});
  }

  getConceptosReporte(data: any = {}) {
    return this.api.apiCall('recaudacion/get-conceptos', 'POST', data);
  }

  getConsultaReportes(data: any) {
    return this.api.apiCall('cobranza/get-consulta-reportes', 'POST', data);
  }
 

}