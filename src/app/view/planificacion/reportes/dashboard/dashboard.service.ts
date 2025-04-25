import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private api : ApiServices) { }

  getDashboard(data)
  {
    return this.api.apiCall('planificacion/get-reporte-dashboard', 'POST', data)
  }


  getPeriodos(data: any = {}) {
    return new Promise<any[]>((resolve, reject) => {
      this.api.apiCall('planificacion/get-periodos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getProgramas()
  {
    return this.api.apiCall('planificacion/get-programas', 'POST', {});
  }

  getDepartamentos(data)
  {
    return this.api.apiCall('planificacion/get-departamentos-programa', 'POST', data);
  }

  /*getPresupuestoPrograma(data) {
    return this.api.apiCall('planificacion/get-presupuesto-programa', 'POST', data);
  }*/

  /*getPresupuestoDepartamento(data) {
    return this.api.apiCall('planificacion/get-presupuesto-departamento', 'POST', data);
  }*/

  /*getProgramas()
  {
    return this.api.apiCall('planificacion/get-programas', 'POST', {})
  }

  getDepartamentos(data)
  {
    return this.api.apiCall('planificacion/get-departamentos-programa', 'POST', data)
  }

  getMision(data)
  {
    return this.api.apiCall('planificacion/get-mision-departamento', 'POST', data)
  }

  getCatalogs(data) 
  {
    return this.api.apiCall("proveedores/get-catalogo", "POST", data);
  }

  getAtribuciones(data)
  {
    return this.api.apiCall('planificacion/get-attrs-dept', 'POST', data)
  }

  getObjetivosComponentes(data)
  {
    return this.api.apiCall('planificacion/obtener-meta-programa', 'POST', data)
  }

  getFuentesFin(data)
  {
    return this.api.apiCall('planificacion/get-fuentes-fin', 'POST', data)
  }*/
}
