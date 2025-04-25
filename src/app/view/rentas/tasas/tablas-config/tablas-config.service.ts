import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TablasConfigService {

  constructor(private apiSrv: ApiServices) { }

  getCatalogo(data) {
    return this.apiSrv.apiCall("tasas-configuracion/getCatalogo", "POST", data);
  }

  getTablasConfig(data:any = {}) {
    return this.apiSrv.apiCall("tasas-configuracion/obtenerTasasConfiguracion","POST",data);
  }
  createTablasConfig(data:any) {
    return this.apiSrv.apiCall("tasas-configuracion/guardarTasasConfiguracion","POST",data);
  }
  editTablasConfig(id, data) {
    return this.apiSrv.apiCall(`tasas-configuracion/editarTasasConfiguracion/${id}`,"POST",data);
  }
 
  getTablasConfigBy(tablasConfig) {
    return this.apiSrv.apiCall("tasas-configuracion/obtenerTablaById","POST",tablasConfig);
   
  }

  
  
  

  

}