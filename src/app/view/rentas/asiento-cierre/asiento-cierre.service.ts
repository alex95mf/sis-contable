import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AsientoCierreService {
  cuentaSelected$ = new EventEmitter<any>();
  cuentaEmiSelected$ = new EventEmitter<any>();
  cuentasContablesSelected$ = new EventEmitter<any>();

  constructor(private api: ApiServices) { }

  consultarCierre(data: any = {}) {
    return this.api.apiCall('rentas/getCierre', 'POST', data);
  }
  guardarAsientoCierre(data) {
    return this.api.apiCall("rentas/crearCierre", "POST", data);
  }
  getCierres(data: any = {}) {
    return this.api.apiCall('rentas/getCierresTodos', 'POST', data);
  }
  consultarAsientos(data: any = {}) {
    return this.api.apiCall('liquidacion/get-asientos', 'POST', data);
  }
  getConceptos(data: any = {}) {
    return this.api.apiCall('concepto/get-conceptos', 'POST', data)
  }

  geNumControl(data: any) {
    return this.api.apiCall('rentas/get-numero-control', 'POST', data)
  }

  eliminarAsiento(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.api.apiCall(`rentas/deleteCierre/${data.id}`, 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getConCuentas(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.api.apiCall('gestion-bienes/cuentas', 'POST',data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  consultarCuentaTipoRegla(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.api.apiCall(`gestion-bienes/cuentas?paginate=1&perPage=${data.params.paginate.pageSize}&page=${data.params.paginate.page}&tipo=${data.tipo}&regla=${data.regla}&q=${data.params.filter.codigo ?? data.params.filter.nombre ?? ''}`, 'GET',data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  // getCatalogos(data: any) {
  //   return this.api.apiCall("proveedores/get-catalogo", "POST", data);
  // }
  // getTipoContratos(data) {
  //   return this.api.apiCall('nomina/rolgeneral/getTipoContratos', 'POST', data);
  // }

  getCatalogos(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.api.apiCall('proveedores/get-catalogo', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
  getTipoContratos(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.api.apiCall('nomina/rolgeneral/getTipoContratos', 'POST', data).subscribe(
        (res: any) => resolve(res),
        (err: any) => reject(err)
      )
    })
  }
  consultaNumControl(data) {
    return this.api.apiCall('nomina/reporte-rolmensual/reporte-rubros-num-control', 'POST', data);
  }

  generarOrdenesPago(data: any) {
    return this.api.apiCall('nomina/rolgeneral/generarOrdenesPago','POST', data);
  }

  getConCuentasTipoPago(data){
    return this.api.apiCall('gestion-bienes/cuentas-tipo-pago', 'POST',data);
  }
  getConCuentasRol(data){
    return this.api.apiCall('gestion-bienes/cuentas', 'POST',data);
  }
  listarCuentasBancos(data) {
    return this.api.apiCall('pagos/getBancos', 'POST', data);
  }
  
  getRubrosPagoTerceros(data: any = {}) {
    return this.api.apiCall('rrhh/rubros/rubros-pago-terceros', 'POST', data);
  }
  
}
