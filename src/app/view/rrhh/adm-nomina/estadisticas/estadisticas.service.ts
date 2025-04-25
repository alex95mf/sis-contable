import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {

  constructor(
    private apiServices: ApiServices,
  ) { }

  getFaltasPermisosEmployeesReportGrafi(data: any){

    let fp_anio = data.filter.fp_anio;
    let id_mes = data.filter.mes ?? '';
    let motivo_permiso = data.filter.tipo ?? '';
   
    // let id_empresa = dataOption['id_empresa'];
    return this.apiServices.apiCall(`fault_and_permissions/reporte-chart?flpr_anio=${fp_anio}&id_mes=${id_mes}&motivo_permiso=${motivo_permiso}`, "GETV1", {});
  
  }
}
