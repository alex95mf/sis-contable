import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosOnlineService {

  constructor(private apiService: ApiServices) { }

  getUserConectados(data) {
    return this.apiService.apiCall('useronline/get-useronline', 'POST', data);
  } 

}

