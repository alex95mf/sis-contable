import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ReporteAcfijoService {

  constructor(private apiSrv: ApiServices) { }

  getProveedores() {
    return this.apiSrv.apiCall('proveedores/get-proveedor', 'POST', {});
  }

  getCatalogos(data) {
    return this.apiSrv.apiCall('productos/get-catalogos', 'POST', data);
  }

  getAdquisiciones(data) {
    return this.apiSrv.apiCall('reporte-ActFijo/show-adquisiciones', 'POST', data);
  }

  getAtivosFijosDT() {
    return this.apiSrv.apiCall('reporte-ActFijo/get-dTActFijo', 'POST', {});
  }

  getDepreciaciones() {
    return this.apiSrv.apiCall('activos/get-depreciaciones', 'POST', {});
  }
  getCurrencys() {
    return this.apiSrv.apiCall('bancos/get-currencys', 'POST', {});
  }
  getCodigoDt() {
    return this.apiSrv.apiCall('reporte-ActFijo/get-dTActFijo', 'POST', {});
  }
  dataActFijoDt(data) {
    return this.apiSrv.apiCall('report-ActFijo-dos/get-activos-dt', 'POST', data);
  }

}
