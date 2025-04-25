import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TareasService {

  constructor(private api: ApiServices) { }

  getMetasTareas(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.api.apiCall('planificacion/get-metas-tareas', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getPeriodos(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.api.apiCall('planificacion/get-periodos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
}
