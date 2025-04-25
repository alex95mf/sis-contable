import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor(
    private apiService: ApiServices,
  ) { }

  getMeses(keyword: string, data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall(`catalogos/${keyword}`, "GET", data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getRubros(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall('rrhh/rubros', "POST", data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getRubrosEmpleados(data: any = {}) {
    let size = data.params.paginate?.perPage || ''
    let page = data.params.paginate?.page || ''
    let periodo = data.params.filter.periodo || ''
    let mes = data.params.filter.mes || ''
    let rubro = data.params.filter.rubro || ''
    let empleado = data.params.filter.empleado || ''

    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall(`rrhh/get-rubros-empleados?size=${size}&page=${page}&periodo=${periodo}&mes=${mes}&rubro=${rubro}&empleado=${empleado}`
      , "GET", data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getPeriodos(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall('planificacion/get-periodos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
}
}
