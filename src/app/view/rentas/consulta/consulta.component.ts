import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js'

import { ReporteService } from './reporte.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { PrimeNG } from 'primeng/config';
import { Table } from 'primeng/table';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';

@Component({
standalone: false,
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.scss'],
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
export class ConsultaComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild('tblTitulosEmiDet') tblTitulosEmiDet: Table
  @ViewChild('tblEmiDetalladaDia') tblEmiDetalladaDia: Table
  @ViewChild('tblEmiPredUrb') tblEmiPredUrb: Table
  @ViewChild('tblTitulosEmitidos') tblTitulosEmitidos: Table
  @ViewChild('tblResumenAnulacion') tblResumenAnulacion: Table

  fTitle: string = "Reporte de Rentas";
  mensajeSpinner: string = "Cargando...";
  vmButtons: any[] = [];
  dataUser: any;
  permissions: any;
  paginate: any;

  conceptos: any[] = [];
  reportes: any[] = [];
  dataReportes : any[] = []

  totalGeneralTitulosEmi : any = 0
  saldoGeneralTitulosEmi : any = 0

  totalGeneralEmiDetDia : any = 0

  countTitulos: any = 0
  totalImpPrin: any = 0
  totalSolNoEdif: any = 0
  totalConEspMe: any = 0
  totalConEsp: any = 0
  totalTasaAdm: any = 0
  totalEmiPreUrb: any = 0
  totalAseoCalle: any = 0

  totaGeneralTituEmi: any = 0
  totaGeneralTituAnu: any = 0
  cantTituAnuGneral: any = 0

  selectedReporte: any = undefined;
  selectedConcepto: any = ' ';
  today = moment(new Date()).format('YYYY-MM-DD');
  fecha_desde: string = moment(this.today).startOf('month').format('YYYY-MM-DD');
  fecha_hasta: string = moment(this.today).endOf('month').format('YYYY-MM-DD');
  filter: any
  // filter: any = {
  //   selectedConcepto: ' ',
  //   fecha_desde: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
  //   fecha_hasta: moment().endOf('month').format('YYYY-MM-DD'),
  // }

  loading: boolean;
  totalRecords: number;
  first: number = 0;
  rows: number = 50;
  pageIndex: number = 1;
  pageSize: number = 5;
  pageSizeOptions: number[] = [50,100,200];

  constructor(
    private apiService: ReporteService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsRenConsultaReporte",
        paramAccion: "",
        boton: { icon: "far fa-file-pdf", texto: "PDF" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      },
      ,
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
    this.paginate = {
      length: 0,
      perPage: 7,
      page: 1,
      pageSizeOptions: [5, 10,20,50]
    }
    this.filter= {
      selectedEstado: '',
      selectedConcepto: ' ',
      fecha_desde: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).endOf('month').format('YYYY-MM-DD'),
      razon_social: ' ',
      reporte: '',
      fk_contribuyente: 0
    }

    setTimeout(() => {
      this.getConceptos()
    }, 75)
    setTimeout(() => {this.getTiposReporte()}, 75)
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "PDF":
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

    if(this.selectedReporte=='rpt_titulos_emitidos_detalle'){
      this.tblTitulosEmiDet.first = 0
    }
    if(this.selectedReporte=='rpt_emision_detallada_dia'){
      this.tblEmiDetalladaDia.first = 0
    }
    if(this.selectedReporte=='rpt_emision_predios_urbanos'){
      this.tblEmiPredUrb.first = 0
    }
    if(this.selectedReporte=='rpt_titulos_emitidos'){
      this.tblTitulosEmitidos.first = 0
    }
    if(this.selectedReporte=='rpt_resumen_anulacion'){
      this.tblResumenAnulacion.first = 0
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



  getTipoReportes() {
    (this as any).mensajeSpinner = 'Cargando Tipo de Reportes';
    this.lcargando.ctlSpinner(true);
    let data = {
        modulo: 16,
        submodulo:0
    };
    this.apiService.getTiposReporte(data).subscribe(
      (res: any) => {
        console.log(res.data);
        res.data.forEach((element: any) => {
          let o = {
            id: element.id_reporte,
            name: element.descripcion,
            modulo: element.modulo,
            submodulo: element.submodulo,
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

  getConceptos() {
    (this as any).mensajeSpinner = 'Cargando Conceptos';
    this.lcargando.ctlSpinner(true);
    this.apiService.getConceptosDet().subscribe(
      (res: any) => {
        console.log(res.data);
        res.data.forEach((element: any) => {
          let o = {
            id: element.id_concepto,
            name: element.nombre,
            codigo: element.codigo
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

  cargarConsultaReportes(){
    this.loading = true;
    console.log(this.filter);
        (this as any).mensajeSpinner = 'Cargando...';
        // this.lcargando.ctlSpinner(true);
        this.filter.reporte = this.selectedReporte

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
              //this.dataReportes = res.data;
              this.dataReportes = res.data.data;
              this.totalRecords= res.data?.total[0]?.count
              if(this.filter.reporte =='rpt_titulos_emitidos_detalle'){
                this.totalGeneralTitulosEmi= res.data.total[0].total_general
                this.saldoGeneralTitulosEmi= res.data.total[0].total_saldo
                //this.titulosEmiTotales()
              }
              if(this.filter.reporte =='rpt_emision_detallada_dia'){
                this.totalGeneralEmiDetDia = res.data.total[0].total_general
                //this.emiDetDiaTotales()
              }
              if(this.filter.reporte == 'rpt_emision_predios_urbanos'){
                this.countTitulos = res.data.total[0].count
                this.totalImpPrin =  res.data.total[0].total_imp
                this.totalSolNoEdif = res.data.total[0].total_solar_no_efificado
                this.totalConEspMe = res.data.total[0].total_cem
                this.totalConEsp =  res.data.total[0].total_cem2022
                this.totalTasaAdm = res.data.total[0].total_sta
                this.totalEmiPreUrb =  res.data.total[0].total_general
                this.totalAseoCalle = res.data.total[0].total_aseo_calle
                //this.totalesEmiPredUrb()
              }
              if(this.filter.reporte == 'rpt_titulos_emitidos'){
                this.totaGeneralTituEmi= res.data.total[0].total_general
                //this.totalesTituEmi()
              }
              if(this.filter.reporte == 'rpt_resumen_anulacion'){
                this.cantTituAnuGneral = res.data.total[0].count
                this.totaGeneralTituAnu= res.data.total[0].total_general
                //this.totalGeneralTitulosAnu()
              }
              this.loading = false;
             // this.lcargando.ctlSpinner(false);
             }
             else{
              this.dataReportes =[];
              this.loading = false;
             // this.lcargando.ctlSpinner(false);
             }
          },
          (err: any) => {
            console.log(err);
            this.loading = false;
           // this.lcargando.ctlSpinner(false);
          }
        )

      }
  calculoTotalTitulosEmi(name) {
    let total = 0;

    if (this.dataReportes.length > 0) {
      for (let datos of this.dataReportes) {
          if (datos.nombre == name ) {
            total += parseFloat(datos.total);
          }
      }
    }

    return total;
  }
  calculoSaldoTitulosEmi(name){
    let saldo = 0;
    if (this.dataReportes.length > 0) {
      for (let datos of this.dataReportes) {
          if (datos.nombre == name ) {
            saldo += parseFloat(datos.saldo);
          }
      }
    }
    return saldo;
  }
  titulosEmiTotales() {
    let total = 0;
    let saldo = 0;

    if (this.dataReportes.length > 0) {
      for (let datos of this.dataReportes) {
            total += parseFloat(datos.total);
            saldo += parseFloat(datos.saldo);
      }
    }
    this.totalGeneralTitulosEmi= total
    this.saldoGeneralTitulosEmi= saldo
  }

  emiDetDiaTotales(){
    let total = 0;

    if (this.dataReportes.length > 0) {
      for (let datos of this.dataReportes) {
            total += parseFloat(datos.total);
      }
    }
    this.totalGeneralEmiDetDia = total
  }

  calculoTotalEmiDetDia(name){
    let total = 0;

    if (this.dataReportes.length > 0) {
      for (let datos of this.dataReportes) {
          if (datos.concepto == name ) {
            total += parseFloat(datos.total);
          }
      }
    }

    return total;
  }

  calculoTituEmiTotal(name){
    let total = 0;

    if (this.dataReportes.length > 0) {
      for (let datos of this.dataReportes) {
          if (datos.rubros == name ) {
            total += parseFloat(datos.total);
          }
      }
    }
    return total;
  }


  totalesEmiPredUrb(){
    let count = 0
    let totalImpPrin = 0;
    let totalSolNoEdif = 0;
    let totalConEspMe = 0;
    let totalConEsp = 0;
    let totalTasaAdm = 0;
    let total = 0;

    if (this.dataReportes.length > 0) {
      for (let datos of this.dataReportes) {
            count += 1
            totalImpPrin += parseFloat(datos.total_imp);
            totalSolNoEdif += parseFloat(datos.total_solar_no_efificado);
            totalConEspMe += parseFloat(datos.total_cem);
            totalConEsp += parseFloat(datos.total_cem2022);
            totalTasaAdm += parseFloat(datos.total_sta);
            total += parseFloat(datos.total);
      }
    }

    this.countTitulos = count
    this.totalImpPrin = totalImpPrin
    this.totalSolNoEdif = totalSolNoEdif
    this.totalConEspMe = totalConEspMe
    this.totalConEsp = totalConEsp
    this.totalTasaAdm = totalTasaAdm
    this.totalEmiPreUrb = total
  }

  totalesTituEmi(){

    let total = 0;

    if (this.dataReportes.length > 0) {
      for (let datos of this.dataReportes) {
            total += parseFloat(datos.total);
      }
    }
    this.totaGeneralTituEmi= total

  }

  cantidadTitulosAnula(name){
    let cant = 0;

    if (this.dataReportes.length > 0) {
      for (let datos of this.dataReportes) {
          if (datos.nombre2 == name ) {
            cant += 1;
          }
      }
    }
    return cant;
  }
  calculoTitulosAnula(name){
    let total = 0;

    if (this.dataReportes.length > 0) {
      for (let datos of this.dataReportes) {
          if (datos.nombre2 == name ) {
            total += parseFloat(datos.total);
          }
      }
    }
    return total;
  }

  totalGeneralTitulosAnu(){
    let total = 0;
    let cant = 0;

    if (this.dataReportes.length > 0) {
      for (let datos of this.dataReportes) {
            cant += 1;
            total += parseFloat(datos.total);
      }
    }
    this.cantTituAnuGneral = cant
    this.totaGeneralTituAnu= total
  }


  mostrarReporte(){
    console.log(this.selectedReporte);
    console.log(this.fecha_desde);
    console.log(this.fecha_hasta);
    console.log(this.selectedConcepto);
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
          console.log(o);
          //this.reportes.push({ ...o });
          if (element.reporte == this.selectedReporte){
            console.log('desde: '+element.fecha_desde);
            console.log('hasta: '+element.fecha_hasta);

            window.open(environment.ReportingUrl +`${element.reporte}`+".pdf?&j_username=" + environment.UserReporting
            + "&j_password=" + environment.PasswordReporting+"&fechaInicio=" + this.filter.fecha_desde + "&fechaFin=" + this.filter.fecha_hasta +"&concepto="+this.filter.selectedConcepto , '_blank')
            //window.open(environment.ReportingUrl + "rep_tasas_plusvalia.pdf?&j_username=" + environment.UserReporting +
            //"&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.id_liquidacion + "&forma_pago=" + this.pagos[0].tipo_pago_lbl , '_blank')
            console.log(environment.ReportingUrl +`${element.reporte}`+".pdf?&j_username=" + environment.UserReporting
            + "&j_password=" + environment.PasswordReporting+"&fechaInicio=" + this.filter.fecha_desde + "&fechaFin=" + this.filter.fecha_hasta+"&concepto="+this.filter.selectedConcepto);
          }
        });

      },
      (err: any) => {
        console.log(err);
        this.lcargando.ctlSpinner(false);
      }
    )

  }

  /*
  mostrarReporte() {
    let reporteUrl: string = `${environment.baseUrl}/reports/reporte-jasper?reporte=${this.selectedReporte}&concepto=${this.selectedConcepto}&fecha_desde=${this.fecha_desde}`
    // console.log(reporteUrl)
    window.open(reporteUrl, "_blank")
  }
   */

  btnExportar() {
    console.log(this.selectedReporte);
    console.log(this.fecha_desde);
    console.log(this.fecha_hasta);
    console.log(this.selectedConcepto);
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
          console.log(o);
          //this.reportes.push({ ...o });
          if (element.reporte == this.selectedReporte){
            console.log('desde: '+element.fecha_desde);
            console.log('hasta: '+element.fecha_hasta);

            window.open(environment.ReportingUrl +`${element.reporte}`+".xlsx?&j_username=" + environment.UserReporting
            + "&j_password=" + environment.PasswordReporting+"&fechaInicio=" + this.filter.fecha_desde + "&fechaFin=" + this.filter.fecha_hasta +"&estado="+"A"+"&concepto="+this.filter.selectedConcepto , '_blank')
            //window.open(environment.ReportingUrl + "rep_tasas_plusvalia.pdf?&j_username=" + environment.UserReporting +
            //"&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.id_liquidacion + "&forma_pago=" + this.pagos[0].tipo_pago_lbl , '_blank')
            console.log(environment.ReportingUrl +`${element.reporte}`+".xlsx?&j_username=" + environment.UserReporting
            + "&j_password=" + environment.PasswordReporting+"&fechaInicio=" + this.filter.fecha_desde + "&fechaFin=" + this.filter.fecha_hasta+"&estado="+"A"+"&concepto="+this.filter.selectedConcepto);
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
    this.dataReportes = [];
    this.limpiarTotales()
  }

  limpiarFiltros() {
    Object.assign(this.filter, {
      selectedConcepto: ' ',
      fecha_desde: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
      fecha_hasta: moment().endOf('month').format('YYYY-MM-DD')

  })
}
limpiarTotales(){
  this.totalGeneralTitulosEmi = 0
  this.saldoGeneralTitulosEmi  = 0

  this.totalGeneralEmiDetDia  = 0

  this.countTitulos = 0
  this.totalImpPrin = 0
  this.totalSolNoEdif = 0
  this.totalConEspMe = 0
  this.totalConEsp = 0
  this.totalTasaAdm = 0
  this.totalEmiPreUrb = 0
  this.totalAseoCalle = 0

  this.totaGeneralTituEmi = 0
  this.totaGeneralTituAnu = 0
  this.cantTituAnuGneral = 0
}


}
