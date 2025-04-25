import { Injectable,EventEmitter } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ReportesGraficosService {

  constructor(
    private apiService: ApiServices
  ) { }
  

 

  getReporte(data: any = {}) {
    return this.apiService.getTipoBlob('/reports/reporte-jasper', data);
    // return this.apiService.apiCall('reports/reporte-jasper', 'POST', data);
  }
  public getDataRecAnios(data){
    return this.apiService.apiCall('recaudacion/reportes-graficos-recaudacion-anios', "POST", data)
  }
  public getDataRecMeses(data){
    return this.apiService.apiCall('recaudacion/reportes-graficos-recaudacion-meses', "POST", data)
  }

  


}
