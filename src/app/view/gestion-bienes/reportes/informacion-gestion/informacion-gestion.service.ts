import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';



@Injectable({
  providedIn: 'root'
})
export class InformacionGestionServices {


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
  
  getDataTipoReporte(data: any = {}) {
    return this.api.apiCall('recaudacion/get-data-reporte', 'POST', data);
  } 

  getData(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.api.apiCall('gestion-bienes/get-reporte', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

}