import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Subject } from "rxjs";
import * as moment from "moment";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ReportesTransService } from "./reportes-trans.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "../../../../../services/commonServices";
import { CommonVarService } from "../../../../../services/common-var.services";
import { CcSpinerProcesarComponent } from '../../../../../config/custom/cc-spiner-procesar.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

declare const $: any;

@Component({
  selector: 'app-reportes-trans',
  templateUrl: './reportes-trans.component.html',
  styleUrls: ['./reportes-trans.component.scss']
})export class ReportesTransComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();
  validaDt: any = false;
  infoData: any;
  processing: any = false;
  processingtwo: any = false;
  permisions: any;
  dataUser: any;
  viewDate: Date = new Date();
  fromDatePicker: Date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
  toDatePicker: Date = new Date();
  arrayBanco: Array < any > = [];
  arrayTransf: Array < any > = [];
  arrayAllConciliacion: Array < any > = [];
  banco: any;
  transferencia: any;
  transaccion: any;
  secuenceDta: any;
  numdocDta: any;
  adataData: any;

  vmButtons: any;
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  constructor(private toastr: ToastrService,
    private router: Router,
    private reportesSrv: ReportesTransService,
    private modalService: NgbModal,
    private commonServices: CommonService,
    private commonVarSrv: CommonVarService,
    private dialogRef: MatDialogRef<ReportesTransComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

  ngOnInit(): void {

    this.vmButtons = [
        { orig: "btnTrsBovRep", paramAccion: "1", boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false, imprimir: false},
        { orig: "btnTrsBovRep", paramAccion: "1", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false, imprimir: false},
        { orig: "btnTrsBovRep", paramAccion: "1", boton: { icon: "fa fa-file-pdf-o", texto: "PDF" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false, imprimir: false},
        { orig: "btnTrsBovRep", paramAccion: "", boton: { icon: "fa fa-eraser", texto: "LIMPIAR FILTROS" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: false},
        { orig: "btnTrsBovRep", paramAccion: "", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-dark boton btn-sm", habilitar: false}
    ];
    
    this.processing = true;
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    setTimeout(() => {
        this.getTableReport();
    }, 10);
    this.getInfoBank();
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
        case "CERRAR":
            this.dialogRef.close(false);
        break;
        case "LIMPIAR FILTROS":
            this.informaciondtlimpiar();
        break;
        case "EXCEL":
          $('#tablaReporTransCta').DataTable().button( '.buttons-excel' ).trigger();
        break;
        case "IMPRIMIR":
          $('#tablaReporTransCta').DataTable().button( '.buttons-print' ).trigger();       
        break;
        case "PDF":
          $('#tablaReporTransCta').DataTable().button( '.buttons-pdf' ).trigger();
        break;
    }   
  }

  getInfoBank() {
      this.reportesSrv.getAccountsByDetails({
          company_id: this.dataUser.id_empresa
      }).subscribe(res => {
          this.arrayBanco = res['data'];
          this.getTranf();
      }, error => {
          this.toastr.info(error.error.message);
      })
  }

  getTranf() {
      this.reportesSrv.getTransaferenciaData().subscribe(res => {
          this.arrayTransf = res['data'];
          this.TransfData();
      }, error => {
          this.toastr.info(error.error.message);
      })
  }

  TransfData() {
      this.reportesSrv.getTransfData().subscribe(res => {
          this.arrayAllConciliacion = res['data'];
      }, error => {
          this.toastr.info(error.error.message);
      })
  }

  informaciondtlimpiar() {
      this.banco = undefined;
      this.transferencia = undefined;
      this.transaccion = undefined;
      this.rerender();
  }

  getTableReport() {
      let data = {
          dateFrom: moment(this.fromDatePicker).format('YYYY-MM-DD'),
          dateTo: moment(this.toDatePicker).format('YYYY-MM-DD'),
          banco: this.banco == undefined ? null : this.banco,
          transferencia: this.transferencia == undefined ? null : this.transferencia,
          transaccion: this.transaccion == undefined ? null : this.transaccion
      }
      this.dtOptions = {
          pagingType: 'full_numbers',
          pageLength: 5,
          search: true,
          paging: true,
          dom: "frtip",
          scrollY: "200px",
          scrollCollapse: true,
          buttons: [{
                  extend: "excel",
                  footer: true,
                  title: "Reporte",
                  filename: "reportes",
                  text: '<button class="btn btn-success" style="width: 150px; height: 43px; font-weight: bold; color:white; box-shadow: 2px 2px 0.5px #666; font-size: 13px;">EXCEL <i class="fa fa-file-excel-o" aria-hidden="true" style="font-size: 19px;margin-right: 10px; margin-top: 4px; margin:6px;"> </i></button>',
              },
              {
                  extend: "print",
                  footer: true,
                  title: "Reporte",
                  filename: "report print",
                  text: '<button class="btn" style="width: 150px; height: 43px; font-weight: bold; background-color:#005CCD ; color:white; box-shadow: 2px 2px 0.5px #666;">IMPRIMIR<i class="fa fa-print" aria-hidden="true" style="font-size: 19px; margin-right: 10px; margin-top: 4px; margin:6px;" ></i></button>',
              },
              {
                  extend: "pdf",
                  footer: true,
                  title: "Reporte",
                  filename: "Reporte",
                  text: '<button class="btn btn-danger " style="width: 150px; height: 43px; font-weight: bold; color:white; box-shadow: 2px 2px 0.5px #666; font-size: 13px;">PDF <i class="fa fa-file-pdf-o" aria-hidden="true" style="font-size: 19px; margin-right: 10px; margin-top: 4px; margin:6px;"></i></button>',
              },
          ],
          language: {
              url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
          }
      };
      this.mensajeSppiner = "Cargando...";
      this.lcargando.ctlSpinner(true);
      this.reportesSrv.getAllTrnsaferencia(data).subscribe(res => {
        this.lcargando.ctlSpinner(false);
          this.validaDt = true;
          this.processing = true;
          this.infoData = res['data'];
          setTimeout(() => {
              this.dtTrigger.next();
          }, 50);
      }, error => {
        this.lcargando.ctlSpinner(false);
          this.validaDt = true;
          this.processing = true;
          setTimeout(() => {
              this.dtTrigger.next();
          }, 50);
          this.toastr.info(error.error.message);
      });
  }

  rerender(): void {
      this.validaDt = false;
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.getTableReport();
      });
  }

  selectNameBank(dt) {
      let nameBanktwo = this.arrayAllConciliacion.filter(e => e.secuencia == dt.secuencia && e.tipo_movimiento == 'C');
      return nameBanktwo[0]!=undefined?nameBanktwo[0]['name_banks']:"";
  }

  filterBanco(data) {
      if (this.banco != undefined) {
          this.banco = data;
          this.rerender();
      } else {
          this.rerender();
      }
  }

  filterTransf(data) {
      if (this.transferencia != undefined) {
          this.transferencia = data;
          this.rerender();
      } else {
          this.rerender();
      }
  }

  filterTrans(data) {
      if (this.transaccion != undefined) {
          this.transaccion = data;
          this.rerender();
      } else {
          this.rerender();
      }
  }
}