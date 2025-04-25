import { Injectable , EventEmitter} from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ParametrosCuentasComprobantesService {

  constructor(private apiSrv: ApiServices) { }
  listaParametros$ = new EventEmitter<any>();
  public getData(data){
    return this.apiSrv.apiCall("contabilidad/configuracion/get-parametros-contables", "POST", data);
  }

  // public setParametros(data){
  //   return this.apiSrv.apiCall("retenciones-iva/set", "POST", data);
  // }
  public setParametros(data){
    return this.apiSrv.apiCall("contabilidad/configuracion/save-parametros-contables", "POST", data);
  }


  public updateParametros(data){
    return this.apiSrv.apiCall("contabilidad/configuracion/update-parametros-contables", "POST", data);
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

  getEventosContables(data: any = {}){
    return this.apiSrv.apiCall('contabilidad/configuracion/get-eventos-contables', "POST", data);

  }
}
