import { EventEmitter, Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AsigncionService {

  constructor(private apiServices : ApiServices) { }

  nuevaAtribucion$ = new EventEmitter<any>();
  hasBienes$ = new EventEmitter<any>();
  actualizaPresupuesto$ = new EventEmitter<void>();
  updatedPresupuesto = new EventEmitter<any>();

  // 11-05-2023
  getPeriodos(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiServices.apiCall('planificacion/get-periodos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getProgramas(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiServices.apiCall('planificacion/get-programas', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getDepartamentos(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiServices.apiCall('planificacion/get-departamentos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getCatalogo(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiServices.apiCall("proveedores/get-catalogo", "POST", data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getPresupuestoDepartamento(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiServices.apiCall('planificacion/get-presupuesto-departamento', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getAtribuciones(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiServices.apiCall('planificacion/get-atribuciones', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  setAtribuciones(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiServices.apiCall('planificacion/save-atribuciones', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  setAtribucion(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiServices.apiCall('parameters/signup-catalog', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getBienes(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiServices.apiCall('planificacion/get-bienes', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getProyectos(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiServices.apiCall('planificacion/get-proyectos-planificacion', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }


  almacenaBienes(data: any = {}) {
    return new Promise((resolve, reject) => {
      this.apiServices.apiCall('planificacion/save-bienes', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  deleteBienes(data: any = {}) {
    return this.apiServices.apiCall('planificacion/delete-bien', 'POST', data) as any;
  }

  getTareas(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiServices.apiCall('planificacion/get-atribucion-tareas', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getResponsables(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiServices.apiCall('planificacion/get-responsables', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  setTareas(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiServices.apiCall('planificacion/set-atribucion-tareas', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

deleteTarea(data: any = {}) {
  return this.apiServices.apiCall('planificacion/delete-atribucion-tarea', 'POST', data) as any
}
  // Legacy
  // getCatalogos(data) {
  //   return this.apiServices.apiCall("proveedores/get-catalogo", "POST", data);
  // }

  // getProgramas()
  // {
  //   return this.apiServices.apiCall('planificacion/get-programas', 'POST', {});
  // }

  // getDepartamentos(data)
  // {
  //   return this.apiServices.apiCall('planificacion/get-departamentos-programa', 'POST', data);
  // }

  getPresupuestoPrograma(data) {
    return this.apiServices.apiCall('planificacion/get-presupuesto-programa', 'POST', data);
  }

  // getPresupuestoDepartamento(data) {
  //   return this.apiServices.apiCall('planificacion/get-presupuesto-departamento', 'POST', data);
  // }

  // getResponsables(data: any = {}) {
  //   return this.apiServices.apiCall('planificacion/get-responsables', 'POST', data)
  // }

  // setTareas(data: any = {}) {
  //   return this.apiServices.apiCall('planificacion/set-atribucion-tareas', 'POST', data)
  // }

  // getTareas(data: any = {}) {
  //   return this.apiServices.apiCall('planificacion/get-atribuciones-tareas', 'POST', data)
  // }

  // setBienes(data: any = {}) {
  //   return this.apiServices.apiCall('planificacion/set-atribucion-bienes', 'POST', data)
  // }

  // getBienes(data: any = {}) {
  //   return this.apiServices.apiCall('planificacion/get-atribuciones-bienes', 'POST', data)
  // }

  getActividades(data) {
    return this.apiServices.apiCall("planificacion/get-actividades-departamento", "POST", data);
  }

  // almacenaAttrs(data) {
  //   return this.apiServices.apiCall("planificacion/save-atribuciones", "POST", data);
  // }

  // almacenaBienes(data: any = {}) {
  //   return this.apiServices.apiCall('planificacion/save-bienes', 'POST', data)
  // }

  actualizaPresupuesto(data) {
    return this.apiServices.apiCall('planificacion/actualiza-presupuesto', 'POST', data);
  }

  /* actualizaAttrs(data) {
    return this.apiServices.apiCall('planificacion/actualiza-atribuciones', 'POST', data);
  } */

  /* getAtribuciones(data) {
    return this.apiServices.apiCall('planificacion/get-atribuciones', 'POST', data);
  } */

  getAtribBienes(data) {
    return this.apiServices.apiCall('planificacion/get-attr-bienes-asig', 'POST', data);
  }

  enviarCorreos(data) {
    return this.apiServices.apiCall('planificacion/send-mail-bienes', 'POST', data);
  }

  obtenerCatalogos(datos) {
    return this.apiServices.apiCall("proveedores/get-catalogo", "POST", datos);
  }

  getValidaNameGlobal(data) {
    return this.apiServices.apiCall('parameters/validate-catalog', 'POST', data);
  }

  saveRowCatalogo(data) {
    return this.apiServices.apiCall('parameters/signup-catalog', 'POST', data);
}

}
