import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionContableService {

  constructor(
    private api: ApiServices
  ) { }

  getConfiguracionContable(data){
    return this.api.apiCall('tesoreria/configuracion-contable',"POST", data);
  }

  postConfiguracionContable(data){
    return this.api.apiCall('tesoreria/set-onfiguracion-contable', "POST", data);
  }

  updateConfiguracionContable(data){
    return this.api.apiCall('tesoreria/update-configuracion-contable', "POST", data);
  }

  getConCuentas(data){
    return this.api.apiCall('gestion-bienes/cuentas', 'POST',data);
  }

  getCatalogoPresupuesto(data){
    return this.api.apiCall('gestion-bienes/catalogo-presupuesto', 'POST',data);
  }

  getCatalogos(data) {
    return this.api.apiCall("proveedores/get-catalogo", "POST", data);
  }
}
