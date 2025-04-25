import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class VencimientoService {

  constructor(
    private apiServices: ApiServices,
  ) { }

  getDocumentos(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiServices.apiCall('registro-poliza/get-poliza', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }




  

  getCatalogos(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiServices.apiCall('proveedores/get-catalogo', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
}
