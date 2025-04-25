import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TrasnferenciaDepositosService {

  constructor(private apiService: ApiServices) { }

  getCompanyInformation(data) {
    return this.apiService.apiCall('diario/documents/get-types', 'POST', data);
  }
  getAccountsByDetailsBanks(data) {
    return this.apiService.apiCall('diario/accounts/get-details-banks', 'POST', data);
  }

  getAccountsByDetails(data) {
    return this.apiService.apiCall('diario/accounts/get-details', 'POST', data);
  }

  addVoucherDaily(data) {
    return this.apiService.apiCall('diario/voucher/add-voucher-daily', 'POST', data);
  }

  ediVoucherDaily(data) {
    return this.apiService.apiCall('diario/voucher/edit-voucher-daily', 'POST', data);
  }

  deleteVoucherDaily(data) {
    return this.apiService.apiCall('diario/voucher/delete-voucher-daily', 'POST', data);
  }

  ListaCentroCostos() {
    return this.apiService.apiCall('centroCosto/lista-centroCosto-activos', 'POST', {});
  }

  getVoucherDaily(data) {
    return this.apiService.apiCall('diario/voucher/get-vouchers-daily', 'POST', data);
  }

  ListaCatalogoPresupuesto() {
    return this.apiService.apiCall('catalogo-presupuesto/obtener-lista-catpresupuesto', 'POST', {});
  }

  /*new consult*/

  getDocumentData() {
    return this.apiService.apiCall('report-movimientoContable/all-documento', 'POST', {});
  }

  getmovCab(datas) {
    return this.apiService.apiCall('report-movimientoContable/all-con-movCab', 'POST', datas);
  }

  getMovimientoContable(data) {
    return this.apiService.apiCall('report-movimientoContable/mov-contable', 'POST', data);
  }

  getanterior(data) {
    return this.apiService.apiCall('report-movimientoContable/get-saldo-anterior', 'POST', data);
  }

  getDetailsMovs() {
    return this.apiService.apiCall('report-movimientoContable/get-mov', 'POST', {});
  }

  getMovientoCabData() {
    return this.apiService.apiCall('report-movimientoContable/get-mov-cabData', 'POST', {});
  }

  searchMovientoCabezera(data) {
    return this.apiService.apiCall('report-movimientoContable/get-mov-cabezeraData', 'POST', data);
  }

  printData(data) {
    return this.apiService.apiCall('plandecuentas/save-data-print', 'POST', data);
  }

  getViewDtMov() {
    return this.apiService.apiCall('asiento-diario-consulta/get-view-dt', 'POST', {});
  }

  RegistroEgresoBancos(data) {
    return this.apiService.apiCall('bancos/registra_egreso_banco', 'POST', data);
  }

  ListaMovimientosBancos(data) {
    return this.apiService.apiCall('bancos/obtener_registro_movimientos', 'POST', data);
  }

  AnularRegistroMovBanco(data){
    return this.apiService.apiCall('bancos/anular', 'POST', data);
  }
  listarDesembolso(data) {
    return this.apiService.apiCall('pagos/getDesembolso', 'POST', data);
  }

  listarTipoIngreso(data) {
    return this.apiService.apiCall('pagos/getTipoIngreso', 'POST', data);
  }

  

}