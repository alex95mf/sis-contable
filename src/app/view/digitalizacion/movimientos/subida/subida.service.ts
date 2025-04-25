import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class SubidaService {

  constructor(
    private apiServices: ApiServices,
  ) { }

  getTipoDocumentos(data) {
    return this.apiServices.apiCall('digitalizacion/getTipoDocumento', 'POST', data);
  }

  saveDocumentos(data) {
    return this.apiServices.apiCall('digitalizacion/Documento/save', 'POST', data);
  }

  getOrdenCampos(data) {
    return this.apiServices.apiCall('digitalizacion/getOrden', 'POST', data);
  }

  uploadAnexo(file, payload?: any) {
    return this.apiServices.apiCallFile2('general/upload-filesC', 'POST', file, payload) 
  }

  getBodegas() {
    return this.apiServices.apiCall('get-bodegaGeneral-dig', 'POST', {});
  }

  getInformationDig(data) {
    return this.apiServices.apiCall('bodega/get-bodegas-dig', 'POST', data);
  }

  getInformationCellarGeneral() {
    return this.apiServices.apiCall('bodega/get-bodegaGeneral', 'POST', {});
  }

  getEstrutureDig(data) {
    return this.apiServices.apiCall('bodega/get-estructure-dig', 'POST', data);
  }

  getCatalogo(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiServices.apiCall("proveedores/get-catalogo", "POST", data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

}
