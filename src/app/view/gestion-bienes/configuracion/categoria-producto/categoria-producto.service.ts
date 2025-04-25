import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriaProductoService {

  constructor(
    private apiService: ApiServices
  ) { }

  getCatalogoBienes(data){
    return this.apiService.apiCall('gestion-bienes/grupo-producto', 'POST',data);
  }

  getConCuentas(data){
    return this.apiService.apiCall('gestion-bienes/cuentas', 'POST',data);
  }

  getCatalogoPresupuesto(data){
    return this.apiService.apiCall('gestion-bienes/catalogo-presupuesto', 'POST',data);
  }

  updateCatalogoBienes(data){
    return this.apiService.apiCall('gestion-bienes/update-grupo-producto', 'POST',data);
  }

  deleteCatalogoBienes(data){
    return this.apiService.apiCall('gestion-bienes/delete-grupo-producto', 'POST',data);
  }

  saveCatalogoBienes(data){
    return this.apiService.apiCall('gestion-bienes/save-grupo-producto', 'POST',data);
  }

  getCatalogs(data) {
    return this.apiService.apiCall("proveedores/get-catalogo", "POST", data);
  }
}
