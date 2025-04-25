import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ListaPreciosService {

  constructor(private apiSrv: ApiServices) { }

  getProducts(data) {
    return this.apiSrv.apiCall('bienes/get-producto', 'POST', data);
  }

  getGroupPrices() {
    return this.apiSrv.apiCall('bienes/group-price', 'POST', {});
  }

  getSelectProductos() {
    return this.apiSrv.apiCall('bienes/select-producto', 'POST', {});
  }

  printData(data){
    return this.apiSrv.apiCall('bienes/save-data-print', 'POST', data);
  }

   getSucursales() {
    return this.apiSrv.apiCall('bienes/get-sucursal', 'POST', {});
  }

  listarCatalogo(data) {
    return this.apiSrv.apiCall('bienes/get-catalogo', 'POST', data);
  }

  getEmpresa() {
    return this.apiSrv.apiCall('seguridad/get-empresas', 'POST', {});
  }

  updatePrecios(data: any) {
    return this.apiSrv.apiCall('bienes/save-precios','POST', data);
  }
}