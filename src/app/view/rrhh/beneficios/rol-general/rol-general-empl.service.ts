import { Injectable,EventEmitter } from '@angular/core';

import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class RolGeneralEmplService {


  constructor(private apiService: ApiServices) { }

  cuentasContables$ = new EventEmitter<any>();

  listaRoles$ = new EventEmitter<any>();

  GenerarNominaRolGeneral(data) {
    return this.apiService.apiCall('nomina/reporte-rolmensual/reporte-rubros', 'POST', data);
  }




  GenerarNominaRolGeneralMensual(data) {
    return this.apiService.apiCall('nomina/rolgeneral/generarRolMensual', 'POST', data);
  }

  GenerarNominaRolGeneralQuincenal(data) {
    return this.apiService.apiCall('nomina/rolgeneral/generarRolQuincenal', 'POST', data);
  }
  eliminarRolGeneral(data) {
    return this.apiService.apiCall('nomina/rolgeneral/eliminarRolGeneral', 'POST', data);
  }



  //public function GeneralRolQuincenal(Request $request)

  getDiasTrabajadosPeriodo(data) {
    return this.apiService.apiCall('nomina/rolgeneral/getDiasTrabajadosPeriodo', 'POST', data);
  }

  getTipoContratos(data) {
    return this.apiService.apiCall('nomina/rolgeneral/getTipoContratos', 'POST', data);
  }

  generarOrdenesPago(data: any) {
    return this.apiService.apiCall('nomina/rolgeneral/generarOrdenesPago','POST', data);
  }

  anularOrdenesPago(data: any) {
    return this.apiService.apiCall('nomina/rolgeneral/anularOrdenesPago','POST', data);
  }


  getConCuentas(data){
    return this.apiService.apiCall('gestion-bienes/cuentas', 'POST',data);
  }

  getCatalogoPresupuesto(data){
    return this.apiService.apiCall('gestion-bienes/catalogo-presupuesto', 'POST',data);
  }

  public getPrograma(data){
    return this.apiService.apiCall("rrhh/configuracion/programa", "POST", data);
  }
  getAreas(data){
    return this.apiService.apiCall('rrhh/rolGeneral-getAreasFilterPrograma', 'POST',data);
  }

  getDepartamentos(data){
    return this.apiService.apiCall('rrhh/rolGeneral-getdepFilterArea', 'POST',data);
  }

  getRubros(data){
    return this.apiService.apiCall('rrhh/rolGeneral-getRubros', 'POST',data);
  }

  aprobarRol(data: any) {
    return this.apiService.apiCall('nomina/rolgeneral/aprobarRolEmpleado','POST', data);
  }
  consultaNumControl(data) {
    return this.apiService.apiCall('nomina/reporte-rolmensual/reporte-rubros-num-control', 'POST', data);
  }

  getConCuentasTipoPago(data){
    return this.apiService.apiCall('gestion-bienes/cuentas-tipo-pago', 'POST',data);
  }

  getUltimoNumero(data: any = {}) {
    return this.apiService.apiCall('nomina/ultimo-numero-control', 'POST', data) as any
  }

  getNumeroControl(data: any) {
    return this.apiService.apiCall('nomina/numero-control', 'POST', data) as any
  }

  getPeriodos(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall('planificacion/get-periodos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }



















}
