import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CostasService {

  constructor(
    private apiService: ApiServices
  ) { }

  getJuicio(data: any) {
    return this.apiService.apiCall('legal/get-juicios', 'POST', data)
  }

  getCostas(data: any) {
    return this.apiService.apiCall('legal/get-costas', 'POST', data)
  }

  setRecDocumento(data: any) {
    return this.apiService.apiCall('legal/set-costas', 'POST', data)
  }

  getCatalogos(data) {
    return this.apiService.apiCall("proveedores/get-catalogo", "POST", data);
  }
  getCajaActiva(id) {
    return this.apiService.apiCall('recaudacion/get-caja-activa/'+id, 'POST', {})
  }
  getCajaDiaByCaja(data) {
    return this.apiService.apiCall('recaudacion/get-caja-dia-by-caja', 'POST', data)
  }
  getJuicios(data,id){
    return this.apiService.apiCall(`juicio/juicio-contribuyente/${id}`, 'POST',data);
 }
 getRecDocumentos(data) {
  return this.apiService.apiCall("liquidacion/get-rec-documento-costas", "POST", data);
 }
 
 anularCosta(data) {
  return this.apiService.apiCall("legal/anular-costas", "POST", data);
}

}
