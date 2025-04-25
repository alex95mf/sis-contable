import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})

export class RetencionVentaService {

  constructor(private apiSrv: ApiServices) { }

  getAgente() {
    return this.apiSrv.apiCall('available/agent-retencion', 'POST', {});
  }

  getEmpresas() {
    return this.apiSrv.apiCall('seguridad/get-empresas', 'POST', {});
  }

  getAllRetenciones(data){
    return this.apiSrv.apiCall('reporte-Retenciones/getAll-Retenciones', 'POST', data);
  }

  getAllRetencionesDt(){
    return this.apiSrv.apiCall('reporte-Retenciones-dt/getAll-RetencionesV', 'POST', {});
  }

  getCliente() {
    return this.apiSrv.apiCall('reporte-Retenciones-dt/get-cliente', 'POST', {});
  }

  deletRetencion(data) {
    return this.apiSrv.apiCall('taxes/delete-cxc-retencion', 'POST', data);
  }

}
