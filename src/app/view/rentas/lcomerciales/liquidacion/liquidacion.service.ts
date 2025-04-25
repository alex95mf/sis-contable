import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class LiquidacionService {
  $contribuyenteSelected = new EventEmitter<any>();
  $ordenInspeccionSelected = new EventEmitter<any>();
  $conceptoSelected = new EventEmitter<any>();
  $exoneracionesSelected = new EventEmitter<any>();
  $documentoSelected = new EventEmitter<any>();

  constructor(
    private apiService: ApiServices,
  ) { }


  getConceptos(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall('concepto/get-detalle-by-codigo', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getContribuyentes(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiService.apiCall('contribuyente/get-contribuyentes', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getOrdenes(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiService.apiCall('inspeccion/get-ordenes-filter', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getValoresPorCobrar(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiService.apiCall('local-comercial/get-valor-por-cobrar', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getExoneraciones(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiService.apiCall('aranceles/get-exoneraciones-codigo', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  almacenarDocumento(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiService.apiCall('local-comercial/set-documento', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getDocumentos(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiService.apiCall('local-comercial/get-documentos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
  
  getDocumento(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiService.apiCall('local-comercial/get-documento', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  aprobarDocumento(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiService.apiCall('local-comercial/aprobar-documento', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
}
