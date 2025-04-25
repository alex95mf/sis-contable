import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
    providedIn: 'root'
})
export class MaintenanceService {

    constructor(private apiSrv: ApiServices) { }

    searchProduct(data) {
        return this.apiSrv.apiCall('productos/search-product-table', 'POST', data);
    }

    getCatalogos(data) {
        return this.apiSrv.apiCall('productos/get-catalogos', 'POST', data);
    }

    getImpuestos() {
        return this.apiSrv.apiCall('ordenes/get-impuestos', 'POST', {});
    }

    getCustomers() {
        return this.apiSrv.apiCall("clientes/get-all-clients", "POST", {});
    }

    setQuotes(data) {
        return this.apiSrv.apiCall("quotes/set-quotes", "POST", data);
    }

    duplicateQuotes(data) {
        return this.apiSrv.apiCall("quotes/duplicate-quotes", "POST", data);
    }
}
