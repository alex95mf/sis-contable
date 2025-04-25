import { Injectable } from '@angular/core';
import { resolve } from 'path';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  constructor(private apiServices : ApiServices) { }

  // getCatalogos(data) {
  //   return this.apiServices.apiCall("proveedores/get-catalogo", "POST", data);
  // }

  getAtribuciones(data) {
    return this.apiServices.apiCall('planificacion/get-atribuciones', 'POST', data)
  }

  // getBienes(data) {
  //   return this.apiServices.apiCall('planificacion/get-bienes-departamento', 'POST', data);
  // }

  /* Nuevas Rutas para manejo por Periodo */
  getPeriodos(data: any = {}) {
    return new Promise<any[]>((resolve, reject) => {
      this.apiServices.apiCall('planificacion/get-periodos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getProgramas(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiServices.apiCall('planificacion/get-programas', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getDepartamentos(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiServices.apiCall('planificacion/get-departamentos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getCatalogo(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiServices.apiCall("proveedores/get-catalogo", "POST", data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getBienes(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiServices.apiCall('planificacion/get-bienes-departamento', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
}
