import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ReformaCodigoService {

  constructor(private apiService: ApiServices) { }

  periodoSelected$ = new EventEmitter<any>();
  programaSelected$ = new EventEmitter<any>();
  partidaSelected$ = new EventEmitter<any>();

  actualizarDetalles$ = new EventEmitter<any>();
  reformaSelected$ = new EventEmitter<any>();

  searchPrograma(data) {
    return this.apiService.apiCall('compras/get-programa', 'POST', data);
  }

  getPeriodos(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall('planificacion/get-periodos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getProgramas(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall('planificacion/get-programas', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getPartidas(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall('gestion-bienes/catalogo-presupuesto', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getBienes(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall('movimientos/get-reformas-codigo', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getReformas(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiService.apiCall('presupuesto/get-reforma', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getCatalogo(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall('proveedores/get-catalogo', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  duplicarBien(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall('movimientos/duplicar-bien', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  searchDepartamento(data) {
    return this.apiService.apiCall('compras/get-programa-departamento', 'POST', data);
  }

  searchDepartamentoSelect(data) {
    return this.apiService.apiCall('compras/get-programa-departamentoSelect', 'POST', data);
  }

  searchAtribucion(data) {
    return this.apiService.apiCall('compras/get-atribucion', 'POST', data);
  }

  searchSolicitud(data) {
    return this.apiService.apiCall('compras/get-solicitudesByDet', 'POST', data);
  }

  searchBienes(data) {
    return this.apiService.apiCall('movimientos/get-reformas-codigo', 'POST', data);
  }

  setReformaInterna(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiService.apiCall('movimiento/set-reforma-interna', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    });
  }

  setReformaDetalles(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall('movimiento/set-reforma-interna-detalles', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    });
  }

  getReformaInterna(data) {
    return this.apiService.apiCall('movimiento/get-reforma-interna', 'POST', data);
  }


  getConCuentas(data){
    return this.apiService.apiCall('gestion-bienes/cuentas', 'POST',data);
  }

  getCatalogoPresupuesto(data){
    return this.apiService.apiCall('gestion-bienes/catalogo-presupuesto-departamento', 'POST',data);
  }

  getCatalogoPresupuestoreforma(data){
    return this.apiService.apiCall('gestion-bienes/catalogo-presupuesto-departamentoreforma', 'POST',data);
  }

   ///////////////////////////////
   crearSolicitud(data) {
    return this.apiService.apiCall('compras/crear-solicitudes', 'POST', data);
  }

  eliminarSolicitud(data) {
    return this.apiService.apiCall('compras/get-eliminar-solicitudes', 'POST', data);
  }

}
