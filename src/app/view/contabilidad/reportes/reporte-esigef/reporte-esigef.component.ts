import { Component, OnInit,ViewChild } from '@angular/core';
import { EasigefService } from './reporte-esigef.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment'

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CustomersConsultModule } from 'src/app/view/cartera/customers/customers-consult/customers-consult.module';
@Component({
standalone: false,
  selector: 'app-reporte-esigef',
  templateUrl: './reporte-esigef.component.html',
  styleUrls: ['./reporte-esigef.component.scss']
})
export class ReporteEsigefComponent implements OnInit {


  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  vmButtons: any;
  FilreportEsigef:any;
  dataUser: any;

  DataAsientoInicial:any;
  nameFile:string;

  index: number = 0;

  selected_anio: any;
  selected_mes: number;
  cmb_periodo: any[] = []



  constructor(
    private serv: EasigefService,
    private toastr: ToastrService,
  ) {
    this.FilreportEsigef = [
      {
        id:'API',
        index: 0,
        descripcion:'Apertura inicial'
      },
      {
        id:'BAL',
        index: 1,
        descripcion:'Balance Comprobación'
      },
      // {
      //   id:'TRA',
      //   index: 2,
      //   descripcion:'Transferencias'
      // },
      {
        id:'PRI',
        index: 2,
        descripcion:'Presupuesto Inicial'
      },
      {
        id:'PRE',
        index: 3,
        descripcion:'Presupuesto'
      },
      // {
      //   id:'RECI_INICIAL',
      //   index: 5,
      //   descripcion:'Recíprocas Inicial'
      // },
      {
        id:'RECI',
        index: 4,
        descripcion:'Transacciones Recíprocas'
      },
      {
        id:'DASI',
        index: 5,
        descripcion:'Detalle de Asiento Inicial'
      }
    ]
  }

  priDisplayColumns: string[] = ['tipo', 'codigo', 'asignacion_original'];
  priDataSource: Array<any> = [];
  arrayMes: any = [{id: 0,name: "-Todos-" },{id: 1,name: "Enero"},{id: 2,name: "Febrero"},{id: 3,name: "Marzo"},{id: 4,name: "Abril"},{id: 5,name: "Mayo"},{id:6,name: "Junio"},{id:7,name: "Julio"},{id: 8,name: "Agosto"},{id: 9,name: "Septiembre"},{id: 10,name: "Octubre"},{id: 11,name: "Noviembre"}, {id: 12,name: "Diciembre" }];

  bcoDataSource: Array<any> = [];
  preDataSource: Array<any> = [];
  recipIniDataSource: Array<any> = [];
  tranReciDataSource: Array<any> = [];
  detAsientoIniDataSource: Array<any> = [];

  ngOnInit(): void {

    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    ;
    this.selected_anio = moment(new Date()).format('YYYY');


    this.vmButtons = [
      { orig: "btnSalSum", paramAccion: "1", boton: { icon: "fa fa-search", texto: "CONSULTAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: true, imprimir: false},
      { orig: "btnSalSum", paramAccion: "1", boton: { icon: "fa fa-file-excel-o", texto: "TXT" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: true, imprimir: false},
    ];
    setTimeout(()=> {
      this.cargaInicial()
      //this.getCatalogos();
    }, 50);


  }

  async cargaInicial() {
    this.lcargando.ctlSpinner(true);
    try {

      (this as any).mensajeSpinner = "Cargando Períodos"
      const resPeriodos = await this.serv.getPeriodos()
      this.cmb_periodo = resPeriodos

      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error en Carga Inicial')
    }
  }


  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "TXT":
        this.exportar();
        break;
      case "CONSULTAR":
        this.consultar();
        break;
    }
  }

  handleSelectMes(event: any) {
    this.selected_mes = event
  }

  handleChange({index}) {
    // console.log(event);
    let item = this.FilreportEsigef.find((option: any) => option.index == index)
    // console.log(item)
    this.ObtnerArchivoDescarga(item)
  }


  ExportTxt(){

    let cabeversaldo = ['periodo','cuenta_mayor','cuenta_nivel1','cuenta_nivel2','valor_deb','valor_cre'];
    this.serv.downloadFile(this.DataAsientoInicial, this.nameFile ,cabeversaldo);

  }

  consultar() {
    switch (this.index) {
      case 0:
        this.ConsultaSaldoInicial()
        break;
      case 1:
        this.consultarBalanceComprobacion()
        break;
      case 2:
        this.consultarPresupuestoInicial()
        break;
      case 3:
        this.consultarPresupuesto()
        break;
    //  case 5:
    //    this.consultarRecipInicial()
    //    break;
      case 4:
        this.consultarTranReciprocas()
        break;
      case 5:
        this.consultarDetAsientoInicial()
        break;
      default:
        break;
    }
  }

  exportar() {

    console.log(this.index)
    switch (this.index) {
      case 0:
        this.ExportTxt()
        break;
      case 1:
        this.exportBalanceComprobacion()
        break;
      case 2:
        this.exportPresupuestoInicial()
        break;
      case 3:
        this.exportPresupuesto()
        break;
   /*   case 5:
        this.exportRecipInicial()
        break;*/
      case 4:
        this.exportTranReciprocas()
        break;
      case 5:
        this.exportDetAsientoInicial()
        break;

      default:
        break;
    }
  }

  //ChangeMesCierrePeriodos(evento: any) { this.mes_actual = evento; }

  ConsultaSaldoInicial(){
    let cabeversaldo = ['periodo','cuenta_mayor','cuenta_nivel1','cuenta_nivel2','valor_deb','valor_cre'];

    this.serv.ObtenerRegistroSaldoInicial(this.selected_anio, this.selected_mes).subscribe(
      (res: any) => {
        console.log(res);
        this.DataAsientoInicial = res;
        //this.serv.downloadFile(this.DataAsientoInicial, this.nameFile ,cabeversaldo);
        this.vmButtons[1].habilitar = false;
      },
      (error: any) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      })

  }

  async consultarPresupuestoInicial() {
    this.lcargando.ctlSpinner(true);
    try {
      let response: Array<any> = await this.serv.obtenerPresupuestoInicial({ periodo: this.selected_anio, mes: this.selected_mes });
      response.map((item: any) => Object.assign(item, { codigo: `${item.tipo}|${item.codigo_p1}|${item.codigo_p2}|${item.codigo_p3}`, periodo: `${this.selected_mes}`.padStart(2, '0') }))
      console.log(response)
      this.priDataSource = response

      this.vmButtons[1].habilitar = false;
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error cargando Datos')
    }
  }

  async consultarBalanceComprobacion() {
    this.lcargando.ctlSpinner(true);
    try {
      let response = await this.serv.obtenerBalanceComprobacion({ periodo: this.selected_anio, mes: this.selected_mes });
      response.map((item: any) => Object.assign(item, { codigo: `${item.codigo_p1}|${item.codigo_p2}|${item.codigo_p3}`, periodo: `${this.selected_mes}`.padStart(2, '0') }))
      console.log(response)
      this.bcoDataSource = response

      this.vmButtons[1].habilitar = false;
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error cargando Datos')
    }
  }

  async consultarPresupuesto() {
    this.lcargando.ctlSpinner(true);
    try {
      let response = await this.serv.obtenerPresupuesto({periodo: this.selected_anio});
      response.map((item: any) => Object.assign(item, { codigo: `${item.codigo_p1}|${item.codigo_p2}|${item.codigo_p3}`, periodo: `${this.selected_mes}`.padStart(2, '0') }))
      console.log(response)
      this.preDataSource = response

      this.vmButtons[1].habilitar = false;
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error cargando Datos')
    }
  }
  consultarRecipInicial(){
    this.lcargando.ctlSpinner(true);
    this.serv.obtenerReciprocaInicial(this.selected_anio,this.selected_mes).subscribe(
      (res: any) => {
        console.log(res);
        res['data'].forEach(e => {
          Object.assign(e,{total_acreedor:0})
        })
        this.recipIniDataSource = res['data'];
        //this.serv.downloadFile(this.DataAsientoInicial, this.nameFile ,cabeversaldo);
        this.vmButtons[1].habilitar = false;
        this.lcargando.ctlSpinner(false)
      },
      (error: any) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      })

  }
  consultarTranReciprocas(){
    this.lcargando.ctlSpinner(true);
    this.serv.obtenerTranReciprocas(Number(this.selected_anio),Number(this.selected_mes),Number(this.dataUser.id_usuario)).subscribe(
      (res: any) => {
        console.log(res);
        res['data'].forEach(e => {
          Object.assign(e,{total_acreedor:0})
        })
        this.tranReciDataSource = res['data'];
        //this.serv.downloadFile(this.DataAsientoInicial, this.nameFile ,cabeversaldo);
        this.vmButtons[1].habilitar = false;
        this.lcargando.ctlSpinner(false)
      },
      (error: any) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      })

  }
  consultarDetAsientoInicial(){
    this.lcargando.ctlSpinner(true);

    //console.log(this.selected_anio);
    //console.log(this.selected_mes);

    //alert('a');

    this.serv.obtenerDetAsientoInicial(Number(this.selected_anio),Number(this.selected_mes),Number(this.dataUser.id_usuario)).subscribe(
      (res: any) => {
        console.log(res);
       /* res['data'].forEach(e => {
          Object.assign(e,{total_acreedor:0})
        })*/
        this.detAsientoIniDataSource = res['data'];
      this.detAsientoIniDataSource.forEach(e=>{
        Object.assign(e,{flujo_acreedor:e.flujo_acreedor.toFixed(2)})
      });

        console.log(this.detAsientoIniDataSource);
        //this.serv.downloadFile(this.DataAsientoInicial, this.nameFile ,cabeversaldo);
        this.vmButtons[1].habilitar = false;
        this.lcargando.ctlSpinner(false)
      },
      (error: any) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      })

  }

  exportPresupuestoInicial() {
    let cabecera = ['periodo', 'codigo','actividad','orientacion_gasto', 'asignacion_original']
    this.serv.downloadFile(this.priDataSource, 'PresupuestoInicial', cabecera)
  }

  exportBalanceComprobacion() {
    let cabecera = ['mes','codigo', 'saldo_inicial_deudor', 'saldo_inicial_acreedor', 'flujo_deudor', 'flujo_acreedor', 'sumas_debe', 'sumas_haber', 'saldo_final_deudor', 'saldo_final_acreedor']
    this.serv.downloadFile(this.bcoDataSource, 'BalanceComprobacion', cabecera)
  }

  exportPresupuesto() {
    let cabecera = ['periodo','tipo', 'codigo','actividad','orientacion_gasto', 'asignacion_original', 'reformas', 'asignacion_codificada', 'comprometido', 'devengado', 'pagado', 'saldo_por_comprometer', 'saldo_por_devengar'];
    this.serv.downloadFile(this.preDataSource, 'Presupuesto', cabecera)
  }
  exportRecipInicial() {
    let cabecera = ['periodo', 'cuenta_por_cobrar', 'nombre','mayor', 'cuenta_nivel_1', 'cuenta_nivel_2', 'num_documento', 'razon_social', 'total', 'total_acreedor'];
    this.serv.downloadFile(this.recipIniDataSource, 'ReciprocaInicial', cabecera)
  }
  exportTranReciprocas() {
    //let cabecera = ['periodo', 'cuenta_por_cobrar', 'nombre','mayor', 'cuenta_nivel_1', 'cuenta_nivel_2', 'num_documento', 'razon_social', 'total', 'total_acreedor'];
    let cabecera = ['mes','ruc','cta1_mayor','cta1_cuenta_nivel_1','cta1_cuenta_nivel_2','flujo_deudor','flujo_acreedor','ruc_beneficiario','beneficiario','grupo','subgrupo','item','cta2_mayor','cta2_cuenta_nivel_1','cta2_cuenta_nivel_2','flujo_deudor_2','flujo_acreedor_2','nro_transaccion','nro_referencia','fecha_aprobado','fecha_vencimiento'];
    this.serv.downloadFile(this.tranReciDataSource, 'TransaccionesRciprocas', cabecera)
  }
  exportDetAsientoInicial() {
    //let cabecera = ['periodo', 'cuenta_por_cobrar', 'nombre','mayor', 'cuenta_nivel_1', 'cuenta_nivel_2', 'num_documento', 'razon_social', 'total', 'total_acreedor'];
    let cabecera = ['mes', 'cta1_mayor', 'cta1_cuenta_nivel_1','cta1_cuenta_nivel_2', 'ruc_beneficiario', 'beneficiario', 'flujo_deudor', 'flujo_acreedor'];
    this.serv.downloadFile(this.detAsientoIniDataSource, 'DetalleAsientoInicial', cabecera)
  }

  ObtnerArchivoDescarga({id, index}){

    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = true;
    this.index = index;

    switch (id) {
      case 'API':
        this.nameFile = 'SaldoInicial';
        break;
      case 'BAL':
        this.nameFile = 'BalanceComprobacion';
        break;
      case 'TRA':
        this.nameFile = 'Transferencia';
        break;
      case 'PRI':
        this.nameFile = 'PresupuestoInicial';
        break;
      case 'PRE':
        this.nameFile = 'Presupuesto';
        break;
      case 'RECI_INICIAL':
        this.nameFile = 'ReciprocasInicial';
        break;
      case 'RECI':
        this.nameFile = 'TransaccionesReciprocas';
        break;
      case 'DASI':
        this.nameFile = 'DetalleAsientoInicial';
        break;


      default:
        this.vmButtons[0].habilitar = true;
        this.vmButtons[1].habilitar = true;
        break;
    }

  }

  convertirMes(mes){
    let month = ''
    switch (mes) {
      case 1:  month = 'ENERO'; break;
      case 2:  month = 'FEBRERO'; break;
      case 3:  month = 'MARZO'; break;
      case 4:  month = 'ABRIL'; break;
      case 5:  month = 'MAYO'; break;
      case 6:  month = 'JUNIO'; break;
      case 7:  month = 'JULIO'; break;
      case 8:  month = 'AGOSTO'; break;
      case 9:  month = 'SEPTIEMBRE'; break;
      case 10: month = 'OCTUBRE'; break;
      case 11: month = 'NOVIEMBRE'; break;
      case 12: month = 'DICIEMBRE'; break;
      default:
    }

    return month
  }


}
