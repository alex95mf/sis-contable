import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class RetencionesFuenteService {
  
  constructor(private apiSrv: ApiServices) { }

  public getData(data){
    return this.apiSrv.apiCall("retenciones-fuente/get", "POST", data);
  }

  public setRetencion(data){
    return this.apiSrv.apiCall("retenciones-fuente/set", "POST", data);
  }


  public updateRetencion(data){
    return this.apiSrv.apiCall("retenciones-fuente/put", "POST", data);
  }


  getConCuentas(data){
    return this.apiSrv.apiCall('gestion-bienes/cuentas', 'POST',data);
  }

  getCatalogoPresupuesto(data){
    return this.apiSrv.apiCall('gestion-bienes/catalogo-presupuesto', 'POST',data);
  }


  getNomCatalogo(data){
    return this.apiSrv.apiCall('rrhh/nom-catalogos', "POST", data);
  }
}
