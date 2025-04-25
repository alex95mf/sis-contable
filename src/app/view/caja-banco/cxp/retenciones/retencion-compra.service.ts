import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})

export class RetencionCompraService {

  constructor(private apiSrv: ApiServices) { }

  getAgente() {
    return this.apiSrv.apiCall('available/agent-retencion', 'POST', {});
  }

  getEmpresas() {
    return this.apiSrv.apiCall('seguridad/get-empresas', 'POST', {});
  }

  getAllRetencionesC(data){
    return this.apiSrv.apiCall('reporte-Retenciones-C/getAll-Retenciones', 'POST', data);
  }

  getAllRetencionesDt(){
    return this.apiSrv.apiCall('reporte-Retenciones-dt/getAll-RetencionesV', 'POST', {}); 
  }

  getProveedores() {
    return this.apiSrv.apiCall('reports/get-Proveedores', 'POST', {});
  }

  deletRetencion(data) {
    return this.apiSrv.apiCall('taxes/delete-cxp-retencion', 'POST', data);
  }

}
