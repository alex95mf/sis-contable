import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

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

  getArbol(data: any = {}) {
    return this.apiServices.apiCall('catastro/get-tree', 'POST', data) as any;
  }

  getItemCatalogo(data: any = {}) {
    return this.apiServices.apiCall('catastro/get-item-catalogo', 'POST', data) as any
  }

  setCatalogo(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiServices.apiCall('catastro/set-catalogo', 'POST', data).subscribe(
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
}
