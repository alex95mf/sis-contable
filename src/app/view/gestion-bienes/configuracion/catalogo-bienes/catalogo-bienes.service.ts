import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CatalogoBienesService {

  constructor(
    private apiService: ApiServices
  ) { }


  getCatalogoBienes(data){
    return this.apiService.apiCall('gestion-bienes/catalogo-bienes', 'POST',data);
  }

  updateCatalogoBienes(data){
    return this.apiService.apiCall('gestion-bienes/update-catalogo-bienes', 'POST',data);
  }

  deleteCatalogoBienes(data){
    return this.apiService.apiCall('gestion-bienes/delete-catalogo-bienes', 'POST',data);
  }

  saveCatalogoBienes(data){
    return this.apiService.apiCall('gestion-bienes/save-catalogo-bienes', 'POST',data);
  }
}
