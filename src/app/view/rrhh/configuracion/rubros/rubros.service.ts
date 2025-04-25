import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class RubrosService {

  constructor(private apiSrv: ApiServices) { }


  public getRubros(data){
    return this.apiSrv.apiCall("rrhh/rubros", "POST", data);
  }


  public setRubros(data){
    return this.apiSrv.apiCall("rrhh/setrubros", "POST", data);
  }


  public updateRubros(data){
    return this.apiSrv.apiCall("rrhh/updaterubros", "POST", data);
  }


  getConCuentas(data){
    return this.apiSrv.apiCall('gestion-bienes/cuentas', 'POST',data);
  }
  getConCuentasconReglas(data){
    return this.apiSrv.apiCall('gestion-bienes/cuentasconRegla', 'POST',data);
  }
  

  getCatalogoPresupuesto(data){
    return this.apiSrv.apiCall('gestion-bienes/catalogo-presupuesto', 'POST',data);
  }


  getNomCatalogo(data){
    return this.apiSrv.apiCall('rrhh/nom-catalogos', "POST", data);
  }


}
