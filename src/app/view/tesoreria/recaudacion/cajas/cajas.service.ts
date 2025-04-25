import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CajasService {

  constructor(private api: ApiServices) { }

  getUsuarios() {
    return this.api.apiCall('recaudacion/get-usuarios', 'POST', {})
  }

  getCajas(data) {
    return this.api.apiCall('recaudacion/get-cajas-filtro', 'POST', data)
  }

  createCaja(data) {
    return this.api.apiCall(`recaudacion/create-caja`,"POST", data);
  }

  editCaja(id, data) {
    return this.api.apiCall(`recaudacion/update-caja/${id}`,"POST",data);
  }

  deleteCaja(id) {
    return this.api.apiCall(`recaudacion/delete-caja/${id}`,"POST",{});
  }

  getCatalogos(data) {
    return this.api.apiCall("proveedores/get-catalogo", "POST", data);
  }
}
