import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class PuestoMercadoService {
  constructor(private api: ApiServices) { }

  getMercados()
  {
    return this.api.apiCall("proveedores/get-catalogo", "POST", {params: "'REN_MERCADO'"});
  }

  getPuestos(data: any = {})
  {
    return this.api.apiCall("mercado/get-puestos", "POST", data);
  }

  savePuesto(data)
  {
    return this.api.apiCall("mercado/save-puesto", "POST", data);
  }

  deletePuesto(data)
  {
    return this.api.apiCall("mercado/delete-puesto", "POST", data);
  }

  updatePuesto(data)
  {
    return this.api.apiCall("mercado/update-puesto", "POST", data);
  }
}
