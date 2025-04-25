import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
    providedIn: 'root'
})
export class DiarioService {
    constructor(private apiService: ApiServices) { }

    getCompanyInformation(data) {
        return this.apiService.apiCall('diario/documents/get-types', 'POST', data);
    }

    getAccountsByDetails(data) {
        return this.apiService.apiCall('diario/accounts/get-details', 'POST', data);
    }

    addVoucherDaily(data) {
        return this.apiService.apiCall('diario/voucher/add-voucher-daily', 'POST', data);
    }

    getAsientoByID(data) {
        return this.apiService.apiCall('diario/voucher/get-by-id', 'POST', data);
    }

    ediVoucherDaily(data) {
        return this.apiService.apiCall('diario/voucher/edit-voucher-daily', 'POST', data);
    }

    ediVoucherDailyNew(data) {
      return this.apiService.apiCall('diario/voucher/edit-voucher-dailynew', 'POST', data);
  }

    deleteVoucherDaily(data) {
        return this.apiService.apiCall('diario/voucher/delete-voucher-daily', 'POST', data);
    }

    ListaCentroCostos() {
      // return new Promise((resolve, reject) => {
      //   this.apiService.apiCall('centroCosto/lista-centroCosto-activos', 'POST', {}).subscribe(
      //     (res: any) => resolve(res.data),
      //     (err: any) => reject(err.error)
      //   )
      // });
      return this.apiService.apiCall('centroCosto/lista-centroCosto-activos', 'POST', {});
    }

    getVoucherDaily(data) {
        return this.apiService.apiCall('diario/voucher/get-vouchers-daily', 'POST', data);
    }

    ListaCatalogoPresupuesto(){
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
  
    getanterior(data){
      return this.apiService.apiCall('report-movimientoContable/get-saldo-anterior', 'POST', data);
    }
  
    getDetailsMovs(){
      return this.apiService.apiCall('report-movimientoContable/get-mov', 'POST', {});
    }
  
    getMovientoCabData(){
      return this.apiService.apiCall('report-movimientoContable/get-mov-cabData', 'POST', {});
    }
  
    searchMovientoCabezera(data){
      return this.apiService.apiCall('report-movimientoContable/get-mov-cabezeraData', 'POST', data);
    }

    searchMovientoById(data){
      return this.apiService.apiCall('report-movimientoContable/get-mov-id', 'POST', data);
    }
    
    printData(data){
      return this.apiService.apiCall('plandecuentas/save-data-print', 'POST', data);
    }
 
    getViewDtMov(){
      return this.apiService.apiCall('asiento-diario-consulta/get-view-dt', 'POST', {});
    }

    AnularRegistroDiarios(data){
      return this.apiService.apiCall('asiento-diario/anular', 'POST', data);
    }
}