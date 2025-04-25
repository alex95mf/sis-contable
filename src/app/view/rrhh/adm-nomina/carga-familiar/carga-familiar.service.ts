import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
    providedIn: 'root'
})
export class CargaFamiliarService {
    constructor(private apiService: ApiServices) { }

    tablaFamiliar() {
        return this.apiService.apiCall('administracion/nomina/get-table-nomina', 'POST', {});
    }

    getLoadExist(data) {
        return this.apiService.apiCall('administracion/validate-dni-carga', 'POST', data);
    }

    guardaCarga(data) {
        return this.apiService.apiCall('administracion/signup-carga', 'POST', data);
    }

    getEmpleado() {
        return this.apiService.apiCall('administracion/get-empleados', 'POST', {});
    }

    getrelacion() {
        return this.apiService.apiCall('administracion/get-relacion', 'POST', {});
    }

    updateCarga(data) {
        return this.apiService.apiCall('administracion/upgrade-carga', 'POST', data);
    }

    deleteCarga(data) {
        return this.apiService.apiCall('administracion/destroy-carga', 'POST', data);
    }

}