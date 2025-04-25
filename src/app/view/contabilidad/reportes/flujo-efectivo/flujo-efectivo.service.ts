import { Injectable,EventEmitter } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class FlujoEfectivoService {

  constructor(
    private apiService: ApiServices
  ) { }

  getFlujoEfectivo(data: any) {
    return this.apiService.apiCall('contabilidad/reportes/flujo-efectivo', 'POST', data);
  }

  procesarSp(data: any) {
    return this.apiService.apiCall('contabilidad/reportes/flujo-efectivo-procesar-sp','POST', data);
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
