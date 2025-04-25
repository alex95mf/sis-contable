import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  constructor(
    private api: ApiServices
  ) { }

  getPeriodos(data: any = {}) {
    return new Promise<any[]>((resolve, reject) => {
      this.api.apiCall('planificacion/get-periodos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getProgramas(data: any = {}) {
    return new Promise<any[]>((resolve, reject) => {
      this.api.apiCall('planificacion/get-programas', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  /* getProgramas() {
    return this.api.apiCall('planificacion/get-programas', 'POST', {})
  } */

  getDepartamentos(data) {
    return this.api.apiCall('planificacion/get-departamentos-programa', 'POST', data)
  }

  getAtribuciones(data) {
    return this.api.apiCall('planificacion/get-atribuciones', 'POST', data)
  }

  getBienes(data) {
    return this.api.apiCall('planificacion/get-bienes-atribucion', 'POST', data)
  }

  getCompras(data) {
    return this.api.apiCall('planificacion/get-compras', 'POST', data)
  }

  setCompras(data) {
    return this.api.apiCall('planificacion/set-compras', 'POST', data)
  }

  setPagado(id: number, data: any) {
    return new Promise((resolve, reject) => {
      this.api.apiCall(`planificacion/set-pagado/${id}`, 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
}
