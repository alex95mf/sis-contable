import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class RhfolderDigitalEmpleadoService {

  constructor(private apiService: ApiServices) { }

  getDocumentByEmployee(dataOption? :object){
    
    let page = dataOption['page'];
    let size = dataOption['size'];
    let sort = dataOption['sort'];
    let type_sort = dataOption['type_sort'];
    let id_empleado = dataOption['id_empleado'];
    return this.apiService.apiCall(`digital-folders/employee?id_empleado=${id_empleado}&page=${page}&size=${size}&type_sort=${type_sort}&sort=${sort}`, "GETV1", {});
  }


 

  // getAreas() {
  //   return this.apiService.apiCall('areas', 'GETV1', {});
  // }

  saveFolderDigital(data){
    return this.apiService.apiCall('digital-folders', 'POST', data);
  }

  updatedFolderDigital(data){
    return this.apiService.apiCall(`digital-folders/${data.id_doc_ficha}`, 'PUTV1', data);
  }

  deleteFolderDigital(data){
    return this.apiService.apiCall(`digital-folders/${data.id_doc_ficha}`, 'DELETEV1', data);
  }
}
