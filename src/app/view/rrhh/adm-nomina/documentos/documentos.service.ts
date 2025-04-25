import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
    providedIn: 'root'
})
export class DocumentosService {
    constructor(private apiService: ApiServices) { }


    getEmpleado() {
        return this.apiService.apiCall('administracion/get-empleados', 'POST', {});
    }


    presentarDocumento(data) {
        return this.apiService.apiCall('administracion/documento/get-documento', 'POST', data);
    }


    fileService(file, payload?: any) {
        return this.apiService.apiCallFile('general/upload-files', 'POST', file, payload);
    }

    descargar(data) {
        return this.apiService.getTipoBlob("/general/download-files", data);
    }

    patchFile(file, payload?: any) {
        return this.apiService.apiCallFile('general/patch-files', 'POST', file, payload);
    }

    deleteFile(data) {
        return this.apiService.apiCall('general/delete-files', 'POST', data);
    }

}