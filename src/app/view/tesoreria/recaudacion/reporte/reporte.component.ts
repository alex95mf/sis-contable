import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { environment } from 'src/environments/environment';
import { ButtonRadioActiveComponent } from '../../../../config/custom/cc-panel-buttons/button-radio-active.component';
import { ExcelService } from 'src/app/services/excel.service';
import * as moment from 'moment';
import { ReporteService } from './reporte.service';
import { LazyLoadEvent, MessageService, PrimeNGConfig } from 'primeng/api';
import { Table } from 'primeng/table';


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
  @ViewChild('tblPropiosAjenos') tblPropiosAjenos: Table
  @ViewChild('tblTitulosRecaudados') tblTitulosRecaudados: Table
  @ViewChild('tblRecDetallada') tblRecDetallada: Table
  @ViewChild('tblEspecialCanjes') tblEspecialCanjes: Table
  @ViewChild('tblEspeciesFiscales') tblEspeciesFiscales: Table
  @ViewChild('tblDescuentosDet') tblDescuentosDet: Table
  @ViewChild('tblExpedientesRec') tblExpedientesRec: Table
  @ViewChild('tblRecTitulosCaja') tblRecTitulosCaja: Table
  @ViewChild('tblRecGarantias') tblRecGarantias: Table
  
  fTitle: string = "Reportes de Tesorería";
  msgSpinner: string;
  conceptosDisabled = false;
  cajasDisabled = false;
  fechaHastaDisabled = false;
  fechaDesdeDisabled = false;
  variableFiltro: any;
  vmButtons: any[] = [];
  dataUser: any;
  arrayData2: any=[];
  permissions: any;
  excelData: any [];
  documento: any = {
    tipo_documento: "", // concepto.codigo

  }
  dataReportes : any[] = []
  dataDetallesReportes : any[] = []
  reportes: any[] = [];
  conceptos: any[] = [];
  cajas: any[] = [];
  paginate: any;
  filter: any 
  // filter: any = {
  //   selectedConcepto: '*',
  //   selectedCaja: ' ',
  //   fecha_desde: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
  //   fecha_hasta: moment().endOf('month').format('YYYY-MM-DD'),
  // }

  loading: boolean;
  totalRecords: number;
  first: number = 0;
  rows: number = 50;
  pageIndex: number = 1;
  pageSize: number = 5;
  pageSizeOptions: number[] = [30,50,100,200];


  selectedReporte: any = undefined;
  selectedConcepto: any = ' ';
  selectedCaja: any = ' ';
  today = moment(new Date()).format('YYYY-MM-DD');
  fecha_desde: string = moment(this.today).startOf('month').format('YYYY-MM-DD');
  fecha_hasta: string = moment(this.today).endOf('month').format('YYYY-MM-DD');

 

  totalFondProAje:any = 0

  cantGeneralTituRec: any = 0
  nominalGeneralTituRec: any = 0
  rebajaGeneralTituRec: any = 0
  totalGeneralTituRec: any = 0

  totalGeneralRecDet: any = 0
  totalGeneralEspFisca: any = 0

  totalGeneralDescDet: any = 0

  cantGeneralExpRec: any = 0
  valorGeneralExpRec: any = 0
  interesGeneralExpRec: any = 0
  totalGeneralExpRec: any = 0
  coactivaGeneralExpRec : any = 0

  cantGenTituRecCaja: any = 0
  valorGenTituRecCaja: any = 0
  interesGenTituRecCaja: any = 0
  totalGenTituRecCaja: any = 0
  coactivaGenTituRecCaja: any = 0

  totalDetEspCanje: any = 0
  
  constructor(
    private apiService: ReporteService,
    private toastr: ToastrService,
    private excelService: ExcelService,
  ) { }
  @ViewChild(ButtonRadioActiveComponent, { static: false }) buttonRadioActiveComponent: ButtonRadioActiveComponent;

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
      selectedConcepto: '*',
      selectedCaja: ' ',
      fecha_desde: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).endOf('month').format('YYYY-MM-DD'),
      razon_social: ' ',
      reporte: '',
    }
    this.conceptos = [
      {codigo: 'EF',nombre: 'ESPECIES FISCALES',id_concepto: 0},
      {codigo: 'GA',nombre: 'GARANTIA DE MERCADO',id_concepto: 0},
      {codigo: 'COST',nombre: 'COSTAS',id_concepto: 0}
    ]

    setTimeout(() => {
      this.getTiposReporte()
    }, 75)
    setTimeout(() => {
      this.getConceptosReporte()
    }, 75)
    setTimeout(() => {
    this.getCajasReporte()
  }, 75)
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

  mostrar() {
    //let reporteUrl: string = `${environment.baseUrl}reports/reporte-jasper?reporte=${this.selectedReporte}`
    // console.log(reporteUrl)
    //window.open(reporteUrl, "_blank")
    console.log(this.selectedReporte);
    window.open(environment.ReportingUrl +`${this.selectedReporte}`+"?&j_username=" + environment.UserReporting 
    + "&j_password=" + environment.PasswordReporting, '_blank')
    this.lcargando.ctlSpinner(false);
  }
 // "rep_cpinfimas_orden_compra.pdf?&j_username=" + environment.UserReporting + "

  //rpt_ren_listado_locales_municipales.pdf
  //imprimirOrden(){
    //console.log()
      //window.open(environment.ReportingUrl + "rep_cpinfimas_orden_compra.pdf?&j_username=" + environment.UserReporting 
      //+ "&j_password=" + environment.PasswordReporting + "&id_solicitud=" + this.item.id_solicitud , '_blank')
  //}
  consultar() {
    if(this.selectedReporte=='rpt_fondos_propios_ajenos'){
      this.tblPropiosAjenos.first = 0
    }
    if(this.selectedReporte=='rpt_titulos_recaudados'){
      this.tblTitulosRecaudados.first = 0
    }
    if(this.selectedReporte=='rpt_recaudacion_detallada1'){
      this.tblRecDetallada.first = 0
    }
    if(this.selectedReporte=='rpt_especial_canjes'){
      this.tblEspecialCanjes.first = 0
    }
    if(this.selectedReporte=='rpt_especial_especies_fiscales'){
      this.tblEspeciesFiscales.first = 0
    }
    if(this.selectedReporte=='rpt_descuentos_detallados'){
      this.tblDescuentosDet.first = 0
    }
    if(this.selectedReporte=='rpt_expedientes_recaudacion'){
      this.tblExpedientesRec.first = 0
    }
    if(this.selectedReporte=='rpt_recaudacion_titulos_caja'){
      this.tblRecTitulosCaja.first = 0
    }
    if(this.selectedReporte=='rpt_recaudacion_garantias'){
      this.tblRecGarantias.first = 0
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

    this.loading = true;
    console.log(this.filter)
        this.msgSpinner = 'Cargando...';
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
             
              this.dataReportes = res.data.data;
              this.totalRecords= res.data?.total[0]?.count
              this.loading = false;
              // this.paginate.length = res['data']['total'];
              // if (res['data']['current_page'] == 1) {
              //   this.dataReportes = res['data']['data'];
              // } else {
              //   this.dataReportes = Object.values(res['data']['data']);
              // }
              if(this.filter.reporte =='rpt_fondos_propios_ajenos'){
                this.totalFondProAje = res.data.total[0].total_valor_nominal
               // this.totalFondosPropios()
              }
              if(this.filter.reporte =='rpt_titulos_recaudados'){
                this.cantGeneralTituRec = res.data.total[0].count
                this.nominalGeneralTituRec = res.data.total[0].total_nominal
                this.rebajaGeneralTituRec = res.data.total[0].total_rebaja
                this.totalGeneralTituRec = res.data.total[0].total_general
               // this.totalGeneralTitutulosRec()
              }
              if(this.filter.reporte == 'rpt_recaudacion_detallada1'){
                this.totalGeneralRecDet = res.data.total[0].total_general
                //this.totalGeneralRecDetallada1()
              }

              if(this.filter.reporte == 'rpt_especial_canjes'){
                this.cargarDetallesEspecialCanjes()
              }
              if(this.filter.reporte == 'rpt_especial_especies_fiscales'){
                this.totalGeneralEspFisca= res.data.total[0].total_general
                //this.totalGeneralEspeciesFiscales()
              }
              if(this.filter.reporte == 'rpt_descuentos_detallados'){
                this.totalGeneralDescDet = res.data.total[0].total_general
                //this.totalGeneralDescuentoDetallado()
              }
              if(this.filter.reporte == 'rpt_expedientes_recaudacion'){

                this.cantGeneralExpRec= res.data.total[0].count
                this.valorGeneralExpRec=res.data.total[0].total_valor
                this.interesGeneralExpRec=res.data.total[0].total_interes
                this.totalGeneralExpRec=res.data.total[0].total_general
                this.coactivaGeneralExpRec=res.data.total[0].total_coactiva
                //this.totalesExpRec()
              }
              if(this.filter.reporte == 'rpt_recaudacion_titulos_caja'){
                this.cantGenTituRecCaja= res.data.total[0].count
                this.valorGenTituRecCaja=res.data.total[0].total_valor
                this.interesGenTituRecCaja=res.data.total[0].total_interes
                this.totalGenTituRecCaja=res.data.total[0].total_general
                this.coactivaGenTituRecCaja=res.data.total[0].total_coactiva
                //this.totalesTitulosRecCaja()
              }
            

              // this.lcargando.ctlSpinner(false);
             }
             else{
              this.dataReportes =[]
              this.loading = false;
              // this.lcargando.ctlSpinner(false);
             }
          },
          (err: any) => {
            console.log(err);
            // this.lcargando.ctlSpinner(false);
            this.loading = false;
          }
        )
        
      }

      cargarDetallesEspecialCanjes(){
        this.loading = true;
        this.msgSpinner = 'Cargando...';
        // this.lcargando.ctlSpinner(true);
        this.filter.reporte = this.selectedReporte 
    
        let data= {
          params: {
            filter: this.filter,
            paginate: this.paginate,
            
          }
        }
        this.apiService.getConsultaDetEspCanjes(data).subscribe(
          (res: any) => {
            this.loading = false;
            console.log(res);
            if(res.status==1){
              this.dataDetallesReportes = res.data;

              let total = 0;
              if (this.dataDetallesReportes.length > 0) {
                for (let datos of this.dataDetallesReportes) {
                      total += parseFloat(datos.valor_cobrado);
                }
              }
              this.totalDetEspCanje= total
            }
          })
      }




      totalFondosPropios(){
        let total = 0;
        if (this.dataReportes.length > 0) {
          for (let datos of this.dataReportes) {
                total += parseFloat(datos.valor_nominal);
          }
        }
        this.totalFondProAje= total
       
      }

      cantTitulosRecaudados(name) {
        let cant = 0;
        if (this.dataReportes.length > 0) {
          for (let datos of this.dataReportes) {
              if (datos.rubros == name ) {
                cant += 1;
              }
          }
        }
        return cant;
      }
      nominalTitulosRecaudados(name) {
        let nominal = 0;
        if (this.dataReportes.length > 0) {
          for (let datos of this.dataReportes) {
              if (datos.rubros == name ) {
                nominal += parseFloat(datos.nominal);
              }
          }
        }
        return nominal;
      }
      rebajaTitulosRecaudados(name) {
        let rebaja = 0;
        if (this.dataReportes.length > 0) {
          for (let datos of this.dataReportes) {
              if (datos.rubros == name ) {
                rebaja += parseFloat(datos.rebaja);
              }
          }
        }
        return rebaja;
      }
      totalTitulosRecaudados(name) {
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

      totalGeneralTitutulosRec(){
        let cant = 0;
        let nominal = 0;
        let rebaja = 0;
        let total = 0;

        if (this.dataReportes.length > 0) {
          for (let datos of this.dataReportes) {
                cant += 1;
                nominal += parseFloat(datos.nominal);
                rebaja += parseFloat(datos.rebaja);
                total += parseFloat(datos.total);
          }
        }
        this.cantGeneralTituRec= cant
        this.nominalGeneralTituRec= nominal
        this.rebajaGeneralTituRec= rebaja
        this.totalGeneralTituRec= total

       
      }

      totalRecDet1(name){
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

      
      totalGeneralRecDetallada1(){
        let total = 0;
        if (this.dataReportes.length > 0) {
          for (let datos of this.dataReportes) {
                total += parseFloat(datos.total);
          }
        }
        this.totalGeneralRecDet= total
      }


      totalMontoEspCanjes(name){
        let total = 0;
        if (this.dataReportes.length > 0) {
          for (let datos of this.dataReportes) {
              if (datos.documento == name ) {
                total += parseFloat(datos.valor_cobrado);
              }
          }
        }
        return total;
      }
      totalEspeciesFisca(name){
        let total = 0;
        if (this.dataReportes.length > 0) {
          for (let datos of this.dataReportes) {
              if (datos.tipo_especie == name ) {
                total += parseFloat(datos.total);
              }
          }
        }
        return total;
      }   
      totalGeneralEspeciesFiscales(){
        let total = 0;
        if (this.dataReportes.length > 0) {
          for (let datos of this.dataReportes) {
                total += parseFloat(datos.total);
          }
        }
        this.totalGeneralEspFisca= total
      }

      totalDescDet(name){
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
      totalGeneralDescuentoDetallado(){
        let total = 0;
        if (this.dataReportes.length > 0) {
          for (let datos of this.dataReportes) {
                total += parseFloat(datos.total);
          }
        }
        this.totalGeneralDescDet= total
      }

      valorExpRec(name){
        let valor = 0;
        if (this.dataReportes.length > 0) {
          for (let datos of this.dataReportes) {
              if (datos.abogado == name ) {
                valor += parseFloat(datos.valor);
              }
          }
        }
        return valor;
      }
      interesExpRec(name){
        let interes = 0;
        if (this.dataReportes.length > 0) {
          for (let datos of this.dataReportes) {
              if (datos.abogado == name ) {
                interes += parseFloat(datos.interes);
              }
          }
        }
        return interes;
      }
      totalExpRec(name){
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
      coactivaExpRec(name){
        let coactiva = 0;
        if (this.dataReportes.length > 0) {
          for (let datos of this.dataReportes) {
              if (datos.abogado == name ) {
                coactiva += parseFloat(datos.coactiva);
              }
          }
        }
        return coactiva;
      }

      totalesExpRec(){
        let cant = 0;
        let valor = 0;
        let interes = 0;
        let coactiva = 0;
        let total = 0;
        if (this.dataReportes.length > 0) {
          for (let datos of this.dataReportes) {
            cant += 1;
            valor += parseFloat(datos.valor);
            interes += parseFloat(datos.interes);
            coactiva += parseFloat(datos.coactiva);
            total += parseFloat(datos.total);
          }
        }
        this.cantGeneralExpRec= cant
        this.valorGeneralExpRec=valor
        this.interesGeneralExpRec=interes
        this.totalGeneralExpRec=total
        this.coactivaGeneralExpRec=coactiva
      }

      cantTitulosRecCaja(name){
        let cant = 0;
        if (this.dataReportes.length > 0) {
          for (let datos of this.dataReportes) {
              if (datos.cajero == name ) {
                cant += 1;
              }
          }
        }
        return cant;
      }

      valorTitulosRecCaja(name){
        let valor = 0;
        if (this.dataReportes.length > 0) {
          for (let datos of this.dataReportes) {
              if (datos.cajero == name ) {
                valor += parseFloat(datos.valor);
              }
          }
        }
        return valor;
      }
      interesTitulosRecCaja(name){
        let interes = 0;
        if (this.dataReportes.length > 0) {
          for (let datos of this.dataReportes) {
              if (datos.cajero == name ) {
                interes += parseFloat(datos.interes);
              }
          }
        }
        return interes;
      }
      totalTitulosRecCaja(name){
        let total = 0;
        if (this.dataReportes.length > 0) {
          for (let datos of this.dataReportes) {
              if (datos.cajero == name ) {
                total += parseFloat(datos.total);
              }
          }
        }
        return total;
      }
      coactivaTitulosRecCaja(name){
        let coactiva = 0;
        if (this.dataReportes.length > 0) {
          for (let datos of this.dataReportes) {
              if (datos.cajero == name ) {
                coactiva += parseFloat(datos.coactiva);
              }
          }
        }
        return coactiva;
      }

      totalesTitulosRecCaja(){
        let cant = 0;
        let valor = 0;
        let interes = 0;
        let coactiva = 0;
        let total = 0;
        if (this.dataReportes.length > 0) {
          for (let datos of this.dataReportes) {
            cant += 1;
            valor += parseFloat(datos.valor);
            interes += parseFloat(datos.interes);
            coactiva += parseFloat(datos.coactiva);
            total += parseFloat(datos.total);
          }
        }
        this.cantGenTituRecCaja= cant
        this.valorGenTituRecCaja=valor
        this.interesGenTituRecCaja=interes
        this.totalGenTituRecCaja=total
        this.coactivaGenTituRecCaja=coactiva
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

     

  mostrarReporte(){
    console.log(this.selectedReporte);
    console.log(this.fecha_desde);
    console.log(this.fecha_hasta);
    if(this.filter.selectedConcepto==null){
      this.filter.selectedConcepto = '*'
    }
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
          console.log(this.selectedReporte);
          console.log('desde: '+element.fecha_desde);
          if(this.selectedReporte == 'rpt_titulos_recaudados'){
            if (element.reporte == this.selectedReporte){
              if(this.filter.selectedConcepto=='ESPECIES FISCALES'){
                this.filter.selectedConcepto='EF'
              }
              if(this.filter.selectedConcepto=='GARANTIA DE MERCADO'){
                this.filter.selectedConcepto='GA'
              }
              if(this.filter.selectedConcepto=='COSTAS'){
                this.filter.selectedConcepto='COST'
              }
  
              window.open(environment.ReportingUrl +`${element.reporte}`+".pdf?&j_username=" + environment.UserReporting 
              + "&j_password=" + environment.PasswordReporting+"&fechaInicio=" + this.filter.fecha_desde + "&fechaFin=" + this.filter.fecha_hasta
              +"&concepto="+this.filter.selectedConcepto+"&caja="+this.filter.selectedCaja, '_blank')
             
              console.log(environment.ReportingUrl +`${element.reporte}`+".pdf?&j_username=" + environment.UserReporting 
              + "&j_password=" + environment.PasswordReporting+"&fechaInicio=" + this.filter.fecha_desde + "&fechaFin=" + this.filter.fecha_hasta
              +"&concepto="+this.filter.selectedConcepto+"&caja="+this.filter.selectedCaja);
  
            }
         
          }else {
            if (element.reporte == this.selectedReporte){
              console.log('desde: '+element.fecha_desde);
              console.log('hasta: '+element.fecha_hasta);
              
              window.open(environment.ReportingUrl +`${element.reporte}`+".pdf?&j_username=" + environment.UserReporting 
              + "&j_password=" + environment.PasswordReporting+"&fechaInicio=" + this.filter.fecha_desde + "&fechaFin=" + this.filter.fecha_hasta
              +"&concepto="+this.filter.selectedConcepto+"&caja="+this.filter.selectedCaja, '_blank')
              //window.open(environment.ReportingUrl + "rep_tasas_plusvalia.pdf?&j_username=" + environment.UserReporting + 
              //"&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.id_liquidacion + "&forma_pago=" + this.pagos[0].tipo_pago_lbl , '_blank')
              console.log(environment.ReportingUrl +`${element.reporte}`+".pdf?&j_username=" + environment.UserReporting 
              + "&j_password=" + environment.PasswordReporting+"&fechaInicio=" + this.filter.fecha_desde + "&fechaFin=" + this.filter.fecha_hasta
              +"&concepto="+this.filter.selectedConcepto+"&caja="+this.filter.selectedCaja);
            }
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
    this.dataReportes = []
    this.limpiarTotales()
    if (evt !== 0) {
      this.variableFiltro=evt;
      let data2 = {
        params: `${this.variableFiltro}`,
      };
      console.log(data2);
      this.apiService.getDataTipoReporte(data2).subscribe(res => {
        console.log(res);

      if(res['data'][0].parametro_2 == '0'){
        this.conceptosDisabled=true;
      }
      else{
        this.conceptosDisabled=false;
      }

      if(res['data'][0].parametro_7== '0'){
        this.cajasDisabled=true;
      }
      else{
        this.cajasDisabled=false;
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
          
        //this.arrayData2 = res['data'];
      });
		}
    
  }


  btnExportar() {
    console.log(this.selectedReporte);
    console.log(this.fecha_desde);
    console.log(this.fecha_hasta);
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
          if (element.reporte == this.selectedReporte){
            //console.log('desde: '+element.fecha_desde);
            //console.log('hasta: '+element.fecha_hasta);
            
            window.open(environment.ReportingUrl +`${element.reporte}`+".xlsx?&j_username=" + environment.UserReporting 
            + "&j_password=" + environment.PasswordReporting+"&fechaInicio=" + this.filter.fecha_desde + "&fechaFin=" + this.filter.fecha_hasta
            +"&concepto="+this.filter.selectedConcepto+"&caja="+this.filter.selectedCaja, '_blank')
            //window.open(environment.ReportingUrl + "rep_tasas_plusvalia.pdf?&j_username=" + environment.UserReporting + 
            //"&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.id_liquidacion + "&forma_pago=" + this.pagos[0].tipo_pago_lbl , '_blank')
            console.log(environment.ReportingUrl +`${element.reporte}`+".pdf?&j_username=" + environment.UserReporting 
            + "&j_password=" + environment.PasswordReporting+"&fechaInicio=" + this.filter.fecha_desde + "&fechaFin=" + this.filter.fecha_hasta
            +"&concepto="+this.filter.selectedConcepto+"&caja="+this.filter.selectedCaja);

          }
        });

      },
      (err: any) => {
        console.log(err);
        this.lcargando.ctlSpinner(false);
      }
    )
    
  }

  getConceptosReporte(){
    this.msgSpinner = 'Cargando Tipos de Reporte';
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


  getCajasReporte(){
    this.msgSpinner = 'Cargando Cajas';
    this.lcargando.ctlSpinner(true);
    this.apiService.getCajasReporte().subscribe(
      (res: any) => {
         console.log(res.data);
        res.data.forEach((element: any) => {
          let o = {
            nombre: element.nombre,
            id_caja: element.id_caja
          };
          this.cajas.push({ ...o });
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
    this.msgSpinner = 'Cargando Tipos de Reporte';
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

  limpiarFiltros() {
    Object.assign(this.filter, {
      selectedEstado: '',
      selectedConcepto: '*',
      selectedCaja: ' ',
      fecha_desde: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).endOf('month').format('YYYY-MM-DD'),
      razon_social: ' ',
      reporte: '',

  })
}
limpiarTotales(){
  this.totalFondProAje= 0

  this.cantGeneralTituRec = 0
  this.nominalGeneralTituRec = 0
  this.rebajaGeneralTituRec = 0
  this.totalGeneralTituRec = 0

  this.totalGeneralRecDet = 0
  this.totalGeneralEspFisca = 0

  this.totalGeneralDescDet = 0

  this.cantGeneralExpRec = 0
  this.valorGeneralExpRec = 0
  this.interesGeneralExpRec = 0
  this.totalGeneralExpRec = 0
  this.coactivaGeneralExpRec  = 0

  this.cantGenTituRecCaja = 0
  this.valorGenTituRecCaja = 0
  this.interesGenTituRecCaja = 0
  this.totalGenTituRecCaja = 0
  this.coactivaGenTituRecCaja = 0

  this.totalDetEspCanje = 0
}



}
