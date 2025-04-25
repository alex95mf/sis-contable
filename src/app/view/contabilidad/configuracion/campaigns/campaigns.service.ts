import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CampaignsService {

  updateCampaigns$ = new EventEmitter();

  constructor(
    private apiServices: ApiServices,
  ) { }

  getConceptos(data: any = {}) {
    return new Promise<any[]>((resolve, reject) => {
      this.apiServices.apiCall('concepto/get-conceptos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getCampaigns(data: any = {}) {
    return new Promise<any[]>((resolve, reject) => {
      this.apiServices.apiCall('campaign/index', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getCampaign(id: number, data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiServices.apiCall(`campaign/show/${id}`, 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  setCampaign(data: any = {}) {
    return new Promise<any[]>((resolve, reject) => {
      this.apiServices.apiCall('campaign/store', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  putCampaign(id: number, data: any = {}) {
    return new Promise<any[]>((resolve, reject) => {
      this.apiServices.apiCall(`campaign/update/${id}`, 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
}
