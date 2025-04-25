import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class PresupuestoService {

  constructor(private apiServices : ApiServices) { }

  selectCodigoPresupuesto$ = new EventEmitter<any>();

  // getCatalogos(data) {
  //   return this.apiServices.apiCall("proveedores/get-catalogo", "POST", data);
  // }

  // getBienes(data) {
  //   return this.apiServices.apiCall('planificacion/get-attr-bienes', 'POST', data);
  // }

  getBienesDepartamento(data) {
    return this.apiServices.apiCall('planificacion/get-bienes-departamento', 'POST', data);
  }

  // asignaPartida(data) {
  //   return this.apiServices.apiCall('planificacion/asigna-partida', 'POST', data);
  // }

  getCodigos(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiServices.apiCall('planificacion/get-codigos-cpc-gastos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
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

  setPartidas(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiServices.apiCall('planificacion/asigna-partida', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
}
