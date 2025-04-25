import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
    providedIn: 'root'
})
export class AdmAnticipoService {
    constructor(private apiService: ApiServices) { }

    guardarNomRol(data) {
        return this.apiService.apiCall('administracion/documento/guardarNomRol', 'POST', data);
    }

    getNomRolCab(data: any) {
        return this.apiService.apiCall('administracion/show-rolHead', 'POST', data);
    }

    getNomRolDet(data) {
        return this.apiService.apiCall('administracion/show-rolDetalle', 'POST', data);
    }

    getDatosEmpleados(data) {
        return this.apiService.apiCall('administracion/datosEmpleados', 'POST', data);
    }

    getSecuencia(data) {
        return this.apiService.apiCall('importacion/get-secuencia', 'POST', data);
    }

    getAccountsByDetails(data) {
        return this.apiService.apiCall('diario/accounts/get-details-banks', 'POST', data);
    }

    getPersonalInfo(data) {
        return this.apiService.apiCall('administracionRol/personalSearch', 'POST', data);
    }

    getSucursales() {
        return this.apiService.apiCall('administracion/get-sucursal', 'POST', {});
    }

    getConceptoInfo(data) {
        return this.apiService.apiCall('administracion/showParametrosTipoClase', 'POST', data);
    }

    deleteRolPago(data) {
        return this.apiService.apiCall('administracion/delete-rolPago', 'POST', data);
    }

    aprobarRolPago(data) {
        return this.apiService.apiCall('administracion/aprobarRolPago', 'POST', data);
    }
}