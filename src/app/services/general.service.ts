import { array } from "@amcharts/amcharts4/core";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { ApiServices } from "./api.service";

export interface Area {
  id_area: number;
  are_nombre: string;
  are_descripcion: string;
  are_keyword: string;
}

const initArea: Area = {
  id_area: 0,
  are_nombre: "",
  are_descripcion: "",
  are_keyword: "",
};

@Injectable({
  providedIn: "root",
})
export class GeneralService {
  private area$ = new BehaviorSubject<Area>(initArea);
  constructor(private apiService: ApiServices) {}

  get selectedArea$(): Observable<Area> {
    return this.area$.asObservable();
  }

  setArea(area:Area):void{
    this.area$.next(area);
  }


  getAreas() {
    return this.apiService.apiCall("areas", "GET", {});
  }

  getCatalogoKeyWork( cat_keyword : string){
    // /EST
    return this.apiService.apiCall(`catalogos/${cat_keyword}`, 'GET', {});
  }

  setCatalogo(data: any = {}) {
    return this.apiService.apiCall(`catalogos`, 'POST', data).toPromise()
  }

  getDeparmentos() {
    return this.apiService.apiCall("departamentos", "GET", {});
  }

  getPersonal(periodo_id? :number){
    return this.apiService.apiCall(`general/personal?periodo_id=${periodo_id}`, "GET", {});
    
  }
  getPersonalEmpleados(data? :any){
    return this.apiService.apiCall('general/personal-empleados', "POST", data);
    
  }

  getPeriodos( estado? : string){
    return this.apiService.apiCall(`general/periodos?estado=${estado}`, 'GET', {});
  }

  getCatalogoNominaKeyWork( noc_keyword : string){
    // /EST
    return this.apiService.apiCall(`catalogos-nomina/${noc_keyword}`, 'GET', {});
  }

  getJornadas() {
    return this.apiService.apiCall("jornadas", "GET", {});
  }


  getCargosCombo( p_relation? : string){
    return this.apiService.apiCall(`cargos?relation=${p_relation}`, 'GET', {});
  }


  getValidateDocumentIdentification( p_identification : string, p_tipo? : string){
    return this.apiService.apiCall(`general/validate-document?identification=${p_identification}&tipo=${p_tipo}`, 'GET', {});
  }

  // page=2&size=1&sort=id_departamento&type_sort=asc&search=pruebas

  getPeriodosPaginate(dataOption? :object){

    let page = dataOption['page'];
    let size = dataOption['size'];
    let sort = dataOption['sort'];
    let type_sort = dataOption['type_sort'];
    let search = dataOption['search'];

    return this.apiService.apiCall(`deparments?page=${page}&size=${size}&type_sort=${type_sort}&sort=${sort}&search=${search}`, "GET", {});
  }


  getEmpleadosPaginate(dataOption? :object){

    let page = dataOption['page'];
    let size = dataOption['size'];
    let sort = dataOption['sort'];
    let type_sort = dataOption['type_sort'];
    let search = dataOption['search'];
    let relation = dataOption['relation'];
    let relation_selected = dataOption['relation_selected'];

    return this.apiService.apiCall(`employees/list?page=${page}&size=${size}&type_sort=${type_sort}&sort=${sort}&search=${search}&relation=${relation}&relation_selected=${relation_selected}`, "GET", {});
  }

  getJornadasPaginate(dataOption? :object){

    let page = dataOption['page'];
    let size = dataOption['size'];
    let sort = dataOption['sort'];
    let type_sort = dataOption['type_sort'];
    let search = dataOption['search'];

    return this.apiService.apiCall(`workdays/list?page=${page}&size=${size}&type_sort=${type_sort}&sort=${sort}&search=${search}`, "GET", {});
  }

  getSueldosPaginate(dataOption? :object){

    let page = dataOption['page'];
    let size = dataOption['size'];
    let sort = dataOption['sort'];
    let type_sort = dataOption['type_sort'];
    let search = dataOption['search'];
    let cargo = dataOption['cargo']

    return this.apiService.apiCall(`salaries/list?page=${page}&size=${size}&type_sort=${type_sort}&sort=${sort}&search=${search}&cargo=${cargo}`, "GET", {});
  }


  getRubrosPaginate(dataOption? :object){

    let page = dataOption['page'];
    let size = dataOption['size'];
    let sort = dataOption['sort'];
    let type_sort = dataOption['type_sort'];
    let search = dataOption['search'];
    let relation = dataOption['relation'];
    let tipo_rubro_id = dataOption['tipo_rubro_id'];

    return this.apiService.apiCall(`items/list?page=${page}&size=${size}&type_sort=${type_sort}&sort=${sort}&search=${search}&relation=${relation}&tipo_rubro_id=${tipo_rubro_id}`, "GET", {});
  }


  getCatalogoOnly( id : number){
    return this.apiService.apiCall(`catalogo/${id}`, 'GET', {});
  }


  getEmpleadosOnlyIdentificacion(dataOption? :object){

    let identification = dataOption['identification'];
    let relation_selected = dataOption['relation_selected'];
    let relation = dataOption['relation'];
   
    return this.apiService.apiCall(`employees/all-unique?identification=${identification}&relation_selected=${relation_selected}&relation=${relation}`, "GET", {});
  }

}
