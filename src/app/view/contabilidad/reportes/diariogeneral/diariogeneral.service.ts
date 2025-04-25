import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service'; 

@Injectable({
  providedIn: 'root'
})
export class DiarioGeneralService {

  constructor(private apiService: ApiServices) { }

  ListaCentroCostos() {
    return this.apiService.apiCall('centroCosto/lista-centroCosto-activos', 'POST', {});
  }


  getLibroDiario(fecha_incial :string, fecha_fin :string,cuenta :string, cuenta_hasta :string, centro :string ) {
    return this.apiService.apiCall(`contabilidad/reporte/diario/${fecha_incial}/${fecha_fin}/${cuenta}/${cuenta_hasta}/${centro}`, 'GET',  {});
  }
  getLibroDiarioSin(fecha_incial :string, fecha_fin :string, centro :string ) {
    return this.apiService.apiCall(`contabilidad/reporte/diario_sin/${fecha_incial}/${fecha_fin}/${centro}`, 'GET',  {});
  }

  getLibroDiarioAuxiliar(fecha_incial :string, fecha_fin :string,cuenta :string, cuenta_hasta :string, centro :string, auxiliar :string ) {
    return this.apiService.apiCall(`contabilidad/reporte/diario-auxiliar/${fecha_incial}/${fecha_fin}/${cuenta}/${cuenta_hasta}/${centro}/${auxiliar}`, 'GET',  {});
  }
  getLibroDiarioAuxiliarSin(fecha_incial :string, fecha_fin :string, centro :string , auxiliar :string ) {
    return this.apiService.apiCall(`contabilidad/reporte/diario-auxiliar-sin/${fecha_incial}/${fecha_fin}/${centro}/${auxiliar}`, 'GET',  {});
  }
  


  
  getCatalogos(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall('proveedores/get-catalogo', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }



  


  //contabilidad/reporte/diario/{fecha_desde}/{fecha_hasta}/{cuenta}/{cuenta_hasta}/{centro}
  
}