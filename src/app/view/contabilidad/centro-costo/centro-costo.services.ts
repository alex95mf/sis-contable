import { Injectable } from '@angular/core';
import { ApiServices } from '../../../services/api.service';

@Injectable({
    providedIn: 'root'
})
export class CentroCostoService {
    constructor(private apiService: ApiServices) { }

    presentaTablaGrupo() {
        return this.apiService.apiCall('parameters/get-groups', 'POST', {});
      }

      getCatalogs(data) {
        return this.apiService.apiCall("proveedores/get-catalogo", "POST", data);
      }

      filterProvinceCity(data) {
        return this.apiService.apiCall("proveedores/filter-province-city", "POST", data);
      }

    saveCentroCosto(data) {
      return this.apiService.apiCall("centroCosto/save-centroCosto", "POST", data);
    }

    getMaxID() {
      return this.apiService.apiCall("centroCosto/show-maxcentroCosto", "POST", {});
    }

    showCentroCosto() {
      return this.apiService.apiCall("centroCosto/show-centroCosto", "POST", {});
    }

    showAnexos(data){
      return this.apiService.apiCall('centroCosto/search-anexos', 'POST', data);
    }

    editCentroCosto(data) {
      return this.apiService.apiCall("centroCosto/edit-centroCosto", "POST", data);
    }
  
    deleteCcosto(data) {
      return this.apiService.apiCall("centroCosto/delete-centroCosto", "POST", data);
    }

}