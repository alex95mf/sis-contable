import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})

export class TomaFisicaService {

  constructor(private apiSrv: ApiServices) { }

getBodegas() {
  return this.apiSrv.apiCall('bodega/get-bodegaGeneral', 'POST', {});
}

getSucursal(data) {
  return this.apiSrv.apiCall('seguridad/get-sucursal', 'POST', data);
}

getGrupo() {
  return this.apiSrv.apiCall('kardex/grupo-producto', 'POST', {});
}

getFilter(data) {
  return this.apiSrv.apiCall('toma-fisica/Filter-product', 'POST', data);
}

getProductoFilter() {
  return this.apiSrv.apiCall('list-precios/select-producto', 'POST', {});
}

SaveInfoTomaFisica(data) {
  return this.apiSrv.apiCall('toma-fisica/save-TomaFisica', 'POST', data);
}

getDocTomaFisica() {
  return this.apiSrv.apiCall('toma-fisica/getFkdoc-TomaFisica', 'POST', {});
}

}
