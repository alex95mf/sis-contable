import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
    providedIn: 'root'
})
export class prestamosService {
    constructor(private apiService: ApiServices) { }

    getCatalogs(data) {
      return this.apiService.apiCall("proveedores/get-catalogo", "POST", data);
    }

    tablaPersonal() {
      return this.apiService.apiCall("prestamos/show-personal", "POST", {});
    }

    showpersonalDos(data) {
      return this.apiService.apiCall("prestamos/show-personal-dos", "POST", data);
    }

    savePrestamos(data) {
      return this.apiService.apiCall("prestamos/save-prestamos", "POST", data);
    }

    tablaPrestamo() {
      return this.apiService.apiCall("prestamos/show-prestamos", "POST", {});
    }
  
    tablaPrestamoDt() {
      return this.apiService.apiCall("prestamos/show-prestamosDt", "POST", {});
    }

    deletePrestamo(data) {
      return this.apiService.apiCall("prestamos/anular-prestamo", "POST", data);
    }

    getDetPrestamo(data) {
      return this.apiService.apiCall("prestamos/detalleId-prestamosDt", "POST", data);
    }
  
    printData(data) {
      return this.apiService.apiCall('plandecuentas/save-data-print', 'POST', data);
    }
    
    editarPrestamo(data) {
      return this.apiService.apiCall('prestamos/edit-prestamo', 'POST', data);
    }

    getVendedor() {
      return this.apiService.apiCall('reportsInvoice/get-vendedor', 'POST', {});
    }

    getAccountsByDetails(data) {
      return this.apiService.apiCall('diario/accounts/get-details-banks', 'POST', data);
    }

    getBoxSmallXUsuario() {
      return this.apiService.apiCall('boxSmall/get-box-small-x-usuuario', 'POST', {});
    }

    getAsientoDiario(data) {
      return this.apiService.apiCall("prestamos/getAsientoDiario", "POST", data);
    }
    
    getSucursales() {
      return this.apiService.apiCall('administracion/get-sucursal', 'POST', {});
    }
}