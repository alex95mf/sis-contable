import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class LiquidacionPrService {

  contribuyenteSelected$ = new EventEmitter<any>();
  conceptoSelected$ = new EventEmitter<any>();
  exoneracionesSelected$ = new EventEmitter<any>();
  liquidacionSelected$ = new EventEmitter<any>();

  constructor(
    private apiServices: ApiServices
  ) { }

  getContribuyentes(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiServices.apiCall('contribuyente/get-contribuyentes', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getPropiedades(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiServices.apiCall(`propiedad/get-propiedades/${data.id_cliente}`, 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getConceptos(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiServices.apiCall(`concepto/get-detalle-by-codigo`, 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  setLiquidacion(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiServices.apiCall(`catastro/set-liquidacion-rural`, 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
  
  getLiquidaciones(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiServices.apiCall(`catastro/get-liquidaciones-rural`, 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getLiquidacion(id: number, data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiServices.apiCall(`catastro/get-liquidacion-rural/${id}`, 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getExoneraciones(data) {
    return this.apiServices.apiCall('aranceles/get-exoneraciones', 'POST', data);
  }
}
