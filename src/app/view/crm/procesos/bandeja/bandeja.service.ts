import { Injectable,EventEmitter } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';


@Injectable({
  providedIn: 'root'
})
export class BandejaService {

  constructor(private api: ApiServices) { }

  tareas$ = new EventEmitter<any>();


  getTareas(data:any={})
  {
   return new Promise<any>((resolve,reject)=>{
     this.api.apiCall("pedidos/get-tareas", "POST", data).subscribe(
       (res:any)=>resolve(res.data),
       (err:any)=>reject(err)

     )

   })
  }

  guardarTarea(data) {
    return this.api.apiCall('pedidos/guardar-tarea', 'POST', data);
  }

  editarTarea(data) {
    return this.api.apiCall('pedidos/actualizar-tarea', 'POST', data);
  }

}
