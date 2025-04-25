import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class GeneracionIdpService {

  constructor(private api: ApiServices) { }
  
  setGeneracionIdp(data) {
    return this.api.apiCall("presupuesto/set-generar-idp", "POST", data);
  }
  getGeneracionIdp(data) {
    return this.api.apiCall("presupuesto/get-idp-generados", "POST", data);
  }

  getAsignacionIngreso(data) {
    return this.api.apiCall("presupuesto/get-asignacion-ingreso", "POST", data);
  }
  getCedulaPreEgreso(data) {
    return this.api.apiCall("presupuesto/get-cedula-pre-egreso", "POST", data);
  }

  getSolicitudModal(data) {
    return this.api.apiCall('compras/get-solicitudes-modal-idp', 'POST', data)
  }

  updateGeneracionIdp(data) {
    return this.api.apiCall("presupuesto/set-generar-idp", "POST", data);
  }
  getIdpSolicitudGenerados(data) {
    return this.api.apiCall("compras/get-solicitudes-idp-generadas", "POST", data);
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
      this.api.apiCall(`presupuesto/anular-idp/${id}`, 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  ajustarIdp(id: number, data: any) {
    return new Promise((resolve, reject) => {
      this.api.apiCall(`presupuesto/ajustar-idp/${id}`, 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  
}
