import { Injectable , EventEmitter} from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {


  constructor(private apiService: ApiServices, private http: HttpClient) { }

  listaProveedores$ = new EventEmitter<any>();

  presentarDocument(params) {
    return this.apiService.apiCall("proveedores/documento/get-documento-tabla", "POST", params);
  }

  getCatalogs(data) {
    return this.apiService.apiCall("proveedores/get-catalogo", "POST", data);
  }

  getAgentRetencion(data: any = {}) {
    return this.apiService.apiCall("available/agent-retencion", "POST", data);
  }

  saveProveedores(data) {
    return this.apiService.apiCall("proveedores/save-proveedores", "POST", data);
  }

  saveProveedoresCuentas(data) {
    return this.apiService.apiCall("proveedores/save-proveedores-cuentas", "POST", data);
  }

  updateProveedores(data) {
    return this.apiService.apiCall("proveedores/update-proveedor", "POST", data);
  }
  
  updateProveedoresCuentas(data) {
    return this.apiService.apiCall("proveedores/update-proveedor-cuentas", "POST", data);
  }

  deleteProveedor(data) {
    return this.apiService.apiCall("proveedores/delete-proveedor", "POST", data);
  }

  filterProvinceCity(data) {
    return this.apiService.apiCall("proveedores/filter-province-city", "POST", data);
  }

  validateDoc(data) {
    return this.apiService.apiCall("proveedores/validate-cedula", "POST", data);
  }

  validateEmailPrividers(data) {
    return this.apiService.apiCall("proveedores/validate-email", "POST", data);
  }
 
  validateEmailProveedor(data) {
    return this.apiService.apiCall("proveedores/validate-email-proveedor", "POST", data);
  }

  descargar(data) {
    return this.apiService.getTipoBlob("/general/download-files", data);
  }

  getTreeProducts(data) {
    return this.apiService.apiCall('productos/get-tree-product-group-select', 'POST', data);
  }
  uploadAnexo(file, payload?: any) {
    return this.apiService.apiCallFile('general/upload-files', 'POST', file, payload)
  }
  getProveedorHistoricoCuentas(data) {
    return this.apiService.apiCall('proveedores/proveedor-historico-cuentas', 'POST', data);
  }

  deleteCertificadoBancario(data){
    return this.apiService.apiCall(`eliminar-certificado-bancario/${data.id_cuenta}/${data.id_proveedor}`, 'POST', data);
  }
  //eliminar-documento-digital

  deleteCertificado(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall('proveedores/delete-certificado', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  saveCertificado(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall('proveedores/set-certificado', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  deleteCuentaBancaria(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall('proveedores/delete-cuenta-bancaria', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
}
