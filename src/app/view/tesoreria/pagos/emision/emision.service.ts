import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';


@Injectable({
  providedIn: 'root'
})
export class EmisionService {

  constructor(private api: ApiServices) { }

  getConceptos() {
    return this.api.apiCall('concepto/get-conceptos', 'POST', {})
  }

  getLiquidacionesByCod(data) {
    return this.api.apiCall("liquidacion/get-liquidaciones-by-codigo", "POST", data);
  }

  getLiqByContribuyente(data) {
    return this.api.apiCall("ordenPago/get-rec-documentoApro", "POST", data);
  }

  setRecDocumento(data) {
    return this.api.apiCall("pagos/crear", "POST", data);
  }

  getRecDocumentos(data) {
    return this.api.apiCall("pagos/getPagos", "POST", data);
  }

  getCajaActiva(id) {
    return this.api.apiCall('recaudacion/get-caja-activa/'+id, 'POST', {})
  }

  getHistorialPagos(data) {
    return this.api.apiCall("pagos/getHistorialPagos", "POST", data);
  }

  
  listarDesembolso(data) {
    return this.api.apiCall('pagos/getDesembolso', 'POST', data);
  }

  listarCuentasBancos(data) {
    return this.api.apiCall('pagos/getBancos', 'POST', data);
  }

  updatePago(data,id) {
    return this.api.apiCall(`pagos/edit-pago/${id}`, 'POST', data);
  }

  obtenerCuentasContables(data) {
    return this.api.apiCall("plandecuentas/obtener-cuentas-contables", "POST", data);
  }
  getAccountsByNumber(data) {
    return this.api.apiCall("plandecuentas/get-cuentas-number", "POST", data);
  }
  getAccountsByCodigo(data) {
    return this.api.apiCall("plandecuentas/get-cuentas-codigo", "POST", data);
  }

  getPresupuestoByCodigo(data) {
    return this.api.apiCall("presupuesto/get-presupuesto-codigo", "POST", data);
  }
  
  getAccountsByCuentaContable(data) {
    return this.api.apiCall("plandecuentas/get-por-cuenta-contable", "POST", data);
  }
  

  getTipoContratos(data) {
    return this.api.apiCall('nomina/rolgeneral/getTipoContratos', 'POST', data);
  }

  getOrdenesPagoNomina(data){
    return this.api.apiCall('pagos/getOrdenesNomina', 'POST', data);
  }

  getMovimientoBancario(data) {
    return this.api.apiCall("tesoreria/movimiento-bancarios-pago", "POST", data);
  }
  getMovimientoBancarioAsiento(data) {
    return this.api.apiCall("tesoreria/movimiento-bancarios-asiento", "POST", data);
  }
  getCatalogoConcepto(data) {
    return this.api.apiCall("proveedores/get-catalogo", "POST", data);
  }

  consultaNumControl(data) {
    return this.api.apiCall('nomina/reporte-rolmensual/reporte-rubros-num-control', 'POST', data);
  }

  anularPago(data) {
    return this.api.apiCall("pagos/anular-pago", "POST", data);
  }
  getCatalogos(data) {
    return this.api.apiCall("proveedores/get-catalogo", "POST", data);
  }

  // getRetencion(data) {
  //   return this.api.apiCall('pagos/validar-retencion', 'POST', data);
  // }

}
