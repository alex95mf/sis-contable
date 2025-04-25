import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';
@Injectable({
  providedIn: 'root'
})
export class SubgrupoProductoService {

  constructor(
    private apiService: ApiServices
  ) { }

  getSubproductos(data){
    return this.apiService.apiCall(`gestion-bienes/get-subgrupos`, 'POST',data);
  }
  getProductos(data){
    return this.apiService.apiCall('gestion-bienes/grupo-producto', 'POST',data);
  }

  countProductos(data){
    return this.apiService.apiCall('gestion-bienes/crear-codigo', 'POST', data);
  }

  crearsubgrupos(data){
    return this.apiService.apiCall('gestion-bienes/crear-subgrupos', 'POST',data);
  }

  updateSubgrupo(data){
    return this.apiService.apiCall('gestion-bienes/update-subgrupo', 'POST',data);
  }
}
