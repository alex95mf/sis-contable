import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class JornadaService {

  constructor(private apiService: ApiServices) { }


  
  getJornadas(data: any = {}) {
    return this.apiService.apiCall('jornada/getJornada', 'POST', data);
  } 

  guardarJornadas(data: any) {
    return this.apiService.apiCall('jornada/saveJornada', 'POST', data);
  } 

  updateJornada(data: any) {
    return this.apiService.apiCall('jornada/updateJornada', 'POST', data);
  } 
  //getCatalogoKeyWork( cat_keyword : string){
    // /EST
    //return this.apiService.apiCall(`catalogos/${cat_keyword}`, 'GET', {});
  //}

  getTiposTiempoAlmuerzo(data: any = {}) {
    return this.apiService.apiCall('jornada/get-tiempoAlmuerzo', 'POST', data);
  }
  
  getTiposEstado(data: any = {}) {
    return this.apiService.apiCall('jornada/get-tipoEstado', 'POST', data);
  }

  getAlmuerza(data: any = {}) {
    return this.apiService.apiCall('jornada/get-tipoAlmuerza', 'POST', data);
  }



}
