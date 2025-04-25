import { Injectable } from "@angular/core";
import { ApiServices } from "../../../../services/api.service";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CustomersRegisterService {
  
  constructor(private apiService: ApiServices, private http: HttpClient) { }

  getCatalogs(data) {
    return this.apiService.apiCall("proveedores/get-catalogo", "POST", data);
  }

  getAsesores(data) {
    return this.apiService.apiCall("users/get-users-profile", "POST", data);
  }

  getAgentRetencion(data) {
    return this.apiService.apiCall("available/agent-retencion", "POST", data);
  }

  saveClient(data) {
    return this.apiService.apiCall("clientes/save-client", "POST", data);
  }

  updateClient(data) {
    return this.apiService.apiCall("clientes/update-client", "POST", data);
  }

  deleteClient(data) {
    return this.apiService.apiCall("clientes/delete-client", "POST", data);
  }

  filterProvinceCity(data) {
    return this.apiService.apiCall("proveedores/filter-province-city", "POST", data);
  }

  validateDoc(data) {
    return this.apiService.apiCall("clientes/validate-cedula", "POST", data);
  }

  validateEmailClient(data) {
    return this.apiService.apiCall("proveedores/validate-email-client", "POST", data);
  }

  validateEmailClientes(data) {
    return this.apiService.apiCall("clientes/validate-email-client", "POST", data);
  }

  getCliente() {
    return this.apiService.apiCall('reportsInvoice/get-cliente', 'POST', {});
  }

  getCiudades(data) {
    return this.apiService.apiCall('bodega/get-catalogo', 'POST', data);
  }

  descargar(data) {
    return this.apiService.getTipoBlob("/general/download-files", data);
  }

  getTreeProducts(data) {
    return this.apiService.apiCall('productos/get-tree-product', 'POST', data);
  }

}
