import { Injectable } from "@angular/core";
import { ApiServices } from "../../../../services/api.service";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class SuppliersService {

  constructor(private apiService: ApiServices, private http: HttpClient) { }

  presentarDocument(params) {
    return this.apiService.apiCall("proveedores/documento/get-documento-tabla", "POST", params);
  }

  getCatalogs(data) {
    return this.apiService.apiCall("proveedores/get-catalogo", "POST", data);
  }

  getAgentRetencion(data) {
    return this.apiService.apiCall("available/agent-retencion", "POST", data);
  }

  saveProveedores(data) {
    return this.apiService.apiCall("proveedores/save-proveedores", "POST", data);
  }

  updateProveedores(data) {
    return this.apiService.apiCall("proveedores/update-proveedor", "POST", data);
  }

  deleteProveedor(data) {
    return this.apiService.apiCall("proveedores/delete-proveedor", "POST", data);
  }

  filterProvinceCity(data) {
    return this.apiService.apiCall("proveedores/filter-province-city", "POST", data);
  }

  validateDoc(data) {
    return this.apiService.apiCall("proveedores/validate-cedula", "POST", data);
  }

  validateEmailPrividers(data) {
    return this.apiService.apiCall("proveedores/validate-email", "POST", data);
  }
 
  validateEmailProveedor(data) {
    return this.apiService.apiCall("proveedores/validate-email-proveedor", "POST", data);
  }

  descargar(data) {
    return this.apiService.getTipoBlob("/general/download-files", data);
  }

  getTreeProducts(data) {
    return this.apiService.apiCall('productos/get-tree-product-group-select', 'POST', data);
  }

}