import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class MovimientosContablesService {

  constructor(private apiService: ApiServices) { }

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
}
