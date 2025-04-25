import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ContratoService {

  constructor(private api: ApiServices) { }

  contribuyente$ = new EventEmitter<any>();
  showAnexos$ = new EventEmitter<any>();

  getContribuyentes(data: any = {}) {
    return this.api.apiCall('contribuyente/get-contribuyentes', 'POST', data)
  }

  getMercados(data) {
    return this.api.apiCall("proveedores/get-catalogo", "POST", data)
  }

  getPuestos(data) {
    return this.api.apiCall('mercado/get-puestos-mercado', 'POST', data)
  }

  setContrato(data) {
    return this.api.apiCall('mercados/set-contrato', 'POST', data)
  }

  updateContrato(data: any = {}, contrato: number) {
    return this.api.apiCall(`mercados/update-contrato/${contrato}`, 'POST', data);
  }

  getContratosList(data?) {
    return this.api.apiCall('mercados/get-contratos-completo', 'POST', data ? data : {})
  }

  getContratoCompleto(id) {
    return this.api.apiCall(`mercados/get-contrato-completo/${id}`, 'POST', {})
  }

  fileService(file, payload?: any) {
    return this.api.apiCallFile('general/upload-files', 'POST', file, payload);
  }

  enviarCorreo(data) {
    return this.api.apiCall(`mercados/send-mail/${data.contrato}`, 'POST', data);
  }

  deleteAnexo(data)
  {
    return this.api.apiCall('mercados/delete-anexo', 'POST', data)
  }

  getAnexosContrato(data: any = {})
  {
    return this.api.apiCall(`mercados/get-anexos-contrato/${data.id_contrato}`, 'POST', data)
  }

  downloadAnexo(data)
  {
    return this.api.getTipoBlob('/general/download-files', data)
  }

  anularContrato(id: number, data: any = {}) {
    return this.api.apiCall(`mercados/anular-contrato/${id}`, 'POST', data)
  }
}
