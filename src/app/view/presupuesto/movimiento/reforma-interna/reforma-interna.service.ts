import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ReformaInternaService {

  constructor(private apiService: ApiServices) { }


  /* searchPrograma(data) {
    return this.apiService.apiCall('compras/get-programa', 'POST', data);
  } */

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
    return this.apiService.apiCall('movimientos/get-reformas-internas', 'POST', data);
  }

  setReformaInterna(data) {
    return this.apiService.apiCall('movimiento/set-reforma-interna', 'POST', data);
  }

  setReformaAtendida(data) {
    return this.apiService.apiCall('movimiento/set-reforma-atendida', 'POST', data);
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
  getPartidaPrecargada(data){
    return this.apiService.apiCall('gestion-bienes/get-partida-precargada', 'POST',data);
  }

  ///////////////////////////////
  crearSolicitud(data) {
    return this.apiService.apiCall('compras/crear-solicitudes', 'POST', data);
  }

  eliminarSolicitud(data) {
    return this.apiService.apiCall('compras/get-eliminar-solicitudes', 'POST', data);
  }


  /////////////////////////////////

  getPeriodos(data: any = {}) {
    return new Promise<any[]>((resolve, reject) => {
      this.apiService.apiCall('planificacion/get-periodos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  searchPrograma(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall('compras/get-programa', 'POST', data).subscribe(
        (res: any) => resolve(res),
        (err: any) => reject(err)
      )
    })
  }

  searchProgramaPeriodo(data) {
    return this.apiService.apiCall('compras/get-programa', 'POST', data);
  }

  duplicarBien(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall('movimientos/duplicar-bien', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getCatalogoPresupuestoreforma(data){
    return this.apiService.apiCall('gestion-bienes/catalogo-presupuesto-departamentoreforma', 'POST',data);
  }
}
