import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ConceptosService {

  constructor(private apiSrv: ApiServices) { }

  getConceptos(data:any = {}) {
    return this.apiSrv.apiCall("concepto/obtener-concepto-filtro","POST",data);
  }

  getConceptoBy(id) {
    return this.apiSrv.apiCall(`concepto/obtener-concepto-id/${id}`,"POST",{});
  }

  createConcepto(data:any) {
    return this.apiSrv.apiCall("concepto/guardar-concepto","POST",data);
  }

  editConcepto(id, data) {
    return this.apiSrv.apiCall(`concepto/actualizar-concepto/${id}`,"POST",data);
  }

  deleteConcepto(id) {
    return this.apiSrv.apiCall(`concepto/borrar-concepto/${id}`,"POST",{});
  }

  getTarifasBy(concepto) {
    return this.apiSrv.apiCall("rentas/get-tarifa-concepto","POST",concepto);
  }

  obtenerCatalogos(datos) {
    return this.apiSrv.apiCall("proveedores/get-catalogo", "POST", datos);
  }

  getCuentas(data: any = {}) {
    return this.apiSrv.apiCall('plandecuentas-pg/search', 'POST', data)
  }

  getConCuentas(data){
    return this.apiSrv.apiCall('gestion-bienes/cuentas', 'POST',data);
  }

  getCatalogoPresupuesto(data){
    return this.apiSrv.apiCall('gestion-bienes/catalogo-presupuesto', 'POST',data);
  }

  getConCuentasconReglas(data){
    return this.apiSrv.apiCall('gestion-bienes/cuentasconRegla', 'POST',data);
  }


  getCatalog(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiSrv.apiCall("proveedores/get-catalogo", "POST", data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getTarifasConcepto(concepto: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiSrv.apiCall("rentas/get-tarifa-concepto","POST",concepto).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  validarEsigef(data: any = {}) {
    return this.apiSrv.apiCall("concepto/validar-concepto", "POST", data) as any;
  }

  getRegla(data: any = {}) {
    return new Promise<Array<string>>((resolve, reject) => {
      this.apiSrv.apiCall("cuentas/get-regla-esigef", "POST", data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getAgentRetencion(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiSrv.apiCall("available/agent-retencion", "POST", data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
    // return this.apiService.apiCall("available/agent-retencion", "POST", data);
  }

  getMesesIntereses(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiSrv.apiCall('concepto/get-meses-sin-intereses', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  setMesesIntereses(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiSrv.apiCall('concepto/set-meses-sin-intereses', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getAnexo(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiSrv.apiCall('concepto/get-concepto-anexo', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  fileService(file, payload?: any) {
    return this.apiSrv.apiCallFile('general/upload-files', 'POST', file, payload).toPromise()
  }

  downloadAnexo(data: any = {}) {
    return this.apiSrv.getTipoBlob('/general/download-files', data)
  }

  deleteAnexo(data: any = {}) {
    return this.apiSrv.apiCall('general/delete-files', 'POST', data)
  }

}
