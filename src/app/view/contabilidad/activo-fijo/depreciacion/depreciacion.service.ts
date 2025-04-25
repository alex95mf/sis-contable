import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class DepreciacionService {

  constructor(private apiService: ApiServices) { }

  getBackYears(data) {
    return this.apiService.apiCall('general/get-back-years', 'POST', data);
  }

  getAF(data) {
    return this.apiService.apiCall('activos/get-acquisition', 'POST', data);
  }

  setAFDepreciate(data) {
    return this.apiService.apiCall('activos/set-af-depreciate', 'POST', data);
  }
}
