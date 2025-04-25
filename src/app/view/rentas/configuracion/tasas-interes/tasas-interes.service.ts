import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TasasInteresService {

  constructor(
    private apiService: ApiServices,
  ) { }

  getPeriodos(data: any = {}) {
    return new Promise<any[]>((resolve, reject) => {
      this.apiService.apiCall('planificacion/get-periodos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  setTasasInteres(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall('rentas/tasas-interes/store', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getTasasInteres(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall('rentas/tasas-interes/list', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
  
  generarPeriodoTasas(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall('rentas/tasas-interes/generate', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
  inicializarSp(data: any) {
    return this.apiService.apiCall('rentas/tasas-interes/inicializar-interes-sp','POST', data);
  }

  calcularInteresSp(data: any) {
    return this.apiService.apiCall('rentas/tasas-interes/calcular-interes-sp','POST', data);
  }

  
}


