import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class NuevaConsultaService {

  constructor(
    private apiServices: ApiServices,
  ) { }

  getCentroCostos() {
    return this.apiServices.apiCall('centroCosto/lista-centroCosto-activos', 'POST', {});
  }

  getLibroDiario(fecha_incial :string, fecha_fin :string,cuenta :string, cuenta_hasta :string, centro :string ) {
    return this.apiServices.apiCall(`contabilidad/reporte/diario/${fecha_incial}/${fecha_fin}/${cuenta}/${cuenta_hasta}/${centro}`, 'GET',  {});
  }
  getLibroDiarioSin(fecha_incial :string, fecha_fin :string, centro :string ) {
    return this.apiServices.apiCall(`contabilidad/reporte/diario_sin/${fecha_incial}/${fecha_fin}/${centro}`, 'GET',  {});
  }
}
