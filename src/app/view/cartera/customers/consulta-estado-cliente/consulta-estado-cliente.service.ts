import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ConsultaEstadoClienteService {
constructor(private apiService: ApiServices, private http: HttpClient) { }

getAllConsulta(data) {
  return this.apiService.apiCall('report-estado-cuenta-cliente/get-estadoResultado', 'POST', data);
}

getCliente() {
  return this.apiService.apiCall('reportsInvoice/get-cliente', 'POST', {});
}

getUltimo(data){
  return this.apiService.apiCall('report-estado-cuenta-cliente/get-ultima-compra', 'POST', data)
}

printData(data){
  return this.apiService.apiCall('plandecuentas/save-data-print', 'POST', data);
}

existProveedors(data){
  return this.apiService.apiCall('report-estado-cuenta-cliente/get-yesOno-Proveedor', 'POST', data)
}

viewCXCcliente(){
  return this.apiService.apiCall('report-estado-cuenta-cliente/get-view-all', 'POST', {})
}

getReportComprobantesI() {
  return this.apiService.apiCall('reporte-ComprobIngreso/get-allshowComprobanteIn', 'POST', {});
}
}
