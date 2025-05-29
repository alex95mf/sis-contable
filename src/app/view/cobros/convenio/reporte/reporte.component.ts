import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { environment } from 'src/environments/environment';
import { ButtonRadioActiveComponent } from '../../../../config/custom/cc-panel-buttons/button-radio-active.component';
import * as moment from 'moment';
import { ReporteService } from './reporte.service';

@Component({
standalone: false,
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.scss']
})
export class ReporteComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent; 
  fTitle: string = "Consulta de Reportes";
  msgSpinner: string;
  vmButtons: any[] = [];
  dataUser: any;
  permissions: any;
  documento: any = {
    tipo_documento: "", // concepto.codigo

  }

  reportes: any[] = [];

  selectedReporte: any = undefined;
  selectedConcepto: any = undefined;
  today = moment(new Date()).format('YYYY-MM-DD');
  fecha_desde: string = moment(this.today).startOf('month').format('YYYY-MM-DD');
  fecha_hasta: string = moment(this.today).endOf('month').format('YYYY-MM-DD');

  constructor(    
    private apiService: ReporteService,
    private toastr: ToastrService,) { }

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
    ];

    setTimeout(() => {
      this.getTiposReporte()
    }, 75)
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "IMPRIMIR":
        this.mostrarReporte()
        break;
    
      default:
        break;
    }
  }

  mostrarReporte(){
    this.apiService.getTiposReporte().subscribe(
      (res: any) => {
         console.log(res.data);
        res.data.forEach((element: any) => {
          let o = {
            created_at: element.created_at,
            descripcion: element.descripcion,
            reporte: element.reporte
          };
          //this.reportes.push({ ...o });
          window.open(environment.ReportingUrl +`${element.reporte}`+"?&j_username=" + environment.UserReporting 
          + "&j_password=" + environment.PasswordReporting, '_blank')
        });
        this.lcargando.ctlSpinner(false);
      },
      (err: any) => {
        console.log(err);
        this.lcargando.ctlSpinner(false);
      }
    )
      //let reporteUrl: string = `${environment.baseUrl}rpt_ren_listado_locales_municipales.pdf?reporte=${this.selectedReporte}`
      //window.open(reporteUrl, "_blank")

      
      //window.open(environment.ReportingUrl + "rpt_ren_listado_locales_municipales.pdf?reporte=${this.selectedReporte} , '_blank')
    
    
    
    
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
}
