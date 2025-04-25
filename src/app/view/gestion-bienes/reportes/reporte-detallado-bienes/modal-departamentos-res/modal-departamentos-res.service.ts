import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ModalDepartamentosResService {

  constructor(
    private apiService: ApiServices
  ) { }


  cargarDepartamentos(data) {
    return this.apiService.apiCall('seguridad/get-departamentos', 'POST', data);
  }

}
