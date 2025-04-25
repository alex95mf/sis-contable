import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TasasVariasService {

  constructor(private apiSrv: ApiServices) { }

  getCatalogo(data) {
    return this.apiSrv.apiCall("rentas/tasas/tasas-varias/getCatalogo", "POST", data);
  }

  getTasasVarias(data:any = {}) {
    return this.apiSrv.apiCall("rentas/tasas/tasas-varias/obtenerTasasVarias","POST",data);
  }
  createTasasVarias(data:any) {
    return this.apiSrv.apiCall("rentas/tasas/tasas-varias/guardarTasasVarias","POST",data);
  }
  editTasasVarias(id, data) {
    return this.apiSrv.apiCall(`rentas/tasas/tasas-varias/editarTasasVarias/${id}`,"POST",data);
  }
 
  deleteTasasVarias(id) {
    return this.apiSrv.apiCall(`rentas/tasas/tasas-varias/deleteTasasVarias/${id}`,"POST",{});
  }

  
  
  

  

}