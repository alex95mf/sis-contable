import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';


@Injectable({
  providedIn: 'root'
})
export class MultasService {

  constructor(private api: ApiServices) { }
  setRecDocumento(data) {
    return this.api.apiCall("multas/crear-multa", "POST", data);
  }

   getMultas(data) {
    return this.api.apiCall("multas/get-multas", "POST", data);
  }

  getUltimaMulta(data: any = {}) {
    return this.api.apiCall('multas/get-ultima-multa', 'POST', data).toPromise<any>();
  }

  updateEstado(data){
  return this.api.apiCall('multas/update-consultas', 'POST',data);
  }

  ListarContratos(id_proveedor :number) {
    return this.api.apiCall(`proveeduria/contratos_proveedores/${id_proveedor}`, 'GET',  {});
  }
  ListarContratosCatElec(id_proveedor :number) {
    return this.api.apiCall(`proveeduria/contratos_proveedores_catalogo_electronico/${id_proveedor}`, 'GET',  {});
  }

  getSolicitudModalTipo(data) {
    return this.api.apiCall('compras/get-solicitudes-tipo', 'POST', data)
  }
  getSolicitudModalCat(data) {
    return this.api.apiCall('compras/get-tipoCat', 'POST', data)
  }
}
