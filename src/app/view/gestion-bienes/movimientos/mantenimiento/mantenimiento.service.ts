import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class MantenimientoService {

  constructor(private apiService: ApiServices) { }


  getProductosPrestamo(data){
    return this.apiService.apiCall('mantenimiento/get-productos-bienes', 'POST', data);
 }

 saveMantenimiento(data){
  return this.apiService.apiCall('mantenimiento/crear-mantenimiento', 'POST', data);
}

getMantenimiento(data){
  return this.apiService.apiCall('mantenimiento/get-mantenimiento', 'POST', data);
}
uploadAnexo(file, payload?: any) {
  return this.apiService.apiCallFile('general/upload-files', 'POST', file, payload)
}

updateMantenimiento(data){
  return this.apiService.apiCall('mantenimiento/update-mantenimiento', 'POST',data);
}

updateEstado(data){
  return this.apiService.apiCall('mantenimiento/update-estado', 'POST',data);
}

deleteDetalle(data){
  return this.apiService.apiCall('mantenimiento/delete-matenimiento', 'POST',data);
}

}
