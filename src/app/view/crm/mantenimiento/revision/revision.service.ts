
import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class RevisionService {

  constructor(private api: ApiServices) { }
  revision$ = new EventEmitter<any>();
  getProductos(data:any={})
  {
   return new Promise<any>((resolve,reject)=>{
     this.api.apiCall("pedidos/get-productos", "POST", data).subscribe(
       (res:any)=>resolve(res.data),
       (err:any)=>reject(err)

     )

   })
  }

  getProductosconFoto(data:any={})
  {
   return new Promise<any>((resolve,reject)=>{
     this.api.apiCall("pedidos/get-productos-fotos", "POST", data).subscribe(
       (res:any)=>resolve(res.data),
       (err:any)=>reject(err)

     )

   })
  }

  getProducto(id:number,data:any={})
  {
   return new Promise<any>((resolve,reject)=>{
     this.api.apiCall(`pedidos/consultar-producto/${id}`, "POST", data).subscribe(
       (res:any)=>resolve(res.data),
       (err:any)=>reject(err)

     )

   })
  }

  guardarProducto(data) {
    return this.api.apiCall('pedidos/guardar-producto', 'POST', data);
  }

  editarProducto(data) {
    return this.api.apiCall('pedidos/actualizar-producto', 'POST', data);
  }
}
