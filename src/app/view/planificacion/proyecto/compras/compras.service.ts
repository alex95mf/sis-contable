import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  constructor(private apiServices : ApiServices) { }

  codComprasSelected$ = new EventEmitter<any>();

  getCatalogos(data: any = {}) {
    return this.apiServices.apiCall("proveedores/get-catalogo", "POST", data);
  }

  getAtribuciones(data) {
    return this.apiServices.apiCall('planificacion/get-atribuciones', 'POST', data);
  }

  getBienes(data) {
    return new Promise<any[]>((resolve, reject) => {
      return this.apiServices.apiCall('planificacion/get-bienes-departamento', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
    // return this.apiServices.apiCall('planificacion/get-bienes-departamento', 'POST', data);
  }

  asignaCPC(data) {
    return new Promise((resolve, reject) => {
      this.apiServices.apiCall('planificacion/asigna-cpc', 'POST', data).subscribe(
        (res: any) => resolve(res),
        (err: any) => reject(err)
      )
    });
    // return this.apiServices.apiCall('planificacion/asigna-cpc', 'POST', data);
  }

  getCodigos(data: any = {}) {
    return this.apiServices.apiCall('planificacion/get-codigos-cpc', 'POST', data)
  }

  getCodigosPresupuesto(data: any = {}) {
    return new Promise<any[]>((resolve, reject) => {
      this.apiServices.apiCall('planificacion/get-codigos-presupuesto', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getCodigosCompras(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiServices.apiCall('planificacion/get-codigos-compras', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

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
}
