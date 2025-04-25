import { Injectable } from '@angular/core';

import { ApiServices } from 'src/app/services/api.service';
@Injectable({
  providedIn: 'root'
})
export class GradoOcupacionalService {

  constructor(private api:ApiServices) { }

  getGrupoOcupacional(data: any = {}) {
    return new Promise<any[]>((resolve, reject) => {
      this.api.apiCall('salaries/ocupacional', 'GET', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }


  getGrupoOcupacionalByFilter(data: any) {
    return this.api.apiCall('salaries/ocupacionalfilter','POST', data);
  }
  saveSueldo(data){
    return this.api.apiCall('salaries/saveNewGroup', 'POST', data);
  }
  updateSueldo(data){
    return this.api.apiCall('salaries/updateGroup', 'POST', data);
  }
/* 
  getSueldosPaginate(dataOption? :object){

    let page = dataOption['page'];
    let size = dataOption['size'];
    let sort = dataOption['sort'];
    let type_sort = dataOption['type_sort'];
    let search = dataOption['search'];
    let cargo = dataOption['cargo']

    return this.api.apiCall(`salaries/ocupacionalfilter?page=${page}&size=${size}&type_sort=${type_sort}&sort=${sort}&search=${search}&cargo=${cargo}`, "GET", {});
  } */





}
