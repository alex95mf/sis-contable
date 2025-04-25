import { Injectable,EventEmitter } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class FormularioCientoTresService {

  constructor(
    private apiService: ApiServices
  ) { }

  getFormularioTres(data: any) {
    return this.apiService.apiCall('contabilidad/reportes/get-formulario-ciento-tres', 'POST', data);
  }
  getFormularioCuatro(data: any) {
    return this.apiService.apiCall('contabilidad/reportes/get-formulario-ciento-cuatro', 'POST', data);
  }
  procesarSpCientoTres(data: any) {
    return this.apiService.apiCall('contabilidad/reportes/formulario-ciento-tres-procesar-sp','POST', data);
  }
  procesarSpCientoCuatro(data: any) {
    return this.apiService.apiCall('contabilidad/reportes/formulario-ciento-tres-procesar-sp','POST', data);
  }
  getPeriodos(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall('planificacion/get-periodos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
}
