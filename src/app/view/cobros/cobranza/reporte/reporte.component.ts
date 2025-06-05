import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { environment } from 'src/environments/environment';
import { ModalContribuyentesComponent } from 'src/app/config/custom/modal-contribuyentes/modal-contribuyentes.component';
import { ButtonRadioActiveComponent } from '../../../../config/custom/cc-panel-buttons/button-radio-active.component';
import * as moment from 'moment';
import { ReporteService } from './reporte.service';
import * as myVarGlobals from 'src/app/global';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonVarService } from 'src/app/services/common-var.services';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { PrimeNG } from 'primeng/config';
import { Table } from 'primeng/table';
import { AnySrvRecord } from 'dns';
import 'moment/locale/es';



@Component({
standalone: false,
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.scss'],
  styles: [`
  :host ::ng-deep .p-datatable .p-datatable-thead  > tr > th {
      position: -webkit-sticky;
      position: sticky;
      top: -10px;
  }

  .layout-news-active :host ::ng-deep .p-datatable tr > th {
      top: 7rem;
  }
`]
})
export class ReporteComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild('tblRecExpCoactivos') tblRecExpCoactivos: Table
  @ViewChild('tblDivConceptos') tblDivConceptos: Table
  @ViewChild('tblGeneral') tblGeneral: Table
  @ViewChild('tblArrenMensual') tblArrenMensual: Table
  @ViewChild('tblPorConvenios') tblPorConvenios: Table
  @ViewChild('tblMercado') tblMercado: Table
  @ViewChild('tblRecaudoMercados') tblRecaudoMercados: Table

  fTitle: string = "Reportes de Cobranzas";

  mensajeSpinner: string = "Cargando...";
  vmButtons: any[] = [];
  dataUser: any;
  catalog: any = {};
  arrayData2: any=[];
  fechaDesdeDisabled= false;
  mercadosDisabled = false;
  contribuyenteDisabled = false;
  conceptosDisabled = false;
  estadoDisabled = false;
  tipoDisabled = false;
  sectorDisabled = false;
  fechaHastaDisabled= false;
  fechaContratoDisabled= false;
  variableFiltro: any;
  permissions: any;
  id_cliente:0;
  conceptos: any[] = [];
  documento: any = {
    tipo_documento: "", // concepto.codigo

  }
  totalLocales: any  = 0
  totalActivos: any  = 0
  totalNroContratos: any  = 0
  totalPorCobrar: any  = 0
  totalRecaudado: any  = 0
  totalSaldo: any = 0
  totalPorcentaje: any  = 0

  totalArriendo: any =  0
  totalPatente: any = 0
  totalActivosTotales: any = 0
  totalPesasMedidas: any = 0
  totalViaPublica: any = 0
  totalLetreros: any = 0
  totalIntroductor: any = 0
  totalGeneral: any = 0

  totalGeneralConvenios:any= 0
  totalRecaudadoConvenios:any= 0
  totalSaldoTotalconvenios:any= 0

  totalConceptos :any =0

  totalSaldoGeneral: any = 0
  totalPendiente: any = 0

  paginate: any;

  dataReportes : any[] = []

  tipoDeuda = [
    {valor: 'CO', descripcion: 'Convenio por Deuda'},
    {valor: 'COTE', descripcion: 'Convenio por Compra de Terreno'},

  ]
  today = moment(new Date()).format('YYYY-MM-DD');
 filter: any

  reportes: any[] = [];
  mercados: any[] = [];
  sectores: any[] = [];
  estados: any[] = [];
  selectedReporte: any = undefined;
  selectedConcepto: any = ' ';
  selectedMercado: any = ' ';
  selectedSector: any = ' ';
  selectedEstado: any = ' ';
  selectedTipo: any = ' ';

  razon_social:any = ' ';
  reporte = {
    fk_contribuyente: { razon_social: '', email: 'dbarrera@todotek.net' },
    proceso:'',
    total:0,
    observaciones:'',

  }
  loading: boolean;
  totalRecords: number;
  first: number = 0;
  rows: number = 50;
  pageIndex: number = 1;
  pageSize: number = 5;
  pageSizeOptions: number[] = [50,100,200];

  //today = moment(new Date()).format('YYYY-MM-DD');
  fecha_desde: string = moment(this.today).startOf('month').format('YYYY-MM-DD');
  fecha_hasta: string = moment(this.today).endOf('month').format('YYYY-MM-DD');
  fecha_contrato: string = moment(this.today).endOf('month').format('YYYY-MM-DD');
  mes:any
  anio: any
  constructor(
    private apiService: ReporteService,
    private toastr: ToastrService,
    private commonVarService: CommonVarService,
    private modalService: NgbModal,
  ) {
    this.commonVarService.selectContribuyenteCustom.asObservable().subscribe(

      (res: any) => {

          this.reporte.fk_contribuyente = res
          this.filter.fk_contribuyente = res.id_cliente
          console.log(res);
          this.filter.razon_social = res.razon_social
          //this.id_cliente=res.id_cliente;

      }
  )

  }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsRenConsultaReporte",
        paramAccion: "",
        boton: { icon: "far fa-file-pdf", texto: "IMPRIMIR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-info boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsRenConsultaReporte",
        paramAccion: "",
        boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false
      },
    ];
    this.estados = [
      {value: 'APROBADO', label: 'A'},
      {value: 'CANCELADO', label: 'C'},
      {value: 'EMITIDO', label: 'E'},
      {value: 'ANULADO', label: 'X'},
      {value: 'CONVENIO', label: 'V'}
    ];
    this.paginate = {
      length: 0,
      perPage: 7,
      page: 1,
      pageSizeOptions: [5, 10,20,50]
    }
    this.filter= {
      selectedEstado: '',
      selectedConcepto: ' ',
      id_concepto :  0,
      selectedMercado: ' ',
      selectedSector: ' ',
      selectedTipo: ' ',
      fecha_desde: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).endOf('month').format('YYYY-MM-DD'),
      fecha_contrato: moment(this.today).endOf('month').format('YYYY-MM-DD'),
      razon_social: ' ',
      reporte: '',
      fk_contribuyente: 0
    }

    moment.locale('es'); // aca ya esta en es
    this.mes = moment(this.filter.fecha_desde).format('MMMM');
    this.anio = moment(this.filter.fecha_desde).format('YYYY');

    setTimeout(() => {
      this.getTiposReporte()
    }, 75)
    setTimeout(() => {
      this.getMercados()
    }, 75)
    setTimeout(() => {
      this.getSector()
    }, 75)
    setTimeout(() => {
      this.getConceptosReporte()
    }, 75)
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "IMPRIMIR":
        this.mostrarReporte()
        break;
      case "EXCEL":
        this.btnExportar()
        break;

      default:
        break;
    }
  }

  consultar() {
    if(this.selectedReporte=='rpt_recaudacion_expedientes_coactivos'){
      this.tblRecExpCoactivos.first = 0
    }
    if(this.selectedReporte=='rpt_diversos_conceptos'){
      this.tblDivConceptos.first = 0
    }
    if(this.selectedReporte=='rpt_general'){
      this.tblGeneral.first = 0
    }
    if(this.selectedReporte=='rpt_emision_recaudacion_arriendamiento_mensual'){
      this.tblArrenMensual.first = 0
    }
    if(this.selectedReporte=='rpt_por_convenios'){
      this.tblPorConvenios.first = 0
    }
    if(this.selectedReporte=='rpt_mercado'){
      this.tblMercado.first = 0
    }
    if(this.selectedReporte=='rpt_recaudo_mercados'){
      this.tblRecaudoMercados.first = 0
    }
    this.first = 0
    this.nextPage({first: this.first, rows: this.rows})
  }

  nextPage(event: LazyLoadEvent) {
    // let id_emp = this.faltasAndDescuentosForm.id_empleado;
    // console.log(id_emp);
    console.log(event);

    Object.assign(this.paginate,  {
      page: (event.first / this.rows) + 1,
      perPage: event.rows
    })
      this.cargarConsultaReportes();
  }

  cargarConsultaReportes(){
  console.log(this.filter);
  this.loading = true;
    (this as any).mensajeSpinner = 'Cargando...';
    //this.lcargando.ctlSpinner(true);
    this.filter.reporte = this.variableFiltro

    let data= {
      params: {
        filter: this.filter,
        paginate: this.paginate,

      }
    }


    this.apiService.getConsultaReportes(data).subscribe(
      (res: any) => {
         console.log(res);
         if(res.status==1){
          this.dataReportes = res.data.data;
          this.totalRecords= res.data?.total[0]?.count

          //this.dataReportes = res.data;

          if(this.filter.reporte =='rpt_diversos_conceptos'){
            this.totalConceptos = res.data.total[0].total_conceptos
          }
          if(this.filter.reporte =='rpt_general'){
            this.totalSaldoGeneral = res.data.total[0].total_saldo
          }


          if(this.filter.reporte =='rpt_emision_recaudacion_arriendamiento_mensual'){

            this.totalLocales=  res.data.total[0].total_total_numero_local
            this.totalActivos=   res.data.total[0].total_activos
            this.totalNroContratos= res.data.total[0].total_nro_contratos
            this.totalPorCobrar= res.data.total[0].total_por_cobrar
            this.totalRecaudado= res.data.total[0].total_recaudado
            this.totalSaldo= res.data.total[0].total_saldo
            this.totalPorcentaje= res.data.total[0].total_porcentaje
            //this.calcularTotalesArrendaMensual()
          }
          if(this.filter.reporte =='rpt_recaudo_mercados'){

            this.totalArriendo=res.data.total[0].total_arriendo
            this.totalPatente= res.data.total[0].total_patente
            this.totalActivosTotales= res.data.total[0].total_activos_totales
            this.totalPesasMedidas= res.data.total[0].total_pesas_medidas
            this.totalViaPublica= res.data.total[0].total_via_publica
            this.totalLetreros= res.data.total[0].total_letreros
            this.totalIntroductor= res.data.total[0].total_introductor
            this.totalGeneral= res.data.total[0].total_general
            //this.calcularTotalesRecaudoMercado()
          }
          if(this.filter.reporte =='rpt_mercado'){
            this.totalPendiente= res.data.total[0].total_general
          }


          if(this.filter.reporte == 'rpt_por_convenios'){
            this.totalGeneralConvenios = res.data.total[0].total_general;
            this.totalRecaudadoConvenios = res.data.total[0].total_valorrecaudado;
            this.totalSaldoTotalconvenios = res.data.total[0].total_saldototal;
           // this.calcularTotalesConvenios()
          }
          this.loading = false;
          //this.lcargando.ctlSpinner(false);
         }
         else{
          this.dataReportes =[]
          this.loading = false;
          //this.lcargando.ctlSpinner(false);
         }
      },
      (err: any) => {
        console.log(err);
        this.loading = false;
        //this.lcargando.ctlSpinner(false);
      }
    )

  }
  calcularTotalesArrendaMensual(){
    let totalLocales = 0
    let totalActivos = 0
    let totalNroContratos = 0
    let totalPorCobrar = 0
    let totalRecaudado = 0
    let totalSaldo = 0
    let totalPorcentaje = 0
    this.dataReportes.forEach(e => {
      totalLocales += parseFloat(e.numero_local);
      totalActivos += parseFloat(e.activos);
      totalNroContratos += parseFloat(e.nro_contratos);
      totalPorCobrar += parseFloat(e.por_cobrar);
      totalRecaudado += parseFloat(e.recaudado);
      totalSaldo += parseFloat(e.saldo);
      totalPorcentaje += parseFloat(e.porcentaje);
  });
      console.log(totalLocales)
      this.totalLocales= totalLocales
      this.totalActivos= totalActivos
      this.totalNroContratos= totalNroContratos
      this.totalPorCobrar= totalPorCobrar
      this.totalRecaudado= totalRecaudado
      this.totalSaldo= totalSaldo
      this.totalPorcentaje= totalPorcentaje
  }

  calcularTotalesRecaudoMercado(){
    let totalArriendo= 0
    let totalPatente= 0
    let totalActivosTotales= 0
    let totalPesasMedidas= 0
    let totalViaPublica= 0
    let totalLetreros= 0
    let totalIntroductor= 0
    let totalGeneral= 0
    this.dataReportes.forEach(e => {
      totalArriendo += parseFloat(e.arriendo);
      totalPatente += parseFloat(e.patente);
      totalActivosTotales += parseFloat(e.activos_totales);
      totalPesasMedidas += parseFloat(e.pesas_y_medidas);
      totalViaPublica += parseFloat(e.via_publica);
      totalLetreros += parseFloat(e.letreros);
      totalIntroductor += parseFloat(e.introductor);
      totalGeneral += parseFloat(e.total);
  });
      this.totalArriendo=totalArriendo
      this.totalPatente= totalPatente
      this.totalActivosTotales= totalActivosTotales
      this.totalPesasMedidas= totalPesasMedidas
      this.totalViaPublica= totalViaPublica
      this.totalLetreros= totalLetreros
      this.totalIntroductor= totalIntroductor
      this.totalGeneral= totalGeneral
  }

  calcularTotalesConvenios(){
    let totalGeneral= 0
    let totalRecaudado= 0
    let totalSaldoTotal= 0

    this.dataReportes.forEach(e => {
      totalGeneral += parseFloat(e.total);
      totalRecaudado += parseFloat(e.valorrecaudado);
      totalSaldoTotal += parseFloat(e.saldototal);
  });

      this.totalGeneralConvenios= totalGeneral
      this.totalRecaudadoConvenios= totalRecaudado
      this.totalSaldoTotalconvenios= totalSaldoTotal
  }

  calculoTotalSubtotal(name) {
    let totalSubtotal = 0;
    if (this.dataReportes.length > 0) {
      for (let datos of this.dataReportes) {
          if (datos.abogado == name ) {
            totalSubtotal += parseFloat(datos.subtotal);
          }
      }
    }
    return totalSubtotal;
  }
  calculoTotalInteres(name) {
    let totalInteres = 0;
    if (this.dataReportes.length > 0) {
      for (let datos of this.dataReportes) {
          if (datos.abogado == name ) {
            totalInteres += parseFloat(datos.interes);
          }
      }
    }
    return totalInteres;
  }
  calculoTotalTotal(name) {
    let total = 0;
    if (this.dataReportes.length > 0) {
      for (let datos of this.dataReportes) {
          if (datos.abogado == name ) {
            total += parseFloat(datos.total);
          }
      }
    }
    return total;
  }
  calculoTotalCoactiva(name) {
    let totalCoactiva = 0;
    if (this.dataReportes.length > 0) {
      for (let datos of this.dataReportes) {
          if (datos.abogado == name ) {
            totalCoactiva += parseFloat(datos.coactiva);
          }
      }
    }
    return totalCoactiva;
  }

  calculaTotalRepGene(){
    let totalSaldo = 0
    if (this.dataReportes.length > 0) {
      for (let datos of this.dataReportes) {
        totalSaldo += parseFloat(datos.saldototal);
      }
    }
    return totalSaldo;
  }

  sumaTotalesMercado(){
    let totalPendiente = 0
    if (this.dataReportes.length > 0) {
      for (let datos of this.dataReportes) {
        totalPendiente += parseFloat(datos.pendiente);
      }
    }
    return totalPendiente;
  }

  sumaTotalesConceptos(){
    let totalConceptos = 0
    if (this.dataReportes.length > 0) {
      for (let datos of this.dataReportes) {
        totalConceptos += parseFloat(datos.total);
      }
    }
    return totalConceptos;
  }



  mostrarReporte(){
    console.log(this.selectedReporte)
    console.log(this.reportes)
    this.lcargando.ctlSpinner(true);
    (this as any).mensajeSpinner = "Cargando...";

    // this.apiService.getTiposReporte().subscribe(
    //   (res: any) => {

        // console.log(res.data);
         var variable: "";
        this.reportes.forEach((element: any) => {
          // let o = {
          //   created_at: element.created_at,
          //   descripcion: element.descripcion,
          //   reporte: element.reporte
          // };
          //this.reportes.push({ ...o });
          //console.log(element.descripcion , )
          if (element.reporte == this.selectedReporte){


            window.open(environment.ReportingUrl +`${element.reporte}`+".pdf?&j_username=" + environment.UserReporting
            + "&j_password=" + environment.PasswordReporting+"&fechaInicio=" + this.filter.fecha_desde + "&fechaFin="+ this.filter.fecha_hasta+"&mercado="+(this.selectedMercado == ' ' || this.selectedMercado == undefined ? '*' :this.selectedMercado)
            +"&sector="+ (this.selectedSector == ' ' || this.selectedSector == undefined  ? '*' :this.selectedSector) +"&estado="+ (this.filter.selectedEstado == '' || this.filter.selectedEstado == undefined  ? '*' :this.filter.selectedEstado)
            +"&contribuyente="+ (this.filter.razon_social == ' ' || this.filter.razon_social == undefined  ? '*' :this.filter.razon_social)+"&tipo="+ (this.selectedTipo == ' ' || this.selectedTipo == undefined ? '*' :this.selectedTipo)
            +"&concepto="+ (this.selectedConcepto == ' ' || this.selectedConcepto == undefined ? '*' :this.selectedConcepto),'_blank')
            //window.open(environment.ReportingUrl + "rep_tasas_plusvalia.pdf?&j_username=" + environment.UserReporting +
            //"&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.id_liquidacion + "&forma_pago=" + this.pagos[0].tipo_pago_lbl , '_blank')
            // console.log(environment.ReportingUrl +`${element.reporte}`+".pdf?&j_username=" + environment.UserReporting
            // + "&j_password=" + environment.PasswordReporting+"&fechaInicio=" + this.fecha_desde + "&fechaFin=" + this.fecha_hasta //+"&mercado="+this.selectedMercado
            // +"&sector="+this.selectedSector+"&estado="+this.filter.selectedEstado+"&contribuyente="+this.filter.razon_social+"&tipo="+this.selectedTipo+"&concepto="+this.selectedConcepto);
            // console.log(environment.ReportingUrl +`${element.reporte}`+".pdf?&j_username=" + environment.UserReporting
            // + "&j_password=" + environment.PasswordReporting+"&fechaInicio=" + this.filter.fecha_desde + "&fechaFin="+ this.filter.fecha_hasta+"&mercado="+(this.selectedMercado == ' ' || this.selectedMercado == undefined ? '*' :this.selectedMercado)
            // +"&sector="+ (this.selectedSector == ' ' || this.selectedSector == undefined  ? '*' :this.selectedSector) +"&estado="+ (this.filter.selectedEstado == '' || this.filter.selectedEstado == undefined  ? '*' :this.filter.selectedEstado)
            // +"&contribuyente="+ (this.filter.razon_social == ' ' || this.filter.razon_social == undefined  ? '*' :this.filter.razon_social)+"&tipo="+ (this.selectedTipo == ' ' || this.selectedTipo == undefined ? '*' :this.selectedTipo)
            // +"&concepto="+ (this.selectedConcepto == ' ' || this.selectedConcepto == undefined ? '*' :this.selectedConcepto))
          }
        });
        this.lcargando.ctlSpinner(false);

    //   },
    //   (err: any) => {
    //     console.log(err);
    //     this.lcargando.ctlSpinner(false);
    //   }
    // )

  }

  getConceptosReporte(){
    (this as any).mensajeSpinner = 'Cargando Tipos de Reporte';
    this.lcargando.ctlSpinner(true);
    this.apiService.getConceptosReporte().subscribe(
      (res: any) => {
         console.log(res.data);
        res.data.forEach((element: any) => {
          let o = {
            codigo: element.codigo,
            nombre: element.nombre,
            id_concepto: element.id_concepto
          };
          this.conceptos.push({ ...o });
        });
        this.lcargando.ctlSpinner(false);
      },
      (err: any) => {
        console.log(err);
        this.lcargando.ctlSpinner(false);
      }
    )
  }

  getTiposReporte() {
    (this as any).mensajeSpinner = 'Cargando Tipos de Reporte';
    this.lcargando.ctlSpinner(true);
    this.apiService.getTiposReporte().subscribe(
      (res: any) => {
         console.log(res.data);
        res.data.forEach((element: any) => {
          let o = {
            created_at: element.created_at,
            descripcion: element.descripcion,
            reporte: element.reporte
          };
          this.reportes.push({ ...o });
        });
        this.lcargando.ctlSpinner(false);
      },
      (err: any) => {
        console.log(err);
        this.lcargando.ctlSpinner(false);
      }
    )
  }

  getMercados() {
    (this as any).mensajeSpinner = 'Cargando Mercados';
    this.lcargando.ctlSpinner(true);
    this.apiService.getMercados().subscribe(
      (res: any) => {
        console.log(res.data);
        res.data.forEach((element: any) => {
          let o = {
            id_catalogo: element.id_catalogo,
            valor: element.valor
          };
          this.mercados.push({ ...o });
        });
        this.lcargando.ctlSpinner(false);
      },
      (err: any) => {
        console.log(err);
        this.lcargando.ctlSpinner(false);
      }
    )
  }

  btnExportar() {

    this.apiService.getTiposReporte().subscribe(
      (res: any) => {
         console.log(res.data);
         var variable: "";
        res.data.forEach((element: any) => {
          let o = {
            created_at: element.created_at,
            descripcion: element.descripcion,
            reporte: element.reporte
          };
          //this.reportes.push({ ...o });
          if (element.descripcion == this.selectedReporte){


            window.open(environment.ReportingUrl +`${element.reporte}`+".xlsx?&j_username=" + environment.UserReporting
            + "&j_password=" + environment.PasswordReporting+"&fechaInicio=" + this.filter.fecha_desde + "&fechaFin="+ this.filter.fecha_hasta+"&mercado="+this.filter.selectedMercado
            +"&sector="+this.filter.selectedSector+"&estado="+this.filter.selectedEstado+"&contribuyente="+this.filter.razon_social+"&tipo="+this.filter.selectedTipo+"&concepto="+this.filter.selectedConcepto,'_blank')
            //window.open(environment.ReportingUrl + "rep_tasas_plusvalia.pdf?&j_username=" + environment.UserReporting +
            //"&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.id_liquidacion + "&forma_pago=" + this.pagos[0].tipo_pago_lbl , '_blank')
            console.log(environment.ReportingUrl +`${element.reporte}`+".xlsx?&j_username=" + environment.UserReporting
            + "&j_password=" + environment.PasswordReporting+"&fechaInicio=" + this.fecha_desde + "&fechaFin=" + this.fecha_hasta+"&mercado="+this.filter.selectedMercado
            +"&sector="+this.filter.selectedSector+"&estado="+this.filter.selectedEstado+"&contribuyente="+this.filter.razon_social+"&tipo="+this.filter.selectedTipo+"&concepto="+this.filter.selectedConcepto);
          }
        });

      },
      (err: any) => {
        console.log(err);
        this.lcargando.ctlSpinner(false);
      }
    )

  }


  selectOption1(evt) {
    this.dataReportes= []
    this.limpiarTotales()
    if (evt !== 0) {
      this.variableFiltro=evt;
      let data2 = {
        params: `${this.variableFiltro}`,
      };
      console.log(data2);
      this.apiService.getDataTipoReporte(data2).subscribe(res => {
        console.log(res);

      if(res['data'][0].parametro_1 == '0'){
        this.mercadosDisabled=true;
      }
      else{
        this.mercadosDisabled=false;
      }
      if(res['data'][0].parametro_2 == '0'){
        this.conceptosDisabled=true;
      }
      else{
        this.conceptosDisabled=false;
      }
      if(res['data'][0].parametro_3 == '0'){
        this.contribuyenteDisabled=true;
      }
      else{
        this.contribuyenteDisabled=false;
      }
      if(res['data'][0].parametro_4 == '0'){
        this.estadoDisabled=true;
      }
      else{
        this.estadoDisabled=false;
      }
      if(res['data'][0].parametro_5 == '0'){
        this.tipoDisabled=true;
      }
      else{
        this.tipoDisabled=false;
      }
      if(res['data'][0].parametro_6 == '0'){
        this.sectorDisabled=true;
      }
      else{
        this.sectorDisabled=false;
      }
      if(res['data'][0].fecha_desde == '0'){
        this.fechaDesdeDisabled=true;
      }
      else{
        this.fechaDesdeDisabled=false;
      }
      if(res['data'][0].fecha_hasta == '0'){
        this.fechaHastaDisabled=true;
      }
      else{
        this.fechaHastaDisabled=false;
      }
      if(res['data'][0].fecha_contrato == '0'){
        this.fechaContratoDisabled=true;
      }
      else{
        this.fechaContratoDisabled=false;
      }

        //this.arrayData2 = res['data'];
      });
		}

  }


  getSector() {
    this.lcargando.ctlSpinner(true);
    (this as any).mensajeSpinner = "Cargando Sector";

    this.apiService.getCatalogs().subscribe(
      (res: any) => {

        console.log(res.data);
        res.data.forEach((element: any) => {
          let o = {
            descripcion: element.descripcion,
            id_catalogo:element.id_catalogo
          };
          this.sectores.push({ ...o });
        });
        this.lcargando.ctlSpinner(false);
      },
      (err: any) => {
        console.log(err);
        this.lcargando.ctlSpinner(false);
      }
    );


  }

  limpiarFiltros() {
    Object.assign(this.filter, {
      selectedEstado: '',
      selectedConcepto: ' ',
      selectedMercado: ' ',
      selectedSector: ' ',
      selectedTipo: ' ',
      razon_social: ' ',
      fecha_desde: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).endOf('month').format('YYYY-MM-DD'),
      fecha_contrato: moment(this.today).endOf('month').format('YYYY-MM-DD'),
      reporte: 0,
      fk_contribuyente:0

  })
}

  expandContribuyentes() {
    const modalInvoice = this.modalService.open(ModalContribuyentesComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fRenContrato;
    modalInvoice.componentInstance.permissions = this.permissions;
  }

  limpiarTotales(){
  this.totalLocales  = 0
  this.totalActivos  = 0
  this.totalNroContratos  = 0
  this.totalPorCobrar  = 0
  this.totalRecaudado  = 0
  this.totalSaldo = 0
  this.totalPorcentaje  = 0

  this.totalArriendo =  0
  this.totalPatente = 0
  this.totalActivosTotales = 0
  this.totalPesasMedidas = 0
  this.totalViaPublica = 0
  this.totalLetreros = 0
  this.totalIntroductor = 0
  this.totalGeneral = 0

  this.totalGeneralConvenios= 0
  this.totalRecaudadoConvenios= 0
  this.totalSaldoTotalconvenios =0

  this.totalConceptos =0

  this.totalSaldoGeneral = 0
  this.totalPendiente = 0
  }

  /*getEstado() {
    this.lcargando.ctlSpinner(true);
    (this as any).mensajeSpinner = "Cargando Estado";

    this.apiService.getEstado().subscribe(
      (res: any) => {

        console.log(res.data);
        res.data.forEach((element: any) => {
          let o = {
            estado: element.estado
          };
          this.estados.push({ ...o });
        });
        this.lcargando.ctlSpinner(false);
      },
      (err: any) => {
        console.log(err);
        this.lcargando.ctlSpinner(false);
      }
    );


  }*/

}
