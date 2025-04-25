import { EventEmitter,Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class SueldosService {

  constructor(private api: ApiServices) { }
  listaSueldos$ = new EventEmitter<any>();

  //getGrupoOcupacional() {
    //return this.api.apiCall('salaries/ocupacional', 'GET', {});
  //}

  getGrupoOcupacional(data: any = {}) {
    return new Promise<any[]>((resolve, reject) => {
      this.api.apiCall('salaries/ocupacional', 'GET', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }


  getCargos() {
    return new Promise<any[]>((resolve, reject) => {
      this.api.apiCall('rrhh/cargos', 'POST', {}).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
}

getTipos(cat_keyword : string) {
    return new Promise<any[]>((resolve, reject) => {
      this.api.apiCall(`catalogos/${cat_keyword}`, 'GET', {}).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
}


  getSueldos(data: any) {
    return this.api.apiCall('sueldos/getSueldos','POST', data);
  }

  saveSueldo(data){
    return this.api.apiCall('nomina/save-sueldos', 'POST', data);
  }

  updatedSueldo(data){
    return this.api.apiCall('nomina/update-sueldos', 'POST', data);
  }

  deleteSueldo(data){
    return this.api.apiCall(`sueldos/${data.id_sueldo}`, 'DELETE', data);
  }




}