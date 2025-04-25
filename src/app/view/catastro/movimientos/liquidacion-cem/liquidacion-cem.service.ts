import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class LiquidacionCemService {

  constructor(
    private apiServices: ApiServices,
  ) { }

  liquidacionSelected$ = new EventEmitter<any>();

  getCatalogos(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiServices.apiCall('proveedores/get-catalogo', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getSolares(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiServices.apiCall('catastro/get-sum-solares', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  setLiquidacion(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiServices.apiCall('catastro/set-liquidacion-cem', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getLiquidaciones(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiServices.apiCall('catastro/get-liquidaciones-cem', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getLiquidacion(id: number, data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiServices.apiCall(`catastro/get-liquidacion-cem/${id}`, 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  updateLiquidacion(id: number, data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiServices.apiCall(`catastro/update-liquidacion-cem/${id}`, 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
}
