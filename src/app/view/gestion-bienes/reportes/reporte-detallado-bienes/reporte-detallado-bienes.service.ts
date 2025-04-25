import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';



@Injectable({
  providedIn: 'root'
})
export class ReporteDetalladoBienesServices {


  constructor(private api: ApiServices) { }
  getTiposReporte(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.api.apiCall('gestion-bienes/get-tipoReporte', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getGruposBienes(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.api.apiCall('gestion-bienes/get-grupos', 'GET', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
  getSubGruposBienes(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.api.apiCall('gestion-bienes/get-sub-grupos', 'GET', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
  
  getDataTipoReporte(data: any = {}) {
    return this.api.apiCall('recaudacion/get-data-reporte', 'POST', data);
  } 

  getData(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.api.apiCall('gestion-bienes/get-reporte-general', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
  listaCentroCostos() {
    return new Promise<Array<any>>((resolve, reject) => {
      this.api.apiCall('centroCosto/lista-centroCosto-activos', 'POST', {}).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getPeriodos(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.api.apiCall('planificacion/get-periodos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }


}