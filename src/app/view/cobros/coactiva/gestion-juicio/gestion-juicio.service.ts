import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class GestionJuicioService {

  constructor(private apiService: ApiServices) { }

  getGestiones(data: any = {}) {
    return this.apiService.apiCall('legal/get-gestiones', 'POST', data)
  }

  setExpediente(data: any = {}) {
    return this.apiService.apiCall('cobros/generar-expedientes', 'POST', data)
  }

  getExpedientes(data: any = {}) {
    return this.apiService.apiCall('legal/get-expedientes', 'POST', data)
  }

  setJuicios(data: any = {}) {
    return this.apiService.apiCall('legal/set-juicios', 'POST', data)
  }
}
