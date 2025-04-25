import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class MinMaxServices {

  constructor(private apiService: ApiServices) { }

  getTreeProducts(data) {
    return this.apiService.apiCall('productos/get-tree-product-group-select', 'POST', data);
  }

  getProductosMinMax() {
    return this.apiService.apiCall('productos/get-product-min-max', 'POST', {});
  }

  getGrupos() {
    return this.apiService.apiCall('productos/get-grupos', 'POST', {});
  }

  saveInfoPriceMinMax(data) {
    return this.apiService.apiCall('productos/save-price-min-max', 'POST', data);
  }

}
