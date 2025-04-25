import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class EspeciesFiscalesService {

  constructor(
    private api: ApiServices
  ) { }

  getEspeciesfiscales(data){
    return this.api.apiCall('tesoreria/especies-fiscales',"POST", data);
  }

  deleteEspeciesfiscales(data){
    return this.api.apiCall('',"POST", data);
  }

  getCatalogs(data) {
    return this.api.apiCall("proveedores/get-catalogo", "POST", data);
  }

  saveEspeciesfiscales(data){
    return this.api.apiCall('tesoreria/set-especies-fiscales',"POST", data);
  }

  editEspeciesfiscales(data){
    return this.api.apiCall('tesoreria/update-especies-fiscales',"POST", data);
  }

  anulacionEspeciesfiscales(data){
    return this.api.apiCall('tesoreria/anulacion-especies-fiscales',"POST", data);
  }

  getanulacionEspeciesfiscales(data){
    return this.api.apiCall('tesoreria/get-anulacion-especies-fiscales',"POST", data);
  }


}
