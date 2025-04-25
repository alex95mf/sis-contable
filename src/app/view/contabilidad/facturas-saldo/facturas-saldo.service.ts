import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class FacturasSaldoService {
  cierreSelected$ = new EventEmitter();

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

  /* getFacturas(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall('ordenPago/get-facturas-sin-orden', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  } */
  getFacturas(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall('ordenPago/get-facturas-sin-orden-new', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  setCierre(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall('gestion-bienes/cierre-cxp/store', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getCierres(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall('gestion-bienes/cierres/list', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getCierre(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiService.apiCall('gestion-bienes/cierres/show', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  deleteCierre(id: number, data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiService.apiCall(`gestion-bienes/cierres/delete/${id}`, 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
}
