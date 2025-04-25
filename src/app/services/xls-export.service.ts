import { Injectable } from '@angular/core';
import { Style, Workbook } from 'exceljs';
import * as FileSaver from 'file-saver';


//import { }



const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
const EXCEL_EXTENSION = '.xlsx'

@Injectable({
  providedIn: 'root'
})
export class XlsExportService {

  constructor() { }

  public exportReportePAC(data: any, filename: string) {
    let wb = new Workbook()
    let ws = wb.addWorksheet('data')

    // Colores
    const STYLE_HEADER_AMARILLO : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'ffeeba' }
      },
      font: {
        bold: true
      },
      border: null,
      numFmt : null,
      protection: null,
    }

    const STYLE_HEADER_AZUL : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'b8daff' }
      },
      font: {
        bold: true
      },
      border: null,
      numFmt : null,
      protection: null,
    }

    const STYLE_HEADER_VERDE : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'c3e6cb' }
      },
      font: {
        bold: true
      },
      border: null,
      numFmt : null,
      protection: null,
    }

    ws.columns = [
      { header: 'Partida Presupuestaria', key: 'PartidaPresupuestaria', width: 32 },
      { header: 'Codigo Categoria CPC', key: 'CodigoCPC', width: 32 },
      { header: 'Tipo Compra', key: 'tipo_compra', width: 16 },
      { header: 'Detalle del Producto', key: 'descripcion', width: 48 },
      { header: 'Cantidad', key: 'cantidad', width: 16 },
      { header: 'Unidad de Medida', key: 'u_medida', width: 16 },
      { header: 'Costo Unitario', key: 'costo_unitario', width: 16, style: { numFmt: '$0.00' } },
      { header: 'Costo Total', key: 'costo_total', width: 16, style: { numFmt: '$0.00' } },
      { header: 'Tipo de Producto', key: 'tipo_roducto', width: 24 },
      { header: 'Catalogo Electronico', key: 'cat_elec', width: 16 },
      { header: 'Procedimiento Sugerido', key: 'proc_sugerido', width: 24 },
      { header: 'Fondos BID', key: 'fondos_bid', width: 16 },
      { header: 'Codigo de Operacion', key: 'codigo_peracion', width: 16 },
      { header: 'Codigo de Proyecto', key: 'codigo_proyecto', width: 16 },
      { header: 'Tipo de Regimen', key: 'tipo_regimen', width: 24 },
      { header: 'Tipo de Presupuesto', key: 'tipo_presupuesto', width: 24 }
    ]

    ws.getCell('A1').style = STYLE_HEADER_AZUL
    ws.getCell('B1').style = STYLE_HEADER_VERDE
    ws.getCell('C1').style = STYLE_HEADER_VERDE
    ws.getCell('D1').style = STYLE_HEADER_AMARILLO
    ws.getCell('E1').style = STYLE_HEADER_AMARILLO
    ws.getCell('F1').style = STYLE_HEADER_AMARILLO
    ws.getCell('G1').style = STYLE_HEADER_AMARILLO
    ws.getCell('H1').style = STYLE_HEADER_AMARILLO
    ws.getCell('I1').style = STYLE_HEADER_AMARILLO
    ws.getCell('J1').style = STYLE_HEADER_VERDE
    ws.getCell('K1').style = STYLE_HEADER_VERDE
    ws.getCell('L1').style = STYLE_HEADER_VERDE
    ws.getCell('M1').style = STYLE_HEADER_AZUL
    ws.getCell('N1').style = STYLE_HEADER_AZUL
    ws.getCell('O1').style = STYLE_HEADER_VERDE
    ws.getCell('P1').style = STYLE_HEADER_AZUL



    ws.addRows(data)

    // Guarda el archivo
    wb.xlsx.writeBuffer().then(
      data => {
        let blob = new Blob([data], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, filename + new Date().valueOf() + EXCEL_EXTENSION)
      }
    )

  }

  exportReporteProyeccionGastos(filename: string, rep: any) {
    let wb = new Workbook()
    let ws = wb.addWorksheet('rep')
    console.log(rep);
    
    //let reverse = []
    //reverse = rep.reverse();
    const STYLE_HEADER_AMARILLO : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'000000' }
      },
      font: {
        bold: true,
        size: 8,
        color: { argb:'FFFFFF' }
      },
      border: null,
      numFmt : null,
      protection: null,
    }

    const STYLE_HEADER_AZUL : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'' }
      },
      font: {
        bold: true,
        size: 10
      },
      border: null,
      numFmt : null,
      protection: null,
    }
    let i=2;
      rep.forEach(element => {
        if(element.TIPO_CONCEPTO == 'A' || element.TIPO_CONCEPTO == 'M'){

            ws.insertRow(i, [element.DESCRIPCION,element.MONTO ,element.ABONOS ,element.ENE,element.FEB,element.MAR,element.ABR,element.MAY,element.JUN,element.JUL,element.AGO,element.SEP,element.OCT,element.NOV,element.DIC,element.TOTAL])
            i=i+1;
          }if (element.TIPO_CONCEPTO == 'T'){

            ws.insertRow(i, [element.DESCRIPCION,element.MONTO ,element.ABONOS ,element.ENE,element.FEB,element.MAR,element.ABR,element.MAY,element.JUN,element.JUL,element.AGO,element.SEP,element.OCT,element.NOV,element.DIC,element.TOTAL])
            ws.getCell('A'+i).style = STYLE_HEADER_AZUL
            i=i+1;
        }if (element.TIPO_CONCEPTO == 'G'){

            ws.insertRow(i,[element.DESCRIPCION])
            ws.getCell('A'+i).style = STYLE_HEADER_AZUL
            i=i+1;
      }
      });

    
    ws.columns = [
      { header: '', key: 'col1'},
      { header: 'MONTO', key: 'col2'},
      { header: 'ABONOS', key: 'col3'},
      { header: 'ENERO', key: 'col4'},
      { header: 'FEBRERO', key: 'col5'},
      { header: 'MARZO', key: 'col6'},
      { header: 'ABRIL', key: 'col7'},
      { header: 'MAYO', key: 'col8'},
      { header: 'JUNIO', key: 'col9'},
      { header: 'JULIO', key: 'col10'},
      { header: 'AGOSTO', key: 'col11'},
      { header: 'SEPTIEMBRE', key: 'col12'},
      { header: 'OCTUBRE', key: 'col13'},
      { header: 'NOVIEMBRE', key: 'col14'},
      { header: 'DICIEMBRE', key: 'col15'},
      { header: 'TOTAL', key: 'col16'},
    ]
    
    ws.columns.forEach(column => {
      column.width = column.header.length < 25 ? 25 : column.header.length
    })

    ws.getCell('A1').style = STYLE_HEADER_AMARILLO
    ws.getCell('B1').style = STYLE_HEADER_AMARILLO
    ws.getCell('C1').style = STYLE_HEADER_AMARILLO
    ws.getCell('D1').style = STYLE_HEADER_AMARILLO
    ws.getCell('E1').style = STYLE_HEADER_AMARILLO
    ws.getCell('F1').style = STYLE_HEADER_AMARILLO
    ws.getCell('G1').style = STYLE_HEADER_AMARILLO
    ws.getCell('H1').style = STYLE_HEADER_AMARILLO
    ws.getCell('I1').style = STYLE_HEADER_AMARILLO
    ws.getCell('J1').style = STYLE_HEADER_AMARILLO
    ws.getCell('K1').style = STYLE_HEADER_AMARILLO
    ws.getCell('L1').style = STYLE_HEADER_AMARILLO
    ws.getCell('M1').style = STYLE_HEADER_AMARILLO
    ws.getCell('N1').style = STYLE_HEADER_AMARILLO
    ws.getCell('O1').style = STYLE_HEADER_AMARILLO
    ws.getCell('P1').style = STYLE_HEADER_AMARILLO

    ws.getColumn(2).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    ws.getColumn(3).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    ws.getColumn(4).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    ws.getColumn(5).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    ws.getColumn(6).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    ws.getColumn(7).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    ws.getColumn(8).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    ws.getColumn(9).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    ws.getColumn(10).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    ws.getColumn(11).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    ws.getColumn(12).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    ws.getColumn(13).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    ws.getColumn(14).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    ws.getColumn(15).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    ws.getColumn(16).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    





    // Guarda el archivo
    wb.xlsx.writeBuffer().then(
      rep => {
        let blob = new Blob([rep], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, filename + new Date().valueOf() + EXCEL_EXTENSION)
      }
    )
  
  }

  exportReporteFlujoCaja(filename: string, rep: any) {
    let wb = new Workbook()
    let ws = wb.addWorksheet('rep')
    console.log(rep);
    
    //let reverse = []
    //reverse = rep.reverse();
    const STYLE_HEADER_AMARILLO : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'000000' }
      },
      font: {
        bold: true,
        size: 8,
        color: { argb:'FFFFFF' }
      },
      border: null,
      numFmt : null,
      protection: null,
    }

    const STYLE_HEADER_AZUL : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'' }
      },
      font: {
        bold: true,
        size: 10
      },
      border: null,
      numFmt : null,
      protection: null,
    }
    let i=2;
      rep.forEach(element => {
        if(element.TIPO_CONCEPTO == 'A' || element.TIPO_CONCEPTO == 'M'){

            ws.insertRow(i, [element.DESCRIPCION,element.ENE,element.FEB,element.MAR,element.ABR,element.MAY,element.JUN,element.JUL,element.AGO,element.SEP,element.OCT,element.NOV,element.DIC,element.TOTAL])
            i=i+1;
          }if (element.TIPO_CONCEPTO == 'T'){

            ws.insertRow(i, [element.DESCRIPCION,element.ENE,element.FEB,element.MAR,element.ABR,element.MAY,element.JUN,element.JUL,element.AGO,element.SEP,element.OCT,element.NOV,element.DIC,element.TOTAL])
            ws.getCell('A'+i).style = STYLE_HEADER_AZUL
            i=i+1;
        }if (element.TIPO_CONCEPTO == 'G'){

            ws.insertRow(i,[element.DESCRIPCION])
            ws.getCell('A'+i).style = STYLE_HEADER_AZUL
            i=i+1;
      }
      });

    
    ws.columns = [
      { header: '', key: 'col1'},
      { header: 'ENERO', key: 'col2'},
      { header: 'FEBRERO', key: 'col3'},
      { header: 'MARZO', key: 'col4'},
      { header: 'ABRIL', key: 'col5'},
      { header: 'MAYO', key: 'col6'},
      { header: 'JUNIO', key: 'col7'},
      { header: 'JULIO', key: 'col8'},
      { header: 'AGOSTO', key: 'col9'},
      { header: 'SEPTIEMBRE', key: 'col10'},
      { header: 'OCTUBRE', key: 'col11'},
      { header: 'NOVIEMBRE', key: 'col12'},
      { header: 'DICIEMBRE', key: 'col13'},
      { header: 'TOTAL', key: 'col14'},
    ]
    
    ws.columns.forEach(column => {
      column.width = column.header.length < 25 ? 25 : column.header.length
    })

    ws.getCell('A1').style = STYLE_HEADER_AMARILLO
    ws.getCell('B1').style = STYLE_HEADER_AMARILLO
    ws.getCell('C1').style = STYLE_HEADER_AMARILLO
    ws.getCell('D1').style = STYLE_HEADER_AMARILLO
    ws.getCell('E1').style = STYLE_HEADER_AMARILLO
    ws.getCell('F1').style = STYLE_HEADER_AMARILLO
    ws.getCell('G1').style = STYLE_HEADER_AMARILLO
    ws.getCell('H1').style = STYLE_HEADER_AMARILLO
    ws.getCell('I1').style = STYLE_HEADER_AMARILLO
    ws.getCell('J1').style = STYLE_HEADER_AMARILLO
    ws.getCell('K1').style = STYLE_HEADER_AMARILLO
    ws.getCell('L1').style = STYLE_HEADER_AMARILLO
    ws.getCell('M1').style = STYLE_HEADER_AMARILLO
    ws.getCell('N1').style = STYLE_HEADER_AMARILLO

    ws.getColumn(2).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    ws.getColumn(3).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    ws.getColumn(4).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    ws.getColumn(5).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    ws.getColumn(6).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    ws.getColumn(7).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
    ws.getColumn(8).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    ws.getColumn(9).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    ws.getColumn(10).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    ws.getColumn(11).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    ws.getColumn(12).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    ws.getColumn(13).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    ws.getColumn(14).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 


    // Guarda el archivo
    wb.xlsx.writeBuffer().then(
      rep => {
        let blob = new Blob([rep], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, filename + new Date().valueOf() + EXCEL_EXTENSION)
      }
    )
  
  }
  exportPlantillaFlujoCaja(filename: string, rep: any) {
    let wb = new Workbook()
    let ws = wb.addWorksheet('rep')
    console.log(rep);
    
    //let reverse = []
    //reverse = rep.reverse();
    const STYLE_HEADER_AMARILLO : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'000000' }
      },
      font: {
        bold: true,
        size: 8,
        color: { argb:'FFFFFF' }
      },
      border: null,
      numFmt : null,
      protection: null,
    }

    const STYLE_HEADER_AZUL : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'' }
      },
      font: {
        bold: true,
        size: 10
      },
      border: null,
      numFmt : null,
      protection: null,
    }
    let i=2;
      rep.forEach(element => {
        if(element.TIPO_CONCEPTO == 'A' || element.TIPO_CONCEPTO == 'M'){

            ws.insertRow(i, [element.DESCRIPCION,element.ENE,element.FEB,element.MAR,element.ABR,element.MAY,element.JUN,element.JUL,element.AGO,element.SEP,element.OCT,element.NOV,element.DIC,element.TOTAL])
            i=i+1;
          }
        //   if (element.TIPO_CONCEPTO == 'T'){

        //     ws.insertRow(i, [element.DESCRIPCION,element.ENE,element.FEB,element.MAR,element.ABR,element.MAY,element.JUN,element.JUL,element.AGO,element.SEP,element.OCT,element.NOV,element.DIC,element.TOTAL])
        //     ws.getCell('A'+i).style = STYLE_HEADER_AZUL
        //     i=i+1;
        // }
      //   if (element.TIPO_CONCEPTO == 'G'){

      //       ws.insertRow(i,[element.DESCRIPCION])
      //       ws.getCell('A'+i).style = STYLE_HEADER_AZUL
      //       i=i+1;
      // }
      });

    
    ws.columns = [
      { header: 'DESCRIPCION', key: 'col1'},
      { header: 'ENERO', key: 'col2'},
      { header: 'FEBRERO', key: 'col3'},
      { header: 'MARZO', key: 'col4'},
      { header: 'ABRIL', key: 'col5'},
      { header: 'MAYO', key: 'col6'},
      { header: 'JUNIO', key: 'col7'},
      { header: 'JULIO', key: 'col8'},
      { header: 'AGOSTO', key: 'col9'},
      { header: 'SEPTIEMBRE', key: 'col10'},
      { header: 'OCTUBRE', key: 'col11'},
      { header: 'NOVIEMBRE', key: 'col12'},
      { header: 'DICIEMBRE', key: 'col13'},
      // { header: 'TOTAL', key: 'col14'},
    ]
    
    ws.columns.forEach(column => {
      column.width = column.header.length < 25 ? 25 : column.header.length
    })

    ws.getCell('A1').style = STYLE_HEADER_AMARILLO
    ws.getCell('B1').style = STYLE_HEADER_AMARILLO
    ws.getCell('C1').style = STYLE_HEADER_AMARILLO
    ws.getCell('D1').style = STYLE_HEADER_AMARILLO
    ws.getCell('E1').style = STYLE_HEADER_AMARILLO
    ws.getCell('F1').style = STYLE_HEADER_AMARILLO
    ws.getCell('G1').style = STYLE_HEADER_AMARILLO
    ws.getCell('H1').style = STYLE_HEADER_AMARILLO
    ws.getCell('I1').style = STYLE_HEADER_AMARILLO
    ws.getCell('J1').style = STYLE_HEADER_AMARILLO
    ws.getCell('K1').style = STYLE_HEADER_AMARILLO
    ws.getCell('L1').style = STYLE_HEADER_AMARILLO
    ws.getCell('M1').style = STYLE_HEADER_AMARILLO
    // ws.getCell('N1').style = STYLE_HEADER_AMARILLO

    ws.getColumn(2).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    ws.getColumn(3).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    ws.getColumn(4).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    ws.getColumn(5).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    ws.getColumn(6).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    ws.getColumn(7).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
    ws.getColumn(8).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    ws.getColumn(9).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    ws.getColumn(10).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    ws.getColumn(11).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    ws.getColumn(12).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    ws.getColumn(13).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    // ws.getColumn(14).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 


    // Guarda el archivo
    wb.xlsx.writeBuffer().then(
      rep => {
        let blob = new Blob([rep], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, filename + new Date().valueOf() + EXCEL_EXTENSION)
      }
    )
  
  }

  exportReportePOA(filename: string, data: any) {
    let wb = new Workbook()
    let ws = wb.addWorksheet('POA-' + ((new Date().getFullYear() + 1) % 100))

    // Colores
    const STYLE_HEADER_AMARILLO : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'ffeeba' }
      },
      font: {
        bold: true,
        size: 8
      },
      border: null,
      numFmt : null,
      protection: null,
    }

    const STYLE_HEADER_AZUL : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'b8daff' }
      },
      font: {
        bold: true,
        size: 8
      },
      border: null,
      numFmt : null,
      protection: null,
    }

    const STYLE_HEADER_VERDE : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'c3e6cb' }
      },
      font: {
        bold: true,
        size: 8
      },
      border: null,
      numFmt : null,
      protection: null,
    }

    ws.columns = [
      { header: 'Objetivos de Desarrollo Sostenible', key: 'ods', width: 16 },
      { header: 'Meta (ODS)', key: 'meta_ods', width: 16 },
      { header: 'Objetivos Nacionales de Desarrollo', key: 'opg', width: 16 },
      { header: 'Politica de Plan de Gobierno', key: 'ppg', width: 16 },
      { header: 'Eje', key: 'eje', width: 16 },
      { header: 'Meta para la Zona', key: 'meta_zonal', width: 16 },
      { header: 'Competencias del GAD', key: 'competencia', width: 24 },
      { header: 'Objetivo Estrategico del PDOT', key: 'oe', width: 16 },
      { header: 'Meta de Resultados del PDOT', key: 'meta_resultado', width: 16 },
      { header: 'Indicador', key: 'indicador', width: 16 },
      { header: 'Tendencia del Indicador', key: 'tendencia', width: 12 },
      { header: 'Tipo de Intervencion', key: 'intervencion', width: 12 },
      { header: 'Objetivo Operativo', key: 'objetivo_operativo', width: 32 },
      { header: 'Nombre del Programa, Proyecto y Actividades', key: 'nombre', width: 16 },
      { header: 'Formula del Indicador de Gestion', key: 'formula', width: 16 },
      { header: 'Frecuencia de Medicion', key: 'frecuencia', width: 16 },
      { header: 'Meta POA', key: 'meta', width: 16 },
      { header: 'Tiempo Previsto para alcanzar la meta', key: 'prevision', width: 16 },
      { header: 'Trimestre 1', key: 'periodo1', width: 8 },
      { header: 'Trimestre 2', key: 'periodo2', width: 8 },
      { header: 'Trimestre 3', key: 'periodo3', width: 8 },
      { header: 'Trimestre 4', key: 'periodo4', width: 8 },
      { header: 'Responsables', key: 'responsables', width: 16 },
      { header: 'Fuente de Financiamiento', key: 'financiamiento', width: 16 },
      { header: 'Estimacion Presupuestaria', key: 'presupuestado', width: 16 },
      { header: 'Presupuesto Devengado', key: 'devengado', width: 16 },
      { header: 'Presupuesto Pagado', key: 'pagado', width: 16 },
    ]

    ws.getCell('A1').style = STYLE_HEADER_AMARILLO
    ws.getCell('B1').style = STYLE_HEADER_AMARILLO
    ws.getCell('C1').style = STYLE_HEADER_AMARILLO
    ws.getCell('D1').style = STYLE_HEADER_AMARILLO
    ws.getCell('E1').style = STYLE_HEADER_AMARILLO
    ws.getCell('F1').style = STYLE_HEADER_AMARILLO
    ws.getCell('G1').style = STYLE_HEADER_AMARILLO
    ws.getCell('H1').style = STYLE_HEADER_AMARILLO
    ws.getCell('I1').style = STYLE_HEADER_AMARILLO
    ws.getCell('J1').style = STYLE_HEADER_AMARILLO
    ws.getCell('K1').style = STYLE_HEADER_AMARILLO
    ws.getCell('L1').style = STYLE_HEADER_AMARILLO
    ws.getCell('M1').style = STYLE_HEADER_AZUL
    ws.getCell('N1').style = STYLE_HEADER_AZUL
    ws.getCell('O1').style = STYLE_HEADER_AZUL
    ws.getCell('P1').style = STYLE_HEADER_AZUL
    ws.getCell('Q1').style = STYLE_HEADER_AZUL
    ws.getCell('R1').style = STYLE_HEADER_AZUL
    ws.getCell('S1').style = STYLE_HEADER_AZUL
    ws.getCell('T1').style = STYLE_HEADER_AZUL
    ws.getCell('U1').style = STYLE_HEADER_AZUL
    ws.getCell('V1').style = STYLE_HEADER_AZUL
    ws.getCell('W1').style = STYLE_HEADER_AZUL
    ws.getCell('X1').style = STYLE_HEADER_VERDE
    ws.getCell('Y1').style = STYLE_HEADER_VERDE
    ws.getCell('Z1').style = STYLE_HEADER_VERDE
    ws.getCell('AA1').style = STYLE_HEADER_VERDE

    ws.insertRows(2, data.rows)

    ws.insertRow(1, [''])
    let len = data.oe.length / 2
    for(let i = len - 1; i >= 0; i--) {
      let rowValues = []
      rowValues[1] = data.oe[i].valor
      rowValues[12] = data.oe[i + len].valor
      ws.insertRow(1, rowValues)
    }
    ws.insertRow(1, ['OBJETIVOS ESTRATEGICOS DEL GOBIERNO AUTONOMO DESCENTRALIZADO MUNICIPAL DE LA LIBERTAD'])
    ws.insertRow(1, [''])
    ws.insertRow(1, ['OBJETIVO GENERAL:', '', data.gad_objetivo])
    ws.insertRow(1, [''])
    ws.insertRow(1, ['VISION:', '', data.gad_vision])
    ws.insertRow(1, [''])
    ws.insertRow(1, ['MISION:', '', data.gad_mision])
    ws.insertRow(1, [''])
    ws.insertRow(1, [data.subtitle])
    ws.insertRow(1, [data.title])

    // Formato
    ws.mergeCells('A1:AA1')
    ws.mergeCells('A2:AA2')
    ws.mergeCells('A4:B4'); ws.mergeCells('C4:AA4')
    ws.mergeCells('A6:B6'); ws.mergeCells('C6:AA6')
    ws.mergeCells('A8:B8'); ws.mergeCells('C8:AA8')
    ws.mergeCells('A10:AA10')
    ws.mergeCells('A11:K11'); ws.mergeCells('L11:AA11')
    ws.mergeCells('A12:K12'); ws.mergeCells('L12:AA12')
    ws.mergeCells('A13:K13'); ws.mergeCells('L13:AA13')
    ws.mergeCells('A14:K14'); ws.mergeCells('L14:AA14')
    ws.mergeCells('A15:K15'); ws.mergeCells('L15:AA15')
    ws.mergeCells('A16:K16'); ws.mergeCells('L16:AA16')
    ws.mergeCells('A17:K17'); ws.mergeCells('L17:AA17')
    ws.mergeCells('A18:K18'); ws.mergeCells('L18:AA18')

    ws.getCell('A1').style = {
      alignment: {
        horizontal: 'center'
      },
      font: {
        size: 22,
        bold: true
      },
    }

    ws.getCell('A2').style = {
      alignment: {
        horizontal: 'center'
      },
      font: {
        size: 18,
        bold: true
      },
    }

    ws.getCell('A4').font = { bold: true, size: 11 }
    ws.getCell('A6').font = { bold: true, size: 11 }
    ws.getCell('A8').font = { bold: true, size: 11 }
    ws.getCell('A10').style = STYLE_HEADER_AZUL
    // ws.getRow(11).height = 75

    const tblRows = ws.getRows(21, 100)
    tblRows.forEach(row => {
      row.eachCell(c => {
        c.style = {
          font: {
            size: 8,
          },
          alignment: {
            wrapText: true,
            vertical: 'middle'
          }
        }
      })
    })


    wb.xlsx.writeBuffer().then(
      data => {
        let blob = new Blob([data], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, filename + new Date().valueOf() + EXCEL_EXTENSION)
      }
    )
  }

  public exportReportePAContrataciones(data: any, filename: string) {
    let wb = new Workbook()
    let ws = wb.addWorksheet('PAC-' + ((new Date().getFullYear() + 1) % 100))

    // Colores
    const STYLE_HEADER_AMARILLO : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'ffeeba' }
      },
      font: {
        bold: true,
        size: 8
      },
      border: null,
      numFmt : null,
      protection: null,
    }

    const STYLE_HEADER_AZUL : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'b8daff' }
      },
      font: {
        bold: true,
        size: 8
      },
      border: null,
      numFmt : null,
      protection: null,
    }

    ws.columns = [
      { header: 'Requerimiento General', key: 'requerimiento_general', width: 24 },
      { header: 'PRG', key: 'prg', width: 8 },
      { header: 'Direccion Unidad', key: 'direccion_unidad', width: 16 },
      { header: 'Cedula de Asignacion', key: 'cedula_asignacion', width: 16 },
      { header: 'Codigo', key: 'codigo', width: 16 },
      { header: 'Requerimiento Especifico', key: 'requerimiento_especifico', width: 24 },
      { header: 'Fuente de Financiamiento', key: 'fuente_financiamiento', width: 16 },
      { header: 'Categoria del Producto', key: 'categoria_producto', width: 16 },
      { header: 'Tipo de Compra', key: 'tipo_compra', width: 16 },
      { header: 'Bien Codificable', key: 'bien_codificable', width: 16 },
      { header: 'Tipo de Regimen', key: 'tipo_regimen', width: 16 },
      { header: 'Tipo de Producto', key: 'tipo_producto', width: 16 },
      { header: 'Catalogo Electronico', key: 'catalogo_electronico', width: 16 },
      { header: 'Procedimiento Sugerido', key: 'procedimiento_sugerido', width: 16 },
      { header: 'Cantidad', key: 'cantidad', width: 8 },
      { header: 'Unidad de Medida', key: 'unidad_medida', width: 16 },
      { header: 'Precio Unitario', key: 'precio_unitario', width: 16 },
      { header: 'Precio Parcial', key: 'precio_parcial', width: 16 },
      { header: 'Precio Referencia Total', key: 'precio_referencia', width: 24 },
      { header: 'Valor Total', key: 'valor_total', width: 16 },
      { header: 'Periodo Estimado', key: 'periodo_estimado', width: 24 },
    ]

    ws.insertRows(2, data.rows)

    ws.getCell('A1').style = STYLE_HEADER_AZUL
    ws.getCell('B1').style = STYLE_HEADER_AMARILLO
    ws.getCell('C1').style = STYLE_HEADER_AMARILLO
    ws.getCell('D1').style = STYLE_HEADER_AMARILLO
    ws.getCell('E1').style = STYLE_HEADER_AMARILLO
    ws.getCell('F1').style = STYLE_HEADER_AZUL
    ws.getCell('G1').style = STYLE_HEADER_AMARILLO
    ws.getCell('H1').style = STYLE_HEADER_AZUL
    ws.getCell('I1').style = STYLE_HEADER_AZUL
    ws.getCell('J1').style = STYLE_HEADER_AZUL
    ws.getCell('K1').style = STYLE_HEADER_AZUL
    ws.getCell('L1').style = STYLE_HEADER_AZUL
    ws.getCell('M1').style = STYLE_HEADER_AZUL
    ws.getCell('N1').style = STYLE_HEADER_AZUL
    ws.getCell('O1').style = STYLE_HEADER_AZUL
    ws.getCell('P1').style = STYLE_HEADER_AZUL
    ws.getCell('Q1').style = STYLE_HEADER_AZUL
    ws.getCell('R1').style = STYLE_HEADER_AZUL
    ws.getCell('S1').style = STYLE_HEADER_AZUL
    ws.getCell('T1').style = STYLE_HEADER_AZUL
    ws.getCell('U1').style = STYLE_HEADER_AZUL

    // Escribir Cabecera
    ws.insertRow(1, [''])
    ws.insertRow(1, ['Programa, Proyecto y/o Actividad', '', data.programa])
    ws.insertRow(1, [''])
    ws.insertRow(1, ['Objetivo Operativo', '', data.objetivo_operativo])
    ws.insertRow(1, [''])
    ws.insertRow(1, ['Direccion/Unidad', '', data.departamento])
    ws.insertRow(1, [data.subtitle])
    ws.insertRow(1, [data.title])

    // Formato
    ws.mergeCells('A1:U1')
    ws.mergeCells('A2:U2')
    ws.mergeCells('A3:B3'); ws.mergeCells('C3:U3')
    ws.mergeCells('A5:B5'); ws.mergeCells('C5:U5')
    ws.mergeCells('A7:B7'); ws.mergeCells('C7:U7')

    ws.getCell('A1').style = {
      alignment: {
        horizontal: 'center'
      },
      font: {
        size: 22,
        bold: true
      },
    }

    ws.getCell('A2').style = {
      alignment: {
        horizontal: 'center'
      },
      font: {
        size: 18,
        bold: true
      },
    }

    ws.getCell('A3').style = {
      font: {
        bold: true
      }
    }

    ws.getCell('A5').style = {
      font: {
        bold: true
      }
    }

    ws.getCell('A7').style = {
      font: {
        bold: true
      }
    }

    wb.xlsx.writeBuffer().then(
      data => {
        let blob = new Blob([data], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, filename + new Date().valueOf() + EXCEL_EXTENSION)
      }
    )

  }
  public exportReporteDetalladoBienes(data: any, filename: string) {
    let wb = new Workbook()
    let ws = wb.addWorksheet('PAC-' + ((new Date().getFullYear() + 1) % 100))

    // Colores
    const STYLE_HEADER_AMARILLO : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'ffeeba' }
      },
      font: {
        bold: true,
        size: 8
      },
      border: null,
      numFmt : null,
      protection: null,
    }

    const STYLE_HEADER_AZUL : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'b8daff' }
      },
      font: {
        bold: true,
        size: 8
      },
      border: null,
      numFmt : null,
      protection: null,
    }
    


    ws.columns = [
      { header: '#', key: 'linea', width: 8 },
      { header: 'Tipo', key: 'tipo_bien', width: 16 },
      { header: 'Grupo', key: 'descripciongrupo', width: 16 },
      { header: 'Sub Grupo', key: 'descripcionsubgrupo', width: 16 },
      { header: 'Año', key: 'anio', width: 16 },
      { header: 'No. Comprobante de ingreso', key: 'numero_ingreso_bodega', width: 24 },
      { header: 'Centro de Costo', key: 'centro_costo', width: 10 },
      { header: 'Código interno de bodega', key: 'codigoproducto', width: 16 },
      { header: 'Fecha de aquisición', key: 'fecha_compra', width: 16 },
      { header: 'Código del bien', key: 'codigo_bien', width: 16 },
      { header: 'Nominación del catálogo', key: 'nombre_catalogo_presupuesto', width: 16 },
      { header: 'No. acta de entrega', key: 'acta_entrega', width: 16 },
      { header: 'Cuenta Contable', key: 'codigo_cuenta_contable', width: 16 },
      { header: 'Descripción del bien', key: 'descripcion_bien', width: 16 },
      { header: 'Marca', key: 'marca', width: 16 },
      { header: 'Modelo', key: 'modelo', width: 16 },
      { header: 'Serie', key: 'numero_serie', width: 16 },
      { header: 'No. movil', key: 'movil', width: 16 },
      { header: 'Tipo material', key: 'tipo_material', width: 16 },
      { header: 'Caracterísiticas material', key: 'caracterisricas_material', width: 16 },
      { header: 'Color', key: 'color', width: 16 },
      { header: 'Placa', key: 'placa', width: 16 },
      { header: 'Chasis', key: 'numero_chasi', width: 16 },
      { header: 'Motor', key: 'motor', width: 16 },
      { header: 'Condición', key: 'condicion', width: 16 },
      { header: 'Ubicación', key: 'ubicacion', width: 16 },
      { header: 'Custodio', key: 'custodio', width: 16 },
      { header: 'Valor', key: 'valor', width: 16 },
      { header: 'Proveedor', key: 'proveedor', width: 16 },
      { header: 'No. Factura', key: 'factura', width: 16 },
      { header: 'Fecha de devolución', key: 'fecha_devolucucion', width: 16 },
      { header: 'Departamento que devuelve', key: 'departamento_devolucion', width: 16 },
      { header: 'No. documento devolución<', key: 'nro_documento_devolucion', width: 16 },
      { header: 'Fecha de informe técnico', key: 'fecha_informe_tecnico', width: 16 },
      { header: 'No. informe técnico', key: 'nro_informe_tecnico', width: 16 },
      { header: 'Persona que suscribe', key: 'servidor_suscribe', width: 16 },
      { header: 'Ubicación actual', key: 'ubicacion_actual', width: 16 },
      { header: 'Fecha de envío a bodegas ENGOROY', key: 'fecha_envio_bodega', width: 16 },
      { header: 'No. documento envío a ENGOROY', key: 'nro_documento_envio_bodega', width: 16 },
    ]

    ws.insertRows(2, data.rows)

    ws.getCell('A1').style = STYLE_HEADER_AZUL
    // ws.getCell('B1').style = STYLE_HEADER_AMARILLO
    // ws.getCell('C1').style = STYLE_HEADER_AMARILLO
    // ws.getCell('D1').style = STYLE_HEADER_AMARILLO
    // ws.getCell('E1').style = STYLE_HEADER_AMARILLO
    // ws.getCell('F1').style = STYLE_HEADER_AZUL
    // ws.getCell('G1').style = STYLE_HEADER_AMARILLO
    // ws.getCell('H1').style = STYLE_HEADER_AZUL
    // ws.getCell('I1').style = STYLE_HEADER_AZUL
    // ws.getCell('J1').style = STYLE_HEADER_AZUL
    // ws.getCell('K1').style = STYLE_HEADER_AZUL
    // ws.getCell('L1').style = STYLE_HEADER_AZUL
    // ws.getCell('M1').style = STYLE_HEADER_AZUL
    // ws.getCell('N1').style = STYLE_HEADER_AZUL
    // ws.getCell('O1').style = STYLE_HEADER_AZUL
    // ws.getCell('P1').style = STYLE_HEADER_AZUL
    // ws.getCell('Q1').style = STYLE_HEADER_AZUL
    // ws.getCell('R1').style = STYLE_HEADER_AZUL
    // ws.getCell('S1').style = STYLE_HEADER_AZUL
    // ws.getCell('T1').style = STYLE_HEADER_AZUL
    // ws.getCell('U1').style = STYLE_HEADER_AZUL
    // ws.getCell('V1').style = STYLE_HEADER_AZUL
    // ws.getCell('W1').style = STYLE_HEADER_AZUL
    // ws.getCell('X1').style = STYLE_HEADER_AZUL
    // ws.getCell('Y1').style = STYLE_HEADER_AZUL
    // ws.getCell('Z1').style = STYLE_HEADER_AZUL
    // ws.getCell('AA1').style = STYLE_HEADER_AZUL
    // ws.getCell('AB1').style = STYLE_HEADER_AZUL
    // ws.getCell('AC1').style = STYLE_HEADER_AZUL
    // ws.getCell('AD1').style = STYLE_HEADER_AZUL
    // ws.getCell('AE1').style = STYLE_HEADER_AZUL
    // ws.getCell('AF1').style = STYLE_HEADER_AZUL
    // ws.getCell('AG1').style = STYLE_HEADER_AZUL
    // ws.getCell('AH1').style = STYLE_HEADER_AZUL
    // ws.getCell('AI1').style = STYLE_HEADER_AZUL
    // ws.getCell('AJ1').style = STYLE_HEADER_AZUL
    // ws.getCell('AK1').style = STYLE_HEADER_AZUL

    // Escribir Cabecera
    ws.insertRow(1, [''])
    ws.insertRow(1, ['RESPONSABLE: ', data.responsable])
    ws.insertRow(1, [''])
    ws.insertRow(1, ['UBICACIÓN: ', data.ubicacion])
    ws.insertRow(1, [''])
    ws.insertRow(1, ['AÑO INGRESO: ',data.anio_ingreso])
    ws.insertRow(1, [''])
    ws.insertRow(1, ['SUBGRUPO: ',data.sub_grupo])
    ws.insertRow(1, [''])
    ws.insertRow(1, ['GRUPO: ',data.grupo])
    ws.insertRow(1, [''])
    ws.insertRow(1, ['TIPO: ',data.tipo])
    ws.insertRow(1, [''])
    ws.insertRow(1, [data.title])

    // Formato
    ws.mergeCells('A1:U1')
    ws.mergeCells('A2:U2')
    ws.mergeCells('A3:B3'); ws.mergeCells('C3:U3')
    ws.mergeCells('A5:B5'); ws.mergeCells('C5:U5')
    ws.mergeCells('A7:B7'); ws.mergeCells('C7:U7')
    
  

    ws.getCell('A1').style = {
      alignment: {
        horizontal: 'center'
      },
      font: {
        size: 22,
        bold: true
      },
    }

    ws.getCell('A2').style = {
      alignment: {
        horizontal: 'center'
      },
      font: {
        size: 18,
        bold: true
      },
    }

    ws.getCell('A3').style = {
      font: {
        bold: true
      }
    }

    ws.getCell('A5').style = {
      font: {
        bold: true
      }
    }

    ws.getCell('A7').style = {
      font: {
        bold: true
      }
    }

    wb.xlsx.writeBuffer().then(
      data => {
        let blob = new Blob([data], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, filename + new Date().valueOf() + EXCEL_EXTENSION)
      }
    )

  }
  public exportReporteListaProductos(data: any, filename: string) {
    let wb = new Workbook()
    let ws = wb.addWorksheet('PAC-' + ((new Date().getFullYear() + 1) % 100))

    // Colores
    const STYLE_HEADER_AMARILLO : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'ffeeba' }
      },
      font: {
        bold: true,
        size: 8
      },
      border: null,
      numFmt : null,
      protection: null,
    }

    const STYLE_HEADER_AZUL : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'b8daff' }
      },
      font: {
        bold: true,
        size: 12
      },
      border: null,
      numFmt : null,
      protection: null,
    }

    ws.columns = [
      { header: 'Código', key: 'codigoproducto', width: 8 },
      { header: 'Nombre', key: 'nombre', width: 20 },
      { header: 'Unidad de Medida', key: 'udmcompra', width: 20 },
      { header: 'Stock', key: 'stock', width: 8 },
      { header: 'Costo Unitario', key: 'costo', width: 20 },
      { header: 'Costo Total', key: 'costo_total', width: 8 },
      { header: 'Lote', key: 'lote', width: 8 },
      { header: 'Fecha Caducidad', key: 'fecha_caducidad', width: 8 },
      { header: 'Cantidad Disponible', key: 'disponible', width: 8 },
  
    ]

    ws.insertRows(2, data.rows)

    ws.getCell('A1').style = STYLE_HEADER_AZUL
    ws.getCell('B1').style = STYLE_HEADER_AZUL
    ws.getCell('C1').style = STYLE_HEADER_AZUL
    ws.getCell('D1').style = STYLE_HEADER_AZUL
    ws.getCell('E1').style = STYLE_HEADER_AZUL
    ws.getCell('F1').style = STYLE_HEADER_AZUL
    ws.getCell('G1').style = STYLE_HEADER_AZUL
    ws.getCell('H1').style = STYLE_HEADER_AZUL
    ws.getCell('I1').style = STYLE_HEADER_AZUL
   

    // Escribir Cabecera
  
    ws.insertRow(1, [''])
    ws.insertRow(1, ['ESTADO:','',data.estado])
    ws.insertRow(1, [''])
    ws.insertRow(1, ['GRUPO:','',data.grupo])
    ws.insertRow(1, [''])
    ws.insertRow(1, ['PRODUCTO:','',data.producto])
    ws.insertRow(1, [''])
    ws.insertRow(1, [data.title])

    // Formato
    ws.mergeCells('A1:I1')
    ws.mergeCells('A2:I2')
    ws.mergeCells('B3:C3'); ws.mergeCells('D3:E3')
    ws.mergeCells('A4:I4')
    ws.mergeCells('B5:C5'); ws.mergeCells('D5:E5')
    ws.mergeCells('A6:I6')
    ws.mergeCells('B7:C7'); ws.mergeCells('D7:E7')
    
  

    ws.getCell('A1').style = {
      alignment: {
        horizontal: 'center'
      },
      font: {
        size: 22,
        bold: true
      },
    }

    ws.getCell('A2').style = {
      alignment: {
        horizontal: 'center'
      },
      font: {
        size: 18,
        bold: true
      },
    }

    ws.getCell('A3').style = {
      font: {
        bold: true
      }
    }

    ws.getCell('A5').style = {
      font: {
        bold: true
      }
    }

    ws.getCell('A7').style = {
      font: {
        bold: true
      }
    }

    wb.xlsx.writeBuffer().then(
      data => {
        let blob = new Blob([data], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, filename + new Date().valueOf() + EXCEL_EXTENSION)
      }
    )

  }
  public exportReporteSaldosInventario(data: any, filename: string) {
    let wb = new Workbook()
    let ws = wb.addWorksheet('PAC-' + ((new Date().getFullYear() + 1) % 100))

    // Colores
    const STYLE_HEADER_AMARILLO : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'ffeeba' }
      },
      font: {
        bold: true,
        size: 8
      },
      border: null,
      numFmt : null,
      protection: null,
    }

    const STYLE_HEADER_AZUL : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'b8daff' }
      },
      font: {
        bold: true,
        size: 12
      },
      border: null,
      numFmt : null,
      protection: null,
    }

    ws.columns = [
      { header: 'Código', key: 'codigoproducto', width: 8 },
      { header: 'Nombre', key: 'nombre', width: 20 },
      { header: 'Unidad de Medida', key: 'udmcompra', width: 20 },
      { header: 'Stock', key: 'stock', width: 8 },
      { header: 'Costo Unitario', key: 'costo', width: 20 },
      { header: 'Total', key: 'cantidad', width: 8 },
      { header: 'Fecha última compra', key: 'fecha_ultima_compra', width: 15 },
      { header: 'Valor última compra', key: 'precio_ultima_compra', width: 15 },
    
  
    ]

    ws.insertRows(2, data.rows)

    ws.getCell('A1').style = STYLE_HEADER_AZUL
    ws.getCell('B1').style = STYLE_HEADER_AZUL
    ws.getCell('C1').style = STYLE_HEADER_AZUL
    ws.getCell('D1').style = STYLE_HEADER_AZUL
    ws.getCell('E1').style = STYLE_HEADER_AZUL
    ws.getCell('F1').style = STYLE_HEADER_AZUL
    ws.getCell('G1').style = STYLE_HEADER_AZUL
    ws.getCell('H1').style = STYLE_HEADER_AZUL
    ws.getCell('H1').style = STYLE_HEADER_AZUL

    // Escribir Cabecera
  
    ws.insertRow(1, [''])
    ws.insertRow(1, ['STOCK:',data.stock])
    ws.insertRow(1, [''])
    ws.insertRow(1, ['FECHA DE CORTE:',data.fecha_corte,'UBICACÓN:',data.ubicacion])
    ws.insertRow(1, [''])
    ws.insertRow(1, ['GRUPO:',data.grupo,'','BODEGA:',data.bodega])
    ws.insertRow(1, [''])
    ws.insertRow(1, ['PRODUCTO:','',data.producto])
    ws.insertRow(1, [''])
    ws.insertRow(1, [data.title])
    ws.insertRow(1, [''])

    // Formato
    ws.mergeCells('A1:H1')//celda vacia
    ws.mergeCells('A2:H2')//titulo
    ws.mergeCells('A3:U3')//celda vacia
    ws.mergeCells('A4:B4'); ws.mergeCells('C4:E4');//producto
    ws.mergeCells('A5:B5'); ws.mergeCells('C5:D5');ws.mergeCells('F5:H5');
    ws.mergeCells('A7:B7'); ws.mergeCells('C7:U7')
    ws.mergeCells('A8:B8'); ws.mergeCells('C8:U8')
    ws.mergeCells('A9:B9'); ws.mergeCells('C9:E9')
    ws.mergeCells('A10:B10'); ws.mergeCells('C10:U10')
    
  

    ws.getCell('A1').style = {
      alignment: {
        horizontal: 'center'
      },
      font: {
        size: 22,
        bold: true
      },
    }

    ws.getCell('A2').style = {
      alignment: {
        horizontal: 'center'
      },
      font: {
        size: 18,
        bold: true
      },
    }

    ws.getCell('A3').style = {
      font: {
        bold: true
      }
    }

    ws.getCell('A5').style = {
      font: {
        bold: true
      }
    }

    ws.getCell('A7').style = {
      font: {
        bold: true
      }
    }

    wb.xlsx.writeBuffer().then(
      data => {
        let blob = new Blob([data], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, filename + new Date().valueOf() + EXCEL_EXTENSION)
      }
    )

  }
  public exportReporteMaxMin(data: any, filename: string) {
    let wb = new Workbook()
    let ws = wb.addWorksheet('PAC-' + ((new Date().getFullYear() + 1) % 100))

    // Colores
    const STYLE_HEADER_AMARILLO : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'ffeeba' }
      },
      font: {
        bold: true,
        size: 8
      },
      border: null,
      numFmt : null,
      protection: null,
    }

    const STYLE_HEADER_AZUL : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'b8daff' }
      },
      font: {
        bold: true,
        size: 12
      },
      border: null,
      numFmt : null,
      protection: null,
    }

    ws.columns = [
      { header: 'Código', key: 'codigoproducto', width: 8 },
      { header: 'Nombre', key: 'nombre', width: 20 },
      { header: 'Unidad de Medida', key: 'udmcompra', width: 20 },
      { header: 'Stock', key: 'stock', width: 8 },
      { header: 'Stock Mínimo', key: 'minstock', width: 8 },
      { header: 'Stock Máximo', key: 'maxstock', width: 8 },
      { header: 'Consumo Promedio Diario', key: 'consumo_promedio_diario', width: 10 },
      { header: 'Tiempo de Entrega', key: 'tiempo_entrega', width: 15 },
      { header: 'Punto de Reorden', key: 'punto_reorden', width: 15  },
      { header: 'Cantidad a Pedir', key: 'cantidad_pedir', width: 15 },
      { header: 'Costo Unitario', key: 'costo', width: 20 },
      { header: 'Total', key: 'cantidad', width: 8 },
    ]

    ws.insertRows(2, data.rows)

    ws.getCell('A1').style = STYLE_HEADER_AZUL
    ws.getCell('B1').style = STYLE_HEADER_AZUL
    ws.getCell('C1').style = STYLE_HEADER_AZUL
    ws.getCell('D1').style = STYLE_HEADER_AZUL
    ws.getCell('E1').style = STYLE_HEADER_AZUL
    ws.getCell('F1').style = STYLE_HEADER_AZUL
    ws.getCell('G1').style = STYLE_HEADER_AZUL
    ws.getCell('H1').style = STYLE_HEADER_AZUL
    ws.getCell('I1').style = STYLE_HEADER_AZUL
    ws.getCell('J1').style = STYLE_HEADER_AZUL
    ws.getCell('K1').style = STYLE_HEADER_AZUL
    ws.getCell('L1').style = STYLE_HEADER_AZUL
    ws.getCell('M1').style = STYLE_HEADER_AZUL

    // Escribir Cabecera
  
    ws.insertRow(1, [''])
    ws.insertRow(1, ['STOCK:',data.stock])
    ws.insertRow(1, [''])
    ws.insertRow(1, ['FECHA DE CORTE:',data.fecha_corte,'UBICACÓN:',data.ubicacion])
    ws.insertRow(1, [''])
    ws.insertRow(1, ['GRUPO:',data.grupo,'','BODEGA:',data.bodega])
    ws.insertRow(1, [''])
    ws.insertRow(1, ['PRODUCTO:','',data.nombre])
    ws.insertRow(1, [''])
    ws.insertRow(1, [data.title])
    ws.insertRow(1, [''])

    // Formato
    ws.mergeCells('A1:H1')//celda vacia
    ws.mergeCells('A2:H2')//titulo
    ws.mergeCells('A3:U3')//celda vacia
    ws.mergeCells('A4:B4'); ws.mergeCells('C4:E4');ws.mergeCells('F4:G4');ws.mergeCells('H4:I4');;ws.mergeCells('J4:L4');//producto
    ws.mergeCells('A5:B5'); ws.mergeCells('C5:D5');ws.mergeCells('F5:H5');
    ws.mergeCells('A7:B7'); ws.mergeCells('C7:U7')
    ws.mergeCells('A8:B8'); ws.mergeCells('C8:U8')
    ws.mergeCells('A9:B9'); ws.mergeCells('C9:E9')
    ws.mergeCells('A10:B10'); ws.mergeCells('C10:U10')
    
  

    ws.getCell('A1').style = {
      alignment: {
        horizontal: 'center'
      },
      font: {
        size: 22,
        bold: true
      },
    }

    ws.getCell('A2').style = {
      alignment: {
        horizontal: 'center'
      },
      font: {
        size: 18,
        bold: true
      },
    }

    ws.getCell('A3').style = {
      font: {
        bold: true
      }
    }

    ws.getCell('A5').style = {
      font: {
        bold: true
      }
    }

    ws.getCell('A7').style = {
      font: {
        bold: true
      }
    }

    wb.xlsx.writeBuffer().then(
      data => {
        let blob = new Blob([data], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, filename + new Date().valueOf() + EXCEL_EXTENSION)
      }
    )

  }
  public exportReporteKardex(data: any, filename: string) {
    let wb = new Workbook()
    let ws = wb.addWorksheet('PAC-' + ((new Date().getFullYear() + 1) % 100))

    // Colores
    const STYLE_HEADER_AMARILLO : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'ffeeba' }
      },
      font: {
        bold: true,
        size: 12
      },
      border: null,
      numFmt : null,
      protection: null,
    }

    const STYLE_HEADER_AZUL : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'b8daff' }
      },
      font: {
        bold: true,
        size: 8
      },
      border: null,
      numFmt : null,
      protection: null,
    }
   

    ws.columns = [
      { header: 'Código Producto', key: 'codigoproducto', width: 20 },
      { header: 'Nombre', key: 'nombre', width: 20 },
      { header: 'Proveedor/Destinatario', key: 'proveedor_destinatario', width: 20 },
      { header: 'Departamento', key: 'departamento', width: 30 },
      { header: 'Fecha', key: 'fecha', width: 20 },
      { header: 'Documento', key: 'num_documento', width: 20 },
      { header: 'Inicial', key: 'ini_stock', width: 20 },
      { header: 'Costo', key: 'ini_costo', width: 20 },
      { header: 'Total', key: 'ini_costo_total', width: 20 },
      { header: 'Movimiento', key: 'mov_cantidad', width: 20 },
      { header: 'Costo', key: 'mov_costo', width: 20 },
      { header: 'Total', key: 'mov_costo_total', width: 20 },
      { header: 'Final', key: 'fin_stock', width: 20 },
      { header: 'Costo', key: 'fin_costo', width: 20 },
      { header: 'Total', key: 'fin_costo_total', width: 20 },
    
  
    ]
    
    ws.getColumn(8).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
    ws.getColumn(9).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
    ws.getColumn(11).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
    ws.getColumn(12).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
    ws.getColumn(14).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
    ws.getColumn(15).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
   

    // data.rows.forEach(element => {
    //   Object.assign(element, { ini_costo:Number(element.ini_costo),
    //                            ini_costo_total:Number(element.ini_costo_total),
    //                            mov_costo:Number(element.mov_costo),
    //                            mov_costo_total:Number(element.mov_costo_total),
    //                            fin_costo:Number(element.fin_costo),
    //                            fin_costo_total:Number(element.fin_costo_total)
    //   })}
    //  ); 

    ws.insertRows(2, data.rows)

    ws.getCell('A1').style = STYLE_HEADER_AZUL
    ws.getCell('B1').style = STYLE_HEADER_AZUL
    ws.getCell('C1').style = STYLE_HEADER_AZUL
    ws.getCell('D1').style = STYLE_HEADER_AZUL
    ws.getCell('E1').style = STYLE_HEADER_AZUL
    ws.getCell('F1').style = STYLE_HEADER_AZUL
    ws.getCell('G1').style = STYLE_HEADER_AZUL
    ws.getCell('H1').style = STYLE_HEADER_AZUL
    ws.getCell('I1').style = STYLE_HEADER_AZUL
    ws.getCell('J1').style = STYLE_HEADER_AZUL
    ws.getCell('K1').style = STYLE_HEADER_AZUL
    ws.getCell('L1').style = STYLE_HEADER_AZUL
    ws.getCell('M1').style = STYLE_HEADER_AZUL
    ws.getCell('N1').style = STYLE_HEADER_AZUL
    ws.getCell('O1').style = STYLE_HEADER_AZUL
    // Escribir Cabecera
  
    ws.insertRow(1, [''])
    ws.insertRow(1, ['STOCK:',data.stock])
    ws.insertRow(1, [''])
    // ws.insertRow(1, ['FECHA DE CORTE:',data.fecha_corte,'UBICACÓN:',data.ubicacion])
    ws.insertRow(1, [''])
    ws.insertRow(1, ['GRUPO:',data.grupo,'','BODEGA:',data.bodega])
    ws.insertRow(1, [''])
    ws.insertRow(1, ['PRODUCTO:','',data.nombre])
    ws.insertRow(1, [''])
    ws.insertRow(1, [data.title])
    ws.insertRow(1, [''])

    // Formato
    ws.mergeCells('A1:O1')//celda vacia
    ws.mergeCells('A2:O2')//titulo
    ws.mergeCells('A3:U3')//celda vacia
    ws.mergeCells('A4:B4'); ws.mergeCells('C4:E4');ws.mergeCells('F4:G4');ws.mergeCells('H4:I4');ws.mergeCells('J4:O4');//producto
    ws.mergeCells('A5:B5'); ws.mergeCells('C5:D5');ws.mergeCells('F5:H5');
    ws.mergeCells('A7:B7'); ws.mergeCells('C7:U7')
    ws.mergeCells('A8:B8'); ws.mergeCells('C8:U8')
    ws.mergeCells('A9:B9'); ws.mergeCells('C9:E9')
    ws.mergeCells('A10:B10'); ws.mergeCells('C10:U10')
    
  

    ws.getCell('A1').style = {
      alignment: {
        horizontal: 'center'
      },
      font: {
        size: 22,
        bold: true
      },
    }

    ws.getCell('A2').style = {
      alignment: {
        horizontal: 'center'
      },
      font: {
        size: 18,
        bold: true
      },
    }

    ws.getCell('A4').style = {
      font: {
        bold: true,
      }
    }

    ws.getCell('A6').style = {
      font: {
        bold: true
      }
    }
    ws.getCell('D6').style = {
      font: {
        bold: true
      }
    }

    ws.getCell('A9').style = {
      font: {
        bold: true
      }
    }
  
  

    wb.xlsx.writeBuffer().then(
      data => {
        let blob = new Blob([data], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, filename + new Date().valueOf() + EXCEL_EXTENSION)
      }
    )

  }
  public exportConsultaTitulos(data: any, filename: string) {
    let wb = new Workbook()
    let ws = wb.addWorksheet('Titulos')

    // Colores
    const STYLE_HEADER_AMARILLO : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'ffeeba' }
      },
      font: {
        bold: true,
        size: 8
      },
      border: null,
      numFmt : null,
      protection: null,
    }

    const STYLE_HEADER_AZUL : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'b8daff' }
      },
      font: {
        bold: true,
        size: 12
      },
      border: null,
      numFmt : null,
      protection: null,
    }

    ws.columns = [
      { header: 'No.Documento', key: 'documento', width: 20 },
      { header: 'Razon Social', key: 'contribuyente', width: 20 },
      { header: 'Concepto', key: 'concepto', width: 20 },
      { header: 'Fecha', key: 'fecha', width: 8 },
      { header: 'Subtotal', key: 'subtotal', width: 15 },
      { header: 'Exoneraciones', key: 'exoneraciones', width: 15 },
      { header: 'Total', key: 'total', width: 15 },
      { header: 'Estado', key: 'estado', width: 8 },
      { header: 'Usuario', key: 'usuario', width: 15 },
      { header: 'No.Documento Referencia', key: 'doc_referencia', width: 20 },
      { header: 'Motivo', key: 'anulacion_motivo', width: 10 },
      { header: 'Fecha Doc. Referencia', key: 'resolucion_fecha', width: 10 },
      { header: 'Observación', key: 'observacion', width: 20 },
      { header: 'Tasa', key: 'tasa_nombre', width: 20 },
      { header: 'Cuenta Contable', key: 'cuenta_ingreso', width: 15 },
      { header: 'Nombre Cuenta', key: 'cuenta_nombre', width: 20 },
      { header: 'Código Partida', key: 'codigo_presupuesto', width: 15 },
      { header: 'Nombre Partida', key: 'nombre_presupuesto', width: 20 },
    ]
        // console.log(data)   
        data.rows.forEach(element => {
          if(element.estado == 'A'){ Object.assign(element, { estado:'Aprobado'})}
          else if(element.estado == 'X'){ Object.assign(element, { estado:'Anulado'})}
          else if(element.estado == 'E'){ Object.assign(element, { estado:'Emitido'})}
          else if(element.estado == 'C'){ Object.assign(element, { estado:'Cancelado'})}
          else if(element.estado == 'V'){ Object.assign(element, { estado:'Convenio'})}

        });              
    ws.insertRows(2, data.rows)
    ws.getCell('A1').style = {font: {bold: true}}
    ws.getCell('B1').style = {font: {bold: true}}
    ws.getCell('C1').style = {font: {bold: true}}
    ws.getCell('D1').style = {font: {bold: true}}
    ws.getCell('E1').style = {font: {bold: true}}
    ws.getCell('F1').style = {font: {bold: true}}
    ws.getCell('G1').style = {font: {bold: true}}
    ws.getCell('H1').style = {font: {bold: true}}
    ws.getCell('I1').style = {font: {bold: true}}
    ws.getCell('J1').style = {font: {bold: true}}
    ws.getCell('K1').style = {font: {bold: true}}
    ws.getCell('L1').style = {font: {bold: true}}
    ws.getCell('M1').style = {font: {bold: true}}
    ws.getCell('N1').style = {font: {bold: true}}
    ws.getCell('O1').style = {font: {bold: true}}
    ws.getCell('P1').style = {font: {bold: true}}
    ws.getCell('Q1').style = {font: {bold: true}}
    ws.getCell('R1').style = {font: {bold: true}}

    ws.getColumn(5).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
    ws.getColumn(6).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
    ws.getColumn(7).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
    

   

    wb.xlsx.writeBuffer().then(
      data => {
        let blob = new Blob([data], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, filename + new Date().valueOf() + EXCEL_EXTENSION)
      }
    )

  }
  public exportConsultaPagos(data: any, filename: string) {
    let wb = new Workbook()
    let ws = wb.addWorksheet('Titulos')

    // Colores
    const STYLE_HEADER_AMARILLO : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'ffeeba' }
      },
      font: {
        bold: true,
        size: 8
      },
      border: null,
      numFmt : null,
      protection: null,
    }

    const STYLE_HEADER_AZUL : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'b8daff' }
      },
      font: {
        bold: true,
        size: 12
      },
      border: null,
      numFmt : null,
      protection: null,
    }
   
    ws.columns = [
      { header: 'No.Documento', key: 'documento', width: 20 },
      { header: 'Razon Social', key: 'razon_social', width: 20 },
      { header: 'Fecha', key: 'fecha', width: 8 },
      { header: 'Total', key: 'total', width: 10 },
      { header: 'Saldo', key: 'saldo', width: 10 },
      { header: 'Forma de Pago', key: 'forma_pago', width: 15},
      { header: 'Tipo de Pago', key: 'tipo_pago', width: 15 },
      { header: 'Estado', key: 'estado', width: 10 },
    ]
        // console.log(data)   
      data.rows.forEach(element => {
        Object.assign(element, { total:parseFloat(element.total), saldo:parseFloat(element.saldo)})
        
        if(element.estado == 'A'){ Object.assign(element, { estado:'Aprobado'})}
        else if(element.estado == 'X'){ Object.assign(element, { estado:'Anulado'})}
        else if(element.estado == 'E'){ Object.assign(element, { estado:'Emitido'})}
        else if(element.estado == 'C'){ Object.assign(element, { estado:'Cancelado'})}
        else if(element.estado == 'V'){ Object.assign(element, { estado:'Convenio'})}
  
      });              
    ws.insertRows(2, data.rows)

    ws.getColumn(4).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';
    ws.getColumn(5).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';
  
   

    wb.xlsx.writeBuffer().then(
      data => {
        let blob = new Blob([data], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, filename + new Date().valueOf() + EXCEL_EXTENSION)
      }
    )

  }
  public exportConsultaPagosFactura(data: any, filename: string) {
    let wb = new Workbook()
    let ws = wb.addWorksheet('Titulos')

    // Colores
    const STYLE_HEADER_AMARILLO : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'ffeeba' }
      },
      font: {
        bold: true,
        size: 8
      },
      border: null,
      numFmt : null,
      protection: null,
    }

    const STYLE_HEADER_AZUL : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'b8daff' }
      },
      font: {
        bold: true,
        size: 12
      },
      border: null,
      numFmt : null,
      protection: null,
    }
   
    ws.columns = [
      { header: 'No.Documento', key: 'documento', width: 20 },
      { header: 'No.Orden Pago', key: 'orden_pago', width: 20 },
      { header: 'No.Factura', key: 'fact_num_doc', width: 20 },
      { header: 'Razon Social', key: 'razon_social', width: 20 },
      { header: 'Fecha', key: 'fecha', width: 8 },
      { header: 'Total', key: 'total', width: 10 },
      { header: 'Saldo', key: 'saldo', width: 10 },
      { header: 'Forma de Pago', key: 'forma_pago', width: 15},
      { header: 'Tipo de Pago', key: 'tipo_pago', width: 15 },
      { header: 'Estado', key: 'estado', width: 10 },
      // { header: 'No.Documento Referencia', key: 'doc_referencia', width: 20 },
      // { header: 'Motivo', key: 'anulacion_motivo', width: 10 },
      // { header: 'Fecha Doc. Referencia', key: 'resolucion_fecha', width: 10 },
      // { header: 'Observación', key: 'observacion', width: 10 },
      // { header: 'Tasa', key: 'tasa_nombre', width: 10 },
    ]
      // console.log(data)   
      data.rows.forEach(element => {
        Object.assign(element, { total:parseFloat(element.total), saldo:parseFloat(element.saldo)})
        if(element.estado == 'A'){ Object.assign(element, { estado:'Aprobado'})}
        else if(element.estado == 'X'){ Object.assign(element, { estado:'Anulado'})}
        else if(element.estado == 'E'){ Object.assign(element, { estado:'Emitido'})}
        else if(element.estado == 'C'){ Object.assign(element, { estado:'Cancelado'})}
        else if(element.estado == 'V'){ Object.assign(element, { estado:'Convenio'})}
  
      });        
    ws.insertRows(2, data.rows)
   
    ws.getColumn(6).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';
    ws.getColumn(7).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';

    wb.xlsx.writeBuffer().then(
      data => {
        let blob = new Blob([data], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, filename + new Date().valueOf() + EXCEL_EXTENSION)
      }
    )

  }
  public exportConsultaCobros(data: any, filename: string) {
    let wb = new Workbook()
    let ws = wb.addWorksheet('Titulos')

    // Colores
    const STYLE_HEADER_AMARILLO : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'ffeeba' }
      },
      font: {
        bold: true,
        size: 8
      },
      border: null,
      numFmt : null,
      protection: null,
    }

    const STYLE_HEADER_AZUL : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'b8daff' }
      },
      font: {
        bold: true,
        size: 12
      },
      border: null,
      numFmt : null,
      protection: null,
    }
   if(data.tipo== 'TITULO'){
   
    ws.columns = [
      { header: 'No.Documento', key: 'cobro', width: 20 },
      { header: 'Razon Social', key: 'razon_social', width: 20 },
      { header: 'Tipo Documento', key: 'tipo_documento', width: 8 },
      { header: 'Número Documento', key: 'num_documento', width: 10 },
      { header: 'Fecha Cobro', key: 'fecha', width: 8 },
      { header: 'Total Cobro', key: 'total', width: 8 },
      { header: 'Estado Cobro', key: 'estado', width: 8 },
      { header: 'Título', key: 'titulo', width: 20 },
      { header: 'Total Título', key: 'valor_titulo', width: 8 },
      { header: 'Usuario Recaudador', key: 'usuario_recaudador', width: 20 },
      { header: 'Usuario Anulación', key: 'usuario_anulacion', width: 20 },
      { header: 'Cuenta Contable', key: 'cuenta_ingreso', width: 8 },
      { header: 'Nombre Cuenta', key: 'cuenta_nombre', width: 8 },
      { header: 'Código Partida', key: 'codigo_presupuesto', width: 15 },
      { header: 'Nombre Partida', key: 'nombre_presupuesto', width: 20 },
      
    ]
   }
  if(data.tipo== 'FORMAPAGO'){
 
    ws.columns = [
      { header: 'No.Documento', key: 'cobro', width: 20 },
      { header: 'Razon Social', key: 'razon_social', width: 20 },
      { header: 'Tipo Documento', key: 'tipo_documento', width: 8 },
      { header: 'Número Documento', key: 'num_documento', width: 10 },
      { header: 'Fecha Cobro', key: 'fecha', width: 8 },
      { header: 'Total Cobro', key: 'total', width: 8 },
      { header: 'Estado Cobro', key: 'estado', width: 8 },
      { header: 'Forma de Pago', key: 'tipo_pago', width: 15 },
      { header: 'Valor Pago', key: 'valor_pago', width: 8 },
      { header: 'Usuario Recaudador', key: 'usuario_recaudador', width: 20 },
      { header: 'Usuario Anulación', key: 'usuario_anulacion', width: 20 },
      { header: 'Cuenta Contable', key: 'cuenta_deudora', width: 15 },
      { header: 'Nombre Cuenta', key: 'cuenta_nombre', width: 20},
      { header: 'Código Partida', key: 'codigo_presupuesto', width: 15 },
      { header: 'Nombre Partida', key: 'nombre_presupuesto', width: 20 },
      
    ]
   }
   if(data.tipo== 'GENERAL'){
    ws.columns = [
      { header: 'No.Documento', key: 'documento', width: 20 },
      { header: 'Razon Social', key: 'razon_social', width: 20 },
      { header: 'Tipo Documento', key: 'tipo_documento', width: 8 },
      { header: 'Número Documento', key: 'num_documento', width: 10 },
      { header: 'Fecha', key: 'fecha', width: 8 },
      { header: 'Subtotal', key: 'subtotal', width: 8 },
      { header: 'Total', key: 'total', width: 8 },
      { header: 'Usuario Recaudador', key: 'usuario_recaudador', width: 20 },
      { header: 'Usuario Anulación', key: 'usuario_anulacion', width: 20 },
      // { header: 'Forma de Pago', key: 'forma_pago', width: 8 },
      { header: 'Estado', key: 'estado', width: 8 },
      { header: 'Cuenta Contable', key: 'cuenta_deudora', width: 15 },
      { header: 'Nombre Cuenta', key: 'cuenta_nombre', width: 20},
      { header: 'Código Partida', key: 'codigo_presupuesto', width: 15 },
      { header: 'Nombre Partida', key: 'nombre_presupuesto', width: 20 },
      
    ]
   }
    
    data.rows.forEach(element => {
      if(element.estado == 'A'){ Object.assign(element, { estado:'Aprobado'})}
      else if(element.estado == 'X'){ Object.assign(element, { estado:'Anulado'})}
      else if(element.estado == 'E'){ Object.assign(element, { estado:'Emitido'})}
      else if(element.estado == 'C'){ Object.assign(element, { estado:'Cancelado'})}
      else if(element.estado == 'V'){ Object.assign(element, { estado:'Convenio'})}

    }); 
        // console.log(data)   
                   
    ws.insertRows(2, data.rows)
   

    wb.xlsx.writeBuffer().then(
      data => {
        let blob = new Blob([data], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, filename + new Date().valueOf() + EXCEL_EXTENSION)
      }
    )

  }

  public exportReglasEsigef(data: any, filename: string) {
    let wb = new Workbook()
    let ws = wb.addWorksheet('Titulos')

    // Colores
    const STYLE_HEADER_AMARILLO : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'ffeeba' }
      },
      font: {
        bold: true,
        size: 8
      },
      border: null,
      numFmt : null,
      protection: null,
    }

    const STYLE_HEADER_AZUL : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'b8daff' }
      },
      font: {
        bold: true,
        size: 12
      },
      border: null,
      numFmt : null,
      protection: null,
    }
    
    ws.columns = [
      { header: 'Número', key: 'numero_regla', width: 20 },
      { header: 'Fecha', key: 'fecha', width: 20 },
      { header: 'Cta. Oficial', key: 'cuenta_oficial', width: 8 },
      { header: 'Nombre', key: 'nombre', width: 8 },
      { header: 'Tipo Movimiento', key: 'tipo_movimiento', width: 8 },
      { header: 'Debe', key: 'valor_debe_regla', width: 8 },
      { header: 'Haber', key: 'valor_haber_regla', width: 8 },
    
    ]
        // console.log(data)   
                   
    ws.insertRows(2, data.rows)
   

    wb.xlsx.writeBuffer().then(
      data => {
        let blob = new Blob([data], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, filename + new Date().valueOf() + EXCEL_EXTENSION)
      }
    )

  }

  public exportDiarioGeneralAuxiliares(data: any, filename: string) {
    let wb = new Workbook()
    let ws = wb.addWorksheet('AUXILIARES')

    // Colores
    const STYLE_HEADER_AMARILLO : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'ffeeba' }
      },
      font: {
        bold: true,
        size: 8
      },
      border: null,
      numFmt : null,
      protection: null,
    }

    const STYLE_HEADER_AZUL : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'b8daff' }
      },
      font: {
        bold: true,
        size: 12
      },
      border: null,
      numFmt : null,
      protection: null,
    }

    ws.columns = [
      { header: 'Fecha', key: 'fecha', width: 15 },
      { header: 'Número', key: 'num_doc', width: 15 },
      { header: 'Cuenta', key: 'cuenta', width: 15 },
      { header: 'Descripción', key: 'descripcion_cuenta', width: 20 },
      { header: 'Auxiliar', key: 'auxiliar_referencia', width: 20 },
      { header: 'Debe', key: 'debito', width: 8 },
      { header: 'Haber', key: 'credito', width: 8 },
      { header: 'Código Partida', key: 'codigo_partida', width: 20 },
      { header: 'Partida', key: 'partida', width: 20 },
      { header: 'valor', key: 'valor_partida', width: 20 },
    
  
    ]

    ws.insertRows(2, data.rows)

    // ws.getCell('A1').style = STYLE_HEADER_AZUL
    // ws.getCell('B1').style = STYLE_HEADER_AZUL
    // ws.getCell('C1').style = STYLE_HEADER_AZUL
    // ws.getCell('D1').style = STYLE_HEADER_AZUL
    // ws.getCell('E1').style = STYLE_HEADER_AZUL
    // ws.getCell('F1').style = STYLE_HEADER_AZUL
    // ws.getCell('G1').style = STYLE_HEADER_AZUL

    // Escribir Cabecera
  
    // ws.insertRow(1, [''])
    // ws.insertRow(1, ['ESTADO:','',data.estado])
    // ws.insertRow(1, [''])
    // ws.insertRow(1, ['GRUPO:','',data.grupo])
    // ws.insertRow(1, [''])
    // ws.insertRow(1, ['PRODUCTO:','',data.producto])
    // ws.insertRow(1, [''])
    // ws.insertRow(1, [data.title])

    // // Formato
    // ws.mergeCells('A1:G1')
    // ws.mergeCells('A2:G2')
    // ws.mergeCells('B3:C3'); ws.mergeCells('D3:E3')
    // ws.mergeCells('A4:G4')
    // ws.mergeCells('B5:C5'); ws.mergeCells('D5:E5')
    // ws.mergeCells('A6:G6')
    // ws.mergeCells('B7:C7'); ws.mergeCells('D7:E7')
    
  

    // ws.getCell('A1').style = {
    //   alignment: {
    //     horizontal: 'center'
    //   },
    //   font: {
    //     size: 18,
    //     bold: true
    //   },
    // }

    // ws.getCell('A2').style = {
    //   alignment: {
    //     horizontal: 'center'
    //   },
    //   font: {
    //     size: 18,
    //     bold: true
    //   },
    // }

    // ws.getCell('A3').style = {
    //   font: {
    //     bold: true
    //   }
    // }

    // ws.getCell('A5').style = {
    //   font: {
    //     bold: true
    //   }
    // }

    // ws.getCell('A7').style = {
    //   font: {
    //     bold: true
    //   }
    // }

    wb.xlsx.writeBuffer().then(
      data => {
        let blob = new Blob([data], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, filename + new Date().valueOf() + EXCEL_EXTENSION)
      }
    )

  }
  
  public exportFlujoEfectivo(filename: string, rep: any) {
    let wb = new Workbook()
    let ws = wb.addWorksheet('rep')
    console.log(rep);
    
    //let reverse = []
    //reverse = rep.reverse();
    const STYLE_HEADER_AMARILLO : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'000000' }
      },
      font: {
        bold: true,
        size: 8,
        color: { argb:'FFFFFF' }
      },
      border: null,
      numFmt : null,
      protection: null,
    }

    const STYLE_HEADER_AZUL : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'' }
      },
      font: {
        bold: true,
        size: 10
      },
      border: null,
      numFmt : null,
      protection: null,
    }
    let i=2;
      rep.forEach(element => {
        if(element.TIPO_CONCEPTO == 'D' || element.TIPO_CONCEPTO == 'M'){

            ws.insertRow(i, [element.CUENTA,element.CONCEPTO,parseFloat(element.ENE),parseFloat(element.FEB),parseFloat(element.MAR),parseFloat(element.ABR),parseFloat(element.MAY),parseFloat(element.JUN),parseFloat(element.JUL),parseFloat(element.AGO),parseFloat(element.SEP),parseFloat(element.OCT),parseFloat(element.NOV),parseFloat(element.DIC),parseFloat(element.TOTAL)])
            i=i+1;
          }if (element.TIPO_CONCEPTO == 'T' || element.TIPO_CONCEPTO == 'TOT' ){

            ws.insertRow(i, [element.CUENTA,element.CONCEPTO,parseFloat(element.ENE),parseFloat(element.FEB),parseFloat(element.MAR),parseFloat(element.ABR),parseFloat(element.MAY),parseFloat(element.JUN),parseFloat(element.JUL),parseFloat(element.AGO),parseFloat(element.SEP),parseFloat(element.OCT),parseFloat(element.NOV),parseFloat(element.DIC),parseFloat(element.TOTAL)])
            ws.getCell('A'+i).style = STYLE_HEADER_AZUL
            i=i+1;
        }if (element.TIPO_CONCEPTO == 'G'){

            ws.insertRow(i,[element.CUENTA,element.CONCEPTO])
            ws.getCell('A'+i).style = STYLE_HEADER_AZUL
            i=i+1;
      }
      });

    
    ws.columns = [
      { header: 'CUENTA', key: 'col1'},
      { header: 'CONCEPTO', key: 'col2'},
      { header: 'ENERO', key: 'col3'},
      { header: 'FEBRERO', key: 'col4'},
      { header: 'MARZO', key: 'col5'},
      { header: 'ABRIL', key: 'col6'},
      { header: 'MAYO', key: 'col7'},
      { header: 'JUNIO', key: 'col8'},
      { header: 'JULIO', key: 'col9'},
      { header: 'AGOSTO', key: 'col10'},
      { header: 'SEPTIEMBRE', key: 'col11'},
      { header: 'OCTUBRE', key: 'col12'},
      { header: 'NOVIEMBRE', key: 'col13'},
      { header: 'DICIEMBRE', key: 'col14'},
      { header: 'TOTAL', key: 'col15'},
    ]
    
    ws.columns.forEach(column => {
      column.width = column.header.length < 25 ? 25 : column.header.length
    })

    ws.getCell('A1').style = STYLE_HEADER_AMARILLO
    ws.getCell('B1').style = STYLE_HEADER_AMARILLO
    ws.getCell('C1').style = STYLE_HEADER_AMARILLO
    ws.getCell('D1').style = STYLE_HEADER_AMARILLO
    ws.getCell('E1').style = STYLE_HEADER_AMARILLO
    ws.getCell('F1').style = STYLE_HEADER_AMARILLO
    ws.getCell('G1').style = STYLE_HEADER_AMARILLO
    ws.getCell('H1').style = STYLE_HEADER_AMARILLO
    ws.getCell('I1').style = STYLE_HEADER_AMARILLO
    ws.getCell('J1').style = STYLE_HEADER_AMARILLO
    ws.getCell('K1').style = STYLE_HEADER_AMARILLO
    ws.getCell('L1').style = STYLE_HEADER_AMARILLO
    ws.getCell('M1').style = STYLE_HEADER_AMARILLO
    ws.getCell('N1').style = STYLE_HEADER_AMARILLO
    ws.getCell('N1').style = STYLE_HEADER_AMARILLO

    // Guarda el archivo
    wb.xlsx.writeBuffer().then(
      rep => {
        let blob = new Blob([rep], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, filename + new Date().valueOf() + EXCEL_EXTENSION)
      }
    )
  
  }
  public exportFormularioCientoTres(data: any, filename: string) {
    let wb = new Workbook()
    let ws = wb.addWorksheet('Formulario 103')
    ws.columns = [


      { header: 'Fecha', key: 'fecha_compra', width: 20 },
      { header: 'Número Factura Proveedor', key: 'factura_proveedor', width: 20 },
      { header: 'Nombre Proveedor', key: 'razon_social', width: 20 },
      { header: 'Ruc Proveedor', key: 'ruc', width: 20 },
      { header: 'Código SRI', key: 'codigo_sri', width: 20 },
      { header: 'Código Anexo SRI', key: 'codigo_anexo_sri', width: 20 },
      { header: 'Descripción', key: 'descripcion', width: 8 },
      { header: 'Base', key: 'base', width: 8 },
      { header: 'Porcentaje', key: 'porcentaje', width: 8 },
      { header: 'Valor Retención', key: 'valor_retencion', width: 15 },
      { header: 'Fecha Emisión Autorización', key: 'fecha_emision_autorizacion', width: 20 },
      { header: 'Número Retención', key: 'numero_retencion', width: 20 },
      { header: 'Autorización Retención', key: 'autorizacion_retencion', width: 20 },
    ]
    ws.insertRows(2, data.rows)
    ws.getCell('A1').style = {font: {bold: true}}
    ws.getCell('B1').style = {font: {bold: true}}
    ws.getCell('C1').style = {font: {bold: true}}
    ws.getCell('D1').style = {font: {bold: true}}
    ws.getCell('E1').style = {font: {bold: true}}
    ws.getCell('F1').style = {font: {bold: true}}
    ws.getCell('G1').style = {font: {bold: true}}
    ws.getCell('H1').style = {font: {bold: true}}
    ws.getCell('I1').style = {font: {bold: true}}
    ws.getCell('J1').style = {font: {bold: true}}
    ws.getCell('K1').style = {font: {bold: true}}
    ws.getCell('L1').style = {font: {bold: true}}
    ws.getCell('M1').style = {font: {bold: true}}

    ws.getColumn(8).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
    ws.getColumn(9).numFmt = '0.00%';
    ws.getColumn(10).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
   
 
    wb.xlsx.writeBuffer().then(
      data => {
        let blob = new Blob([data], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, filename + new Date().valueOf() + EXCEL_EXTENSION)
      }
    )

  }
  public exportFormularioCientoCuatro(data: any, filename: string) {
    let wb = new Workbook()
    let ws = wb.addWorksheet('Formulario 104')
    ws.columns = [
      { header: 'Fecha', key: 'fecha_compra', width: 20 },
      { header: 'Número Factura Proveedor', key: 'factura_proveedor', width: 20 },
      { header: 'Nombre Proveedor', key: 'razon_social', width: 20 },
      { header: 'Ruc Proveedor', key: 'ruc', width: 20 },
      { header: 'Código SRI', key: 'codigo_sri', width: 20 },
      { header: 'Código Anexo SRI', key: 'codigo_anexo_sri', width: 20 },
      { header: 'Descripción', key: 'descripcion', width: 8 },
      { header: 'Base', key: 'base', width: 8 },
      { header: 'Porcentaje', key: 'porcentaje', width: 8 },
      { header: 'Valor Retención', key: 'valor_retencion', width: 15 },
      { header: 'Fecha Emisión Autorización', key: 'fecha_emision_autorizacion', width: 20 },
      { header: 'Número Retención', key: 'numero_retencion', width: 20 },
      { header: 'Autorización Retención', key: 'autorizacion_retencion', width: 20 },
    ]
    ws.insertRows(2, data.rows)
    ws.getCell('A1').style = {font: {bold: true}}
    ws.getCell('B1').style = {font: {bold: true}}
    ws.getCell('C1').style = {font: {bold: true}}
    ws.getCell('D1').style = {font: {bold: true}}
    ws.getCell('E1').style = {font: {bold: true}}
    ws.getCell('F1').style = {font: {bold: true}}
    ws.getCell('G1').style = {font: {bold: true}}
    ws.getCell('H1').style = {font: {bold: true}}
    ws.getCell('I1').style = {font: {bold: true}}
    ws.getCell('J1').style = {font: {bold: true}}
    ws.getCell('K1').style = {font: {bold: true}}
    ws.getCell('L1').style = {font: {bold: true}}
    ws.getCell('M1').style = {font: {bold: true}} 

    ws.getColumn(8).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
    ws.getColumn(9).numFmt = '0.00%';
    ws.getColumn(10).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 

    wb.xlsx.writeBuffer().then(
      data => {
        let blob = new Blob([data], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, filename + new Date().valueOf() + EXCEL_EXTENSION)
      }
    )

  }
  public exportConsultaProveedores(data: any, filename: string) {
    let wb = new Workbook()
    let ws = wb.addWorksheet('Consulta Proveedores')
    ws.columns = [
      { header: 'Tipo Identificación', key: 'tipo_documento', width: 10 },
      { header: 'Número Identificación', key: 'num_documento', width: 20 },
      { header: 'Razón Social', key: 'razon_social', width: 30 },
      { header: 'Tipo Persona', key: 'tipo_persona', width: 10 },
      { header: 'Clase', key: 'clase', width: 10 },
      { header: 'Origen', key: 'origen', width: 10 },
      { header: 'País', key: 'pais', width: 10 },
      { header: 'Provincia', key: 'provincia', width: 10 },
      { header: 'Ciudad', key: 'ciudad', width: 20 },
      { header: 'Dirección', key: 'direccion', width: 30 },
      { header: 'Teléfono', key: 'telefono', width: 10 },
      { header: 'Correo', key: 'email', width: 10 },
      { header: 'Cuenta Bancaria Principal', key: 'num_cuenta', width: 10 },
      { header: 'Banco', key: 'entidad', width: 10 },
      { header: 'Tipo Cuenta', key: 'tipo_cuenta', width: 10 },
      { header: 'Estado', key: 'estado', width: 10 },
    
     
    ]
    ws.insertRows(2, data.rows)
    ws.getCell('A1').style = {font: {bold: true}}
    ws.getCell('B1').style = {font: {bold: true}}
    ws.getCell('C1').style = {font: {bold: true}}
    ws.getCell('D1').style = {font: {bold: true}}
    ws.getCell('E1').style = {font: {bold: true}}
    ws.getCell('F1').style = {font: {bold: true}}
    ws.getCell('G1').style = {font: {bold: true}}
    ws.getCell('H1').style = {font: {bold: true}}
    ws.getCell('I1').style = {font: {bold: true}}
    ws.getCell('J1').style = {font: {bold: true}}
    ws.getCell('K1').style = {font: {bold: true}}
    ws.getCell('L1').style = {font: {bold: true}}
    ws.getCell('M1').style = {font: {bold: true}}
    ws.getCell('N1').style = {font: {bold: true}}
    ws.getCell('O1').style = {font: {bold: true}}
    ws.getCell('P1').style = {font: {bold: true}}
    wb.xlsx.writeBuffer().then(
      data => {
        let blob = new Blob([data], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, filename + new Date().valueOf() + EXCEL_EXTENSION)
      }
    )

  }

  public exportConsultaContrataciones(data: any, filename: string) {
    let wb = new Workbook()
    let ws = wb.addWorksheet('Contrataciones')
    
    ws.columns = [
      { header: 'Código', key: 'codigo', width: 10 },
      { header: 'Tipo Regimen', key: 'tipo_regimen', width: 30 },
      { header: 'Tipo Contratación', key: 'tipo_contratacion', width: 10 },
      { header: 'Objeto de Proceso', key: 'objeto_proceso', width: 30 },
      { header: 'Estado', key: 'estado', width: 10 },
      { header: 'Presupuesto Referencial', key: 'presupuesto_referencial', width: 10 },
      { header: 'Fecha Publicación', key: 'fecha_publicacion', width:  15},
      { header: 'Delegado', key: 'delegado', width: 40 },
      { header: 'Anticipo', key: 'anticipo', width: 8 },
      { header: 'Plazo', key: 'plazo', width: 8 },
      { header: 'Forma Pago', key: 'forma_pago', width: 10 },
      { header: 'Valor Adjudicado', key: 'valor_adjudicado', width: 10 },
      { header: 'Oferente', key: 'oferente', width: 40 },
      { header: 'Ruc', key: 'ruc', width: 10 },
      { header: 'Administrador Contrato 1', key: 'administrador_contrato_1', width: 40 },
      { header: 'Administrador Contrato 2', key: 'administrador_contrato_2', width: 40 },
      { header: 'Administrador Contrato 3', key: 'administrador_contrato_3', width: 40 },
      { header: 'Fiscalizador Contrato 2', key: 'fiscalizador_contrato_2', width: 40 },
      { header: 'Firma Contrato', key: 'firma_contrato', width: 10 },
      { header: 'No. Contrato', key: 'nro_contrato', width: 10 },
      { header: 'Contrato Modificatorio', key: 'contrato_modificatorio', width: 10 },
      { header: 'Técnico Delegado', key: 'tecnico_delegado', width: 30 },
      { header: 'Fecha Acta Recepcion Provisional', key: 'fecha_acta_recepcion_provisional', width: 15 },
      { header: 'Fecha Acta Recepcion Definitiva', key: 'fecha_acta_recepcion_definitiva', width: 15 },
      { header: 'Observaciones', key: 'observaciones', width: 40 },
    ]

    ws.insertRows(2, data.rows)
    ws.getCell('A1').style = {font: {bold: true}}
    ws.getCell('B1').style = {font: {bold: true}}
    ws.getCell('C1').style = {font: {bold: true}}
    ws.getCell('D1').style = {font: {bold: true}}
    ws.getCell('E1').style = {font: {bold: true}}
    ws.getCell('F1').style = {font: {bold: true}}
    ws.getCell('G1').style = {font: {bold: true}}
    ws.getCell('H1').style = {font: {bold: true}}
    ws.getCell('I1').style = {font: {bold: true}}
    ws.getCell('J1').style = {font: {bold: true}}
    ws.getCell('K1').style = {font: {bold: true}}
    ws.getCell('L1').style = {font: {bold: true}}
    ws.getCell('M1').style = {font: {bold: true}}
    ws.getCell('N1').style = {font: {bold: true}}
    ws.getCell('O1').style = {font: {bold: true}}
    ws.getCell('P1').style = {font: {bold: true}}
    ws.getCell('Q1').style = {font: {bold: true}}
    ws.getCell('R1').style = {font: {bold: true}}
    ws.getCell('S1').style = {font: {bold: true}}
    ws.getCell('T1').style = {font: {bold: true}}
    ws.getCell('U1').style = {font: {bold: true}}
    ws.getCell('V1').style = {font: {bold: true}}
    ws.getCell('W1').style = {font: {bold: true}}
    ws.getCell('X1').style = {font: {bold: true}}
    ws.getCell('Y1').style = {font: {bold: true}}
    ws.getCell('Z1').style = {font: {bold: true}}

    wb.xlsx.writeBuffer().then(
      data => {
        let blob = new Blob([data], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, filename + new Date().valueOf() + EXCEL_EXTENSION)
      }
    )

  }

  public exportConsultaCataElectronico(data: any, filename: string) {
    let wb = new Workbook()
    let ws = wb.addWorksheet('Catalogo Eletrónico')
    
    ws.columns = [
      { header: 'Solicitud', key: 'id_solicitud', width: 10 },
      { header: 'Nombre Proceso', key: 'nombre_proceso', width: 30 },
      { header: 'Código Catalogo Electrónico', key: 'ce_cod_cate', width: 20 },
      { header: 'Ordenes', key: 'ordenes', width: 30 },
      { header: 'Total', key: 'total', width: 15 },
      { header: 'Resolución', key: 'resolucion', width: 15 },
      { header: 'Fecha Aceptación', key: 'fecha_aceptacion', width:  15},
      { header: 'Estado', key: 'estado', width: 10 },
      { header: 'Observación', key: 'observacion', width: 40 },
      { header: 'Administrados Contrato', key: 'administrador_contrato', width: 40 },
    ]

    ws.insertRows(2, data.rows)
    ws.getCell('A1').style = {font: {bold: true}}
    ws.getCell('B1').style = {font: {bold: true}}
    ws.getCell('C1').style = {font: {bold: true}}
    ws.getCell('D1').style = {font: {bold: true}}
    ws.getCell('E1').style = {font: {bold: true}}
    ws.getCell('F1').style = {font: {bold: true}}
    ws.getCell('G1').style = {font: {bold: true}}
    ws.getCell('H1').style = {font: {bold: true}}
    ws.getCell('I1').style = {font: {bold: true}}
    ws.getCell('J1').style = {font: {bold: true}}
    
    wb.xlsx.writeBuffer().then(
      data => {
        let blob = new Blob([data], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, filename + new Date().valueOf() + EXCEL_EXTENSION)
      }
    )

  }

  public exportConsultaInfimas(data: any, filename: string) {
    let wb = new Workbook()
    let ws = wb.addWorksheet('Infimas')
    
    ws.columns = [
      { header: 'Requiriente', key: 'requiriente', width: 10 },
      { header: 'No. Oficio', key: 'nro_oficio', width: 30 },
      { header: 'Sumilla', key: 'sumilla', width: 10 },
      { header: 'Memo de compras Públicas/Oficio de Publicación', key: 'oficio_memo', width: 30 },
      { header: 'Fecha recibido proeeduria', key: 'fecha_recibido_proveeduria', width: 10 },
      { header: 'Código Publicación', key: 'codigo_publicacion', width: 10 },
      { header: 'Descripcion', key: 'descripcion', width:  15},
      { header: 'Cantidad', key: 'cantidad', width: 40 },
      { header: 'Unidad de Medida', key: 'unidad_medida', width: 8 },
      { header: 'Precio Unitario', key: 'precio_unitario', width: 8 },
      { header: 'Sub Total', key: 'subtotal', width: 10 },
      { header: 'Objeto', key: 'objeto', width: 20 },
      { header: 'Estado', key: 'estado', width: 10 },
      { header: 'Oficio IDP', key: 'oficio_idp', width: 10 },
      { header: 'IDP', key: 'idp', width: 20 },
      { header: 'Orden de Compra', key: 'orden_compra', width: 20 },
      { header: 'Proveedor Adjudicado', key: 'proveedor_adjudicado', width: 40 },
      { header: 'Ruc', key: 'ruc', width: 15 },
      { header: 'No pic', key: 'no_pic', width: 10 },
      { header: 'Fecha Publicación', key: 'fecha_publicacion', width: 10 },
      { header: 'Observación', key: 'observacion', width: 10 },
    ]

    ws.insertRows(2, data.rows)
    ws.getCell('A1').style = {font: {bold: true}}
    ws.getCell('B1').style = {font: {bold: true}}
    ws.getCell('C1').style = {font: {bold: true}}
    ws.getCell('D1').style = {font: {bold: true}}
    ws.getCell('E1').style = {font: {bold: true}}
    ws.getCell('F1').style = {font: {bold: true}}
    ws.getCell('G1').style = {font: {bold: true}}
    ws.getCell('H1').style = {font: {bold: true}}
    ws.getCell('I1').style = {font: {bold: true}}
    ws.getCell('J1').style = {font: {bold: true}}
    ws.getCell('K1').style = {font: {bold: true}}
    ws.getCell('L1').style = {font: {bold: true}}
    ws.getCell('M1').style = {font: {bold: true}}
    ws.getCell('N1').style = {font: {bold: true}}
    ws.getCell('O1').style = {font: {bold: true}}
    ws.getCell('P1').style = {font: {bold: true}}
    ws.getCell('Q1').style = {font: {bold: true}}
    ws.getCell('R1').style = {font: {bold: true}}
    ws.getCell('S1').style = {font: {bold: true}}
    ws.getCell('T1').style = {font: {bold: true}}
    ws.getCell('U1').style = {font: {bold: true}}
   
    wb.xlsx.writeBuffer().then(
      data => {
        let blob = new Blob([data], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, filename + new Date().valueOf() + EXCEL_EXTENSION)
      }
    )

  }
  
  public exportAsExcelFile(json: any[], filename: string) {
    let wb = new Workbook()
    let ws = wb.addWorksheet('data')

    

    // Se recibe un array de objetos

    // La primera fila debe ser los keys de uno de los objetos
    let cabecera = Object.keys(json[0])
    ws.addRow(cabecera)
    // Bold y centrado
    ws.eachRow((r, rN) => {
      r.eachCell((c, cN) => {
        c.font = {
          bold: true,
          size: 14
        }
        c.alignment = {
          horizontal: 'center',
          vertical: 'middle'
        }
      })
    })

    // Agregar los values de los demas objetos como rows
    json.forEach(elem => {
      let keys = Object.keys(elem)
      let row = []
      keys.forEach((key: string) => row.push(elem[key] ?? 0))
      ws.addRow(row)
    })

    // Guarda el archivo
    wb.xlsx.writeBuffer().then(
      data => {
        let blob = new Blob([data], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, filename + new Date().valueOf() + EXCEL_EXTENSION)
      }
    )

  }

  public exportExcelCuentasCompras(data: any, filename: string) {
    let wb = new Workbook()
    let ws = wb.addWorksheet('Cuentas')
    
    ws.columns = [
      { header: 'Cuenta', key: 'cuenta_detalle', width: 20 },
      { header: 'Código', key: 'codigo', width: 30 },
      { header: 'Descripción', key: 'observacion', width: 20 },
      { header: 'Cantidad', key: 'cantidad', width: 20 },
      { header: 'P/U', key: 'precio', width: 15 },
      { header: 'Subtotal', key: 'subtotalItems', width: 15 },
      { header: 'Descuento', key: 'desc', width:  15},
      { header: 'Impuesto', key: 'impuesto', width: 10 },
      { header: 'Ice Sri', key: 'ice_sri', width:20},
      { header: 'Total', key: 'totalItems', width: 20 },
      { header: 'Ret. Fuente', key: 'rte_fuente', width: 20 },
      { header: 'Cuenta Ret. Fuente', key: 'cuenta_rte_fuente', width: 20 },
      { header: 'Ret. IVA', key: 'rte_iva', width: 20 },
      { header: 'Centro', key: 'centro_nombre', width: 20 },
      { header: 'IVA', key: 'iva_detalle', width: 20 },
      { header: 'ICE', key: 'ice_detalle', width: 20 },
      { header: 'Cod. Partida', key: 'codigo_presupuesto', width: 20 },
      { header: 'Cod. Cuenta Por Pagar', key: 'cod_cuenta_por_pagar', width: 20 },
      { header: 'Cuenta por Pagar', key: 'cuenta_por_pagar', width: 20 },
      { header: 'Cod. Cuenta Rte Fuente', key: 'cod_cuenta_impuesto_rtefte', width: 20 },
      { header: 'Cuenta Rte Fuente', key: 'cuenta_impuesto_rtefte', width: 20 },
      { header: 'Valor Rte Fuente', key: 'retencion', width: 20 },
      { header: 'Cod Rte IVA', key: 'cod_cuenta_impuesto_iva', width: 20 },
      { header: 'Cuenta Rte IVA', key: 'nombre_cuenta_impuesto_iva', width: 20 },
      { header: 'Valor Rte IVA', key: 'retencion_iva', width: 20 },

    ]
                        
    ws.insertRows(2, data.rows)
    ws.getCell('A1').style = {font: {bold: true}}
    ws.getCell('B1').style = {font: {bold: true}}
    ws.getCell('C1').style = {font: {bold: true}}
    ws.getCell('D1').style = {font: {bold: true}}
    ws.getCell('E1').style = {font: {bold: true}}
    ws.getCell('F1').style = {font: {bold: true}}
    ws.getCell('G1').style = {font: {bold: true}}
    ws.getCell('H1').style = {font: {bold: true}}
    ws.getCell('I1').style = {font: {bold: true}}
    ws.getCell('J1').style = {font: {bold: true}}
    ws.getCell('K1').style = {font: {bold: true}}
    ws.getCell('L1').style = {font: {bold: true}}
    ws.getCell('M1').style = {font: {bold: true}}
    ws.getCell('N1').style = {font: {bold: true}}
    ws.getCell('O1').style = {font: {bold: true}}
    ws.getCell('P1').style = {font: {bold: true}}
    ws.getCell('Q1').style = {font: {bold: true}}
    ws.getCell('R1').style = {font: {bold: true}}
    ws.getCell('S1').style = {font: {bold: true}}
    ws.getCell('T1').style = {font: {bold: true}}
    ws.getCell('U1').style = {font: {bold: true}}
    ws.getCell('V1').style = {font: {bold: true}}
    ws.getCell('W1').style = {font: {bold: true}}
    ws.getCell('X1').style = {font: {bold: true}}
    ws.getCell('Y1').style = {font: {bold: true}}
    
    wb.xlsx.writeBuffer().then(
      data => {
        let blob = new Blob([data], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, filename + new Date().valueOf() + EXCEL_EXTENSION)
      }
    )

  }
  public exportExcelAsientoCompras(data: any, filename: string) {
    let wb = new Workbook()
    let ws = wb.addWorksheet('Asiento')
    
    ws.columns = [
      { header: 'Cuenta', key: 'account', width: 20 },
      { header: 'Nombre', key: 'name', width: 30 },
      { header: 'Tipo', key: 'tipo', width: 20 },
      { header: 'Tipo Detalle', key: 'tipo_detalle', width: 20 },
      { header: 'Detalle', key: 'detail', width: 20 },
      { header: 'Centro', key: 'centro', width: 10 },
      { header: 'Débito', key: 'debit', width: 15 },
      { header: 'Crédito', key: 'credit', width: 15 },
      { header: 'Codigo partida', key: 'codigo', width:  15},
      { header: 'Partida presupuestaria', key: 'presupuesto', width: 20 },
      { header: 'Valor', key: 'valor_presupuesto', width: 10 },
    ]
                        
    ws.insertRows(2, data.rows)
    ws.getCell('A1').style = {font: {bold: true}}
    ws.getCell('B1').style = {font: {bold: true}}
    ws.getCell('C1').style = {font: {bold: true}}
    ws.getCell('D1').style = {font: {bold: true}}
    ws.getCell('E1').style = {font: {bold: true}}
    ws.getCell('F1').style = {font: {bold: true}}
    ws.getCell('G1').style = {font: {bold: true}}
    ws.getCell('H1').style = {font: {bold: true}}
    ws.getCell('I1').style = {font: {bold: true}}
  
    wb.xlsx.writeBuffer().then(
      data => {
        let blob = new Blob([data], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, filename + new Date().valueOf() + EXCEL_EXTENSION)
      }
    )

  }

  public exportExcelMayorCuentas(data: any, filename: string) {
    let wb = new Workbook()
    let ws = wb.addWorksheet('Mayor de Cuentas')
    const STYLE_HEADER_AZUL : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'' }
      },
      font: {
        bold: true,
        size: 14
      },
      border: null,
      numFmt : null,
      protection: null,
    }
    const STYLE_HEADER_DESCRIPCION : Style = {
      alignment: {
        horizontal: 'right',
        vertical: 'middle'
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'' }
      },
      font: {
        bold: true,
        size: 12
      },
      border: null,
      numFmt : null,
      protection: null,
    }
    
    ws.columns = [
      { header: 'Fecha', key: 'fecha', width: 20 },
      { header: 'Cuenta', key: 'codigo', width: 30 },
      { header: 'Tipo', key: 'nombre', width: 20 },
      { header: 'Asiento', key: 'asiento', width: 30 },
      { header: 'Numero', key: 'ref_num_doc', width: 30 },
      { header: 'Detalle', key: 'glosa', width: 40 },
      { header: 'Centro de Costo', key: 'centro_costo', width: 20 },
      { header: 'Debe', key: 'valor_deb', width: 15 },
      { header: 'Haber', key: 'valor_cre', width: 15 },
      { header: 'Saldo', key: 'saldo', width:  15},
    ]

                  
    //ws.insertRows(2, data.rows)

    let i=2;
    let control_cuenta = ''
    let saldo_anterior = 0
    data.rows.forEach(element => {
      if(control_cuenta!=element.codigo){
        saldo_anterior= parseFloat(element.saldo_inicial)
        control_cuenta = element.codigo
        ws.insertRow(i,[  '',element.codigo,element.nom_cuenta,'','','','','Saldo Anterior:','',saldo_anterior])
        ws.getCell('B'+i).style = {font: {bold: true}}
        ws.getCell('C'+i).style = {font: {bold: true}}
        ws.getCell('H'+i).style = {font: {bold: true}}
        i=i+1;
      }
        saldo_anterior += parseFloat(element.valor_deb) - parseFloat(element.valor_cre)
        ws.insertRow(i,[  element.fecha,
                          element.codigo,
                          element.nom_cuenta,
                          element.asiento,
                          element.ref_num_doc,
                          element.glosa,
                          element.centro_costo,
                          parseFloat(element.valor_deb),
                          parseFloat(element.valor_cre),
                          saldo_anterior])
        i=i+1;
    });
    ws.getCell('A1').style = {font: {bold: true}}
    ws.getCell('B1').style = {font: {bold: true}}
    ws.getCell('C1').style = {font: {bold: true}}
    ws.getCell('D1').style = {font: {bold: true}}
    ws.getCell('E1').style = {font: {bold: true}}
    ws.getCell('F1').style = {font: {bold: true}}
    ws.getCell('G1').style = {font: {bold: true}}
    ws.getCell('H1').style = {font: {bold: true}}
    ws.getCell('I1').style = {font: {bold: true}}
    ws.getCell('J1').style = {font: {bold: true}}

     //    Escribir Cabecera
  
 
    // ws.insertRow(1, ['','','CUENTA DESDE:',data.fecha_desde,'CUENTA HASTA:',data.fecha_hasta])
    ws.insertRow(1, [''])
    ws.insertRow(1, ['','','FECHA DESDE:',data.fecha_desde,'FECHA HASTA:',data.fecha_hasta])
    ws.insertRow(1, ['','','DIRECCIÓN:',data.direccion])
    ws.insertRow(1, ['','','RAZON COMERCIAL:',data.razon_comercial])
    ws.insertRow(1, ['','','RAZON SOCIAL:',data.razon_social])
    ws.insertRow(1, [''])
    ws.insertRow(1, [data.title])
    ws.insertRow(1, [''])

    ws.getCell('A2:J2').style = STYLE_HEADER_AZUL
    ws.getCell('C4').style = {font: {bold: true}}
    ws.getCell('C5').style = {font: {bold: true}}
    ws.getCell('C6').style = {font: {bold: true}}
    ws.getCell('C7').style = {font: {bold: true}}
    ws.getCell('E7').style = {font: {bold: true}}
   // ws.getCell('A4:C4').style = STYLE_HEADER_DESCRIPCION

    // // // Formato
    ws.mergeCells('A1:J1')
    ws.mergeCells('A2:J2')
    ws.mergeCells('A3:J3')
    
   
    ws.getColumn(8).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';
    ws.getColumn(9).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';
    ws.getColumn(10).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';
  
  
    wb.xlsx.writeBuffer().then(
      data => {
        let blob = new Blob([data], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, filename + new Date().valueOf() + EXCEL_EXTENSION)
      }
    )

  }
  public exportExcelSaldosEmpleados(data: any, filename: string) {
    let wb = new Workbook()
    let ws = wb.addWorksheet('Saldo de Empleados')
    const STYLE_HEADER_AZUL : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'' }
      },
      font: {
        bold: true,
        size: 14
      },
      border: null,
      numFmt : null,
      protection: null,
    }
    const STYLE_HEADER_DESCRIPCION : Style = {
      alignment: {
        horizontal: 'right',
        vertical: 'middle'
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'' }
      },
      font: {
        bold: true,
        size: 12
      },
      border: null,
      numFmt : null,
      protection: null,
    }
    
    ws.columns = [
      { header: 'Fecha', key: 'fecha', width: 15 },
      { header: 'Tipo Movimiento', key: 'tipo_movimineto', width: 40 },
      { header: 'Documento', key: 'documento', width: 20 },
      { header: 'Detalle', key: 'detalle', width: 40 },
      { header: 'Valor', key: 'valor', width: 15 },
      { header: 'Saldo', key: 'saldo', width:  15},
    ]

                  
    //ws.insertRows(2, data.rows)

    let i=2;
    let control_empleado = ''
   
    let totalValor = data.rows.reduce((suma: number, x: any) => suma + parseFloat(x.valor), 0)
    let totalSaldo = data.rows.reduce((suma: number, x: any) => suma + parseFloat(x.saldo), 0)
    //let saldo_anterior = 0
    data.rows.forEach(element => {
      if(control_empleado!=element.emp_full_nombre){
        
      //  saldo_anterior= parseFloat(element.saldo_inicial)
      control_empleado = element.emp_full_nombre
        ws.insertRow(i,[  '',element.emp_full_nombre,'','','','',''])
        ws.getCell('B'+i).style = {font: {bold: true}}
        ws.getCell('C'+i).style = {font: {bold: true}}
        ws.getCell('H'+i).style = {font: {bold: true}}
        
        i=i+1;
      }
        // let totalValorEmp = element.rows.reduce((suma: number, x: any) => suma + parseFloat(x.valor), 0)
        // let totalSaldoEmp = element.rows.reduce((suma: number, x: any) => suma + parseFloat(x.saldo), 0)
        //saldo_anterior += parseFloat(element.valor_deb) - parseFloat(element.valor_cre)
        ws.insertRow(i,[  element.fecha,
                          element.tipo_movimiento,
                          element.documento,
                          element.detalle, 
                          parseFloat(element.valor),
                          parseFloat(element.saldo)])
       // ws.insertRow(i+1,[  '','','','','',totalValorEmp,totalSaldoEmp])
        i=i+1;
       

        
       
    });
    ws.insertRow(i,[  '','','','',totalValor,totalSaldo])


    ws.getCell('A1').style = {font: {bold: true}}
    ws.getCell('B1').style = {font: {bold: true}}
    ws.getCell('C1').style = {font: {bold: true}}
    ws.getCell('D1').style = {font: {bold: true}}
    ws.getCell('E1').style = {font: {bold: true}}
    ws.getCell('F1').style = {font: {bold: true}}
     //    Escribir Cabecera
  
 
    // ws.insertRow(1, ['','','CUENTA DESDE:',data.fecha_desde,'CUENTA HASTA:',data.fecha_hasta])
    ws.insertRow(1, [''])
    ws.insertRow(1, ['','','FECHA DESDE:',data.fecha_desde,'FECHA HASTA:',data.fecha_hasta])
    ws.insertRow(1, ['','','DIRECCIÓN:',data.direccion])
    ws.insertRow(1, ['','','RAZON COMERCIAL:',data.razon_comercial])
    ws.insertRow(1, ['','','RAZON SOCIAL:',data.razon_social])
    ws.insertRow(1, [''])
    ws.insertRow(1, [data.title])
    ws.insertRow(1, [''])

    ws.getCell('A2:J2').style = STYLE_HEADER_AZUL
    ws.getCell('C4').style = {font: {bold: true}}
    ws.getCell('C5').style = {font: {bold: true}}
    ws.getCell('C6').style = {font: {bold: true}}
    ws.getCell('C7').style = {font: {bold: true}}
    ws.getCell('E7').style = {font: {bold: true}}
   // ws.getCell('A4:C4').style = STYLE_HEADER_DESCRIPCION

    // // // Formato
    ws.mergeCells('A1:J1')
    ws.mergeCells('A2:J2')
    ws.mergeCells('A3:J3')
    
   
    ws.getColumn(5).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
    ws.getColumn(6).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
  
  
    wb.xlsx.writeBuffer().then(
      data => {
        let blob = new Blob([data], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, filename + new Date().valueOf() + EXCEL_EXTENSION)
      }
    )

  }

  

  public exportExcelEstadoResultMensual(data: any, filename: string) {
    let wb = new Workbook()
    let ws = wb.addWorksheet('Estado de Resultados Mensual')
    const STYLE_HEADER_AZUL : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'' }
      },
      font: {
        bold: true,
        size: 14
      },
      border: null,
      numFmt : null,
      protection: null,
    }
    const STYLE_HEADER_DESCRIPCION : Style = {
      alignment: {
        horizontal: 'right',
        vertical: 'middle'
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'' }
      },
      font: {
        bold: true,
        size: 12
      },
      border: null,
      numFmt : null,
      protection: null,
    }
    
    ws.columns = [
      { header: 'Código', key: 'codigo', width: 15 },
      { header: 'Cuenta', key: 'nombre', width: 40 },
      { header: 'Enero', key: 'ene', width: 20 },
      { header: 'Febrero', key: 'feb', width: 20 },
      { header: 'Marzo', key: 'mar', width: 20 },
      { header: 'Abril', key: 'abr', width: 20 },
      { header: 'Mayo', key: 'may', width: 20 },
      { header: 'Junio', key: 'jun', width: 20 },
      { header: 'Julio', key: 'jul', width: 20 },
      { header: 'Agosto', key: 'ago', width: 20 },
      { header: 'Septiembre', key: 'sep', width:  20},
      { header: 'Octubre', key: 'oct', width:  20},
      { header: 'Noviembre', key: 'nov', width:  20},
      { header: 'Dicienbre', key: 'dic', width:  20},
      { header: 'Total', key: 'total', width:  20},
      //{ header: 'Calse', key: 'clase', width:  20},
    ]


  

    // data.rows.forEach(e => {
            
    //   Object.assign(e, { 
    //     ene: e.ene < 0 ? e.ene * -1 : e.ene,
    //     feb: e.feb < 0 ? e.feb * -1 : e.feb,
    //     mar: e.mar < 0 ? e.mar * -1 : e.mar,
    //     abr: e.abr < 0 ? e.abr * -1 : e.abr,
    //     may: e.may < 0 ? e.may * -1 : e.may,
    //     jun: e.jun < 0 ? e.jun * -1 : e.jun,
    //     jul: e.jul < 0 ? e.jul * -1 : e.jul,
    //     ago: e.ago < 0 ? e.ago * -1 : e.ago,
    //     sep: e.sep < 0 ? e.sep * -1 : e.sep,
    //     oct: e.oct < 0 ? e.oct * -1 : e.oct,
    //     nov: e.nov < 0 ? e.nov * -1 : e.nov,
    //     dic: e.dic < 0 ? e.dic * -1 : e.dic,
    //     total: e.total < 0 ? e.total * -1 : e.total});
    //   })             
    ws.insertRows(2, data.rows)

    // data.rows.forEach(element => {
    //   if(element.nivel==2){
        
    //     ws.getCell('A'+i).style = {font: {bold: true}}
    //     ws.getCell('C'+i).style = {font: {bold: true}}
    //     ws.getCell('A1').style = {font: {bold: true}}
    //     ws.getCell('B1').style = {font: {bold: true}}
    //     ws.getCell('C1').style = {font: {bold: true}}
    //     ws.getCell('D1').style = {font: {bold: true}}
    //     ws.getCell('E1').style = {font: {bold: true}}
    //     ws.getCell('F1').style = {font: {bold: true}}
    //     ws.getCell('G1').style = {font: {bold: true}}
    //     ws.getCell('H1').style = {font: {bold: true}}
    //     ws.getCell('I1').style = {font: {bold: true}}
    //     ws.getCell('J1').style = {font: {bold: true}}
    //     ws.getCell('K1').style = {font: {bold: true}}
    //     ws.getCell('L1').style = {font: {bold: true}}
    //     ws.getCell('M1').style = {font: {bold: true}}
    //     ws.getCell('N1').style = {font: {bold: true}}
    //     i=i+1;
    //   }
       
    //     ws.insertRow(i,[  element.fecha,
    //                       element.codigo,
    //                       element.nom_cuenta,
    //                       element.asiento,
    //                       element.ref_num_doc,
    //                       element.glosa,
    //                       element.centro_costo,
    //                       element.valor_deb,
    //                       element.valor_cre,
    //                       saldo_anterior])
    //     i=i+1;
    // });
    ws.getCell('A1').style = {font: {bold: true}}
    ws.getCell('B1').style = {font: {bold: true}}
    ws.getCell('C1').style = {font: {bold: true}}
    ws.getCell('D1').style = {font: {bold: true}}
    ws.getCell('E1').style = {font: {bold: true}}
    ws.getCell('F1').style = {font: {bold: true}}
    ws.getCell('G1').style = {font: {bold: true}}
    ws.getCell('H1').style = {font: {bold: true}}
    ws.getCell('I1').style = {font: {bold: true}}
    ws.getCell('J1').style = {font: {bold: true}}
    ws.getCell('K1').style = {font: {bold: true}}
    ws.getCell('L1').style = {font: {bold: true}}
    ws.getCell('M1').style = {font: {bold: true}}
    ws.getCell('N1').style = {font: {bold: true}}
    ws.getCell('O1').style = {font: {bold: true}}

    ws.getColumn(3).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';
    ws.getColumn(4).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';
    ws.getColumn(5).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';
    ws.getColumn(6).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';
    ws.getColumn(7).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';
    ws.getColumn(8).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';
    ws.getColumn(9).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';
    ws.getColumn(10).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';
    ws.getColumn(11).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';
    ws.getColumn(12).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';
    ws.getColumn(13).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';
    ws.getColumn(14).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';
    ws.getColumn(15).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';

    //    Escribir Cabecera
    ws.insertRow(1, ['','','FECHA DESDE:',data.fecha_desde,'FECHA HASTA:',data.fecha_hasta])
    ws.insertRow(1, [''])
    ws.insertRow(1, [data.title])
    ws.insertRow(1, [''])

    ws.getCell('A2:N2').style = STYLE_HEADER_AZUL
    
   // ws.getCell('A4:C4').style = STYLE_HEADER_DESCRIPCION

    // // // Formato
    ws.mergeCells('A2:N2')
    // ws.mergeCells('A2:J2')
    // ws.mergeCells('A3:J3')
  
    wb.xlsx.writeBuffer().then(
      data => {
        let blob = new Blob([data], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, filename + new Date().valueOf() + EXCEL_EXTENSION)
      }
    )

  }

  public exportExcelBalanceGralMensual(data: any, filename: string){
    let wb = new Workbook()
    let ws = wb.addWorksheet('Balance General Mensual')
    const STYLE_HEADER_AZUL : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'' }
      },
      font: {
        bold: true,
        size: 14
      },
      border: null,
      numFmt : null,
      protection: null,
    }
    const STYLE_HEADER_DESCRIPCION : Style = {
      alignment: {
        horizontal: 'right',
        vertical: 'middle'
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'' }
      },
      font: {
        bold: true,
        size: 12
      },
      border: null,
      numFmt : null,
      protection: null,
    }
    
    ws.columns = [
      { header: 'Código', key: 'codigo', width: 15 },
      { header: 'Cuenta', key: 'nombre', width: 40 },
      { header: 'Enero', key: 'ene', width: 20 },
      { header: 'Febrero', key: 'feb', width: 20 },
      { header: 'Marzo', key: 'mar', width: 20 },
      { header: 'Abril', key: 'abr', width: 20 },
      { header: 'Mayo', key: 'may', width: 20 },
      { header: 'Junio', key: 'jun', width: 20 },
      { header: 'Julio', key: 'jul', width: 20 },
      { header: 'Agosto', key: 'ago', width: 20 },
      { header: 'Septiembre', key: 'sep', width:  20},
      { header: 'Octubre', key: 'oct', width:  20},
      { header: 'Noviembre', key: 'nov', width:  20},
      { header: 'Dicienbre', key: 'dic', width:  20},
      { header: 'Total', key: 'total', width:  20},
    ]

                  
    ws.insertRows(2, data.rows)
    ws.getCell('A1').style = {font: {bold: true}}
    ws.getCell('B1').style = {font: {bold: true}}
    ws.getCell('C1').style = {font: {bold: true}}
    ws.getCell('D1').style = {font: {bold: true}}
    ws.getCell('E1').style = {font: {bold: true}}
    ws.getCell('F1').style = {font: {bold: true}}
    ws.getCell('G1').style = {font: {bold: true}}
    ws.getCell('H1').style = {font: {bold: true}}
    ws.getCell('I1').style = {font: {bold: true}}
    ws.getCell('J1').style = {font: {bold: true}}
    ws.getCell('K1').style = {font: {bold: true}}
    ws.getCell('L1').style = {font: {bold: true}}
    ws.getCell('M1').style = {font: {bold: true}}
    ws.getCell('N1').style = {font: {bold: true}}
    ws.getCell('O1').style = {font: {bold: true}}
     //    Escribir Cabecera

     ws.insertRow(1, ['','','','','','PERÍODO:'+ data.periodo,'',''])
     ws.insertRow(1, [''])
     ws.insertRow(1, [data.title])
     ws.insertRow(1, [''])

     ws.getCell('A2:N2').style = STYLE_HEADER_AZUL
       // // // Formato
    ws.mergeCells('A2:N2')
    ws.mergeCells('F4:H4')
   

    ws.getColumn(3).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';
    ws.getColumn(4).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';
    ws.getColumn(5).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';
    ws.getColumn(6).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';
    ws.getColumn(7).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';
    ws.getColumn(8).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';
    ws.getColumn(9).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';
    ws.getColumn(10).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';
    ws.getColumn(11).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';
    ws.getColumn(12).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';
    ws.getColumn(13).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';
    ws.getColumn(14).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';
    ws.getColumn(15).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';

    ws.getCell('H4').numFmt =null

    wb.xlsx.writeBuffer().then(
      data => {
        let blob = new Blob([data], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, filename + new Date().valueOf() + EXCEL_EXTENSION)
      }
    )

  }

  public exportExcelDecimoTercero(data: any, filename: string) {
    let wb = new Workbook()
    let ws = wb.addWorksheet('Decimo Tercero')
    const STYLE_HEADER_AZUL : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'' }
      },
      font: {
        bold: true,
        size: 14
      },
      border: null,
      numFmt : null,
      protection: null,
    }
    const STYLE_HEADER_DESCRIPCION : Style = {
      alignment: {
        horizontal: 'right',
        vertical: 'middle'
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'' }
      },
      font: {
        bold: true,
        size: 12
      },
      border: null,
      numFmt : null,
      protection: null,
    }

   
    
    ws.columns = [
      { header: 'Cédula', key: 'cedula', width: 20 },
      { header: 'Apellidos', key: 'apellidos', width: 30 },
      { header: 'Nombres', key: 'nombres', width: 30 },
      { header: 'Dias Trabajados', key: 'dias_trabajados', width: 10 },
      { header: 'Total Ganado', key: 'total_ganado', width: 15 },
      { header: 'Total Devengado', key: 'total_devengado', width: 15 },
      { header: 'Valor Retención', key: 'valor_retencion_decimo', width: 15 },
      { header: 'Valor Decimo', key: 'valor_decimo', width: 15 },
      { header: 'Meses Provisión', key: 'meses_provision', width: 10 },
      { header: 'Período Desde', key: 'periodo_desde', width: 15 },
      { header: 'Período Hasta', key: 'periodo_hasta', width:  15},
    ]
   
    ws.insertRows(2, data.rows)
    ws.getCell('A1').style = {font: {bold: true}}
    ws.getCell('B1').style = {font: {bold: true}}
    ws.getCell('C1').style = {font: {bold: true}}
    ws.getCell('D1').style = {font: {bold: true}}
    ws.getCell('E1').style = {font: {bold: true}}
    ws.getCell('F1').style = {font: {bold: true}}
    ws.getCell('G1').style = {font: {bold: true}}
    ws.getCell('H1').style = {font: {bold: true}}
    ws.getCell('I1').style = {font: {bold: true}}
    ws.getCell('J1').style = {font: {bold: true}}
    ws.getCell('K1').style = {font: {bold: true}}

     //    Escribir Cabecera
  
 
    // ws.insertRow(1, ['','','CUENTA DESDE:',data.fecha_desde,'CUENTA HASTA:',data.fecha_hasta])
    ws.insertRow(1, [''])
    ws.insertRow(1, ['','','FECHA DESDE:',data.fecha_desde,'FECHA HASTA:',data.fecha_hasta])
    ws.insertRow(1, ['','','DIRECCIÓN:',data.direccion])
    ws.insertRow(1, ['','','RAZON COMERCIAL:',data.razon_comercial])
    ws.insertRow(1, ['','','RAZON SOCIAL:',data.razon_social])
    ws.insertRow(1, [''])
    ws.insertRow(1, [data.title])
    ws.insertRow(1, [''])

    ws.getCell('A2:K2').style = STYLE_HEADER_AZUL
    ws.getCell('C4').style = {font: {bold: true}}
    ws.getCell('C5').style = {font: {bold: true}}
    ws.getCell('C6').style = {font: {bold: true}}
    ws.getCell('C7').style = {font: {bold: true}}
    ws.getCell('E7').style = {font: {bold: true}}

    // // // Formato
    ws.mergeCells('A1:K1')
    ws.mergeCells('A2:K2')
    ws.mergeCells('A3:K3')

    ws.getColumn(5).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
    ws.getColumn(6).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
    ws.getColumn(7).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
    ws.getColumn(8).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    
  
  
    wb.xlsx.writeBuffer().then(
      data => {
        let blob = new Blob([data], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, filename + new Date().valueOf() + EXCEL_EXTENSION)
      }
    )

  }

  public exportExcelDecimoCuarto(data: any, filename: string) {
    let wb = new Workbook()
    let ws = wb.addWorksheet('Decimo Cuarto')
    const STYLE_HEADER_AZUL : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'' }
      },
      font: {
        bold: true,
        size: 14
      },
      border: null,
      numFmt : null,
      protection: null,
    }
    const STYLE_HEADER_DESCRIPCION : Style = {
      alignment: {
        horizontal: 'right',
        vertical: 'middle'
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'' }
      },
      font: {
        bold: true,
        size: 12
      },
      border: null,
      numFmt : null,
      protection: null,
    }

   
    
    ws.columns = [
      { header: 'Cédula', key: 'cedula', width: 20 },
      { header: 'Apellidos', key: 'apellidos', width: 30 },
      { header: 'Nombres', key: 'nombres', width: 30 },
      { header: 'Dias Trabajados', key: 'dias_trabajados', width: 10 },
      
      { header: 'Total Ganado', key: 'total_ganado', width: 15 },
      { header: 'Total Devengado', key: 'total_devengado', width: 15 },
      { header: 'Retencion', key: 'retencion', width: 15 },
      { header: 'Valor Decimo', key: 'valor_decimo', width: 15 },
      { header: 'Meses Provisión', key: 'meses_provision', width: 10 },
      { header: 'Período Desde', key: 'periodo_desde', width: 15 },
      { header: 'Período Hasta', key: 'periodo_hasta', width:  15},
    ]
   
    ws.insertRows(2, data.rows)
    ws.getCell('A1').style = {font: {bold: true}}
    ws.getCell('B1').style = {font: {bold: true}}
    ws.getCell('C1').style = {font: {bold: true}}
    ws.getCell('D1').style = {font: {bold: true}}
    ws.getCell('E1').style = {font: {bold: true}}
    ws.getCell('F1').style = {font: {bold: true}}
    ws.getCell('G1').style = {font: {bold: true}}
    ws.getCell('H1').style = {font: {bold: true}}
    ws.getCell('I1').style = {font: {bold: true}}
    ws.getCell('J1').style = {font: {bold: true}}
    ws.getCell('K1').style = {font: {bold: true}}

     //    Escribir Cabecera
  
 
    // ws.insertRow(1, ['','','CUENTA DESDE:',data.fecha_desde,'CUENTA HASTA:',data.fecha_hasta])
    ws.insertRow(1, [''])
    ws.insertRow(1, ['','','FECHA DESDE:',data.fecha_desde,'FECHA HASTA:',data.fecha_hasta])
    ws.insertRow(1, ['','','DIRECCIÓN:',data.direccion])
    ws.insertRow(1, ['','','RAZON COMERCIAL:',data.razon_comercial])
    ws.insertRow(1, ['','','RAZON SOCIAL:',data.razon_social])
    ws.insertRow(1, [''])
    ws.insertRow(1, [data.title])
    ws.insertRow(1, [''])

    ws.getCell('A2:J2').style = STYLE_HEADER_AZUL
    ws.getCell('C4').style = {font: {bold: true}}
    ws.getCell('C5').style = {font: {bold: true}}
    ws.getCell('C6').style = {font: {bold: true}}
    ws.getCell('C7').style = {font: {bold: true}}
    ws.getCell('E7').style = {font: {bold: true}}

    // // // Formato
    ws.mergeCells('A1:J1')
    ws.mergeCells('A2:J2')
    ws.mergeCells('A3:J3')

   // ws.getColumn(5).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';
    ws.getColumn(5).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
   // ws.getColumn(6).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';
    ws.getColumn(6).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
    //ws.getColumn(7).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000'; 
    ws.getColumn(7).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    ws.getColumn(8).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
    
  
  
    wb.xlsx.writeBuffer().then(
      data => {
        let blob = new Blob([data], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, filename + new Date().valueOf() + EXCEL_EXTENSION)
      }
    )

  }




  public exportExcelMovimientos(data: any, filename: string) {
    let wb = new Workbook()
    let ws = wb.addWorksheet('Movimientos')
    const STYLE_HEADER_AZUL : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'' }
      },
      font: {
        bold: true,
        size: 14
      },
      border: null,
      numFmt : null,
      protection: null,
    }
    const STYLE_HEADER_DESCRIPCION : Style = {
      alignment: {
        horizontal: 'right',
        vertical: 'middle'
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'' }
      },
      font: {
        bold: true,
        size: 12
      },
      border: null,
      numFmt : null,
      protection: null,
    }

   
    
    ws.columns = [
      { header: 'NUMERO DE DOCUMENTO', key: 'num_doc', width: 20 },
      { header: 'CONCEPTO', key: 'concepto', width: 30 },
      { header: 'FECHA', key: 'fecha', width: 30 },
      { header: 'PARTIDA', key: 'codigo_partida', width: 10 },
      { header: 'NOMBRE DE PARTIDA', key: 'nombre_partida', width: 15 },
      { header: 'CODIGO DE PARTIDA', key: 'codigopartida', width: 10 },
      { header: 'VALOR DE PARTIDA', key: 'valor_partida', width: 15 },
      { header: 'TIPO DE PRESUPUESTO', key: 'tipo_presupuesto', width: 15 },
      { header: 'TIPO DE AFECTACION ', key: 'tipo_afectacion', width: 15 },
      { header: 'CERTIFICADO ', key: 'certificado', width: 10 },
      { header: 'COMPROMETIDO ', key: 'comprometido', width: 10 },
      { header: 'DEVENGADO', key: 'devengado', width: 15 },
      { header: 'COBRADO PAGADO', key: 'cobrado_pagado', width:  15},
      { header: 'CODIGO PROGRAMA', key: 'cod_programa', width:  15},
      { header: 'NOMBRE PROGRAMA ', key: 'nombre_programa', width:  15},
      

    ]
   
    ws.insertRows(2, data.rows)
    ws.getCell('A1').style = {font: {bold: true}}
    ws.getCell('B1').style = {font: {bold: true}}
    ws.getCell('C1').style = {font: {bold: true}}
    ws.getCell('D1').style = {font: {bold: true}}
    ws.getCell('E1').style = {font: {bold: true}}
    ws.getCell('F1').style = {font: {bold: true}}
    ws.getCell('G1').style = {font: {bold: true}}
    ws.getCell('H1').style = {font: {bold: true}}
    ws.getCell('I1').style = {font: {bold: true}}
    ws.getCell('J1').style = {font: {bold: true}}
    ws.getCell('K1').style = {font: {bold: true}}
    ws.getCell('L1').style = {font: {bold: true}}
    ws.getCell('M1').style = {font: {bold: true}}

     //    Escribir Cabecera
  
 
    // ws.insertRow(1, ['','','CUENTA DESDE:',data.fecha_desde,'CUENTA HASTA:',data.fecha_hasta])
/*     ws.insertRow(1, [''])
    ws.insertRow(1, ['','','FECHA DESDE:',data.fecha_desde,'FECHA HASTA:',data.fecha_hasta])
    ws.insertRow(1, ['','','DIRECCIÓN:',data.direccion])
    ws.insertRow(1, ['','','RAZON COMERCIAL:',data.razon_comercial])
    ws.insertRow(1, ['','','RAZON SOCIAL:',data.razon_social])
    ws.insertRow(1, ['']) */
    ws.insertRow(1, [data.title])
    ws.insertRow(1, [''])

    ws.getCell('A2:M2').style = STYLE_HEADER_AZUL
  /*   ws.getCell('C4').style = {font: {bold: true}}
    ws.getCell('C5').style = {font: {bold: true}}
    ws.getCell('C6').style = {font: {bold: true}}
    ws.getCell('C7').style = {font: {bold: true}}
    ws.getCell('E7').style = {font: {bold: true}} */

    // // // Formato
    ws.mergeCells('A1:M1')
    ws.mergeCells('A2:M2')
   /*  ws.mergeCells('A3:J3') */

   // ws.getColumn(5).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';
  //  ws.getColumn(4).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
   // ws.getColumn(6).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';
    ws.getColumn(7).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
    //ws.getColumn(7).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000'; 
   // ws.getColumn(7).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    // ws.getColumn(9).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    ws.getColumn(10).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    ws.getColumn(11).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    ws.getColumn(12).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    ws.getColumn(13).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
  /*  ws.getColumn(4).numFmt = '0.00'; // Formato de número con 2 decimales para la columna 4
 ws.getColumn(6).numFmt = '0.00'; // Formato de número con 2 decimales para la columna 6
ws.getColumn(9).numFmt = '0.00'; // Formato de número con 2 decimales para la columna 9
ws.getColumn(10).numFmt = '0.00'; // Formato de número con 2 decimales para la columna 10
ws.getColumn(11).numFmt = '0.00'; // Formato de número con 2 decimales para la columna 11
ws.getColumn(12).numFmt = '0.00'; //  */

const lastRow = ws.lastRow;
lastRow.eachCell(cell => {cell.font = { bold: true };});
  
    wb.xlsx.writeBuffer().then(
      data => {
        let blob = new Blob([data], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, filename + new Date().valueOf() + EXCEL_EXTENSION)
      }
    )

  }




  public exportExcelEstadoCuentaEmpleado(data: any, filename: string) {
    let wb = new Workbook()
    let ws = wb.addWorksheet('Estado de Cuenta de Empleado')
    const STYLE_HEADER_AZUL : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'' }
      },
      font: {
        bold: true,
        size: 14
      },
      border: null,
      numFmt : null,
      protection: null,
    }
    const STYLE_HEADER_DESCRIPCION : Style = {
      alignment: {
        horizontal: 'right',
        vertical: 'middle'
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'' }
      },
      font: {
        bold: true,
        size: 12
      },
      border: null,
      numFmt : null,
      protection: null,
    }
    
    ws.columns = [
      { header: 'Fecha', key: 'fecha', width: 20 },
      { header: 'Tipo', key: 'tipo_movimiento', width: 30 },
      { header: 'Ref.', key: 'documento', width: 20 },
      { header: 'Detalle', key: 'detalle', width: 30 },
      { header: 'Valor', key: 'valor', width: 20 },
      { header: 'Debe', key: 'debe', width: 20 },
      { header: 'Haber', key: 'haber', width: 20 },
      { header: 'Saldo', key: 'saldo', width: 20 },
      
    ]

    let i=2;            
    let saldo_anterior = 0

    saldo_anterior= parseFloat(data.rows[0].saldo_inicial)
    ws.insertRow(i,[  '','Saldo Anterior:','','','','','',saldo_anterior])
    ws.getCell('B'+i).style = {font: {bold: true}}
    ws.getCell('H'+i).style = {font: {bold: true}}

    ws.insertRows(3, data.rows)
    ws.getCell('A1').style = {font: {bold: true}}
    ws.getCell('B1').style = {font: {bold: true}}
    ws.getCell('C1').style = {font: {bold: true}}
    ws.getCell('D1').style = {font: {bold: true}}
    ws.getCell('E1').style = {font: {bold: true}}
    ws.getCell('F1').style = {font: {bold: true}}
    ws.getCell('G1').style = {font: {bold: true}}
    ws.getCell('H1').style = {font: {bold: true}}
    
    //    Escribir Cabecera
    ws.insertRow(1, [''])
    ws.insertRow(1, ['','','Empleado:',data.empleado])
    ws.insertRow(1, [''])
    ws.insertRow(1, [data.title])
    ws.insertRow(1, [''])

    ws.getCell('A2:H2').style = STYLE_HEADER_AZUL
    ws.getCell('C4').style = {font: {bold: true}}
    ws.getCell('C5').style = {font: {bold: true}}
    ws.getCell('C6').style = {font: {bold: true}}
    ws.getCell('C7').style = {font: {bold: true}}
    // // // Formato
    ws.mergeCells('A1:H1')
    ws.mergeCells('A2:J2')
    ws.mergeCells('A3:J3')
    
   
    ws.getColumn(5).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';
    ws.getColumn(6).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';
    ws.getColumn(7).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';
    ws.getColumn(8).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';

  
  
    wb.xlsx.writeBuffer().then(
      data => {
        let blob = new Blob([data], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, filename + new Date().valueOf() + EXCEL_EXTENSION)
      }
    )

  }
  
  public exportExcelAsientoCierre(data: any, filename: string) {
    let wb = new Workbook()
    let ws = wb.addWorksheet('Asiento de Cierre')
    const STYLE_HEADER_AZUL : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'' }
      },
      font: {
        bold: true,
        size: 14
      },
      border: null,
      numFmt : null,
      protection: null,
    }
    const STYLE_HEADER_DESCRIPCION : Style = {
      alignment: {
        horizontal: 'right',
        vertical: 'middle'
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'' }
      },
      font: {
        bold: true,
        size: 12
      },
      border: null,
      numFmt : null,
      protection: null,
    }
    
    ws.columns = [
      { header: 'Fecha', key: 'fecha', width: 20 },
      { header: 'Cuenta Contable', key: 'cuenta_contable', width: 20 },
      { header: 'Nombre Cuenta Contable', key: 'cuenta_contable_nombre', width: 40 },
      { header: 'AS', key: '', width: 15 },
      { header: 'TM', key: '', width: 15 },
      { header: 'Debe', key: 'debe', width: 20 },
      { header: 'Haber', key: 'haber', width: 20 },
      { header: 'Partida Codigo', key: 'partida_presupuestaria_cod', width: 20 },
      { header: 'Partida Nombre', key: 'partida_presupuestaria_desc', width: 40 },
      { header: 'Valor', key: 'partida_presupuestaria_valor', width: 15 },
    ]

                  
    ws.insertRows(2, data.rows)
   
    ws.getCell('A1').style = {font: {bold: true}}
    ws.getCell('B1').style = {font: {bold: true}}
    ws.getCell('C1').style = {font: {bold: true}}
    ws.getCell('D1').style = {font: {bold: true}}
    ws.getCell('E1').style = {font: {bold: true}}
    ws.getCell('F1').style = {font: {bold: true}}
    ws.getCell('G1').style = {font: {bold: true}}
    ws.getCell('H1').style = {font: {bold: true}}
    ws.getCell('I1').style = {font: {bold: true}}
    ws.getCell('J1').style = {font: {bold: true}}
  
    // ws.insertRow(1, ['','','CUENTA DESDE:',data.fecha_desde,'CUENTA HASTA:',data.fecha_hasta])
    ws.insertRow(1, [''])
    ws.insertRow(1, ['','','FECHA:',data.fecha,''])
    ws.insertRow(1, [''])
    ws.insertRow(1, [data.title])
    ws.insertRow(1, [''])

    ws.getCell('A2:J2').style = STYLE_HEADER_AZUL
    ws.getCell('C4').style = {font: {bold: true}}
    ws.getCell('C5').style = {font: {bold: true}}
    ws.getCell('C6').style = {font: {bold: true}}
    
   // ws.getCell('A4:C4').style = STYLE_HEADER_DESCRIPCION

    // // // Formato
    ws.mergeCells('A1:J1')
    ws.mergeCells('A2:J2')
    ws.mergeCells('A3:J3')
    
   
    ws.getColumn(6).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
    ws.getColumn(7).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
  
    wb.xlsx.writeBuffer().then(
      data => {
        let blob = new Blob([data], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, filename + new Date().valueOf() + EXCEL_EXTENSION)
      }
    )

  }

  public exportExcelRolGeneral(data: any, filename: string) {
    let wb = new Workbook()
    let ws = wb.addWorksheet('Rol General')
   
    const STYLE_HEADER_AZUL : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'' }
      },
      font: {
        bold: true,
        size: 14
      },
      border: null,
      numFmt : null,
      protection: null,
    }
    const STYLE_HEADER_DESCRIPCION : Style = {
      alignment: {
        horizontal: 'right',
        vertical: 'middle'
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'' }
      },
      font: {
        bold: true,
        size: 12
      },
      border: null,
      numFmt : null,
      protection: null,
    }

   
   
    let columns= []
    data.cols.forEach(elem => {
      let data  = {
        header: elem.header,
        key: elem.field,
        width:20 
      }
      columns.push(data)
    })
    ws.columns = columns;
    console.log(ws.columns)
    
    
    ws.insertRow(3, ['','','Elaborado por:','','','','Revisado por:','','','','Aprobado por:'])
   ws.insertRows(2, data.rows)
    ws.getCell('A1').style = {font: {bold: true}}
    ws.getCell('B1').style = {font: {bold: true}}
    ws.getCell('C1').style = {font: {bold: true}}
    ws.getCell('D1').style = {font: {bold: true}}
    ws.getCell('E1').style = {font: {bold: true}}
    ws.getCell('F1').style = {font: {bold: true}}
    ws.getCell('G1').style = {font: {bold: true}}
    ws.getCell('H1').style = {font: {bold: true}}
    ws.getCell('I1').style = {font: {bold: true}}
    ws.getCell('J1').style = {font: {bold: true}}
    ws.getCell('K1').style = {font: {bold: true}}
    ws.getCell('L1').style = {font: {bold: true}}
    ws.getCell('M1').style = {font: {bold: true}}
    ws.getCell('N1').style = {font: {bold: true}}
    ws.getCell('O1').style = {font: {bold: true}}
    ws.getCell('P1').style = {font: {bold: true}}
    ws.getCell('Q1').style = {font: {bold: true}}
    ws.getCell('R1').style = {font: {bold: true}}
    ws.getCell('S1').style = {font: {bold: true}}
    ws.getCell('T1').style = {font: {bold: true}}
    ws.getCell('U1').style = {font: {bold: true}}
    ws.getCell('V1').style = {font: {bold: true}}
    ws.getCell('W1').style = {font: {bold: true}}
    ws.getCell('X1').style = {font: {bold: true}}
    ws.getCell('Y1').style = {font: {bold: true}}
    ws.getCell('Z1').style = {font: {bold: true}}
    ws.getCell('AA1').style = {font: {bold: true}}
    ws.getCell('AB1').style = {font: {bold: true}}
    ws.getCell('AC1').style = {font: {bold: true}}
    ws.getCell('AD1').style = {font: {bold: true}}
    ws.getCell('AE1').style = {font: {bold: true}}


    ws.insertRow(1, [''])
    ws.insertRow(1, [''])
    ws.insertRow(1, [data.title])
    ws.insertRow(1, [''])
    ws.insertRow(1, [''])
    ws.insertRow(1, [''])
    ws.insertRow(1, [''])

    ws.getCell('A5:M5').style = STYLE_HEADER_AZUL
   
    ws.mergeCells('A1:P1')
    ws.mergeCells('A2:P2')
    ws.mergeCells('A3:P3')
    ws.mergeCells('A4:P4')
    ws.mergeCells('A5:P5')
    ws.mergeCells('A6:P6')
    ws.mergeCells('A7:P7')
   
     
    ws.getColumn(12).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
    ws.getColumn(13).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
    ws.getColumn(14).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
    ws.getColumn(15).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
    ws.getColumn(16).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
    ws.getColumn(17).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
    ws.getColumn(18).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
    ws.getColumn(19).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
    ws.getColumn(20).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
    ws.getColumn(21).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
    ws.getColumn(22).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
    ws.getColumn(23).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
    ws.getColumn(24).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
    ws.getColumn(25).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
    ws.getColumn(26).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
    ws.getColumn(26).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
    ws.getColumn(27).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
    ws.getColumn(28).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
    ws.getColumn(29).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
    ws.getColumn(30).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
    ws.getColumn(31).numFmt = '"$"#,##0.00;\-"$"#,##0.00';


    const penultimateRow = ws.getRow(ws.rowCount - 2);

    // Aplicar formato a la penúltima fila
    penultimateRow.eachCell(cell => { cell.font = { bold: true };});
    // Aplicar formato a la última fila
    const lastRow = ws.lastRow;
    lastRow.eachCell(cell => {cell.font = { bold: true };});

    this.getBase64Image('assets/img/logo_municipio.png', (base64Image: string) => {
     
      const imageId = wb.addImage({
        base64: base64Image,
        extension: 'png', 
      });
      ws.addImage(imageId, 'B2:B6');
     
      wb.xlsx.writeBuffer().then((buffer: ArrayBuffer) => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        FileSaver.saveAs(blob, filename + new Date().valueOf() + EXCEL_EXTENSION)
      });
    });
  }

  getBase64Image(url: string, callback: (base64Image: string) => void) {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/png');
      callback(dataURL.replace(/^data:image\/(png|jpg);base64,/, ''));
    };
    img.src = url;
  }

  public exportExcelPrestamoDocumentos(data: any, filename: string) {
    let wb = new Workbook()
    let ws = wb.addWorksheet('Prestamo de Documentos')
    const STYLE_HEADER_AZUL : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'' }
      },
      font: {
        bold: true,
        size: 14
      },
      border: null,
      numFmt : null,
      protection: null,
    }
    const STYLE_HEADER_DESCRIPCION : Style = {
      alignment: {
        horizontal: 'right',
        vertical: 'middle'
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'' }
      },
      font: {
        bold: true,
        size: 12
      },
      border: null,
      numFmt : null,
      protection: null,
    }

   
    
    ws.columns = [
      { header: 'Codigo', key: 'codigo', width: 20 },
      { header: 'Num. de prestamo', key: 'num_orden', width: 20 },
      { header: 'Fecha', key: 'fecha', width: 20 },
      { header: 'Fecha de devolucion', key: 'devolucion', width: 20 },
      { header: 'Fecha maxima', key: 'fechamaxima', width: 20 },
      { header: 'Observaciones', key: 'observacion', width: 20 },
      { header: 'Responsable', key: 'empleado_nombre', width: 20 },
      { header: 'Usuario Asignado', key: 'usuario_nombre', width: 20 },
      { header: 'Estado', key: 'estado_prestamo', width: 20 },
    ]
   
    ws.insertRows(2, data.rows)
    ws.getCell('A1').style = {font: {bold: true}}
    ws.getCell('B1').style = {font: {bold: true}}
    ws.getCell('C1').style = {font: {bold: true}}
    ws.getCell('D1').style = {font: {bold: true}}
    ws.getCell('E1').style = {font: {bold: true}}
    ws.getCell('F1').style = {font: {bold: true}}
    ws.getCell('G1').style = {font: {bold: true}}
    ws.getCell('H1').style = {font: {bold: true}}
    ws.getCell('I1').style = {font: {bold: true}}
    ws.getCell('J1').style = {font: {bold: true}}
    ws.getCell('K1').style = {font: {bold: true}}

     //    Escribir Cabecera
  
 
    // ws.insertRow(1, ['','','CUENTA DESDE:',data.fecha_desde,'CUENTA HASTA:',data.fecha_hasta])
    ws.insertRow(1, [''])
    ws.insertRow(1, ['','','FECHA DESDE:',data.fecha_desde,'FECHA HASTA:',data.fecha_hasta])
    ws.insertRow(1, [''])
    ws.insertRow(1, [data.title])
    ws.insertRow(1, [''])

    ws.getCell('A2:J2').style = STYLE_HEADER_AZUL
    // ws.getCell('C4').style = {font: {bold: true}}
    // ws.getCell('C5').style = {font: {bold: true}}
    // ws.getCell('C6').style = {font: {bold: true}}
    // ws.getCell('C7').style = {font: {bold: true}}
    // ws.getCell('E7').style = {font: {bold: true}}

    // // // Formato
    ws.mergeCells('A1:J1')
    ws.mergeCells('A2:J2')
    ws.mergeCells('A3:J3')

   // ws.getColumn(5).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';
  //   ws.getColumn(5).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
  //  // ws.getColumn(6).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000';
  //   ws.getColumn(6).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
  //   //ws.getColumn(7).numFmt = '"$"#,##0.0000;\-"$"#,##0.0000'; 
  //   ws.getColumn(7).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 
  //   ws.getColumn(8).numFmt = '"$"#,##0.00;\-"$"#,##0.00';
    
  
  
    wb.xlsx.writeBuffer().then(
      data => {
        let blob = new Blob([data], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, filename + new Date().valueOf() + EXCEL_EXTENSION)
      }
    )

  }

  public exportExcelTramites(data: any, filename: string) {
    let wb = new Workbook()
    let ws = wb.addWorksheet('Tramites')
    const STYLE_HEADER_AZUL : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'' }
      },
      font: {
        bold: true,
        size: 14
      },
      border: null,
      numFmt : null,
      protection: null,
    }
    const STYLE_HEADER_DESCRIPCION : Style = {
      alignment: {
        horizontal: 'right',
        vertical: 'middle'
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'' }
      },
      font: {
        bold: true,
        size: 12
      },
      border: null,
      numFmt : null,
      protection: null,
    }

   
    
    ws.columns = [
      { header: 'No.Tramite', key: 'id_tramite', width: 10 },
      { header: 'Fecha', key: 'fecha', width: 20 },
      { header: 'Tramite', key: 'nombre', width: 20 },
      { header: 'Observacion', key: 'observacion', width: 20 },
      { header: 'Estado', key: 'nom_estado', width: 20 },
      { header: 'Fecha Maxima', key: 'fecha_maxima', width: 20 },
      { header: 'Prioridad', key: 'nom_prioridad', width: 20 },
      { header: 'Usuario', key: 'nom_usuario', width: 20 },
      { header: 'Dias Transcurridos', key: 'dias_transcurridos', width: 20 },
      { header: 'Fecha Cierre', key: 'fecha_cierre', width: 20 },
    ]
   
    ws.insertRows(2, data.rows)
    ws.getCell('A1').style = {font: {bold: true}}
    ws.getCell('B1').style = {font: {bold: true}}
    ws.getCell('C1').style = {font: {bold: true}}
    ws.getCell('D1').style = {font: {bold: true}}
    ws.getCell('E1').style = {font: {bold: true}}
    ws.getCell('F1').style = {font: {bold: true}}
    ws.getCell('G1').style = {font: {bold: true}}
    ws.getCell('H1').style = {font: {bold: true}}
    ws.getCell('I1').style = {font: {bold: true}}
    ws.getCell('J1').style = {font: {bold: true}}
    ws.getCell('K1').style = {font: {bold: true}}

     //    Escribir Cabecera
  
 

     ws.insertRow(1, [''])
     ws.insertRow(1, ['','','FECHA DESDE:',data.fecha_desde,'FECHA HASTA:',data.fecha_hasta])
     ws.insertRow(1, [''])
     ws.insertRow(1, [data.title])
     ws.insertRow(1, [''])

     ws.getCell('A2:J2').style = STYLE_HEADER_AZUL

     ws.getCell('C4').style = {font: {bold: true}};
     ws.getCell('E4').style = {font: {bold: true}};


    // // // Formato
    ws.mergeCells('A1:J1')
    ws.mergeCells('A2:J2')
    ws.mergeCells('A3:J3')

  //  ws.getColumn(9).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 

    ws.getColumn(9).numFmt = '#,##0;\-#,##0'; 


    
  
  
    wb.xlsx.writeBuffer().then(
      data => {
        let blob = new Blob([data], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, filename + new Date().valueOf() + EXCEL_EXTENSION)
      }
    )

  }

  public exportExcelTramitesResumen(data: any, filename: string) {
    let wb = new Workbook()
    let ws = wb.addWorksheet('TramitesResumen')
    const STYLE_HEADER_AZUL : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'' }
      },
      font: {
        bold: true,
        size: 14
      },
      border: null,
      numFmt : null,
      protection: null,
    }
    const STYLE_HEADER_DESCRIPCION : Style = {
      alignment: {
        horizontal: 'right',
        vertical: 'middle'
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'' }
      },
      font: {
        bold: true,
        size: 12
      },
      border: null,
      numFmt : null,
      protection: null,
    }

   
    
    ws.columns = [
      
      { header: 'Fecha', key: 'fecha', width: 20 },
      { header: 'Cantidad', key: 'cantidad', width: 10 },
      { header: 'Tramite', key: 'nombre', width: 20 },
   
      { header: 'Estado', key: 'nom_estado', width: 20 },
  
      { header: 'Prioridad', key: 'nom_prioridad', width: 20 },
      { header: 'Usuario', key: 'nom_usuario', width: 20 },
      { header: 'Departamento', key: 'departamento', width: 20 },
  

    ]
   
    ws.insertRows(2, data.rows)
    ws.getCell('A1').style = {font: {bold: true}}
    ws.getCell('B1').style = {font: {bold: true}}
    ws.getCell('C1').style = {font: {bold: true}}
    ws.getCell('D1').style = {font: {bold: true}}
    ws.getCell('E1').style = {font: {bold: true}}
    ws.getCell('F1').style = {font: {bold: true}}
    ws.getCell('G1').style = {font: {bold: true}}
  

     //    Escribir Cabecera
  
 

     ws.insertRow(1, [''])
     ws.insertRow(1, ['','','FECHA DESDE:',data.fecha_desde,'FECHA HASTA:',data.fecha_hasta])
     ws.insertRow(1, [''])
     ws.insertRow(1, [data.title])
     ws.insertRow(1, [''])

     ws.getCell('A2:J2').style = STYLE_HEADER_AZUL

     ws.getCell('C4').style = {font: {bold: true}};
     ws.getCell('E4').style = {font: {bold: true}};


    // // // Formato
    ws.mergeCells('A1:J1')
    ws.mergeCells('A2:J2')
    ws.mergeCells('A3:J3')

  //  ws.getColumn(9).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 

  //  ws.getColumn(9).numFmt = '#,##0;\-#,##0'; 


    
  
  
    wb.xlsx.writeBuffer().then(
      data => {
        let blob = new Blob([data], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, filename + new Date().valueOf() + EXCEL_EXTENSION)
      }
    )

  }

  public exportExcelTramitesGeneral(data: any, filename: string) {
    let wb = new Workbook()
    let ws = wb.addWorksheet('Tramites')
    const STYLE_HEADER_AZUL : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'' }
      },
      font: {
        bold: true,
        size: 14
      },
      border: null,
      numFmt : null,
      protection: null,
    }
    const STYLE_HEADER_DESCRIPCION : Style = {
      alignment: {
        horizontal: 'right',
        vertical: 'middle'
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'' }
      },
      font: {
        bold: true,
        size: 12
      },
      border: null,
      numFmt : null,
      protection: null,
    }

   
    
    ws.columns = [
      { header: 'Id', key: 'id', width: 10 },
      { header: 'No.Tramite', key: 'nro_tramite', width: 10 },
      { header: 'Fecha Tramite', key: 'fecha_tramite', width: 20 },
      { header: 'Nombre Tramite', key: 'nombre_tramite', width: 20 },
      { header: 'Estado Tramite', key: 'estado_tramite', width: 20 },
      { header: 'Tareas Pendientes', key: 'tareas_pendientes', width: 20 },
      { header: 'Responsable', key: 'responsable', width: 20 },
      { header: 'Dias de atraso', key: 'dias_atraso', width: 20 },
    ]
   
    ws.insertRows(2, data.rows)
    ws.getCell('A1').style = {font: {bold: true}}
    ws.getCell('B1').style = {font: {bold: true}}
    ws.getCell('C1').style = {font: {bold: true}}
    ws.getCell('D1').style = {font: {bold: true}}
    ws.getCell('E1').style = {font: {bold: true}}
    ws.getCell('F1').style = {font: {bold: true}}
    ws.getCell('G1').style = {font: {bold: true}}
    ws.getCell('H1').style = {font: {bold: true}}
   

     //    Escribir Cabecera
  
 

     ws.insertRow(1, [''])
     ws.insertRow(1, ['','','FECHA DESDE:',data.fecha_desde,'FECHA HASTA:',data.fecha_hasta])
     ws.insertRow(1, [''])
     ws.insertRow(1, [data.title])
     ws.insertRow(1, [''])

     ws.getCell('A2:G2').style = STYLE_HEADER_AZUL

     ws.getCell('C4').style = {font: {bold: true}};
     ws.getCell('E4').style = {font: {bold: true}};


    // // // Formato
    ws.mergeCells('A1:H1')
    ws.mergeCells('A2:H2')
    ws.mergeCells('A3:H3')

  //  ws.getColumn(9).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 

   // ws.getColumn(9).numFmt = '#,##0;\-#,##0'; 


    
  
  
    wb.xlsx.writeBuffer().then(
      data => {
        let blob = new Blob([data], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, filename + new Date().valueOf() + EXCEL_EXTENSION)
      }
    )

  }
  
  public exportExcelReporteIce(data: any, filename: string) {
    let wb = new Workbook()
    let ws = wb.addWorksheet('Ice')
    const STYLE_HEADER_AZUL : Style = {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'' }
      },
      font: {
        bold: true,
        size: 14
      },
      border: null,
      numFmt : null,
      protection: null,
    }
    const STYLE_HEADER_DESCRIPCION : Style = {
      alignment: {
        horizontal: 'right',
        vertical: 'middle'
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'' }
      },
      font: {
        bold: true,
        size: 12
      },
      border: null,
      numFmt : null,
      protection: null,
    }

   
    
    ws.columns = [
      { header: 'Proveedor', key: 'razon_social', width: 50 },
      { header: 'Ruc', key: 'num_documento', width: 20 },
      { header: 'Factura', key: 'compra', width: 20 },
      { header: 'Fecha de Compra', key: 'fecha_emision', width: 20 },
      { header: 'CodigoIce', key: 'cod_ice', width: 20 },
      { header: 'Porcentaje Ice', key: 'porcentaje_ice', width: 20 },
      { header: 'Total Ice', key: 'total_ice', width: 20 },
      { header: 'Descripcion Ice', key: 'descripcion', width: 20 },
 
    ]
   
    ws.insertRows(2, data.rows)
    ws.getCell('A1').style = {font: {bold: true}}
    ws.getCell('B1').style = {font: {bold: true}}
    ws.getCell('C1').style = {font: {bold: true}}
    ws.getCell('D1').style = {font: {bold: true}}
    ws.getCell('E1').style = {font: {bold: true}}
    ws.getCell('F1').style = {font: {bold: true}}
    ws.getCell('G1').style = {font: {bold: true}}
    ws.getCell('H1').style = {font: {bold: true}}
   

     //    Escribir Cabecera
  
 

     ws.insertRow(1, [''])
     ws.insertRow(1, ['','','FECHA DESDE:',data.fecha_desde,'FECHA HASTA:',data.fecha_hasta])
     ws.insertRow(1, [''])
     ws.insertRow(1, [data.title])
     ws.insertRow(1, [''])

     ws.getCell('A2:J2').style = STYLE_HEADER_AZUL

     ws.getCell('C4').style = {font: {bold: true}};
     ws.getCell('E4').style = {font: {bold: true}};


    // // // Formato
    ws.mergeCells('A1:J1')
    ws.mergeCells('A2:J2')
    ws.mergeCells('A3:J3')

  //  ws.getColumn(9).numFmt = '"$"#,##0.00;\-"$"#,##0.00'; 

    ws.getColumn(4).numFmt = '#,##0;\-#,##0'; 
    ws.getColumn(5).numFmt = '#,##0;\-#,##0'; 
    ws.getColumn(6).numFmt = '#,##0;\-#,##0'; 


    
  
  
    wb.xlsx.writeBuffer().then(
      data => {
        let blob = new Blob([data], { type: EXCEL_TYPE })
        FileSaver.saveAs(blob, filename + new Date().valueOf() + EXCEL_EXTENSION)
      }
    )

  }
}
