import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  constructor(
    private apiServices: ApiServices,
  ) { }

  getArbolNomina = (data: any = {}) => {
    return this.apiServices.apiCall('rrhh/get-catalogo-tree', 'POST', data) as any
  }

  getItemCatalogo = (id: number, data: any = {}) => {
    return this.apiServices.apiCall(`rrhh/get-catalogo-item/${id}`, 'POST', data) as any
  }

  setItemCatalogo = (data: any = {}) => {
    return this.apiServices.apiCall('rrhh/set-catalogo-item', 'POST', data) as any
  }

  updateItemCatalogo = (id: number, data: any = {}) => {
    return this.apiServices.apiCall(`rrhh/put-catalogo-item/${id}`, 'POST', data) as any
  }
}
