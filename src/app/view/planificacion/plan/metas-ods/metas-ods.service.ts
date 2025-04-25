import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class MetasOdsService {

  constructor(private apiServices : ApiServices) { }

  getProgramas()
  {
    return this.apiServices.apiCall('planificacion/get-programas', 'POST', {});
  }

  getODS()
  {
    return this.apiServices.apiCall('planificacion/get-ods', 'POST', {});
  }

  getMetasODS(data)
  {
    return this.apiServices.apiCall('planificacion/get-metasods', 'POST', data);
  }

  getEje(data)
  {
    return this.apiServices.apiCall('planificacion/get-eje', 'POST', data);
  }

  getOPG(data)
  {
    return this.apiServices.apiCall('planificacion/get-opg', 'POST', data);
  }

  getPoliticas(data)
  {
    return this.apiServices.apiCall('planificacion/get-politicas', 'POST', data);
  }

  getMetaZona(data)
  {
    return this.apiServices.apiCall('planificacion/get-metazona', 'POST', data);
  }

  getCompetencias()
  {
    return this.apiServices.apiCall('planificacion/get-competencias', 'POST', {});
  }

  getCatalogs(data) 
  {
    return this.apiServices.apiCall("proveedores/get-catalogo", "POST", data);
  }

  guardaMetas(data) {
    return this.apiServices.apiCall('planificacion/guarda-metas', 'POST', data);
  }

  obtenerMetas(data) {
    return this.apiServices.apiCall('planificacion/obtener-metas', 'POST', data);
  }

  saveGoal(data)
  {
    return this.apiServices.apiCall("planificacion/set-goal", 'POST', data);
  }

  getGoals(data)
  {
    return this.apiServices.apiCall('planificacion/get-goal', 'POST', data);
  }

  updateGoals(data)
  {
    return this.apiServices.apiCall('planificacion/update-goal', 'POST', data);
  }

  eliminaMeta(data)
  {
    return this.apiServices.apiCall('planificacion/elimina-meta', 'POST', data);
  }
}
