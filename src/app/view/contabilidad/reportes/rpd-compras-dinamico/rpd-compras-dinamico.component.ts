import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../../../../services/commonServices'
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogService } from 'primeng/dynamicdialog';

import { RpdComprasDinamicoService } from './rpd-compras-dinamico.service';
import Swal from "sweetalert2";;
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import * as myVarGlobals from '../../../../global';
import { CcModalTablaProveedoresComponent } from 'src/app/config/custom/cc-modal-tabla-proveedores/cc-modal-tabla-proveedores.component';

import { RptDinamicComprasI } from 'src/app/models/responseRptDinamicCompras.interface';

import * as moment from "moment";

import { ToastrService } from 'ngx-toastr';
import * as FileSaver from 'file-saver';

@Component({
standalone: false,
  selector: 'app-rpd-compras-dinamico',
  templateUrl: './rpd-compras-dinamico.component.html',
  styleUrls: ['./rpd-compras-dinamico.component.scss'],
  providers: [DialogService,]
})
export class RpdComprasDinamicoComponent implements OnInit {


  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  vmButtons: any = [];

  dataUser: any;
  empresLogo: any;
  permiso_ver: any = "0";
  permisions: any;

  id_proveedor:any = 0;
  proveedor_name:any;

  informacionCamposReport:any = [];

  dtConsultaRetencionesGeneradas:any;


  availableReport:RptDinamicComprasI[] = [];
  selectCampoReport:RptDinamicComprasI[] = [];
  draggedProduct:RptDinamicComprasI;


  viewDate: Date = new Date();
  fromDatePicker: Date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
  toDatePicker: Date = new Date();

  constructor
  (
    private commonServices: CommonService,
    private toastr: ToastrService,
    private rpdDinamic: RpdComprasDinamicoService,
    public dialogService: DialogService,
  ) {}
  ref: DynamicDialogRef;

  ngOnInit(): void {

    this.vmButtons =
      [
        { orig: "btnsRetenGener", paramAccion: "1", boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false },
      ];

    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.empresLogo = this.dataUser.logoEmpresa;


    setTimeout(() => {

      this.lcargando.ctlSpinner(true);
      this.dataUser = JSON.parse(localStorage.getItem('Datauser'));

      let data = {
        id: 2,
        codigo: myVarGlobals.fComDiario,
        id_rol: this.dataUser.id_rol
      }

      this.commonServices.getPermisionsGlobas(data).subscribe(res => {
        this.permisions = res["data"][0];

        this.permiso_ver = this.permisions.abrir;
        this.obtnerConfiguracionReportDinamic();

        if (this.permisions.abrir == "0") {
          this.lcargando.ctlSpinner(false);
          this.toastr.info("Usuario no tiene Permiso para ver el formulario de Comprobante Diario");
          this.vmButtons = [];
        }

        this.lcargando.ctlSpinner(false);

      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      });
    }, 10);




  }


  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "EXCEL":
        this.ExportarExcelReport();
        break;
    }
  }


  ExportarExcelReport() {

    let fechaActualUno = moment(this.fromDatePicker).format("YYYY-MM-DD")
    let fechaActualCambio = moment(this.toDatePicker).format("YYYY-MM-DD")


    let camposConculta = [];
    let nombreCamposReport = [];

    for (let i = 0; i < this.selectCampoReport.length; i++) {
      camposConculta.push(this.selectCampoReport[i].nombre_campo_tabla);
      nombreCamposReport.push(this.selectCampoReport[i].nombre_campo_reporte);
    }

    let datagetReport = {
      id_proveedor: this.id_proveedor,
      fecha_desde: fechaActualUno,
      fecha_hasta: fechaActualCambio,
      campos: camposConculta.toString()
    }

    if (!camposConculta.includes('id_proveedor')) {
      Swal.fire('No ha seleccionado la columna ID Proveedor', 'Esta columna es obligatoria para el reporte', 'warning')
      return;
    }

    this.lcargando.ctlSpinner(true);

    this.rpdDinamic.getReportXlsx(datagetReport).subscribe({
      next: (rpt: any) => {

        // console.log('datagetReport', datagetReport)
        // console.log('rpt', rpt)
        // return;

        let ReportDataXls = rpt;

        //console.log(ReportDataXls);

        import("xlsx-js-style").then(XLSX => {


          //var workbook = XLSX.utils.book_new();

          var Heading = [
            nombreCamposReport,
          ];


          var ws = XLSX.utils.aoa_to_sheet([
            ["Reporte de Compras"],
            ["FECHA DESDE:", fechaActualUno , "FECHA HASTA :", fechaActualCambio],
            ["PROVEEDOR:", (this.id_proveedor === 0) ? 'TODOS' : this.proveedor_name ]
          ]);

          XLSX.utils.sheet_add_json(ws, ReportDataXls, {
            skipHeader: false,
            origin: "A6"
          });

          XLSX.utils.sheet_add_aoa(ws, Heading,{
            origin: "A6"
          });


          const max_width = ReportDataXls.reduce((w, r) => Math.max(w, (r.id_proveedor).toString().length), 10);
          ws["!cols"] = [ { wch: max_width } ];






          ws['A1'].s = {
            fill:{
              fgColor:{rgb:"E9E9E9"}
            },
            alignment:{
              horizontal:'center'
            },
            border : {
              bottom:{ style: 'thin', color: {rgb: "000"} }
            },
            font: {
                name: 'arial',
                sz: 20,
                bold: true,
                color: "#F2F2F2"
            },
          }

          ws['A2'].s = {
            fill:{
              fgColor:{rgb:"E9E9E9"}
            },
            border : {
              bottom:{ style: 'thin', color: {rgb: "000"} }
            },
            font: {
                name: 'arial',
                bold: true,
                color: "#F2F2F2"
            },
          }

          ws['A3'].s = {
            fill:{
              fgColor:{rgb:"E9E9E9"}
            },
            border : {
              bottom:{ style: 'thin', color: {rgb: "000"} }
            },
            font: {
                name: 'arial',
                bold: true,
                color: "#F2F2F2"
            },
          }

          ws['C2'].s = {
            fill:{
              fgColor:{rgb:"E9E9E9"}
            },
            border : {
              bottom:{ style: 'thin', color: {rgb: "000"} }
            },
            font: {
                name: 'arial',
                bold: true,
                color: "#F2F2F2"
            },
          }


          let endCell = nombreCamposReport.length - 1;

          const merge = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: endCell } },
          ];
          ws["!merges"] = merge;



          const workbook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
          const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
          this.saveAsExcelFile(excelBuffer, "Reporte_Compras");


          /*
          var Heading = [
            nombreCamposReport,
          ];

          let row = [
            { v: "Courier: 24", t: "s", s: { font: { name: "Courier", sz: 24 } } },
            { v: "bold & color", t: "s", s: { font: { bold: true, color: { rgb: "FF0000" } } } },
            { v: "fill: color", t: "s", s: { fill: { fgColor: { rgb: "E9E9E9" } } } },
            { v: "line\nbreak", t: "s", s: { alignment: { wrapText: true } } },
          ];

          const worksheet = xlsx.utils.json_to_sheet(ReportDataXls);

          worksheet['A1'].s = {
            font: {
                name: 'arial',
                sz: 24,
                bold: true,
                color: "#F2F2F2"
            },
        }

          xlsx.utils.sheet_add_aoa(worksheet, Heading);

          const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
          const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
          this.saveAsExcelFile(excelBuffer, "Reporte_Compras");*/

        });

        this.lcargando.ctlSpinner(false);

      },
      error: (e) => {
        console.log(e);
      },
    });


  }




  deleteCampoAsignado(dataCampo:any){
    dataCampo.estado_assignacion = 0;
    this.asignarCampoReport(dataCampo);
  }


  saveAsExcelFile(buffer: any, fileName: string): void {

    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);

}

  obtnerConfiguracionReportDinamic(){


    this.rpdDinamic.getConfiguracionReport(1).subscribe(res => {

      this.selectCampoReport = res[0]['detalle'].filter(e => e.estado_asignacion === 1);
      this.availableReport = <RptDinamicComprasI[]>res[0]['detalle'];

      console.log(res);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });

  }



  onClickConsultaProveedores() {

    let busqueda = (typeof this.proveedor_name === 'undefined') ? "" : this.proveedor_name;

    localStorage.setItem("busqueda_proveedores", busqueda)

    this.ref = this.dialogService.open(CcModalTablaProveedoresComponent, {
      header: 'Proveedores',
      width: '70%',
      contentStyle: { "max-height": "500px", "overflow": "auto" },
      baseZIndex: 10000
    });

    this.ref.onClose.subscribe((product: any) => {

      if (product) {

        this.proveedor_name = product['data'].razon_social;
        this.id_proveedor = product['data'].id_proveedor;

      }

    });

  }



  dragStart(campo: RptDinamicComprasI) {

    console.log(campo);
    this.draggedProduct = campo;
  }


  drop(event) {
    if (this.draggedProduct) {
      let draggedProductIndex = this.findIndex(this.draggedProduct);


      if(this.selectCampoReport.filter(e => e.id_detail_report === this.draggedProduct.id_detail_report).length === 0){

        this.draggedProduct['estado_assignacion'] = 1;
        this.asignarCampoReport(this.draggedProduct);
        this.selectCampoReport = [...this.selectCampoReport, this.draggedProduct];
        this.draggedProduct = null;



      }


    }
  }

  dragEnd(event) {
    this.draggedProduct = null;
  }

  findIndex(product: any) {
    let index = -1;
    for (let i = 0; i < this.availableReport.length; i++) {
      if (product.id_detail_report === this.availableReport[i].id_detail_report) {
        index = i;
        break;
      }
    }
    return index;
  }



  asignarCampoReport(campo:any){

    let dataUpdate = {
      id_detail_report:campo.id_detail_report,
      estado_assignacion:campo.estado_assignacion
    }

    this.rpdDinamic.updateAsignaCampo(dataUpdate).subscribe(res => {
      this.obtnerConfiguracionReportDinamic();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });

  }


}
