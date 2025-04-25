import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class GestionService {

  constructor(private api: ApiServices) { }

  getCalEvents() {
    return this.api.apiCall('calendario/get-all-eventos', 'POST', {})
  }

  getLRCalEvents(data: any) {
    return this.api.apiCall('calendario/get-lr-eventos', 'POST', data)
  }

  crearCalEvent(data: any) {
    return this.api.apiCall('calendario/create-evento', 'POST', data)
  }

  editarCalEvent(data: any) {
    return this.api.apiCall('calendario/edit-evento/'+data.evento.id_cal_eventos, 'POST', data)
  }

  eliminarCalEvent(id: number) {
    return this.api.apiCall('calendario/delete-evento/'+id, 'POST', {})
  }

  getCalEventById(id: number) {
    return this.api.apiCall('calendario/get-evento-by-id/'+id, 'POST', {})   
  }
  
  getCatalogos(data: any) {
    return this.api.apiCall("proveedores/get-catalogo", "POST", data);
  }

}
