import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ConsultaAlertasService {

  constructor(private apiService: ApiServices) { }

  getBitacora(data) {
    return this.apiService.apiCall('bitacora/get-bitacora', 'POST', data);
  }

  getConsultaAuditoria(data) {
    return this.apiService.apiCall('bitacora/get-consulta-auditoria', 'POST', data);
  }



  getBitacoraXDate(data) {
    return this.apiService.apiCall('bitacora/get-bitacora', 'POST', data);
  }

  getUsuario() {
    return this.apiService.apiCall('buy/get-usuario', 'POST', {});
  }

  getConsultaAlertas(data: any) {
    return this.apiService.apiCall('notificaciones/consulta-alertas', 'POST', data);
  }

  getCatalogos(data) {
    return this.apiService.apiCall("proveedores/get-catalogo", "POST", data);
  }

  getModulos() {
    return this.apiService.apiCall('seguridad/get-modulos', 'POST', {}) as any
  }



}

