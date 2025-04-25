import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {

  constructor(private apiService: ApiServices) { }

  saveGrupo(data) {
    return this.apiService.apiCall('parameters/set-groups', 'POST', data);
  }

  presentaTablaGrupo() {
    return this.apiService.apiCall('parameters/get-groups', 'POST', {});
  }

  updateGrupo(data) {
    return this.apiService.apiCall('parameters/patch-groups', 'POST', data);
  }

  deleteGrupo(data) {
    return this.apiService.apiCall('parameters/destroy-groups', 'POST', data);
  }

}
