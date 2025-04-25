import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CedulaPresupuestariaService {

  constructor(private api: ApiServices) { }

  getCatalogos(data: any) {
    return this.api.apiCall("proveedores/get-catalogo", "POST", data);
  }
  consultarCedulaIngresos(data: any) {
    return this.api.apiCall('movimiento/get-cedula-presupuestaria-ingresos','POST', data);
  }
  getCedulaPorPrograma(data: any) {
    return this.api.apiCall('movimiento/get-cedula-presupuestaria-programas','POST', data);
  }

  consultarCedulaResumen(data: any) {
    return this.api.apiCall('movimiento/get-cedula-presupuestaria-resumen','POST', data);
  }
  consultarCedulaEjecucion(data: any) {
    return this.api.apiCall('movimiento/get-cedula-presupuestaria-ejecucion','POST', data);
  }
  

  setProcesoCedulaPresupuestaria(data: any) {
    return this.api.apiCall('movimiento/set-proceso-cedula-presupuestaria','POST', data);
  }
  cargarDetalles(data: any) {
    return this.api.apiCall('movimiento/get-detalles-reforma','POST', data);
  }

  getPeriodos(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.api.apiCall('planificacion/get-periodos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
  

  

  

  

  
}
