import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private api: ApiServices,
  ) { }

  getCatalogos(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.api.apiCall('proveedores/get-catalogo', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getDocumentos(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.api.apiCall('liquidacion/get-docs-superavit', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  setDocumento(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.api.apiCall('gestion-bienes/cierre-saldos-contribuyente/store', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
}
