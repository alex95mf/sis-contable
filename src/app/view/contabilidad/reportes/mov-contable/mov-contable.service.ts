import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MovContableService {
constructor(private apiService: ApiServices, private http: HttpClient) { }

getAccountsByDetails(data) {
  return this.apiService.apiCall('diario/accounts/get-details', 'POST', data);
}
   getDocumentData() {
    return this.apiService.apiCall('report-movimientoContable/all-documento', 'POST', {});
  }

 getmovCab(datas) {
    return this.apiService.apiCall('report-movimientoContable/all-con-movCab', 'POST', datas);
  }
  
  getMovimientoContable(data) {
    return this.apiService.apiCall('report-movimientoContable/mov-contable', 'POST', data);
  }

  getanterior(data){
    return this.apiService.apiCall('report-movimientoContable/get-saldo-anterior', 'POST', data);
  }

  getDetailsMovs(){
    return this.apiService.apiCall('report-movimientoContable/get-mov', 'POST', {});
  }

  getMovientoCabData(){
    return this.apiService.apiCall('report-movimientoContable/get-mov-cabData', 'POST', {});
  }

  searchMovientoCabezera(data){
    return this.apiService.apiCall('report-movimientoContable/get-mov-cabezeraData', 'POST', data);
  }
  
  printData(data){
    return this.apiService.apiCall('plandecuentas/save-data-print', 'POST', data);
  }
  
  getSucursales() {
    return this.apiService.apiCall('administracion/get-sucursal', 'POST', {});
  }
}