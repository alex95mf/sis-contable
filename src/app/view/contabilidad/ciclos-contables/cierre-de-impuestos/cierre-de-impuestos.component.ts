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
import flatpickr from 'flatpickr';
//import { element } from 'angular';
import { forEach } from 'jszip';
import { timingSafeEqual } from 'crypto';
import { ExcelService } from '../../../../services/excel.service';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from "sweetalert2";;
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { ViewDocumentDtComponent } from 'src/app/view/contabilidad/comprobantes/diario/view-document-dt/view-document-dt.component';
import { environment } from 'src/environments/environment';

import { CcModalTablaCuentaComponent } from 'src/app/config/custom/cc-modal-tabla-cuenta/cc-modal-tabla-cuenta.component';

import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { DiarioObjeto } from 'src/app/view/contabilidad/comprobantes/diario/diario';
import { CicloscontablesService } from '../cicloscontables.service';


@Component({
standalone: false,
  selector: 'app-cierre-de-impuestos',
  templateUrl: './cierre-de-impuestos.component.html',
  styleUrls: ['./cierre-de-impuestos.component.scss'],
  providers: [DialogService]
})
export class CierreDeImpuestosComponent {
  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild('content') templateRef: TemplateRef<any>;

  /* Datatable */
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  /*  dtOptions: any = {}; */
  dtOptions: any = {};
  dtTrigger = new Subject();

  catalogo_presupuesto: any;

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


  selectedDiarioElement: DiarioObjeto[];


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

  cierreSaldos: any = {};

  constructor(public dialogService: DialogService, private diarioSrv: DiarioService, private toastr: ToastrService, private router: Router, private zone: NgZone,
    private pCuentasService: PlanCuentasService, private commonServices: CommonService, private modalService: NgbModal, private commonVarSrvice: CommonVarService,
    private transfServ: CicloscontablesService) {

   /* this.isRowSelectable = this.isRowSelectable.bind(this);
    this.commonVarSrvice.updPerm.asObservable().subscribe(res => {
      (res) ? this.lcargando.ctlSpinner(true) : this.lcargando.ctlSpinner(false);
    })*/
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
        { orig: "btnCierreImpuesto", paramAccion: "1", boton: { icon: "fa fa-plus-square-o", texto: "NUEVO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning btn-sm", habilitar: false, imprimir: false },
        { orig: "btnCierreImpuesto", paramAccion: "1", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: true, imprimir: false },
        { orig: "btnCierreImpuesto", paramAccion: "1", boton: { icon: "fa fa-eraser", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: true, imprimir: false },

        { orig: "btnCierreImpuesto", paramAccion: "2", boton: { icon: "fa fa-search", texto: "BUSQUEDA" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false },
        { orig: "btnCierreImpuesto", paramAccion: "2", boton: { icon: "fa fa-eraser", texto: "LIMPIAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-dark btn-sm", habilitar: false, imprimir: false },
        { orig: "btnCierbtnCierreImpuestoreSald", paramAccion: "2", boton: { icon: "fa fa-trash-o", texto: "ANULAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: true, imprimir: false }

      ];



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
        codigo: myVarGlobals.fCierreImpuestos,
        id_rol: this.dataUser.id_rol
      }

      this.commonServices.getPermisionsGlobas(data).subscribe(res => {
        console.log('permisos', res)
        this.permisions = res["data"][0];

        this.permiso_ver = this.permisions.ver;

        if (this.permisions.ver == "0") {
          this.lcargando.ctlSpinner(false);
          this.toastr.info("Usuario no tiene Permiso para ver el formulario de Cierre de Impuestos");
          this.vmButtons = [];
        } else {
          this.fieldsDaily.push({ LoadOpcionCatalogoPresupuesto: false, presupuesto:'', codpresupuesto:'', centro:0, valor_presupuesto: parseFloat('0.00').toFixed(2), account: '', name: '', detail: "", credit: parseFloat('0.00').toFixed(2), debit: parseFloat('0.00').toFixed(2) }, { LoadOpcionCatalogoPresupuesto: false, presupuesto:'', codpresupuesto:'', centro:0, valor_presupuesto: parseFloat('0.00').toFixed(2), account: '', name: '', detail: "", credit: parseFloat('0.00').toFixed(2), debit: parseFloat('0.00').toFixed(2) });
          this.lcargando.ctlSpinner(false);
         // this.getDocuments();
        }
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      });
    }, 10);

  }

    metodoGlobal(evento: any) {
    switch (evento.items.paramAccion + evento.items.boton.texto) {
      case "1NUEVO":
        //this.NewRegister();
        break;
      case "1GUARDAR":
        //this.SaveDaily();
        break;
      case "1CANCELAR":
        //this.CancelDaily();
        break;

      case "2LIMPIAR":
        //this.limpiarData();
        break;
      case "2ANULAR":
        //this.AnularDiarios();
        break;
      case "2BUSQUEDA":
        //this.getDetailsMove();
        break;
    }
  }
}
