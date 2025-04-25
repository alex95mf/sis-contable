import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class FormHigieneService {

  constructor(private apiSrv: ApiServices) { }

  getInspecciones(data){
    return this.apiSrv.apiCall('inspeccion/mostrar-resultados-cab-filtro','POST',data);
  }

  getInspeccionBy(id){
    return this.apiSrv.apiCall('inspeccion/get-by-id/'+id,'POST',{});
  }

  saveResultado(data){
    return this.apiSrv.apiCall('inspeccion/guardar','POST',data);
  }

  habilitar(id){
    return this.apiSrv.apiCall('inspeccion/habilitar/'+id,'POST',{});
  }

  deleteAnexo(data)
  {
    return this.apiSrv.apiCall('general/delete-files', 'POST', data)
  }

  downloadAnexo(data)
  {
    return this.apiSrv.getTipoBlob('/general/download-files', data)
  }

  fileService(file, payload?: any) {
    return this.apiSrv.apiCallFile('general/upload-files', 'POST', file, payload);
  }

  getAnexos(data: any = {}) {
    return this.apiSrv.apiCall('general/search-files', 'POST', data)
  }

}
