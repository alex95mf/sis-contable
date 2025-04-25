import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CapacitacionService {

  constructor(private apiService: ApiServices) { }

  getCatalogoByType(data) {
    return this.apiService.apiCall('proveedores/get-catalogo', 'POST', data);
  }

  getCatalogoByGroup(data){
    return this.apiService.apiCall('proveedores/get-catalogo-group', 'POST', data);
  }

  getDataAtribucion(data){
    return this.apiService.apiCall('planificacion/getIndicadorAtribucion', 'POST', data);
  }

  getBienes(data){
    return this.apiService.apiCall('', 'POST', data);

  }


}
