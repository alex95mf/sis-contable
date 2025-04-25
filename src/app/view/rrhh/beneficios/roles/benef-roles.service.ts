import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class BenefRolesService {

  constructor(private apiService: ApiServices) { }


  getRolesIndividuales(id_empresa :number, anio :number, mes :number, id_depart :number, id_tipo_nomina :number  ) {//debugger
    return this.apiService.apiCall(`nomina/rolindividual/envio/${id_empresa}/${anio}/${mes}/${id_depart}/${id_tipo_nomina}`, 'GETV1',  {});
  }

  getDepartamentosPaginate(dataOption? :object){

    let page = dataOption['page'];
    let size = dataOption['size'];
    let sort = dataOption['sort'];
    let type_sort = dataOption['type_sort'];
    let search = dataOption['search'];

    return this.apiService.apiCall(`deparments?page=${page}&size=${size}&type_sort=${type_sort}&sort=${sort}&search=${search}`, "GETV1", {});
  }

  sendEmailRolesPagos(data){
    return this.apiService.apiCall(`send-email/roles-pagos`, 'POST', data);
  }

}
