import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class EstadoCuentaService {

  constructor(
    private apiServices: ApiServices,
  ) { }

  getMovimientos(data: any = {}) {
    return this.apiServices.apiCall('nomina/estado-cuenta', 'POST', data) as any
  }


  getMovimientosEmpleado(data: any = {}) {
    return this.apiServices.apiCall('nomina/estado-cuenta-empleado', 'POST', data) as any
  }
  // getMovimientosEmpleadoExcel(data) {
  //   return this.apiServices.apiCall('nomina/estado-cuenta-empleado', 'POST', data);
  // }

}
