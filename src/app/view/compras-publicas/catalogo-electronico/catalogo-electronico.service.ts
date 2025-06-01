import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CatalogoElectronicoService {

  constructor(private apiService: ApiServices) { }

  searchPrograma(data) {
    return this.apiService.apiCall('compras/get-programa', 'POST', data);
  }

  // searchDepartamento(data) {
  //   return this.apiService.apiCall('compras/get-departamentoOld', 'POST', data);
  // }
  searchDepartamento(data) {
    return this.apiService.apiCall('compras/get-programa-departamento', 'POST', data);
  }

  getPeriodos(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall('planificacion/get-periodos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  searchAtribucion(data) {
    return this.apiService.apiCall('compras/get-atribucion', 'POST', data);
  }

  searchSolicitud(data) {
    return this.apiService.apiCall('compras/get-ce', 'POST', data);
  }

  searchCatElecDetalle(data) {
    return this.apiService.apiCall('compras/get-ce-detalle', 'POST', data);
  }
  setCatElecDatos(data) {
    return this.apiService.apiCall('compras/set-ce-datos', 'POST', data);
  }
  setCatElecOrdenes(data) {
    return this.apiService.apiCall('compras/set-ce-ordenes', 'POST', data);
  }
  getOrdenesCompraCatElec(data) {
    return this.apiService.apiCall('compras/get-ce-ordenes', 'POST', data);
  }

  getProveedores(data:any = {}) {
    return this.apiService.apiCall('compras/get-ce-proveedor', 'POST', data);
  }
  uploadAnexo(file, payload?: any) {
    return this.apiService.apiCallFile('general/upload-files', 'POST', file, payload)
  }

  setCatAdminDatos(data) {
    return this.apiService.apiCall('compras/set-admin-datos', 'POST', data);
  }


  getCatalogos(data: any = {}) {
    return this.apiService.apiCall('proveedores/get-catalogo', 'POST', data)
  }

  getCataElectronico(data:any = {}) {
    return this.apiService.apiCall('compras/get-catalogo-electronico-excel', 'POST', data);
  }

  setEstadoOrden(data: any = { }) {
    return this.apiService.apiCall('compras/set-estado-orden', 'POST', data) as any;
  }
  saveCatElecDetalles(data) {
    return this.apiService.apiCall('compras/set-cat-elec-detalles', 'POST', data);
  }
}
