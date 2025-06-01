import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr';
import * as myVarGlobals from '../../../../global';
import { CobranzaService } from './cobranza.service'
import { DataTableDirective } from 'angular-datatables';
import { CommonService } from '../../../../services/commonServices';
import { CommonVarService } from '../../../../services/common-var.services';
import { IngresoService } from '../../../inventario/producto/ingreso/ingreso.service';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare const $: any;
const Swal = require('sweetalert2');
import 'sweetalert2/src/sweetalert2.scss';
import { CuentaClienteComponent } from './cuenta-cliente/cuenta-cliente.component'

@Component({
standalone: false,
  selector: 'app-cobranza',
  templateUrl: './cobranza.component.html',
  styleUrls: ['./cobranza.component.scss']
})
export class CobranzaComponent implements OnInit {
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  @ViewChild('printCDI') printCDI: ElementRef;

  payload: any;
  permissions: any;
  processing: boolean = false;
  processingBilling: any = false;
  processingDocument: any = false;
  processingPayLetter: any = false;
  processingInformation: any = false;
  processingRetencion: any = false;

  /* date */
  date: Date = new Date();
  fromDatePicker: Date = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  toDatePicker: Date = new Date();
  current_date: any = new Date();
  postDate: Date = new Date();
  filter: any = 5;
  date_corte: any = new Date();

  /* dictionaries */
  taxes: Array<any> = [];
  billing: Array<any> = [];
  billingAux: Array<any> = [];
  billingAuxThre: Array<any> = [];

  retenciones: Array<any> = [];
  filters: Array<any> = [
    { id: 1, name: "Por vencer" },
    { id: 2, name: "Vencidas" },
    { id: 3, name: "Pagadas" },
    { id: 5, name: "Por Vencer y Vencidas" },
    { id: 4, name: "Todas" },
  ];

  filter_customer: any = [];
  filt_cust: any = 0;
  arrayMethodPayment: any = [];

  catalogs: Array<any> = [];

  /* payload modals */
  contacts: any = {};
  arrayContact: any = [];
  ammount: any = 0;
  detail_cxc: any;
  values: any = { method: 0, typ_acc: 0, card: 0, total: 0.00, accredited: 0.00, pending: 0.00, pay: 0.00, obs: "", notacredito: 0, fk_banco: 0, value_retencion: 0, bco: 0, fk_bco_client: 0 };
  current_pending: any = 0.00;
  current_box: any;
  doc_cdi: any;

  /* payload retencion */
  calculate: any = { parseValue: "0.00", value: 0.00, monto: 0.00, iva: 0.00, total: 0.00, parseTotal: "0.00" };

  /*parametros retención*/
  params_ret: any = { num_ret_vt: "", num_aut_vt: "", fech_ret_vt: new Date() };

  /* print */
  sucursalInformation: any;
  print_cdi: any;
  arrayNotas: any;
  contacAux: any;
  validateNota: any = false;
  nota: any = [];
  arrayBanks: any;
  dataUser: any;

  fecha1: any;
  fecha2: any;
  sumNotasCliente: any = 0;

  /* datatable */
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtOptions: any = {};
  dtTrigger = new Subject();

  reten: any = true;
  notreten: any = false;
  totalPayment: any = parseFloat('0');
  totalIngresado: any = parseFloat('0');
  arrayBanco: any = [];
  dBtnController: any = false;
  saldo_favor: any = parseFloat('0');
  num1 = parseFloat('0');
  num2 = parseFloat('0');
  res = parseFloat('0');

  constructor(private toastr: ToastrService, private router: Router, private billingSrv: CobranzaService, private modalService: NgbModal,
    private commonServices: CommonService, private commonVarSrv: CommonVarService, private ingresoSrv: IngresoService) {

  }

  ngOnInit(): void {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.current_date = moment(this.date).format('YYYY-MM-DD');
    this.date_corte = moment(this.date_corte).format('YYYY-MM-DD');
    setTimeout(() => {
      this.getPermissions();
    }, 50);
  }

  /* Calls API REST */
  getPermissions() {
    this.lcargando.ctlSpinner(true);
    this.payload = JSON.parse(localStorage.getItem('Datauser'));
    let params = { codigo: myVarGlobals.fCarteraCobranza, id_rol: this.payload.id_rol }

    this.commonServices.getPermisionsGlobas(params).subscribe(res => {
      this.permissions = res["data"][0];
      if (this.permissions.ver == "0") {
        this.toastr.info("Usuario no tiene acceso a este formulario.");
        this.lcargando.ctlSpinner(false);
      } else {
        this.hasOpenBox();
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  hasOpenBox() {
    this.billingSrv.getUserBoxOpen({}).subscribe(response => {
      this.current_box = response['data'];
      this.doc_cdi = this.payload.permisos_doc.find(el => el.fk_documento === 13)['fk_documento'];
      this.getInfoBank();
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

  getInfoBank() {
    this.billingSrv.getAccountsByDetails({ company_id: this.dataUser.id_empresa }).subscribe(res => {
      this.arrayBanks = res['data'];
      this.groupCatalogs();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  groupCatalogs() {
    let data = { fields: ["TIPO PAGO CHEQUE", "FORMA COBRO CLIENTE", "MARCA TARJETA"] };
    this.ingresoSrv.getCommonInformationFormule(data).subscribe(res => {
      this.catalogs = res['data']['catalogs'];
      localStorage.setItem('methodCobro', JSON.stringify(this.catalogs['FORMA COBRO CLIENTE']));
      this.getSucursalInformation();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getSucursalInformation() {
    this.ingresoSrv.getSucursalInformation().subscribe(res => {
      this.sucursalInformation = res['data'].find(e => e.id_sucursal == this.payload.id_sucursal);
      this.getBilling();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getBilling() {
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

    this.filter = 5;
    this.billingSrv.getWalletBilling(payload).subscribe(response => {
      this.lcargando.ctlSpinner(false);
      /* this.processingBilling = true; */
      this.billing = response["data"];
      this.billingAux = response["data"];

      this.billing.forEach(element => {
        element['multp_cxc'] = false;
      });
      this.billingAux.forEach(element => {
        element['multp_cxc'] = false;
      });
      /* setTimeout(() => {
        this.dtTrigger.next(null); */
      /* setTimeout(() => { */
      this.filterBilling(5);
      /* }, 100); */
      /*  }, 50); */

    }, error => {
      this.processingBilling = true;
      this.billing = [];
      this.billingAux = [];
      this.lcargando.ctlSpinner(false);
      setTimeout(() => {
        this.dtTrigger.next(null);
      }, 50);
    });
  }

  getBillingAux() {
    const payload = {
      dateFrom: moment(this.fromDatePicker).format('YYYY-MM-DD'),
      dateTo: moment(this.toDatePicker).format('YYYY-MM-DD'),
    }

    this.billing = [];

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 8,
      search: true,
      paging: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    }

    this.filter = 5;
    this.mensajeSppiner = "Cargando...";
    this.lcargando.ctlSpinner(true);
    this.billingSrv.getWalletBilling(payload).subscribe(response => {
      this.lcargando.ctlSpinner(false);
      this.processingBilling = true;
      this.billing = response["data"];
      this.billingAux = response["data"];

      /* setTimeout(() => {
        this.dtTrigger.next(null);
        setTimeout(() => { */
      this.filterBilling(5);
      /* }, 100);
    }, 50); */

    }, error => {
      this.lcargando.ctlSpinner(false);
      this.processingBilling = true;
      this.billing = [];
      this.billingAux = [];
      setTimeout(() => {
        this.dtTrigger.next(null);
      }, 50);
      this.toastr.info(error.error.message);
    });
  }

  getTaxesRt() {
    let data = {
      from_agente: parseInt(this.contacts['cxc_cab']['sales']['client']['tipo_contribuyente']),
      to_agente: parseInt(this.payload['company']['tipo_contribuyente']),
    }
    this.billingSrv.getAvailableTaxes(data).subscribe(res => {
      this.taxes = res['data']
      this.processingRetencion = true;
      this.lcargando.ctlSpinner(false);
      setTimeout(() => {
        document.getElementById('inretencionnum').focus();
      }, 100);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  PayRetencion() {
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

    this.billingSrv.addCxCRetencion(data).subscribe(response => {
      this.lcargando.ctlSpinner(false);
      this.closeModal(2);
      this.rerender();
      this.toastr.success(response['message']);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  /* Modals */
  closeModal(opt) {
    this.ammount = 0;
    this.sumNotasCliente = 0;
    this.catalogs['FORMA COBRO CLIENTE'] = JSON.parse(localStorage.getItem('methodCobro'));
    switch (opt) {
      case 1:
        ($('#ContactModal') as any).modal('hide');
        document.getElementById('content-pills-act').classList.remove('active');
        document.getElementById('cxc-tab').classList.remove('active');
        document.getElementById('history-tab').classList.remove('active');
        document.getElementById('contact-tab').classList.add('active');
        let info_content = document.getElementById('TabContentContact');
        info_content.querySelector('.show, .active').classList.remove('show', 'active');

        document.getElementById('contact').classList.add('show', 'active');
        /* this.contacts = undefined; */
        this.processingInformation = false;

        break;
      case 2:
        ($('#RetencionClienteModal') as any).modal('hide');
        /* this.contacts = undefined; */
        this.processingRetencion = false;
        this.calculate = { parseValue: "0.00", value: 0.00, monto: 0.00, iva: 0.00 };;
        this.values.method = 0;
        this.retenciones = [];
        this.params_ret = { num_ret_vt: "", num_aut_vt: "", fech_ret_vt: new Date() };

        break;
      case 3:
        ($('#PaymentModal') as any).modal('hide');
        /* this.contacts = undefined; */
        this.arrayContact = [];
        this.detail_cxc = undefined;
        this.print_cdi = undefined;
        this.processingPayLetter = false;

        this.values = { method: 0, typ_acc: 0, card: 0, total: 0.00, accredited: 0.00, pending: 0.00, pay: 0.00, obs: "", fk_banco: 0, value_retencion: 0, bco: 0, fk_bco_client: 0 };
        this.current_pending = 0.00;
        this.arrayMethodPayment = [];
        this.totalPayment = parseFloat('0');
        this.totalIngresado = parseFloat('0');


        break;
    }
  }

  uploadInformation(idx) {
    this.lcargando.ctlSpinner(true);
    this.contacts = this.billing[idx];
    this.processingInformation = true;

    let params = { id: this.billing[idx]["fk_cxc"], type_doc: this.billing[idx]["doc_ref_tip"], num_doc: this.billing[idx]["doc_ref_num"] }
    this.billingSrv.getWalletBillingSpecific(params).subscribe(response => {
      this.lcargando.ctlSpinner(false);
      this.detail_cxc = response["data"];
      this.processingDocument = true;

      this.values['value_retencion'] = parseFloat('0');
      (this.billing[idx]['cxc_cab']['sales']['retencion'] != null) ?
        this.values['value_retencion'] = parseFloat(this.contacts['cxc_cab']['sales']['retencion']['total']) :
        this.values['value_retencion'] = parseFloat('0');
      $('#ContactModal').appendTo("body").modal('show');

    }, error => {
      this.toastr.info(error.error.message);
    });
  }

  /* showLetter(idx) {
    $('#PaymentModal').appendTo("body").modal('show');
    this.contacts = this.billing[idx];
    this.contacAux = this.contacts;
    this.values.total = parseFloat(this.contacts["valor"]).toFixed(2);
    this.values.accredited = parseFloat(this.contacts["valor_abono"]).toFixed(2);
    this.values.pending = parseFloat(this.contacts["valor_saldo"]).toFixed(2);
    this.current_pending = parseFloat(this.contacts["valor_saldo"]).toFixed(2);

    this.processingPayLetter = true;
  } */

  showLetter(idx) {
    this.ammount = 0;
    this.sumNotasCliente = 0;
    this.billing.forEach(element => {
      if (element['multp_cxc']) {
        this.ammount += 1;
      }
    });

    if (this.filt_cust == 0 && this.ammount == 0) {

      this.catalogs['FORMA COBRO CLIENTE'] = JSON.parse(localStorage.getItem('methodCobro'));
      this.contacts = this.billing[idx];
      this.contacAux = this.contacts;
      this.values.total = parseFloat(this.contacts["valor"]).toFixed(2);
      this.values.accredited = parseFloat(this.contacts["valor_abono"]).toFixed(2);
      this.values.pending = parseFloat(this.contacts["valor_saldo"]).toFixed(2);
      this.current_pending = parseFloat(this.contacts["valor_saldo"]).toFixed(2);
      this.values['cliente'] = this.contacts['cxc_cab']['sales']['client']['razon_social'];
      this.values['value_retencion'] = parseFloat('0');

      (this.billing[idx]['cxc_cab']['sales']['retencion'] != null) ?
        this.values['value_retencion'] = parseFloat(this.contacts['cxc_cab']['sales']['retencion']['total']) :
        this.values['value_retencion'] = parseFloat('0');

      this.getAccountCustomer();
      this.processingPayLetter = true;

    } else if (this.filt_cust != 0 && this.ammount == 0) {

      this.catalogs['FORMA COBRO CLIENTE'] = JSON.parse(localStorage.getItem('methodCobro'));
      this.contacts = this.billing[idx];
      this.contacAux = this.contacts;
      this.values.total = parseFloat(this.contacts["valor"]).toFixed(2);
      this.values.accredited = parseFloat(this.contacts["valor_abono"]).toFixed(2);
      this.values.pending = parseFloat(this.contacts["valor_saldo"]).toFixed(2);
      this.current_pending = parseFloat(this.contacts["valor_saldo"]).toFixed(2);
      this.values['cliente'] = this.contacts['cxc_cab']['sales']['client']['razon_social'];

      this.values['value_retencion'] = parseFloat('0');
      (this.billing[idx]['cxc_cab']['sales']['retencion'] != null) ?
        this.values['value_retencion'] = parseFloat(this.contacts['cxc_cab']['sales']['retencion']['total']) :
        this.values['value_retencion'] = parseFloat('0');

      this.getAccountCustomer();

      this.processingPayLetter = true;
    } else if (this.filt_cust != 0 && this.ammount > 0) {

      let method = JSON.parse(localStorage.getItem('methodCobro'));
      this.catalogs['FORMA COBRO CLIENTE'] = method.filter(e => e.valor != "Nota de Crédito");
      this.billing.forEach(element => {
        if (element['multp_cxc']) {
          this.values.total = parseFloat(this.values.total) + parseFloat(element["valor"]);
          this.values.accredited = parseFloat(this.values.accredited) + parseFloat(element["valor_abono"]);
          this.values.pending = parseFloat(this.values.pending) + parseFloat(element["valor_saldo"]);
          this.current_pending = parseFloat(this.current_pending) + parseFloat(element["valor_saldo"]);
          this.arrayContact.push(element);
        }
      });
      this.values.total = parseFloat(this.values.total).toFixed(2);
      this.values.accredited = parseFloat(this.values.accredited).toFixed(2);
      this.values.pending = parseFloat(this.values.pending).toFixed(2);
      this.current_pending = parseFloat(this.current_pending).toFixed(2);
      this.values.pay = parseFloat(this.current_pending).toFixed(2);
      this.values['cliente'] = this.billing[0]['cxc_cab']['sales']['client']['razon_social'];

      this.values['value_retencion'] = parseFloat('0');
      this.billing.forEach(element => {
        if (element['cxc_cab']['sales']['retencion'] != null) {
          this.values['value_retencion'] = parseFloat(this.values['value_retencion']) + parseFloat(element['cxc_cab']['sales']['retencion']['total'])
        }
      });
      this.getAccountCustomer();
      this.processingPayLetter = true;
    }
  }

  getAccountCustomer() {
    this.lcargando.ctlSpinner(true);
    let id_cliente
    if (this.filt_cust == 0 && this.ammount == 0) {
      id_cliente = this.contacts['cxc_cab']['sales']['client']['id_cliente'];
    } else if (this.filt_cust != 0 && this.ammount == 0) {
      id_cliente = this.contacts['cxc_cab']['sales']['client']['id_cliente'];
    } else if (this.filt_cust != 0 && this.ammount > 0) {
      id_cliente = this.billing[0]['cxc_cab']['sales']['client']['id_cliente'];
    }
    this.billingSrv.getAccountsCustomer({ fk_cliente: id_cliente }).subscribe(res => {
      this.arrayBanco = res['data'];
      this.getSumNotasCliente();
    })
  }

  getSumNotasCliente() {
    let id_cliente
    if (this.filt_cust == 0 && this.ammount == 0) {
      id_cliente = this.contacts['cxc_cab']['sales']['client']['id_cliente'];
    } else if (this.filt_cust != 0 && this.ammount == 0) {
      id_cliente = this.contacts['cxc_cab']['sales']['client']['id_cliente'];
    } else if (this.filt_cust != 0 && this.ammount > 0) {
      id_cliente = this.billing[0]['cxc_cab']['sales']['client']['id_cliente'];
    }
    this.billingSrv.getSumNotasCliente({ fk_cliente: id_cliente }).subscribe(res => {
      this.sumNotasCliente = res['data']['total'];
      this.sumNotasCliente = parseFloat(this.sumNotasCliente).toFixed(2);
      this.lcargando.ctlSpinner(false);
      $('#PaymentModal').appendTo("body").modal('show');
    })
  }

  showRetencion(idx) {
    $('#RetencionClienteModal').appendTo("body").modal('show');
    this.lcargando.ctlSpinner(true);
    this.contacts = this.billing[idx];
    this.calculate.iva = this.commonServices.formatNumber(this.contacts['cxc_cab']['sales']['iva_valor']);
    this.calculate.monto = this.commonServices.formatNumber(this.contacts['cxc_cab']['sales']['subtotal']);
    this.getTaxesRt();
  }

  calculateRetencion(evt) {
    const retencion = this.taxes.find((el) => el.id === parseInt(evt));
    if (retencion.tipo_impuesto === "Renta") {
      this.calculate.value = (retencion.simbolo === "%") ? (parseFloat(this.contacts['cxc_cab']['sales']['subtotal']) * parseFloat(retencion.valor)) / 100 : parseFloat(this.contacts['cxc_cab']['sales']['subtotal']) + parseFloat(retencion.valor);
    } else if (retencion.tipo_impuesto === "Iva") {
      this.calculate.value = (retencion.simbolo === "%") ? (parseFloat(this.contacts['cxc_cab']['sales']['iva_valor']) * parseFloat(retencion.valor)) / 100 : parseFloat(this.contacts['cxc_cab']['sales']['iva_valor']) + parseFloat(retencion.valor);
    }
    this.calculate.parseValue = this.commonServices.formatNumber(this.calculate.value)
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
          base: (tmp.tipo_impuesto === "Renta") ? parseFloat(this.contacts['cxc_cab']['sales']['subtotal']) : parseFloat(this.contacts['cxc_cab']['sales']['iva_valor']),
        });

        this.values.method = 0;
        this.calculate.value = 0.00
        this.calculate.parseValue = "0.00"
        this.calculateTotalRetencion();
      }
    }
  }

  calculateTotalRetencion() {
    this.calculate.total = this.retenciones.reduce((acc, el) => {
      return acc + el.value
    }, 0.00);
    this.calculate.parseTotal = this.commonServices.formatNumber(this.calculate.total);
  }

  deleteFields(idx) {
    this.retenciones.splice(idx, 1);
    this.calculateTotalRetencion();
  }

  ConfirmPayRetencion() {
    if (this.permissions.guardar == "0") {
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
        this.confirmAction("Seguro desea realizar esta acción?", "SEND_RETENCION");
      }
    }
  }

  async PayLetter() {
    if (this.permissions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      await this.commonValidate().then(resp => {
        if (resp) {
          this.confirmAction("Seguro desea realizar esta acción?", "SEND_PAYMENT");
        }
      });
    }
  }

  PayLetterAction() {
    this.dBtnController = true;
    this.lcargando.ctlSpinner(true);
    let acumulatedPending = parseFloat('0');

    if (this.filt_cust == 0 && this.ammount == 0) {

      for (let index = 0; index < this.arrayMethodPayment.length; index++) {
        if (index > 0) {
          this.arrayMethodPayment[index].pending = acumulatedPending;
        }
        acumulatedPending = parseFloat(this.arrayMethodPayment[index].pending) - parseFloat(this.arrayMethodPayment[index].pay);
        this.arrayMethodPayment[index].pending = acumulatedPending;

        this.arrayMethodPayment[index].id = this.contacts.id;
        this.arrayMethodPayment[index].cdi = this.doc_cdi;
        this.arrayMethodPayment[index].letter = this.contacts.letra;
        this.arrayMethodPayment[index].ref = this.contacts.doc_ref_num;
        this.arrayMethodPayment[index].tip_doc = this.contacts.doc_ref_tip;
        this.arrayMethodPayment[index].cxc = this.contacts["fk_cxc"];
        this.arrayMethodPayment[index].complete = (this.arrayMethodPayment[index].pending <= 0) ? true : false;
        this.arrayMethodPayment[index].box = this.current_box.id;
        this.arrayMethodPayment[index].ruc_cliente = this.contacts["cxc_cab"]["sales"]["client"]["num_documento"];
        this.arrayMethodPayment[index].nombre_cliente = this.contacts["cxc_cab"]["sales"]["client"]["razon_social"];
        this.arrayMethodPayment[index]['fk_cliente'] = this.contacts["cxc_cab"]["sales"]["client"]["id_cliente"];
        this.arrayMethodPayment[index]['telefono'] = this.contacts["cxc_cab"]["sales"]["client"]["telefono"];
        this.arrayMethodPayment[index]['obs'] = (this.values.obs == "" || this.values.obs == undefined || this.values.obs == null) ? "" : this.values.obs;
        this.arrayMethodPayment[index]['validaNumber'] = true;
        this.arrayMethodPayment[index]['pay'] = parseFloat(this.arrayMethodPayment[index]['pay']);

        if (this.arrayMethodPayment[index].method === "Cheque") this.arrayMethodPayment[index].postDate = moment(this.postDate).format('YYYY-MM-DD');

        /* Bitacora params */
        this.arrayMethodPayment[index].ip = this.commonServices.getIpAddress();
        this.arrayMethodPayment[index].accion = `Registro de Cuenta por Cobrar`;
        this.arrayMethodPayment[index].id_controlador = myVarGlobals.fCarteraCobranza;
        this.arrayMethodPayment[index]['punto_emision'] = this.current_box.punto_emision;
        this.arrayMethodPayment[index]['fk_user'] = this.current_box.fk_usuario_caja;
      }

      let data = {
        saldo_favor: this.saldo_favor,
        id_user_aprobated: this.dataUser.id_usuario,
        name_user_aprobated: this.dataUser.nombre,
        info: this.arrayMethodPayment
      }
      this.billingSrv.setWalletBilling(data).subscribe(response => {
        this.print_cdi = response['data'];
        setTimeout(() => {
          this.dBtnController = false;
          this.closeModal(3);
          this.rerender();
          this.toastr.success(response['message']);
          //this.PrintSectionCDI();
        }, 300);
      }, error => {
        this.toastr.info(error.error.message);
      });

    } else if (this.filt_cust != 0 && this.ammount == 0) {
      for (let index = 0; index < this.arrayMethodPayment.length; index++) {
        if (index > 0) {
          this.arrayMethodPayment[index].pending = acumulatedPending;
        }
        acumulatedPending = parseFloat(this.arrayMethodPayment[index].pending) - parseFloat(this.arrayMethodPayment[index].pay);
        this.arrayMethodPayment[index].pending = acumulatedPending;

        this.arrayMethodPayment[index].id = this.contacts.id;
        this.arrayMethodPayment[index].cdi = this.doc_cdi;
        this.arrayMethodPayment[index].letter = this.contacts.letra;
        this.arrayMethodPayment[index].ref = this.contacts.doc_ref_num;
        this.arrayMethodPayment[index].tip_doc = this.contacts.doc_ref_tip;
        this.arrayMethodPayment[index].cxc = this.contacts["fk_cxc"];
        this.arrayMethodPayment[index].complete = (this.arrayMethodPayment[index].pending <= 0) ? true : false;
        this.arrayMethodPayment[index].box = this.current_box.id;
        this.arrayMethodPayment[index].ruc_cliente = this.contacts["cxc_cab"]["sales"]["client"]["num_documento"]
        this.arrayMethodPayment[index].nombre_cliente = this.contacts["cxc_cab"]["sales"]["client"]["razon_social"]
        this.arrayMethodPayment[index]['fk_cliente'] = this.contacts["cxc_cab"]["sales"]["client"]["id_cliente"]
        this.arrayMethodPayment[index]['telefono'] = this.contacts["cxc_cab"]["sales"]["client"]["telefono"]
        this.arrayMethodPayment[index]['obs'] = (this.values.obs == "" || this.values.obs == undefined || this.values.obs == null) ? "" : this.values.obs;
        this.arrayMethodPayment[index]['validaNumber'] = true;
        this.arrayMethodPayment[index]['pay'] = parseFloat(this.arrayMethodPayment[index]['pay']);

        if (this.arrayMethodPayment[index].method === "Cheque") this.arrayMethodPayment[index].postDate = moment(this.postDate).format('YYYY-MM-DD');

        /* Bitacora params */
        this.arrayMethodPayment[index].ip = this.commonServices.getIpAddress();
        this.arrayMethodPayment[index].accion = `Registro de Cuenta por Cobrar`;
        this.arrayMethodPayment[index].id_controlador = myVarGlobals.fCarteraCobranza;
        this.arrayMethodPayment[index]['punto_emision'] = this.current_box.punto_emision;
        this.arrayMethodPayment[index]['fk_user'] = this.current_box.fk_usuario_caja;

      }

      let data = {
        saldo_favor: this.saldo_favor,
        id_user_aprobated: this.dataUser.id_usuario,
        name_user_aprobated: this.dataUser.nombre,
        info: this.arrayMethodPayment
      }
      this.billingSrv.setWalletBilling(data).subscribe(response => {
        this.print_cdi = response['data'];
        setTimeout(() => {
          this.dBtnController = false;
          this.closeModal(3);
          this.rerender();
          this.toastr.success(response['message']);
          //this.PrintSectionCDI();
        }, 300);
      }, error => {
        this.toastr.info(error.error.message);
      });

    } else if (this.filt_cust != 0 && this.ammount > 0) {
      let infoSend = {};
      let arrayInfoSend = [];
      for (let index = 0; index < this.arrayContact.length; index++) {
        infoSend = {};

        infoSend['id'] = this.arrayContact[index].id;
        infoSend['letter'] = this.arrayContact[index].letra;
        infoSend['ref'] = this.arrayContact[index].doc_ref_num;
        infoSend['tip_doc'] = this.arrayContact[index].doc_ref_tip;
        infoSend['cxc'] = this.arrayContact[index]["fk_cxc"];
        infoSend['ruc_cliente'] = this.arrayContact[index]["cxc_cab"]["sales"]["client"]["num_documento"]
        infoSend['nombre_cliente'] = this.arrayContact[index]["cxc_cab"]["sales"]["client"]["razon_social"]
        infoSend['fk_cliente'] = this.arrayContact[index]["cxc_cab"]["sales"]["client"]["id_cliente"]
        infoSend['telefono'] = this.arrayContact[index]["cxc_cab"]["sales"]["client"]["telefono"]
        infoSend['cdi'] = this.doc_cdi;
        infoSend['complete'] = /* (index == (this.arrayContact.length -1 )) ? */ true /* : false */;
        infoSend['box'] = this.current_box.id;


        infoSend['card'] = this.arrayMethodPayment[0]['card'];
        infoSend['fk_banco'] = this.arrayMethodPayment[0]['fk_banco'];
        infoSend['method'] = this.arrayMethodPayment[0]['method'];
        infoSend['notacredito'] = this.arrayMethodPayment[0]['notacredito'];
        infoSend['pay'] = parseFloat(this.arrayContact[index]["valor_saldo"]).toFixed(2);
        infoSend['ref_doc'] = this.arrayMethodPayment[0]['ref_doc'];
        infoSend['total'] = this.arrayContact[index]["valor"];;
        infoSend['typ_acc'] = this.arrayMethodPayment[0]['typ_acc'];
        infoSend['bco'] = this.arrayMethodPayment[0].bco;

        if (this.arrayMethodPayment[0].method === "Cheque") infoSend['postDate'] = moment(this.postDate).format('YYYY-MM-DD');

        /* Bitacora params */
        infoSend['ip'] = this.commonServices.getIpAddress();
        infoSend['accion'] = `Registro de Cuenta por Cobrar`;
        infoSend['id_controlador'] = myVarGlobals.fCarteraCobranza;
        infoSend['punto_emision'] = this.current_box.punto_emision;
        infoSend['fk_user'] = this.current_box.fk_usuario_caja;
        infoSend['obs'] = (this.values.obs == "" || this.values.obs == undefined || this.values.obs == null) ? "" : this.values.obs;
        infoSend['validaNumber'] = false;

        arrayInfoSend.push(infoSend);

      }

      let data = {
        saldo_favor: this.saldo_favor,
        id_user_aprobated: this.dataUser.id_usuario,
        name_user_aprobated: this.dataUser.nombre,
        info: arrayInfoSend
      }

      this.billingSrv.setWalletBilling(data).subscribe(response => {
        this.print_cdi = response['data'];
        setTimeout(() => {
          this.dBtnController = false;
          this.closeModal(3);
          this.rerender();
          this.toastr.success(response['message']);
          //this.PrintSectionCDI();
        }, 300);
      }, error => {
        this.toastr.info(error.error.message);
      });

    }
  }

  /* PayLetterAction() {
    this.lcargando.ctlSpinner(true);
    this.values.id = this.contacts.id;
    this.values.cdi = this.doc_cdi;
    this.values.letter = this.contacts.letra;
    this.values.ref = this.contacts.doc_ref_num;
    this.values.tip_doc = this.contacts.doc_ref_tip;
    this.values.cxc = this.contacts["fk_cxc"];
    this.values.complete = (this.values.total === this.values.accredited) ? true : false;
    this.values.box = this.current_box.id;
    this.values.ruc_cliente = this.contacts["cxc_cab"]["sales"]["client"]["num_documento"]
    this.values.nombre_cliente = this.contacts["cxc_cab"]["sales"]["client"]["razon_social"]


    if (this.values.method === "Cheque") this.values.postDate = moment(this.postDate).format('YYYY-MM-DD');

    this.values.ip = this.commonServices.getIpAddress();
    this.values.accion = `Registro de Cuenta por Cobrar`;
    this.values.id_controlador = myVarGlobals.fCarteraCobranza;
    this.values['punto_emision'] = this.current_box.punto_emision;
    this.values['fk_user'] = this.current_box.fk_usuario_caja;

    this.billingSrv.setWalletBilling(this.values).subscribe(response => {
      this.print_cdi = response['data'];
      setTimeout(() => {
        this.closeModal(3);
        this.rerender();
        this.toastr.success(response['message']);
        this.PrintSectionCDI();
      }, 300);
    }, error => {
      this.toastr.info(error.error.message);
    });
  } */

  /* onChange */
  payAmountChange() {
    /* this.values.pending = parseFloat(this.contacts["valor"]) - parseFloat(this.contacts["valor_abono"]);
    this.values.accredited = parseFloat(this.contacts["valor_abono"]);

    if (this.values.pay !== null) {
      this.values.pending = parseFloat((this.values.pending - parseFloat(this.values.pay)).toFixed(2));
      this.values.accredited = parseFloat((this.values.accredited + parseFloat(this.values.pay)).toFixed(2));

      this.values.pending = parseFloat(this.values.pending).toFixed(2);
      this.values.accredited = parseFloat(this.values.accredited).toFixed(2);
    } */
  }


  filterBilling(evt) {
    this.processingBilling = false;
    let filter = this.billingAux.filter(el => this.current_date <= el.fecha_venc && el.valor_saldo > 0 || this.current_date > el.fecha_venc && el.valor_saldo > 0);
    this.refreshFilter(filter, 1);
  }

  /* filterBilling(evt) {
    this.processingBilling = false;
    if (evt == 4) {
      let filter = this.billingAux;
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.refreshFilter(filter);
      });
    } else if (evt == 1) {
      let filter = this.billingAux.filter(el => this.current_date <= el.fecha_venc && el.valor_saldo > 0);
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.refreshFilter(filter);
      });
    } else if (evt == 2) {
      let filter = this.billingAux.filter(el => this.current_date > el.fecha_venc && el.valor_saldo > 0);
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.refreshFilter(filter);
      });
    } else if (evt == 3) {
      let filter = this.billingAux.filter(el => el.valor_saldo === 0);
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.refreshFilter(filter);
      });
    } else if (evt == 5) {
      let filter = this.billingAux.filter(el => this.current_date <= el.fecha_venc && el.valor_saldo > 0 || this.current_date > el.fecha_venc && el.valor_saldo > 0);
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      this.refreshFilter(filter, 1);
      });
    } else {
      let filter = this.billingAux;
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.refreshFilter(filter);
      });
    }
  } */

  setModelMethod(evt) {
    this.values.typ_acc = 0;
    this.values.card = 0;
    this.values.bco = 0;
    this.values.ref_doc = undefined;
    this.values.notacredito = 0;
    //this.values.pay = parseFloat('0');
    //this.payAmountChange();
    if (evt == "Nota de Crédito") {
      this.getNotasCredito();
    } else {
      this.validateNota = false;
      this.arrayNotas = [];
    }
  }

  addMethodPayment() {
    let sum_payment = parseFloat('0');
    if (this.values.method == 0) {
      Swal.fire({
        title: 'Error!!',
        text: "Débe seleccionar un método de pago!!",
        icon: 'warning',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Ok'
      }).then((result) => {
      })
    } else if ((this.values.method == "Cheque" || this.values.method == "Tarjeta Débito" || this.values.method == "Tarjeta Crédito") &&
      (this.values.bco == "" || this.values.bco == undefined || this.values.bco == null || this.values.bco == 0)) {
      Swal.fire({
        title: 'Error!!',
        text: "Débe seleccionar un banco!!",
        icon: 'warning',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Ok'
      }).then((result) => {
      })
    } else if ((this.values.method == "Transferencia" || this.values.method == "Depósito") && this.values.fk_banco == 0) {
      Swal.fire({
        title: 'Error!!',
        text: "Débe seleccionar un banco!!",
        icon: 'warning',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Ok'
      }).then((result) => {
      })
    } else if ((this.values.method == "Cheque" || this.values.method == "Tarjeta Débito" || this.values.method == "Tarjeta Crédito" || this.values.method == "Transferencia" || this.values.method == "Depósito") &&
      (this.values.ref_doc == "" || this.values.ref_doc == undefined || this.values.ref_doc == null)) {
      Swal.fire({
        title: 'Error!!',
        text: "Ingrese un número de referencia!!",
        icon: 'warning',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Ok'
      }).then((result) => {
      })
    } else if ((this.values.method == "Tarjeta Débito" || this.values.method == "Tarjeta Crédito") &&
      this.values.card == 0) {
      Swal.fire({
        title: 'Error!!',
        text: "Debe seleccionar una tarjeta!!",
        icon: 'warning',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Ok'
      }).then((result) => {
      })

    } else {

      this.num1 = parseFloat('0');
      this.num2 = parseFloat('0');
      this.res = parseFloat('0');
      this.num1 = parseFloat(this.totalPayment);
      this.num2 = parseFloat(this.values['pay']);
      this.res = parseFloat(this.num1.toString()) + parseFloat(this.num2.toString());
      this.values['pending'] = parseFloat(this.values['pending']);

      let validateSum = (parseFloat(this.res.toString()) > this.values['pending'] /* || this.values['pending'] > this.num2 */) ? true : false;
      /*if (validateSum) {
        Swal.fire({
          title: 'Error!!',
          text: "El valor sobrepasa lo pendiente por cobrar!!",
          icon: 'warning',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Ok'
        }).then((result) => {
        })
      } else { */
      let value = {};
      if (this.values.method == "Transferencia" || this.values.method == "Depósito") {
        value['bco'] = this.arrayBanks.filter(e => e.id_banks == this.values.fk_banco)[0]['name_banks'];
      } else if (this.values.method == "Nota de Crédito") {
        value['bco'] = "N/A";
        value['fk_bco_client'] = 0;
      } else if (this.values.method == "Cheque" || this.values.method == "Tarjeta Débito" || this.values.method == "Tarjeta Crédito") {
        value['bco'] = this.values.bco;
        value['fk_bco_client'] = this.values['fk_bco_client'];
      } else {
        value['bco'] = "N/A";
        value['fk_bco_client'] = 0;
      }

      value['accredited'] = this.values['accredited'];
      value['card'] = this.values['card'];
      value['fk_banco'] = this.values['fk_banco'];
      value['method'] = this.values['method'];
      value['notacredito'] = this.values['notacredito'];
      value['pay'] = this.values['pay'];
      value['pay_aux'] = this.values['pay'];
      value['pending'] = this.values['pending'];
      value['ref_doc'] = this.values['ref_doc'];
      value['total'] = this.values['total'];
      value['typ_acc'] = this.values['typ_acc'];
      this.arrayMethodPayment.push(value);

      this.values.pending = parseFloat(this.values.pending).toFixed(2);
      this.values.method = 0;
      this.values.typ_acc = 0;
      this.values.fk_banco = 0;
      this.values.pay = 0;
      this.values['bco'] = "";
      this.values['fk_bco_client'] = 0;
      /* } */
    }

    this.totalPayment = parseFloat('0');
    this.totalIngresado = parseFloat('0');
    this.arrayMethodPayment.forEach(element => {
      this.totalPayment = parseFloat(this.totalPayment) + parseFloat(element['pay']);
      this.totalIngresado = parseFloat(this.totalIngresado) + parseFloat(element['pay_aux']);
      sum_payment = parseFloat(sum_payment.toString()) + parseFloat(element['pay']);
    });

    //la suma de todos los valores pagados se los resta del valor total pendiente
    this.saldo_favor = parseFloat(sum_payment.toString()) - parseFloat(this.values.pending);
    (this.saldo_favor > 0) ? this.saldo_favor = this.saldo_favor : this.saldo_favor = 0.00;
    this.saldo_favor = parseFloat(this.saldo_favor).toFixed(2);
    if (this.saldo_favor > 0) {
      let valor_aux = parseFloat('0');
      for (let i = 0; i < this.arrayMethodPayment.length - 1; i++) {
        valor_aux = parseFloat(valor_aux.toString()) + this.arrayMethodPayment[i]['pay']
      }
      this.arrayMethodPayment[this.arrayMethodPayment.length - 1]['pay'] = parseFloat(this.values.pending) - parseFloat(valor_aux.toString());
    }

    this.totalPayment = parseFloat('0');
    this.totalIngresado = parseFloat('0');
    this.arrayMethodPayment.forEach(element => {
      this.totalPayment = parseFloat(this.totalPayment) + parseFloat(element['pay']);
      this.totalIngresado = parseFloat(this.totalIngresado) + parseFloat(element['pay_aux']);
    });

    this.totalPayment = parseFloat(this.totalPayment).toFixed(2);
    this.totalIngresado = parseFloat(this.totalIngresado).toFixed(2);
  }

  deleteMethod(idx) {
    let sum_payment = parseFloat('0');
    this.totalPayment = parseFloat(this.totalPayment) - parseFloat(this.arrayMethodPayment[idx]['pay']);
    this.totalIngresado = parseFloat(this.totalIngresado) - parseFloat(this.arrayMethodPayment[idx]['pay_aux']);
    this.arrayMethodPayment.splice(idx, 1);

    this.arrayMethodPayment.forEach(element => {
      sum_payment = parseFloat(sum_payment.toString()) + parseFloat(element['pay']);
    });
    //la suma de todos los valores pagados se los resta del valor total pendiente
    this.saldo_favor = parseFloat(sum_payment.toString()) - parseFloat(this.values.pending);
    this.totalPayment = parseFloat(this.totalPayment).toFixed(2);
    this.totalIngresado = parseFloat(this.totalIngresado).toFixed(2);
  }

  modMethod(idx) {
    this.values['accredited'] = this.arrayMethodPayment[idx]['accredited'];
    this.values['bco'] = this.arrayMethodPayment[idx]['bco'];
    this.values['card'] = this.arrayMethodPayment[idx]['card'];
    this.values['fk_banco'] = this.arrayMethodPayment[idx]['fk_banco'];
    this.values['method'] = this.arrayMethodPayment[idx]['method'];
    this.values['notacredito'] = this.arrayMethodPayment[idx]['notacredito'];
    this.values['pay'] = this.arrayMethodPayment[idx]['pay'];
    this.values['pending'] = this.arrayMethodPayment[idx]['pending'];
    this.values['ref_doc'] = this.arrayMethodPayment[idx]['ref_doc'];
    this.values['total'] = this.arrayMethodPayment[idx]['total'];
    this.values['typ_acc'] = this.arrayMethodPayment[idx]['typ_acc'];
    this.values['valor_abonado'] = this.arrayMethodPayment[idx]['valor_abonado'];

    this.deleteMethod(idx);
  }

  getNota(evt) {
    if (evt != 0) {
      this.current_pending = parseFloat(this.contacts["valor_saldo"]).toFixed(2);
      this.nota = this.arrayNotas.filter(e => e.id == evt);
      this.values.pay = parseFloat(this.nota[0].total).toFixed(2);
      this.payAmountChange();
    }
  }

  getNotasCredito() {
    this.lcargando.ctlSpinner(true);
    this.billingSrv.getNotasDebito({ id_document: 22, fk_agente: this.contacAux.cxc_cab.sales.client.id_cliente }).subscribe(res => {
      this.arrayNotas = res['data'];
      this.validateNota = true;
      this.lcargando.ctlSpinner(false);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  /* datatable actions */
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.lcargando.ctlSpinner(true);
    this.processingBilling = false;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.getBillingAux();
    });
  }

  refreshFilter(info, flag?) {
    this.billing = [];
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 8,
      search: true,
      paging: true,
      order: [[2, "desc"]],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    }

    this.billing = info;
    this.billingAuxThre = info;
    if (flag == 1) {
      localStorage.setItem('cxc', JSON.stringify(this.billingAuxThre));
    }
    this.processingBilling = true;
    this.filterCustomerArray();

    setTimeout(() => {
      this.dtTrigger.next(null);
    }, 50);

  }

  filterCustomerArray() {
    let ct = 0;
    this.filter_customer = [];
    let repeatCustomer: any = [];

    if (this.billing.length > 0) {
      this.billing.forEach(element => {
        ct += 1;
        if (ct == 1) {
          this.filter_customer.push(element);
        } else {
          repeatCustomer = this.filter_customer.filter(e => e.cxc_cab['sales']['client']['id_cliente'] == element.cxc_cab['sales']['client']['id_cliente']);
          if (repeatCustomer.length == 0) {
            this.filter_customer.push(element);
          }
        }
      });
    }
  }

  /* Validations */
  commonValidate() {
    return new Promise((resolve, reject) => {
      if (this.arrayMethodPayment.length == 0) {
        this.toastr.info("Debe al menos añadir un pago"); return;
      } else {
        this.arrayMethodPayment.forEach(element => {
          if (element.method === 0) {
            this.toastr.info("Seleccione un método de pago"); return;
          } else if (element.method === 'Cheque' && (element.bco === undefined || element.bco === "" || element.bco === null)) {
            this.toastr.info("Ingrese un Banco"); return;
          } else if (element.method === 'Cheque' && (element.ref_doc === undefined || element.ref_doc === "" || element.ref_doc === null)) {
            this.toastr.info("Ingrese un documento de referencia"); return;
          } else if (element.method === 'Cheque' && (this.postDate === undefined || this.postDate === null)) {
            this.toastr.info("Seleccione una fecha"); return;
          } else if (element.method === 'Cheque' && (moment(this.postDate).format('YYYY-MM-DD') < moment(this.date_corte).format('YYYY-MM-DD'))) {
            this.toastr.info("La fecha no puede ser menor a la fecha actual"); return;
          } else if (element.method === 'Tarjeta Crédito' && (element.bco === undefined || element.bco === "" || element.bco === null)) {
            this.toastr.info("Ingrese nombre banco"); return;
          } else if (element.method === 'Tarjeta Crédito' && (element.ref_doc === undefined || element.ref_doc === "" || element.ref_doc === null)) {
            this.toastr.info("Ingrese un documento de referencia"); return;
          } else if (element.method === 'Tarjeta Débito' && (element.bco === undefined || element.bco === "" || element.bco === null)) {
            this.toastr.info("Ingrese nombre banco"); return;
          } else if (element.method === 'Tarjeta Débito' && (element.ref_doc === undefined || element.ref_doc === "" || element.ref_doc === null)) {
            this.toastr.info("Ingrese un documento de referencia"); return;
          } else if (element.method === 'Tarjeta Crédito' && (element.card == 0)) {
            this.toastr.info("Seleccione una tarjeta"); return;
          } else if (element.method === 'Tarjeta Débito' && (element.card == 0)) {
            this.toastr.info("Seleccione una tarjeta"); return;
          } else if ((element.method === 'Depósito' || element.method === 'Transferencia') && element.fk_banco === 0) {
            this.toastr.info("Debe seleccionar una banco"); return;
          } else {
            resolve(true);
          }
        });
      }
    });
  }

  /* Actions Print */
  PrintSectionCDI() {
    let el: HTMLElement = this.printCDI.nativeElement as HTMLElement;
    el.click();
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
        if (action == "SEND_PAYMENT") {
          this.PayLetterAction();
        } else if (action == "SEND_RETENCION") {
          this.PayRetencion();
        }
      }
    })
  }

  filterCustomer(evt) {
    this.billing.forEach(element => {
      element['multp_cxc'] = false;
    });
    this.processingBilling = false;

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      if (evt == 0) {
        let inf = JSON.parse(localStorage.getItem('cxc'))
        inf.forEach(element => {
          element['multp_cxc'] = false;
        });
        this.refreshFilter(inf, 0);
      } else {
        this.billing = this.billingAuxThre.filter(e => e.cxc_cab['sales']['client']['id_cliente'] == evt);
        this.refreshFilter(this.billing);
      }
    });

  }

  setAccountCustomer() {
    let id_cliente
    if (this.filt_cust == 0 && this.ammount == 0) {
      id_cliente = this.contacts['cxc_cab']['sales']['client'];
    } else if (this.filt_cust != 0 && this.ammount == 0) {
      id_cliente = this.contacts['cxc_cab']['sales']['client'];
    } else if (this.filt_cust != 0 && this.ammount > 0) {
      id_cliente = this.billing[0]['cxc_cab']['sales']['client'];
    }
    this.closeModal(3);
    const modalInvoice = this.modalService.open(CuentaClienteComponent, { size: "lg", backdrop: 'static', windowClass: 'viewer-content-general' });
    modalInvoice.componentInstance.customer = id_cliente;
    modalInvoice.componentInstance.id_controlador = myVarGlobals.fCarteraCobranza;
    modalInvoice.componentInstance.agregar = this.permissions.agregar;
  }

  daysLate(fecha_venc) {
    var fecha1 = moment(moment(this.date_corte).format('YYYY-MM-DD'), 'YYYY-MM-DD');
    var fecha2 = moment(moment(fecha_venc).format('YYYY-MM-DD'), 'YYYY-MM-DD');
    if (fecha1 > fecha2) {
      return fecha1.diff(fecha2, 'days')
    } else {
      return 0;
    }
  }

  selectBanco(evt) {
    if (evt != 0) {
      this.values['fk_bco_client'] = this.arrayBanco.filter(e => e.entidad_bancaria == evt)[0]['id'];
    } else {
      this.values['fk_bco_client'] = 0;
    }
  }

}
