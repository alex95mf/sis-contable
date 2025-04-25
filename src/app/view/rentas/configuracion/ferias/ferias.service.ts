import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class FeriasService {
  selectContribuyente$ = new EventEmitter<any>();
  createTable$ = new EventEmitter<any>();
  updateTable$ = new EventEmitter<any>();

  constructor(
    private apiServices: ApiServices,
  ) { }

  getContribuyentes(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiServices.apiCall('contribuyente/get-contribuyentes', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getFerias(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiServices.apiCall(`feria/index`, 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getFeria(id: number, data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiServices.apiCall(`feria/show/${id}`, 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  setFeria(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiServices.apiCall('feria/store', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  updateFeria(id: number, data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiServices.apiCall(`feria/update/${id}`, 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
}
