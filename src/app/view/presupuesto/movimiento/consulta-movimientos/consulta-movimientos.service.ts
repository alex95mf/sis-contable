import { Injectable } from '@angular/core';

import { ApiServices } from 'src/app/services/api.service';
@Injectable({
  providedIn: 'root'
})
export class ConsultaMovimientosService {

  

  constructor(private api: ApiServices) { }

  getPeriodos(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.api.apiCall('planificacion/get-periodos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
}
consultarCedulaIngresos(data: any) {
  return this.api.apiCall('movimiento/get-cedula-presupuestaria-ingresos','POST', data);
}

consultarmovimientos(data: any) {
  return this.api.apiCall('movimiento/get-movimientos','POST', data);
}
}
