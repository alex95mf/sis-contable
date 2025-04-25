import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class PuestoService {

  constructor(private api: ApiServices) { }

  getMercados()
  {
    return this.api.apiCall("proveedores/get-catalogo", "POST", {params: "'REN_MERCADO'"});
  }

  getPuestos(data: any = {})
  {
    return this.api.apiCall("mercado/get-puestos", "POST", data);
  }

  getPuestosFiltro(data: any = {})
  {
    return this.api.apiCall("mercado/get-puestos-filtro", "POST", data);
  }

  savePuesto(data)
  {
    return this.api.apiCall("mercado/save-puesto", "POST", data);
  }

  deletePuesto(data)
  {
    return this.api.apiCall("mercado/delete-puesto", "POST", data);
  }

  updatePuesto(data)
  {
    return this.api.apiCall("mercado/update-puesto", "POST", data);
  }
  
  /*getLiquidaciones() 
  {
    return this.api.apiCall('liquidacion/get-liquidaciones', 'POST', {})
  }

  getLiquidacionCompleta(data)
  {
    return this.api.apiCall(`liquidacion/get-liquidacion-completa/${data}`, 'POST', {})
  }

  setLiquidacion(data)
  {
    return this.api.apiCall('liquidacion/set-liquidacion', 'POST', data)
  }

  getContribuyentes()
  {
    return this.api.apiCall('contribuyente/get-contribuyentes', 'POST', {})
  }

  getConceptos()
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
