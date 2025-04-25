import { Injectable,EventEmitter } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProyectosService {


  constructor(private api: ApiServices) { }
 proyectos$ = new EventEmitter<any>();
 
  getPeriodos(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.api.apiCall('planificacion/get-periodos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
  getProgramas(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.api.apiCall('planificacion/get-programas', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getProyectos(data:any={})
  {
   return new Promise<any>((resolve,reject)=>{
     this.api.apiCall("planificacion/get-proyectos-planificacion", "POST", data).subscribe(
       (res:any)=>resolve(res.data),
       (err:any)=>reject(err)

     )

   })
  }
  guardarProyecto(data) {
    return this.api.apiCall('planificacion/guardar-proyecto', 'POST', data);
  }

  editarProyecto(data) {
    return this.api.apiCall('planificacion/editar-proyecto', 'POST', data);
  }
}
