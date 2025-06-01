import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  setNotificacion$ = new EventEmitter<any>()

  constructor(private apiServices: ApiServices) { }

  getNotificaciones(data: any = {}) {
    return this.apiServices.apiCall('notificaciones/get-notificaciones', 'POST', data) as any
  }

  getModulos() {
    return this.apiServices.apiCall('seguridad/get-modulos', 'POST', {}) as any
  }

  getCatalogo(data: any = {}) {
    return this.apiServices.apiCall('proveedores/get-catalogo', 'POST', data) as any
  }

  deleteNotificacion(id: number, data: any = {}) {
    return this.apiServices.apiCall(`notificaciones/delete/${id}`, 'POST', data) as any
  }

  setNotificacion(data: any = {}) {
    return this.apiServices.apiCall('notificaciones/set-notificacion', 'POST', data) as any
  }

  updateNotificacion(id: number, data: any = {}) {
    return this.apiServices.apiCall(`notificaciones/update/${id}`, 'POST', data) as any
  }
}
