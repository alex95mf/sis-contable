import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ConstatacionFisicaBCAService {

  constructor(private api: ApiServices) { }
  
 
  getIngresosPorPeriodo(data: any) {
    return this.api.apiCall('presupuesto/get-constatacionBCA','POST', data);
  }
  
  delIngresosPorPeriodo(data: any) {
    return this.api.apiCall('presupuesto/delete-asignacion-ingresosBCA','POST', data);
  }

  listarCatalogo(data) {
    return this.api.apiCall('presupuesto/get-catalogoBCA', 'POST', data);
  }

  listarProducto(data) {
    return this.api.apiCall('presupuesto/get-productosBCA', 'POST', data);
  }

  guardarConstatacion(data: any) {
    return this.api.apiCall('presupuesto/guardar-constatacionBCA','POST', data);
  }

  listarDepartamentos(data) {
    return this.api.apiCall('presupuesto/get-departamentos', 'POST', data);
  }

  listarBienesPorDepartamento(data: any) {
    return this.api.apiCall('presupuesto/get-bienesDepartamento', 'POST', data);
  }

  listarDescripcionProducto(data: any) {
    return this.api.apiCall('presupuesto/get-idProducto', 'POST', data);
  }

  listarIdProducto(data: any) {
    return this.api.apiCall('presupuesto/get-Producto', 'POST', data);
  }


}