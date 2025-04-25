import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ReportesIceService {

  constructor(private apiService: ApiServices) { }


  /* obtenerBalanceComprobacion(fecha_desde :string, fecha_hasta :string, centro :string, id_empresa :number, id_usuario :number, nivel :number ) {
    return this.apiService.apiCall(`contabilidad/estadosfinancieros/balance_comprobacion/${fecha_desde}/${fecha_hasta}/${centro}/${id_empresa}/${id_usuario}/${nivel}`, 'GETV1',  {});
  } */

    getReportesIce(data) {
      return this.apiService.apiCall("contabilidad/reportes/reporte_ice","POST",data);
    }
   









  // obtenerReciprocaInicial(anio :number, mes :number) {
  //   return new Promise<Array<any>>((resolve, reject) => {
  //     this.apiService.apiCall(`contabilidad/reporte/esigef/reciproca-inicial?periodo=${anio}&mes=${mes}`, 'GET', {}).subscribe(
  //       (res: any) => resolve(res.data),
  //       (err: any) => reject(err)
  //     )
  //   })
  // }

  

  

  
  




  
}