
import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AperturaService {

  constructor(private apiService: ApiServices) { }

  getCajas() {
    return this.apiService.apiCall('caja/get-cajas', 'POST', {});
  }

  getDenominations() {
    return this.apiService.apiCall('caja/get-denominaciones', 'POST', {});
  }

  openBox(data) {
    return this.apiService.apiCall('caja/open-caja', 'POST', data);
  }

}
