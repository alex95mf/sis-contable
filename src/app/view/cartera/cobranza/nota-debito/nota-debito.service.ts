import { Injectable } from "@angular/core";
import { ApiServices } from "../../../../services/api.service";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class NotaDebitoService {

  constructor(private apiService: ApiServices, private http: HttpClient) { }

  getClients() {
    return this.apiService.apiCall('reportsInvoice/get-cliente', 'POST', {});
  }

  getSucursales() {
    return this.apiService.apiCall('administracion/get-sucursal', 'POST', {});
  }

  getAccountsByDetails(data) {
    return this.apiService.apiCall('diario/accounts/get-details', 'POST', data);
  }

  getCommonInformationFormule(data) {
    return this.apiService.apiCall('parameters/search-types-catalog', 'POST', data);
  }

  getCatalogs(data) {
    return this.apiService.apiCall("proveedores/get-catalogo", "POST", data);
  }

  getNumAutNotaDebito(data) {
    return this.apiService.apiCall("notascreditodebito/get-num-aut", "POST", data);
  }

  saveNotaDebito(data) {
    return this.apiService.apiCall("notascreditodebito/save-nc-nd-venta", "POST", data);
  }

  getNotasDebito(data) {
    return this.apiService.apiCall("notascreditodebito/get-notas-credito-debito-all", "POST", data);
  }

  deleteNotaDebito(data) {
    return this.apiService.apiCall("notascreditodebito/delete-notas-credito-debito", "POST", data);
  }

  updatedNotaDebito(data) {
    return this.apiService.apiCall("notascreditodebito/updated-notas-credito-debito", "POST", data);
  }

  /* updatedPermisions(data) {
    return this.apiService.apiCall("notascreditodebito/updated-npermisions-ndv", "POST", data);
  } */

}
