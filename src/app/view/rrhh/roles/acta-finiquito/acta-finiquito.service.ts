import { Injectable, EventEmitter } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
    providedIn: 'root'
})
export class ActaFiniquitoService {
    constructor(private apiService: ApiServices) { }
    listaActas$ = new EventEmitter<any>();
    getRubrosCatalogo(data) {
        return this.apiService.apiCall('nomina/acta-finiquito/get-rubros-catalogo', 'POST', data);
    }

    setActaFiniquito(data) {
        return this.apiService.apiCall('nomina/acta-finiquito/set-acta-finiquito', 'POST', data);
    }

    getRecDocumentos(data) {
        return this.apiService.apiCall("nomina/acta-finiquito/get-acta-finiquito", "POST", data);
      }

      getTiposReporteNomina(data: any = {}) {
        return this.apiService.apiCall('nomina/roles/get-reporte-nomina', 'POST', data);
    }
    getTiposReporteContabilidad(data: any = {}) {
        return this.apiService.apiCall('contabilidad/reportes/get-reporte-modulos', 'POST', data);
    }

    getConsultaReportes(data: any) {
        return this.apiService.apiCall('nomina/roles/get-consulta-reportes', 'POST', data);
    }
    getPeriodos(data: any = {}) {
        return new Promise<Array<any>>((resolve, reject) => {
          this.apiService.apiCall('planificacion/get-periodos', 'POST', data).subscribe(
            (res: any) => resolve(res.data),
            (err: any) => reject(err)
          )
        })
    }

    getMotivosContrato(data: any = {}) {
        return this.apiService.apiCall('proveedores/get-catalogo', 'POST', data).toPromise()
    }

    getEmpleado(id:number) {
        return this.apiService.apiCall(`employees/${id}`, 'GET', {}).toPromise()
    }

    calcularValores(data: any = {}) {
        return this.apiService.apiCall('employees/calcular-valores-finiquito', 'POST', data).toPromise()
    }

   
}