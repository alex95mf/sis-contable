import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private apiSrv: ApiServices) { }

  getCatalogoCategoria(data) {
    return this.apiSrv.apiCall("proveedores/get-catalogo", "POST", data);
  }
  getCatalogoSubCategoria(data) {
    return this.apiSrv.apiCall("administracion/mesaAyudaTicket/getSubCategoria", "POST", data);
  }

  getTicketsByUsuario(data:any = {}) {
    return this.apiSrv.apiCall("administracion/mesaAyudaTicket/getTicketsByUsuario","POST",data);
  }

  getTicketsGlobal(data:any = {}) {
    return this.apiSrv.apiCall("administracion/mesaAyudaTicket/getTicketsGlobal","POST",data);
  }

  
  createTicket(data:any) {
    return this.apiSrv.apiCall("administracion/mesaAyudaTicket/guardarTicket","POST",data);
  }

  reaperturarTicket(id:any, data: any) {
    return this.apiSrv.apiCall(`administracion/mesaAyudaTicket/reaperturarTicket/${id}`,"POST", data);
  }

  getHistoriaTickets(id:any, data: any) {
    return this.apiSrv.apiCall(`administracion/mesaAyudaTicket/getHistoriaTickets/${id}`,"POST", data);
  }

  gestionTicketSegui(id, data) {
    return this.apiSrv.apiCall(`administracion/mesaAyudaTicketSegui/getSeguimintoById/${id}`,"POST",data);
  }

  seguimientoTicket(data,id) {
    return this.apiSrv.apiCall(`administracion/mesaAyudaTicketSegui/getSeguimintoById/${id}`,"POST",data);
  }

  uploadAnexo(file, payload?: any) {
    return this.apiSrv.apiCallFile('general/upload-files', 'POST', file, payload)
  }

  createCatalogo(data:any) {
    console.log(data)
    return this.apiSrv.apiCall("administracion/mesaAyudaTicket/guardarCatalogo","POST",data);
  }
 
  getParametrosGenerales(data:any = {}) {
    return this.apiSrv.apiCall("administracion/mesaAyudaTicket/listar-parametros-generales","POST",data);
  }
  
  getAccionesConfiguracion(data:any = {}) {
    return this.apiSrv.apiCall("administracion/mesaAyudaTicket/listar-acciones-configuracion","POST",data);
  }

  obtenerOrganigrama(data) {
    return this.apiSrv.apiCall('administracion/mesaAyudaTicket/get-mda-organigrama', 'POST', data);
  }

  

}