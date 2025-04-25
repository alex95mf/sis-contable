import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProyeccionGastosService {

  constructor(private api: ApiServices) { }
  
 
  getGastosProyectados(data: any) {
    return this.api.apiCall('tesoreria/get-gastos-proyeccion','POST', data);
  }

  saveProyeccionGastos(data: any) {
    return this.api.apiCall('tesoreria/save-gastos-proyeccion','POST', data);
  }

  setEjecutarProyeccionGastosSp(data: any) {
    return this.api.apiCall('tesoreria/set-ejecutar-proyeccionGastosSp','POST', data);
  }

  getPeriodos(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.api.apiCall('planificacion/get-periodos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }


}