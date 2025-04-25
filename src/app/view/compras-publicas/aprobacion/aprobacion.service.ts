import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AprobacionService {

  constructor(private apiService: ApiServices) { }


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
  
  searchDepartamento(data) {
    return this.apiService.apiCall('compras/get-programa-departamento', 'POST', data);
  }

  searchAtribucion(data) {
    return this.apiService.apiCall('compras/get-atribucion', 'POST', data);
  }

  searchSolicitud(data) {
    return this.apiService.apiCall('compras/get-solicitudesByDet', 'POST', data);
  }
  

  saveAprobacion(data) {
    return this.apiService.apiCall('compras/update-atribucion', 'POST', data);
  }


  getCatalogos(data: any = {}) {
    return this.apiService.apiCall("proveedores/get-catalogo", "POST", data);
  }

  getBienes(data) {
    return this.apiService.apiCall('planificacion/get-bienes-departamento', 'POST', data);
  }

  consultarIcp(data){
    return this.apiService.apiCall('compras/get-icp', 'POST', data);
  }

  reversarSolicitud(data){
    return this.apiService.apiCall('compras/reversar-solicitud', 'POST', data);
  }
  

  
  
}
