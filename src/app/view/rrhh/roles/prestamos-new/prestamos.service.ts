import { Injectable, EventEmitter } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class PrestamosService {
  empleadoSelected$ = new EventEmitter<any>();
  prestamoSelected$ = new EventEmitter<any>();

  constructor(
    private apiService: ApiServices,
  ) { }

  getCatalogos(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall('proveedores/get-catalogo', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  // Usado en el Modal de Busqueda de Prestamo
  getPrestamos(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall(`prestamos?paginate=${data.paginate}&page=${data.page}&size=${data.size}&empleado=${data.search}`, 'GET', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  // Usado en la pantalla de Reporte
  consultarPrestamos(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall(`prestamos/consulta`, 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getPrestamo(id: number, data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall(`prestamos/${id}`, 'GET', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  setPrestamo(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall('prestamos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
  setAnularPrestamo(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiService.apiCall('prestamos-anular', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getPrestamoById(data) {
    return this.apiService.apiCall('prestamos/consulta-by-id', 'POST', data);
  }

  getRubros(data: any = {}) {

    return new Promise((resolve, reject) => {
      this.apiService.apiCall('prestamos/get-rubros', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
    
  }

  

}
