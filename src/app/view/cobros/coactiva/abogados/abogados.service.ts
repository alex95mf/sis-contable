import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AbogadosService {

  constructor(private apiSrv: ApiServices) { }

  getAbogados(data:any = {}) {
    return this.apiSrv.apiCall("abogado/obtener-abogado","POST",data);
  }


  editAbogado(id, data){
    return this.apiSrv.apiCall(`abogado/update-abogado/${id}`,"POST",data);
  }


}
