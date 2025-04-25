import { HttpEventType } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service'; 

@Injectable({
  providedIn: 'root'
})
export class AsistenciaEmpleadoService {

  importarConsultar = new EventEmitter();
  importarModificar = new EventEmitter();
  importarEliminar = new EventEmitter();
  importarAprobar = new EventEmitter();
  importarLimpiar = new EventEmitter();

  importarBotones = new EventEmitter();
  atrasosBotones = new EventEmitter();

  atrasosConsultar = new EventEmitter();
  atrasosModificar = new EventEmitter();
  atrasosEliminar = new EventEmitter();
  atrasosAprobar = new EventEmitter();
  atrasosLimpiar = new EventEmitter();

  biometricoConsultar = new EventEmitter();
  biometricoCancelar = new EventEmitter();

  constructor(private apiService: ApiServices) { }


    GenerarDiasTrabajados(id_empresa :number, anio :number, mes :number, primer_dia:string,ultimo_dia:string ) {
        return this.apiService.apiCall(`nomina/diastrabajdos/generar/${id_empresa}/${anio}/${mes}/${primer_dia}/${ultimo_dia}`, 'GETV1',  {});
    }

    getDiasTrabjados(anio :number, mes :number) {
      return this.apiService.apiCall(`nomina/diastrabajdos/consulta/${anio}/${mes}`, 'GETV1',  {});
    }

  deleteDiasTrabajados(periodo: number, mes: number, programa: number, area: number, departamento: number) {
    return this.apiService.apiCall(`nomina/diastrabajdos/eliminar/${periodo}/${mes}/${programa}/${area}/${departamento}`, 'GETV1',  {})
  }

  getDaysWorkedCalculateEmployees(dataOption? :object){
    let page = dataOption['page'];
    let size = dataOption['size'];
    let sort = dataOption['sort'];
    let type_sort = dataOption['type_sort'];
    let search = dataOption['search'];
    let ditr_anio = dataOption['ditr_anio'];
    let id_mes = dataOption['id_mes'];
    let id_empresa = dataOption['id_empresa'];
    let id_programa = dataOption['id_programa'];
    let id_area = dataOption['id_area'];
    let id_departamento = dataOption['id_departamento'];
    // return this.apiService.apiCall(`days-worked/calculate-employees/only-consult?page=${page}&size=${size}&type_sort=${type_sort}&sort=${sort}&search=${search}&ditr_anio=${ditr_anio}&id_mes=${id_mes}&id_empresa=${id_empresa}`, "GETV1", {});
    return this.apiService.apiCall(`days-worked/calculate-employees?page=${page}&size=${size}&type_sort=${type_sort}&sort=${sort}&search=${search}&ditr_anio=${ditr_anio}&id_mes=${id_mes}&id_empresa=${id_empresa}&id_programa=${id_programa}&id_area=${id_area}&id_departamento=${id_departamento}`, "GET", {});
  
  }

  getOnlyDaysWorkeEmployees(dataOption? :object){
    let page = dataOption['page'];
    let size = dataOption['size'];
    let sort = dataOption['sort'] ?? '';
    let type_sort = dataOption['type_sort'] ?? '';
    let search = dataOption['search'];
    let ditr_anio = dataOption['ditr_anio'];
    let id_mes = dataOption['id_mes'];
    let id_empresa = dataOption['id_empresa'];
    let id_programa = dataOption['id_programa'];
    let id_area = dataOption['id_area'];
    let id_departamento = dataOption['id_departamento'];

    return this.apiService.apiCall(`days-worked/calculate-employees/only-consult?page=${page}&size=${size}&type_sort=${type_sort}&sort=${sort}&search=${search}&ditr_anio=${ditr_anio}&id_mes=${id_mes}&id_empresa=${id_empresa}&id_programa=${id_programa}&id_area=${id_area}&id_departamento=${id_departamento}`, "GETV1", {});
  
  }


  getDonwloadFiles(dataOption? :object){
    let name_file = dataOption['name_file'];
    return this.apiService.apiCall(`download-template?name_file=${name_file}`, "GETFILEV1", {});
  
  }

  saveTemplateDayWorked(data){
    return this.apiService.apiCall('days-worked/save-template', 'POST', data);
  }

  saveListDiasTrabajados(data){
    return this.apiService.apiCall('days-worked/list-save-generate', 'POST', data);
  }
  

  getFaltasPermisosEmployees(dataOption? :object){

    let id_empleado = dataOption['id_empleado'];
    let flpr_anio = dataOption['flpr_anio'];
    let id_mes = dataOption['id_mes'];
    let afecta_rol_keyword = dataOption['afecta_rol_keyword'];
   
    // let id_empresa = dataOption['id_empresa'];
    return this.apiService.apiCall(`fault_and_permissions/catalogs-multiple?id_empleado=${id_empleado}&flpr_anio=${flpr_anio}&id_mes=${id_mes}&afecta_rol_keyword=${afecta_rol_keyword}`, "GETV1", {});
  
  }

  getPeriodos(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall('planificacion/get-periodos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getCatalogoNomina(data: any = {}) {
    return this.apiService.apiCall(`catalogos/${data.catalogo}`, 'GET', {}).toPromise<any>()
  }

  getCatalogo(data: any = {}) {
    return this.apiService.apiCall('proveedores/get-catalogo', 'POST', data).toPromise<any>()
  }

  procesarMarcas(file: File, data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiService.apiCallFileNom('nomina/procesar-marcas', 'POST', file, data).subscribe(
        (event: any) => {
          if (event.type == HttpEventType.Response) {
            resolve(event.body.data)
          }
        },
        (err: any) => reject(err)
      )
    })
  }

  setMarcaciones(file: File, data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiService.apiCallFileNom('nomina/set-marcaciones', 'POST', file, data).subscribe(
        (event: any) => {
          if (event.type == HttpEventType.Response) {
            resolve(event.body.data)
          }
        },
        (err: any) => reject(err)
      )
    })
  }

  /* setMarcaciones(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall('nomina/set-marcaciones', 'POST', data).subscribe(
        (res: any) => resolve([]),
        (err: any) => reject(err)
      )
    })
  } */

  getJornada(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiService.apiCall('nomina/get-empleado-jornada', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getMarcaciones(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall('nomina/get-marcaciones', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  updateMarcarciones(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall('nomina/update-marcaciones', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  aprobarMarcaciones(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiService.apiCall('nomina/aprobar-marcaciones', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  deleteMarcaciones(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiService.apiCall('nomina/delete-marcaciones', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
  
  procesarAtrasos(file: File, data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiService.apiCallFileNom('nomina/procesar-atrasos', 'POST', file, data).subscribe(
        (event: any) => {
          if (event.type == HttpEventType.Response) {
            resolve(event.body.data)
          }
        },
        (err: any) => reject(err)
      )
    })
  }

  // setAtrasos(data: any = {}) {
  //   return new Promise<Array<any>>((resolve, reject) => {
  //     this.apiService.apiCall('nomina/set-atrasos', 'POST', data).subscribe(
  //       (res: any) => resolve([]),
  //       (err: any) => reject(err)
  //     )
  //   })
  // }

  getAtrasos(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall('nomina/get-atrasos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
  updateAtrasos(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall('nomina/update-atrasos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  aprobarAtrasos(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiService.apiCall('nomina/aprobar-atrasos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  deleteAtrasos(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiService.apiCall('nomina/delete-atrasos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getMotivoAtraso(data) {
    return this.apiService.apiCall('nomina/get-motivo-atraso', 'POST', data);
  }

  getAreas(data){
    return this.apiService.apiCall('rrhh/rolGeneral-getAreasFilterPrograma', 'POST',data);
  }

  getDepartamentos(data){
    return this.apiService.apiCall('rrhh/rolGeneral-getdepFilterArea', 'POST',data);
  }

  procesarSpActualizaFaltasPermisos(data: any) {
    return this.apiService.apiCall('nomina/actualizar-faltas-permisos-sp','POST', data);
  }
  procesarSpActualizaHorasExtra(data: any) {
    return this.apiService.apiCall('nomina/actualizar-horas-extra-sp','POST', data);
  }

  
  getPlantilla(data){
    return this.apiService.apiCall('horas-extra-download-template', 'POST', data );
  }

  verificarHorasExtra(data){
    return this.apiService.apiCall('get-empleados-horas-extras', 'POST', data);
  }

  saveHorasExtra(data: any){
    return this.apiService.apiCall('nomina/set-empleados-horas-extras', 'POST', data);
  }

  getTipoContratos(data) {
    return this.apiService.apiCall('nomina/rolgeneral/getTipoContratos', 'POST', data);
  }

  consultarHorasExtra(data){
    return this.apiService.apiCall('nomina/get-horas-extra', 'POST',data);

  }

  deleteList(data){
    return this.apiService.apiCall(`nomina/horas-extra-list-delete`, 'POST', data);
  }

  

  

}
