import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})

export class ConsultacustomersService {

  constructor(private apiSrv: ApiServices) { }

  getReportCliente(data) {
    return this.apiSrv.apiCall('consultaCliente/get-showClientes', 'POST', data);
  }

  getClients() {
    return this.apiSrv.apiCall('reportsInvoice/get-cliente', 'POST', {});
  }

  getVendedor() {
    return this.apiSrv.apiCall('reportsInvoice/get-vendedor', 'POST', {});
  }

  
  getGroupPrices() {
    return this.apiSrv.apiCall('precios/group-price', 'POST', {});
  }

  getCatalogs(data) {
    return this.apiSrv.apiCall("proveedores/get-catalogo", "POST", data);
  }

  filterProvinceCity(data) {
    return this.apiSrv.apiCall("proveedores/filter-province-city", "POST", data);
  }

  getcontactos() {
    return this.apiSrv.apiCall("consultaCliente/get-showContactos", "POST", {});
  }
}
