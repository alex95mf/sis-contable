import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoServiceService {

  constructor(private api: ApiServices) { }
  productos$ = new EventEmitter<any>();
  
  getProductos(data:any={})
  {
   return new Promise<any>((resolve,reject)=>{
     this.api.apiCall("pedidos/get-productos", "POST", data).subscribe(
       (res:any)=>resolve(res.data),
       (err:any)=>reject(err)

     )

   })
  }


  getGrupoProductos(data:any={})
  {
   return new Promise<any>((resolve,reject)=>{
     this.api.apiCall("pedidos/get-grupo-productos", "POST", data).subscribe(
       (res:any)=>resolve(res.data),
       (err:any)=>reject(err)

     )

   })
  }

  getBodegas(data:any={})
  {
   return new Promise<any>((resolve,reject)=>{
     this.api.apiCall("pedidos/get-bodegas", "POST", data).subscribe(
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
     this.api.apiCall(`pedidos/consultar-producto-foto/${id}`, "POST", data).subscribe(
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

  getCatalogos(data:any={})
  {
     return new Promise((resolve,reject)=>{
       this.api.apiCall("proveedores/get-catalogo", "POST", data).subscribe(
         (res:any)=>resolve(res.data),
         (err:any)=>reject(err)

       )

     })
  }
  
}
