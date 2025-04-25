import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ExoneracionesService {

  constructor(private apiSrv: ApiServices) { }


  getExoneraciones(data) {
    return this.apiSrv.apiCall("aranceles/get-exoneraciones","POST",data);
  }
  getExoneracionesTodas(data) {
    return this.apiSrv.apiCall("aranceles/get-exoneraciones-todas","POST",data);
  }

  getExoneracion(data) {
    return this.apiSrv.apiCall("exoneracion/buscarExoneracionId", "POST", data);
  }

  getDetallePor(data){
    return this.apiSrv.apiCall("concepto/get-detalle", "POST", data);
  }

  crearExoneracion(data) {
    return this.apiSrv.apiCall("exoneracion/crearExoneracion", "POST", data);
  }

  editExoneracion(id, data) {
    return this.apiSrv.apiCall("exoneracion/actualizarExoneracion/"+id,"POST",data);
  }

  borrarExoneracion(id) {
    return this.apiSrv.apiCall("exoneracion/eliminarExoneracion/"+id,"POST",{});
  }
  getConceptos(data: any = {}) {
    return this.apiSrv.apiCall('concepto/get-conceptos', 'POST', data)
  }
  getConceptoDetalles(data) {
    return this.apiSrv.apiCall('concepto/get-conceptos-detalles', 'POST', data)
  }

  

}
