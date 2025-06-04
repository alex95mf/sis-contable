import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js'

import { ReportesPagosService } from './reportes-pagos.service'; 
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';


@Component({
standalone: false,
  selector: 'app-reportes-pagos',
  templateUrl: './reportes-pagos.component.html',
  styleUrls: ['./reportes-pagos.component.scss']
})
export class ReportesPagosComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent; 
  fTitle: string = "Consulta de Reportes";
  mensajeSpinner: string;
  vmButtons: any[] = [];
  dataUser: any;
  permissions: any;

  tipoReportes: any[] = [
    { id: 1, name: "Conceptos" },
    { id: 2, name: "Concepto Detalle" },
    { id: 3, name: "Estado de Cuenta" },
    { id: 4, name: "Deudas" },
  ];
  conceptos: any[] = [];
  reportes: any[] = [];

  selectedReporte: any = undefined;
  selectedConcepto: any = undefined;
  today = moment(new Date()).format('YYYY-MM-DD');
  fecha_desde: string = moment(this.today).startOf('month').format('YYYY-MM-DD');
  fecha_hasta: string = moment(this.today).endOf('month').format('YYYY-MM-DD');

  constructor(
    private apiService: ReportesPagosService,
    private toastr: ToastrService,
  ) { }

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
      this.getTipoReportes()
      this.getConceptos()
    }, 75)
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "IMPRIMIR":
        this.imprimirReporte()
        break;
    
      default:
        break;
    }
  }

  mostrarReporte() {
    let reporteUrl: string = `${environment.baseUrl}reports/reporte-jasper?reporte=${this.selectedReporte}&concepto=${this.selectedConcepto}&fecha_desde=${this.fecha_desde}`
    // console.log(reporteUrl)
    window.open(reporteUrl, "_blank")
  }

  imprimirReporte() {
    // let reporteUrl: string = `${environment.ReportingUrl + this.selectedReporte}?&j_username=${environment.UserReporting}&j_password=${environment.PasswordReporting}`
    // // console.log(reporteUrl)
    // window.open(reporteUrl, "_blank")
    window.open(environment.ReportingUrl + this.selectedReporte + "?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_liquidacion=116&forma_pago=N/A", '_blank')
    console.log(environment.ReportingUrl + this.selectedReporte + "?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting, '_blank')
  }

  getTipoReportes() {
    this.mensajeSpinner = 'Cargando Tipo de Reportes';
    this.lcargando.ctlSpinner(true);
    let data = {
        modulo: 16,
        submodulo:0
    };
    this.apiService.getTipoReportes(data).subscribe(
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
    this.mensajeSpinner = 'Cargando Conceptos';
    this.lcargando.ctlSpinner(true);
    this.apiService.getConceptos().subscribe(
      (res: any) => {
        // console.log(res.data);
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

}
