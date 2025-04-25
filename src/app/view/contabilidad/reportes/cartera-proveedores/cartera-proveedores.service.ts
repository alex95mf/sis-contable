import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CarteraProveedoresService {

  constructor(private apiService: ApiServices) { }
  
  getAvailableCxP(data) {
    return this.apiService.apiCall('cxp/get-available', 'POST', data);
  }


  // ObtenerCarteraProveedor(fecha_desde :string, fecha_hasta :string, id_proveedor:number ) {
  //   return this.apiService.apiCall(`cxp/consulta/${fecha_desde}/${fecha_hasta}/${id_proveedor}`, 'GETV1',  {});
  // }

  ObtenerCarteraProveedor(fecha_desde :string, fecha_hasta :string, id_proveedor:number ) {
    return this.apiService.apiCall(`cxp/consulta/${fecha_desde}/${fecha_hasta}/${id_proveedor}`, 'GET',  {});
  }
  
}
