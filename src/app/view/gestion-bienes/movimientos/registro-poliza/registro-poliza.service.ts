import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class RegistroPolizaService {

  constructor(private apiService: ApiServices) { }
      
    getProductosPrestamo(data){
      return this.apiService.apiCall('mantenimiento/get-productos-bienes', 'POST', data);
    }

    saveRegistroPoliza(data){
      return this.apiService.apiCall('registro-poliza/crear-poliza', 'POST', data);
    }

    getPoliza(data){
      return this.apiService.apiCall('registro-poliza/get-poliza', 'POST', data);
    }
    
    uploadAnexo(file, payload?: any) {
      return this.apiService.apiCallFile('general/upload-files', 'POST', file, payload)
    }

    listarCatalogo(data) {
      return this.apiService.apiCall('registro-poliza/get-catalogos', 'POST', data);
    }

    updatePoliza(data){
      return this.apiService.apiCall('registro-poliza/update-registropoliza', 'POST',data);
    }

    updateEstado(data){
      return this.apiService.apiCall('registro-poliza/update-estado', 'POST',data);
    }

    deleteRegistro(data){
      return this.apiService.apiCall('registro-poliza/delete-detalle', 'POST',data);
    }
}
