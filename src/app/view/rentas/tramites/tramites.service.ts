import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TramitesService {

  constructor(
    private apiService: ApiServices
  ) { }

  newTramite$ = new EventEmitter<any>();
  updateTramite$ = new EventEmitter<any>();

  // index
  getTramites(data: any = {}) {
    return this.apiService.apiCall('rentas/get-tramites', 'POST', data)
  }

  // store
  setTramite(data: any = {}) {
    return this.apiService.apiCall('rentas/set-tramite', 'POST', data)
  }

  // show
  getTramite(id: number) {
    return this.apiService.apiCall(`rentas/get-tramite/${id}`, 'POST', {})
  }

  // update
  updateTramite(id: number, data: any = {}) {
    return this.apiService.apiCall(`rentas/update-tramite/${id}`, 'POST', data)
  }

  // destroy
  deleteTramite(id: number) {
    return this.apiService.apiCall(`rentas/delete-tramite/${id}`, 'POST', {})
  }

  // Catalogo
  getCatalogos(data: any = {}) {
    return this.apiService.apiCall('proveedores/get-catalogo', 'POST', data)
  }
}
