import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CargoService {

  constructor(
    private apiSrv: ApiServices
  ) { }

  public getCargo(data){
    return this.apiSrv.apiCall("rrhh/cargos", "POST", data)
  }

  public setCargo(data){
    return this.apiSrv.apiCall("rrhh/setcargos", "POST", data)
  }


  public updateCargo(data){
    return this.apiSrv.apiCall("rrhh/updatecargos", "POST", data)
  }

  public getDepartamento(data){
    return this.apiSrv.apiCall("rrhh/departamento-cargos", "POST", data)
  }

  getPostitionsByDepartment( id_departamento? : number){
    return this.apiSrv.apiCall(`positions?id_departamento=${id_departamento}`, 'GET', {});
  }
}
