import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class FlujoCajaProyectadoService {

  constructor(private api: ApiServices) { }
  
 
  getFlujosProyectado(data: any) {
    return this.api.apiCall('tesoreria/get-flujo-caja-proyectado','POST', data);
  }

  saveFlujoCajaProyectado(data: any) {
    return this.api.apiCall('tesoreria/save-flujo-caja-proyectado','POST', data);
  }

  setEjecutarFlujoCajaProyectadoSp(data: any) {
    return this.api.apiCall('tesoreria/set-ejecutar-flujoCajaProyectadoSp','POST', data);
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