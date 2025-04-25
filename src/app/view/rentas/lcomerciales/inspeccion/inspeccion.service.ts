import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class InspeccionService {

  constructor(private api: ApiServices) { }

  contribuyenteSelected$ = new EventEmitter<any>()
  feriaSelected$ = new EventEmitter<any>()

  // Pantalla Principal
  getContribuyentes(data: any = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.apiCall('contribuyente/get-contribuyentes', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getLocales(data: any = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.apiCall('inspeccion/get-locales', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getInspecciones(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.api.apiCall('inspeccion/get-inspecciones-local', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
    return 
  }

  // Nuevo Local (Modal)
  setLocal(data: any = {}) {
    return this.api.apiCall('inspeccion/nuevo-local', 'POST', data)
  }

  actualizarLocal(data: any = {}) {
    return this.api.apiCall(`inspeccion/actualizar-local/${data.local.id_local}`, 'POST', data)
  }

  getLocal(data: any = {}) {
    return this.api.apiCall('inspeccion/get-local', 'POST', data)
  }

  // Nueva Inspeccion (Modal)
  setInspeccion(data: any = {}) {
    return this.api.apiCall('inspeccion/nueva-inspeccion', 'POST', data)
  }

  getInspeccion(data: any = {}) {
    return this.api.apiCall('inspeccion/get-inspeccion', 'POST', data)
  }

  actualizaInspeccion(data: any = {}) {
    return this.api.apiCall(`inspeccion/put-inspeccion/${data.id}`, 'POST', data)
  }

  getInspectores(data: any = {}) {
    return this.api.apiCall('inspeccion/get-inspectores', 'POST', data)
  }

  asignaInspector(data: any = {}) {
    return this.api.apiCall(`inspeccion/asignar-inspector/${data.inspeccion.id}`, 'POST', data)
  }

  // Busqueda de Contratos (Modal)
  getContratos(data: any = {}) {
    return this.api.apiCall('inspeccion/get-contratos-contribuyente', 'POST', data)
  }

  // Recuperacion de Catalogo
  getCatalogos(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.api.apiCall('proveedores/get-catalogo', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getSectores(data: any = {}) {
    return this.api.apiCall('inspeccion/get-catalogo', 'POST', data)
  }

  getTipoNegocio(data: any = {}) {
    return this.api.apiCall('inspeccion/get-catalogo', 'POST', data)
  }

  getGrupos(data: any = {}) {
    return this.api.apiCall('inspeccion/get-catalogo', 'POST', data)
  }

  getEstadoLocal(data: any = {}) {
    return this.api.apiCall('inspeccion/get-catalogo', 'POST', data)
  }

  obtenerCatalogos(datos) {
    return this.api.apiCall("proveedores/get-catalogo", "POST", datos);
  }

  getFerias(data: any = {}) {
    return new Promise<any[]>((resolve, reject) => {
      this.api.apiCall('feria/index', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
}
