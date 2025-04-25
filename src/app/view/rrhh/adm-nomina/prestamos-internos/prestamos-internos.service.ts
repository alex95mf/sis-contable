import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class PrestamosInternosService {

  constructor(private apiService: ApiServices) { }

  
  getPreVisualizacionCertificado(dataOption? :object){

    let id_certificado = dataOption['id_certificado'];
    let id_empleado = dataOption['id_empleado'];
    let id_empresa = dataOption['id_empresa'];
    return this.apiService.apiCall(`certificate-preview?id_empleado=${id_empleado}&id_certificado=${id_certificado}&id_empresa=${id_empresa}`, "GETV1", {});
  }

  geDownloadCertificado(dataOption? :object){

    let id_certificado = dataOption['id_certificado'];
    let id_empleado = dataOption['id_empleado'];
    let id_empresa = dataOption['id_empresa'];
    return this.apiService.apiCall(`certificate-download?id_empleado=${id_empleado}&id_certificado=${id_certificado}&id_empresa=${id_empresa}`, "GETFILEV1", {});
  }

}
