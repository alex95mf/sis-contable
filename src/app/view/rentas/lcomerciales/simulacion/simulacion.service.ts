import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class SimulacionService {

  constructor(
    private apiServices: ApiServices,
  ) { }

  getImpuestos(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiServices.apiCall('local-comercial/get-valor-impuestos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getCatalogos(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiServices.apiCall('proveedores/get-catalogo', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getConceptos(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiServices.apiCall('concepto/get-conceptos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
}
