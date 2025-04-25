import { Injectable } from '@angular/core';
import { ApiServices } from '../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProGeneracionDeRetencionService {

  constructor(private apiService: ApiServices) { }

  // getRetencionesPendientes(anio :number, mes :number, fecha_desde: any, fecha_hasta:any,proveedor:any ) {debugger
  //   return this.apiService.apiCall(`contabilidad/retenciones/pendientes/${anio}/${mes}/${fecha_desde}/${fecha_hasta}/${proveedor}`, 'GET',  {});
  // }
  getRetencionesPendientes(data: any) {
    return this.apiService.apiCall('contabilidad/retenciones/pendientes', 'POST', data);
  }

  obtenerCierresPeriodo(data) {
    return this.apiService.apiCall('cierremes/obtenerCierreMes', 'POST', data);
  }  


  obtenerCierresPeriodoPorMes(data) {
    return this.apiService.apiCall('cierremes/obtenerEstatusCierreMes', 'POST', data);
  }

  
  GeneraRetencionesCompraProv(data) {
    //debugger
    return this.apiService.apiCall('retenciones', 'POST',  data);
  }

  // getRetencionesGeneradas(anio :number, mes :number ) {
  //   return this.apiService.apiCall(`contabilidad/retenciones/generadas/${anio}/${mes}`, 'GET',  {});
  // }
  getRetencionesGeneradas(data: any ) {
    return this.apiService.apiCall('contabilidad/retenciones/generadas', 'POST', data);
  }

  AnularRegistroRetenciones(data){
    return this.apiService.apiCall('contabilidad/retenciones/anular', 'POST', data);
  }


}

