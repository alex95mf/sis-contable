
import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { environment } from 'src/environments/environment';
import { ButtonRadioActiveComponent } from '../../../../config/custom/cc-panel-buttons/button-radio-active.component';
import * as moment from 'moment';
import { ReporteService } from './reporte.service';
@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.scss']
})
export class ReporteComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent; 
  fTitle: string = "Consulta de Reportes";
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

  reportes: any[] = [];
  conceptos: any[] = [];
  cajas: any[] = [];
  filter: any = {
    selectedConcepto: ' ',
    selectedCaja: ' ',
    periodo:'',
    //fecha_desde: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
    //fecha_hasta: moment().endOf('month').format('YYYY-MM-DD'),
  }


  selectedReporte: any = undefined;
  selectedConcepto: any = ' ';
  periodo: any = ' ';
  //selectedCaja: any = ' ';
  today = moment(new Date()).format('YYYY-MM-DD');
  //fecha_desde: string = moment(this.today).startOf('month').format('YYYY-MM-DD');
  //fecha_hasta: string = moment(this.today).endOf('month').format('YYYY-MM-DD');


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

    setTimeout(() => {
      this.getTiposReporte()
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

  
  mostrarReporte(){
    if (
      this.selectedReporte == 0 || this.selectedReporte == undefined  ||  this.selectedReporte == ' '
    ) {
      this.toastr.info('Debe elegir un Reporte');
      return;
    }
    if (
      this.filter.periodo == 0 || this.filter.periodo== undefined  ||  this.filter.periodo == ' '
    ) {
      this.toastr.info('Debe ingresar un Perìodo');
      return;
    }
    console.log(this.selectedReporte);
    //console.log(this.fecha_desde);
    //console.log(this.fecha_hasta);
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
          if (element.descripcion == this.selectedReporte){
            console.log(this.filter.periodo);
            window.open(environment.ReportingUrl +`${element.reporte}`+".pdf?&j_username=" + environment.UserReporting 
            + "&j_password=" + environment.PasswordReporting+"&periodo=" + this.filter.periodo, '_blank')
            //window.open(environment.ReportingUrl + "rep_tasas_plusvalia.pdf?&j_username=" + environment.UserReporting + 
            //"&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.id_liquidacion + "&forma_pago=" + this.pagos[0].tipo_pago_lbl , '_blank')
            console.log(environment.ReportingUrl +`${element.reporte}`+".pdf?&j_username=" + environment.UserReporting 
            + "&j_password=" + environment.PasswordReporting+"&periodo=" + this.filter.periodo);
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
            + "&j_password=" + environment.PasswordReporting+"&periodo=" + this.filter.periodo, '_blank')

            console.log(environment.ReportingUrl +`${element.reporte}`+".xlsx?&j_username=" + environment.UserReporting 
            + "&j_password=" + environment.PasswordReporting+"&periodo=" + this.filter.periodo);

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
