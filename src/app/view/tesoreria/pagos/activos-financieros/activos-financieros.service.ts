import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ActivosFinancierosService {

  constructor(private api: ApiServices) { }

  getConceptos() {
    return this.api.apiCall('concepto/get-conceptos', 'POST', {})
  }

  getLiquidacionesByCod(data) {
    return this.api.apiCall("liquidacion/get-liquidaciones-by-codigo", "POST", data);
  }

  getLiqByContribuyente(data) {
    return this.api.apiCall("liquidacion/get-liquidaciones-by-contribuyente", "POST", data);
  }

  setRecDocumento(data) {
    return this.api.apiCall("liquidacion/set-rec-documento", "POST", data);
  }

  setGarantia(data) {
    return this.api.apiCall("liquidacion/set-activos-financieros", "POST", data);
  }

  setUpdateActivosFijos(data) {
    return this.api.apiCall("liquidacion/update-activos-financieros", "POST", data);
  }

  getRecDocumentos(data) {
    return this.api.apiCall("liquidacion/get-rec-documento", "POST", data);
  }

  getCajaActiva(id) {
    return this.api.apiCall('recaudacion/get-caja-activa/'+id, 'POST', {})
  }

  getCajaDiaByCaja(data) {
    return this.api.apiCall('recaudacion/get-caja-dia-by-caja', 'POST', data)
  }

  getCatalogos(data) {
    return this.api.apiCall("proveedores/get-catalogo", "POST", data);
  }
  
  getInspecciones(data: any = {}){
    return this.api.apiCall('inspeccion/get-ordenes-filter', 'POST', data);
  }
  
  getInspeccion(data) {
    return this.api.apiCall('inspeccion/get-inspeccion', 'POST', data);
  }

  getPuestos(data: any = {}) {
    return this.api.apiCall('mercado/get-puestos', 'POST', data)
  }

  getCatalogs(data) {
    return this.api.apiCall("proveedores/get-catalogo", "POST", data);
  }

  getCatalogoConcepto(data) {
    return this.api.apiCall("proveedores/get-catalogo", "POST", data);
  }

  gestionOrdenPago(id, data) {
    return this.api.apiCall(`ordenPago/gestion-orden-pago/${id}`,"POST",data);
  }

  getRecDocumentosExport(data) {
    return this.api.apiCall("ordenPago/get-excel", "POST", data);
  }

  getMovimientoBancario(data) {
    return this.api.apiCall("tesoreria/movimiento-bancarios", "POST", data);
  }

  guardarNumeroPreImpreso(data) {
    return this.api.apiCall("tesoreria/set-movimiento-bancarios", "POST", data);
  }

}
