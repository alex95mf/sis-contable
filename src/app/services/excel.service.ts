import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
const XML_TYPE = 'application/xml';
@Injectable()
export class ExcelService {
    constructor() { }
    public exportAsExcelFile(json: any[], excelFileName: string, header: any = {}): void {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json, header);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }
    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
        //FileSaver.saveAs(data, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);
        FileSaver.saveAs(data, fileName + '_report');
    }

    public saveAsXmlFile(xml:string,  fileName: string): void {

        let buffer = this.conversion(xml);
        const data: Blob = new Blob([buffer], { type: XML_TYPE });
        FileSaver.saveAs(data, fileName + '_report');
    }

    private conversion(str) {
        var idx, len = str.length, arr = new Array(len);
        for (idx = 0; idx < len; ++idx) {
            arr[ idx ] = str.charCodeAt(idx);// & 0xFF;
        }
        
        return new Uint8Array(arr).buffer;
    }

    public exportToCsv(rows: object[], fileName: string, columns?: string[]): string {
        if (!rows || !rows.length) {
          return;
        }
        const separator = ',';
        const keys = Object.keys(rows[0]).filter(k => {
          if (columns?.length) {
            return columns.includes(k);
          } else {
            return true;
          }
        });
        const csvContent =
          keys.join(separator) +
          '\n' +
          rows.map(row => {
            return keys.map(k => {
              let cell = row[k] === null || row[k] === undefined ? '' : row[k];
              cell = cell instanceof Date
                ? cell.toLocaleString()
                : cell.toString().replace(/"/g, '""');
              if (cell.search(/("|,|\n)/g) >= 0) {
                cell = `"${cell}"`;
              }
              return cell;
            }).join(separator);
          }).join('\n');
        this.saveAsFile(csvContent, `${fileName}`, '.csv');
      }
    
      private saveAsFile(buffer: any, fileName: string, fileType: string): void {
        const data: Blob = new Blob([buffer], { type: fileType });
        FileSaver.saveAs(data, fileName);
      }
}