import { Injectable } from "@angular/core";
import { ApiServices } from "../../../../services/api.service";

@Injectable({
  providedIn: "root",
})
export class DistribuidorService {
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
    return this.apiService.apiCall("distribuidor/validate-email-distribuidor", "POST", data);
  }

  saveDistribuidor(data) {
    return this.apiService.apiCall("distribuidor/save-distribuidor", "POST", data);
  }

  getDistribuidores() {
    return this.apiService.apiCall("distribuidor/get-distribuidores", "POST", {});
  }

  deleteDistribuidor(data) {
    return this.apiService.apiCall("distribuidor/delete-distribuidores", "POST", data);
  }

  updateDistribuidor(data) {
    return this.apiService.apiCall("distribuidor/update-distribuidor", "POST", data);
  }

}
