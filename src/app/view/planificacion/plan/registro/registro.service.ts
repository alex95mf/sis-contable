import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class PlanRegistroService {

  constructor(private apiServices : ApiServices) {  }
  getPeriodos(data: any = {}) {
    return new Promise<any[]>((resolve, reject) => {
      this.apiServices.apiCall('planificacion/get-periodos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getCatalogs(data) 
  {
    return this.apiServices.apiCall("proveedores/get-catalogo", "POST", data);
  }

  getProgramas() {
    return new Promise<any[]>((resolve, reject) => {
      this.apiServices.apiCall('planificacion/get-programas', 'POST', {}).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
    // return this.apiServices.apiCall('planificacion/get-programas', 'POST', {});
  }

  getAsignacionInicial(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiServices.apiCall('planificacion/get-asignacion-inicial', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getPresupuesto(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiServices.apiCall('planificacion/get-presupuesto', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getPresupuestoProgramas(data: any = {}) {
    return new Promise<any[]>((resolve, reject) => {
      this.apiServices.apiCall('planificacion/get-presupuesto-programas', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  setPresupuesto(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiServices.apiCall('planificacion/save-budget', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  setPresupuestoProgramas(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiServices.apiCall('planificacion/set-presupuesto-programas', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  updatePresupuesto(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiServices.apiCall('planificacion/update-budget', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  enviarCorreos(data: any = {}) {
    return this.apiServices.apiCall('planificacion/send-mail', 'POST', data);
  }
}
