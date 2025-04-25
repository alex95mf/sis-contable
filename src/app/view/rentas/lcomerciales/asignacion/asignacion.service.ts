import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AsignacionService {

  constructor(private srvApi: ApiServices) { }

  obtenerAsignaciones(data:any = {}) {
    return this.srvApi.apiCall("inspeccion/mostrar-resultados-cab-filtro", "POST", data);
  }

  asignarInspector(id, datos) {
    return this.srvApi.apiCall('inspeccion/asignar-inspector/' + id, "POST", datos);
  }

  obtenerInspectores(datos?:any) {
    if(datos){
      return this.srvApi.apiCall("inspeccion/mostrar-inspectores", "POST", datos);
    } else {
      return this.srvApi.apiCall("inspeccion/mostrar-inspectores", "POST", {});
    }
  }
}
