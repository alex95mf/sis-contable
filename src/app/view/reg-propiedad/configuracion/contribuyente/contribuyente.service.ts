import { Injectable } from "@angular/core";
import { ApiServices } from "../../../../services/api.service";

@Injectable({
  providedIn: "root",
})
export class ContribuyenteService {
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
    return this.apiService.apiCall("contribuyente/validate-email-contribuyente", "POST", data);
  }

  saveContribuyente(data) {
    return this.apiService.apiCall("contribuyente/save-contribuyente", "POST", data);
  }

  getContribuyentes() {
    return this.apiService.apiCall("contribuyente/get-contribuyentes", "POST", {});
  }

  deleteContribuyente(data) {
    return this.apiService.apiCall("contribuyente/delete-contribuyentes", "POST", data);
  }

  updateContribuyente(data) {
    return this.apiService.apiCall("contribuyente/update-contribuyente", "POST", data);
  }

}
