import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Subject } from "rxjs";
import * as moment from "moment";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ReportComprobantesService } from "./report-comprobantes.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "../../../../../services/commonServices";
import { CommonVarService } from "../../../../../services/common-var.services";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationDialogService } from '../../../../../config/custom/confirmation-dialog/confirmation-dialog.service';
import { ListadoComIgComponent } from './listado-com-ig/listado-com-ig.component';

declare const $: any;

@Component({
standalone: false,
  selector: 'app-report-comprobantes',
  templateUrl: './report-comprobantes.component.html',
  styleUrls: ['./report-comprobantes.component.scss']
})export class ReportComprobantesComponent implements OnInit {
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
    inBeneficiario: any = false;
    inTransaccion: any = true;
    inDocumento: any = false;
    documento: any;
    beneficiario: any;
    transaccion: any;
    pago: any;
    estado: any;
    cliente: any;
    arrayData: Array < any > = [];
    arrayIngreso: Array < any > = [];
    arraytx: Array < any > = [];
    arrayDtCIngreso: Array < any > = [];
    dtcomprobanteIngreso: Array < any > = [];
    dtInformacion: any = {};
    arrayPago: Array < any > = [];
    arrayClientes: Array < any > = [];
    vmButtons:any = [];
    arrayStatus: any = [{
            id: 0,
            name: "Anulado"
        },
        {
            id: 1,
            name: "Activo"
        },

    ];
    constructor(private toastr: ToastrService,
        private router: Router,
        private reportesSrvI: ReportComprobantesService,
        private modalService: NgbModal,
        private commonServices: CommonService,
        private commonVarSrv: CommonVarService,
        private dialogRef: MatDialogRef<ReportComprobantesComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private confirmationDialogService: ConfirmationDialogService) {}

    ngOnInit(): void {
        this.commonVarSrv.updPerm.next(true);

        this.vmButtons = [
            { orig: "btnRepCompIg", paramAccion: "1", boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false, imprimir: false},
            { orig: "btnRepCompIg", paramAccion: "1", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false, imprimir: false},
            { orig: "btnRepCompIg", paramAccion: "1", boton: { icon: "fa fa-file-pdf-o", texto: "PDF" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-dark boton btn-sm", habilitar: false, imprimir: false},
            { orig: "btnRepCompIg", paramAccion: "1", boton: { icon: "fa fa-eraser", texto: "LIMPIAR FILTROS" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: false, imprimir: false},
            { orig: "btnRepCompIg", paramAccion: "1", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false}
        ];


        this.processing = true;
        this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
        this.getTableReport();
        this.getCatalogos();
    }

    metodoGlobal(evento: any) {
        switch (evento.items.boton.texto + evento.items.paramAccion) {
          case "LIMPIAR FILTROS1":
            this.informaciondtlimpiar();
          break;
          case "CERRAR1":
            this.dialogRef.close(false);
          break;
          case "EXCEL1":
            $('#tablaReporCompIg').DataTable().button( '.buttons-excel' ).trigger();
          break;
          case "IMPRIMIR1":
            $('#tablaReporCompIg').DataTable().button( '.buttons-print' ).trigger();       
          break;
          case "PDF1":
            $('#tablaReporCompIg').DataTable().button( '.buttons-pdf' ).trigger();
          break; 
        }
      }

    getCatalogos() {
        let data = {
            fields: ["FORMA PAGO PROVEEDOR"]
        };
        this.reportesSrvI.getCommonInformationFormule(data).subscribe(res => {
            this.arrayPago = res['data']['catalogs'];
            this.getIngreso();
        }, error => {
            this.toastr.info(error.error.message);
        })
    }

    /*  getClientes() {
       this.reportesSrvI.getCliente().subscribe(res => {
         this.arrayClientes = res['data'];
         this.getIngreso();
       }, error => {
         this.toastr.info(error.error.message);
       })
     } */

    getIngreso() {
        this.reportesSrvI.getReportComprobantesI().subscribe(res => {
            this.arrayIngreso = res['data'];
            this.getIngresoDT();
        }, error => {
            this.toastr.info(error.error.message);
        })
    }

    getIngresoDT() {
        this.reportesSrvI.getAllComprobantesDT().subscribe(res => {
            this.arrayDtCIngreso = res['data'];
        }, error => {
            this.toastr.info(error.error.message);
        })
    }

    getTableReport() {
        let data = {
            dateFrom: moment(this.fromDatePicker).format('YYYY-MM-DD'),
            dateTo: moment(this.toDatePicker).format('YYYY-MM-DD'),
            documento: this.documento == undefined ? null : this.documento,
            cliente: this.cliente == undefined ? null : this.cliente,
            pago: this.pago == undefined ? null : this.pago,
            transaccion: this.transaccion == undefined ? null : this.transaccion,
            estado: this.estado == undefined ? null : this.estado
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
        this.reportesSrvI.getAllComprobantes(data).subscribe(res => {
            this.commonVarSrv.updPerm.next(false);
            this.validaDt = true;
            this.processing = true;
            this.infoData = res['data'];
            setTimeout(() => {
                this.dtTrigger.next(null);
            }, 50);
        }, error => {
            this.commonVarSrv.updPerm.next(false);
            this.validaDt = true;
            this.processing = true;
            setTimeout(() => {
                this.dtTrigger.next(null);
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


    filterDocumento(event) {
        this.documento = event;
        if (this.documento != undefined) {
            this.rerender();
            let filt = this.arrayIngreso.find((e) => e.secuencial == this.documento);
            this.cliente = filt.id;
            this.inBeneficiario = true;
        } else {
            this.rerender();
        }
    }

    filterBeneficiario(event) {
        this.cliente = event;
        if (this.cliente != undefined) {
            this.rerender();
            let filt = this.arrayIngreso.find((e) => e.id == this.cliente);
            this.documento = filt.secuencial;
            this.inDocumento = true;
        } else {
            this.rerender();
        }
    }

    filterPago(data) {
        this.pago = data;
        if (this.pago != undefined) {
            if (this.pago != 'Efectivo') {
                this.inTransaccion = false;
                let filt = this.arrayIngreso.filter((e) => e.metodo_pago == this.pago);
                this.rerender();
                this.arraytx = filt;
                this.inTransaccion = false;
            } else {
                this.inTransaccion = true;
                this.transaccion = undefined;
                this.rerender();
            }
        } else {
            this.rerender();
        }
    }

    filterTransaccion(data) {
        if (this.transaccion != undefined) {
            this.transaccion = data;
            this.rerender();
        } else {
            this.rerender();
        }
    }

    filterStatus(data) {
        if (this.estado != undefined) {
            this.estado = data;
            this.rerender();
        } else {
            this.rerender();
        }
    }

    informaciondtlimpiar() {
        this.documento = undefined;
        this.cliente = undefined;
        this.pago = undefined;
        this.transaccion = undefined;
        this.estado = undefined;
        this.rerender();
    }

    informaDocumento(dt, i) {
        this.processingtwo = true;
        let modalDoc = this.arrayDtCIngreso.filter((e) => e.fk_cdi == dt.id);
        this.dtcomprobanteIngreso = modalDoc;
        this.dtInformacion.nombre = dt.nombre;
        this.dtInformacion.documento = dt.fk_empresa.toString().padStart(3, 0) + '-' + dt.fk_sucursal.toString().padStart(3, 0) + '-' + dt.secuencial.toString().padStart(10, '0');
        this.dtInformacion.ciudad = dt.ciudad;
        this.dtInformacion.fecha = dt.fecha_emision;
        this.dtInformacion.beneficiario = dt.beneficiario;
        this.dtInformacion.metodo_pago = dt.metodo_pago;
        this.dtInformacion.valor = dt.valor;
        this.dtInformacion.num_tx = dt.num_tx;
        this.dtInformacion.concepto = dt.concepto;
        this.dtInformacion.tipo_ingreso = dt.tipo_ingreso;
        this.dtInformacion.name_bank = dt.name_bank;
        this.dtInformacion.ruc = dt.ruc;
        this.dtInformacion.nombre_cliente = dt.nombre_cliente;

        const dialogRef = this.confirmationDialogService.openDialogMat(ListadoComIgComponent, {
            width: '1500px', height: 'auto',
            data: { titulo: "Información Cotización", dtInformacion: this.dtInformacion, dtcomprobanteIngreso: this.dtcomprobanteIngreso}
            
          } );
        
          dialogRef.afterClosed().subscribe(resultado => {
            if(resultado!=false && resultado!=undefined){
        
            }else{
              this.closeModal();
            }
          });
    }

    closeModal() {
        // ($("#modalComprobanteIngreso") as any).modal("hide");
        this.processingtwo = false;
        this.dtInformacion = {};
        this.dtcomprobanteIngreso = [];
    }
}