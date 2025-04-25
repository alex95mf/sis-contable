import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CierreCxcService {
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

  getDocumentos(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall('contribuyente/get-deudas-cierre', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  setDocumento(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall('gestion-bienes/cierre-cuentas-cobrar/store', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getCierres(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiService.apiCall('gestion-bienes/cierre-cuentas-cobrar/index', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getCierre(id: number, data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiService.apiCall(`gestion-bienes/cierre-cuentas-cobrar/show/${id}`, 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  deleteCierre(id: number, data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiService.apiCall(`gestion-bienes/cierre-cuentas-cobrar/delete/${id}`, 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
}
