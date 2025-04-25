import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class PreciosService {

  constructor(private apiService: ApiServices) { }

  getGrupos() {
    return this.apiService.apiCall('productos/get-grupos', 'POST', {});
  }

  getProductFilter(data) {
    return this.apiService.apiCall('precios/get-producto-filter', 'POST', data);
  }

  getCommonInformationFormule(data) {
    return this.apiService.apiCall('parameters/search-types-catalog', 'POST', data);
  }

  getTableInitPrice() {
    return this.apiService.apiCall('precios/get-init-price', 'POST', {});
  }

  saveInfoPrice(data) {
    return this.apiService.apiCall('precios/save-price', 'POST', data);
  }

  getGroupPrices() {
    return this.apiService.apiCall('precios/group-price', 'POST', {});
  }

  revertPrices(data) {
    return this.apiService.apiCall('precios/revert-price', 'POST', data);
  }
  
  getTreeProducts(data) {
    return this.apiService.apiCall('productos/get-tree-product-group-select', 'POST', data);
  }

}
