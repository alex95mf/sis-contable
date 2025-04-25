import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class LturisticosService {

  constructor(private srvApi: ApiServices) { }

  obtenerCatalogos(datos) {
    return this.srvApi.apiCall("proveedores/get-catalogo", "POST", datos);
  }

  listarLTuristicos(data ){
    return this.srvApi.apiCall("lturisiticos/listar","POST", data? data:{});
  }

  crearLTuristicos(data){
    return this.srvApi.apiCall("lturisiticos/crear","POST",data);
  }

  editarLTurisiticos(data){
    return this.srvApi.apiCall("lturisiticos/editar" ,"POST",data);
  }

  eliminarLTurisiticos(id){
    return this.srvApi.apiCall("lturisiticos/eliminar/" +id,"POST",{});
  }

  getLTFil(data){
    return this.srvApi.apiCall("lturisiticos/filtro" ,"POST",data);
  }
   }


