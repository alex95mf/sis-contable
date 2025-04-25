import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConsultaImportacionService {
constructor(private apiService: ApiServices, private http: HttpClient) { }
  getCurrencys() {
    return this.apiService.apiCall('bancos/get-currencys', 'POST', {});
  }

  getProveedores() {
    return this.apiService.apiCall('proveedores/get-proveedor', 'POST', {});
  }
  
  getNumPedidos() {
    return this.apiService.apiCall('consulta-importacionPedidos/Filter-pedidos', 'POST', {});
  }

  getImportacionPedido(data) {
    return this.apiService.apiCall('consulta-importacionPedidos/all-pedidos', 'POST', data);
  }
  
  getPedidosDt() {
    return this.apiService.apiCall('consulta-importacionPedidos/all-pedido-dt', 'POST', {});
  }
 

}
