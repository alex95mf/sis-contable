import { Injectable } from '@angular/core';
import { ApiServices } from '../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class PlanCuentasService {

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


  JsonPlanCuenta(data: any = {}){
    return this.apiService.apiCall('plandecuentas/obtener-plancuenta-json', 'POST', data);
  }

  JsonPlanCuentaNew(data: any = {}){
    return this.apiService.apiCall('plandecuentas/obtener-plancuenta-json-new', 'POST', data);
  }

  

  getCatalogoAuxiliares(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall('proveedores/get-catalogo', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getUltimaCuenta(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall('plandecuentas/get-account-children', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  saveReglaPresupuestaria(data){
    return this.apiService.apiCall('reglaPresupuestaria/save', 'POST', data);
  }
  updateReglaPresupuestaria(data){
    return this.apiService.apiCall('reglaPresupuestaria/update', 'POST', data);
  }

  getReglas(data: any) {
    return this.apiService.apiCall('reglaPresupuestaria/getReglasPresupuestarias','POST', data);
  }

  findReglaPresupuestaria(data: any){
    return this.apiService.apiCall('reglaPresupuestaria/findReglaPresupuestaria','POST', data);
  }
  
}

