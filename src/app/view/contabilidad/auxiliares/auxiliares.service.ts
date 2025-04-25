import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';
import { IAuxuliar } from './IAuxiliares';

@Injectable({
  providedIn: 'root'
})
export class AuxiliaresService {

  constructor(
    private apiService: ApiServices,
  ) { }

  auxiliarStore$ = new EventEmitter();

  getCatalogos(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall('proveedores/get-catalogo', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getAuxiliares(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall('auxiliares/list', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  setAuxiliar(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall('auxiliares/save', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
}
