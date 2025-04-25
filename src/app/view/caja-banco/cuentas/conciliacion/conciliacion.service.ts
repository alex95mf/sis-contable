import { Injectable , EventEmitter} from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ConciliacionService {

  constructor(private apiService: ApiServices) { }
  movimientos$ = new EventEmitter<any>();

  getAccountsByDetails(data) {
    return this.apiService.apiCall('diario/accounts/get-details-banks', 'POST', data);
  }

  getConciliation(data) {
    return this.apiService.apiCall('bancos/get-conciliation', 'POST', data);
  }

  saveConciliation(data) {
    return this.apiService.apiCall('bancos/save-conciliation', 'POST', data);
  }

  ObtenerConciliacion(data) {
    return this.apiService.apiCall('bancos/obtener-conciliacion', 'POST', data);
  }


  RegistrarBorrador(data) {
    return this.apiService.apiCall('bancos/registrar-borrador', 'POST', data);
  }

  ObtenerSaldosBancoPeriodo(data) {
    return this.apiService.apiCall('bancos/obtener-saldos', 'POST', data);
  }


  ListaConciliaciones(data) {
    return this.apiService.apiCall('bancos/lista-conciliacion', 'POST', data);
  }

  habilitarConciliation(data) {
    return this.apiService.apiCall('bancos/habilitar-conciliacion', 'POST', data);
  }

  getConciliaciones(data) {
    return this.apiService.apiCall('bancos/get-conciliaciones', 'POST', data);
  }

  getMovimientoBancarios(data) {
    return this.apiService.apiCall('bancos/consultar-movimiento-bancario', 'POST', data);
  }
  getPeriodos(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall('planificacion/get-periodos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  guardarMovBancario(data) {
    return this.apiService.apiCall('bancos/registrar-movimiento-bancario', 'POST', data);
  }

  editarMovBancario(data) {
    return this.apiService.apiCall('bancos/editar-movimiento-bancario', 'POST', data);
  }

  actualizarConciliacion(data) {
    return this.apiService.apiCall('bancos/actualizar-conciliacion', 'POST', data);
  }

  getDetallesConciliacion(data) {
    return this.apiService.apiCall('bancos/get-detalles-conciliacion', 'POST', data);
  }
  



  

}
