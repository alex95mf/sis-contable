import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class NotifConfigService {
  setAlerta$ = new EventEmitter<void>();

  constructor(
    private apiServices: ApiServices,
  ) { }

  getModulos() {
    return this.apiServices.apiCall('seguridad/get-modulos', 'POST', {}).toPromise<any>()
  }

  getCatalogo(data: any = {}) {
    return this.apiServices.apiCall('proveedores/get-catalogo', 'POST', data).toPromise<any>()
  }

  getAlertas(data: any = {}) {
    return this.apiServices.apiCall('seguridad/get-alertas', 'POST', data).toPromise<any>()
  }

  setAlerta(data: any = {}) {
    return this.apiServices.apiCall('seguridad/set-alerta', 'POST', data).toPromise<any>()
  }

  updateAlerta(id: number, data: any = {}) {
    return this.apiServices.apiCall(`seguridad/update-alerta/${id}`, 'POST', data).toPromise<any>()
  }

  deleteAlerta(id: number, data: any = {}) {
    return this.apiServices.apiCall(`seguridad/delete-alerta/${id}`, 'POST', data).toPromise<any>()
  }
}
