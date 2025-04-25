import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ListaMercadoService {

  constructor(
    private api: ApiServices
  ) { }


  getListaMercado(data) {
    return this.api.apiCall('proveedores/get-lista-mercado', 'POST', data)
  }

  getCatalogs(data) {
    return this.api.apiCall("proveedores/get-catalogo", "POST", data);
  }
}
