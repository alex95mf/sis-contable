import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ParametrosService {

  constructor(private apiService: ApiServices) { }

  obtenerActFijParametros(data) {
    return this.apiService.apiCall("activos/obtenerActFijParametros", "POST", {});
  }

  obtenerCtasContablesGrupo() {
    return this.apiService.apiCall("activos/obtenerCtasContablesGrupo", "POST", {});
  }

  actualizarDepreciaciones(data) {
    return this.apiService.apiCall("activos/actualizarDepreciaciones", "POST", data);
  }

  crearDepreciaciones(data) {
    return this.apiService.apiCall("activos/crearDepreciaciones", "POST", data);
  }
}
