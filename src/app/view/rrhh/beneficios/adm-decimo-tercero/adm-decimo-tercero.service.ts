import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
    providedIn: 'root'
})
export class AdmDecimoTerceroService {
    constructor(private apiService: ApiServices) { }


    getDepartamentosPaginate(dataOption? :object){

        let page = dataOption['page'];
        let size = dataOption['size'];
        let sort = dataOption['sort'];
        let type_sort = dataOption['type_sort'];
        let search = dataOption['search'];
    
        return this.apiService.apiCall(`deparments?page=${page}&size=${size}&type_sort=${type_sort}&sort=${sort}&search=${search}`, "GETV1", {});
      }

    getDecimoTercero(id_empresa :number, anio :number, mes :number, fechaDesde :string, fechaHasta :string,id_programa :number,id_area :number, id_departament :number , decimoAcumula: number) {
        return this.apiService.apiCall(`nomina/decimotercero/getDecimo/${id_empresa}/${anio}/${mes}/${fechaDesde}/${fechaHasta}/${id_programa}/${id_area}/${id_departament}/${decimoAcumula}`, 'GETV1',  {});
    }
    getLatest(data) {
        return this.apiService.apiCall(`nomina/ultimo-numero-control-decimo`, 'POST',  data);
    }
    getNumControl(data) {
        return this.apiService.apiCall(`nomina/getnumcontrol`, 'POST',  data);
    }

    getDecimoTerceroPorFecha(id_empresa :number, anio :number, mes :number, fechaDesde :string, fechaHasta :string,id_programa :number,id_area :number, id_departament :number , decimoAcumula: number) {
        return this.apiService.apiCall(`nomina/decimotercero/getDecimoPorFecha/${id_empresa}/${anio}/${mes}/${fechaDesde}/${fechaHasta}/${id_programa}/${id_area}/${id_departament}/${decimoAcumula}`, 'GETV1',  {});
    }

    procesarDecimoTercero(id_empresa :number, anio :number, mes :number, fechaDesde :string, fechaHasta :string,id_programa :number,id_area :number, id_departament :number , decimoAcumula: number, id_usuario: number) {
        return this.apiService.apiCall(`nomina/decimotercero/procesarDecimo/${id_empresa}/${anio}/${mes}/${fechaDesde}/${fechaHasta}/${id_programa}/${id_area}/${id_departament}/${decimoAcumula}/${id_usuario}`, 'GETV1',  {});
    }

    guardarNomRol(data) {
        return this.apiService.apiCall('administracion/documento/guardarNomRol', 'POST', data);
    }
 
    getNomRolCab(data: any) {
        return this.apiService.apiCall('administracion/show-rolHead', 'POST', data);
    }

    getNomRolDet(data) {
        return this.apiService.apiCall('administracion/show-rolDetalle', 'POST', data);
    }

    getDatosEmpleados(data) {
        return this.apiService.apiCall('administracion/datosEmpleados', 'POST', data);
    }

    getSecuencia(data) {
        return this.apiService.apiCall('importacion/get-secuencia', 'POST', data);
    }

    getAccountsByDetails(data) {
        return this.apiService.apiCall('diario/accounts/get-details-banks', 'POST', data);
    }

    getPersonalInfo(data) {
        return this.apiService.apiCall('administracionRol/personalSearch', 'POST', data);
    }

    getSucursales() {
        return this.apiService.apiCall('administracion/get-sucursal', 'POST', {});
    }

    getConceptoInfo(data) {
        return this.apiService.apiCall('administracion/showParametrosTipoClase', 'POST', data);
    }

    deleteRolPago(data) {
        return this.apiService.apiCall('administracion/delete-rolPago', 'POST', data);
    }

    aprobarRolPago(data) {
        return this.apiService.apiCall('administracion/aprobarRolPago', 'POST', data);
    }
    getPeriodos(data: any = {}) {
        return new Promise<Array<any>>((resolve, reject) => {
          this.apiService.apiCall('planificacion/get-periodos', 'POST', data).subscribe(
            (res: any) => resolve(res.data),
            (err: any) => reject(err)
          )
        })
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

    aprobarDecimoTercero(data: any) {
        return this.apiService.apiCall('nomina/decimos/aprobarDecimos','POST', data);
    }
    generarOrdenesPago(data: any) {
        return this.apiService.apiCall('nomina/decimos/generarOrdenesPago','POST', data);
    }

    consultaNumControl(data) {
        return this.apiService.apiCall('nomina/decimos/get-num-control', 'POST', data);
    }
}