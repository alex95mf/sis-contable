import { Injectable, EventEmitter } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
    providedIn: 'root'
})
export class ReporteProductosService {
    constructor(private apiService: ApiServices) { }
   
    getGruposBienes(data: any = {}) {
        return new Promise<Array<any>>((resolve, reject) => {
          this.apiService.apiCall('gestion-bienes/get-grupos', 'GET', data).subscribe(
            (res: any) => resolve(res.data),
            (err: any) => reject(err)
          )
        })
      }
      getSubGruposBienes(data: any = {}) {
        return new Promise<Array<any>>((resolve, reject) => {
          this.apiService.apiCall('gestion-bienes/get-sub-grupos', 'GET', data).subscribe(
            (res: any) => resolve(res.data),
            (err: any) => reject(err)
          )
        })
      }
      getData(data: any = {}) {
        return new Promise<Array<any>>((resolve, reject) => {
          this.apiService.apiCall('gestion-bienes/get-reporte-producto', 'POST', data).subscribe(
            (res: any) => resolve(res.data),
            (err: any) => reject(err)
          )
        })
      }

      getProductos(data) {
        return this.apiService.apiCall('gestion-bienes/get-productos', 'POST', data);
      }

      getSubproductos(data) {
        return this.apiService.apiCall('gestion-bienes/get-newgrupo-producto-exi', 'POST', data);
      }
      getProductosEX(data, fk_grupo) {
        return this.apiService.apiCall(`gestion-bienes/get-productos/${fk_grupo}`, 'POST', data);
      }

      getProductosTodos(data) {
        return this.apiService.apiCall('gestion-bienes/get-productos-todos', 'POST', data);
      }
      

      
}