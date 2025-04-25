import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  setNotificacion$ = new EventEmitter<any>()

  constructor(private apiServices: ApiServices) { }

  getNotificaciones(data: any = {}) {
    return this.apiServices.apiCall('notificaciones/get-notificaciones', 'POST', data).toPromise<any>()
  }

  getModulos() {
    return this.apiServices.apiCall('seguridad/get-modulos', 'POST', {}).toPromise<any>()
  }

  getCatalogo(data: any = {}) {
    return this.apiServices.apiCall('proveedores/get-catalogo', 'POST', data).toPromise<any>()
  }

  deleteNotificacion(id: number, data: any = {}) {
    return this.apiServices.apiCall(`notificaciones/delete/${id}`, 'POST', data).toPromise<any>()
  }

  setNotificacion(data: any = {}) {
    return this.apiServices.apiCall('notificaciones/set-notificacion', 'POST', data).toPromise<any>()
  }

  updateNotificacion(id: number, data: any = {}) {
    return this.apiServices.apiCall(`notificaciones/update/${id}`, 'POST', data).toPromise<any>()
  }
}
