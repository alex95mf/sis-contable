import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ConceptoDetService {

  constructor(private srvApi: ApiServices) { }

  obtenerConceptosDet(datos:any = {}) {
    return this.srvApi.apiCall("concepto/obtener-concepto-det-filtro", "POST", datos);
  }
  obtenerConceptosDetCodigo(datos:any = {}) {
    return this.srvApi.apiCall("concepto/obtener-concepto-det-codigo", "POST", datos);
  }
  

  
  obtenerConceptoDetId(id) {
    return this.srvApi.apiCall(`concepto/obtener-concepto-det-id/${id}`, "POST", {});
  }

  crearConceptoDet(datos:any) {
    return this.srvApi.apiCall('concepto/guardar-concepto-det', "POST", datos);
  }

  actualizarConceptoDet(id, datos) {
    return this.srvApi.apiCall('concepto/actualizar-concepto-det/' + id, "POST", datos);
  }

  borrarConcepto(id) {
    return this.srvApi.apiCall('concepto/borrar-concepto-det/' + id, "POST", {});
  }

  getConceptos(data:any = {}) {
    return this.srvApi.apiCall("concepto/obtener-concepto-filtro","POST",data);
  }

  getConCuentas(data){
    return this.srvApi.apiCall('gestion-bienes/cuentas', 'POST',data);
  }

  getCatalogoPresupuesto(data){
    return this.srvApi.apiCall('gestion-bienes/catalogo-presupuesto', 'POST',data);
  }

}
