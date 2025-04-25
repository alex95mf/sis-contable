import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';
import { IProductoResponse } from './IProducto';

@Injectable({
  providedIn: 'root'
})
export class ReclasificacionService {
  refresh$ = new EventEmitter();

  constructor(
    private apiService: ApiServices,
  ) { }

  getProductos(data: any = {}) {
    return new Promise<IProductoResponse>((resolve, reject) => {
      this.apiService.apiCall('productos/get-productos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  reasignar(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiService.apiCall('productos/reasignar-producto', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
}
