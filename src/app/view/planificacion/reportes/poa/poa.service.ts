import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class PoaService {

  constructor(private apiServices : ApiServices) { }

  // getProgramas()
  // {
  //   return this.api.apiCall('planificacion/get-programas', 'POST', {})
  // }

  // getDepartamentos(data)
  // {
  //   return this.api.apiCall('planificacion/get-departamentos-programa', 'POST', data)
  // }

  // getMision(data)
  // {
  //   return this.apiServices.apiCall('planificacion/get-mision-departamento', 'POST', data)
  // }

  getCatalogs(data) 
  {
    return this.apiServices.apiCall("proveedores/get-catalogo", "POST", data);
  }

  // getAtribuciones(data)
  // {
  //   return this.apiServices.apiCall('planificacion/get-attrs-dept', 'POST', data)
  // }

  // getObjetivosComponentes(data)
  // {
  //   return this.apiServices.apiCall('planificacion/obtener-meta-programa', 'POST', data)
  // }

  getFuentesFin(data)
  {
    return this.apiServices.apiCall('planificacion/get-fuentes-fin', 'POST', data)
  }

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

  getObjetivosComponentes(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiServices.apiCall('planificacion/obtener-meta-programa', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getMision(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiServices.apiCall('planificacion/get-mision-departamento', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getAtribuciones(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiServices.apiCall('planificacion/get-attrs-dept', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
}
