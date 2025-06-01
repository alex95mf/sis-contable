import { Component, OnInit,ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { environment } from 'src/environments/environment';
import { ButtonRadioActiveComponent } from '../../../../config/custom/cc-panel-buttons/button-radio-active.component';
import * as moment from 'moment';
import { ActaFiniquitoService } from '../acta-finiquito/acta-finiquito.service'; 
import { Table } from 'primeng/table';
import { LazyLoadEvent, MessageService, PrimeNGConfig } from 'primeng/api';

@Component({
standalone: false,
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent; 
  @ViewChild('tblRrhhDistributivo') tblRrhhDistributivo: Table
  @ViewChild('tblRrhhDirectorio') tblRrhhDirectorio: Table
  @ViewChild('tblRrhhRemuneracion') tblRrhhRemuneracion: Table
  
  fTitle: string = "Reportes de LOTAIP";
  msgSpinner: string;

  vmButtons: any[] = [];
  dataUser: any;
  arrayData2: any=[];
  permissions: any;
  excelData: any [];
  documento: any = {
    tipo_documento: "", // concepto.codigo
  }

  reportes: any[] = [];
  paginate: any;

  dataReportes : any[] = []

    cmb_periodo: any[] = []

  loading: boolean;
  totalRecords: number;
  first: number = 0;
  rows: number = 50;
  pageIndex: number = 1;
  pageSize: number = 5;
  pageSizeOptions: number[] = [50,100,200];
 
  filter: any = {
    selectedConcepto: ' ',
    selectedCaja: ' ',
    periodo: ' ',
    reporte: '',
    mes: 0,

  }


  selectedReporte: any = undefined;
  selectedConcepto: any = ' ';
  periodo: any = ' ';
  today = moment(new Date()).format('YYYY-MM-DD');
  arrayMes: any =
  [
    {
      id: "0",
      name: "-Todos-"
    },{
      id: "1",
      name: "Enero"
    },
    {
      id: "2",
      name: "Febrero"
    },
    {
      id: "3",
      name: "Marzo"
    },
    {
      id: "4",
      name: "Abril"
    },
    {
      id: "5",
      name: "Mayo"
    },
    {
      id: "6",
      name: "Junio"
    },
    {
      id: "7",
      name: "Julio"
    },
    {
      id: "8",
      name: "Agosto"
    },

    {
      id: "9",
      name: "Septiembre"
    },
    {
      id: "10",
      name: "Octubre"
    },
    {
      id: "11",
      name: "Noviembre"
    },
    {
      id: "12",
      name: "Diciembre"
    },
  ];
  mes_actual



  constructor(
    private apiService: ActaFiniquitoService,
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
    this.filter.periodo  = moment(new Date()).format("YYYY");
    this.mes_actual = (Number(moment(new Date()).format('MM'))).toString();

    setTimeout(async () => {
      this.getTiposReporte()
      await this.cargaInicial()
    }, 75);
    
  }
  ChangeMesCierrePeriodos(evento: any) { this.mes_actual = evento; }
  periodoSelected(evt: any, year:any){
    console.log(evt.getFullYear())
    this.filter.periodo = evt.getFullYear();
  }

  async cargaInicial() {
    try {
      this.msgSpinner = "Cargando..."
      const resPeriodos = await this.apiService.getPeriodos()
      console.log(resPeriodos)
      this.cmb_periodo = resPeriodos
    } catch (err) {
      console.log(err)
      this.toastr.warning(err.error?.message, 'Error en Carga Inicial')
    }
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
    if(this.selectedReporte=='rpt_rrhh_distributivo'){
      this.tblRrhhDistributivo.first = 0
    }
    if(this.selectedReporte=='rpt_rrhh_directorio'){
      this.tblRrhhDirectorio.first = 0
    }
    if(this.selectedReporte=='rpt_rrhh_remuneracion'){
      this.tblRrhhRemuneracion.first = 0
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

    this.loading = true
    if (
      this.selectedReporte == 0 || this.selectedReporte == undefined  ||  this.selectedReporte == ' '
    ) {
      this.toastr.info('Debe elegir un Reporte');
      return;
    }
    if (
      this.filter.periodo == 0 || this.filter.periodo== undefined  ||  this.filter.periodo == ' '
    ) {
      this.toastr.info('Debe ingresar un Período');
      return;
    }
   
      this.msgSpinner = 'Cargando...';
      //this.lcargando.ctlSpinner(true);
      this.filter.reporte = this.selectedReporte 
      this.filter.mes = this.mes_actual

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

  
  mostrarReporte(){
    console.log(this.filter.periodo)
    if (
      this.selectedReporte == 0 || this.selectedReporte == undefined  ||  this.selectedReporte == ' '
    ) {
      this.toastr.info('Debe elegir un Reporte');
      return;
    }
    if (
      this.filter.periodo == 0 || this.filter.periodo== undefined  ||  this.filter.periodo == ' '
    ) {
      this.toastr.info('Debe ingresar un Período');
      return;
    }
    console.log(this.selectedReporte);
    //console.log(this.fecha_desde);
    //console.log(this.fecha_hasta);
    this.apiService.getTiposReporteNomina().subscribe(
      (res: any) => {
         console.log(res.data);
         var variable: "";
        res.forEach((element: any) => {
          let o = {
            created_at: element.created_at,
            descripcion: element.descripcion,
            reporte: element.reporte
          };
          //this.reportes.push({ ...o });
          console.log(this.selectedReporte);
          if (element.reporte == this.selectedReporte){
            console.log(this.filter.periodo);
            window.open(environment.ReportingUrl +`${element.reporte}`+".pdf?&j_username=" + environment.UserReporting 
            + "&j_password=" + environment.PasswordReporting+"&p_anio=" + this.filter.periodo+"&p_mes=" + this.mes_actual, '_blank')
            //window.open(environment.ReportingUrl + "rep_tasas_plusvalia.pdf?&j_username=" + environment.UserReporting + 
            //"&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.id_liquidacion + "&forma_pago=" + this.pagos[0].tipo_pago_lbl , '_blank')
            console.log(environment.ReportingUrl +`${element.reporte}`+".pdf?&j_username=" + environment.UserReporting 
            + "&j_password=" + environment.PasswordReporting+"&p_anio=" + this.filter.periodo+"&p_mes=" + this.mes_actual);
          }
        });

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
    this.apiService.getTiposReporteNomina().subscribe(
      (res: any) => {
         console.log(res);
        res.forEach((element: any) => {
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

  btnExportar() {

    if (
      this.selectedReporte == 0 || this.selectedReporte == undefined  ||  this.selectedReporte == ' '
    ) {
      this.toastr.info('Debe elegir un Reporte');
      return;
    }
    if (
      this.selectedReporte == 0 || this.selectedReporte == undefined  ||  this.selectedReporte == ' '
    ) {
      this.toastr.info('Debe ingresar un Perìodo');
      return;
    }
    console.log(this.selectedReporte);
    //console.log(this.fecha_desde);
    //console.log(this.fecha_hasta);
    this.apiService.getTiposReporteNomina().subscribe(
      (res: any) => {
         console.log(res.data);
         var variable: "";
        res.forEach((element: any) => {
          let o = {
            created_at: element.created_at,
            descripcion: element.descripcion,
            reporte: element.reporte
          };
          //this.reportes.push({ ...o });
          if (element.reporte == this.selectedReporte){
            window.open(environment.ReportingUrl +`${element.reporte}`+".xlsx?&j_username=" + environment.UserReporting 
            + "&j_password=" + environment.PasswordReporting+"&p_anio=" + this.filter.periodo+"&p_mes=" + this.mes_actual, '_blank')

            console.log(environment.ReportingUrl +`${element.reporte}`+".xlsx?&j_username=" + environment.UserReporting 
            + "&j_password=" + environment.PasswordReporting+"&p_anio=" + this.filter.periodo+"&p_mes=" + this.mes_actual);

          }
        });

      },
      (err: any) => {
        console.log(err);
        this.lcargando.ctlSpinner(false);
      }
    )
    
  }

  limpiarFiltros() {
    Object.assign(this.filter, {
      selectedConcepto: ' ',
      selectedCaja: ' ',
      fecha_desde: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
      fecha_hasta: moment().endOf('month').format('YYYY-MM-DD')

  })
}
}
