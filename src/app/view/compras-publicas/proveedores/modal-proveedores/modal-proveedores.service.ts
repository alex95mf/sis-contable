import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ModalProveedoresService {

  constructor(private api: ApiServices) { }

  // getProveedores(data:any = {}) {
  //   return this.api.apiCall('proveedores/get-proveedores', 'POST', data);
  // }
  getProveedores(data:any = {}) {
    return this.api.apiCall('proveedores/get-proveedores-todos', 'POST', data);
  }
  getCatalogo(data:any = {}) {
    return this.api.apiCall('rentas/configuracion/con-contribuyente-catalogo', 'POST', data);
  }

}
