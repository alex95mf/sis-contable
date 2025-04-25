import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class InfimasService {


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

  searchAtribucion(data) {
    return this.apiService.apiCall('compras/get-atribucion', 'POST', data);
  }

  searchSolicitud(data) {
    return this.apiService.apiCall('compras/get-infimas', 'POST', data);
  }
  setInfimaDatos(data) {
    return this.apiService.apiCall('compras/set-infima-datos', 'POST', data);
  }
  setInfimaDetalles(data) {
    return this.apiService.apiCall('compras/get-infima-detalle', 'POST', data);
  }
  setInfimaProveedor(data) {
    return this.apiService.apiCall('compras/set-infima-proveedor', 'POST', data);
  }
  setInfimaDocFinal(data) {
    return this.apiService.apiCall('compras/set-infima-docfinal', 'POST', data);
  }
  uploadAnexo(file, payload?: any) {
    return this.apiService.apiCallFile('general/upload-files', 'POST', file, payload)
  }
  getInfimas(data:any = {}) {
    return this.apiService.apiCall('compras/get-infimas-excel', 'POST', data);
  }
  saveInfimaDetalles(data) {
    return this.apiService.apiCall('compras/set-infima-detalles', 'POST', data);
  }
  getPeriodos(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall('planificacion/get-periodos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  
}
