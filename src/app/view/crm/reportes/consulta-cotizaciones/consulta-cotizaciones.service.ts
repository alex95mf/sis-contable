import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ConsultaCotizacionesService {

  constructor(private api: ApiServices) { }

  getCotizaciones(data:any={})
  {
   return new Promise<any>((resolve,reject)=>{
     this.api.apiCall("pedidos/get-cotizaciones", "POST", data).subscribe(
       (res:any)=>resolve(res.data),
       (err:any)=>reject(err)

     )

   })
  }
}
