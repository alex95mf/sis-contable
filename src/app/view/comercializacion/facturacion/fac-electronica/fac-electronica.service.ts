import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
    providedIn: 'root'
})
export class FacElectronicaService {
    constructor(
        private apiService: ApiServices,
        private http: HttpClient
        ) { }

    obtenerTipoDocumentos() {
        return this.apiService.apiCall('facturacion/obtenerTipoDocumento', 'POST', {});
    }

    listadoEstadosSRI() {
        return this.http.get<any>('assets/data/listadoEstadosSRI.json').toPromise().then(res => <any[]>res);
    } 

    obtenerDocumento(datos:any) {
        return this.apiService.apiCall('facturacion/obtenerDocumentos', 'POST', datos);
    }

    generacionXML(data:any) {
        return this.apiService.apiCall('facturacion/generacionXML', 'POST', data);
    }

    recepcionAlSri(data:any) {
        return this.apiService.apiCall('facturacion/recepcionAlSri', 'POST', data);
    }

    autorizacionAlSri(data:any) {
        return this.apiService.apiCall('facturacion/autorizacionAlSri', 'POST', data);
    }

    editarXML(data:any) {
        return this.apiService.apiCall('facturacion/editarXML', 'POST', data);
    }

    guardarXMLEditado(data:any) {
        return this.apiService.apiCall('facturacion/guardarXMLEditado', 'POST', data);
    }

    descargarXML(data:any) {
        return this.apiService.getTipoBlob('/api/v1/facturacion/descargarXML', data);
    }

    obtenerCliente(datos:any) {
        return this.apiService.apiCall('facturacion/obtenerCliente', 'POST', datos);
    }

    generacionXMLLiq(data:any) {
        return this.apiService.apiCall('facturacion/generacionXMLLiq', 'POST', data);
    }

    anularDocumento(data:any) {
        return this.apiService.apiCall('facturacion/anularDocumento', 'POST', data);
    }

    obtenerRobot(data:any) {
        return this.apiService.apiCall('facturacion/obtenerRobot', 'POST', data);
    }

    anularFacturaElectronica(data:any) {
        return this.apiService.apiCall('facturacion/anularFacturaElectronica', 'POST', data);
    }

    generacionXMLNC(data:any) {
        return this.apiService.apiCall('facturacion/generacionXMLNC', 'POST', data);
    }

    generacionXMLRetencion(data:any) {
        return this.apiService.apiCall('facturacion/generacionXMLRetencion', 'POST', data);
    }

    enviarCorreoDocumentos(data:any) {
        return this.apiService.apiCall('facturacion/enviarCorreoDocumentos', 'POST', data);
    }
}