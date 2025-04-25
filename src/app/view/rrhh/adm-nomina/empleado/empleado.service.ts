import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
    providedIn: 'root'
})
export class EmpleadoService {
    constructor(private apiService: ApiServices) { }

    setFamiliar$ = new EventEmitter<any>();
    updateFamiliar$ = new EventEmitter<any>();
    updateTipoArchivo$ = new EventEmitter<void>();
    setRetencionJudicial$ = new EventEmitter<any>();

    presentaTablaEmpleado() {
        return this.apiService.apiCall('administracion/get-table-empresa', 'POST', {});
    }

    getDatosIniciales() {
        return this.apiService.apiCall('administracion/documento/getDatosIniciales', 'POST', {});
    }

    getEmailExist(data) {
        return this.apiService.apiCall('administracion/validate-email', 'POST', data);
    }


    getCargos(data) {
        return this.apiService.apiCall('ficha/cargos', 'POST', data);
    }

    // getCargosAsync(data) {
    //     return new Promise((resolve, reject) => {
    //       this.apiService.apiCall('ficha/cargo', 'POST', data).subscribe(
    //         (res: any) => resolve(res),
    //         (err: any) => reject(err)
    //       )
    //     }) 
    //     // return this.apiService.apiCall('retencion_fuente/mantenmiento', 'GET', {});
    //   }

    cedulaExist(data) {
        return this.apiService.apiCall('administracion/validate-cedula', 'POST', data);
    }

    setempresa(data) {
        return this.apiService.apiCall('administracion/save-new-employed', 'POST', data);
    }

    updateEmpleado(data) {
        return this.apiService.apiCall('administracion/upgrade-personal', 'POST', data);
    }

    deleteEmpleado(data) {
        return this.apiService.apiCall('administracion/destroy-personal', 'POST', data);
    }

    saveFichaEmpleado(data){
        return this.apiService.apiCall('employees', 'POST', data);
    }


    updatedServiceFichaEmpleado(data){
        return this.apiService.apiCall(`employees/${data.id_empleado}`, 'PUT', data);
    }


    getCargaFamiliares(dataOption? :object){
        let id_empleado = dataOption['id_empleado'];
        return this.apiService.apiCall(`empleado/cargas-familiares?id_empleado=${id_empleado}`, "GET", {});
    }

    getPhotoByEmploye(dataOption? :object){
        let id_empleado = dataOption['id_empleado'];
        return this.apiService.apiCall(`photo-employees?id_empleado=${id_empleado}`, "GET", {});
    }


    getEducacionByEmpleado(dataOption? :object){
        let id_empleado = dataOption['id_empleado'];
        return this.apiService.apiCall(`education-employees?id_empleado=${id_empleado}`, "GET", {});
    }
    getCargasFamByEmpleado(dataOption? :object){
        let id_empleado = dataOption['id_empleado'];
        return this.apiService.apiCall(`cargas-employees?id_empleado=${id_empleado}`, "GET", {});
    }


    getReferenciaByEmpleado(dataOption? :object){
        let id_empleado = dataOption['id_empleado'];
        return this.apiService.apiCall(`reference-employees?id_empleado=${id_empleado}`, "GET", {});
    }

    deleteOneReferecnia(data){
    return this.apiService.apiCall(`reference-employees-eliminar/${data.id_emp_referencia}`, 'POST', data);
    }
    deleteOneCarga(data){
        return this.apiService.apiCall(`eliminar-carga-employees/${data.id_carga}`, 'POST', data);
    }
    deleteOneDocumentoDigital(data){
        return this.apiService.apiCall(`eliminar-documento-digital/${data.id_doc_ficha}`, 'POST', data);
    }

    saveOrUpdateOneReferencia(data){
        return this.apiService.apiCall('reference-employees/create-update', 'POST', data);
    }

    saveOrUpdateOneEducacion(data){
        return this.apiService.apiCall('education-employees/create-update', 'POST', data);
    }

    deleteOneEducacion(data){
        return this.apiService.apiCall(`education-employees-eliminar/${data.id_emp_educacion}`, 'POST', data);
    }


    getHistoryByEmployee(dataOption? :object){
    
        let page = dataOption['page'];
        let size = dataOption['size'];
        let sort = dataOption['sort'];
        let type_sort = dataOption['type_sort'];
        let id_empleado = dataOption['id_empleado'];
    
        return this.apiService.apiCall(`employees/history`, "POST", dataOption);
        
    }


    getHistoryContactsByEmployee(dataOption? :object){
    
        let page = dataOption['page'];
        let size = dataOption['size'];
        let sort = dataOption['sort'];
        let type_sort = dataOption['type_sort'];
        let id_empleado = dataOption['id_empleado'];
    
        return this.apiService.apiCall(`employees/history-contracts`, "POST", dataOption);
        
    }

    getDocumentByEmployee(dataOption? :object){

      let page = dataOption['page'];
      let size = dataOption['size'];
      let sort = dataOption['sort'];
      let type_sort = dataOption['type_sort'];
      let id_empleado = dataOption['id_empleado'];
      return this.apiService.apiCall(`digital-folders/employee?id_empleado=${id_empleado}&page=${page}&size=${size}&type_sort=${type_sort}&sort=${sort}`, "GET", {});
    }

    saveFolderDigital(data){
        return this.apiService.apiCall('digital-folders', 'POST', data);
    }


    updatedFolderDigital(data){
        return this.apiService.apiCall(`digital-folders/${data.id_doc_ficha}`, 'PUT', data);
      }


    deleteFolderDigital(data){
      return this.apiService.apiCall(`digital-folders/${data.id_doc_ficha}`, 'DELETE', data);
    }

    guardarFamiliar(id: number, data: any = {}){
        return new Promise((resolve, reject) => {
            this.apiService.apiCall(`employees/set-familiar/${id}`, "POST", data).subscribe(
                (res: any) => resolve(res.data),
                (err: any) => reject(err)
            )
        })
    }
    modificarFamiliar(id: number, data: any = {}){
        return new Promise((resolve, reject) => {
            this.apiService.apiCall(`employees/update-familiar/${id}`, "POST", data).subscribe(
                (res: any) => resolve(res.data),
                (err: any) => reject(err)
            )
        })
    }
    // modificarFamiliar(id: number, data: any ){
    //     return this.apiService.apiCall(`employees/update-familiar/${id}`, "POST", data);
    // }

    getRelaciones(keyword: string, data: any = {}) {
        return new Promise<Array<any>>((resolve, reject) => {
            this.apiService.apiCall(`catalogos/${keyword}`, "GET", data).subscribe(
                (res: any) => resolve(res.data),
                (err: any) => reject(err)
            )
        })
    }
    getCatalogs(data) {
        return this.apiService.apiCall("proveedores/get-catalogo", "POST", data);
      }


    generarContratoEmpleado(data){
        return this.apiService.apiCall('generar-contrato-empleado', 'POST', data);
    }
     
    setRetencionJudicial(data: any = {}) {
        return this.apiService.apiCall('employees/set-retencion-judicial', 'POST', data).toPromise()
    }

    getRetencionesJudiciales(id: number) {
        return this.apiService.apiCall(`employees/get-retenciones-judiciales/${id}`, 'GET', {}).toPromise()
    }

    updateRetencionJudicial(id: number, data: any = {}) {
        return this.apiService.apiCall(`employees/update-retenciones-judiciales/${id}`, 'PUT', data).toPromise()
    }

    deleteRetencionJudicial(data: any = {}) {
        return this.apiService.apiCall(`employees/delete-retencion-judicial`, 'POST', data).toPromise()
    }

    public getPorcAnticipoQuin(data: any = {}){
        return this.apiService.apiCall("rrhh/parametro-porcentaje-anticipo", "POST", data);
      }


}