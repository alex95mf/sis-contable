import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteServiceService {

  constructor(private api: ApiServices) { }
  clientes$ = new EventEmitter<any>();
  
  getClientes(data:any={})
  {
   return new Promise<any>((resolve,reject)=>{
     this.api.apiCall("pedidos/get-clientes", "POST", data).subscribe(
       (res:any)=>resolve(res.data),
       (err:any)=>reject(err)

     )

   })
  }

  saveCertificado(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.api.apiCall('pedidos/actualizar-documento', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }


 deleteCertificado(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.api.apiCall('pedidos/delete-documento', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
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


  getCliente(id:number,data:any={})
  {
   return new Promise<any>((resolve,reject)=>{
     this.api.apiCall(`pedidos/consultar-cliente/${id}`, "POST", data).subscribe(
       (res:any)=>resolve(res.data),
       (err:any)=>reject(err)

     )

   })
  }

  
  guardarCliente(data) {
    return this.api.apiCall('pedidos/guardar-cliente', 'POST', data);
  }

  editarCliente(data) {
    return this.api.apiCall('pedidos/actualizar-cliente', 'POST', data);
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

  getUsuarios(data:any={})
  {
     return new Promise((resolve,reject)=>{
       this.api.apiCall("pedidos/get-usuarios", "POST", data).subscribe(
         (res:any)=>resolve(res.data),
         (err:any)=>reject(err)

       )

     })
  }

  getProvincias(data:any={})
  {
     return new Promise((resolve,reject)=>{
       this.api.apiCall("pedidos/get-catalogos", "POST", data).subscribe(
         (res:any)=>resolve(res.data),
         (err:any)=>reject(err)

       )

     })
  }
  
}
