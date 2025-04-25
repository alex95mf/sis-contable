import { Injectable } from '@angular/core';

import { ApiServices } from 'src/app/services/api.service';
@Injectable({
  providedIn: 'root'
})
export class ReglaPresupuestariaService {

  constructor(private api:ApiServices) { }

  saveSueldo(data){
    return this.api.apiCall('reglaPresupuestaria/save', 'POST', data);
  }

 
  getReglas(data: any) {
    return this.api.apiCall('reglaPresupuestaria/getReglasPresupuestarias','POST', data);
  }


  updateReglas(data){
    return this.api.apiCall('reglaPresupuestaria/update', 'POST', data);
  }
}
