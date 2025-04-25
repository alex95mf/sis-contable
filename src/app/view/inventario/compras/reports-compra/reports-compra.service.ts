
import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ReportsCompraService {

  constructor(private apiSrv: ApiServices) { }
  getProveedores() {
    return this.apiSrv.apiCall('reports/get-Proveedores', 'POST', {});
  }
 
  getDocuments() {
    return this.apiSrv.apiCall('reports/get-Documents', 'POST', {});
  }

  getReporteConsultar(data){
    return this.apiSrv.apiCall('reports/get-consultarCompra', 'POST', data);
  }

}
