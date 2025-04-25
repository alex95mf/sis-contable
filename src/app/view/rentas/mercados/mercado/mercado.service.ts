import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class MercadoService {

  constructor(private apiSrv: ApiServices) { }

  getConceptos(data:any = {}) {
    return this.apiSrv.apiCall("rentas/get-mercado","POST",data);
  }
  
  getConceptoBy(id) {
    return this.apiSrv.apiCall(`concepto/obtener-concepto-id/${id}`,"POST",{});
  }

  createMercado(data:any) {
    return this.apiSrv.apiCall("rentas/set-mercado","POST",data);
  }

  editMercado(data) {
    return this.apiSrv.apiCall('rentas/edit-mercado',"POST",data);
  }

  deleteConcepto(data) {
    return this.apiSrv.apiCall(`rentas/delete-mercado`,"POST",data);
  }

  getTarifasBy(concepto) {
    return this.apiSrv.apiCall("rentas/get-tarifa-concepto","POST",concepto);
  }

  obtenerCatalogos(datos) {
    return this.apiSrv.apiCall("proveedores/get-catalogo", "POST", datos);
  }

  getCuentas(data: any = {}) {
    return this.apiSrv.apiCall('plandecuentas-pg/search', 'POST', data)
  }

  getConCuentas(data){
    return this.apiSrv.apiCall('gestion-bienes/cuentas', 'POST',data);
  }

  getCatalogoPresupuesto(data){
    return this.apiSrv.apiCall('gestion-bienes/catalogo-presupuesto', 'POST',data);
  }
}
