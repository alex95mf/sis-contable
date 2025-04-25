import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class PacService {

  constructor(
    private api: ApiServices
  ) { }

  // getProgramas() {
  //   return this.api.apiCall('planificacion/get-programas', 'POST', {})
  // }

  // getDepartamentos(data) {
  //   return this.api.apiCall('planificacion/get-departamentos-programa', 'POST', data)
  // }

  getBienes(data) {
    return this.api.apiCall('planificacion/get-bienes-departamento', 'POST', data)
  }

  // getBienesPlus(data) {
  //   return this.api.apiCall('planificacion/get-bienes-dept-plus', 'POST', data)
  // }

  getCompras(data) {
    return this.api.apiCall('planificacion/get-compras-departamento', 'POST', data)
  }

  // getMision(data)
  // {
  //   return this.api.apiCall('planificacion/get-mision-departamento', 'POST', data)
  // }

  /* Nuevas Rutas para manejo por Periodo */
  getPeriodos(data: any = {}) {
    return new Promise<any[]>((resolve, reject) => {
      this.api.apiCall('planificacion/get-periodos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getProgramas(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.api.apiCall('planificacion/get-programas', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getDepartamentos(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.api.apiCall('planificacion/get-departamentos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getCatalogo(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.api.apiCall("proveedores/get-catalogo", "POST", data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
  
  getMision(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.api.apiCall('planificacion/get-mision-departamento', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getBienesPlus(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.api.apiCall('planificacion/get-bienes-dept-plus', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }


}
