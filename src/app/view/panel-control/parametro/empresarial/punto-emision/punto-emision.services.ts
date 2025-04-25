import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../../services/api.service';
import { HttpClient } from '@angular/common/http';
/* import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
 */
@Injectable({
  providedIn: 'root'
})
export class PuntodeEmisionService {
    constructor(private apiService: ApiServices, private http: HttpClient) { }

    showPtoEmision() {
      return this.apiService.apiCall('ptoEmision/get-puntoEmision', 'POST', {});
    }

    getEmpresa() {
      return this.apiService.apiCall('ptoEmision/get-empresa', 'POST', {});
    }

    getTipoSucursal(data) {
      return this.apiService.apiCall('ptoEmision/get-sucursal', 'POST', data);
    }

    showDocuments() {
      return this.apiService.apiCall('ptoEmision/get-document', 'POST', {});
    }

    
    getPtoEmisioExist(data) {
      return this.apiService.apiCall('ptoEmision/get-exist-pto', 'POST', data);
  }

  /* getPtoCajaDefaultExist(data) {
    return this.apiService.apiCall('ptoEmision/get-exist-caja_default', 'POST', data);
} */
   /*  getEmailSucursal(data) {
      return this.apiService.apiCall('parameters/validate-sucursal', 'POST', data);
    } */

    getSucursalPtEmision(data){
      return this.apiService.apiCall('ptoEmision/get-sucursal-ptoEmsion', 'POST', data);
  }

  getptoPtoExistente(data){
    return this.apiService.apiCall('ptoEmision-documento/get-ptoExistente', 'POST', data);
}

SavepuntoEmision(data){
  return this.apiService.apiCall('ptoEmision/save-nuevo-puntoEmsion', 'POST', data);
}

modificarpunto(data){
  return this.apiService.apiCall('ptoEmision/update-puntoEmsion', 'POST', data);
}


deletePuntoEmision(data){
  return this.apiService.apiCall('ptoEmision/delete-puntoEmsion', 'POST', data);
}
}

