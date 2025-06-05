import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from "rxjs";
import * as moment from "moment";
import { Router } from "@angular/router";
import * as myVarGlobals from "../../../../global";
import { ToastrService } from "ngx-toastr";
import { RetencionVentaService } from "./retencion-venta.service";
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
  selector: 'app-retencion-venta',
  templateUrl: './retencion-venta.component.html',
  styleUrls: ['./retencion-venta.component.scss']
})
export class RetencionVentaComponent implements OnInit {

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
  idModal: any;
  viewDate: Date = new Date();
  fromDatePicker: Date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
  toDatePicker: Date = new Date();
  vmButtons: any = [];
  arrayStatus: any = [{
    id: 0,
    name: "Anulado"
  },
  {
    id: 1,
    name: "Activo"
  },

  ];
  locality: any;
  arrayAgente: Array<any> = [];
  dtretenciones: Array<any> = [];
  arrayEmpresa: Array<any> = [];
  arrayDtRetencionV: Array<any> = [];
  dtInformacion: any = {};
  arrayCliente: any;

  descriptionDeleteReten: any = "";
  varDeleteRte: any;

  constructor(private toastr: ToastrService,
    private router: Router,
    private reportesSrv: RetencionVentaService,
    private modalService: NgbModal,
    private commonServices: CommonService,
    private commonVarSrv: CommonVarService,
    private confirmationDialogService: ConfirmationDialogService) { }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsrVenta", paramAccion: "", boton: { icon: "fa fa-print", texto: "LIMPIAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-dark boton btn-sm", habilitar: false, imprimir: false },
      { orig: "btnsrVenta", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false, imprimir: false },
      { orig: "btnsrVenta", paramAccion: "", boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false, imprimir: false },
      { orig: "btnsrVenta", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "PDF" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false, imprimir: false },
    ];

    setTimeout(() => {
      this.getPermisions();
    }, 10);
  }

  getPermisions() {
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    let id_rol = this.dataUser.id_rol;
    let data = {
      codigo: myVarGlobals.fRRetencionV,
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

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "EXCEL":
        $('#tablaReteVentas').DataTable().button('.buttons-csv').trigger();
        break;
      case "PDF":
        $('#tablaReteVentas').DataTable().button('.buttons-pdf').trigger();
        break;
      case "IMPRIMIR":
        $('#tablaReteVentas').DataTable().button('.buttons-print').trigger();
        break;
      case "LIMPIAR":
        this.informaciondtlimpiar();
        break;
    }
  }

  getAllAgente() {
    this.reportesSrv.getAgente().subscribe(res => {
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
      this.getCliente();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getCliente() {
    this.reportesSrv.getCliente().subscribe(res => {
      this.arrayCliente = res['data'];
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
      pageLength: 10,
      search: true,
      paging: true,
      responsive: true,
      dom: 'lfrtip',
      order: [[4, "desc"]],
      buttons: [{
        extend: "csv",
        footer: true,
        title: "Reporte",
        filename: "reportes",
        charset: 'UTF-8',
        bom: true,
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
        title: "Retenciones Venta",
        filename: "Reporte",
        pageSize: 'A4',
        alignment: "center",
        customize: function (doc) {
          doc.content[1].table.widths = [20, 70, 90, 90, 90, 40, 70, 70],
            doc.defaultStyle.fontSize = 10,
            doc.defaultStyle.alignment = 'center',
            doc.styles.title = {
              color: '#404a63',
              fontSize: '14',
              alignment: 'center',
              bold: true,
            },//title
            doc.styles.tableHeader = {
              fillColor: '#404a63',
              color: 'white',
              fontSize: '11',
              alignment: 'center',
              bold: true,
            }//para cambiar el backgorud del escabezado
        },
      },
      ],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };
    this.lcargando.ctlSpinner(true);
    this.reportesSrv.getAllRetenciones(data).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.validaDt = true;
      this.processing = true;
      this.infoRetencion = res['data'];
      if (this.infoRetencion.length == 0) {
        this.vmButtons[1].habilitar = true;
        this.vmButtons[2].habilitar = true;
        this.vmButtons[3].habilitar = true;
      } else {
        this.vmButtons[1].habilitar = false;
        this.vmButtons[2].habilitar = false;
        this.vmButtons[3].habilitar = false;
      }
      setTimeout(() => {
        this.dtTrigger.next(null);
      }, 50);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.validaDt = true;
      this.processing = true;
      setTimeout(() => {
        this.dtTrigger.next(null);
      }, 50);
      this.vmButtons[1].habilitar = true;
      this.vmButtons[2].habilitar = true;
      this.vmButtons[3].habilitar = true;
    });
  }

  rerender(): void {
    this.validaDt = false;
    this.dtElement.dtInstance.then((dtInstance: any) => {
      dtInstance.destroy();
      this.getTableReport();
    });
  }

  informaciondtlimpiar() {
    this.agente = 0;
    this.empresa = 0;
    this.estado = 3;
    this.rerender();
  }


  filterAgente(data) {
    this.lcargando.ctlSpinner(true);
    if (this.agente != 0) {
      this.agente = data;
      this.rerender();
    } else {
      this.rerender();
    }
  }

  filterEmpresa(data) {
    this.lcargando.ctlSpinner(true);
    if (this.empresa != 0) {
      this.empresa = data;
      this.rerender();
    } else {
      this.rerender();
    }
  }

  filterEstado(data) {
    this.lcargando.ctlSpinner(true);
    if (this.estado != 3) {
      this.estado = data;
      this.rerender();
    } else {
      this.rerender();
    }
  }

  informaDocumento(dt) {
    this.idModal = dt;
    this.data();
  }

  data() {
    /* console.log(this.arrayDtRetencionV,this.idModal) */
    let modalDoc = this.arrayDtRetencionV.filter((e) => e.fk_retencion == this.idModal.id);
    this.dtretenciones = modalDoc;
    this.dtInformacion.tipo = this.idModal.nombre;
    this.dtInformacion.documento = this.idModal.codigo + '-' + this.idModal.num_doc;
    this.dtInformacion.agente = this.idModal.name;
    this.dtInformacion.fecha = this.idModal.fecha_emision;
    this.dtInformacion.empresa = this.idModal.nombre_comercial;
    this.dtInformacion.autorizacion = this.idModal.autorizacion;
    this.dtInformacion.total = this.idModal.total;
    this.dtInformacion.estado = (this.idModal.isactive == '1') ? 'Activo' : 'Anulado';
    setTimeout(() => {
      $('#modalRetencionesDt').appendTo("body").modal('show');
    }, 100);
  }


  closeModal() {
    this.lcargando.ctlSpinner(false);
    ($("#modalRetencionesDt") as any).modal("hide");
    this.dtInformacion = {};
    this.dtretenciones = [];
  }

  formatNumber(params) {
    this.locality = 'en-EN';
    params = parseFloat(params).toLocaleString(this.locality, {
      minimumFractionDigits: 4
    })
    params = params.replace(/[,.]/g, function (m) { return m === ',' ? '.' : ','; });
    return params;
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
    $('#exampleModalRtv').appendTo("body").modal('show');
    this.varDeleteRte = dt;
  }

  valedateDeleteRetencion() {
    if (this.permisions.eliminar == "0") {
      this.toastr.info("Usuario no tiene permiso para eliminar");
      ($("#exampleModalRtv") as any).modal("hide");
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
              ($("#exampleModalRtv") as any).modal("hide");
              this.estado = 1;
              this.rerender();
            }, error => {
              this.lcargando.ctlSpinner(false);
              ($("#exampleModalRtv") as any).modal("hide");
              this.toastr.info(error.error.message);
            })
          }
        })
      }
    }
  }

}


