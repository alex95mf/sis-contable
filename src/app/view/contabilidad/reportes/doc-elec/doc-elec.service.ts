import { Injectable } from '@angular/core';
import { ApiServices } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class DocElecService {

  constructor(
    private apiServices: ApiServices,
  ) { }

  getTipoDocumentos(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiServices.apiCall('ptoEmision/get-document', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getEstadosSRI(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiServices.apiCall('', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getCatalogos(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiServices.apiCall('proveedores/get-catalogo', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  getDocumentos(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiServices.apiCall('contabilidad/reportes/documentos-electronicos', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  descargarXML(data: any = {}) {
    return this.apiServices.getTipoBlob('/contabilidad/reportes/descargar-xml', data)
  }

  enviarCorreo(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiServices.apiCall('contabilidad/reportes/enviar-correo', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  enviarCorreoLote(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiServices.apiCall('contabilidad/reportes/enviar-correo-lote', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  reiniciar(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiServices.apiCall('contabilidad/reportes/reiniciar', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  reiniciarLote(data: any = {}) {
    return new Promise<any>((resolve, reject) => {
      this.apiServices.apiCall('contabilidad/reportes/reiniciar-lote', 'POST', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
}
