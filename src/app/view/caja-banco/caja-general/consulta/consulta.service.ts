import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  constructor(private apiService: ApiServices, private http: HttpClient){ }

  getValorConsultarInicial(){
    return this.apiService.apiCall('reports-bank_cajas/get-consultar-inicial', 'POST',{});
  }

  getValorConsultar(data){
    return this.apiService.apiCall('reports-bank_cajas/get-consultar', 'POST', data);
  }

  getCatalogs(data) {
    return this.apiService.apiCall("proveedores/get-catalogo", "POST", data);
  }

  getCaja() {
    return this.apiService.apiCall("reports-bank_cajas/cajas", "POST", {});
  }

  bankCaja() {
    return this.apiService.apiCall("reports-bank_cajas/bank_cajaCab", "POST", {});
  }

  getUsuario() {
    return this.apiService.apiCall('buy/get-usuario', 'POST', {});
  }

  getSucursales() {
    return this.apiService.apiCall('administracion/get-sucursal', 'POST', {});
  }

}
