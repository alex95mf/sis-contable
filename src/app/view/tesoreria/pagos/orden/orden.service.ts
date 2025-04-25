import { EventEmitter,Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class OrdenService {

  constructor(private api: ApiServices) { }

  listaCompras$ = new EventEmitter<any>();

  getRecDocumentos(data) {
    return this.api.apiCall("ordenPago/get-rec-documento", "POST", data);
  }
  getCatalogoConcepto(data) {
    return this.api.apiCall("proveedores/get-catalogo", "POST", data);
  }
  getCondiciones(data){
    return this.api.apiCall("ordenPago/get-condiciones", "POST", data);
  }
  getProvCompras(data){
    return this.api.apiCall("ordenPago/get-facturas-sin-orden", "POST", data);
  }
  
  getConceptos() {
    return this.api.apiCall('concepto/get-conceptos', 'POST', {})
  }
  setRecDocumento(data) {
    return this.api.apiCall("ordenPago/set-rec-documento", "POST", data);
  }

  getSolicitudModal(data) {
    return this.api.apiCall('compras/get-solicitudes-modal', 'POST', data)
  }

  
  getOrdenPagoCaja(data){
    return this.api.apiCall('tesoreria/orden-pago-caja', "POST", data);
  }

  getCatalogs(data) {
    return this.api.apiCall("proveedores/get-catalogo", "POST", data);
  }

  getSolicitudModalTipo(data) {
    return this.api.apiCall('compras/get-solicitudes-tipo', 'POST', data)
  }

   getSolicitudModalCat(data) {
    return this.api.apiCall('compras/get-tipoCat', 'POST', data)
  }

  getSolicitudModalCatIngreso(data) {
    return this.api.apiCall('compras/get-cat-elec-ingreso', 'POST', data)
  }
  
  listarCuentasBancos(data) {
    return this.api.apiCall('pagos/getBancos', 'POST', data);
  }
  anularOrdenPago(data) {
    return this.api.apiCall("ordenPago/anular-orden-pago", "POST", data);
  }
}
