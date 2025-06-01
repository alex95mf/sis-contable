import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class OtrasConfiguracionesService {
  updateConfiguracion$ = new EventEmitter<void>();

  constructor(
    private apiServices: ApiServices,
  ) { }

  getPeriodos() {
    return this.apiServices.apiCall('planificacion/get-periodos', 'POST', {}) as any
  }

  getCatalogos(data: any = {}) {
    return this.apiServices.apiCall('proveedores/get-catalogo', 'POST', data) as any
  }

  getConfiguraciones(data: any = {}) {
    return this.apiServices.apiCall('configuraciones/get-configuraciones', 'POST', data) as any;
  }

  setConfiguracion(data: any = {}) {
    return this.apiServices.apiCall('configuraciones/set-configuracion', 'POST', data) as any
  }

  updateConfiguracion(id: number, data: any = {}) {
    return this.apiServices.apiCall(`configuraciones/update-configuracion/${id}`, 'POST', data) as any
  }
}
