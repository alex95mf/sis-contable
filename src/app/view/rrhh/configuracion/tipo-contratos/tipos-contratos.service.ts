import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TiposContratosService {

  constructor(private apiService: ApiServices) { }



  getCatalogoTipoContrato( cat_keyword : string){
    return this.apiService.apiCall(`catalogos/${cat_keyword}`, 'GETV1', {});
  }
  getEmpleadosPaginate(dataOption? :object){

    let page = dataOption['page'];
    let size = dataOption['size'];
    let sort = dataOption['sort'];
    let type_sort = dataOption['type_sort'];
    let search = dataOption['search'];
    let relation = dataOption['relation'];
    let relation_selected = dataOption['relation_selected'];

    return this.apiService.apiCall(`employees/listC?page=${page}&size=${size}&type_sort=${type_sort}&sort=${sort}&search=${search}&relation=${relation}&relation_selected=${relation_selected}`, "GET", {});
  }

  getTypeContracTimer(dataOption? :object){
    let page = dataOption['page'];
    let size = dataOption['size'];
    let sort = dataOption['sort'];
    let type_sort = dataOption['type_sort'];
    let search = dataOption['search'];
    let cat_keyword = dataOption['cat_keyword'];
    let relation_selected = dataOption['relation_selected'];

    return this.apiService.apiCall(`list-paginate/catalogo?page=${page}&size=${size}&type_sort=${type_sort}&sort=${sort}&search=${search}&cat_keyword=${cat_keyword}&relation_selected=${relation_selected}`, "GETV1", {});
  
  }

  
  updateCatalogDetailWorkTime(data){
    return this.apiService.apiCall(`catalogo-detail/${data.id_cat_detalle}`, 'PUTV1', data);
  }

  createOrUpdateCatalogDetailWorkTime(data){
    return this.apiService.apiCall(`catalogo-detail/update-create`, 'POST', data);
  }


  getTypeContracConfiguration(dataOption? :object){
    let page = dataOption['page'];
    let size = dataOption['size'];
    let sort = dataOption['sort'];
    let type_sort = dataOption['type_sort'];
    let search = dataOption['search'];
    

    return this.apiService.apiCall(`tiempo-contrato-correo?page=${page}&size=${size}&type_sort=${type_sort}&sort=${sort}&search=${search}`, "GETV1", {});
  
  }

  createOrUpdateTiempoContratoCorreo(data){
    return this.apiService.apiCall(`tiempo-contrato-correo`, 'POST', data);
  }


  testEmailSend(data){
    return this.apiService.apiCall(`send-test-email`, 'POST', data);
  }


  getSmtpEmail(dataOption? :object){
    let page = dataOption['page'];
    let size = dataOption['size'];
    let sort = dataOption['sort'];
    let type_sort = dataOption['type_sort'];
    let search = dataOption['search'];
    

    return this.apiService.apiCall(`smtp-email?page=${page}&size=${size}&type_sort=${type_sort}&sort=${sort}&search=${search}`, "GETV1", {});
  
  }

  createOrUpdateSmtpEmail(data){
    return this.apiService.apiCall(`smtp-email`, 'POST', data);
  }


  emailNotificationListEmp(data){
    return this.apiService.apiCall(`email-notificaction-emp-list`, 'POST', data);
  }

  sendEmailServer(data){
    return this.apiService.apiCall(`send-email-notificaction`, 'POST', data);
  }

  saveTipoContrato(data){
    return this.apiService.apiCall(`rrhh/catalogo/save-contrato`, 'POST', data);
  }

  
}
