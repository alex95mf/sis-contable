import { Injectable } from '@angular/core';
import { ApiServices } from '../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(private apiService: ApiServices) { }

  getTypesProductProve() {
    return this.apiService.apiCall('proveeduria/get-types-productos', 'POST', {});
  }

  getProductProve() {
    return this.apiService.apiCall('proveeduria/get-productos', 'POST', {});
  }

  getUDM() {
    return this.apiService.apiCall('productos/UDM', 'POST', {});
  }

  validateSecuencial(data) {
    return this.apiService.apiCall('proveeduria/validation-code', 'POST', data);
  }

  saveProduct(data) {
    return this.apiService.apiCall('proveeduria/save-product', 'POST', data);
  }

  updateProduct(data) {
    return this.apiService.apiCall('proveeduria/updated-product', 'POST', data);
  }

  deleteProduct(data) {
    return this.apiService.apiCall('proveeduria/delete-product', 'POST', data);
  }

}
