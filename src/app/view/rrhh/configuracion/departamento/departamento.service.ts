import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {

  constructor(private apiSrv: ApiServices) { }

  getDepartamento(data){
    return this.apiSrv.apiCall('rrhh/configuracion-getdeparat', 'POST',data);
  }

  setDepartamento(data){
    return this.apiSrv.apiCall('rrhh/configuracion-creardeparat', 'POST',data);
  }


  updatetDepartamento(data){
    return this.apiSrv.apiCall('rrhh/configuracion-updatedeparat', 'POST',data);
  }

  deleteDepartamento(data){
    return this.apiSrv.apiCall('rrhh/configuracion-deletedeparat', 'POST',data);
  }

  getAreas(data){
    return this.apiSrv.apiCall('rrhh/configuracion-getAreas', 'POST',data);
  }

}
