import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class DescuentosService {
  updateDescuentos$ = new EventEmitter<void>()

  constructor(
    private apiServices: ApiServices,
  ) { }

  getConceptos() {
    return this.apiServices.apiCall('concepto/get-conceptos', 'POST', {}).toPromise<any>()
  }

  getPeriodos() {
    return this.apiServices.apiCall('planificacion/get-periodos', 'POST', {}).toPromise<any>()
  }

  getDescuentos(data: any = {}) {
    return this.apiServices.apiCall('descuentos/get-descuentos', 'POST', data).toPromise<any>()
  }

  setDescuento(data: any = {}) {
    return this.apiServices.apiCall('descuentos/set-descuento', 'POST', data).toPromise<any>()
  }

  updateDescuento(id: number, data: any = {}) {
    return this.apiServices.apiCall(`descuentos/update-descuento/${id}`, 'POST', data).toPromise<any>()
  }

  inicializarDescuentoSp(data: any) {
    return this.apiServices.apiCall('descuentos/inicializar-descuento-sp','POST', data);
  }

  calcularDescuentoSp(data: any) {
    return this.apiServices.apiCall('descuentos/calcular-descuento-sp','POST', data);
  }
}
