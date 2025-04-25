import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class BenefGastosPersonalesService {

  exportMasivo$ = new EventEmitter();
  consultarMasivo$ = new EventEmitter();
  limpiarMasivo$ = new EventEmitter();

  constructor(private apiService: ApiServices) {}

  saveListGastosPersonales(data) {
    return this.apiService.apiCall("list-gastos-personales", "POST", data);
  }

  updateListGastosPersonales(data) {
    return this.apiService.apiCall("update-list/gastos-personales", "PUTV1", data);
  }

  deleteListGastosPersonales(data) {
    return this.apiService.apiCall("delete-list/gastos-personales", "PUTV1", data);
  }

  // getRubros() {
  //   return this.apiService.apiCall("rubros", "GETV1", {});
  // }

  // saveCargo(data) {
  //   return this.apiService.apiCall("rubros", "POST", data);
  // }

  // updatedCargo(data) {
  //   return this.apiService.apiCall(`rubros/${data.id_rubro}`, "PUTV1", data);
  // }

  // deleteCargo(data) {
  //   return this.apiService.apiCall(`rubros/${data.id_rubro}`, "DELETEV1", data);
  // }

  getImpuestoRenta(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall('contabilidad/get-impuesto-renta', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }


  getTablaMasiva(data: any = {}) {
    return new Promise<any[]>((resolve, reject) => {
      this.apiService.apiCall('contabilidad/get-impuesto-renta-masivo', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getPeriodos(data: any = {}) {
    return new Promise<any[]>((resolve, reject) => {
      this.apiService.apiCall('planificacion/get-periodos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getMaxGastosPersonales(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiService.apiCall('nomina/get-max-gastos-personales', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getRebajaDiscapacidad(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiService.apiCall('nomina/get-rebaja-discapacidad', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getRebajaTerceraEdad(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiService.apiCall('nomina/get-rebaja-tercera-edad', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getImpuestoCausado(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiService.apiCall('nomina/get-impuesto-causado', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  aprobarImpuestoRenta(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiService.apiCall('nomina/aprobar-impuesto-renta', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
}
