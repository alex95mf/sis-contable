import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class FlujoCajaService {

  constructor(private api: ApiServices) { }
  
 
  getFlujos(data: any) {
    return this.api.apiCall('tesoreria/get-flujo-caja','POST', data);
  }

  saveFlujoCaja(data: any) {
    return this.api.apiCall('tesoreria/save-flujo-caja','POST', data);
  }

  setEjecutarFlujoCajaSp(data: any) {
    return this.api.apiCall('tesoreria/set-ejecutar-flujoCajaSp','POST', data);
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