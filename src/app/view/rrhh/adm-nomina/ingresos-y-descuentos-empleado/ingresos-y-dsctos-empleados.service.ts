import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class IngresosYDsctosEmpleadosService {

  constructor(private apiService: ApiServices) { }
  listaIngresosDesc$ = new EventEmitter<any>();
 /*  getValidateEmpleyeesIncomeDiscounts(paratemter) {

    let $data: {
      params?: {paratemter};
      token? : null,
      user_token_id? : null,
    };
    return this.apiService.apiCall('search-employees-income-discounts', 'GETV1',paratemter );
  } */

  getValidateEmpleyeesIncomeDiscounts(data) {
    return this.apiService.apiCall('search-employees-income-discounts', 'POST',data );
  }

  saveListIngresoDescuento(data){
    return this.apiService.apiCall('income-discounts-list-save', 'POST', data);
  }

  getListIngresoDescuentoAll(dataOption? :object){

    let indc_anio = dataOption['indc_anio'];
    let id_mes = dataOption['id_mes'];
    let id_tipo_rubro = dataOption['id_tipo_rubro'];
    let id_rubro = dataOption['id_rubro'];
    let id_programa = dataOption['id_programa'];
    let id_area = dataOption['id_area'];
    let id_departamento = dataOption['id_departamento'];
    let tipo_contrato = dataOption['tipo_contrato'];
    

    return this.apiService.apiCall(`income-discounts-list-parameter?indc_anio=${indc_anio}&id_mes=${id_mes}&id_tipo_rubro=${id_tipo_rubro}&id_rubro=${id_rubro}&id_programa=${id_programa}&id_area=${id_area}&id_departamento=${id_departamento}&tipo_contrato=${tipo_contrato}`, "GETV1", {});
  }


  deleteOne(data){
    return this.apiService.apiCall(`income-discounts/${data.id_ing_desc}`, 'DELETEV1', data);
  }


  deleteList(data){
    return this.apiService.apiCall(`income-discounts-list-delete`, 'POST', data);
  }


  getPlantilla(data){
    return this.apiService.apiCall('income-discounts-download-template', 'GETFILEV1', {} );
  }
  getRecDocumentosExport(data) {
    return this.apiService.apiCall("descarga-plantilla-ingresos-descuentos", "POST", data);
  }
  getTipoContratos(data) {
    return this.apiService.apiCall('nomina/rolgeneral/getTipoContratos', 'POST', data);
  }

  aprobarIngresoDescuento(data){
    return this.apiService.apiCall('income-discounts-aprobar', 'POST', data);
  }

  consultaNumControl(data){
    return this.apiService.apiCall('income-discounts-by-numero-control', 'POST', data);
  }

  getNumControl(data){
    return this.apiService.apiCall('income-discounts/num-control', 'POST', data);
  }

  getUltimoNumero(data: any = {}) {
    return this.apiService.apiCall('income-discounts/ultimo-numero-control', 'POST', data).toPromise<any>()
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


 

  
    // deleteArea(data){
  //   return this.apiService.apiCall(`areas/${data.id_area}`, 'DELETEV1', data);
  // }
  // saveArea(data){
  //   return this.apiService.apiCall('areas', 'POST', data);
  // }

  // updatedArea(data){
  //   return this.apiService.apiCall(`areas/${data.id_area}`, 'PUTV1', data);
  // }

  // deleteArea(data){
  //   return this.apiService.apiCall(`areas/${data.id_area}`, 'DELETEV1', data);
  // }
}
