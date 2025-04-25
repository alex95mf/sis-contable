import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
    providedIn: 'root'
})
export class OtherGroupService {
    constructor(private apiService: ApiServices) { }

    getTreeProducts(data) {
        return this.apiService.apiCall('productos/get-tree-product-other-group', 'POST', data);
    }

    getTInformationsProducts(data) {
        return this.apiService.apiCall('productos/get-information-product', 'POST', data);
    }

    getMaxCodeChildren(data) {
        return this.apiService.apiCall('productos/get-max-code', 'POST', data);
    }

    saveNewGroup(data) {
        return this.apiService.apiCall('productos/save-new-group', 'POST', data);
    }

    printData(data) {
        return this.apiService.apiCall('plandecuentas/save-data-print', 'POST', data);
    }

    deleteGroup(data) {
        return this.apiService.apiCall('productos/delete-group', 'POST', data);
    }

    updateGroup(data) {
        return this.apiService.apiCall('productos/update-group', 'POST', data);
    }
}