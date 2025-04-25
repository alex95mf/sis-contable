import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class GruposService {

  constructor(
    private apiService: ApiServices
  ) { }

  getGrupos(data: any = {}) {
    return this.apiService.apiCall('inventario/get-grupos', 'POST', data)
  }

  getGrupo(data: any = {}) {
    return this.apiService.apiCall('inventario/get-grupo', 'POST', data)
  }

  setGrupo(data: any = {}) {
    return this.apiService.apiCall('inventario/set-grupo', 'POST', data)
  }

  updateGrupo(id: number, data: any = {}) {
    return this.apiService.apiCall(`inventario/update-grupo/${id}`, 'POST', data)
  }

  getConCuentas(data){
    return this.apiService.apiCall('gestion-bienes/cuentas', 'POST',data);
  }

  getCatalogoPresupuesto(data){
    return this.apiService.apiCall('gestion-bienes/catalogo-presupuesto', 'POST',data);
  }

  getCatalogs(data) {
    return this.apiService.apiCall("proveedores/get-catalogo", "POST", data);
  }

  getLastChild(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall('inventario/get-last-child', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
}
