import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ParametroadService {
  constructor(private apiService: ApiServices, private http: HttpClient) { }

  presentaTablaParametros() {
    return this.apiService.apiCall("administracion/set-tabla-parameters", "POST", {});
  }

  tablaCuenta(data) {
    return this.apiService.apiCall('administracion/set-tabla-cuenta', 'POST', data);
  }
 
  Saveparameters(data) {
    return this.apiService.apiCall('administracion/set-save', 'POST', data);
  }

  modParameters(data) {
    return this.apiService.apiCall('administracion/update-parameters', 'POST', data);
  }

  deleteParametersad(data) {
    return this.apiService.apiCall('administracion/delete-parameters', 'POST', data);
  }

}

