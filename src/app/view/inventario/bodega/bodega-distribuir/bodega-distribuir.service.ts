import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';


@Injectable({
    providedIn: 'root'
})
export class BodegaDistribuirService {
    
    constructor(private apiService: ApiServices) { }
    
    getProducts() {
        return this.apiService.apiCall('solicitud/search-producto', 'POST', {});
      }

      getBodegas() {
        return this.apiService.apiCall('bodega/get-bodegaGeneral', 'POST', {});
      }

      getTipoAlmacenamiento(data) {
        return this.apiService.apiCall('bodega/distribution-type', 'POST', data);
      }
      
      saveDistribucion(data) {
        return this.apiService.apiCall('bodega/por-bodega', 'POST', data);
      }

      presentaTablaDistribuir() {
        return this.apiService.apiCall("bodega/show-table-distribuir", "POST", {});
      }

      getDataResultado(data) {
        return this.apiService.apiCall('bodega/data-resultado', 'POST', data);
      }
}