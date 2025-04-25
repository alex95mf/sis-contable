import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CierreBienesService {
  cierreSelected$ = new EventEmitter<any>();

  constructor(
    private apiService: ApiServices,
  ) { }

  getCatalogos(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall('proveedores/get-catalogo', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getBienes(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall('presupuesto/get-bienes-depreciacion', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  setDocumento(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiService.apiCall('gestion-bienes/cierre-bienes/store', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getCierres(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiService.apiCall('gestion-bienes/cierre-bienes/index', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getCierre(id: number, data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiService.apiCall(`gestion-bienes/cierre-bienes/show/${id}`, 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  deleteCierre(id: number, data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiService.apiCall(`gestion-bienes/cierre-bienes/delete/${id}`, 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
}
