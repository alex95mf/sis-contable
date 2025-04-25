import { Injectable } from '@angular/core';
import { ApiServices } from "../../../../services/api.service";

@Injectable({
  providedIn: 'root'
})
export class CategoriasEspPublicitariosService {

  constructor(private srvApi: ApiServices) { }

  obtenerCategoriasEspPublicitarios(datos) {
    return this.srvApi.apiCall("categorias-esp-publicitarios/obtener-categorias-esp-publicitarios", "POST", datos ? datos : {});
  }

  guardarCategoriasEspPublicitarios(datos) {
    return this.srvApi.apiCall("categorias-esp-publicitarios/guardar-categorias-esp-publicitarios", "POST", datos ? datos : {});
  }

  actualizarCategoriasEspPublicitarios(datos, id) {
    return this.srvApi.apiCall("categorias-esp-publicitarios/actualizar-categorias-esp-publicitarios/" + id, "POST", datos ? datos : {});
  }

 borrarCategoriasEspPublicitarios(id) {
    return this.srvApi.apiCall("categorias-esp-publicitarios/borrar-categorias-esp-publicitarios/" + id, "POST", {});
  }

  obtenerCatalogos(datos) {
    return this.srvApi.apiCall("proveedores/get-catalogo", "POST", datos);
  }
}
