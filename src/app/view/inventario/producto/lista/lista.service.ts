import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ListaProductoService {

  constructor(private apiSrv: ApiServices) { }

  getProducts(data) {
    return this.apiSrv.apiCall('list-precios/get-producto', 'POST', data);
  }

  getGroupPrices() {
    return this.apiSrv.apiCall('precios/group-price', 'POST', {});
  }

  getSelectProductos() {
    return this.apiSrv.apiCall('list-precios/select-producto', 'POST', {});
  }

  printData(data){
    return this.apiSrv.apiCall('plandecuentas/save-data-print', 'POST', data);
  }

   getSucursales() {
    return this.apiSrv.apiCall('administracion/get-sucursal', 'POST', {});
  }
}