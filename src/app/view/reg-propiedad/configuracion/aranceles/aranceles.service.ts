import { Injectable } from "@angular/core";
import { ApiServices } from "../../../../services/api.service";

@Injectable({
  providedIn: "root",
})
export class ArancelesService {
  constructor(private apiService: ApiServices) {}

  /*getAranceles(params) {
    return this.apiService.apiCall("aranceles/get-aranceles", "POST", {params: params});
  }*/

  getAranceles(data) {
    return this.apiService.apiCall("aranceles/get-aranceles", "POST", data);
  }

  getArancel(id) {
    return this.apiService.apiCall("aranceles/get-arancel/" + id, "POST", {});
  }

  deteleArancel(id) {
    return this.apiService.apiCall("aranceles/delete-arancel/" + id, "POST", {});
  }

  restoreArancel(id) {
    return this.apiService.apiCall("aranceles/restore-arancel/" + id, "POST", {});
  }

  createArancel(data) {
    return this.apiService.apiCall("aranceles/set-arancel", "POST", data);
  }

  editArancel(id, data) {
    return this.apiService.apiCall("aranceles/arancel/" + id, "POST", data);
  }

  getCatalogs(data) {
    return this.apiService.apiCall("proveedores/get-catalogo", "POST", data);
  }

  /*getGrupos() {
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
  }*/

}
