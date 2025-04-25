import { EventEmitter,Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ComisariaCertificadoService {

  constructor(private api: ApiServices) { }

  listaConceptos$ = new EventEmitter<any>();

  getContribuyentes(data?:any) {
    if(data){
      return this.api.apiCall('contribuyente/get-contribuyentes', 'POST', data);
    } else {
      return this.api.apiCall('contribuyente/get-contribuyentes', 'POST', {})
    }
  }

  getCatalogs(data) {
    return this.api.apiCall("proveedores/get-catalogo", "POST", data);
  }

  getContribuyentesByFilter(data:any = {}) {
    return this.api.apiCall('contribuyente/get-contribuyentes', 'POST', data);
  }
  verificarDeudaMunicipio(data) {
    return this.api.apiCall('liquidacion/get-comisaria-deuda-municipio', 'POST',  data);
  }
  verificarDeudaPredio(data) {
    return this.api.apiCall('liquidacion/get-comisaria-deuda-predio', 'POST',  data);
  }

  


  


 

}
