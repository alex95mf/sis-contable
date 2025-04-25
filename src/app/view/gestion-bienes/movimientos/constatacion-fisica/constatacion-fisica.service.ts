import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ConstatacionFisicaService {

  constructor(private api: ApiServices) { }
  
 
  getIngresosPorPeriodo(data: any) {
    return this.api.apiCall('presupuesto/get-constatacion','POST', data);
  }
  
  delIngresosPorPeriodo(data: any) {
    return this.api.apiCall('presupuesto/delete-asignacion-ingresos','POST', data);
  }

  listarCatalogo(data) {
    return this.api.apiCall('presupuesto/get-catalogo', 'POST', data);
  }

  listarProducto(data) {
    return this.api.apiCall('presupuesto/get-productos', 'POST', data);
  }

  guardarConstatacion(data: any) {
    return this.api.apiCall('presupuesto/guardar-constatacion','POST', data);
  }


}
