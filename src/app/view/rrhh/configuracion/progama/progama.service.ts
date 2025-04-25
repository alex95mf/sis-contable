import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProgamaService {

  constructor(private apiSrv: ApiServices) { }


  public getPrograma(data){
    return this.apiSrv.apiCall("rrhh/configuracion/programa", "POST", data);
  }

  public setPrograma(data){
    return this.apiSrv.apiCall("rrhh/configuracion/set-programa", "POST", data);
  }

  public updateProgama(data){
    return this.apiSrv.apiCall("rrhh/configuracion/update-programa", "POST", data);
  }

  getCatalogs(data) {
    return this.apiSrv.apiCall("proveedores/get-catalogo", "POST", data);
  }
}
