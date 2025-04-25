import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class GeneracionService {

  constructor(private api: ApiServices) { }

  getLiquidaciones(data) {
    return this.api.apiCall("aranceles/get-liquidaciones", "POST", data);
  }

  getLiquidacionesAsync(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.api.apiCall("aranceles/get-liquidaciones", "POST", data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getLiquidacionCompleta(data) {
    return this.api.apiCall(`liquidacion/get-liquidacion-completa/${data}`, 'POST', {})
  }

  setLiquidacion(data) {
    return this.api.apiCall("aranceles/generar", "POST", data);
  }

  getContribuyentes(data:any = {}) {
    return this.api.apiCall('contribuyente/get-contribuyentes', 'POST', data);
  }

  getAranceles(data:any = {}) {
    return this.api.apiCall("aranceles/get-aranceles", "POST", data);
  }

  getPropiedades(id) {
    return this.api.apiCall("propiedad/get-propiedades/" + id, "POST", {});
  }

  getCalculoSubtotal(data, arancel) {
    return this.api.apiCall("aranceles/get-monto/" + arancel, "POST", data);
  }

  getExoneraciones() {
    return this.api.apiCall('aranceles/get-exoneraciones', 'POST', {concepto: {codigo: "RP"}})
  }
  getExoneracionesActivas() {
    return this.api.apiCall('aranceles/get-exoneraciones-activas', 'POST', {concepto: {codigo: "RP"}})
  }

  anularLiquidacion(id) {
    return this.api.apiCall('aranceles/anular/'+id,'POST',{});
  }

  aprobarLiquidacion(id) {
    return this.api.apiCall(`aranceles/cobrar/${id}`, 'POST', {});
  }

  /*getConceptos()
  {
    return this.api.apiCall('concepto/get-conceptos', 'POST', {})
  }

  getConceptoDetalles(data)
  {
    return this.api.apiCall('concepto/get-detalle', 'POST', data)
  }

  getTarifaById(data)
  {
    return this.api.apiCall('rentas/get-tarifa-detalles/' + data, 'POST', {})
  }*/
}
