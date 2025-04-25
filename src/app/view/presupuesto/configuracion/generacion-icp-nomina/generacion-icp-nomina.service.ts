import { Injectable , EventEmitter} from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class GeneracionIcpNominaService {

  constructor(private api: ApiServices) { }

  presupuestoSelected$ = new EventEmitter<any>();
  
  setGeneracionIdpNomina(data) {
    return this.api.apiCall("presupuesto/set-generar-icp-nomina", "POST", data);
  }
  
  getGeneracionIdpNomina(data) {
    return this.api.apiCall("presupuesto/get-icp-generados-nomina", "POST", data);
  }

  getAsignacionIngreso(data) {
    return this.api.apiCall("presupuesto/get-asignacion-ingreso", "POST", data);
  }
  getCedulaPreEgreso(data) {
    return this.api.apiCall("presupuesto/get-cedula-pre-egreso", "POST", data);
  }

  // getCedulaPreGastos(data) {
  //   return this.api.apiCall('compras/get-solicitudes-modal-icp', 'POST', data)
  // }
  getCedulaPreGastos(data) {
    return this.api.apiCall('presupuesto/get-cedula-presupuestaria-gastos', 'POST', data)
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
  ajustarIcpNomina(id: number, data: any) {
    return new Promise((resolve, reject) => {
      this.api.apiCall(`presupuesto/ajustar-icp-nomina/${id}`, 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
  searchProgramaPeriodo(data) {
    return this.api.apiCall('compras/get-programa', 'POST', data);
  }
}
