import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class SaldosEmpleadoService {

  constructor(
    private apiServices: ApiServices,
  ) { }

  getSaldos = (data: any = {}) => {
    return this.apiServices.apiCall('nomina/consulta-saldos', 'POST', data).toPromise()
  }
}
