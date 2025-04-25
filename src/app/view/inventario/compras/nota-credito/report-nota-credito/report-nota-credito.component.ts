import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Subject } from "rxjs";
import * as moment from "moment";
import { Router } from "@angular/router";
import "sweetalert2/src/sweetalert2.scss";
import { ToastrService } from "ngx-toastr";
import * as myVarGlobals from "../../../../../global";
import { ReportNcreditohService } from "./report-nota-credito.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "../../../../../services/commonServices";
import { CommonVarService } from "../../../../../services/common-var.services";
import { ConfirmationDialogService } from '../../../../../config/custom/confirmation-dialog/confirmation-dialog.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ListadoRepNcComponent } from './listado-rep-nc/listado-rep-nc.component';
declare const $: any;

@Component({
  selector: 'app-report-nota-credito',
  templateUrl: './report-nota-credito.component.html',
  styleUrls: ['./report-nota-credito.component.scss']
})
export class ReportNotaCreditoComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();
  validaDt: any = false;
  infoData: any;
  processing: any = false;
  permisions: any;
  dataUser: any;
  viewDate: Date = new Date();
  fromDatePicker: Date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
  toDatePicker: Date = new Date();
  arrayTipoAgente: Array<any> = [
    { name: "Cliente" },
    { name: "Proveedor" },
  ];
  statusDocuments: any = [
    { id: 1, name: "En Proceso" },
    { id: 4, name: "Aprobado" },
  ];

  

  arrayClientes: Array<any> = [];
  arrayMotivos: Array<any> = [];
  arraySucursales: Array<any> = [];
  arrayDtNotaCredito: Array<any> = [];
  dtnotaCredito: Array<any> = [];
  dtInformacion: any = {};
  Tagente:any;
  agente:any;
  motivo:any;
  sucursal:any;
  statusFilter:any;
  processingtwo: any = false;
  latestStatus: any;
  vmButtons:any = [];

  constructor(private toastr: ToastrService,
    private router: Router,
    private reportesSrv: ReportNcreditohService,
    private modalService: NgbModal,
    private commonServices: CommonService,
    private commonVarSrv: CommonVarService,
    private dialogRef: MatDialogRef<ReportNotaCreditoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private confirmationDialogService: ConfirmationDialogService
    ) { }

    ngOnInit(): void {

      this.vmButtons = [
        { orig: "btnRepNotCred", paramAccion: "1", boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false, imprimir: false},
        { orig: "btnRepNotCred", paramAccion: "1", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false, imprimir: false},
        { orig: "btnRepNotCred", paramAccion: "1", boton: { icon: "fa fa-file-pdf-o", texto: "PDF" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false, imprimir: false},
        { orig: "btnRepNotCred", paramAccion: "1", boton: { icon: "fa fa-eraser", texto: "LIMPIAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info btn-sm", habilitar: false, imprimir: false},
        { orig: "btnRepNotCred", paramAccion: "1", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false}
      ];


      setTimeout(() => {
        this.latestStatus = this.data.latestStatus;
      }, 10);
      this.processing = true;
      this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
      this.getTableReport();
      this.getClientes();
    }

    metodoGlobal(evento: any) {
      switch (evento.items.boton.texto + evento.items.paramAccion) {
        case "LIMPIAR1":
          this.informaciondtlimpiar();
        break;
        case "CERRAR1":
          this.latestStatus = null;
          this.dialogRef.close(false);
        break;
        case "EXCEL1":
          $('#tablaReporNotCred').DataTable().button( '.buttons-excel' ).trigger();
        break;
        case "IMPRIMIR1":
          $('#tablaReporNotCred').DataTable().button( '.buttons-print' ).trigger();       
        break;
        case "PDF1":
          $('#tablaReporNotCred').DataTable().button( '.buttons-pdf' ).trigger();
        break; 
      }
    }
  
 /*    getPermisions() {   
      this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
      let id_rol = this.dataUser.id_rol;
      let data = {
        codigo: myVarGlobals.fREtiqueta,
        id_rol: id_rol
      }
      this.commonServices.getPermisionsGlobas(data).subscribe(res => {
        this.permisions = res['data'][0];
        if (this.permisions.ver == "0") {
          this.toastr.info("Usuario no tiene acceso a este formulario.");
          this.router.navigateByUrl('dashboard');
        } else {
          this.processing = true;
          this.getClientes();
        }
      }, error => {
        this.toastr.info(error.error.message);
      })
    } */

    getClientes() {
      this.reportesSrv.getCliente().subscribe(res => {
        this.arrayClientes = res['data'];
        this.fillCatalog();
      }, error => {
        this.toastr.info(error.error.message);
      })
    }

    fillCatalog() {
      let data = {
        params: "'NOTA CLIENTE'",
      };
      this.reportesSrv.getCatalogs(data).subscribe(res => {
        this.arrayMotivos = res["data"]["NOTA CLIENTE"];
        this.getsucursales();
        
      }, (error) => {
        this.toastr.info(error.error.message);
      });
    }

    getsucursales() {
      let data = {
        id_empresa: this.dataUser.id_empresa,
      }
      this.reportesSrv.getSucursal(data).subscribe(res => {
        this.arraySucursales = res['data'];
        this.getDT();
      }, error => {
        this.toastr.info(error.error.message);
      })
    }

    getDT() {
      this.reportesSrv.getdtNotaCredito().subscribe(res => {
        this.arrayDtNotaCredito = res['data'];
      }, error => {
        this.toastr.info(error.error.message);
      })
    }
  
    getTableReport() {
      let data = {
        dateFrom: moment(this.fromDatePicker).format('YYYY-MM-DD'),
        dateTo: moment(this.toDatePicker).format('YYYY-MM-DD'),
        tipo_agente: this.Tagente  == undefined ? null : this.Tagente,
        agente: this.agente  == undefined ? null : this.agente,
        motivo: this.motivo  == undefined  ? null : this.motivo,
        sucursal: this.sucursal  == undefined ? null : this.sucursal,
        doc: this.statusFilter  == undefined ? null : this.statusFilter,
        tipoNota: "NDC-C"
  }

   this.dtOptions = {
    pagingType: 'full_numbers',
    pageLength: 5,
    search: true,
    paging: true,
    dom: "frtip",
    buttons: [
      {
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
  this.reportesSrv.getReportNotaCredito(data).subscribe(res => {
    this.validaDt = true;
    this.processing = true;
    this.infoData = res['data'];
    if (this.infoData.length > 0) {
      this.vmButtons[0].habilitar = false;
      this.vmButtons[1].habilitar = false;
      this.vmButtons[2].habilitar = false;
  } else {
      this.vmButtons[0].habilitar = true;
      this.vmButtons[1].habilitar = true;
      this.vmButtons[2].habilitar = true;
  } 
    setTimeout(() => {
      this.dtTrigger.next();
    }, 50);
  }, error => {
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

  filterTagente(data){ 
    if (this.Tagente != undefined) {
      this.Tagente = data;
      this.rerender();
      } else{
        this.rerender();
    }
  }

  filterAgente(data){ 
  if (this.agente != undefined) {
    this.agente = data;
    this.rerender();
    } else{
      this.rerender();
  }
}

filterMotivo(data){ 
  if (this.motivo != undefined) {
    this.motivo = data;
    this.rerender();
    } else{
      this.rerender();
  }
}

filterSucursal(data){ 
  if (this.sucursal != undefined) {
    this.sucursal = data;
    this.rerender();
    } else{
      this.rerender();
  }
}

filterEstado(data){ 
  if (this.statusFilter != undefined) {
    this.statusFilter = data;
    this.rerender();
    } else{
      this.rerender();
  }
}

informaciondtlimpiar(){
  this.Tagente = undefined;
  this.agente = undefined;
  this.motivo = undefined;
  this.sucursal = undefined;
  this.statusFilter = undefined;
  this.rerender();
 }

  
 informaDocumento(dt,i) {
  this.processingtwo = true;
  let modalDoc = this.arrayDtNotaCredito.filter((e) => e.fk_notas == dt.id);
  this.dtnotaCredito = modalDoc;

  this.dtInformacion.codigo = dt.codigo;
  this.dtInformacion.nombre = dt.nombre;
  this.dtInformacion.secuencia_doc = dt.secuencia_doc.toString().padStart(10, '0');
  this.dtInformacion.tipo_agente = dt.tipo_agente;
  this.dtInformacion.ruc = dt.ruc;
  this.dtInformacion.razon_social = dt.razon_social;
  this.dtInformacion.telefono = dt.telefono;
  this.dtInformacion.ciudad = dt.ciudad;
  this.dtInformacion.causa = dt.causa;
  this.dtInformacion.concepto = dt.concepto;
  this.dtInformacion.nombreSucursal = dt.nombreSucursal;
  this.dtInformacion.nombreEmpresa = dt.nombreEmpresa;
  this.dtInformacion.valor_disponible = dt.valor_disponible;
  this.dtInformacion.valor_usado = dt.valor_usado;
  this.dtInformacion.total  = dt.total;
  this.dtInformacion.estado  = (dt.filter_doc != '4') ? 'En proceso' : 'Aprobada';
  this.dtInformacion.name_user_aprobated  =  (dt.filter_doc != null) ? 'Ninguno' : dt.name_user_aprobated;


  const dialogRef = this.confirmationDialogService.openDialogMat(ListadoRepNcComponent, {
    width: '1500px', height: 'auto',
    data: { titulo: "Información Nota Crédito", dtInformacion: this.dtInformacion, dtnotaCredito: this.dtnotaCredito}
    
  } );

  dialogRef.afterClosed().subscribe(resultado => {
    if(resultado!=false && resultado!=undefined){

    }else{
      this.closeModal();
    }
  });


} 

closeModal() {
  // ($("#modalReportnotaCredito") as any).modal("hide");
  this.processingtwo = false;
/*   this.dtInformacion = {};
 */  this.dtnotaCredito = [];
}

 
 
}
