import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class KardexService {

  constructor(private apiService: ApiServices, private http: HttpClient) { }
  getProducts() {
    return this.apiService.apiCall('solicitud/search-producto', 'POST', {});
  }

  tablaKardex() {
    return this.apiService.apiCall('kardex/search-show', 'POST', {});
  }
  
  tablaKardexdos(data) {
    return this.apiService.apiCall('kardex/search-showDos', 'POST', data);
  }
  
  getBodegas() {
    return this.apiService.apiCall('bodega/get-bodegaGeneral', 'POST', {});
  }

//Ajuste
  modAjuste(data) {
    return this.apiService.apiCall('kardex/mod-ajuste', 'POST', data);
  }

  getCatalogs(data) {
    return this.apiService.apiCall("proveedores/get-catalogo", "POST", data);
  }

  getGrupo() {
    return this.apiService.apiCall("kardex/grupo-producto", "POST", {});
  }
}