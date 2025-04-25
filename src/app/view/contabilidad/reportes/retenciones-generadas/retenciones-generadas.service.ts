import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';  

@Injectable({
  providedIn: 'root'
})
export class ReportRetencionGeneradasService {

  constructor(private apiService: ApiServices) { }

  getRetencionesGeneradas(fecha_incial :string, fecha_fin :string ) {
    return this.apiService.apiCall(`contabilidad/reportes/retenciones_generadas/${fecha_incial}/${fecha_fin}`, 'GET',  {});
  }


}

