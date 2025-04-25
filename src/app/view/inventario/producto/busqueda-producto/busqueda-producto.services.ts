import { Injectable } from "@angular/core";
import { ApiServices } from "../../../../services/api.service";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class BusquedaProductoService {

  constructor(private apiService: ApiServices, private http: HttpClient) { }

  getProducts() {
    return this.apiService.apiCall('solicitud/search-producto', 'POST', {});
  }

  getPrecio() {
    return this.apiService.apiCall('precios/group-price', 'POST', {});
  }

  showserchProducts(data){
    return this.apiService.apiCall('venta/search-products', 'POST', data);
  }

  
  getMarcas() {
    return this.apiService.apiCall('venta/search-marcas', 'POST', {});
  }


  showReload(data){
    return this.apiService.apiCall('venta/search-reload', 'POST', data);
  }

  showAnexos(data){
    return this.apiService.apiCall('venta/search-anexos', 'POST', data);
  }

  
}
