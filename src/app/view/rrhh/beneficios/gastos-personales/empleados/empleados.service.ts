import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {

  constructor(
    private apiService: ApiServices
  ) { }


  setEmpleado(data) {
    return this.apiService.apiCall('bodega/get-encargado', 'POST', data);
  }
}
