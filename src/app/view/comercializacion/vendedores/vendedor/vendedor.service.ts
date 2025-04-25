import { Injectable } from "@angular/core";
import { ApiServices } from "../../../../services/api.service";

@Injectable({
  providedIn: "root",
})
export class VendedorService {
  constructor(private apiService: ApiServices) {}

  getCatalogs(data) {
    return this.apiService.apiCall("proveedores/get-catalogo", "POST", data);
  }

  getGrupos() {
    return this.apiService.apiCall("productos/get-grupos", "POST", {});
  }

  getSucursales() {
    return this.apiService.apiCall("administracion/get-sucursal", "POST", {});
  }

  validateEmailContacto(data) {
    return this.apiService.apiCall("vendedor/validate-email-vendedor", "POST", data);
  }

  saveVendedor(data) {
    return this.apiService.apiCall("vendedor/save-vendedor", "POST", data);
  }

  getVendedores() {
    return this.apiService.apiCall("vendedor/get-vendedores", "POST", {});
  }

  deleteVendedor(data) {
    return this.apiService.apiCall("vendedor/delete-vendedores", "POST", data);
  }

  updateVendedor(data) {
    return this.apiService.apiCall("vendedor/update-vendedor", "POST", data);
  }

  searchProduct(data) {
    return this.apiService.apiCall('productos/search-product-table', 'POST', data);
  }

}
