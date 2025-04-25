import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ConsultaIdpService {

  constructor(private api: ApiServices) { }

  
  getGeneracionIdp(data) {
    return this.api.apiCall("presupuesto/get-idp-generados", "POST", data);
  }

  setEstado(data){
    return this.api.apiCall("presupuesto/set-estado", "POST", data);
  }
  procesarSp(data: any) {
    return this.api.apiCall('presupuesto/procesar-sp','POST', data);
  }
}
