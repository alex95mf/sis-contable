import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ModalSupervivenciaService {

  constructor(private api: ApiServices) { }

  crearCSupervivencia(data){
    return this.api.apiCall("contribuyente/crear-supervivencia","POST",data);
  }
  
  updateContribuyente(data){
    return this.api.apiCall("contribuyente/editar-supervivencia","POST",data);
  }
}
