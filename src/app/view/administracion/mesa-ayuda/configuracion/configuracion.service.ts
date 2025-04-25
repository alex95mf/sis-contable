import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})

export class ConfiguracionService {
    constructor(private apiSrv: ApiServices) { }

    getParametrosGenerales(data:any = {}) {
        return this.apiSrv.apiCall("administracion/mesaAyudaTicket/listar-parametros-generales","POST",data);
    }

    getRol(data) {
        return this.apiSrv.apiCall('seguridad/get-roles', 'POST', data);
    }

    getAccionesConfiguracion(data:any = {}) {
        return this.apiSrv.apiCall("administracion/mesaAyudaTicket/listar-acciones-configuracion","POST",data);
    }

    guardarParametrosGenerales(data:any = {}) {
        return this.apiSrv.apiCall("administracion/mesaAyudaTicket/guardar-parametros-generales","POST",data);
    }

    getCatalogoCategoria(data) {
        return this.apiSrv.apiCall("proveedores/get-catalogo", "POST", data);
    }

    obtenerOrganigrama(data) {
        return this.apiSrv.apiCall('administracion/mesaAyudaTicket/get-mda-organigrama', 'POST', data);
    }
}