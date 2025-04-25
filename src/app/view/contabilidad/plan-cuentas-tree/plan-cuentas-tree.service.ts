import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class PlanCuentasTreeService {

  constructor(
    private apiServices: ApiServices
  ) { }

  getCuentasArbol() {
    return this.apiServices.apiCall('plandecuentas/obtener-plancuenta-json', 'POST', {}).toPromise<any>()
  }
}
