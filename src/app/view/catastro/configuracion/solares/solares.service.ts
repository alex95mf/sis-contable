import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class SolaresService {

  constructor(
    private apiServices: ApiServices,
  ) { }

  getListas(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiServices.apiCall('catastro/get-catalogo', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  setSolar(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiServices.apiCall('catastro/set-solar', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  putCatalogo(id: number, data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiServices.apiCall(`catastro/put-catalogo/${id}`, 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getCatalogos(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiServices.apiCall('proveedores/get-catalogo', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
}
