import { Component, OnInit, ViewChild } from "@angular/core";
import { Subject } from "rxjs";
import * as moment from "moment";
import { Router } from "@angular/router";
import "sweetalert2/src/sweetalert2.scss";
import { ToastrService } from "ngx-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as myVarGlobals from "../../../../global";
import { ReportsService } from "./reportes.service";
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "../../../../services/commonServices";
import { CommonVarService } from "../../../../services/common-var.services";
import 'sweetalert2/src/sweetalert2.scss';
import { CcSpinerProcesarComponent } from "../../../../config/custom/cc-spiner-procesar.component";
import Swal from 'sweetalert2';
declare const $: any;

@Component({
standalone: false,
  selector: "app-reportes-bancos",
  templateUrl: "./reportes.component.html",
  styleUrls: ["./reportes.component.scss"],
})
export class ReportesComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();
  processing: any = false;
  processingQuotes: boolean = false;
  flag: number = 0;
  processingtwo: boolean = false;
  dataUser: any;
  permisions: any;
  dataCuenta: any;
  validaDtUser: any = false;
  actBoton: any = false;
  guardarolT: any = [];
  viewDate: Date = new Date();
  fromDatePicker: Date = new Date();
  toDatePicker: Date = new Date();
  bankCuenta: Array<any> = [];
  bankData: Array<any> = [];
  arrayCheque: Array<any> = [];
  comprobanteData: Array<any> = [];
  statusCheque: Array<any> = [
    { name: "Girado" },
    { name: "Pagado" },
    { name: "Protestado" },
    { name: "Devuelto" },
    { name: "Anulado" },
    { name: "Procesando" },
  ];

  detalle: any = 0;
  cuenta: any = 0;
  beneficiario: any = 0;
  numCheque: any;
  estado: any = 0;
  valor: any;
  chequeDetalle: any;
  estadoCheque: any;
  nombreBanco: any;
  numeroCheque: any;
  benefCheque: any;
  tipoCheque: any;
  valorCheque: any;
  descripCheque: any;
  tipoIngreso: any;
  cuentaCheque: any;
  fechaEmision: any;
  fechaCobro: any;
  fechaVencimiento: any;
  id_bank_cheque: any;
  fechaValida: any;
  vmButtons: any = [];
  vmButtonsT: any = [];
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private reportSrv: ReportsService,
    private commonServices: CommonService,
    private modalService: NgbModal,
    private commonVarSrv: CommonVarService
  ) { }

  ngOnInit(): void {

    this.vmButtons = [
      { orig: "btnRepCtasBacn", paramAccion: "", boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false, imprimir: false },
      { orig: "btnRepCtasBacn", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false, imprimir: false },
      { orig: "btnRepCtasBacn", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "PDF" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false, imprimir: false },
    ];

    this.buttonsTwo();
    setTimeout(() => {
      this.permissions();
    }, 10);
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "EXCEL":
        $('#tablaRepCtasBacn').DataTable().button('.buttons-excel').trigger();
        break;
      case "IMPRIMIR":
        $('#tablaRepCtasBacn').DataTable().button('.buttons-print').trigger();
        break;
      case "PDF":
        $('#tablaRepCtasBacn').DataTable().button('.buttons-pdf').trigger();
        break;
    }
  }

  permissions() {
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    let data = {
      codigo: myVarGlobals.fRbancoCheque,
      id_rol: this.dataUser.id_rol,
    };
    this.commonServices.getPermisionsGlobas(data).subscribe((res) => {
      this.permisions = res["data"];

      if (this.permisions.length == 0) {
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);
        this.toastr.info("Usuario no tiene permiso para ver el reporte");
        return;
      }

      if (this.permisions[0].ver == "0") {
        this.lcargando.ctlSpinner(false);
        this.processing = false;
        this.toastr.info("Usuario no tiene permiso para ver Banco Cheque");
        this.vmButtons = [];
      } else {
        this.processing = true;
        this.viewDate = undefined;
        this.fromDatePicker = undefined;
        this.toDatePicker = undefined;
        this.Cuentas();

      }
    });
  }

  Cuentas() {
    this.reportSrv.getCuentas().subscribe((res) => {
      this.bankCuenta = res["data"];
      this.BankCheque();
    }, error => {
      this.lcargando.ctlSpinner(false);
    });
  }

  BankCheque() {
    this.reportSrv.getBankCheque().subscribe((res) => {
      this.bankData = res["data"];
      this.ComprobanteCb();
    }, error => {
      this.lcargando.ctlSpinner(false);
    });
  }

  ComprobanteCb() {
    this.reportSrv.getCabezeraComp().subscribe((res) => {
      this.comprobanteData = res["data"];
      this.getTableReport();
    }, error => {
      this.lcargando.ctlSpinner(false);
    });
  }

  getTableReport() {
    let data = {
      fk_bank: this.cuenta == 0 ? null : this.cuenta,
      beneficiario: this.beneficiario == 0 ? null : this.beneficiario,
      descripcion: this.detalle == 0 || this.detalle == "" ? null : this.detalle,
      number_cheque: this.numCheque == undefined ? null : this.numCheque,
      fecha_emision: this.viewDate == undefined ? null : moment(this.viewDate).format("YYYY-MM-DD"),
      fecha_vencimiento: this.fromDatePicker == undefined ? null : moment(this.fromDatePicker).format("YYYY-MM-DD"),
      fecha_pago: this.toDatePicker == undefined ? null : moment(this.toDatePicker).format("YYYY-MM-DD"),
      status: this.estado == 0 ? null : this.estado,
    }

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      search: true,
      paging: true,
      dom: "frtip",
      scrollY: "200px",
      scrollCollapse: true,
      order: [[4, "desc"]],
      buttons: [
        {
          extend: "excel",
          footer: true,
          title: "Reporte Banco Cheque",
          filename: "Excel",
        },
        {
          extend: "print",
          footer: true,
          title: "Reporte Banco Cheque",
          filename: "Print",
        },
        {
          extend: 'pdf',
          footer: true,
          title: 'Reporte Banco Cheque',
          filename: 'Pdf',
        }
      ],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };
    this.reportSrv.showserchReportstwo(data).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.validaDtUser = true;
      this.processing = true;
      this.guardarolT = res["data"];
      setTimeout(() => {
        this.lcargando.ctlSpinner(false);
        this.dtTrigger.next(null);
      }, 50);
    }, error => {

      this.validaDtUser = true;
      this.processing = true;
      this.lcargando.ctlSpinner(false);
      setTimeout(() => {
        this.lcargando.ctlSpinner(false);
        this.dtTrigger.next(null);
      }, 50);
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  rerender(): void {
    this.validaDtUser = false;
    this.dtElement.dtInstance.then((dtInstance: any) => {
      dtInstance.destroy();
      this.getTableReport();
    });
  }

  searchDetalle(event) {
    this.detalle = event;
    if (this.detalle != 0 || this.detalle != "") {
      let filt = this.bankData.filter((e) => e.fk_bank == this.cuenta);
      this.arrayCheque = filt;
      this.rerender();
    } else {
      this.numCheque = "";
      this.valor = "";
      this.rerender();
    }
  }

  searchCuenta(event) {
    this.cuenta = event;
    if (this.cuenta != 0) {
      let filt = this.bankData.filter((e) => e.fk_bank == this.cuenta);
      this.arrayCheque = filt;
      this.rerender();
    } else {
      this.beneficiario = 0;
      this.numCheque = "";
      this.valor = "";
      this.rerender();
    }
  }

  searchBeneficiario(event) {
    this.beneficiario = event;
    if (this.beneficiario != 0) {
      let filt = this.bankData.filter((e) => e.fk_bank == this.cuenta);
      this.arrayCheque = filt;
      this.rerender();
    } else {
      this.numCheque = "";
      this.valor = "";
      this.rerender();
    }
  }

  searchCheque(event) {
    this.numCheque = event;
    if (this.numCheque != undefined) {
      let filt = this.bankData.find((e) => e.number_cheque == this.numCheque);
      this.valor = filt.valor;
      this.rerender();
    } else {
      this.valor = "";
      this.rerender();
    }
  }

  searchEstado(event) {
    this.estado = event;
    if (this.estado != 0) {
      this.rerender();
    } else {
      this.numCheque = "";
      this.valor = "";
      this.rerender();
    }
  }

  buttonsTwo() {
    this.vmButtonsT = [
      { orig: "btnRepCtasBacnT", paramAccion: "", boton: { icon: "fas fa-pencil-alt", texto: "ACTUALIZAR FECHA VENCIMIENTO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false, imprimir: false },
      { orig: "btnRepCtasBacnT", paramAccion: "", boton: { icon: "fas fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false, imprimir: false },
    ];
  }

  metodoGlobalT(evento: any) {
    switch (evento.items.boton.texto) {
      case "ACTUALIZAR FECHA VENCIMIENTO":
        this.validaSavePrestamo();
        break;
      case "CERRAR":
        this.closeModal();
        break;
    }
  }

  informacionSearch(dt) {

    $('#modalDetalle').appendTo("body").modal('show');
    this.chequeDetalle = dt;
    this.id_bank_cheque = this.chequeDetalle.id;
    this.estadoCheque = this.chequeDetalle.estadoBank;
    this.nombreBanco = this.chequeDetalle.name_banks;
    this.numeroCheque = this.chequeDetalle.number_cheque;
    this.benefCheque = this.chequeDetalle.beneficiario;
    this.cuentaCheque = this.chequeDetalle.num_cuenta;
    this.tipoCheque = this.chequeDetalle.tipo_cuenta;
    this.valorCheque = this.chequeDetalle.valor;
    this.estadoCheque = this.chequeDetalle.estadoBank;
    this.descripCheque = this.chequeDetalle.descripcion;
    this.fechaEmision = this.chequeDetalle.fecha_emision;
    this.fechaCobro = this.chequeDetalle.fecha_pago;
    this.fechaVencimiento = this.chequeDetalle.fecha_vencimiento;
    let filt = this.comprobanteData.find((e) => e.num_tx == this.numeroCheque);
    this.tipoIngreso = filt.tipo_egreso;
  }

  closeModal() {
    this.actBoton = false;
    ($("#modalDetalle") as any).modal("hide"); //linea para cerrar el modal de boostrap
    this.cuenta = 0;
    this.beneficiario = 0;
    this.detalle = 0;
    this.numCheque = undefined;
    this.estado = 0;
    this.valor = undefined;
    this.viewDate = undefined;
    this.fromDatePicker = undefined;
    this.toDatePicker = undefined;
    this.rerender();
  }

  async validaSavePrestamo() {
    if (this.permisions[0].editar == "0") {
      this.toastr.info("Usuario no tiene permiso para editar");
    } else {
      let resp = await this.validateDataGlobal().then((respuesta) => {
        if (respuesta) {
          this.confirmSave("Seguro desea Guardar Registro?", "SAVE_CHEQUE");
        }
      });
    }
  }

  validateDataGlobal() {
    let flag = false;
    return new Promise((resolve, reject) => {
      if (this.fechaVencimiento == null || this.fechaVencimiento == undefined || this.fechaVencimiento == "") {
        this.toastr.info("Seleccione Fecha a Cambiar");
        let autFocus = document.getElementById("FechaVen").focus();
      } else if(moment(this.fechaVencimiento).format("YYYY-MM-DD") < moment(this.fechaEmision).format("YYYY-MM-DD")){
        this.toastr.info("La fecha de vencimiento no puede ser menor a la fecha de emsiión");
      }
      else {
        resolve(true);
      }
    });
  }

  //SAVE
  async confirmSave(message, action) {
    Swal.fire({
      title: "Atención!!",
      text: message,
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#DC3545",
      confirmButtonColor: "#13A1EA",
      confirmButtonText: "Aceptar",
    }).then((result) => {
      if (result.value) {
        if (action == "SAVE_CHEQUE") {
          this.SaveFecha();
        }
      }
    });
  }

  dateVencimineto() {
    this.actBoton = true;
    (<HTMLInputElement>document.getElementById("btnActualizar")).disabled =
      false;
  }

  SaveFecha() {
    let data = {
      id: this.id_bank_cheque,
      fecha_emision: moment(this.fechaVencimiento).format("YYYY-MM-DD"),
      num_tx: this.numeroCheque,
      ip: this.commonServices.getIpAddress(),
      accion: `Actualización Fecha del cheque N° ${this.numeroCheque}`,
      id_controlador: myVarGlobals.fRbancoCheque,
    };
    this.reportSrv.saveEditFecha(data).subscribe(
      (res) => {
        this.toastr.success(res["message"]);
        setTimeout(() => {
          this.closeModal();
        }, 300);
      },
      (error) => {
        this.toastr.info(error.error.message);
      }
    );
  }
}
