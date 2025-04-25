import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class InspectoresService {

  constructor(
    private apiServices: ApiServices,
  ) { }

  getInspectores(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiServices.apiCall('inspectores/get-inspectores', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getEmpleados(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiServices.apiCall('inspectores/get-empleados', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getAreas(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiServices.apiCall('inspectores/get-areas', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getDepartamentos(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiServices.apiCall('inspectores/get-departamentos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  setInspector(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiServices.apiCall('inspectores/set-inspector', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  deleteInspector(id: number, data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiServices.apiCall(`inspectores/delete-inspector/${id}`, 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
}
