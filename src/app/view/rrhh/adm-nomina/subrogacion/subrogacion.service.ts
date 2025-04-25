import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
    providedIn: 'root'
})
export class SubrogacionService {
    constructor(private apiService: ApiServices) { }

    consultaSubrogacion$ = new EventEmitter<any>();

    presentaTablaEmpleado() {
        return this.apiService.apiCall('administracion/get-table-empresa', 'POST', {});
    }

    getDatosIniciales() {
        return this.apiService.apiCall('administracion/documento/getDatosIniciales', 'POST', {});
    }

    getEmailExist(data) {
        return this.apiService.apiCall('administracion/validate-email', 'POST', data);
    }

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
    saveAccionPersonal(data){
        return this.apiService.apiCall('save-accion-personal', 'POST', data);
    }
    
    updateAccionPersonal(data){
        return this.apiService.apiCall('update-accion-personal', 'POST', data);
    }

    updatedServiceFichaEmpleado(data){
        return this.apiService.apiCall(`employees/${data.id_empleado}`, 'PUTV1', data);
    }


    getCargaFamiliares(dataOption? :object){
        let id_empleado = dataOption['id_empleado'];
        return this.apiService.apiCall(`empleado/cargas-familiares?id_empleado=${id_empleado}`, "GETV1", {});
    }

    getPhotoByEmploye(dataOption? :object){
        let id_empleado = dataOption['id_empleado'];
        return this.apiService.apiCall(`photo-employees?id_empleado=${id_empleado}`, "GETV1", {});
    }


    getEducacionByEmpleado(dataOption? :object){
        let id_empleado = dataOption['id_empleado'];
        return this.apiService.apiCall(`education-employees?id_empleado=${id_empleado}`, "GETV1", {});
    }


    getReferenciaByEmpleado(dataOption? :object){
        let id_empleado = dataOption['id_empleado'];
        return this.apiService.apiCall(`reference-employees?id_empleado=${id_empleado}`, "GETV1", {});
    }

    deleteOneReferecnia(data){
    return this.apiService.apiCall(`reference-employees/${data.id_emp_referencia}`, 'DELETEV1', data);
    }

    saveOrUpdateOneReferencia(data){
        return this.apiService.apiCall('reference-employees/create-update', 'POST', data);
    }

    saveOrUpdateOneEducacion(data){
        return this.apiService.apiCall('education-employees/create-update', 'POST', data);
    }

    deleteOneEducacion(data){
        return this.apiService.apiCall(`education-employees/${data.id_emp_educacion}`, 'DELETEV1', data);
    }


    getHistoryByEmployee(dataOption? :object){
    
        let page = dataOption['page'];
        let size = dataOption['size'];
        let sort = dataOption['sort'];
        let type_sort = dataOption['type_sort'];
        let id_empleado = dataOption['id_empleado'];
    
        return this.apiService.apiCall(`employees/history`, "POST", dataOption);
        
      }

      getAccionPersonal(dataOption? :object){
        let page = dataOption['page'];
        let size = dataOption['size'];
        let sort = dataOption['sort'];
        let type_sort = dataOption['type_sort'];
       
        return this.apiService.apiCall('get-accion-personal', 'POST', dataOption);
    }

    
    getAccionPersonalPaginate(data? :any){
        return this.apiService.apiCall('get-accion-personal-paginate', 'POST', data);
    }


    deleteAccionPersonal(data){
        return this.apiService.apiCall(`delete-accion-personal`, 'POST', data);
    }

    getAccionPersonalFilter(dataOption? :object){
        let page = dataOption['page'];
        let size = dataOption['size'];
        let sort = dataOption['sort'];
        let type_sort = dataOption['type_sort'];
       let name=dataOption['name'];
        return this.apiService.apiCall('get-accion-personal', 'POST', dataOption);
    }

    consultaAccionPersonal(data? :any){
        return this.apiService.apiCall('consulta-accion-personal', 'POST', data);
    }
    
    
}