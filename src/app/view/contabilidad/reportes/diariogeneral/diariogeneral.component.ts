import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import * as myVarGlobals from '../../../../global';
import { CommonService } from 'src/app/services/commonServices';
import { ToastrService } from 'ngx-toastr';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogService } from 'primeng/dynamicdialog';
import { DiarioGeneralService } from './diariogeneral.service';

import moment from "moment";
import { environment } from 'src/environments/environment';
import { IAuxuliar, IOption, IPaginate } from '../../auxiliares/IAuxiliares';

import Swal from "sweetalert2";;
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CcModalTablaCuentaComponent } from 'src/app/config/custom/cc-modal-tabla-cuenta/cc-modal-tabla-cuenta.component';
import { XlsExportService } from 'src/app/services/xls-export.service';

@Component({
standalone: false,
  selector: 'app-diariogeneral',
  templateUrl: './diariogeneral.component.html',
  styleUrls: ['./diariogeneral.component.scss'],
  providers: [DialogService]
})
export class DiariogeneralComponent implements OnInit {



  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild('content') templateRef: TemplateRef<any>;


  vmButtons: any = [];
  idBotones: any = "";
  dtConsultaAsiento: any[] = [];
  dtConsultaAsientoAuxiliar: any[] = [];
  cmb_auxiliar_referencia: Array<IOption>;

  dataUser: any;
  permisions: any;
  permiso_ver: any = "0";
  codigo: any = '';
  nombre: any = '';

  codigo_hasta: any = '';
  nombre_hasta: any = '';
  centros: any;
  centrocosto: any = 0;
  auxiliar: any;
  LoadOpcionCentro: boolean = false;
  auxSelected: boolean = true;
  totalDebe = 0;
  totalHaber = 0;
  totalPartida = 0;

  // viewDate: Date = new Date();

  fromDatePicker = moment().startOf('month').format('YYYY-MM-DD');
  toDatePicker = moment().format('YYYY-MM-DD');

  constructor(
    private commonServices: CommonService,
    private toastr: ToastrService,
    public dialogService: DialogService,
    private dGeneralService: DiarioGeneralService,
    private xlsService: XlsExportService,
  ) {

  }


  ref: DynamicDialogRef;

  ngOnInit(): void {


    this.vmButtons =
      [
        { orig: "btnsAsiento", paramAccion: "2", boton: { icon: "fa fa-search", texto: "CONSULTAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info btn-sm", habilitar: false, imprimir: false },
        { orig: "btnsAsiento", paramAccion: "2", boton: { icon: "fa fa-search", texto: "CONSULTAR AUXILIAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info btn-sm", habilitar: false, imprimir: false },
        { orig: "btnsAsiento", paramAccion: "2", boton: { icon: "fa fa-file-pdf-o", texto: "PDF" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false },
        { orig: "btnsAsiento", paramAccion: "2", boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false }

      ];


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

    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res["data"][0];

      this.permiso_ver = this.permisions.abrir;

      if (this.permisions.abrir == "0") {
        this.lcargando.ctlSpinner(false);
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de Comprobante Diario");
        this.vmButtons = [];
      } else {
        this.cargaInicial()
        this.lcargando.ctlSpinner(false);

      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  async cargaInicial() {
    this.lcargando.ctlSpinner(true);
    try {

      let response = await this.dGeneralService.getCatalogos({params: "'CON_TIPO_AUXILIARES','CON_CATALOGO_AUXILIARES'"});
      this.cmb_auxiliar_referencia = response['CON_CATALOGO_AUXILIARES'].map((item: any) => Object.assign(item, { label: `${item.valor}. ${item.descripcion}`}))

      this.lcargando.ctlSpinner(false)

    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error en Carga Inicial')
    }
  }


  onClicConsultaPlanCuentas(i) {

    //this.lcargando.ctlSpinner(true);

    let busqueda = (typeof this.codigo === 'undefined') ? "" : this.codigo;

    let consulta = {
      busqueda: this.codigo
    }


    this.ref = this.dialogService.open(CcModalTablaCuentaComponent, {
      header: 'Cuentas',
      width: '70%',
      contentStyle: { "max-height": "500px", "overflow": "auto" },
      baseZIndex: 10000
    });

    this.ref.onClose.subscribe((cuentas: any) => {

      if (cuentas) {

        this.CargarCuentaEditar(cuentas["data"]);
        //this.lcargando.ctlSpinner(false);

      }

    });

  }


  onClicConsultaPlanCuentasHasta(i) {

    if (this.codigo === '') {

      this.toastr.info("Debe seleccionar filtro de la cuenta desde donde se desea consultar el mayor.");

    } else {

      this.lcargando.ctlSpinner(true);

      let busqueda = (typeof this.codigo === 'undefined') ? "" : this.codigo;

      let consulta = {
        busqueda: this.codigo
      }


      this.ref = this.dialogService.open(CcModalTablaCuentaComponent, {
        header: 'Cuentas',
        width: '70%',
        contentStyle: { "max-height": "500px", "overflow": "auto" },
        baseZIndex: 10000
      });

      this.ref.onClose.subscribe((cuentas: any) => {

        if (cuentas) {

          this.CargarCuentaEditarHasta(cuentas["data"]);
          this.lcargando.ctlSpinner(false);

        }

      });
    }

  }


  CargarCuentaEditar(event: any) {

    this.codigo = event.codigo;
    this.nombre = event.nombre;

  }


  CargarCuentaEditarHasta(event: any) {

    this.codigo_hasta = event.codigo;
    this.nombre_hasta = event.nombre;

  }


  getCentroDetalle(i) {

    this.LoadOpcionCentro = true;

    this.dGeneralService.ListaCentroCostos().subscribe(
      (resTotal) => {

        this.centros = resTotal["data"];
        this.LoadOpcionCentro = false;

      },
      (error) => {
        this.LoadOpcionCentro = false;
      }

    );

  }

  // auxiliarSelected(event){
  //   this.dtConsultaAsientoAuxiliar = []
  //   this.totalDebe = 0;
  //   this.totalHaber = 0;
  //   this.totalPartida = 0;
  //   if(event){
  //     this.auxSelected= false
  //   }else{
  //     this.auxSelected= true
  //   }
  // }

  calcularTotalDebe(descripcion_cuenta){

    let debe = 0
    this.dtConsultaAsientoAuxiliar.forEach(e => {
      if(e.descripcion_cuenta == descripcion_cuenta){
        let valorDebe100 = +e.debito * 100;
        debe += +valorDebe100;
      }
    });
    this.totalDebe = +debe / 100;
    return this.totalDebe;
  }

  calcularTotalHaber(descripcion_cuenta){

    let haber = 0
    this.dtConsultaAsientoAuxiliar.forEach(e => {
      if(e.descripcion_cuenta == descripcion_cuenta){
        let valorHaber100 = +e.credito * 100;
        haber += +valorHaber100;
      }
    });

    this.totalHaber = +haber / 100;
    return this.totalHaber;

  }
  calcularTotalPartida(descripcion_cuenta){

    let partida = 0
    this.dtConsultaAsientoAuxiliar.forEach(e => {
      if(e.descripcion_cuenta == descripcion_cuenta){
        let valorPartida100 = +e.valor_partida * 100;
        partida += +valorPartida100;
      }
    });

    this.totalPartida = +partida / 100;
    return this.totalPartida;

  }




  CargarLibroDiario() {
    this.auxSelected= true
    this.dtConsultaAsiento= [];
    let desde = moment(this.fromDatePicker).format('YYYYMMDD');
    let hasta = moment(this.toDatePicker).format('YYYYMMDD');
    let cuenta = this.codigo;
    let cuenta_hasta = this.codigo_hasta;
    let centro = this.centrocosto;

    this.lcargando.ctlSpinner(true);

    if (cuenta !== '') {
      this.dGeneralService.getLibroDiario(desde, hasta, cuenta, cuenta_hasta, centro).subscribe(
        (res: any) => {
          console.log(res);
          this.lcargando.ctlSpinner(false);
          this.dtConsultaAsiento = res.data;
        },
        (error: any) => {
          console.log(error)
          this.lcargando.ctlSpinner(false);
        }
      )

    } else {
      this.dGeneralService.getLibroDiarioSin(desde, hasta, centro).subscribe(
        (res: any) => {
          console.log(res);
          this.lcargando.ctlSpinner(false);
          this.dtConsultaAsiento = res.data;
        },
        (error: any) => {
          console.log(error)
          this.lcargando.ctlSpinner(false);
          this.toastr.error(error.error.message, 'Error cargando Registros')
        }
      )
    }



  }

  CargarLibroDiarioAuxiliar() {

    this.auxSelected= false
    this.dtConsultaAsientoAuxiliar= [];
    let desde = moment(this.fromDatePicker).format('YYYYMMDD');
    let hasta = moment(this.toDatePicker).format('YYYYMMDD');
    let cuenta = this.codigo;
    let cuenta_hasta = this.codigo_hasta;
    let centro = this.centrocosto;

    let auxiliar: any
    if(this.auxiliar==undefined || this.auxiliar==''){
      auxiliar= 0
    }else{
      auxiliar = this.auxiliar;
    }


    this.lcargando.ctlSpinner(true);

    if (cuenta !== '') {
      this.dGeneralService.getLibroDiarioAuxiliar(desde, hasta, cuenta, cuenta_hasta, centro, auxiliar).subscribe(
        (res: any) => {
          console.log(res);
          this.lcargando.ctlSpinner(false);
          this.dtConsultaAsientoAuxiliar = res.data;

        },
        (error: any) => {
          console.log(error)
          this.lcargando.ctlSpinner(false);
        }
      )

    } else {
      this.dGeneralService.getLibroDiarioAuxiliarSin(desde, hasta, centro,auxiliar).subscribe(
        (res: any) => {
          console.log(res);
          this.lcargando.ctlSpinner(false);
          this.dtConsultaAsientoAuxiliar = res.data;

        },
        (error: any) => {
          console.log(error)
          this.lcargando.ctlSpinner(false);
          this.toastr.error(error.error.message, 'Error cargando Registros')
        }
      )
    }
  }

  DescargarPdf() {

    let desde = moment(this.fromDatePicker).format('YYYYMMDD');
    let hasta = moment(this.toDatePicker).format('YYYYMMDD');
    let cuenta = this.codigo;
    let cuenta_hasta = this.codigo_hasta;
    let centro = this.centrocosto;

    window.open(environment.ReportingUrl + "rpt_diario_general.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&fecha_desde=" + desde + "&fecha_hasta=" + hasta + "&id_empresa=1&cuenta=" + cuenta + "&cuenta_hasta=" + cuenta_hasta + "&centro=" + centro + "&nomb_centro=GENERAL", '_blank');

  }

  DescargarExcel() {

    if(this.auxSelected){
      let desde = moment(this.fromDatePicker).format('YYYYMMDD');
        let hasta = moment(this.toDatePicker).format('YYYYMMDD');
        let cuenta = this.codigo;
        let cuenta_hasta = this.codigo_hasta;
        let centro = this.centrocosto;
        //http://vmi1057060.contaboserver.net:9090/jasperserver/rest_v2/reports/reports/rpt_diario_general.html?cuenta_hasta=1.1.1.02.01.030&fecha_desde=20230101&centro=&cuenta=1.1.1.02.01.030&nomb_centro=~NULL~&id_empresa=1&fecha_hasta=20230114
        window.open(environment.ReportingUrl + "rpt_diario_general.xlsx?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&fecha_desde=" + desde + "&fecha_hasta=" + hasta + "&id_empresa=1&cuenta=" + cuenta + "&cuenta_hasta=" + cuenta_hasta + "&centro=" + centro + "&nomb_centro=GENERAL", '_blank');

    }else{
      console.log('excel auxiliares')
      this. exportExcelAuxiliares()
    }

  }

  exportExcelAuxiliares() {

    let data = {
      title: 'Anexo al estado de Situación Financiera',
      rows:  this.dtConsultaAsientoAuxiliar
    }
    console.log(data);

    this.xlsService.exportDiarioGeneralAuxiliares(data, 'Reporte Auxiliares')
  }


  metodoGlobal(evento: any) {
    switch (evento.items.paramAccion + evento.items.boton.texto) {
      case "2EXCEL":
        this.DescargarExcel();
        break;
      case "2PDF":
        this.DescargarPdf();
        break;
      case "2CONSULTAR":
        this.CargarLibroDiario();
        break;
      case "2CONSULTAR AUXILIAR":
        this.CargarLibroDiarioAuxiliar();
        break;

    }
  }


}
