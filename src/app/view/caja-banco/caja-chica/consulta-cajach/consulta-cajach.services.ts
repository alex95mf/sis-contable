import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})

export class ConsultaCajachService {

  constructor(private apiSrv: ApiServices) { }

  getMovimiento(data) {
    return this.apiSrv.apiCall('cajaChMovimiento/get-showMovimiento', 'POST', data);
  }

  getBoxSmallXUsuario() {
    return this.apiSrv.apiCall('cajaChMovimiento/get-showCajasChica', 'POST', {});
  }


  getAccountSmallBox() {
    return this.apiSrv.apiCall('boxSmall/get-cuentas-caja-chica', 'POST', {});
  }

  
  getTipoDoc() {
    return this.apiSrv.apiCall('boxSmall/get-tipo-doc', 'POST', {});
  }


}
