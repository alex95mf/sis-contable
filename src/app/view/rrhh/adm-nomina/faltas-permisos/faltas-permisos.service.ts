import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class PerFaltasYPermisosService {

  constructor(private apiService: ApiServices) { }

  
  getFaultAndPermissionByParameter(dataOption? :object){
    
    let page = dataOption['page'];
    let size = dataOption['size'];
    let sort = dataOption['sort'];
    let type_sort = dataOption['type_sort'];
    let id_empleado = dataOption['id_empleado'];
    return this.apiService.apiCall(`fault_and_permissions?id_empleado=${id_empleado}&page=${page}&size=${size}&type_sort=${type_sort}&sort=${sort}`, "GET", {});
  }

  saveFaultAndPermission(data){
    return this.apiService.apiCall('fault_and_permissions', 'POST', data);
  }



  updatedFaultAndPermission(data){
    return this.apiService.apiCall(`fault_and_permissions_aptimo/${data.id_falt_perm}`, 'PUT', data);
  }


  deleteFaultAndPermission(data){
    return this.apiService.apiCall(`fault_and_permissions/${data.id_falt_perm}`, 'DELETE', data);
  }


  getFaultAndPermissionByParameterAditional(dataOption? :object){
    
    let page = dataOption['page'];
    let size = dataOption['size'];
    let sort = dataOption['sort'];
    let type_sort = dataOption['type_sort'];
    let id_empleado = dataOption['id_empleado'];
    let flpr_anio = dataOption['flpr_anio'];
    let id_mes = dataOption['id_mes'];
    return this.apiService.apiCall(`fault_and_permissions?id_empleado=${id_empleado}&page=${page}&size=${size}&type_sort=${type_sort}&sort=${sort}&flpr_anio=${flpr_anio}&id_mes=${id_mes}`, "GET", {});
  }


  getFaltasPermisosEmployeesReport(dataOption? :object){

    let id_empleado = dataOption['id_empleado'];
    let flpr_anio = dataOption['flpr_anio'];
    let id_mes = dataOption['id_mes'];
    let afecta_rol_keyword = dataOption['afecta_rol_keyword'];
   
    // let id_empresa = dataOption['id_empresa'];
    return this.apiService.apiCall(`fault_and_permissions/report?id_empleado=${id_empleado}&flpr_anio=${flpr_anio}&id_mes=${id_mes}&afecta_rol_keyword=${afecta_rol_keyword}`, "GET", {});
  
  }

  getFaltasPermisosEmployeesReportGrafi(dataOption? :object){

    let flpr_anio = dataOption['flpr_anio'];
    let id_mes = dataOption['id_mes'];
    let motivo_permiso = dataOption['motivo_permiso'];
   
    // let id_empresa = dataOption['id_empresa'];
    return this.apiService.apiCall(`fault_and_permissions/report_grafi?flpr_anio=${flpr_anio}&id_mes=${id_mes}&motivo_permiso=${motivo_permiso}`, "GET", {});
  
  }

  getFaltasPermisosAfectaRolParameter(dataOption? :object){

    
    let keyword_afecta_rol = dataOption['keyword_afecta_rol'];
    let id_empleado = dataOption['id_empleado'];
    let anio = dataOption['anio'];
   
    // let id_empresa = dataOption['id_empresa'];
    return this.apiService.apiCall(`fault_and_permissions/afecta-rol/parameter?keyword_afecta_rol=${keyword_afecta_rol}&id_empleado=${id_empleado}&anio=${anio}`, "GET", {});
  
  }

  statusFaultAndPermission(data){
    return this.apiService.apiCall(`fault_and_permissions/status-approve-reject/${data.id_falt_perm}`, 'PUT', data);
  }

  getPeriodos(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall('planificacion/get-periodos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }


}
