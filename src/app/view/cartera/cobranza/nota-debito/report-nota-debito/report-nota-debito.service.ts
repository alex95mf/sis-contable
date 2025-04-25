import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})

export class ReportNdebitoService {

  constructor(private apiSrv: ApiServices) { }

  getReportNotaCredito(data) {
    return this.apiSrv.apiCall('reportNotaDebito/get-showNotaDebito', 'POST', data);
  }

  getCliente() {
    return this.apiSrv.apiCall('reportsInvoice/get-cliente', 'POST', {});
  }

  getCatalogs(data) {
    return this.apiSrv.apiCall("proveedores/get-catalogo", "POST", data);
  }

  getSucursal(data) {
    return this.apiSrv.apiCall('seguridad/get-sucursal', 'POST', data);
  }

  getdtNotaCredito() {
    return this.apiSrv.apiCall('reportNotaCredito/get-showdtNotaCredito', 'POST', {});
  }

}
