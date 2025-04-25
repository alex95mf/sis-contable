import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class SalesManagerService {
  constructor(private apiService: ApiServices) { }

  getDashboardParameters(data) {
    return this.apiService.apiCall('dashboard/get-dashboard-data', 'POST', data);
  }
}
