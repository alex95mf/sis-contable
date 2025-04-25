import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ModalContribuyentesService {

  constructor(private api: ApiServices) { }

  getContribuyentes(data:any = {}) {
    return this.api.apiCall('contribuyente/get-contribuyentes-lote', 'POST', data);
  }

  getCatalogo(data:any = {}) {
    return this.api.apiCall('rentas/configuracion/con-contribuyente-catalogo', 'POST', data);
  }

}
