import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class GeneracionIcpService {

  constructor(private api: ApiServices) { }
  
  setGeneracionIdp(data) {
    return this.api.apiCall("presupuesto/set-generar-icp", "POST", data);
  }
  getGeneracionIdp(data) {
    return this.api.apiCall("presupuesto/get-icp-generados", "POST", data);
  }

  getAsignacionIngreso(data) {
    return this.api.apiCall("presupuesto/get-asignacion-ingreso", "POST", data);
  }
  getCedulaPreEgreso(data) {
    return this.api.apiCall("presupuesto/get-cedula-pre-egreso", "POST", data);
  }

  getSolicitudModal(data) {
    return this.api.apiCall('compras/get-solicitudes-modal-icp', 'POST', data)
  }

  updateGeneracionIdp(data) {
    return this.api.apiCall("presupuesto/set-generar-icp", "POST", data);
  }
  getIdpSolicitudGenerados(data) {
    return this.api.apiCall("compras/get-solicitudes-icp-generadas", "POST", data);
  }

  getCatalogo(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.api.apiCall('proveedores/get-catalogo', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getPeriodos(data: any = {}) {
    return new Promise<any[]>((resolve, reject) => {
      this.api.apiCall('planificacion/get-periodos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  anularDocumento(id: number, data: any = {}) {
    return new Promise((resolve, reject) => {
      this.api.apiCall(`presupuesto/anular-icp/${id}`, 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getProyectos(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.api.apiCall('planificacion/get-proyectos-planificacion-filter', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
  
  getProyectosTodos(data: any = {}) {
    return this.api.apiCall('planificacion/get-proyectos-planificacion-todos', 'POST', data)
  }
  ajustarIcp(id: number, data: any) {
    return new Promise((resolve, reject) => {
      this.api.apiCall(`presupuesto/ajustar-icp/${id}`, 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
}
