import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ConsultaDirectorioService {

  constructor(
    private apiServices: ApiServices,
  ) { }

  getTipoDocumentos(data) {
    return this.apiServices.apiCall('digitalizacion/getTipoDocumento', 'POST', data);
  }
  getOrdenCampos(data) {
    return this.apiServices.apiCall('digitalizacion/getOrden', 'POST', data);
  }

  getDirectorio(data){
    return this.apiServices.apiCall("digitalizacion/get-directorio", "POST", data);
  }

  getReadFiles(data){
    return this.apiServices.apiCall("digitalizacion/readFiles", "POST", data);
  }


  getSearchFilesByFile(data){
    return this.apiServices.apiCall("digitalizacion/SearchFilesByFile", "POST", data);
  }
  
  
}