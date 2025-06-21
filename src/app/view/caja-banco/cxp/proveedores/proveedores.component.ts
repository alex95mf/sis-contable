import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import moment from 'moment';
import { Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr';
import * as myVarGlobals from '../../../../global';
import { DataTableDirective } from 'angular-datatables';
import { ProveedoresService } from './proveedores.service';
import { CommonService } from '../../../../services/commonServices';

import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { ValidacionesFactory } from '../../../../config/custom/utils/ValidacionesFactory';
import { formatDate } from '@angular/common';
import { ConfirmationDialogService } from '../../../../config/custom/confirmation-dialog/confirmation-dialog.service';
import { LstNotaDebitoComponent } from './lst-nota-debito/lst-nota-debito.component';
import { PagoLetraComponent } from './pago-letra/pago-letra.component';
import { CommonVarService } from '../../../../services/common-var.services';
declare const $: any;
@Component({
standalone: false,
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.scss']
})
export class ProveedoresComponent implements OnInit {

  @ViewChild('printCDE') printCDE: ElementRef;
  @ViewChild('printRTECXP') printRTECXP: ElementRef;

  payload: any;
  permissions: any;
  sucursalInformation: any;
  processingPayment: boolean = false;
  processing: boolean = false;

  /* Maintenance */
  filterInput: any = 5;

  /* dictionaries */
  taxes: Array<any> = [];
  type_payments: Array<any> = [];
  retenciones: Array<any> = [];
  catalogs: Array<any> = [];
  payments: Array<any> = [];
  paymentsAux: Array<any> = [];
  filters: Array<any> = [
    { id: 1, name: "Por vencer" },
    { id: 2, name: "Vencidas" },
    { id: 3, name: "Pagadas" },
    { id: 5, name: "Por Vencer y Vencidas" },
    { id: 4, name: "Todas" },
  ];

  /* datetime */
  date: Date = new Date();
  fromDatePicker: any = formatDate(new Date(this.date.getFullYear(), this.date.getMonth(), 1), 'yyyy-MM-dd', 'en');
  toDatePicker: any = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  postDate: any = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  current_date: any = new Date();
  current_time = `${this.date.getDate()}-${this.date.getMonth() + 1}-${this.date.getFullYear()} ${this.date.getHours()}:${this.date.getMinutes()}:${this.date.getSeconds()}`;

  /* payload modals */
  processingInformation: any = false;
  processingRetencion: any = false;
  processingPayLetter: any = false;
  contacts: any = undefined;

  values: any = { method: 0, typ_acc: 0, total: 0.00, parseTotal: "0.00", accredited: 0.00, parseAccredited: "0.00", pending: 0.00, parsePending: "0.00", pay: 0.00, obs: "", ben: "" };
  current_pending: any = 0.00;

  /* payload retencion */
  calculate: any = { parseValue: "0.00", value: 0.00, monto: 0.00, iva: 0.00, total: 0.00, parseTotal: "0.00" };

  /* print */
  print_cde: any;
  print_rt_cxp: any;
  current_box: any;

  /* datatable */
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtOptions: any = {};
  dtTrigger = new Subject();

  vmButtons: any = [];
  validaciones: ValidacionesFactory = new ValidacionesFactory();

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  flag:any = false;

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private commonServices: CommonService,
    private provSrv: ProveedoresService,
    private confirmationDialogService: ConfirmationDialogService,
    private commonVarSrv: CommonVarService
  ) {
    this.commonVarSrv.listenCxp.asObservable().subscribe(res => {
      if(!this.flag){
        this.flag = true;
        this.type_payments = res.type_payments;
        this.PayLetter();
      }
    })

    this.commonVarSrv.updPerm.asObservable().subscribe(res => {
      (res) ? this.lcargando.ctlSpinner(true) : this.lcargando.ctlSpinner(false);
    })
  }

  ngOnInit(): void {
    this.flag = false ;
    this.vmButtons = [
      { orig: "btnComRetn", paramAccion: "", boton: { icon: "fa fa-check", texto: "ACEPTAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: true, imprimir: false },
      { orig: "btnComRetn", paramAccion: "", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: false, imprimir: false },

      { orig: "btnIfProvee", paramAccion: "", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: false, imprimir: false },

      { orig: "btnProvPrin", paramAccion: "", boton: { icon: "fa fa-search", texto: "BUSCAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: false, imprimir: false },
    ];

    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 10);

    this.current_date = moment(this.date).format('YYYY-MM-DD');
    this.getPermissions();
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto + evento.items.orig) {
      case "ACEPTARbtnComRetn":
        this.confirmPayRetencion();
        break;
      case "CERRARbtnComRetn":
        this.closeModal(3);
        break;

      case "CERRARbtnIfProvee":
        this.closeModal(1);
        break;

      case "BUSCARbtnProvPrin":
        this.rerender();
        break;
    }
  }

  lstParametrosCuentas: any = [];

  /* Calls API REST */
  getPermissions() {
    this.payload = JSON.parse(localStorage.getItem('Datauser'));

    let params = { codigo: myVarGlobals.fPagoProveedores, id_rol: this.payload.id_rol }

    this.commonServices.getPermisionsGlobas(params).subscribe(res => {
      this.permissions = res["data"][0];
      if (this.permissions.ver == "0") {
        this.lcargando.ctlSpinner(false);
        this.toastr.info("Usuario no tiene acceso a este formulario.");
        this.vmButtons = [];
      } else {

        this.provSrv.getAccParams().subscribe((res: any) => {
          this.lstParametrosCuentas = res.data;
          this.hasOpenBox();
        }, error => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.message);
        });
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  hasOpenBox() {
    this.provSrv.getUserBoxOpen({}).subscribe(response => {
      this.current_box = response['data'];
      this.groupCatalogs();
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

  groupCatalogs() {
    let data = { fields: ["TIPO PAGO CHEQUE", "FORMA PAGO PROVEEDOR"] };

    this.provSrv.getCommonInformationFormule(data).subscribe(res => {
      this.catalogs = res['data']['catalogs']
      this.getSucursalInformation();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getTaxesRt() {
    this.lcargando.ctlSpinner(true);
    let data = {
      from_agente: parseInt(this.payload['company']['tipo_contribuyente']),
      to_agente: parseInt(this.contacts['purchase']['proveedor']['contribuyente']),
    }
    this.provSrv.getAvailableTaxes(data).subscribe(res => {
      this.taxes = res['data']
      this.processingRetencion = true;
      this.lcargando.ctlSpinner(false);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getSucursalInformation() {
    this.provSrv.getSucursalInformation().subscribe(res => {
      this.sucursalInformation = res['data'].find(e => e.id_sucursal == this.payload.id_sucursal);
      this.AvailableCxP();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  AvailableCxP() {
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
    };

    (this as any).mensajeSpinner = "Cargando...";
    this.lcargando.ctlSpinner(true);
    this.filterInput = 5;
    this.provSrv.getAvailableCxP(payload).subscribe(response => {
      this.processing = true;
      this.processingPayment = true;
      this.payments = response["data"];
      this.paymentsAux = response["data"];
      this.lcargando.ctlSpinner(false);
      setTimeout(() => {
        this.dtTrigger.next(null);
        setTimeout(() => {
          this.filterCxP(5);
        }, 100);
      }, 50);

    }, error => {
      this.lcargando.ctlSpinner(false);
      this.processing = true;
      setTimeout(() => {
        this.dtTrigger.next(null);
      }, 50);
    });
  }

  AvailableCxPAux() {
    const payload = {
      dateFrom: moment(this.fromDatePicker).format('YYYY-MM-DD'),
      dateTo: moment(this.toDatePicker).format('YYYY-MM-DD'),
    }

    this.payments = [];

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 8,
      search: true,
      paging: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    }

    this.filterInput = 5;
    (this as any).mensajeSpinner = "Cargando...";
    this.lcargando.ctlSpinner(true);
    this.provSrv.getAvailableCxP(payload).subscribe(response => {
      this.processing = true;
      this.processingPayment = true;
      this.payments = response["data"];
      this.paymentsAux = response["data"];
      this.lcargando.ctlSpinner(false);
      setTimeout(() => {
        this.dtTrigger.next(null);
        setTimeout(() => {
          this.filterCxP(5);
        }, 100);
      }, 50);

    }, error => {
      this.lcargando.ctlSpinner(false);
      this.processing = true;
      setTimeout(() => {
        this.dtTrigger.next(null);
      }, 50);
      this.toastr.info(error.error.message);
    });
  }

  async PayLetter() {
    await this.commonValidate().then(resp => {
      if (resp) {
        this.confirmAction("Seguro desea realizar el pago?", "SEND_PAYMENT");
      }
    });
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
      punto_emision: this.current_box.punto_emision
    };

    (this as any).mensajeSpinner = "Guardando retencion...";
    this.lcargando.ctlSpinner(true);
    /* console.log(data); */
    this.provSrv.addCxPRetencion(data).subscribe(response => {
      this.print_rt_cxp = response['data'];

      setTimeout(() => {
        this.closeModal(3);
        this.rerender();
        this.toastr.success(response['message']);

        this.PrintSectionRTCXP();
      }, 1000);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  PayCxP() {
    this.flag = false ;
    this.commonVarSrv.listenCxpRes.next(null);
    this.values.id = this.contacts.id;
    this.values.letter = this.contacts.letra;
    this.values.ref = this.contacts.doc_ref_num;
    this.values.tip_doc = this.contacts.doc_ref_tip;
    this.values.cxp = this.contacts["fk_cxp"];
    this.values.complete = (this.values.total === this.values.accredited) ? true : false;
    this.values.ref_doc = (this.values.ref_doc === undefined || this.values.ref_doc === null || this.values.ref_doc === "") ? "" : this.values.ref_doc;
    this.values.type_purchase = this.contacts["cxp_cab"]["type"];

    this.values.postDate = (this.values.method === "Cheque") ? moment(this.values.postDate).format('YYYY-MM-DD') : moment(this.postDate).format('YYYY-MM-DD');

    if (this.values.method === "Efectivo") {
      let info = this.type_payments.find((el) => el.id_caja_chica === parseInt(this.values.typ_acc));
      this.values.cuenta = info['cuenta_caja'];
      this.values.nombre_cta = info['name_cuenta_caja'];
    } else if (this.values.method === "Nota de Débito") {
      let info = this.lstParametrosCuentas.find((el) => el.id == 3);
      this.values.cuenta = info['cuenta_contable'];
      this.values.nombre_cta = info['nombre_cuenta'];
      this.values.method = "NDD-C";
    } else {
      let info = this.type_payments.find((el) => el.id_banks === parseInt(this.values.typ_acc));
      this.values.cuenta = info['cuenta_contable'];
      this.values.nombre_cta = info['name_banks'];
    }
    this.values.information = this.contacts["purchase"];

    /* Bitacora params */
    this.values.ip = this.commonServices.getIpAddress();
    this.values.accion = `Registro de Cuenta por Pagar No. ${this.contacts.purchase['num_doc']} (${this.contacts.cxp_cab['type']})`;
    this.values.id_controlador = myVarGlobals.fPagoProveedores;

    (this as any).mensajeSpinner = "Pagando...";
    this.lcargando.ctlSpinner(true);
    this.provSrv.addPaymentCxP(this.values).subscribe(response => {
      this.print_cde = response['data'];

      setTimeout(() => {
        this.closeModal(2);
        this.rerender();
        this.toastr.success(response['message']);
        this.PrintSectionCDE();
      }, 1000);
    }, error => {
      this.closeModal(2);
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  PrintSectionCDE() {
    let el: HTMLElement = this.printCDE.nativeElement as HTMLElement;
    el.click();
  }

  PrintSectionRTCXP() {
    let el: HTMLElement = this.printRTECXP.nativeElement as HTMLElement;
    el.click();
  }

  /* Modals */
  closeModal(opt) {
    switch (opt) {
      case 1:
        let node = document.getElementById('content-pills-act');
        node.querySelector('a.active').classList.remove('active');

        let tab_contact = document.getElementById('contact-tab');
        tab_contact.classList.add('active');

        let info_content = document.getElementById('information-content');
        info_content.querySelector('.show, .active').classList.remove('show', 'active');

        document.getElementById('contact').classList.add('show', 'active');

        this.contacts = undefined;
        this.processingInformation = false;

        ($('#ContactProveedorModal') as any).modal('hide');
        break;
      case 2:
        this.contacts = undefined;
        this.print_cde = undefined;
        this.processingPayLetter = false;
        this.values = { method: 0, typ_acc: 0, total: 0.00, parseTotal: "0.00", accredited: 0.00, parseAccredited: "0.00", pending: 0.00, parsePending: "0.00", pay: 0.00, obs: "", ben: "" };
        this.current_pending = 0.00;

        // ($('#PaymentProveedorModal') as any).modal('hide');
        break;
      case 3:
        this.contacts = undefined;
        this.processingRetencion = false;

        this.calculate = { parseValue: "0.00", value: 0.00, monto: 0.00, iva: 0.00 };;
        this.values.method = 0;
        this.retenciones = [];

        ($('#RetencionProveedorModal') as any).modal('hide');
        break;
    }
  }

  ShowInformation(idx) {
    $('#ContactProveedorModal').appendTo("body").modal('show');
    let params = { id: this.payments[idx]["fk_cxp"], doc_tip: this.payments[idx]["doc_ref_tip"], doc_num: this.payments[idx]["doc_ref_num"] }

    this.provSrv.getAvailableCxPSpecific(params).subscribe(response => {
      this.contacts = response["data"];
      this.processingInformation = true;
    }, error => {
      this.toastr.info(error.error.message);
    });
  }

  showRetencion(idx) {
    $('#RetencionProveedorModal').appendTo("body").modal('show');
    this.contacts = this.payments[idx];
    this.calculate.iva = this.commonServices.formatNumber(this.contacts['purchase']['iva']);
    this.calculate.monto = this.commonServices.formatNumber(this.contacts['purchase']['subtotal']);
    this.getTaxesRt();
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

        if (this.retenciones.length > 0) {
          this.vmButtons[0].habilitar = false;
        }

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

  confirmPayRetencion() {
    this.confirmAction("Seguro desea realizar esta acción?", "SEND_RETENCION");
  }

  calculateTotalRetencion() {
    this.calculate.total = this.retenciones.reduce((acc, el) => {
      return acc + el.value
    }, 0.00);
    this.calculate.parseTotal = this.commonServices.formatNumber(this.calculate.total);
  }

  async showLetter(idx) {
    this.contacts = this.payments[idx];

    if (this.contacts['purchase']['retencion'] === 0) this.toastr.info(`El documento ${this.contacts["purchase"]["num_doc"]}, no se ha efectuado una retención`);

    this.values.total = parseFloat(this.contacts["valor"]);
    this.values.accredited = parseFloat(this.contacts["valor_abono"]);
    this.values.pending = parseFloat(this.contacts["valor_saldo"]);
    this.current_pending = parseFloat(this.contacts["valor_saldo"]);

    this.values.parseTotal = this.commonServices.formatNumber(this.values.total);
    this.values.parseAccredited = this.commonServices.formatNumber(this.values.accredited);
    this.values.parsePending = this.commonServices.formatNumber(this.values.pending);

    this.values.ben = this.contacts['purchase']['proveedor']['razon_social'];
    this.processingPayLetter = true;


    const dialogRef = this.confirmationDialogService.openDialogMat(PagoLetraComponent, {
      width: 'auto', height: 'auto',
      data: {
        titulo: ("Pago de letra " + this.contacts.letra + "/" + this.contacts.cxp_cab['letras'] + "     No. Documento " + this.contacts.doc_ref_num), dataUser: this.payload,
        valor: this.values, catalogs: this.catalogs, type_payments: this.type_payments, contacts: this.contacts, current_pending: this.current_pending
      }

    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado != false && resultado != undefined) {
        this.type_payments = resultado.type_payments;
        /* this.PayLetter(); */
        /* setTimeout(() => {
         let result =  this.commonValidate().then(res =>{
           if(res){
             this.PayCxP();
           }
         });
        }, 10);  */
      } else {
        this.closeModal(2);
      }
    });

  }

  /* onChange */
  filterCxP(evt) {
    this.processingPayment = false;
    if (evt == 4) {
      let filter = this.paymentsAux;
      this.dtElement.dtInstance.then((dtInstance: any) => {
        dtInstance.destroy();
        this.refreshFilter(filter);
      });
    } else if (evt == 1) {
      let filter = this.paymentsAux.filter(el => this.current_date <= el.fecha_venc && el.valor_saldo > 0);
      this.dtElement.dtInstance.then((dtInstance: any) => {
        dtInstance.destroy();
        this.refreshFilter(filter);
      });
    } else if (evt == 2) {
      let filter = this.paymentsAux.filter(el => this.current_date > el.fecha_venc && el.valor_saldo > 0);
      this.dtElement.dtInstance.then((dtInstance: any) => {
        dtInstance.destroy();
        this.refreshFilter(filter);
      });
    } else if (evt == 3) {
      let filter = this.paymentsAux.filter(el => el.valor_saldo === 0);
      this.dtElement.dtInstance.then((dtInstance: any) => {
        dtInstance.destroy();
        this.refreshFilter(filter);
      });
    } else if (evt == 5) {
      let filter = this.paymentsAux.filter(el => this.current_date <= el.fecha_venc && el.valor_saldo > 0 || this.current_date > el.fecha_venc && el.valor_saldo > 0);
      this.dtElement.dtInstance.then((dtInstance: any) => {
        dtInstance.destroy();
        this.refreshFilter(filter);
      });
    } else {
      let filter = this.paymentsAux;
      this.dtElement.dtInstance.then((dtInstance: any) => {
        dtInstance.destroy();
        this.refreshFilter(filter);
      });
    }
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

  /* datatable actions */
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.processingPayment = false;
    this.dtElement.dtInstance.then((dtInstance: any) => {
      dtInstance.destroy();
      this.AvailableCxPAux();
    });
  }

  refreshFilter(info) {
    this.payments = [];

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 8,
      search: true,
      paging: true,
      order: [[2, "asc"]],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    }

    this.payments = info;

    setTimeout(() => {
      this.dtTrigger.next(null);
    }, 50);

    this.processingPayment = true;
  }

  /* Validations */
  commonValidate() {
    return new Promise((resolve, reject) => {
      if (this.values.method === 0) {
        this.toastr.info("Seleccione un método de pago");
      } else if ((this.values.method === 'Efectivo' || this.values.method === 'Cheque' || this.values.method === 'Transferencia' || this.values.method === 'Tarjeta Crédito' || this.values.method === 'Tarjeta Débito') && (this.values.typ_acc === 0 || this.values.typ_acc === undefined || this.values.typ_acc === null)) {
        this.toastr.info("Seleccione origen del débito");
      } else if ((this.values.method === 'Cheque' || this.values.method === 'Transferencia' || this.values.method === 'Tarjeta Crédito' || this.values.method === 'Tarjeta Débito') && (this.values.ref_doc === undefined || this.values.ref_doc === "" || this.values.ref_doc === null)) {
        this.toastr.info("Ingrese un documento de referencia");
      } else if (this.values.method === 'Cheque' && (this.postDate === undefined || this.postDate === null || this.postDate === "")) {
        this.toastr.info("Ingrese la fecha del cheque");
      } else if (this.values.ben === undefined || this.values.ben === "" || this.values.ben === null) {
        this.toastr.info("Ingrese el beneficiario");
      } else if (this.values.obs === undefined || this.values.obs === "" || this.values.obs === null) {
        this.toastr.info("Ingrese una observación/detalle/concepto");
      } else {
        resolve(true);
      }
    });
  }

  /* Actions CRUD'S */
  async confirmAction(message, action) {
    Swal.fire({
      title: "Atención!",
      text: message,
       icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#DC3545',
      confirmButtonColor: '#13A1EA',
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.value) {
        if (action == "SEND_RETENCION") {
          this.PayRetencion();
        } else if (action == "SEND_PAYMENT") {
          this.PayCxP();
        }
      }
    })
  }

  presentarNota() {
    const dialogRef = this.confirmationDialogService.openDialogMat(LstNotaDebitoComponent, {
      width: 'auto', height: 'auto',
      data: { titulo: "Listado de Nota de Débito", dataUser: this.payload }

    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado != false && resultado != undefined) {

      }
    });
  }

}
