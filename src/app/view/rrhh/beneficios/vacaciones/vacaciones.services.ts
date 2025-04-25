import { Injectable } from '@angular/core';

import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class VacacionesService {


  constructor(private apiService: ApiServices) { }


  GenerarRegistroVaciones(data) {
    return this.apiService.apiCall('nomina/vacaciones/generar', 'POST', data);
  }

  getVacaciones(id: number) {
    return this.apiService.apiCall(`vacations/${id}`, 'GET', {});
  }

  saveVacation(data: any = {}){
    return this.apiService.apiCall('vacations', 'POST', data);
  }

  saveVacationDetail(data){
    return this.apiService.apiCall('vacation-details', 'POST', data);
  }

  getVacationCabParameter(dataOption? :object){
    
    let page = dataOption['page'];
    let size = dataOption['size'];
    let sort = dataOption['sort'];
    let type_sort = dataOption['type_sort'];
    let id_empleado = dataOption['id_empleado'];
    let id_empresa = dataOption['id_empresa'];
    return this.apiService.apiCall(`vacations?id_empleado=${id_empleado}&page=${page}&size=${size}&type_sort=${type_sort}&sort=${sort}&id_empresa=${id_empresa}`, "GETV1", {});
  }

    
  deleteVacationdetails(data){
    return this.apiService.apiCall(`vacation-details/${data.id_vac_detalle}`, 'DELETEV1', data);
  }

  updateVacationdetails(data){
    return this.apiService.apiCall(`vacation-details/${data.id_vac_detalle}`, 'PUTV1', data);
  }

  updateVacationdetailsStatus(data){
    return this.apiService.apiCall(`vacation-details-status-approve-reject/${data.id_vac_detalle}`, 'PUTV1', data);
  }

  setEstadoVacacion(id: number, data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiService.apiCall(`vacation-details-status-approve-reject/${id}`, 'PUTV1', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getCatalogo(keyword: string, data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall(`catalogo/${keyword}`, "GET", data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getVacationDaysEmployees(dataOption? :object){
    let page = dataOption['page'];
    let size = dataOption['size'];
    let sort = dataOption['sort'];
    let type_sort = dataOption['type_sort'];
    let search = dataOption['search'];
    
    let id_empresa = dataOption['id_empresa'];
    let id_empleado = dataOption['id_empleado'];


    return this.apiService.apiCall(`vacations/list-generate-preview?page=${page}&size=${size}&type_sort=${type_sort}&sort=${sort}&search=${search}&id_empresa=${id_empresa}&id_empleado=${id_empleado}`, "GETV1", {});
  
  }


}
