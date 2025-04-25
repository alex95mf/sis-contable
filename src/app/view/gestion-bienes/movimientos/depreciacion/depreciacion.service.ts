import { Injectable, EventEmitter } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class DepreciacionService {

  constructor(
    private apiService: ApiServices
  ) { }

  depreciacion$ = new EventEmitter<any>()

  getTipoBienes(data: any = {}) {
    return this.apiService.apiCall('presupuesto/get-tipo-bienes', 'POST', data);
  }

  getBienes(data: any = {}) {
    return this.apiService.apiCall('presupuesto/get-bienes-depreciacion', 'POST', data)
  }

  setDepreciacion(data: any = {}) {
    return this.apiService.apiCall('presupuesto/set-depreciacion', 'POST', data)
  }

  getDepreciaciones(data: any = {}) {
    return this.apiService.apiCall('presupuesto/get-depreciaciones', 'POST', data)
  }

  getDepreciacionDetalles(id: number, data: any = {}) {
    return this.apiService.apiCall(`presupuesto/get-depreciacion/${id}`, 'POST', data)
  }

  getBienesAsync(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall('presupuesto/get-bienes-depreciacion', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  deleteDocumento(id: number, data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall(`presupuesto/delete-bienes-depreciacion/${id}`, 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  searchDocumento(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiService.apiCall(`presupuesto/search-depreciacion`, 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
}
