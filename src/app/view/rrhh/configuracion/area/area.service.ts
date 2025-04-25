import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  constructor(private apiSrv: ApiServices) { }

  getAreas(data){
    return this.apiSrv.apiCall('rrhh/configuracion-getAreas', 'POST',data);
  }

  createArea(data:any) {
    return this.apiSrv.apiCall("rrhh/configuracion-crearArea","POST",data);
  }

  editArea(data) {
    return this.apiSrv.apiCall("rrhh/configuracion-editArea","POST",data);
  }

  deleteArea(data) {
    return this.apiSrv.apiCall("rrhh/configuracion-deleteArea","POST",data);
  }

  eliminarArea(id){
    return this.apiSrv.apiCall("rrhh/configuracion-eliminarArea/" +id,"POST",{});
  }

  public getPrograma(data){
    return this.apiSrv.apiCall("rrhh/configuracion/programa", "POST", data);
  }
}
