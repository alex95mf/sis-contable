import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class RprtAtsService {

  constructor(private apiService: ApiServices) { }

  getNomDepart() {
    return this.apiService.apiCall('parameters/get-groups', 'POST', {});
  }

  getPersonalDe(data) {
    return this.apiService.apiCall('report-nomina/get-personal-nomina', 'POST', data);
  }

  getPersonalCumple(data) {
    return this.apiService.apiCall('report-nomina/get-personal-cumple', 'POST', data);
  }

  getPersonalAll() {
    return this.apiService.apiCall('prestamos/show-personal', 'POST', {});
  }
  
  getPersonalCarga(data) {
    return this.apiService.apiCall('report-nomina/get-personal-carga', 'POST', data);
  }

  getReporteAtsCompras(anio :number, mes :number, idusuario:number ) {
    return this.apiService.apiCall(`reportes/ats/compras/${anio}/${mes}/${idusuario}`, 'GET',  {});
  }

  getReporteAtsVentas(anio :number, mes :number, idusuario:number ) {
    return this.apiService.apiCall(`reportes/ats/ventas/${anio}/${mes}/${idusuario}`, 'GET',  {});
  }


  getReporteAtsRetenciones(anio :number, mes :number, idusuario:number ) {
    return this.apiService.apiCall(`reportes/ats/retenciones/${anio}/${mes}/${idusuario}`, 'GET',  {});
  }

  registerAtsAnulados(anio :number, mes :number, idusuario:number ) {
    return this.apiService.apiCall(`reportes/ats/anulados/${anio}/${mes}/${idusuario}`, 'GET',  {});
  }

  registerAtsGeneral(anio :number, mes :number, idusuario:number ) {
    return this.apiService.apiCall(`reportes/ats/register/${anio}/${mes}/${idusuario}`, 'GET',  {});
  }


  ObtenerAtsXml(anio :number, mes :number, idusuario:number ) {
    return this.apiService.apiCall(`reportes/ats/xml/${anio}/${mes}/${idusuario}`, 'GET',  {});
  }
  
  getPeriodos(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall('planificacion/get-periodos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
}

}
