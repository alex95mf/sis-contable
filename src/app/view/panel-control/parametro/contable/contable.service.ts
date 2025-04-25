import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class contableConfService {

  constructor(private apiService: ApiServices) { }

 /*  presentaTablaEmpresa() {
    return this.apiService.apiCall('seguridad/get-empresas', 'POST', {});
  }

  */

  presentaTablaParametros() {
    return this.apiService.apiCall('configuracion-cuenta-contable/get-show-parametros', 'POST', {});
  }

  editDataParametro(data) {
    return this.apiService.apiCall('configuracion-cuenta-contable/edit', 'POST', data);
  }

  getCuentaDetalle(data) {
    return this.apiService.apiCall('configuracion-cuenta-contable/get-show-cuenta', 'POST', data);
  }

  
  // getRetencionFuenteCompras() {
  //   return this.apiService.apiCall('retencion_fuente/mantenmiento', 'GETV1', {});
  // }

  getRetencionFuenteCompras() {
    return this.apiService.apiCall('retencion_fuente/mantenmiento', 'GET', {});
  }

  getRetencionFuenteComprasAsync() {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall('retencion_fuente/mantenmiento', 'GET', {}).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    }) 
    // return this.apiService.apiCall('retencion_fuente/mantenmiento', 'GET', {});
  }

  // getRetencionIvaCompras() {
  //   return this.apiService.apiCall('retencion_iva', 'GETV1', {});
  // }
  getRetencionIvaCompras() {
    return this.apiService.apiCall('retencion_iva', 'GET', {});
  }
  getRetencionIvaComprasAsync() {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall('retencion_iva', 'GET', {}).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    }) 
  }

  getListaCentroCostosAsync() {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall('centroCosto/lista-centroCosto-activos', 'POST', {}).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
    
  }
  getIceSriAsync() {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall('contabilidad/get-ice-sri', 'POST', {}).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
    
  }



  ObtenerCatalogoGeneral(data) {
    return this.apiService.apiCall('parameters/search-types-catalog', 'POST', data);
  }
  getSustentoTributarioCompras() {
    return this.apiService.apiCall('sustento', 'GET', {});
  }
}

