import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';


@Injectable({
  providedIn: 'root'
})
export class LiquidacionService {

  constructor(private api: ApiServices) { }

  setLiquidaciones(data: any = {})
  {
    return this.api.apiCall('liquidacion/set-liquidaciones', 'POST', data)
  }
  getLiquidaciones(data) {
    return this.api.apiCall("aranceles/get-liquidaciones", "POST", data);
  }
  getLiquidacionCompleta(data) {
    return this.api.apiCall(`liquidacion/get-liquidacion-completa/${data}`, 'POST', {})
  }
  aprobarLiquidacionVendedor(id) {
    return this.api.apiCall(`aranceles/cobrarVendedor/${id}`, 'POST', {});
  }
  aprobarLiquidacionComprador(id) {
    return this.api.apiCall(`aranceles/cobrarComprador/${id}`, 'POST', {});
  }
  
  getConceptoDetalle(data) {
    return this.api.apiCall('concepto/get-detalle', 'POST', data);
  }
  getPropiedades(id) {
    return this.api.apiCall("propiedad/get-propiedades/" + id, "POST", {});
  }
  getCalculoSubtotal(data, arancel) {
    return this.api.apiCall("aranceles/get-monto/" + arancel, "POST", data);
  }
  getExoneracionesPV(data) {
    return this.api.apiCall('aranceles/get-arancelesPV', 'POST', data);
  }
  anularLiquidacion(id) {
    return this.api.apiCall('aranceles/anular/'+id,'POST',{});
  }

  getContribuyentes(data:any = {}) {
    return this.api.apiCall('contribuyente/get-contribuyentes', 'POST', data);
  }

  getCatalogo(data:any = {}) {
    return this.api.apiCall('rentas/configuracion/con-contribuyente-catalogo', 'POST', data);
  }

  getLoteContribucion(data){
    return this.api.apiCall('contribuyente/get-contribuespecialById', 'POST', data)
  }

  getExoneracionesAL(data) {
    return this.api.apiCall('aranceles/get-arancelesAL', 'POST', data);
  }

  aprobarLiquidacion(data) {
    return this.api.apiCall('liquidacion-plusvalia/aprobar', 'POST', data);
  }

  editarLiquidacion(data) {
    return this.api.apiCall('liquidacion-plusvalia/editar', 'POST', data);
  }

  getExoneracionesCodigo(data) {
    return this.api.apiCall('aranceles/get-exoneraciones-codigo', 'POST', data);
  }

  getStaPlusAlca(data: any={}) {
    return this.api.apiCall('concepto/get-sta-plus-alca', 'POST', data);
  }

}
