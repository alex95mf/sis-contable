import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../../services/api.service';
 
@Injectable({
  providedIn: 'root'
})

export class ReportesTransService {

    constructor(private apiSrv: ApiServices) {}
    getAccountsByDetails(data) {
        return this.apiSrv.apiCall('diario/accounts/get-details-banks', 'POST', data);
    }

    getTransaferenciaData() {
        return this.apiSrv.apiCall('reporte-Transferencia/getdistinct-Transferencia', 'POST', {});
    }

    getAllTrnsaferencia(data) {
        return this.apiSrv.apiCall('reporte-Transferencia/getSearch-Transferencia', 'POST', data);
    }

    getTransfData() {
        return this.apiSrv.apiCall('reporte-Transferencia/getAll-Transferencia', 'POST', {});
    }
}