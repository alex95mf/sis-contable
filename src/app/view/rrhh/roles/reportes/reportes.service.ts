import { Injectable, EventEmitter } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
    providedIn: 'root'
})
export class ReportesService {
    constructor(private apiService: ApiServices) { }
   
    getTiposReporteNomina(data: any = {}) {
        return this.apiService.apiCall('nomina/roles/get-reporte-nomina', 'POST', data);
    }

    getConsultaReportes(data: any) {
        return this.apiService.apiCall('nomina/roles/get-consulta-reportes', 'POST', data);
      }
}