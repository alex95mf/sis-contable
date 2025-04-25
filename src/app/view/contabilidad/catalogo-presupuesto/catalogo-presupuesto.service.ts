import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CatalogoPresupuestoService {

  constructor(private apiService: ApiServices) { }

  obtenePlanCuentaGeneral(data) {
    return this.apiService.apiCall('plandecuentas/obtener-plancuenta-general', 'POST', data);
  }

  obtenePlanCuentaGeneralTotal(data) {
    return this.apiService.apiCall('plandecuentas/obtener-plancuenta-total', 'POST', data);
  }


  getTreePlanCuentas() {
    return this.apiService.apiCall('plandecuentas/get-tree-plan-cuentas', 'POST', {});
  }


  getTreePlanCuentas2(data) {
    return this.apiService.apiCall('plandecuentas/get-tree-plan-cuentas2', 'POST', data);
  }
  
  getPlanCuentas(data) {
    return this.apiService.apiCall('plandecuentas/get-account-higher', 'POST', data);
  }

  getLengtCaracteres(){
    return this.apiService.apiCall('plandecuentas/get-lengt-parameters', 'POST', {});
  }

  getChildrensAccount(data){
    return this.apiService.apiCall('plandecuentas/get-account-children', 'POST', data);
  }

  saveNewAccount(data){
    return this.apiService.apiCall('plandecuentas/save-new-account', 'POST', data);
  }

  setCuenta(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall('catalogo-presupuesto/set-cuenta', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  updateCuenta(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall(`catalogo-presupuesto/update-cuenta`, 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  updateAccount(data){
    return this.apiService.apiCall('plandecuentas/update-account', 'POST', data);
  }

  exportAccounts(){
    return this.apiService.apiCall('plandecuentas/export-account', 'POST', {});
  }

  printData(data){
    return this.apiService.apiCall('plandecuentas/save-data-print', 'POST', data);
  }

  printAccounts(){
    return this.apiService.apiCall('plandecuentas/get-data-export', 'POST', {});
  }


  JsonPresupuestoCatalogo(){
    return this.apiService.apiCall('catalogo-presupuesto/obtener-catpresupuesto-json', 'POST', {});
  }


  catalogoPresupuestoId(data){
    return this.apiService.apiCall('contabilidad/catalogoPresupuestobyid', 'POST', data);
  }


  
}
