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
    return this.apiServices.apiCall('concepto/get-conceptos', 'POST', {}) as any
  }

  getPeriodos() {
    return this.apiServices.apiCall('planificacion/get-periodos', 'POST', {}) as any
  }

  getDescuentos(data: any = {}) {
    return this.apiServices.apiCall('descuentos/get-descuentos', 'POST', data) as any
  }

  setDescuento(data: any = {}) {
    return this.apiServices.apiCall('descuentos/set-descuento', 'POST', data) as any
  }

  updateDescuento(id: number, data: any = {}) {
    return this.apiServices.apiCall(`descuentos/update-descuento/${id}`, 'POST', data) as any
  }

  inicializarDescuentoSp(data: any) {
    return this.apiServices.apiCall('descuentos/inicializar-descuento-sp','POST', data);
  }

  calcularDescuentoSp(data: any) {
    return this.apiServices.apiCall('descuentos/calcular-descuento-sp','POST', data);
  }
}
