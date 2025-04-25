import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../../services/api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class cuentaFisicaService {
  constructor(private apiService: ApiServices, private http: HttpClient) { }


  tablaCuenta() {
    return this.apiService.apiCall('administracion/set-tabla-cuenta', 'POST', {});
  }
 
}
