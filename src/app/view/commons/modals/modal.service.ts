import { Injectable } from '@angular/core';
import { ApiServices } from '../../../services/api.service';

@Injectable({
    providedIn: 'root'
})
export class ModalService {
    constructor(private apiService: ApiServices) { }

    searchAnexos(data) {
        return this.apiService.apiCall('general/search-files', 'POST', data);
    }

    searchProviders(data) {
        return this.apiService.apiCall('proveedores/search-general', 'POST', data);
    }

    searchCustomer(data) {
        return this.apiService.apiCall('clientes/search-clientes', 'POST', data);
    }

    searchProduct(data) {
        return this.apiService.apiCall('productos/search-product-table', 'POST', data);
    }

    searchAnexosFilter(data) {
        return this.apiService.apiCall('general/get-anexos-filter', 'POST', data);
    }

    searchSolicitud(data) {
        return this.apiService.apiCall('solicitudes/search-solicitud', 'POST', data);
    }

    searchOrders() {
        return this.apiService.apiCall('ordenes/get-orders', 'POST', {});
    }

    searchQuotes() {
        return this.apiService.apiCall('quotes/get-quotes', 'POST', {});
    }
}