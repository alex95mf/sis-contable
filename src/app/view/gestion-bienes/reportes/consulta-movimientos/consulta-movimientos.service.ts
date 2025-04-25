import { Injectable, EventEmitter } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
    providedIn: 'root'
})
export class ConsultaMovimientosService {
    constructor(private apiService: ApiServices) { }

    getCatalogs(data) {
        return this.apiService.apiCall("proveedores/get-catalogo", "POST", data);
      }
    
    getData(data: any) {
    return new Promise<Array<any>>((resolve, reject) => {
        this.apiService.apiCall('gestion-bienes/get-reporte-consulta-movimientos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
        )
    })
    }
    getBodegas(data: any = {}) {
        return new Promise<Array<any>>((resolve, reject) => {
          this.apiService.apiCall('bodega/get-bodegaGeneral', 'POST', data).subscribe(
            (res: any) => resolve(res.data),
            (err: any) => reject(err)
          )
        })
      }
    

   
      
}