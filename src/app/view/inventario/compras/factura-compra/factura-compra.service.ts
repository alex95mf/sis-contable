

import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
    providedIn: 'root'
})
export class FacturaCompraService {
    constructor(private apiService: ApiServices) { }

    getCatalogos(data) {
        return this.apiService.apiCall('productos/get-catalogos', 'POST', data);
    }

    searchProduct(data) {
        return this.apiService.apiCall('productos/get-product-type', 'POST', data);
    }

    getImpuestos() {
        return this.apiService.apiCall('ordenes/get-impuestos', 'POST', {});
    }

    getUsuario() {
        return this.apiService.apiCall('buy/get-usuario', 'POST', {});
    }

    getUsRucExist(data) {
        return this.apiService.apiCall('buy/get-ruc-exist', 'POST', data);
    }

    saveBuy(data) {
        return this.apiService.apiCall('buy/save-buy', 'POST', data);
    }

    presentaTablaBuy() {
        return this.apiService.apiCall('buy/get-table-buy', 'POST', {});
    }

    getDetBuy(data) {
        return this.apiService.apiCall('buy/get-det-buy', 'POST', data);
    }

    updateBuy(data) {
        return this.apiService.apiCall('buy/update-buy', 'POST', data);
    }

    validateNumDoc(data) {
        return this.apiService.apiCall('buy/validate-num-doc', 'POST', data);
    }

    deleteFacBuy(data) {
        return this.apiService.apiCall('buy/delete-buy', 'POST', data);
    }

    getDetOrders(data) {
        return this.apiService.apiCall('ordenes/get-orders-details', 'POST', data);
    }

    getTypeDocument(data) {
        return this.apiService.apiCall('sales/get-type-document', 'POST', data);
    }

    getProveedores() {
        return this.apiService.apiCall('proveedores/get-proveedor', 'POST', {});
    }

}
