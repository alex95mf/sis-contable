import { Injectable, EventEmitter } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ParametrosNominaService {

  constructor(private apiSrv: ApiServices) { }

  

  public getParametrosNomina(data){
    return this.apiSrv.apiCall("rrhh/parametros-nomina", "POST", data);
  }

  public setParametrosNomina(data){
    return this.apiSrv.apiCall("rrhh/set-parametros-nomina", "POST", data);
  }


  public updateParametrosNomina(data){
    return this.apiSrv.apiCall("rrhh/update-parametros-nomina", "POST", data);
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

  public updateParametroEmpleados(data){
    return this.apiSrv.apiCall("rrhh/update-parametro-empleados", "POST", data);
  }


  


}
