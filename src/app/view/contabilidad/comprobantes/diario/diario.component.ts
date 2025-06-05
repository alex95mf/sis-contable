import { Component, OnInit, NgZone, ViewChild, TemplateRef } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { DiarioService } from './diario.service'
import { PlanCuentasService } from '../../plan-cuentas/plan-cuentas.service'
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import * as myVarGlobals from '../../../../global';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/commonServices'
import { CommonVarService } from '../../../../services/common-var.services';
import * as moment from 'moment';
import { ExcelService } from '../../../../services/excel.service';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from "sweetalert2";;
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { ViewDocumentDtComponent } from './view-document-dt/view-document-dt.component';
import { environment } from 'src/environments/environment';

import { CcModalTablaCuentaComponent } from 'src/app/config/custom/cc-modal-tabla-cuenta/cc-modal-tabla-cuenta.component';

import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { DiarioObjeto } from './diario';
import { ModalBusquedaAuxiliarComponent } from './modal-busqueda-auxiliar/modal-busqueda-auxiliar.component';
import { CierreMesService } from 'src/app/view/contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';



@Component({
standalone: false,
  selector: 'app-diario',
  templateUrl: './diario.component.html',
  styleUrls: ['./diario.component.scss'],
  providers: [DialogService]
})
export class DiarioComponent implements OnInit {
  
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild('content') templateRef: TemplateRef<any>;

  /* Datatable */
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  /*  dtOptions: any = {}; */
  dtOptions: any = {};
  dtTrigger = new Subject();

  catalogo_presupuesto: any;
validarcentros:any;
  /* Params Component */
  windows: any = 1;
  centrosData:any;
  bitacoraAsiento:any;
  isCorrection:any;
  step: any = 0;
  fieldToEdit: any;
  isEdit:any = false;
  fieldsToDelete:any;
  permisions: any;
  firstFilter: any;
  secondFilter: any;
  dataUser: any;
  documentInformation: any;
  accounts: any;
  NameAccounts: any;
  dateNow: Date = new Date();
  fieldsDaily: Array<any> = [];
  HeaderInfo: any = { date: moment().format('YYYY-MM-DD'), doc_id: 0, doc_num: 0, doc_name: "", doc_type: "", concept: "", note: "", secuencia: "", sec_parse: "", estado: "" };
  dailyVoucher: Array<any> = [];
  totalVoucher: any = { debit: "0.00", credit: "0.00", valorPresupuesto: "0.00" };
  fromSearchVoucher: Date = new Date();
  toSearchVoucher: Date = new Date();
  dtInformation: any;
  searchParamsVoucher: any = { date_from: "", date_to: "", number_from: "", number_to: "", doc: 0, detail: "", note: "" };


  selectedDiarioElement: DiarioObjeto[] = [];


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

  /* Params search */
  vouchersearch: any = {};
  dtDetails: Array<any> = [];
  fsearch: any;
  ssearch: any;

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
  dtConsultaAsiento: DiarioObjeto[] = [];
  locality: any;
  activeIndex:any;
  id: any = 0;
  estado: any = "";
  //tipo: any = 0;
  tipo: any = '';
  numero_documento: any = '';
  numero_asiento: any = '';
  concepto: any = '';
  numero: any = 0;
  montoDesde: any;
  montoHasta: any;
  totalRegistro: any;
  viewDate: Date = new Date();
  fromDatePicker = moment().startOf('month').format('YYYY-MM-DD')
  toDatePicker = moment().format('YYYY-MM-DD');
  arrayCabMov: Array<any> = [];
  arrayTipo: Array<any> = []; /* dtConsultaAsiento  */
  arrayCab: Array<any> = [];
  arrayId: Array<any> = [];
  dtView: Array<any> = [];
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

  constructor(
    public dialogService: DialogService,
    private diarioSrv: DiarioService,
    private toastr: ToastrService,
    private router: Router,
    private zone: NgZone,
    private pCuentasService: PlanCuentasService,
    private commonServices: CommonService,
    private xlxsServices: ExcelService,
    private modalService: NgbModal,
    private commonVarSrvice: CommonVarService,
    private cierremesService: CierreMesService,
  ) {

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
      this.isCorrection = false

this.getListaCentrosCosto(1);

      this.vmButtons.forEach(element => {
        console.log(element);

        if (element.paramAccion == valor) {
          if (element.boton.texto != "ACTUALIZAR"){
          element.permiso = true; element.showimg = true;
        }
        } else {
          element.permiso = false; element.showimg = false;
        }

      });






      //console.log(this.fieldToEdit)true this.fieldToEdit  == null || this.fieldToEdit == undefined ||  ==
       if (this.fieldToEdit?.details && valor == 1 ){//
        this.vmButtons[6].showimg = true;
        this.vmButtons[1].showimg = false;
      }/*else
      {
        this.vmButtons[6].showimg = true;
        this.vmButtons[1].showimg = false;
      } */

    }, 10);


  }


  ref: DynamicDialogRef;

  ngOnInit(): void {

    this.vmButtons =
      [
        { orig: "btnsAsiento", paramAccion: "1", boton: { icon: "fa fa-plus-square-o", texto: "NUEVO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning btn-sm", habilitar: false, imprimir: false },
        { orig: "btnsAsiento", paramAccion: "1", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: true, imprimir: false },
        { orig: "btnsAsiento", paramAccion: "1", boton: { icon: "fa fa-eraser", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: true, imprimir: false },
        { orig: "btnsAsiento", paramAccion: "2", boton: { icon: "fa fa-search", texto: "BUSQUEDA" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false },
        { orig: "btnsAsiento", paramAccion: "2", boton: { icon: "fa fa-eraser", texto: "LIMPIAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-dark btn-sm", habilitar: false, imprimir: false },
        { orig: "btnsAsiento", paramAccion: "2", boton: { icon: "fa fa-trash-o", texto: "ANULAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: true, imprimir: false },
        { orig: "btnsAsiento", paramAccion: "1", boton: { icon: "fa fa-floppy-o", texto: "ACTUALIZAR" }, permiso: true, showtxt: true, showimg: false, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false }

      ];



    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.empresLogo = this.dataUser.logoEmpresa;
    // this.HeaderInfo.date = new Date(this.dateNow); //moment(this.dateNow).format('YYYY-MM-DD HH:mm:ss');

    this.dinamicoBotones({index: 0})

    setTimeout(() => {
      this.validaPermisos()
    }, 10);

  }

  validaPermisos() {
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    let data = {
      id: 2,
      codigo: myVarGlobals.fComDiario,
      id_rol: this.dataUser.id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(
      (res: any) => {
        this.permisions = res["data"][0];
        this.permiso_ver = this.permisions.abrir;
        if (this.permisions.abrir == "0") {
          this.lcargando.ctlSpinner(false);
          this.toastr.info("Usuario no tiene Permiso para ver el formulario de Comprobante Diario");
          this.vmButtons = [];
        } else {
          this.fieldsDaily.push({ LoadOpcionCatalogoPresupuesto: false, presupuesto: '', codpresupuesto: '', centro: 0, valor_presupuesto: parseFloat('0.00').toFixed(2), account: '', name: '', detail: "", credit: parseFloat('0.00').toFixed(2), debit: parseFloat('0.00').toFixed(2) }, { LoadOpcionCatalogoPresupuesto: false, presupuesto: '', codpresupuesto: '', centro: 0, valor_presupuesto: parseFloat('0.00').toFixed(2), account: '', name: '', detail: "", credit: parseFloat('0.00').toFixed(2), debit: parseFloat('0.00').toFixed(2),disabled:true, validate:false });
          this.getDocuments();
        }
      },
      (error: any) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      });
  }


  ChangeCodigoPresupuesto(event: any, dataelement, index) {
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

  AgregarConcepto() {
    // console.log('registro de pruebas');

    this.fieldsDaily.forEach(arr_term => {
      arr_term.detail = this.HeaderInfo.concept;
    });

    this.fieldToEdit.forEach(arr_term => {
      arr_term.detail = this.HeaderInfo.concept;
    });

  }

  metodoGlobal(evento: any) {
    switch (evento.items.paramAccion + evento.items.boton.texto) {
      case "1NUEVO":
        this.NewRegister();
        break;
      case "1GUARDAR":
        this.SaveDaily();
        break;
        case "1ACTUALIZAR":
          this.ediVoucherDailyNew();
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
        this.getDetailsMove();
        break;
    }
  }

  getDocuments() {

    this.vmButtons[6].showimg = false;

    let data = { company_id: this.dataUser.id_empresa, doc_type: "CDD" };
    this.diarioSrv.getCompanyInformation(data).subscribe(res => {

      //console.log(res);

      this.HeaderInfo.doc_id = res["data"].id;
      this.HeaderInfo.doc_name = res["data"].nombre;
      this.HeaderInfo.concepto = 'Concepto';
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


    //console.log(information);
    // return false;

    this.lcargando.ctlSpinner(true);
    this.diarioSrv.addVoucherDaily(information).subscribe(res => {

      if (res["status"] == 0) {

        this.toastr.info(res["message"]);
        this.dailyVoucher = [];
        this.lcargando.ctlSpinner(false);
      } else {

        this.lcargando.ctlSpinner(false);
        this.toastr.success(res["message"]);
        this.vouchersearch = {};
        this.dtDetails = [];
        this.presentDt = false;

        window.open(environment.ReportingUrl + "rpt_asiento_contable.html?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_documento=" + res["data"].id, '_blank'/*"http://154.12.249.218:9090/jasperserver/flow.html?_flowId=viewReportFlow&_flowId=viewReportFlow&ParentFolderUri=%2Freports&reportUnit=%2Freports%2Fasientos_contables&standAlone=true&j_username=jasperadmin&j_password=jasperadmin&id_document="+res["data"].id, '_blank'*/);

        this.CancelDaily();
        /*
        this.dtElement.dtInstance.then((dtInstance: any) => {
          dtInstance.destroy();
          this.restartFields();
          this.getDocuments();
        });*/

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

  ediVoucherDailyNew() {

   console.log("edit")
    this.flag = false;

    this.fieldsDaily.forEach((el, index) => {
      if (el.centro == "") {
          this.toastr.info(`En la línea ${index + 1} debe seleccionar Centro!`);
          this.flag = true;
          return;
      }
  });


    if ((this.totalVoucher.debit !== this.totalVoucher.credit) || ((this.totalVoucher.debit && this.totalVoucher.credit) == 0)) {

      this.toastr.info("Existe un descuadre en el comprobante!");
      this.dailyVoucher = [];
      this.flag = true; return;

    }



    this.fieldsDaily.forEach((element,index) => { if (
      'auxiliar' in element &&
      element['auxiliar'] !== null &&
      (element['auxiliar'] !== undefined || element['auxiliar'] !== null || element['auxiliar'] !== '') &&
      (element['auxiliar'].codigo2 == undefined || element['auxiliar'].codigo2 == null)
    ) {
    // this.c += 1
    // if (this.c == 1) { this.toastr.info("Una o varias cuentas requieren seleccionar una Cuenta Auxiliar") }
    this.toastr.info("En la línea "+ (index+1) +" la cuenta" +element['account'] + " con el nombre " + element['name'] +" no tiene auxiliar seleccionado" )
    this.flag = true; return;
  } else if (element['account'] == "" || element['account'] == 0) {
    // this.c += 1;
    // if (this.c == 1) { this.toastr.info("Una o varias cuentas no han sido seleccionadas") }
    this.toastr.info("En la línea "+ (index+1) +" la cuenta no ha sido seleccionada" )
    this.flag = true; return;
  }
});

   /*  let data = {
      ip: this.commonServices.getIpAddress(),
      accion: `Registro de comprobante No. ${this.HeaderInfo.secuencia}`,
      id_controlador: myVarGlobals.fComDiario,
      id_company: this.dataUser.id_empresa,
      date: moment(this.HeaderInfo.date).format('YYYY-MM-DD HH:mm:ss'),
      doc_id: this.HeaderInfo.doc_id,
      doc_num: this.HeaderInfo.secuencia,
      doc_type: this.HeaderInfo.doc_type,
      concept: this.HeaderInfo.concept,
      note: this.HeaderInfo.note,
      details: this.dailyVoucher,
      total: (this.totalVoucher.debit === this.totalVoucher.credit) ? this.totalVoucher.debit : 0,
    },
     */



    console.log("enviando");
    let information = this.fieldToEdit;
    information["debit"] = this.totalVoucher.debit
    information["concept"] = this.HeaderInfo.concept

    information["concepto"] = this.HeaderInfo.concept
    information["details"] = this.fieldsDaily;
    information["fieldstodelete"] = this.fieldsToDelete;
    information["id_controlador"] = myVarGlobals.fComDiario;
    information["centros"]=this.centrosData;
    information["accion"] = `Actualizacion de comprobante No. ${this.fieldToEdit.num_doc}`; //this.HeaderInfo.secuencia
    information["ip"] = this.commonServices.getIpAddress();
    if (!this.flag) {
      this.lcargando.ctlSpinner(true);
    this.diarioSrv.ediVoucherDailyNew(information).subscribe(res => {
      if (res["status"] == 0) {
        this.toastr.info(res["message"]);
        this.lcargando.ctlSpinner(false);
      } else {
        this.toastr.success(res["message"]);
      //  this.restartFields();
        //this.getDocuments();
        this.vouchersearch = {};
        this.dtDetails = [];
        this.windows = 1;
      /*   let el = document.getElementById("tabGenerate") as HTMLInputElement;
        el.checked = true; */

        this.getDataToEdit(this.fieldToEdit.id);


      }
    }, error => {
      this.toastr.info(error.error.message);
      this.lcargando.ctlSpinner(false);
    })

  }
  }



  async getListaCentrosCosto(i) {
    //ListaCentroCostos
    // try {
    //   this.centros = await this.diarioSrv.ListaCentroCostos();
    // } catch (err) {
    //   console.log(err)
    // }


    this.diarioSrv.ListaCentroCostos().subscribe(
      (resTotal) => {
console.log("centros cargados");
        this.centros = resTotal["data"];
        this.centrosData= {}

        //const result = {};

        this.centros.forEach(item => {
          this.centrosData[item.id] = item.nombre;
});
        //console.log(resTotal);

      },
      (error) => {
      }

    );
  }



  LoadListaCatalogoPresupuesto(index) {


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
    this.fieldsDaily.push({ LoadOpcionCatalogoPresupuesto: false, presupuesto: '', codpresupuesto: '', centro: 0, valor_presupuesto: parseFloat('0.00').toFixed(2), account: '', name: '', detail: this.HeaderInfo.concept, credit: parseFloat('0.00').toFixed(2), debit: parseFloat('0.00').toFixed(2),disabled:true,validate:false });
  }

  addFieldsByEdit() {
    this.vouchersearch.details.push({ cont_accounts: { codigo: "", nombre: "" }, detalle: "", valor_deb: 0.00, valor_cre: 0.00 });
  }

  deleteFields(idx) {

    const deletedField = this.fieldsDaily.splice(idx, 1);
    this.fieldsToDelete.push(deletedField[0]);
    console.log('this.fieldsToDelete',this.fieldsToDelete);
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
    this.fieldToEdit = [];
    this.isEdit = false;
this.bitacoraAsiento =[];
    this.fieldsToDelete= [];
    this.fieldsDaily = [];
    this.HeaderInfo.concept = "";
    this.HeaderInfo.note = "";
    this.totalVoucher.debit = "0.00";
    this.totalVoucher.credit = "0.00";
    this.totalVoucher.valorPresupuesto = "0.00";

    this.fieldsDaily.push({ LoadOpcionCatalogoPresupuesto: false, presupuesto: '', codpresupuesto: '', valor_presupuesto: parseFloat('0.00').toFixed(2), centro: 0, account: '', name: '', detail: "", credit: parseFloat('0.00').toFixed(2), debit: parseFloat('0.00').toFixed(2) }, { LoadOpcionCatalogoPresupuesto: false, presupuesto: '', codpresupuesto: '', valor_presupuesto: parseFloat('0.00').toFixed(2), centro: 0, account: '', name: '', detail: "", credit: parseFloat('0.00').toFixed(2), debit: parseFloat('0.00').toFixed(2),disabled:true,validate:false });
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


  getDataToEdit(x){
    console.log("xxxxxxxxx",x);
    this.lcargando.ctlSpinner(true);
    this.actionsDaily.new = true;
    this.actionsDaily.save = false;
    this.actionsDaily.print = false;
    this.actionsDaily.cancel = false;
    this.vmButtons[0].habilitar = true;
    //this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = false;

    this.vmButtons[1].showimg = false;
    console.log("x",x);
    this.restartFields();
    let data = {
      id:x,
    }
    //  this.fieldsDaily;
    this.isEdit = true;
    this.diarioSrv.searchMovientoById(data).subscribe(
      (res: any) => {
        console.log("res de prueba",res);
        //this.lcargando.ctlSpinner(false);
        this.fieldToEdit = res['data'];
        this.fieldsDaily = res['data']['details'];
        this.fieldsDaily = this.fieldsDaily.map((element, index) => {
          // Crear un nuevo objeto que sea una copia del elemento actual
          // y agregarle el campo "arraynumber" con el valor del índice
          return {
              ...element,
              arraynumber: index +1
          };
      });
      this.fieldToEdit.details = this.fieldsDaily;

        this.bitacoraAsiento = res['data']['bitacora'];
        this.HeaderInfo.concept = res['data']['concepto'];
       /*  this.HeaderInfo.secuencia = res['data']['secuencialdoc']; */
       /* if ('data' in res && 'secuencialdoc' in res['data']) {
        this.HeaderInfo.secuencia = res['data']['secuencialdoc'];
    } */
        this.debitChange();
        this.creditChange();
        this.presupuestoChange();
        this.lcargando.ctlSpinner(false);
        this.activeIndex = 0;
        this.vmButtons[6].showimg = true;
        this.vmButtons[0].habilitar = true;
        this.vmButtons[1].showimg = false;


    this.dinamicoBotones({index: 0})
    this.vmButtons[1].showimg = false;

      },
      (error: any) => {
        this.lcargando.ctlSpinner(false);
      });

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



/*

this.getDataToEdit(); */

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

    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = true;
    this.vmButtons[2].habilitar = true;

    this.vmButtons[6].showimg = false;
    //this.vmButtons[0].habilitar = false;
    this.vmButtons[1].showimg = true;
    this.getDocuments();
    this.restartFields();
  }



  SaveDaily() {

    this.validarcentros = true; this.dailyVoucher = [];

    if (this.permisions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else if (this.HeaderInfo.doc_id == 0 || this.HeaderInfo.secuencia == "") {
      this.toastr.info("Llene los campos en documentos");
    } else if (this.HeaderInfo.concept == '' || this.HeaderInfo.concept == null || this.HeaderInfo.concept == undefined) {
      this.toastr.info("Debe ingresar un concepto");
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

      this.fieldsDaily.forEach((el, index) => {
        if (el.centro == "") {
            this.toastr.info(`En la línea ${index + 1} debe seleccionar Centro!`);
            this.flag = true;
            return;
        }
      });


      if (this.totalVoucher.debit !== this.totalVoucher.credit ) {

        this.toastr.info("Existe un descuadre en el comprobante!");
        this.dailyVoucher = [];
        this.flag = true; return;

      } else if ((this.totalVoucher.debit && this.totalVoucher.credit) == 0 && !this.isCorrection) {
        this.toastr.info("Existe un descuadre en el comprobante!");
        this.dailyVoucher = [];
        this.flag = true; return;
      } else if (this.dailyVoucher.length < 1) {
        this.toastr.info("Una o varias cuentas no han sido seleccionadas.");
        this.dailyVoucher = [];
        this.flag = true; return;
      } else {

        this.fieldsDaily.forEach((element,index) => {

          if ((element['debit'] > 0.00 && element['credit'] > 0.00)) {
            //this.c += 1;
            //if (this.c == 1) { this.toastr.info("Revise las columnas del debe y haber, solo una puede ser mayor a 0 en el mismo registro para el asiento contable"); }
            this.toastr.info("En la línea "+ (index+1) +" revise las columnas del debe y haber, solo una puede ser mayor a 0 en el mismo registro para el asiento contable" )
            this.flag = true; return;
          } else if ((element['debit'] == 0.00 || element['debit'] == "") &&
            (element['credit'] == 0.00 || element['credit'] == "")) {
            // this.c += 1;
            // if (this.c == 1) { this.toastr.info("Revise las columnas del debe y haber, ambas no pueden ser 0"); }
            this.toastr.info("En la línea "+ (index+1) +" revise las columnas del debe o haber, ingrese un valor mayor a 0" )
            this.flag = true; return;
          } else if (!this.isCorrection && (element['debit'] < 0)){
            this.toastr.info("En la línea "+ (index+1) +" el valor debito no puede ser negativo" )
            this.flag = true; return;
          } else if (!this.isCorrection && (element['credit'] < 0)){
            this.toastr.info("En la línea "+ (index+1) +" el valor credito no puede ser negativo" )
            this.flag = true; return;
          } else if (element['account'] == "" || element['account'] == 0) {
            // this.c += 1;
            // if (this.c == 1) { this.toastr.info("Una o varias cuentas no han sido seleccionadas") }
            this.toastr.info("En la línea "+ (index+1) +" la cuenta no ha sido seleccionada" )
            this.flag = true; return;
          } else if (element['codpresupuesto'] !== "" && element['codpresupuesto'] !== null && parseFloat(element['valor_presupuesto']) == 0) {
            this.c += 1;
            if (this.c == 1) { this.toastr.info("Si se asigna una partida presupuestaria se debe agregar el valor que afecte al presupuesto") }
            this.flag = true; return;
          }else if(element['detail'] == "" || element['detail'] == null){
            this.toastr.info("En la línea "+ (index+1) +" debe ingresar un detalle" )
            this.flag = true; return;
          } else if (
                'auxiliar' in element &&
                (element['auxiliar'] !== undefined || element['auxiliar'] !== null || element['auxiliar'] !== '') &&
                (element['auxiliar'].codigo2 == undefined || element['auxiliar'].codigo2 == null)
              ) {
              // this.c += 1
              // if (this.c == 1) { this.toastr.info("Una o varias cuentas requieren seleccionar una Cuenta Auxiliar") }
              this.toastr.info("En la línea "+ (index+1) +" la cuenta" +element['account'] + " con el nombre " + element['name'] +" no tiene auxiliar seleccionado" )
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
            text: "Seguro desea guardar la siguiente información?",
            //icon: "warning",
            showCancelButton: true,
            cancelButtonColor: '#DC3545',
            confirmButtonColor: '#13A1EA',
            confirmButtonText: "Aceptar"
          }).then((result) => {

              if (result.value) {
                this.lcargando.ctlSpinner(true);
                let datos = {
                  "anio": Number(moment(this.HeaderInfo.date).format('YYYY')),
                  "mes": Number(moment(this.HeaderInfo.date).format('MM')),
                }
                  this.cierremesService.obtenerCierresPeriodoPorMes(datos).subscribe(res => {

                  /* Validamos si el periodo se encuentra aperturado */
                    if (res["data"][0].estado !== 'C') {

                      let data = {
                        ip: this.commonServices.getIpAddress(),
                        accion: `Registro de comprobante No. ${this.HeaderInfo.secuencia}`,
                        id_controlador: myVarGlobals.fComDiario,
                        id_company: this.dataUser.id_empresa,
                        date: moment(this.HeaderInfo.date).format('YYYY-MM-DD HH:mm:ss'),
                        doc_id: this.HeaderInfo.doc_id,
                        doc_num: this.HeaderInfo.secuencia,
                        doc_type: this.HeaderInfo.doc_type,
                        concept: this.HeaderInfo.concept,
                        note: this.HeaderInfo.note,
                        details: this.dailyVoucher,
                        total: (this.totalVoucher.debit === this.totalVoucher.credit) ? this.totalVoucher.debit : 0,
                      }

                      this.addVoucherDaily(data);

                    } else {
                      this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
                      this.lcargando.ctlSpinner(false);
                    }

                  }, error => {
                      this.lcargando.ctlSpinner(false);
                      this.toastr.info(error.error.mesagge);
                  })
              }
          });
        }
      }
    }
  }

  editProcess() {
    this.isCorrection = false;
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
      if (this.vouchersearch.debit !== this.vouchersearch.credit ) {
        this.toastr.info("Existe un descuadre en el comprobante!");
        this.flag = true; return;
      } else if ((this.vouchersearch.debit && this.vouchersearch.credit ) == 0 && !this.isCorrection ) {
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
  }



  CargarCuentaEditar(account: any) {


    let position = localStorage.getItem('position');

    this.detAccountsChange(account, position);
    //this.onNodeSelecting(event["codigo"]);
    this.modalService.dismissAll();
  }

  detAccountsChange(evt, pos) {
    console.log(evt)
    if (evt !== null) {

      this.fieldsDaily[pos].name = evt.nombre;
      this.fieldsDaily[pos].account = evt.codigo;
      this.fieldsDaily[pos].codpresupuesto = evt.codigo_presupuesto;

      if(evt.codigo_presupuesto ==null){
        this.fieldsDaily[pos].disabled  = true
      }else{
        this.fieldsDaily[pos].disabled  = false
        this.fieldsDaily[pos].valor_presupuesto= parseFloat(this.fieldsDaily[pos].debit)+parseFloat(this.fieldsDaily[pos].credit)
        this.presupuestoChange();/*  this.creditChange() ; */
      }

      this.fieldsDaily[pos].presupuesto = evt.presupuesto?.nombre;
      this.fieldsDaily[pos].grupo = evt.grupo;//nombre_catalogo_presupuesto
      if (evt.cod_ref_auxiliar) {
        this.fieldsDaily[pos].auxiliar = {codigo: evt.cod_ref_auxiliar, nombre: evt.desc_ref_auxiliar}
    /*     this.fieldsDaily[pos].auxiliar.codigo */
      }

    } else {
      this.fieldsDaily[pos].name = '';
      this.fieldsDaily[pos].account = '';
      this.fieldsDaily[pos].codpresupuesto = '';
      this.fieldsDaily[pos].presupuesto = '';
      this.fieldsDaily[pos].auxiliar = null
      this.fieldsDaily[pos].disabled  = true
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


  EventoNumberAsiento(evento, tipo) {

    let codpresupuesto = this.fieldsDaily[evento].codpresupuesto;
console.log(evento);
console.log(tipo);
    if (tipo === 'D') {

      this.fieldsDaily[evento].credit=0;
      this.fieldsDaily[evento].valor_presupuesto = (codpresupuesto === null || codpresupuesto === '') ? 0.00 : parseFloat(this.fieldsDaily[evento].debit);
      this.debitChange();
      this.presupuestoChange();

    } else {


      this.fieldsDaily[evento].debit=0;
      this.fieldsDaily[evento].valor_presupuesto = (codpresupuesto === null || codpresupuesto === '') ? 0.00 : parseFloat(this.fieldsDaily[evento].credit);
      this.creditChange();
      this.presupuestoChange();
    }



  }
  /* credit/debit change */
  debitChange() {
    /* let Tdebit = this.fieldsDaily.reduce((acc, el) => (typeof (el.debit !== null || el.debit !== "" || el.debit !== 0 || el.debit !== undefined) && (el.account || el.name) !== "" ? acc + el.debit : acc), 0)
    this.totalVoucher.debit = Tdebit; */

    console.log("change debit")
    this.totalVoucher.debit = parseFloat('0.00');
    this.totalVoucher.credit= parseFloat('0.00');
    this.fieldsDaily.forEach(element => {
      this.totalVoucher.debit = parseFloat(this.totalVoucher.debit) + parseFloat(element['debit']);
    });
    this.fieldsDaily.forEach(element => {
      this.totalVoucher.credit = parseFloat(this.totalVoucher.credit) + parseFloat(element['credit']);
    });
  }

  creditChange() {
    console.log("change credit")
    /* let Tcredit = this.fieldsDaily.reduce((acc, el) => (typeof (el.credit !== null || el.credit !== "" || el.credit !== 0 || el.credit !== undefined) && (el.account || el.name) !== "" ? acc + el.credit : acc), 0)
    this.totalVoucher.credit = Tcredit; */
    this.totalVoucher.debit = parseFloat('0.00');
    this.totalVoucher.credit = parseFloat('0.00');
    this.fieldsDaily.forEach(element => {
      this.totalVoucher.debit = parseFloat(this.totalVoucher.debit) + parseFloat(element['debit']);
    });
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

  /*
  filterId(data) {

    if (data != 0) {
      this.id = data;
      this.presentDt = false;
      this.dtElement.dtInstance.then((dtInstance: any) => {
        dtInstance.destroy();
        this.getDetailsMove();
      });
    } else {
      this.limpiarData();
    }
  }


  filterTipo(data) {

    if (data != 0) {

      let filt = this.arrayCabMov.filter((e) => e.fk_tip_doc == data);
      this.arrayCab = filt;
      this.tipo = data;
      this.presentDt = false;
      this.dtElement.dtInstance.then((dtInstance: any) => {
        dtInstance.destroy();
        this.getDetailsMove();
      });

    } else {
      this.limpiarData();
    }

  }


  filterNumero(data) {
    if (data != 0) {
      this.numero = data;
      this.presentDt = false;
      this.dtElement.dtInstance.then((dtInstance: any) => {
        dtInstance.destroy();
        this.getDetailsMove();
      });
    } else {
      this.limpiarData();
    }
  }*/
  /*
    filterEstado(data) {
      if (data != "") {
        this.estado = data;
        this.presentDt = false;
        this.dtElement.dtInstance.then((dtInstance: any) => {
          dtInstance.destroy();
          this.getDetailsMove();
        });
      } else {
        this.limpiarData();
      }
    }

    Desdemonto(data) {
      let parse = data.target.value;
      if (parse != undefined) {

        this.presentDt = false;
        this.dtElement.dtInstance.then((dtInstance: any) => {
          dtInstance.destroy();
          this.getDetailsMove();
        });
      } else {
        this.limpiarData();
      }
    }


    Hastamonto(data) {
      let parse = data.target.value;
      if (parse != undefined) {

        this.presentDt = false;
        this.dtElement.dtInstance.then((dtInstance: any) => {
          dtInstance.destroy();
          this.getDetailsMove();
        });
      } else {
        this.limpiarData();
      }
    }


    FromOrToChange() {
      this.presentDt = false;
        this.dtElement.dtInstance.then((dtInstance: any) => {
          dtInstance.destroy();
          this.getDetailsMove();
        });
    }*/

  getDetailsMove() {
    this.selectedDiarioElement = []

    this.lcargando.ctlSpinner(true);

    /*
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      search: true,
      paging: true,
      order: [[0, "desc"]],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };*/

    let data = {
      dateFrom: this.fromDatePicker /* moment(this.fromDatePicker).format('YYYY-MM-DD') */,
      dateTo: this.toDatePicker /* moment(this.toDatePicker).format('YYYY-MM-DD') */,
      id: this.id == 0 ? null : this.id,
      estado: this.estado == "" ? null : this.estado,
      tipo: this.tipo == 0 ? null : this.tipo,
      numero_documento: this.numero_documento == 0 ? null : this.numero_documento,
      numero_asiento: this.numero_asiento == 0 ? null : this.numero_asiento,
      concepto: this.concepto == 0 ? null : this.concepto,
      numero: this.numero == 0 ? null : this.numero,
      montoDesde: this.montoDesde == undefined ? null : this.montoDesde,
      montoHasta: this.montoHasta == undefined ? null : this.montoHasta,
    }


    this.diarioSrv.searchMovientoCabezera(data).subscribe(
      (res: any) => {
        console.log("res de prueba",res);
        this.lcargando.ctlSpinner(false);
        this.presentDt = true;
        this.dtConsultaAsiento = <DiarioObjeto[]>res['data'];
        this.dtConsultaAsiento.map((asiento: DiarioObjeto) => Object.assign(asiento, { check: false }))
        this.totalRegistro = this.dtConsultaAsiento.length;
      },
      (error: any) => {
        this.lcargando.ctlSpinner(false);
        this.presentDt = true;
        this.dtConsultaAsiento = [];
        this.totalRegistro = this.dtConsultaAsiento.length;
        // setTimeout(() => {
        //   this.dtTrigger.next(null);
        // }, 50);
        this.toastr.info(error.error.message);
      });

  }

  AnularDiarios() {

    let LentSelect = this.selectedDiarioElement.length;
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

        // this.lcargando.ctlSpinner(true);

        if (result.isConfirmed) {

          this.selectedDiarioElement.forEach(element => {

            this.lcargando.ctlSpinner(true);

            let data = {
              'id': element.id,
              'fk_usuario_trans': this.dataUser.id_usuario,
              'ip': this.commonServices.getIpAddress(),
              'id_controlador': myVarGlobals.fProveeduriaCompras
            }


            this.diarioSrv.getAsientoByID(data).subscribe(
              (res: any) => {

                let asientoReversar = res["data"][0];

                asientoReversar["nota"] = "Asiento de reversa asociado al asiento #" + asientoReversar["num_doc"]



                asientoReversar["voucher_daily_details"].forEach(details => {

                  let cred = details["valor_cre"];
                  let deb = details["valor_deb"];

                  details["credit"] = deb;
                  details["debit"] = cred;

                  details["account"] = details["cuenta"];
                  details["detail"] = details["detalle"];
                  details["detail"] = details["detalle"];
                  details["centro"] = details["fk_centro_costo"];


                  details["codpresupuesto"] = details["codigo_partida"];
                  details["presupuesto"] = details["partida_presupuestaria"];
                  details["valor_presupuesto"] = details["valor_partida"];

                });

                /*obetenemos secuencia y datos del tipo comprobante */

                let dataDocument = { company_id: this.dataUser.id_empresa, doc_type: "CDD" };
                this.diarioSrv.getCompanyInformation(dataDocument).subscribe(
                  (resDocument) => {


                    let dataAsientoSave = {
                      ip: this.commonServices.getIpAddress(),
                      accion: `Registro de comprobante No. ${resDocument["data"].secuencia}`,
                      id_controlador: myVarGlobals.fComDiario,
                      id_company: this.dataUser.id_empresa,
                      date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                      doc_id: resDocument["data"].id,
                      doc_num: resDocument["data"].secuencia,
                      doc_type: resDocument["data"].codigo,
                      concept: asientoReversar["nota"],
                      note: asientoReversar["nota"],
                      details: asientoReversar["voucher_daily_details"],
                      total: asientoReversar["valor"],
                      tipo_registro: "Diario"
                    }

                    this.RegistraAsientoReversa(dataAsientoSave, element.id);

                  },
                  (error: any) => {
                    console.log(error)
                    this.lcargando.ctlSpinner(false);
                    this.toastr.info(error.error.message);
                  })

              },
              (error: any) => {
                console.log(error)
                this.lcargando.ctlSpinner(false);
              })

          });

          this.lcargando.ctlSpinner(false);

        }

      });
    } else {
      this.toastr.info("Debe seleccionar el comprobante de diario que desea anular.");
    }

  }




  RegistraAsientoReversa(information, id) {



    this.diarioSrv.addVoucherDaily(information).subscribe(
      (res) => {

        if (res["status"] == 0) {

          this.toastr.info(res["message"]);
          this.dailyVoucher = [];

        } else {

          this.lcargando.ctlSpinner(false);
          this.toastr.success(res["message"]);
          this.vouchersearch = {};
          this.dtDetails = [];
          this.presentDt = false;

          let data = {
            'id': id,
            'fk_usuario_trans': this.dataUser.id_usuario,
            'ip': this.commonServices.getIpAddress(),
            'id_controlador': myVarGlobals.fProveeduriaCompras,
            'evento': 'R'
          }

          this.diarioSrv.AnularRegistroDiarios(data).subscribe(res => {
            this.getDetailsMove();
          }, error => {
            this.lcargando.ctlSpinner(false);
          })
        }
      },
      (error) => {
        this.toastr.info(error.error.message);
        this.lcargando.ctlSpinner(false);
      }
    )
  }


  limpiarData() {

    this.id = 0;
    this.estado = "";
    this.tipo = "";
    this.numero_documento = "";
    this.numero_asiento = "";
    this.concepto = "";
    this.numero = 0;
    this.montoDesde = undefined;
    this.montoHasta = undefined;
    this.fromDatePicker = moment().startOf('month').format('YYYY-MM-DD');
    this.toDatePicker = moment().format('YYYY-MM-DD');
    this.presentDt = false;

    this.getDetailsMove();

    /*this.dtElement.dtInstance.then((dtInstance: any) => {
      dtInstance.destroy();

    });*/

  }

  /* Modals */
  dtViewAsiento(dt: any, numero: number) {


    if (numero === 1) {
      //window.open("http://154.12.249.218:9090/jasperserver/flow.html?_flowId=viewReportFlow&_flowId=viewReportFlow&ParentFolderUri=%2Freports&reportUnit=%2Freports%2Fasientos_contables&standAlone=true&j_username=jasperadmin&j_password=jasperadmin&id_document="+dt.id, '_blank');
      window.open(environment.ReportingUrl + "rpt_asiento_contable.html?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_documento=" + dt.id, '_blank')
    }

    if (numero === 2) {
      window.open(environment.ReportingUrl + "rpt_asiento_contable.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_documento=" + dt.id, '_blank')
    }

    if (numero === 3) {
      window.open(environment.ReportingUrl + "rpt_asiento_contable.xlsx?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_documento=" + dt.id, '_blank')
    }

    /*
    const modalInvoice = this.modalService.open(ViewDocumentDtComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' });
    modalInvoice.componentInstance.dt = dt;

    */

  }


  onRowSelect(event, asiento: DiarioObjeto) {

    if (event.target.checked) {
      // Agregar asiento a lista de seleccionados
      Object.assign(asiento, { check: true })
      this.selectedDiarioElement.push(asiento)
    } else {
      // Remover asiento de lista de seleccionados
      Object.assign(asiento, { check: false })
      this.selectedDiarioElement.splice(this.selectedDiarioElement.findIndex((elem: DiarioObjeto) => { elem.id == asiento.id }), 1);
    }

    /*Activamos boton de anulacion */
    let LentSelect = this.selectedDiarioElement.length;
    if (LentSelect > 0) {
      this.vmButtons[5].habilitar = false;
    } else {
      this.vmButtons[5].habilitar = true;
    }
  }

  onRowUnselect(event) {
    /*Inactivamos boton de anulacion */
    let LentSelect = this.selectedDiarioElement.length;
    if (LentSelect === 0) {
      this.vmButtons[5].habilitar = true;
    }
  }


  isRowSelectable(event) {
    return !this.isOutOfStock(event.data);
  }

  isOutOfStock(data) {
    console.log(data);
    return data.estado == 0 && data.estado == 3;
  }

  /*
  selectAll() {
    this.masterIndeterminate = false
    // this.data.map((e) => e.check = this.masterSelected)
    this.liquidacionesDt.map((e: any) => e.check = this.masterSelected)
  }

  partialSelect() {
    const someSelected = this.liquidacionesDt.reduce((acc, curr) => acc | curr.check, 0)
    const allSelected = this.liquidacionesDt.reduce((acc, curr) => acc & curr.check, 1)

    this.masterIndeterminate = !!(someSelected && !allSelected)
    this.masterSelected = !!allSelected
  }
   */

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

        console.log(cuentas);

        this.CargarCuentaEditar(cuentas["data"]);
        this.lcargando.ctlSpinner(false);
      }

    });


    /*

    this.pCuentasService.obtenePlanCuentaGeneralTotal(consulta).subscribe(res => {

      localStorage.setItem("total_cuetas", res["data"]);
      localStorage.setItem("busqueda_cuetas", busqueda);
      localStorage.setItem("detalle_consulta", "true");
      localStorage.setItem("position", i)


      this.modalService.open(this.templateRef,
        {
          backdropClass: 'light-blue-backdrop',
          size: 'lg',
          centered: true
        }
      );

      this.lcargando.ctlSpinner(false);

    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.mesagge);
    })

    */


  }

  onClicConsultaAuxiliar(i: number) {
    this.ref = this.dialogService.open(ModalBusquedaAuxiliarComponent, {
      header: 'Cuentas Auxiliares',
      width: '70%',
      contentStyle: { "max-height": "500px", "overflow": "auto" },
      baseZIndex: 10000,
      data: {
        cod: this.fieldsDaily[i].auxiliar.codigo
      }
    })

    this.ref.onClose.subscribe(({data}) => {
      Object.assign(this.fieldsDaily[i].auxiliar, { codigo2: data.cod_auxiliar, nombre2: data.descripcion, label: `${data.codref}. ${data.descripcion}` })
    })
  }

}
