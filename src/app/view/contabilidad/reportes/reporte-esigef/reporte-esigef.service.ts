import { Injectable } from '@angular/core';
import { ApiServices } from '../../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class EasigefService {

  constructor(private apiService: ApiServices) { }


  /* obtenerBalanceComprobacion(fecha_desde :string, fecha_hasta :string, centro :string, id_empresa :number, id_usuario :number, nivel :number ) {
    return this.apiService.apiCall(`contabilidad/estadosfinancieros/balance_comprobacion/${fecha_desde}/${fecha_hasta}/${centro}/${id_empresa}/${id_usuario}/${nivel}`, 'GETV1',  {});
  } */


    getPeriodos(data: any = {}) {
      return new Promise<Array<any>>((resolve, reject) => {
        this.apiService.apiCall('planificacion/get-periodos', 'POST', data).subscribe(
          (res: any) => resolve(res.data),
          (err: any) => reject(err)
        )
      })
    }

  ObtenerRegistroSaldoInicial(anio :number, mes :number) {
    return this.apiService.apiCall(`contabilidad/reporte/esigef/saldos/${anio}/${mes}`, 'GET',  {});
  }

  obtenerPresupuestoInicial(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall(`contabilidad/reporte/esigef/presupuesto-inicial?periodo=${data.periodo}&mes=${data.mes}`, 'GET', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  obtenerBalanceComprobacion(data: any = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall(`contabilidad/reporte/esigef/balance-comprobacion?periodo=${data.periodo}&mes=${data.mes}`, 'GET', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }

  obtenerPresupuesto(data: any  = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      this.apiService.apiCall(`contabilidad/reporte/esigef/presupuesto?periodo=${data.periodo}`, 'GET', data).subscribe(
        (res: any) => resolve(res.data),
        (err: any) => reject(err)
      )
    })
  }
  // obtenerReciprocaInicial(anio :number, mes :number) {
  //   return new Promise<Array<any>>((resolve, reject) => {
  //     this.apiService.apiCall(`contabilidad/reporte/esigef/reciproca-inicial?periodo=${anio}&mes=${mes}`, 'GET', {}).subscribe(
  //       (res: any) => resolve(res.data),
  //       (err: any) => reject(err)
  //     )
  //   })
  // }
  obtenerReciprocaInicial(anio :number, mes :number) {
    return this.apiService.apiCall(`contabilidad/reporte/esigef/reciproca-inicial?periodo=${anio}&mes=${mes}`, 'GET',  {});
  }
  obtenerTranReciprocas(anio :number, mes :number ,id_usuario :number) {
    return this.apiService.apiCall(`contabilidad/reporte/esigef/transacciones-reciprocas?periodo=${anio}&mes=${mes}&id_usuario=${id_usuario}`, 'GET',  {});
  }
  obtenerDetAsientoInicial(anio :number, mes :number ,id_usuario :number) {
    return this.apiService.apiCall(`contabilidad/reporte/esigef/detalle-asiento-inicial?periodo=${anio}&mes=${mes}&id_usuario=${id_usuario}`, 'GET',  {});
  }

  

  

  
  

  downloadFile(data: any, filename = 'data', cabecera: Array<string>) {
    let csvData = this.ConvertToCSV(data, cabecera,filename);
   // console.log(csvData);
    let blob = new Blob(['\ufeff' + csvData], {
      type: 'text/csv;charset=utf-8;',
    });
    let dwldLink = document.createElement('a');
    let url = URL.createObjectURL(blob);
    let isSafariBrowser =
      navigator.userAgent.indexOf('Safari') != -1 &&
      navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {
      //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute('target', '_blank');
    }
    dwldLink.setAttribute('href', url);
    dwldLink.setAttribute('download', filename + '.txt');
    dwldLink.style.visibility = 'hidden';
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  ConvertToCSV(objArray, headerList,filename) {
    console.log(filename)
    console.log(objArray)
    console.log(headerList)
    

    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = 'S.No,';
    let tipo='';
    for (let i = 0; i < array.length; i++) {
      let line = /* i + 1 + */ '';
      let k=0;

      if (["PresupuestoInicial","Presupuesto"].includes(filename))

        {
          tipo = array[i]["tipo"];
        }
        
      for (let index in headerList) {
        let head = headerList[index];
  
        
        if (k==0)
          {
            line += array[i][head];
          }
          else
          {
// validacion en archivo txt si es del presupuesto del tipo INGRESO 
// .no considere las columnas comprometido y saldo por comprometer
            if (["PresupuestoInicial","Presupuesto"].includes(filename) && tipo=='I')
              {
                if (!["comprometido","saldo_por_comprometer","actividad","orientacion_gasto"].includes(head))
                  {
                    line += '|' + array[i][head];
                  }
              }
              else
              {
                line += '|' + array[i][head];
              }
           
          }
      k++;
      }

      str += line + '\r\n';
    }
    return str;
  }

  
}