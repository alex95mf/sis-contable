import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class EtiquetaAcfijoService {

  constructor(private apiSrv: ApiServices) { }
  getAtivosFijos(data) {
    return this.apiSrv.apiCall('etiqueta-ActFijo/get-adquisiciones', 'POST', data);
  }
 
 getDepreciaciones() {
return this.apiSrv.apiCall('activos/get-depreciaciones', 'POST', {});
  }

 getCatalogos(data) {
    return this.apiSrv.apiCall('productos/get-catalogos', 'POST', data);
  }

  getCurrencys() {
    return this.apiSrv.apiCall('bancos/get-currencys', 'POST', {});
  }


  printData(data){
    return this.apiSrv.apiCall('plandecuentas/save-data-print', 'POST', data);
  }

  getSucursales() {
    return this.apiSrv.apiCall('administracion/get-sucursal', 'POST', {});
  }
 

  
}
