import { Component, OnInit, NgZone, ViewChild, TemplateRef } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { DiarioService } from 'src/app/view/contabilidad/comprobantes/diario/diario.service';
import { PlanCuentasService } from 'src/app/view/contabilidad/plan-cuentas/plan-cuentas.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import * as myVarGlobals from '../../../../global';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import * as moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { ViewDocumentDtComponent } from 'src/app/view/contabilidad/comprobantes/diario/view-document-dt/view-document-dt.component';
import { environment } from 'src/environments/environment';

import { CcModalTablaCuentaComponent } from 'src/app/config/custom/cc-modal-tabla-cuenta/cc-modal-tabla-cuenta.component';

import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

 import { DiarioObjeto } from 'src/app/view/contabilidad/comprobantes/diario/diario';

import { TrasnferenciaDepositosService } from './trasnferencia-depositos.service';

import { MovimientosBancos } from './movimientoBancarios';
import {CurrencyMaskInputMode} from 'ngx-currency'



@Component({
standalone: false,
  selector: 'app-trasnferencia-depositos',
  templateUrl: './trasnferencia-depositos.component.html',
  styleUrls: ['./trasnferencia-depositos.component.scss'],
  providers: [DialogService]
})
export class TrasnferenciaDepositosComponent {
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild('content') templateRef: TemplateRef<any>;

  /* Datatable */
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  /* dtOptions: DataTables.Settings = {}; */
  dtOptions: any = {};
  dtTrigger = new Subject();

  catalogo_presupuesto: any;
  detalleMovimientos: MovimientosBancos[];

  /* Params Component */
  windows: any = 1;
  step: any = 0;
  permisions: any;
  firstFilter: any;
  secondFilter: any;
  dataUser: any;
  documentInformation: any;
  accounts: any;
  NameAccounts: any;
  dateNow: Date = new Date();
  fieldsDaily: Array<any> = [];
  HeaderInfo: any = { date: "", doc_id: 0, doc_num: 0, doc_name: "", doc_type: "", concept: "", note: "", secuencia: "", sec_parse: "", estado: "" };
  dailyVoucher: Array<any> = [];
  totalVoucher: any = { debit: "0.00", credit: "0.00", valorPresupuesto : "0.00" };
  fromSearchVoucher: Date = new Date();
  toSearchVoucher: Date = new Date();
  dtInformation: any;
  searchParamsVoucher: any = { date_from: "", date_to: "", number_from: "", number_to: "", doc: 0, detail: "", note: "" };


  MovimientosBancolosElement: MovimientosBancos[];
  currencyOptions = {
    prefix: '',
    min: 0,
    nullable: true,
    inputMode: CurrencyMaskInputMode.NATURAL
  }


  LoadOpcionCentro: any = false;
  centros: any;

  actionsDaily = {
    new: false,
    save: true,
    edit: true,
    delete: true,
    print: true,
    cancel: true
  }

  permiso_ver: any = "0";
  LoadOpcionTipo: any = false;
  observacion:string = '';

  /* Params search */
  vouchersearch: any = {};
  dtDetails: Array<any> = [];
  fsearch: any;
  ssearch: any;

  listaDesembolso: any = []
  listaTipoIngreso: any = []

  /* Date Now Show Document */
  today: Date = new Date;
  date = this.today.getDate() + '-' + (this.today.getMonth() + 1) + '-' + this.today.getFullYear();
  hour = this.today.getHours() + ':' + this.today.getMinutes() + ':' + this.today.getSeconds();

  /* Excel information */
  excelData: any = [];
  processing: any = false;
  empresLogo: any;

  /*new consult vars*/
  presentDt: any = false;
  dtConsultaAsiento: DiarioObjeto[];
  locality: any;
  id: any = 0;
  estado: any = "";
  tipo: any = 0;
  numero: any = 0;
  montoDesde: any;
  montoHasta: any;
  totalRegistro: any;
  viewDate: Date = new Date();
  fromDatePicker: Date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
  toDatePicker: Date = new Date();
  arrayCabMov: Array<any> = [];
  arrayTipo: Array<any> = []; /* dtConsultaAsiento  */
  arrayCab: Array<any> = [];
  arrayId: Array<any> = [];
  dtView: Array<any> = [];

  movimiento:any;
  select_mivimiento:any;
  cmb_tipo_movimiento:any;
  tipo_movimiento:any;
  datos_banco:any;
  datos_banco_destino:any;
  value_movimiento:number = null;
  cod_transaccion:string = '';

  transPropias: any = false;



  arrayEstado: Array<any> = [{
    id: "",
    name: "Seleccione Estado"
  },
  {
    id: 1,
    name: "Activo"
  },
  {
    id: 0,
    name: "Anulado"
  },
  ];
  flag = false;
  contador = 0;
  c = 0;
  ccc = 0;

  bankSelect: any = null;
  bankSelectDestino: any = null;
  bankSelectConsulta : any = null;
  arrayBanks: any;
  saldo_bank: any = '0.00';

  constructor(public dialogService: DialogService, private diarioSrv: DiarioService, private toastr: ToastrService, private router: Router, private zone: NgZone,
    private pCuentasService: PlanCuentasService, private commonServices: CommonService, private modalService: NgbModal, private commonVarSrvice: CommonVarService,
    private transfServ: TrasnferenciaDepositosService) {

    this.isRowSelectable = this.isRowSelectable.bind(this);
    this.commonVarSrvice.updPerm.asObservable().subscribe(res => {
      (res) ? this.lcargando.ctlSpinner(true) : this.lcargando.ctlSpinner(false);
    })
  }

  vmButtons: any = [];
  idBotones: any = "";
  dinamicoBotones(e) {

    var valor = e.index + 1;

    setTimeout(() => {
      this.vmButtons.forEach(element => {
        if (element.paramAccion == valor) {
          element.permiso = true; element.showimg = true;
        } else {
          element.permiso = false; element.showimg = false;
        }
      });
    }, 10);

  }


  ref: DynamicDialogRef;

  ngOnInit(): void {

    this.vmButtons =
      [
        { orig: "btnTransDep", paramAccion: "1", boton: { icon: "fa fa-plus-square-o", texto: "NUEVO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning btn-sm", habilitar: false, imprimir: false },
        { orig: "btnTransDep", paramAccion: "1", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: true, imprimir: false },
        { orig: "btnTransDep", paramAccion: "1", boton: { icon: "fa fa-eraser", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: true, imprimir: false },

        { orig: "btnTransDep", paramAccion: "2", boton: { icon: "fa fa-search", texto: "BUSQUEDA" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false },
        { orig: "btnTransDep", paramAccion: "2", boton: { icon: "fa fa-trash-o", texto: "ANULAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: true, imprimir: false }

      ];



    this.cmb_tipo_movimiento =
    [
      {
      id: 'TRANSFERENCIAS_PROPIAS',
      descripcion: 'TRANSFERENCIAS PROPIAS'
      },
      {
        id: 'TRANSFERENCIAS_A_TERCEROS',
        descripcion: 'TRANSFERENCIAS A TERCEROS'
      },
      {
        id: 'DESPOSITO',
        descripcion: 'DESPOSITO'
      },
      {
        id: 'CHEQUE',
        descripcion: 'CHEQUE'
      },
      {
        id: 'ANTICIPOS',
        descripcion: 'ANTICIPOS BANCARIOS'
      }
    ];



    this.movimiento =
    [
      {
        id: 'I',
        descripcion: 'INGRESO'
      },
      {
        id: 'E',
        descripcion: 'EGRESO'
      }
    ]



    this.tipo_movimiento = 'TRANSFERENCIAS_A_TERECEROS';
    this.select_mivimiento = 'I';
    //this.select_mivimiento = 0;



    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.empresLogo = this.dataUser.logoEmpresa;
    this.HeaderInfo.date = new Date(this.dateNow); //moment(this.dateNow).format('YYYY-MM-DD HH:mm:ss');

    setTimeout(() => {
      this.vmButtons.forEach(element => {
        if (element.paramAccion == 1) {
          element.permiso = true; element.showimg = true;
        } else {
          element.permiso = false; element.showimg = false;
        }
      });

    }, 10);


    setTimeout(() => {

      this.lcargando.ctlSpinner(true);
      this.dataUser = JSON.parse(localStorage.getItem('Datauser'));

      let data = {
        id: 2,
        codigo: myVarGlobals.fTransferencia,
        id_rol: this.dataUser.id_rol
      }

      this.commonServices.getPermisionsGlobas(data).subscribe(res => {
        console.log('permisos', res)
        this.permisions = res["data"][0];

        this.permiso_ver = this.permisions.ver;

        if (this.permisions.ver == "0") {
          this.lcargando.ctlSpinner(false);
          this.toastr.info("Usuario no tiene Permiso para ver el formulario de Transferencias o Depósitos");
          this.vmButtons = [];
        } else {
          this.fieldsDaily.push({ banco:true, LoadOpcionCatalogoPresupuesto: false, presupuesto:'', codpresupuesto:'', centro:0, valor_presupuesto: parseFloat('0.00').toFixed(2), account: '', name: '', detail: "", credit: parseFloat('0.00').toFixed(2), debit: parseFloat('0.00').toFixed(2) }, { banco:false, LoadOpcionCatalogoPresupuesto: false, presupuesto:'', codpresupuesto:'', centro:0, valor_presupuesto: parseFloat('0.00').toFixed(2), account: '', name: '', detail: "", credit: parseFloat('0.00').toFixed(2), debit: parseFloat('0.00').toFixed(2),disabled: true ,tipo_detalle: '', tipo_desembolso: '', tipo_ingreso:''});
          this.getInfoBank();
          this.getDocuments();
          this.cargarDesembolso();
          this.cargarTipoIngreso();
        }
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      });
    }, 10);

  }


  ChangeCodigoPresupuesto(event: any, dataelement, index){

    dataelement[index].presupuesto = event.nombre;

  }

  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();

    // Creating and array of space saperated term and removinf the empty values using filter
    let splitTerm = term.split(' ').filter(t => t);

    let isWordThere = [];

    // Pushing True/False if match is found
    splitTerm.forEach(arr_term => {
      let search = item['combo'].toLowerCase();
      isWordThere.push(search.indexOf(arr_term) != -1);
    });

    const all_words = (this_word) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }

  AgregarConcepto(){
    console.log('registro de pruebas');

    this.fieldsDaily.forEach(arr_term => {
      arr_term.detail = this.HeaderInfo.concept;
    });

  }
  cargarDesembolso() {

    this.transfServ.listarDesembolso({}).subscribe((res: any) => {
      //console.log(res);
      res.map((data) => {
        this.listaDesembolso.push(data)
        console.log(this.listaDesembolso)

      })
    })
  }
  cargarTipoIngreso() {

    this.transfServ.listarTipoIngreso({}).subscribe((res: any) => {
      //console.log(res);
      res.map((data) => {
        this.listaTipoIngreso.push(data)
        console.log(this.listaTipoIngreso)

      })
    })
  }

  metodoGlobal(evento: any) {
    switch (evento.items.paramAccion + evento.items.boton.texto) {
      case "1NUEVO":
        this.NewRegister();
        break;
      case "1GUARDAR":
        this.SaveDaily();
        break;
      case "1CANCELAR":
        this.CancelDaily();
        break;

      case "2LIMPIAR":
        this.limpiarData();
        break;
      case "2ANULAR":
        this.AnularDiarios();
        break;
      case "2BUSQUEDA":
        this.MovimientosRegistrados();
        break;
    }
  }

  getInfoBank() {
    this.transfServ.getAccountsByDetailsBanks({ company_id: this.dataUser.id_empresa }).subscribe(res => {

      this.arrayBanks = res['data'];
      this.bankSelect = 0;
      this.bankSelectDestino = 0;
      this.bankSelectConsulta = 0;

    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  changeMovimiento(){
    this.getDocuments();
  }
  changeTipoMovimiento(event){
    //console.log(event)
    this.restartFields();
    if(event === 'TRANSFERENCIAS_PROPIAS'){
      this.transPropias = true;
    }else{
      this.transPropias = false;
    }
  }

  getDocuments() {

    let data = { company_id: this.dataUser.id_empresa, doc_type:(this.select_mivimiento === 'E' ? "CDE" : "CDI")};
    this.diarioSrv.getCompanyInformation(data).subscribe(res => {
      this.HeaderInfo.doc_id = res["data"].id;
      this.HeaderInfo.doc_name = res["data"].nombre;
      this.HeaderInfo.sec_parse = res["data"].sec_parse;
      this.HeaderInfo.secuencia = res["data"].secuencia;
      this.HeaderInfo.doc_type = res["data"].codigo;
      this.HeaderInfo.estado = res["data"].estado;
      this.lcargando.ctlSpinner(false);
      //this.getAccounts();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getAccounts() {
    let data = { company_id: this.dataUser.id_empresa };
    this.diarioSrv.getAccountsByDetails(data).subscribe(res => {
      this.accounts = res["data"];
      this.NameAccounts = res["data"];
      this.processing = true;
      this.getMovientoCabs();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  addVoucherDaily(information) {


    debugger

    let CabRegistroMovi = {
      documento:this.select_mivimiento === 'E' ? 12 : 13,
      secuencia:this.HeaderInfo.secuencia,
      id_banco: this.bankSelect,
      id_banco_destino: this.bankSelectDestino,
      tipo_metodo:this.tipo_movimiento,
      valor_deposito:this.value_movimiento,
      beneficiario:'',
      emision: moment(this.HeaderInfo.date).format('YYYY-MM-DD HH:mm:ss'),
      concepto:this.observacion,
      cod_transaccion:this.cod_transaccion,
      detail_compo: this.fieldsDaily,
    }

    let dataRegister = {
      comprobante : CabRegistroMovi,
      asiento:information
    }
    console.log(dataRegister)
    this.lcargando.ctlSpinner(true);
    this.transfServ.RegistroEgresoBancos(dataRegister).subscribe(res => {

      if (res["status"] == 0) {

        this.toastr.info(res["message"]);
        this.dailyVoucher = [];

      } else {

        this.lcargando.ctlSpinner(false);
        this.toastr.success(res["message"]);
        this.vouchersearch = {};
        this.dtDetails = [];
        this.presentDt = false;
        this.CancelDaily();
        this.getDocuments();

        window.open(environment.ReportingUrl + "rpt_movimiento_banco.html?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_empresa=1&id_documento=" + res["data"].id, '_blank');
      }
    }, error => {
      this.toastr.info(error.error.message);
      this.lcargando.ctlSpinner(false);
    })
  }

  editVoucherDaily(information) {
    this.diarioSrv.ediVoucherDaily(information).subscribe(res => {
      if (res["status"] == 0) {
        this.toastr.info(res["message"]);
      } else {
        this.toastr.success(res["message"]);
        this.restartFields();
        this.getDocuments();
        this.vouchersearch = {};
        this.dtDetails = [];
        this.windows = 1;
        let el = document.getElementById("tabGenerate") as HTMLInputElement;
        el.checked = true;
      }
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  getListaCentrosCosto(i) {
    //ListaCentroCostos


    this.diarioSrv.ListaCentroCostos().subscribe(
      (resTotal) => {

        this.centros = resTotal["data"];

        console.log(resTotal);

      },
      (error) => {
      }

    );
  }



  LoadListaCatalogoPresupuesto(index){


    this.fieldsDaily[index].LoadOpcionCatalogoPresupuest = true;

    this.diarioSrv.ListaCatalogoPresupuesto().subscribe(res => {

      this.catalogo_presupuesto = res['data'];

      this.fieldsDaily[index].LoadOpcionCatalogoPresupuesto = false;

    }, error => {
      this.lcargando.ctlSpinner(false);
      this.fieldsDaily[index].LoadOpcionCatalogoPresupuesto = false;
      this.toastr.info(error.error.mesagge);
    })

  }

  /* common functions */
  addFields() {
    this.fieldsDaily.push({ LoadOpcionCatalogoPresupuesto: false, presupuesto:'', codpresupuesto:'', centro:0, valor_presupuesto: parseFloat('0.00').toFixed(2), account: '', name: '', detail: this.HeaderInfo.concept, credit: parseFloat('0.00').toFixed(2), debit: parseFloat('0.00').toFixed(2),disabled: true,tipo_detalle:'',tipo_desembolso:'',tipo_ingreso:'' });
  }

  addFieldsByEdit() {
    this.vouchersearch.details.push({ cont_accounts: { codigo: "", nombre: "" }, detalle: "", valor_deb: 0.00, valor_cre: 0.00 });
  }

  deleteFields(idx) {
    this.fieldsDaily.splice(idx, 1);
    this.debitChange();
    this.creditChange();
  }

  deleteFieldByEdit(idx) {
    if (!(this.vouchersearch.details[idx].secuencia === undefined)) {
      let backup = {
        id: this.vouchersearch.details[idx].id,
        secuencia: this.vouchersearch.details[idx].secuencia,
        fk_cont_mov_cab: this.vouchersearch.details[idx].fk_cont_mov_cab,
        account: this.vouchersearch.details[idx].cuenta,
      }
      this.dtDetails.push(backup);
    }
    this.vouchersearch.details.splice(idx, 1);
    this.debCgSearch();
    this.creCgSearch();
  }

  restartFields() {

    this.dailyVoucher = [];
    this.fieldsDaily = [];
    this.observacion = "";
    this.HeaderInfo.note = "";
    this.totalVoucher.debit = "0.00";
    this.totalVoucher.credit = "0.00";
    this.totalVoucher.valorPresupuesto = "0.00";
    this.datos_banco = "";
    this.datos_banco_destino = "";
    this.bankSelect = 0;
    this.bankSelectDestino = 0;
    this.value_movimiento = 0;
    this.cod_transaccion = ""
    // this.select_mivimiento = 0;
    // this.tipo_movimiento = 0;


    this.fieldsDaily.push({ banco:true, LoadOpcionCatalogoPresupuesto: false, presupuesto:'', codpresupuesto:'', valor_presupuesto: parseFloat('0.00').toFixed(2), centro:0, account: '', name: '', detail: "", credit: parseFloat('0.00').toFixed(2), debit: parseFloat('0.00').toFixed(2) }, { banco:false, LoadOpcionCatalogoPresupuesto: false, presupuesto:'', codpresupuesto:'', valor_presupuesto: parseFloat('0.00').toFixed(2), centro:0, account: '', name: '', detail: "", credit: parseFloat('0.00').toFixed(2), debit: parseFloat('0.00').toFixed(2),disabled: true });

  }


  ConsultaEstatus(i){

    let valida = true;

    if(this.actionsDaily.new &&  this.fieldsDaily[i].banco){
      valida = true;
    }

    if(this.actionsDaily.new &&  !this.fieldsDaily[i].banco){
      valida = false;
    }

    return valida;
  }

  ChangeBancoRegister(evento:any){


    let cuenta = this.arrayBanks.filter(e => e.id_banks == evento)[0]['cuenta_contable'];
    let nombre = this.arrayBanks.filter(e => e.id_banks == evento)[0]['name_cuenta'];


    this.datos_banco = cuenta+'-'+nombre;

    this.fieldsDaily[0].account = cuenta;
    this.fieldsDaily[0].name = nombre;


  }
  ChangeBancoRegisterDestino(evento:any){


    let cuenta = this.arrayBanks.filter(e => e.id_banks == evento)[0]['cuenta_contable'];
    let nombre = this.arrayBanks.filter(e => e.id_banks == evento)[0]['name_cuenta'];


    this.datos_banco_destino = cuenta+'-'+nombre;

    this.fieldsDaily[1].account = cuenta;
    this.fieldsDaily[1].name = nombre;


  }


  RegistrarValorAsientoBanco(){

    let valorAsieBanco = this.value_movimiento;
    let tipoMovimiento = this.select_mivimiento;

    if(tipoMovimiento === 'I'){
      this.fieldsDaily[0].debit = valorAsieBanco;
      this.fieldsDaily[0].credit = 0;
      this.totalVoucher.debit = valorAsieBanco;
      this.totalVoucher.credit = 0;

      this.fieldsDaily[1].debit = 0;
      this.fieldsDaily[1].credit = valorAsieBanco;
      this.totalVoucher.debit = 0;
      this.totalVoucher.credit = valorAsieBanco;
    }else{
      this.fieldsDaily[0].debit = 0;
      this.fieldsDaily[0].credit = valorAsieBanco;
      this.totalVoucher.credit = valorAsieBanco;
      this.totalVoucher.debit = 0;

      this.fieldsDaily[1].debit = valorAsieBanco;
      this.fieldsDaily[1].credit = 0;
      this.totalVoucher.credit =  0;
      this.totalVoucher.debit = valorAsieBanco;
    }

    this.debitChange();
    this.creditChange();

  }

  patchDailyVoucher(item, idx) {
    let el = document.getElementById("tabGenerate") as HTMLInputElement;
    el.checked = true;
    this.windows = 2;
  }

  refresh() {
    this.step += 1;
    this.windows = 1;
    this.getDocuments();
    this.actionsDaily = { new: false, save: true, edit: true, delete: true, print: true, cancel: true }
  }

  inputNumVal(event): boolean {
    let key = (event.which) ? event.which : event.keyCode;
    if (key > 31 && (key < 45 || key > 57)) {
      return false;
    }
    return true;
  }

  /* buttons actions */
  NewRegister() {

    if (this.permisions.agregar == "0") {
      this.toastr.info("Usuario no tiene permiso para agregar");
    } else {
      this.actionsDaily.new = true;
      this.actionsDaily.save = false;
      this.actionsDaily.print = false;
      this.actionsDaily.cancel = false;


      this.vmButtons[0].habilitar = true;
      this.vmButtons[1].habilitar = false;
      this.vmButtons[2].habilitar = false;
      this.restartFields();
    }
  }


  activeEditRegister() {
    this.actionsDaily.new = true;
    this.actionsDaily.edit = false;
  }

  CancelDaily() {
    this.actionsDaily.new = false;
    this.actionsDaily.save = true;
    this.actionsDaily.print = true;
    this.actionsDaily.cancel = true;

    this.transPropias = false;

    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = true;
    this.vmButtons[2].habilitar = true;
    this.restartFields();
  }

  SaveDaily() {


    this.dailyVoucher = [];

    if (this.permisions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else if (this.HeaderInfo.doc_id == 0 || this.HeaderInfo.secuencia == "") {
      this.toastr.info("Llene los campos en documentos");
    } else {

      this.fieldsDaily.forEach((el) => {
        if ((el.account || el.name) !== 0) {
          this.dailyVoucher.push(el);
        }
      });

      this.flag = false;
      this.contador = 0;
      this.c = 0;
      this.ccc = 0;

      if ((this.totalVoucher.debit !== this.totalVoucher.credit) && ((this.tipo_movimiento) != 'TRANSFERENCIAS_PROPIAS') || ((this.totalVoucher.debit && this.totalVoucher.credit) == 0) && ((this.tipo_movimiento) != 'TRANSFERENCIAS_PROPIAS')) {

        this.toastr.info("Existe un descuadre en el comprobanteeeee!");
        this.dailyVoucher = [];
        this.flag = true; return;

      } else if (this.dailyVoucher.length < 1) {
        this.toastr.info("Una o varias cuentas no han sido seleccionadas.");
        this.dailyVoucher = [];
        this.flag = true; return;
      } else {
        this.fieldsDaily.forEach((element,index) => {
          if ((element['debit'] > 0.00 && element['credit'] > 0.00)) {
            // this.c += 1;
            // if (this.c == 1) { this.toastr.info("Revise las columnas del debe y haber, solo una puede ser mayor a 0 en el mismo registro para el asiento contable"); }
            this.toastr.info("En la línea "+(index+1)+" revise las columnas del debe y haber, solo una puede ser mayor a 0 en el mismo registro para el asiento contable")
            this.flag = true; return;
          } else if ((element['debit'] == 0.00 || element['debit'] == "") &&
            (element['credit'] == 0.00 || element['credit'] == "")) {
            // this.c += 1;
            // if (this.c == 1) { this.toastr.info("Revise las columnas del debe y haber, ambas no pueden ser 0"); }
            this.toastr.info("En la línea "+(index+1)+" revise las columnas del debe y haber, ambas no pueden ser 0")
            this.flag = true; return;
          } else if (element['account'] == "" || element['account'] == 0) {
            // this.c += 1;
            // if (this.c == 1) { this.toastr.info("Una o varias cuentas no han sido seleccionadas") }
            this.toastr.info("En la línea "+(index+1)+" la cuenta no ha sido seleccionada")
            this.flag = true; return;
          }else if (element['codpresupuesto'] !== "" && element['codpresupuesto'] !== null && parseFloat(element['valor_presupuesto']) == 0) {
            // this.c += 1;
            // if (this.c == 1) { this.toastr.info("Si se asigna una partida presupuestaria se debe agregar el valor que afecte al presupuesto") }
            this.toastr.info("En la línea "+(index+1)+" si se asigna una partida presupuestaria se debe agregar el valor que afecte al presupuesto")
            this.flag = true; return;
          }else if ((element['codpresupuesto'] !== "" || element['codpresupuesto'] !== null) && (element['credit'] > 0 ) &&  (parseFloat(element['valor_presupuesto']) > element['credit'])) {
            // this.c += 1;
            // if (this.c == 1) { this.toastr.info("Si se asigna una partida presupuestaria se debe agregar el valor que afecte al presupuesto") }
            this.toastr.info("En la línea "+(index+1)+" el valor del presupuesto no puede ser mayor a la columna Crédito")
            this.flag = true; return;
          }else if ((element['codpresupuesto'] !== "" || element['codpresupuesto'] !== null) && (element['debit'] > 0) &&  (parseFloat(element['valor_presupuesto']) > element['debit'])) {
            // this.c += 1;
            // if (this.c == 1) { this.toastr.info("Si se asigna una partida presupuestaria se debe agregar el valor que afecte al presupuesto") }
            this.toastr.info("En la línea "+(index+1)+" el valor del presupuesto no puede ser mayor a la columna Débito")
            this.flag = true; return;
          }else if (this.tipo_movimiento == 'E'  ) {
              if( element['tipo_desembolso'] == undefined || element['tipo_desembolso'] == null || element['tipo_desembolso'] == 0){
                this.toastr.info("En la línea "+(index+1)+" debe seleccionar un tipo de desembolso")
                this.flag = true; return;
              }
          }
          else if (this.tipo_movimiento == 'I'  ) {
            if( element['tipo_ingreso'] == undefined || element['tipo_ingreso'] == null || element['tipo_ingreso'] == 0){
              this.toastr.info("En la línea "+(index+1)+" debe seleccionar un tipo de ingreso")
              this.flag = true; return;
            }
          }
          else {
            this.contador = 0;
            this.fieldsDaily.forEach(elmt => {
              if (element['account'] == elmt['account']) {
                this.contador += 1;
                if (this.contador > 1) {
                  this.ccc += 1;
                  if (this.ccc == 1) { this.toastr.info("No se pueden repetir las cuentas"); }
                  this.flag = true; return;
                }
              }
            });
          }
        });
        if (!this.flag) {
          Swal.fire({
            title: "Atención",
            text: "Seguro desea guardar la siguiente información?",
            //icon: "warning",
            showCancelButton: true,
            cancelButtonColor: '#DC3545',
            confirmButtonColor: '#13A1EA',
            confirmButtonText: "Aceptar"
          }).then((result) => {

            if (result.value) {

              let data = {
                ip: this.commonServices.getIpAddress(),
                accion: `Registro de comprobante No. ${this.HeaderInfo.secuencia}`,
                id_controlador: myVarGlobals.fComDiario,
                id_company: this.dataUser.id_empresa,
                date: moment(this.HeaderInfo.date).format('YYYY-MM-DD HH:mm:ss'),
                doc_id: this.select_mivimiento === 'E' ? 12 : 13,
                doc_num: this.HeaderInfo.secuencia,
                doc_type: this.HeaderInfo.doc_type,
                concept: this.observacion,
                note: this.HeaderInfo.note,
                details: this.dailyVoucher,
                ref_doc:this.HeaderInfo.doc_type,
                tipo_movimiento: this.select_mivimiento,
                tipo_registro : this.select_mivimiento === 'E' ? 'Egreso banco' : 'Ingreso Banco',
                total: (this.totalVoucher.debit === this.totalVoucher.credit) ? this.totalVoucher.debit : 0,
              }
              console.log(data)
              this.addVoucherDaily(data);

            }

          });
        }
      }
    }
  }

  editProcess() {
    if (this.permisions.editar == "0") {
      this.toastr.info("Usuario no tiene permiso para editar");
    } else {
      this.vouchersearch["details"].forEach((el, idx) => {
        if ((el.cont_accounts.codigo || el.cont_accounts.nombre) === "") {
          this.vouchersearch.details.splice(idx, 1);
        }
      });
      this.flag = false;
      this.contador = 0;
      this.c = 0;
      this.ccc = 0;
      if ((this.vouchersearch.debit !== this.vouchersearch.credit) && ((this.tipo_movimiento) != 'TRANSFERENCIAS_PROPIAS') || ((this.vouchersearch.debit && this.vouchersearch.credit) == 0) && ((this.tipo_movimiento) != 'TRANSFERENCIAS_PROPIAS')) {
        this.toastr.info("Existe un descuadre en el comprobante!");
        this.flag = true; return;
      } else if (this.vouchersearch["details"].length < 1) {
        this.toastr.info("Una o varis cuentas no han sido seleccionadaa.");
        this.flag = true; return;
      } else {
        this.fieldsDaily.forEach(element => {
          if ((element['debit'] > 0.00 && element['credit'] > 0.00)) {
            this.c += 1;
            if (this.c == 1) { this.toastr.info("Revise las columnas del debe y haber, solo una puede ser mayor a 0 en el mismo registro para el asiento contable"); }
            this.flag = true; return;
          } else if ((element['debit'] == 0.00 || element['debit'] == "") &&
            (element['credit'] == 0.00 || element['credit'] == "")) {
            this.c += 1;
            if (this.c == 1) { this.toastr.info("Revise las columnas del debe y haber, ambas no pueden ser 0"); }
            this.flag = true; return;
          } else if (element['account'] == "" || element['account'] == 0) {
            this.c += 1;
            if (this.c == 1) { this.toastr.info("Una o varias cuentas no han sido seleccionadas") }
            this.flag = true; return;
          } else {
            this.contador = 0;
            this.fieldsDaily.forEach(elmt => {
              if (element['account'] == elmt['account']) {
                this.contador += 1;
                if (this.contador > 1) {
                  this.ccc += 1;
                  if (this.ccc == 1) { this.toastr.info("No se pueden repetir las cuentas"); }
                  this.flag = true; return;
                }
              }
            });
          }
        });

        if (!this.flag) {
          Swal.fire({
            title: "Atención",
            text: "Seguro desea actualizar la siguiente información?",
            //icon: "warning",
            showCancelButton: true,
            cancelButtonColor: '#DC3545',
            confirmButtonColor: '#13A1EA',
            confirmButtonText: "Aceptar"
          }).then((result) => {
            if (result.value) {
              this.vouchersearch.destroy = this.dtDetails;
              this.vouchersearch.ip = this.commonServices.getIpAddress(),
                this.vouchersearch.accion = `Actualización de comprobante No. ${this.vouchersearch.secuence}`,
                this.vouchersearch.id_controlador = myVarGlobals.fComDiario,
                this.editVoucherDaily(this.vouchersearch);
              this.refresh();
            }
          });
        }
      }
    }
  }

  /*
  deletProcess() {
    if (this.permisions.eliminar == "0") {
      this.toastr.info("Usuario no tiene permiso para editar");
    } else {
      Swal.fire({
        title: "Atención",
        text: "Seguro desea eliminar la siguiente información?",
        //icon: "warning",
        showCancelButton: true,
        cancelButtonColor: '#DC3545',
        confirmButtonColor: '#13A1EA',
        confirmButtonText: "Aceptar"
      }).then((result) => {
        if (result.value) {
          this.vouchersearch.ip = this.commonServices.getIpAddress(),
            this.vouchersearch.accion = `Borrado lógico de comprobante No. ${this.vouchersearch.secuence}`,
            this.vouchersearch.id_controlador = myVarGlobals.fComDiario,
            this.diarioSrv.deleteVoucherDaily(this.vouchersearch).subscribe(res => {
              if (res["status"] == 0) {
                this.toastr.info(res["message"]);
              } else {
                this.toastr.success(res["message"]);
                this.restartFields();
                this.getDocuments();
                this.vouchersearch = {};
                this.dtDetails = [];
                this.windows = 1;
                let el = document.getElementById("tabGenerate") as HTMLInputElement;
                el.checked = true;
              }
            }, error => {
              this.toastr.info(error.error.message);
            })
        }
      });
    }
  }*/



  CargarCuentaEditar(event: any) {


    let position = localStorage.getItem('position');

    this.detAccountsChange(event, position);
    //this.onNodeSelecting(event["codigo"]);
    this.modalService.dismissAll();
  }

  detAccountsChange(evt, pos) {
    if (evt !== null) {

      this.fieldsDaily[pos].name = evt.nombre;
      this.fieldsDaily[pos].account = evt.codigo;
      this.fieldsDaily[pos].codpresupuesto = evt.codigo_presupuesto;
      this.fieldsDaily[pos].presupuesto = evt.nombre_catalogo_presupuesto

      if(evt.codigo_presupuesto=='' || evt.codigo_presupuesto==null){
        this.fieldsDaily[pos].disabled = true
      }else{
        this.fieldsDaily[pos].disabled = false
      }

    } else {
      this.fieldsDaily[pos].name = '';
      this.fieldsDaily[pos].account = '';
      this.fieldsDaily[pos].codpresupuesto = '';
      this.fieldsDaily[pos].presupuesto = '';
      this.fieldsDaily[pos].disabled = true
    }
    this.debitChange();
    this.creditChange();
  }

  detNameChange(evt, pos) {
    if (evt !== null) {
      this.secondFilter = this.NameAccounts.find(el => el.nombre === evt);
      this.fieldsDaily[pos].account = this.secondFilter.codigo;
      this.secondFilter = null;
    } else {
      this.fieldsDaily[pos].name = '';
      this.fieldsDaily[pos].account = '';
    }
    this.debitChange();
    this.creditChange();
  }

  accSearch(evt, pos) {
    if (evt !== null) {
      this.fsearch = this.accounts.find(el => el.codigo === evt);
      this.vouchersearch.details[pos].cont_accounts.nombre = this.fsearch.nombre;
      this.fsearch = null;
    } else {
      this.vouchersearch.details[pos].cont_accounts.nombre = "";
      this.vouchersearch.details[pos].cont_accounts.codigo = "";
    }
    this.debCgSearch();
    this.creCgSearch();
  }

  namSearch(evt, pos) {
    if (evt !== null) {
      this.ssearch = this.NameAccounts.find(el => el.nombre === evt);
      this.vouchersearch.details[pos].cont_accounts.codigo = this.ssearch.codigo;
      this.ssearch = null;
    } else {
      this.vouchersearch.details[pos].cont_accounts.nombre = "";
      this.vouchersearch.details[pos].cont_accounts.codigo = "";
    }
    this.debCgSearch();
    this.creCgSearch();
  }


  EventoNumberAsiento(evento, tipo){

    let codpresupuesto = this.fieldsDaily[evento].codpresupuesto;

    if(tipo === 'D'){
      this.debitChange();
      this.presupuestoChange();
      this.fieldsDaily[evento].valor_presupuesto = (codpresupuesto === null || codpresupuesto === '') ? 0.00 : parseFloat(this.fieldsDaily[evento].debit);
      this.fieldsDaily[evento].disabled = (codpresupuesto === null || codpresupuesto === '') ? true : false;
    }else{

      this.creditChange();
      this.presupuestoChange();
      this.fieldsDaily[evento].valor_presupuesto = (codpresupuesto === null || codpresupuesto === '') ? 0.00 : parseFloat(this.fieldsDaily[evento].credit);
      this.fieldsDaily[evento].disabled = (codpresupuesto === null || codpresupuesto === '') ? true : false;
    }



  }
  /* credit/debit change */
  debitChange() {
    /* let Tdebit = this.fieldsDaily.reduce((acc, el) => (typeof (el.debit !== null || el.debit !== "" || el.debit !== 0 || el.debit !== undefined) && (el.account || el.name) !== "" ? acc + el.debit : acc), 0)
    this.totalVoucher.debit = Tdebit; */

    this.totalVoucher.debit = parseFloat('0.00');
    this.fieldsDaily.forEach(element => {
      this.totalVoucher.debit = parseFloat(this.totalVoucher.debit) + parseFloat(element['debit']);
    });
  }

  creditChange() {
    /* let Tcredit = this.fieldsDaily.reduce((acc, el) => (typeof (el.credit !== null || el.credit !== "" || el.credit !== 0 || el.credit !== undefined) && (el.account || el.name) !== "" ? acc + el.credit : acc), 0)
    this.totalVoucher.credit = Tcredit; */

    this.totalVoucher.credit = parseFloat('0.00');
    this.fieldsDaily.forEach(element => {
      this.totalVoucher.credit = parseFloat(this.totalVoucher.credit) + parseFloat(element['credit']);
    });
  }

  presupuestoChange() {
    /* let Tcredit = this.fieldsDaily.reduce((acc, el) => (typeof (el.credit !== null || el.credit !== "" || el.credit !== 0 || el.credit !== undefined) && (el.account || el.name) !== "" ? acc + el.credit : acc), 0)
    this.totalVoucher.credit = Tcredit; */

    this.totalVoucher.valorPresupuesto = parseFloat('0.00');
    this.fieldsDaily.forEach(element => {
      this.totalVoucher.valorPresupuesto = parseFloat(this.totalVoucher.valorPresupuesto) + parseFloat(element['valor_presupuesto']);
    });
  }

  debCgSearch() {
    let Tdebit = this.vouchersearch.details.reduce((acc, el) => (typeof (el.valor_deb !== null || el.valor_deb !== "" || el.valor_deb !== 0 || el.valor_deb !== undefined) && (el.cuenta) !== "" ? acc + el.valor_deb : acc), 0)
    this.vouchersearch.debit = Tdebit;
  }

  creCgSearch() {
    let Tcredit = this.vouchersearch.details.reduce((acc, el) => (typeof (el.valor_cre !== null || el.valor_cre !== "" || el.valor_cre !== 0 || el.valor_cre !== undefined) && (el.cuenta) !== "" ? acc + el.valor_cre : acc), 0)
    this.vouchersearch.credit = Tcredit;
  }


  /*CONSULT NEW ASIENTO COMPLETO*/


  getMovientoCabs() {
    this.diarioSrv.getMovientoCabData().subscribe(res => {
      this.arrayCabMov = res["data"];
      this.arrayId = res["data"];
      this.getDocumentsDetails();
    }, error => {
      this.lcargando.ctlSpinner(false);
    })
  }


  /* Load componentes pantallas */

  getDocumentsDetails() {

    this.LoadOpcionTipo = true;

    this.diarioSrv.getDocumentData().subscribe(res => {
      this.arrayTipo = res["data"];
      this.LoadOpcionTipo = false;
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.LoadOpcionTipo = false;
    })

  }


  formatNumber(params) {
    this.locality = 'en-EN';
    params = parseFloat(params).toLocaleString(this.locality, {
      minimumFractionDigits: 2
    })
    params = params.replace(/[,.]/g, function (m) {
      return m === ',' ? '.' : ',';
    });
    return params;
  }

  AnularDiarios() {

    let LentSelect = this.MovimientosBancolosElement.length;
    if (LentSelect > 0) {
      Swal.fire({
        title: "Atención",
        text: "Al ejecutar el proceso se anulara los registro, los mismos no podran ser reversados. \n ¿Desea continuar?",
        //icon: "warning",
        showCancelButton: true,
        cancelButtonColor: '#DC3545',
        confirmButtonColor: '#13A1EA',
        confirmButtonText: "Aceptar"
      }).then((result) => {

        this.lcargando.ctlSpinner(true);

        if (result.value) {

          this.MovimientosBancolosElement.forEach(element => {

            let data = {
              'id_bank': element.codigo_movbank,
              'id': element.codigo_asiento,
              'fk_usuario_trans': this.dataUser.id_usuario,
              'ip': this.commonServices.getIpAddress(),
              'id_controlador': myVarGlobals.fProveeduriaCompras
            }


            this.transfServ.AnularRegistroMovBanco(data).subscribe(res => {
              this.MovimientosRegistrados();
              this.lcargando.ctlSpinner(false);
            }, error => {
              this.lcargando.ctlSpinner(false);
            })

          });

          this.lcargando.ctlSpinner(false);

        }else{
          this.lcargando.ctlSpinner(false);
        }

      });
    } else {
      this.toastr.info("Debe seleccionar el comprobante de diario que desea anular.");
    }

  }

  limpiarData() {

    this.id = 0;
    this.estado = "";
    this.tipo = 0;
    this.numero = 0;
    this.montoDesde = undefined;
    this.montoHasta = undefined;
    this.fromDatePicker = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
    this.toDatePicker = new Date();
    this.presentDt = false;

  }

  /* Modals */
  dtViewMovimiento(dt: any, numero: number) {


    if (numero === 1) {
      window.open(environment.ReportingUrl + "rpt_movimiento_banco.html?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_empresa=1&id_documento=" + dt.codigo_movbank, '_blank');
    }


    if (numero === 2) {
      window.open(environment.ReportingUrl + "rpt_movimiento_banco.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_empresa=1&id_documento=" + dt.codigo_movbank, '_blank');
    }

    if (numero === 3) {
      window.open(environment.ReportingUrl + "rpt_movimiento_banco.xlsx?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_empresa=1&id_documento=" + dt.codigo_movbank, '_blank');
    }

  }


  onRowSelect(event) {

    /*Activamos boton de anulacion */
    let LentSelect = this.MovimientosBancolosElement.length;
    if (LentSelect > 0) {
      this.vmButtons[4].habilitar = false;
    }
  }

  onRowUnselect(event) {
    /*Inactivamos boton de anulacion */
    let LentSelect = this.MovimientosBancolosElement.length;
    if (LentSelect === 0) {
      this.vmButtons[4].habilitar = true;
    }
  }


  isRowSelectable(event) {
    return !this.isOutOfStock(event.data);
  }

  isOutOfStock(data) {
    console.log(data);
    return data.isactive === 0;
  }



  onClicConsultaPlanCuentas(i) {
    //this.lcargando.ctlSpinner(true);

    let busqueda = (typeof this.fieldsDaily[i].account === 'undefined') ? "" : this.fieldsDaily[i].account;

    let consulta = {
      busqueda: this.fieldsDaily[i].account
    }

    //localStorage.setItem("total_cuetas", res["data"]);
    localStorage.setItem("busqueda_cuetas", busqueda);
    localStorage.setItem("detalle_consulta", "true");
    localStorage.setItem("position", i)



    this.ref = this.dialogService.open(CcModalTablaCuentaComponent, {
      header: 'Cuentas',
      width: '70%',
      contentStyle: { "max-height": "500px", "overflow": "auto" },
      baseZIndex: 10000
    });

    this.ref.onClose.subscribe((cuentas: any) => {

      if (cuentas) {

        //console.log(cuentas);

        this.CargarCuentaEditar(cuentas["data"]);
        //this.lcargando.ctlSpinner(false);
      }

    });


  }





  MovimientosRegistrados() {

    this.lcargando.ctlSpinner(true);

    let data = {
      id_banco : this.bankSelectConsulta,
      fecha_desde: moment(this.fromDatePicker).format('YYYYMMDD'),
      fecha_hasta: moment(this.toDatePicker).format('YYYY-MM-DD')
    }

    this.transfServ.ListaMovimientosBancos(data).subscribe(res => {

      this.detalleMovimientos = <MovimientosBancos[]>res['data'];
      this.lcargando.ctlSpinner(false);

    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);

    })

  }


  handleChange(e) {
    var index = e.index;

    this.vmButtons[0].showimg = false;

    if (index === 0) {

      this.vmButtons[0].showimg = true;
      this.vmButtons[1].showimg = true;
      this.vmButtons[2].showimg = true;
      this.vmButtons[3].showimg = false;
      this.vmButtons[4].showimg = false;

    } else {

      this.vmButtons[0].showimg = false;
      this.vmButtons[1].showimg = false;
      this.vmButtons[2].showimg = false;
      this.vmButtons[3].showimg = true;
      this.vmButtons[4].showimg = true;

    }
  }




}
