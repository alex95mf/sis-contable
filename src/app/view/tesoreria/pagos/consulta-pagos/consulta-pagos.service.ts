import { Injectable,EventEmitter } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ConsultaPagosService {

  constructor(
    private apiService: ApiServices
  ) { }
  listaTasas$ = new EventEmitter<any>();

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
  getConsultaPagos(data: any) {
    return this.apiService.apiCall('pagos/get-consulta-pagos', 'POST', data);
  }
  getConsultaPagosFacturas(data: any) {
    return this.apiService.apiCall('pagos/get-consulta-pagos-facturas', 'POST', data);
  }

  downloadAnexo(data)
  {
    return this.apiService.getTipoBlob('/general/download-files', data)
  }
  getTasasVarias(data:any = {}) {
    return this.apiService.apiCall("rentas/tasas/tasas-varias/obtenerTasasVarias","POST",data);
  }
  
}
