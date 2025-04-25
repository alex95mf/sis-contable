import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class BandejaTrabajoService {

  constructor(private apiSrv: ApiServices) { }

  getCatalogoCategoria(data) {
    return this.apiSrv.apiCall("proveedores/get-catalogo", "POST", data);
  }
  getCatalogoSubCategoria(data) {
    return this.apiSrv.apiCall("administracion/mesaAyudaTicket/getSubCategoria", "POST", data);
  }

  getTicketsGlobal(data:any = {}) {
    return this.apiSrv.apiCall("administracion/mesaAyudaTicket/getTicketsGlobal","POST",data);
  }
  getTicketsGlobalGeneral(data:any = {}) {
    return this.apiSrv.apiCall("administracion/mesaAyudaTicket/getTicketsGlobalGeneral","POST",data);
  }


  gestionTicket(id, data) {
    return this.apiSrv.apiCall(`administracion/mesaAyudaTicket/gestionTicket/${id}`,"POST",data);
  }
  seguimientoTicket(data,id) {
    return this.apiSrv.apiCall(`administracion/mesaAyudaTicketSegui/getSeguimintoById/${id}`,"POST",data);
  }

  gestionTickets(data) {
    return this.apiSrv.apiCall(`administracion/create-tramitesSeguimiento`,"POST",data);
  }

  
  gestionTramiteSeguimiento(data) {
    return this.apiSrv.apiCall('administracion/gestionTramiteSeguimiento',"POST",data);
  }

  retornarTramiteSeguimiento(data) {
    return this.apiSrv.apiCall('administracion/retornarTramiteSeguimiento',"POST",data);
  }

  anularTicket(ticket) {
    return this.apiSrv.apiCall(`administracion/mesaAyudaTicket/anularTicket/${ticket}`,"POST",{});
  }
  reasignarTicket(data) {
    return this.apiSrv.apiCall(`administracion/mesaAyudaTicket/reasignarTicket`,"POST",data);
  }
  
  getTicketsExport(data) {
    return this.apiSrv.apiCall("administracion/mesaAyudaTicket/getExcel", "POST", data);
  }
  uploadAnexo(file, payload?: any) {
    return this.apiSrv.apiCallFile('general/upload-files', 'POST', file, payload)
  }
  getUsuarios(data){
    return this.apiSrv.apiCall('Administracion/get-usuarios', 'POST', data);
  }
  getUsuariosReasignar(data){
    return this.apiSrv.apiCall('Administracion/get-usuarios-reasignar', 'POST', data);
  }

  getParametrosGenerales(data:any = {}) {
    return this.apiSrv.apiCall("administracion/mesaAyudaTicket/listar-parametros-generales","POST",data);
  }
  
  getAccionesConfiguracion(data:any = {}) {
    return this.apiSrv.apiCall("administracion/mesaAyudaTicket/listar-acciones-configuracion","POST",data);
  }

  aprobarTicket(data) {
    return this.apiSrv.apiCall('administracion/mesaAyudaTicket/aprobarTicket', 'POST', data);
  }
  

  

}