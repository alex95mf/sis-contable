import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class BugsServiceService {

  actualizarFormulario$=new EventEmitter<void>();

  constructor(private apiService: ApiServices) {


   }

   cargaCatalogo(data:any={})
   {
      return new Promise((resolve,reject)=>{
        this.apiService.apiCall("proveedores/get-catalogo", "POST", data).subscribe(
          (res:any)=>resolve(res.data),
          (err:any)=>reject(err)

        )

      })
   }
   obtenerBugs(data:any={})
   {
    return new Promise<any>((resolve,reject)=>{
      this.apiService.apiCall("bugs/listarfilter", "POST", data).subscribe(
        (res:any)=>resolve(res.data),
        (err:any)=>reject(err)

      )

    })
   }

   obtenerBugsHistory(id: number,data:any={})
   {
    return new Promise<any>((resolve,reject)=>{
      this.apiService.apiCall(`bugshistory/listarPorBug/${id}`, "POST", data).subscribe(
        (res:any)=>resolve(res.data),
        (err:any)=>reject(err)

      )

    })
   }

  guardarBug(data: any = {}) {
    console.log(data);
    //return "ok"

    return new Promise((resolve, reject) => {
      this.apiService.apiCall("bugs/store", "POST", data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)

      )

    })
  }
  modificarBug(id: number, data: any = {}) {
    console.log(data);
    
    return new Promise((resolve, reject) => {
      this.apiService.apiCall(`bugs/update/${id}`, "POST", data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)

      )

    })


  }

  guardarBugHistory(data: any = {}) {
    console.log(data);
    //return "ok"

    return new Promise((resolve, reject) => {
      this.apiService.apiCall("bugshistory/store", "POST", data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)

      )

    })
  }
}
