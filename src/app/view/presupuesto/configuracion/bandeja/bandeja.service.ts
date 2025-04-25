import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class BandejaService {

  constructor(private api: ApiServices) { }
  
  guardarIngresosPorPeriodo(data: any) {
    return this.api.apiCall('presupuesto/guardar-reforma','POST', data);
  }
  getactivenotifications(data: any) {
    return this.api.apiCall('presupuesto/getactivenotifications','POST', data);
  }
  
  getReformas(data: any) {
    return this.api.apiCall('presupuesto/get-reforma','POST', data);
  }
  
  delIngresosPorPeriodo(data: any) {
    return this.api.apiCall('presupuesto/delete-asignacion-ingresos','POST', data);
  }

  anularIngrePorPeriodo(data: any) {
    return this.api.apiCall('presupuesto/anular-asignacion-ingresos','POST', data);
  }
  getCatalogs(data) {
    return this.api.apiCall("proveedores/get-catalogo", "POST", data);
  }
  validarPartidas(data) {
    return this.api.apiCall("presupuesto/validar-partidas", "POST", data);
  }
  

  getPeriodos(data: any = {}) {
    return new Promise<any[]>((resolve, reject) => {
      this.api.apiCall('planificacion/get-periodos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getCatalogo(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.api.apiCall('proveedores/get-catalogo', 'POST', data).subscribe(
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
}
