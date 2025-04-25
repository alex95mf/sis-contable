import { Injectable } from "@angular/core";
import { ApiServices } from "../../../../services/api.service";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class  AsignacionClienteService {

  constructor(private apiSrv: ApiServices, private http: HttpClient) { }

  getVendedor() {
    return this.apiSrv.apiCall('reportsInvoice/get-vendedor', 'POST', {});
  }

  getClientes(data) {
    return this.apiSrv.apiCall('reportsInvoice/get-cliente', 'POST', data);
  }
  
  geSeachAsignacion(data) {
    return this.apiSrv.apiCall('reportsAsignacion/search-reports-clienteVendedor', 'POST', data);
  }

  saveAsigancion(data) {
    return this.apiSrv.apiCall('reportsAsignacion/save-reports', 'POST', data);
  }
}
