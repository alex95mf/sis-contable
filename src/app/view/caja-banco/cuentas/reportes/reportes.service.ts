
import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private apiSrv: ApiServices) { }

  showserchReports(){
    return this.apiSrv.apiCall('bank/reports-show', 'POST', {});
  }


  getCuentas(){
    return this.apiSrv.apiCall('bank/reports-show-cuenta', 'POST', {});
  }

  getBankCheque(){
    return this.apiSrv.apiCall('bank/reports-show-beneficiario', 'POST', {});
  }
  
  showserchReportstwo(data){
    return this.apiSrv.apiCall('bank/reports-show-two', 'POST', data);
  }


  getCabezeraComp(){
    return this.apiSrv.apiCall('bank/reports-show-comprobanteCb', 'POST', {});
  }

  saveEditFecha(data){
    return this.apiSrv.apiCall('bank/reports-editFecha', 'POST', data);
  }
}