import { Injectable,EventEmitter } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ConsultaCobrosService {

  constructor(
    private apiService: ApiServices
  ) { }
  listaTasas$ = new EventEmitter<any>();

  getConceptos(data: any = {}) {
    return this.apiService.apiCall('concepto/get-conceptos', 'POST', data);
  }
  getConceptosFiltro(data:any = {}) {
    return this.apiService.apiCall("concepto/obtener-concepto-filtro","POST",data);
  }

  getReporte(data: any = {}) {
    return this.apiService.getTipoBlob('/reports/reporte-jasper', data);
    // return this.apiService.apiCall('reports/reporte-jasper', 'POST', data);
  }

  getTiposReporte(data: any = {}) {
    return this.apiService.apiCall('rentas/get-reportes', 'POST', data);
  }
  getConsultaCobros(data: any) {
    return this.apiService.apiCall('recaudacion/get-consulta-cobros', 'POST', data);
  }

  getConsultaCobrosExcel(data: any) {
    return this.apiService.apiCall('recaudacion/get-consulta-cobros-excel', 'POST', data);
  }
  

  downloadAnexo(data)
  {
    return this.apiService.getTipoBlob('/general/download-files', data)
  }
  getTasasVarias(data:any = {}) {
    return this.apiService.apiCall("rentas/tasas/tasas-varias/obtenerTasasVarias","POST",data);
  }
  getMercados()
  {
    return this.apiService.apiCall("proveedores/get-catalogo", "POST", {params: "'REN_MERCADO'"});
  }
  
}
