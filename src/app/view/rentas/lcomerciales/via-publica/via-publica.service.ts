import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ViaPublicaService {

  constructor(private apivia:ApiServices) 
  
  
  { }

  Viapublicalist(data) {

    return this.apivia.apiCall("test/viapublicalist", "POST", data ? data : {});
  
  }

   
  CrearViapublica(body){
  
  return this.apivia.apiCall("test/createclientvia", "POST",body);
    
   } 

   EditarClient(body){

   return this.apivia.apiCall("test/editclientvia", "POST",body);

  } 
  
  Deleteviapublica(data){
  
   return this.apivia.apiCall("test/deleteclientvia","POST",data);
  }

  obtenerCatalogos(data) {
    return this.apivia.apiCall("proveedores/get-catalogo", "POST", data);
  }


  listarvias(data){
    return this.apivia.apiCall("test/cargaclientvia", "POST",data ? data : {});
}

}
    



