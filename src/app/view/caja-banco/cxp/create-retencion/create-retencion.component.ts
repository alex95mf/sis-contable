import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
declare const $: any;
import 'sweetalert2/src/sweetalert2.scss';
const Swal = require('sweetalert2');
import * as myVarGlobals from '../../../../global';
import { CommonService } from '../../../../../app/services/commonServices';
import { CommonVarService } from '../../../../../app/services/common-var.services';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { CreateRetencionService } from './create-retencion.service'


@Component({
standalone: false,
  selector: 'app-create-retencion',
  templateUrl: './create-retencion.component.html',
  styleUrls: ['./create-retencion.component.scss']
})
export class CreateRetencionComponent implements OnInit {
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild('printCDE') printCDE: ElementRef;
  @ViewChild('printRTECXP') printRTECXP: ElementRef;
  vmButtons: any;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  dataDT: any = [];
  validaDt: any = false;

  dataUser: any;
  permisions: any;

  filterRet: any = "RTC";
  date: Date = new Date();
  fromDatePicker: Date = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  toDatePicker: any = new Date();

  current_box: any;
  paymentsCxp: any;
  validateDt: any;
  paymentsAux: any;
  current_date: any = new Date();

  calculate: any = { parseValue: "0.00", value: 0.00, monto: 0.00, iva: 0.00, total: 0.00, parseTotal: "0.00" };
  params_ret: any = { num_ret_vt: "", num_aut_vt: "", fech_ret_vt: new Date() };
  values: any = { method: 0, typ_acc: 0, total: 0.00, parseTotal: "0.00", accredited: 0.00, parseAccredited: "0.00", pending: 0.00, parsePending: "0.00", pay: 0.00, obs: "", ben: "" };
  current_pending: any = 0.00;
  contacts: any = undefined;
  payload: any;
  taxes: any = [];
  retenciones: any = [];
  print_rt_cxp: any;

  /*section cxc*/
  paymentsCxC: any;
  billing: any;

  constructor(
    private toastr: ToastrService,
    private commonServices: CommonService,
    private commonVarSrv: CommonVarService,
    private modalService: NgbModal,
    private router: Router,
    private createRetSrv: CreateRetencionService
  ) { }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "CANCELAR Y VOLVER":
        this.vmButtons[0].permiso = false;
        this.vmButtons[0].showimg = false;

        this.rerender();

        this.vmButtons[0].permiso = false;
        this.vmButtons[0].showimg = false;

        this.vmButtons[1].permiso = false;
        this.vmButtons[1].showimg = false;

        $('#divListCxPCxC').collapse("show");
        $('#divCreateRetCxp').collapse("hide");
        $('#divCreateRetCxC').collapse("hide");
        break;

      case "CREAR RETENCIÓN":
        (this.filterRet == "RTC") ? this.confirmPayRetencion() : this.confirmPayRetencionCxC();
        break;
    }
  }

  ngOnInit(): void {

    $('#divListCxPCxC').collapse("show");
    $('#divCreateRetCxp').collapse("hide");
    $('#divCreateRetCxC').collapse("hide");

    this.vmButtons = [
      { orig: "btnsCreateRet", paramAccion: "", boton: { icon: "fas fa-plus", texto: "CREAR RETENCIÓN" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnsCreateRet", paramAccion: "", boton: { icon: "fas fa-list", texto: "CANCELAR Y VOLVER" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];

    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
      this.vmButtons[0].permiso = false;
      this.vmButtons[0].showimg = false;

      this.vmButtons[1].permiso = false;
      this.vmButtons[1].showimg = false;

      this.getPermisions();
      this.current_date = moment(this.date).format('YYYY-MM-DD');
    }, 50);
  }

  getPermisions() {
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    let id_rol = this.dataUser.id_rol;
    let data = {
      codigo: myVarGlobals.fCreacionRetencion,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'][0];
      if (this.permisions.ver == "0") {
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de creación de retenciones");
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);
      } else {
        this.hasOpenBox();
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  hasOpenBox() {
    this.createRetSrv.getUserBoxOpen({}).subscribe(response => {
      this.current_box = response['data'];
      this.Available();
    }, error => {
      this.lcargando.ctlSpinner(false);
      Swal.fire({
        title: 'Atención!!',
        text: `${error.error.message}, será reridigido a la apertura de caja`,
        icon: 'warning',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Ok'
      }).then((result) => {
        this.router.navigateByUrl('bancos/cajageneral/apertura');
      })
    });
  }

  Available() {
    const payload = {
      dateFrom: moment(this.fromDatePicker).format('YYYY-MM-DD'),
      dateTo: moment(this.toDatePicker).format('YYYY-MM-DD'),
    }

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 8,
      search: true,
      paging: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    }

    this.mensajeSppiner = "Cargando...";
    this.lcargando.ctlSpinner(true);
    if (this.filterRet == "RTC") {
      this.createRetSrv.getAvailableCxP(payload).subscribe(response => {
        this.validateDt = true;
        this.paymentsCxp = response["data"];
        setTimeout(() => {
          this.dtTrigger.next(null);
          this.lcargando.ctlSpinner(false);
        }, 50);
      }, error => {
        this.validateDt = true;
        this.paymentsCxp = [];
        setTimeout(() => {
          this.dtTrigger.next(null);
          this.lcargando.ctlSpinner(false);
        }, 50);
      });
    } else {
      this.createRetSrv.getWalletBilling(payload).subscribe(response => {
        this.validaDt = true;
        this.billing = response["data"];
        setTimeout(() => {
          this.dtTrigger.next(null);
          this.lcargando.ctlSpinner(false);
        }, 50);
      }, error => {
        this.validaDt = true;
        this.billing = [];
        setTimeout(() => {
          this.dtTrigger.next(null);
          this.lcargando.ctlSpinner(false);
        }, 50);
      });
    }
  }

  rerender(): void {
    this.lcargando.ctlSpinner(true);
    this.validateDt = false;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.cancel();
      this.Available();
    });
  }

  changeretencion(idx) {
    (this.filterRet == "RTC") ? this.showRetencion(idx) : this.showRetencionCxC(idx);
  }

  showRetencion(idx) {

    $('#divListCxPCxC').collapse("hide");
    $('#divCreateRetCxp').collapse("show");
    $('#divCreateRetCxC').collapse("hide");

    this.vmButtons[0].permiso = true;
    this.vmButtons[0].showimg = true;

    this.vmButtons[1].permiso = true;
    this.vmButtons[1].showimg = true;

    this.contacts = this.paymentsCxp[idx];
    this.calculate.iva = this.commonServices.formatNumber(this.contacts['purchase']['iva']);
    this.calculate.monto = this.commonServices.formatNumber(this.contacts['purchase']['subtotal']);
    this.getTaxesRt();
  }

  getTaxesRt() {
    this.lcargando.ctlSpinner(true);
    let data = {
      from_agente: parseInt(this.dataUser['company']['tipo_contribuyente']),
      to_agente: parseInt(this.contacts['purchase']['proveedor']['contribuyente']),
    }
    this.createRetSrv.getAvailableTaxes(data).subscribe(res => {
      this.taxes = res['data']
      this.lcargando.ctlSpinner(false);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  addRetencion() {
    const tmp = this.taxes.find((el) => el.id === parseInt(this.values.method));
    const exist = this.retenciones.find((el) => el.id === tmp.id);
    if (exist) {
      this.toastr.info("La retención ya se encuentra registrada");
    } else {
      let hasManyIva = this.retenciones.filter((el) => el.type_imp === "Iva");

      if (hasManyIva.length > 0 && tmp.tipo_impuesto === "Iva") {
        this.toastr.info("Solo es permitido tener 1 Retención Iva");
      } else {
        this.retenciones.push({
          id: tmp.id,
          code: tmp.codigo,
          name: tmp.nombre_imp,
          type_imp: tmp.tipo_impuesto,
          value_imp: tmp.valor,
          symbol: tmp.simbolo,
          account: tmp.cuenta,
          value: this.calculate.value,
          parseValue: this.calculate.parseValue,
          comprobante: this.contacts['cxp_cab']['document']['codigo'],
          codigo_sri: tmp.codigo,
          num_factura: this.contacts['purchase']['num_doc'],
          dat_factura: this.contacts['purchase']['fecha'],
          fis_factura: moment(this.contacts['purchase']['fecha']).format('YYYY'),
          base: (tmp.tipo_impuesto === "Renta") ? parseFloat(this.contacts['purchase']['subtotal']) : parseFloat(this.contacts['purchase']['iva']),
        });
        this.values.method = 0;
        this.calculate.value = 0.00
        this.calculate.parseValue = "0.00"
        this.calculateTotalRetencion();
      }
    }
  }

  deleteFields(idx) {
    this.retenciones.splice(idx, 1);
    this.calculateTotalRetencion();
    if (this.retenciones.length == 0) {
      this.vmButtons[0].habilitar = true;
    }
  }

  calculateTotalRetencion() {
    this.calculate.total = this.retenciones.reduce((acc, el) => {
      return acc + el.value
    }, 0.00);
    this.calculate.parseTotal = this.commonServices.formatNumber(this.calculate.total);
  }

  calculateRetencion(evt) {
    const retencion = this.taxes.find((el) => el.id === parseInt(evt));
    if (retencion.tipo_impuesto === "Renta") {
      this.calculate.value = (retencion.simbolo === "%") ? (parseFloat(this.contacts['purchase']['subtotal']) * parseFloat(retencion.valor)) / 100 : parseFloat(this.contacts['purchase']['subtotal']) + parseFloat(retencion.valor);
    } else if (retencion.tipo_impuesto === "Iva") {
      this.calculate.value = (retencion.simbolo === "%") ? (parseFloat(this.contacts['purchase']['iva']) * parseFloat(retencion.valor)) / 100 : parseFloat(this.contacts['purchase']['iva']) + parseFloat(retencion.valor);
    }
    this.calculate.parseValue = this.commonServices.formatNumber(this.calculate.value)
  }

  confirmPayRetencion() {
    if (this.permisions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
       if ((this.contacts.valor - this.contacts.valor_abono) < this.calculate.total) {
        this.toastr.info("La retención no puede ser mayor que la deuda total");
      } else if (this.retenciones.length == 0) {
        this.toastr.info("Ingrese al menos 1 impuesto de retención");
      }else{
        this.confirmAction("Seguro desea realizar esta acción?", "SEND_RETENCION_CXP");
      }
    }
  }

  confirmPayRetencionCxC() {
    if (this.permisions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      if (this.params_ret.num_ret_vt == "") {
        this.toastr.info("Ingrese un número de retención");
      } else if (this.params_ret.num_aut_vt == "") {
        this.toastr.info("Ingrese un número de autorización");
      } else if (this.params_ret.fech_ret_vt == "") {
        this.toastr.info("Ingrese fecha de retención");
      } else if ((this.contacts.valor - this.contacts.valor_abono) < this.calculate.total) {
        this.toastr.info("La retención no puede ser mayor que la deuda total");
      } else if (this.retenciones.length == 0) {
        this.toastr.info("Ingrese al menos 1 impuesto de retención");
      } else {
        this.confirmAction("Seguro desea realizar esta acción?", "SEND_RETENCION_CXC");
      }
    }
  }

  /* Actions CRUD'S */
  async confirmAction(message, action) {
    Swal.fire({
      title: "Atención!",
      text: message,
      type: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#DC3545',
      confirmButtonColor: '#13A1EA',
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.value) {
        if (action == "SEND_RETENCION_CXP") {
          this.PayRetencion();
        } else if (action == "SEND_RETENCION_CXC") {
          this.PayRetencionCxC();
        }
      }
    })
  }

  PayRetencion() {
    let data = {
      fk_agente: this.contacts.purchase['proveedor']['id'],
      tipo: 'RTC',
      autorizacion: this.contacts.purchase['num_aut'],
      tipo_doc: this.contacts.purchase['tip_doc'],
      num_doc: this.contacts.purchase['num_doc'],
      anio_fiscal: moment(this.contacts.purchase['fecha']).format('YYYY'),
      total: this.calculate.total,
      purchase_id: this.contacts.purchase['id'],
      purchase_type: this.contacts.cxp_cab['type'],
      details: this.retenciones,
      purchase: this.contacts.purchase,
      ip: this.commonServices.getIpAddress(),
      accion: `Registro de pago de retención tipo ${this.contacts.cxp_cab['type']} (${this.contacts.purchase['num_doc']})`,
      id_controlador: myVarGlobals.fPagoProveedores,
      punto_emision:this.current_box.punto_emision
    }

    this.mensajeSppiner = "Guardando retencion...";
    this.lcargando.ctlSpinner(true);
    this.createRetSrv.addCxPRetencion(data).subscribe(response => {
      this.print_rt_cxp = response['data'];
      this.toastr.success(response['message']);

      $('#divListCxPCxC').collapse("show");
      $('#divCreateRetCxp').collapse("hide");
      $('#divCreateRetCxC').collapse("hide");

      setTimeout(() => {
        this.vmButtons[0].permiso = false;
        this.vmButtons[0].showimg = false;

        this.vmButtons[1].permiso = false;
        this.vmButtons[1].showimg = false;
        this.rerender();
      }, 50);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  PrintSectionRTCXP() {
    let el: HTMLElement = this.printRTECXP.nativeElement as HTMLElement;
    el.click();
  }

  /*CxC section*/
  addRetencionCxC() {
    const tmp = this.taxes.find((el) => el.id === parseInt(this.values.method));
    const exist = this.retenciones.find((el) => el.id === tmp.id);
    if (exist) {
      this.toastr.info("La retención ya se encuentra registrada");
    } else {
      let hasManyIva = this.retenciones.filter((el) => el.type_imp === "Iva");
      if (hasManyIva.length > 0 && tmp.tipo_impuesto === "Iva") {
        this.toastr.info("Solo es permitido tener 1 Retención Iva");
      } else {
        this.retenciones.push({
          id: tmp.id,
          code: tmp.codigo,
          name: tmp.nombre_imp,
          type_imp: tmp.tipo_impuesto,
          value_imp: tmp.valor,
          symbol: tmp.simbolo,
          account: tmp.cuenta,
          value: this.calculate.value,
          parseValue: this.calculate.parseValue,
          base: (tmp.tipo_impuesto === "Renta") ? parseFloat(this.contacts['cxc_cab']['sales']['subtotal']) : parseFloat(this.contacts['cxc_cab']['sales']['iva_valor']),
        });
        this.values.method = 0;
        this.calculate.value = 0.00
        this.calculate.parseValue = "0.00"
        this.calculateTotalRetencionCxC();
      }
    }
  }

  calculateTotalRetencionCxC() {
    this.calculate.total = this.retenciones.reduce((acc, el) => {
      return acc + el.value
    }, 0.00);
    this.calculate.parseTotal = this.commonServices.formatNumber(this.calculate.total);
  }

  deleteFieldsCxC(idx) {
    this.retenciones.splice(idx, 1);
    this.calculateTotalRetencion();
  }

  showRetencionCxC(idx) {

    $('#divListCxPCxC').collapse("hide");
    $('#divCreateRetCxp').collapse("hide");
    $('#divCreateRetCxC').collapse("show");

    this.vmButtons[0].permiso = true;
    this.vmButtons[0].showimg = true;

    this.vmButtons[1].permiso = true;
    this.vmButtons[1].showimg = true;

    this.contacts = this.billing[idx];
    this.calculate.iva = this.commonServices.formatNumber(this.contacts['cxc_cab']['sales']['iva_valor']);
    this.calculate.monto = this.commonServices.formatNumber(this.contacts['cxc_cab']['sales']['subtotal']);
    this.getTaxesRtCxC();
  }

  getTaxesRtCxC() {
    this.lcargando.ctlSpinner(true);
    let data = {
      from_agente: parseInt(this.contacts['cxc_cab']['sales']['client']['tipo_contribuyente']),
      to_agente: parseInt(this.dataUser['company']['tipo_contribuyente']),
    }
    this.createRetSrv.getAvailableTaxesCxC(data).subscribe(res => {
      this.taxes = res['data']
      this.lcargando.ctlSpinner(false);
      setTimeout(() => {
        document.getElementById('inretencionnum').focus();
      }, 100);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  PayRetencionCxC() {
    this.lcargando.ctlSpinner(true);
    let data = {
      fk_agente: this.contacts['cxc_cab']['sales']['client']['id_cliente'],
      tipo: 'RTV',
      autorizacion: this.contacts['cxc_cab']['sales']['num_aut'],
      tipo_doc: this.contacts['cxc_cab']['sales']['fk_tipo_doc'],
      num_doc: this.contacts['cxc_cab']['sales']['num_doc'],
      anio_fiscal: moment(this.contacts['cxc_cab']['sales']['fecha']).format('YYYY'),
      total: this.calculate.total,
      sale_id: this.contacts['cxc_cab']['sales']['id_venta'],
      details: this.retenciones,
      ip: this.commonServices.getIpAddress(),
      accion: `Registro de cobro de retención del documento No. (${this.contacts['cxc_cab']['sales']['num_doc']})`,
      id_controlador: myVarGlobals.fCarteraCobranza,

      num_aut_vt: this.params_ret.num_aut_vt,
      num_rt_vt: this.params_ret.num_ret_vt,
      fecha_rt_vt: moment(this.params_ret.fech_ret_vt).format('YYYY-MM-DD'),

    }

    this.createRetSrv.addCxCRetencion(data).subscribe(response => {
      this.lcargando.ctlSpinner(false);
      this.toastr.success(response['message']);

      $('#divListCxPCxC').collapse("show");
      $('#divCreateRetCxp').collapse("hide");
      $('#divCreateRetCxC').collapse("hide");

      setTimeout(() => {
        this.vmButtons[0].permiso = false;
        this.vmButtons[0].showimg = false;

        this.vmButtons[1].permiso = false;
        this.vmButtons[1].showimg = false;
        this.rerender();
      }, 50);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  calculateRetencionCxC(evt) {
    const retencion = this.taxes.find((el) => el.id === parseInt(evt));
    if (retencion.tipo_impuesto === "Renta") {
      this.calculate.value = (retencion.simbolo === "%") ? (parseFloat(this.contacts['cxc_cab']['sales']['subtotal']) * parseFloat(retencion.valor)) / 100 : parseFloat(this.contacts['cxc_cab']['sales']['subtotal']) + parseFloat(retencion.valor);
    } else if (retencion.tipo_impuesto === "Iva") {
      this.calculate.value = (retencion.simbolo === "%") ? (parseFloat(this.contacts['cxc_cab']['sales']['iva_valor']) * parseFloat(retencion.valor)) / 100 : parseFloat(this.contacts['cxc_cab']['sales']['iva_valor']) + parseFloat(retencion.valor);
    }
    this.calculate.parseValue = this.commonServices.formatNumber(this.calculate.value)
  }

  cancel() {
    this.contacts = undefined;
    this.retenciones = [];
    this.calculate = { parseValue: "0.00", value: 0.00, monto: 0.00, iva: 0.00, total: 0.00, parseTotal: "0.00" };
    this.params_ret = { num_ret_vt: "", num_aut_vt: "", fech_ret_vt: new Date() };
    this.values = { method: 0, typ_acc: 0, total: 0.00, parseTotal: "0.00", accredited: 0.00, parseAccredited: "0.00", pending: 0.00, parsePending: "0.00", pay: 0.00, obs: "", ben: "" };
  }

}
