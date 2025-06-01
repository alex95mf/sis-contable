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
    return this.apiServices.apiCall('seguridad/get-modulos', 'POST', {}) as any
  }

  getCatalogo(data: any = {}) {
    return this.apiServices.apiCall('proveedores/get-catalogo', 'POST', data) as any
  }

  getAlertas(data: any = {}) {
    return this.apiServices.apiCall('seguridad/get-alertas', 'POST', data) as any
  }

  setAlerta(data: any = {}) {
    return this.apiServices.apiCall('seguridad/set-alerta', 'POST', data) as any
  }

  updateAlerta(id: number, data: any = {}) {
    return this.apiServices.apiCall(`seguridad/update-alerta/${id}`, 'POST', data) as any
  }

  deleteAlerta(id: number, data: any = {}) {
    return this.apiServices.apiCall(`seguridad/delete-alerta/${id}`, 'POST', data) as any
  }
}
