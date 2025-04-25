import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TablaCuantiaService {

  constructor(private srvApi: ApiServices) { }

  obtenerCuantiasData(datos) {
    return this.srvApi.apiCall("aranceles/get-rangos", "POST", datos);
  }

  obtenerCuantiaId(id) {
    return this.srvApi.apiCall("aranceles/get-rango/" + id, "POST", {});
  }

  crearCuantia(datos) {
    return this.srvApi.apiCall("aranceles/set-rangos", "POST", datos);
  }

  actualizarCuantia(id, datos) {
    return this.srvApi.apiCall("aranceles/actualizar-rango/" + id, "POST", datos);
  }

  eliminarCuantia(id) {
    return this.srvApi.apiCall("aranceles/eliminar-rango/" + id, "POST", {});
  }

  getPeriodos(data: any = {}) {
    return new Promise<any[]>((resolve, reject) => {
      this.srvApi.apiCall('planificacion/get-periodos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
}
