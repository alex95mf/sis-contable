import { Injectable } from '@angular/core';
import Rubro from './IRubro';
import TipoContrato from './ITipoContrato';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ContratoRubrosService {

  constructor(
    private apiService: ApiServices,
  ) { }

  getRubros(data: any = {}) {
    return new Promise<Array<Rubro>>((resolve, reject) => {
      this.apiService.apiCall('rrhh/rubros', "POST", data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    });
  }

  getRubrosTipoContrato(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall('rrhh/rubrosTipoContrato', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  /*   return this.apiService.apiCall('rrhh/rubrosTipoContrato', 'GET', data); */
  }/* 
  getRubrosTipoContrato(data: any ) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall(`rrhh/rubrosTipoContrato`, "GET", data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    });
  } */


  
  getTipoContrato(keyword: string, data: any = {}) {
    return new Promise<Array<TipoContrato>>((resolve, reject) => {
      this.apiService.apiCall(`catalogos/${keyword}`, "GET", data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    });
  }

  setTipoContratoRubro(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall('rrhh/set-tipo-contrato-rubro', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }


  updateTipoContratoRubro(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall('rrhh/update-tipo-contrato-rubro', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
}
