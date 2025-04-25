import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ConvenioArrienteTService {
  selectCompraTerreno$ = new EventEmitter<any>()

  constructor(private apiarriendo: ApiServices) { }

  getArriendoTerrenoTabla(data) {
    return this.apiarriendo.apiCall("rentas/arriendos/liquidacion/getArriendoTerrenoTabla", 'POST', data);
  }

  getConceptoDetalle(data) {
    return this.apiarriendo.apiCall('concepto/get-detalle', 'POST', data);
  }

  getPropiedades(id) {
    return this.apiarriendo.apiCall("propiedad/get-propiedades/" + id, "POST", {});
  }


  getRecDocumentos(data) {
    return this.apiarriendo.apiCall("liquidacion/get-rec-documento", "POST", data);
  }

  createRecDocumentosArriendoTerreno(data) {
    return this.apiarriendo.apiCall("convenio/set-convenio-arriendoT", "POST", data);
  }

  getLote(data) {
    return this.apiarriendo.apiCall("convenio/get-lote", "POST", data);
  }
  uploadAnexo(file, payload?: any) {
    return this.apiarriendo.apiCallFile('general/upload-files', 'POST', file, payload)
  }

  getCompraTerreno(data: any = {}) {
    return this.apiarriendo.apiCall('aranceles/get-liquidaciones', 'POST', data).toPromise<any>()
  }

}
