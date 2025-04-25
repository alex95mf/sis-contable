import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProgramaRegistroService {

  constructor(private apiServices : ApiServices) { }

  getCatalogs(data) 
  {
    return this.apiServices.apiCall("proveedores/get-catalogo", "POST", data);
  }

  // getProgramas()
  // {
  //   return this.apiServices.apiCall('planificacion/get-programas', 'POST', {});
  // }

  getDepartamentosPrograma(data)
  {
    return this.apiServices.apiCall('planificacion/get-departamentos-programa', 'POST', data);
  }

  setDeptBudget(data)
  {
    return this.apiServices.apiCall('planificacion/save-dept-budget', 'POST', data);
  }

  // setPresupuestoDepartamentos(data) {
  //   return this.apiServices.apiCall('planificacion/set-presupuesto-departamentos', 'POST', data);
  // }

  getDeptBudget(data)
  {
    return this.apiServices.apiCall('planificacion/get-dept-budget', 'POST', data);
  }

  getPresupuestoPrograma(data)
  {
    return this.apiServices.apiCall('planificacion/get-presupuesto-programa', 'POST', data);
  }

  getPresupuestoDepartamentos(data) {
    return this.apiServices.apiCall('planificacion/get-presupuesto-departamentos', 'POST', data);
  }

  updateDeptBudget(data)
  {
    return this.apiServices.apiCall('planificacion/update-dept-budget', 'POST', data);
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
    return new Promise<any[]>((resolve, reject) => {
      this.apiServices.apiCall('planificacion/get-programas', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getProgramaPresupuesto(data: any = {}) {
    return new Promise<any[]>((resolve, reject) => {
      this.apiServices.apiCall('planificacion/get-programa-presupuesto', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getDepartamentosPresupuesto(data: any = {}) {
    return new Promise<any[]>((resolve, reject) => {
      this.apiServices.apiCall('planificacion/get-departamentos-presupuesto', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  setPresupuestoDepartamentos(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiServices.apiCall('planificacion/set-presupuesto-departamentos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
}
