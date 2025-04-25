import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ApiCierreService {

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
      this.apiService.apiCall('proveeduria/anticipos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  setDocumento(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall('gestion-bienes/cierre-anticipos-proveedores/store', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
}
