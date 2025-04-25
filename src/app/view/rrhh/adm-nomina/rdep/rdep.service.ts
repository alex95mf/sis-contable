import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class RdepService {

  constructor(private api: ApiServices) { }

  consultarRdep(data: any) {
    return this.api.apiCall('nomina/get-rdep','POST', data);
  }

  ObtenerRdepXml(anio :number) {
    return this.api.apiCall(`reportes/rdep/xml/${anio}`, 'GET',  {});
  }
  getPeriodos(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.api.apiCall('planificacion/get-periodos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
}

procesarSp(data: any) {
  return this.api.apiCall('nomina/rdep-procesar-sp','POST', data);
}

}
