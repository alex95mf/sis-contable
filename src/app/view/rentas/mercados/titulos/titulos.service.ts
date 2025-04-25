import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TitulosService {

  constructor( private apiServices: ApiServices ) { }

  getCatalogos(data: any = {}) {
    return this.apiServices.apiCall('proveedores/get-catalogo', 'POST', data)
  }

  getContratoDetalles(data: any = {}) {
    return this.apiServices.apiCall('mercados/get-detalles-filter', 'POST', data)
  }

  processCuota(data: any = {}) {
    return this.apiServices.apiCall('mercados/update-cuotas', 'POST', data)
  }
}
