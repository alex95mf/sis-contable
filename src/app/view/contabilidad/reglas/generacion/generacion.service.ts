import { Injectable , EventEmitter } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service'; 

@Injectable({
  providedIn: 'root'
})
export class GeneracionService {

  constructor(private apiService: ApiServices) { }

  codigos$ = new EventEmitter<any>();
  listaReglas$ = new EventEmitter<any>();

  getCatalogo(data) {
    return this.apiService.apiCall("proveedores/get-catalogo", "POST", data);
  }
  getCatalogoPresupuesto(data){
    return this.apiService.apiCall('gestion-bienes/catalogo-presupuesto', 'POST',data);
  }
  getConCuentas(data){
    return this.apiService.apiCall('gestion-bienes/cuentas', 'POST',data);
  }
  setRegla(data){
    return this.apiService.apiCall('contabilidad/reglas/set-reglas', 'POST',data);
  }

  getReglas(data){
    return this.apiService.apiCall('contabilidad/reglas/get-reglas', 'POST',data);
  }

  updateRegla(data){
    return this.apiService.apiCall('contabilidad/reglas/update-reglas', 'POST',data);
  }

  consultaReporte(data){
    return this.apiService.apiCall('contabilidad/reglas/consulta-reporte', 'POST',data);
  }


 
}
