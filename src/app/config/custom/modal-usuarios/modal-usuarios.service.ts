import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ModalUsuariosService {

  constructor(private api: ApiServices) { }

  getUsuarios(data){
    return this.api.apiCall('contribuyente/get-usuarios', 'POST', data);
  }

}
