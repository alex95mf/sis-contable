import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';
import { Proyecto } from '../proyecto.model';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  constructor(private apiServices : ApiServices) { }

  getProyectos() {
    return this.apiServices.apiCall('planificacion/get-proyectos', 'GET', {});
  }
}
