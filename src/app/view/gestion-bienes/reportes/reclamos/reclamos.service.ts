import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ReclamosService {

  constructor(
    private apiServices: ApiServices,
  ) { }

  getReportes(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiServices.apiCall('productos/get-reclamos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
}
