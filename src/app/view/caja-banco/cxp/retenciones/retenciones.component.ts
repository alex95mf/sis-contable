
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from "rxjs";
import * as moment from "moment";
import { Router } from "@angular/router";
import * as myVarGlobals from "../../../../global";
import { ToastrService } from "ngx-toastr";
import { RetencionCompraService } from "./retencion-compra.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "../../../../services/commonServices";
import { CommonVarService } from "../../../../services/common-var.services";
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
declare const $: any;
import { ConfirmationDialogService } from '../../../../config/custom/confirmation-dialog/confirmation-dialog.service';
import { FacPdfComponent } from './fac-pdf/fac-pdf.component';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

@Component({
standalone: false,
  selector: 'app-retenciones',
  templateUrl: './retenciones.component.html',
  styleUrls: ['./retenciones.component.scss']
})
export class RetencionesComponent implements OnInit {
  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();
  validaDt: any = false;
  infoRetencion: any;
  processing: any = false;
  processingtwo: any = false;
  permisions: any;
  dataUser: any;
  agente: any = 0;
  empresa: any = 0;
  estado: any = 1;
  viewDate: Date = new Date();
  fromDatePicker: Date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
  toDatePicker: Date = new Date();
  /* arrayBanco: Array < any > = []; */
  arrayStatus: any = [{
    id: 0,
    name: "Anulado"
  },
  {
    id: 1,
    name: "Activo"
  },
  ];
  vmButtons: any;
  descriptionDeleteReten: any = "";
  varDeleteRte: any;

  arrayAgente: Array<any> = [];
  dtretenciones: Array<any> = [];
  arrayEmpresa: Array<any> = [];
  arrayDtRetencionV: Array<any> = [];
  dtInformacion: any = {};
  constructor(private toastr: ToastrService,
    private router: Router,
    private reportesSrv: RetencionCompraService,
    private modalService: NgbModal,
    private commonServices: CommonService,
    private commonVarSrv: CommonVarService,
    private confirmationDialogService: ConfirmationDialogService) { }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "EXCEL":
        $('#tablaReteComprasInv').DataTable().button('.buttons-csv').trigger();
        break;
      case "PDF":
        $('#tablaReteComprasInv').DataTable().button('.buttons-pdf').trigger();
        break;
      case "IMPRIMIR":
        $('#tablaReteComprasInv').DataTable().button('.buttons-print').trigger();
        break;
      case "LIMPIAR":
        this.informaciondtlimpiar();
        break;
    }
  }

  ngOnInit(): void {

    this.vmButtons = [
      { orig: "btnsrCompraInv", paramAccion: "", boton: { icon: "fa fa-print", texto: "LIMPIAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-dark boton btn-sm", habilitar: false, imprimir: false },
      { orig: "btnsrCompraInv", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false, imprimir: false },
      { orig: "btnsrCompraInv", paramAccion: "", boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false, imprimir: false },
      { orig: "btnsrCompraInv", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "PDF" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false, imprimir: false },
    ];

    setTimeout(() => {
      this.getPermisions();
    }, 50);
  }

  getPermisions() {
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    let id_rol = this.dataUser.id_rol;
    let data = {
      codigo: myVarGlobals.fRRetencionC,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'][0];
      if (this.permisions.ver == "0") {
        this.toastr.info("Usuario no tiene permiso para ver los reportes Retenciones de Venta.");
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);
      } else {
        this.processing = true;
        /* this.getTableReport(); */
        this.getAllAgente();
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getAllAgente() {
    this.reportesSrv.getProveedores().subscribe(res => {
      this.arrayAgente = res['data'];
      this.getAllEmpresas();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }


  getAllEmpresas() {
    this.reportesSrv.getEmpresas().subscribe(res => {
      this.arrayEmpresa = res['data'];
      this.getDtRetenciones();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getDtRetenciones() {
    this.reportesSrv.getAllRetencionesDt().subscribe(res => {
      this.arrayDtRetencionV = res['data'];
      this.getTableReport();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getTableReport() {
    let data = {
      dateFrom: moment(this.fromDatePicker).format('YYYY-MM-DD'),
      dateTo: moment(this.toDatePicker).format('YYYY-MM-DD'),
      agente: this.agente == 0 ? null : this.agente,
      empresa: this.empresa == 0 ? null : this.empresa,
      estado: this.estado == 3 ? null : this.estado,
    }

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      search: true,
      paging: true,
      order: [[4, "desc"]],
      dom: 'lfrtip',
      buttons: [{
        extend: "excel",
        footer: true,
        title: "Reporte",
        filename: "reportes",
      },
      {
        extend: "print",
        footer: true,
        title: "Reporte",
        filename: "report print",
      },
      {
        extend: "pdf",
        footer: true,
        title: "Reporte",
        filename: "Reporte",
      },
      ],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };
    this.reportesSrv.getAllRetencionesC(data).subscribe(res => {
      this.validaDt = true;
      this.processing = true;
      this.infoRetencion = res['data'];
      setTimeout(() => {
        this.dtTrigger.next(null);
        this.lcargando.ctlSpinner(false);
      }, 50);
    }, error => {
      this.validaDt = true;
      this.processing = true;
      this.infoRetencion = [];
      setTimeout(() => {
        this.dtTrigger.next(null);
        this.lcargando.ctlSpinner(false);
      }, 50);
    });
  }

  rerender(): void {
    this.lcargando.ctlSpinner(true);
    this.validaDt = false;
    this.dtElement.dtInstance.then((dtInstance: any) => {
      dtInstance.destroy();
      this.getTableReport();
    });
  }

  informaciondtlimpiar() {
    this.descriptionDeleteReten = "";
    this.agente = 0;
    this.empresa = 0;
    this.estado = 3;
    this.rerender();
  }


  filterAgente(data) {
    if (this.agente != 0) {
      this.agente = data;
      this.rerender();
    } else {
      this.rerender();
    }
  }

  filterEmpresa(data) {
    if (this.empresa != 0) {
      this.empresa = data;
      this.rerender();
    } else {
      this.rerender();
    }
  }

  filterEstado(data) {
    if (this.estado != 3) {
      this.estado = data;
      this.rerender();
    } else {
      this.rerender();
    }
  }

  informaDocumento(dt) {
    this.processingtwo = true;
    $('#modalRetencionesDt').appendTo("body").modal('show');
    let modalDoc = this.arrayDtRetencionV.filter((e) => e.fk_retencion == dt.id);
    this.dtretenciones = modalDoc;
    this.dtInformacion.tipo = dt.nombre;
    this.dtInformacion.documento = dt.codigo + '-' + dt.num_doc;
    this.dtInformacion.agente = dt.name;
    this.dtInformacion.fecha = dt.fecha_emision;
    this.dtInformacion.empresa = dt.nombre_comercial;
    this.dtInformacion.autorizacion = dt.autorizacion;
    this.dtInformacion.total = dt.total;
    this.dtInformacion.estado = (dt.isactive == '1') ? 'Activo' : 'Anulado';
  }

  closeModal() {
    ($("#modalRetencionesDt") as any).modal("hide");
    this.processingtwo = false;
    this.dtInformacion = {};
    this.dtretenciones = [];
  }

  visualizarPdf(item: any) {
    const dialogRef = this.confirmationDialogService.openDialogMat(FacPdfComponent, {
      width: '1500px', height: 'auto',
      data: { titulo: "Pre-Visualizacion del comprobante", dataUser: this.dataUser, item: item }

    });
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado != false && resultado != undefined) {
      }
    });
  }

  deleteRtenecion(dt) {
    $('#exampleModalRtc').appendTo("body").modal('show');
    this.varDeleteRte = dt;
  }

  valedateDeleteRetencion() {
    if (this.permisions.eliminar == "0") {
      this.toastr.info("Usuario no tiene permiso para eliminar");
      ($("#exampleModalRtc") as any).modal("hide");
    } else {
      if (this.descriptionDeleteReten == "") {
        this.toastr.info("Ingrese una descripción");
      } else {
        Swal.fire({
          title: "Atención!",
          text: 'Seguro desea eliminar la retención?',
           icon: 'warning',
          showCancelButton: true,
          cancelButtonColor: '#DC3545',
          confirmButtonColor: '#13A1EA',
          confirmButtonText: "Aceptar"
        }).then((result) => {
          if (result.value) {
            this.lcargando.ctlSpinner(true);
            this.varDeleteRte['fk_user_anulated'] = this.dataUser.id_usuario;
            this.varDeleteRte['mot_anulate'] = this.descriptionDeleteReten;
            this.varDeleteRte['ip'] = this.commonServices.getIpAddress(),
              this.varDeleteRte['accion'] = `Eliminación de retención de ${this.varDeleteRte.nombre} # ${this.varDeleteRte.num_doc} por el usuario  ${this.dataUser.nombre} `,
              this.varDeleteRte['id_controlador'] = myVarGlobals.fPlanCuentas;

            this.reportesSrv.deletRetencion(this.varDeleteRte).subscribe(res => {
              this.toastr.success(res['message']);
              ($("#exampleModalRtc") as any).modal("hide");
              this.estado = 1;
              this.rerender();
            }, error => {
              this.lcargando.ctlSpinner(false);
              ($("#exampleModalRtc") as any).modal("hide");
              this.toastr.info(error.error.message);
            })
          }
        })
      }
    }
  }
}

