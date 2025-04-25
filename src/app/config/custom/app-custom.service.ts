import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CustonService {

  constructor(private apiService: ApiServices) { }


  getProveedores(data) {
    return this.apiService.apiCall('proveedores/get-proveedor-pagin', 'POST', data);
  }

  ComprasRegistradas(data) {
    return this.apiService.apiCall('proveeduria/obtner-compras-registradas', 'POST', data);
  }


  ObtenerProductosPagin(data) {
    return this.apiService.apiCall('proveeduria/get-productos-pagin', 'POST', data);
  }

  ObtenerProductosPaginTotal(data) {
    return this.apiService.apiCall('proveeduria/get-productos-pagin-total', 'POST', data);
  }

  obtenePlanCuentaGeneralTotal(data) {
    return this.apiService.apiCall('plandecuentas/obtener-plancuenta-total', 'POST', data);
  }

  obtenePlanCuentaGeneral(data) {
    return this.apiService.apiCall('plandecuentas/obtener-plancuenta-general', 'POST', data);
  }

  obtenerCuentasAuxiliar(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall('auxiliares/list', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
      // setTimeout(() => resolve(data), 1250)
    })
  }

  obteneCatalogoPresupuestoGeneralTotal(data) {
    return this.apiService.apiCall('catalogo-presupuesto/obtener-catpresupuesto-total', 'POST', data);
  }

  obteneCatalogoPresupuestoGeneral(data) {
    return this.apiService.apiCall('catalogo-presupuesto/obtener-catpresupuesto-general', 'POST', data);
  }

  obteneDetalleImpuestoRetencion(data) {
    return this.apiService.apiCall('proveeduria/get-impuestos-compras', 'POST', data);
  }

  obteneProveedorIdentificacion(data) {
    return this.apiService.apiCall('proveedores/obtene-provee-identificacion', 'POST', data);
  }

  obtenerComprasPorCodigo(data) {
    return this.apiService.apiCall('proveeduria/obtener-compras-por-codigo', 'POST', data);
  }

  getPostitionsByDepartment( id_departamento? : number){
    return this.apiService.apiCall(`positions?id_departamento=${id_departamento}`, 'GETV1', {});
  }


}