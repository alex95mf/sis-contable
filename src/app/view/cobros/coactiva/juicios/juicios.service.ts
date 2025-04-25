import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class JuiciosService {

  constructor(private apiService: ApiServices) { }

  getJuicios(data: any = {}) {
    return this.apiService.apiCall('legal/get-juicios', 'POST', data)
  }

  getJuicio(data: any = {}) {
    return this.apiService.apiCall(`legal/get-juicio/${data.id_cob_juicio}`, 'POST', data)
  }

  eliminaJuicio(data: any = {}) {
    return this.apiService.apiCall(`legal/delete-juicio/${data.juicio.id_cob_juicio}`, 'POST', data)
  }

  getAbogados(data: any = {}) {
    return this.apiService.apiCall('legal/get-abogados', 'POST', data)
  }

  asignaAbogado(data: any = {}) {
    return this.apiService.apiCall('legal/set-abogado', 'POST', data)
  }

  almacenaActuacion(data: any = {}) {
    return this.apiService.apiCall('legal/set-actuacion', 'POST', data)
  }

  uploadAnexo(file, payload?: any) {
    return this.apiService.apiCallFile('general/upload-files', 'POST', file, payload)
  }

  saveJuicio(data: any = {}) {
    return this.apiService.apiCall('legal/set-juicioNuevo', 'POST', data)
  }

  saveExpediente(data: any = {}) {
    return this.apiService.apiCall('cobros/set-Expediente', 'POST', data)
  }

  getCatalogs(data: any = {}) {
    return this.apiService.apiCall("proveedores/get-catalogo", "POST", data);
  }

  getCatalogsAsync(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiService.apiCall("proveedores/get-catalogo", "POST", data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  saveCitacion(data: any = {}) {
    return this.apiService.apiCall('cobros/save-citacion', 'POST', data)
  }
  saveAbogado(data: any = {}) {
    return this.apiService.apiCall('juicio/save-Abogado', 'POST', data)
  }

  getConceptosLiquidacionTodas(data) {
    return this.apiService.apiCall("liquidacion/get-conceptos-liquidacion-todas", "POST", data);
  }
  getConceptosLiquidacionRp(data) {
    return this.apiService.apiCall("liquidacion/get-conceptos-liquidacion-rp", "POST", data);
  }
  getConceptosLiquidacionTa(data) {
    return this.apiService.apiCall("liquidacion/get-conceptos-liquidacion-ta", "POST", data);
  }
  getConceptosLiquidacionEp(data) {
    return this.apiService.apiCall("liquidacion/get-conceptos-liquidacion-ep", "POST", data);
  }

  
  
}
