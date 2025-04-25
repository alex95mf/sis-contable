import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  constructor(private api: ApiServices) { }


  getTiposReporte(data: any = {}) {
    return this.api.apiCall('presupuesto/get-tipoReporte', 'POST', data);
  }
 

}