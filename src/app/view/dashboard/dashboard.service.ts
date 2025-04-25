import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private apiService: ApiServices) { }


  public getData(data){
    return this.apiService.apiCall('dashboard/get-dashboardDat', "POST", data)
  }
}
