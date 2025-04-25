import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AsignacionIngresosService {

  constructor(private api: ApiServices) { }
  
  guardarIngresosPorPeriodo(data: any) {
    return this.api.apiCall('presupuesto/guardar-asignacion-ingresos','POST', data);
  }

  guardarIngresosPorPeriodoprb(data: any) {
    return this.api.apiCall('presupuesto/guardar-asignacion-ingresosprb','POST', data);
  }

  getIngresosPorPeriodo(data: any) {
    return this.api.apiCall('presupuesto/get-asignacion-ingresos','POST', data);
  }
  /* getIngresosPorPeriodopbr(data: any) {
    return this.api.apiCall('presupuesto/get-asignacion-ingresosprb','POST', data);
  } */
  searchProgramabyCode(data) {
    return this.api.apiCall('compras/get-programabyCode', 'POST', data);
  }

  searchProgramaAll(data) {
    return this.api.apiCall('compras/get-programaAll', 'POST', data);
  }
  searchgetCatalogosPresupuestoJ(data) {
    return this.api.apiCall('compras/getCatalogosPresupuestoJ', 'POST', data);
  }
  

  getIngresosPorPeriodopbr(data: any) {
    return this.api.apiCall('presupuesto/get-asignacion-ingresospbr','POST', data);
  }
  
  delIngresosPorPeriodo(data: any) {
    return this.api.apiCall('presupuesto/delete-asignacion-ingresos','POST', data);
  }

  delIngresosPorPeriodoprb(data: any) {
    return this.api.apiCall('presupuesto/delete-asignacion-ingresosprb','POST', data);
  }

  cargarPeriodos(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.api.apiCall('planificacion/get-periodos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  generarPeriodoPresupuesto(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.api.apiCall('presupuesto/generar-periodo', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

}
