import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class EncargadoTrasladoService {

  constructor(
    private apiService: ApiServices
  ) { }


  setEncargado(data) {
    return this.apiService.apiCall('bodega/get-encargado', 'POST', data);
  }
}
