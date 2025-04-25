import { Injectable } from "@angular/core";
import { ApiServices } from "../../../../services/api.service";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class ConsultaSuppliersService {

  constructor(private apiService: ApiServices, private http: HttpClient) { }
  
  getProveedores() {
    return this.apiService.apiCall('reports/get-Proveedores-consulta', 'POST', {});
  }

  getCatalogs(data) {
    return this.apiService.apiCall("proveedores/get-catalogo", "POST", data);
  }

  getTreeProducts(data) {
    return this.apiService.apiCall('productos/get-tree-product-group-select', 'POST', data);
  }

}