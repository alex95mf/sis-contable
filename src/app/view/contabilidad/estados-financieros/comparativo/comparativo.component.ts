import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ComparativoService } from './comparativo.service';
import Botonera from 'src/app/models/IBotonera';
import * as moment from 'moment';
import { XlsExportService } from 'src/app/services/xls-export.service';
import { PrimeNGConfig } from 'primeng/api';

@Component({
standalone: false,
  selector: 'app-comparativo',
  templateUrl: './comparativo.component.html',
  styleUrls: ['./comparativo.component.scss']
})
export class ComparativoComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  vmButtons: Array<Botonera> = [];
  fTitle: string = 'Reporte Comparativo';
  mensajeSpinner: string;

  filter: any = {
    tipo_reporte: null,
    centro_costo: 0,
    nivel: 4,
    fecha_inicio: new Date(),
    fecha_final: new Date(),
  }
  cmb_tipo_reporte: Array<any> = [
    { value: 'RES', label: 'Estado de Resultados' },
    { value: 'BGR', label: 'Balance General' },
  ];
  cmb_centro_costo: Array<any> = [];
  cmb_nivel: Array<any> = [
    { value: 1, label: 1 },
    { value: 2, label: 2 },
    { value: 3, label: 3 },
    { value: 4, label: 4 },
    { value: 5, label: 5 },
    { value: 6, label: 6 },
    { value: 7, label: 7 },
    { value: 8, label: 8 },
    { value: 9, label: 9 },
    { value: 10, label: 10 },
  ];

  columnas: Array<string> = [];
  registros: Array<any> = [];  // matrix

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private apiService: ComparativoService,
    private xlsService: XlsExportService,
    private ngConfig: PrimeNG,
  ) {
    this.vmButtons = [
      {
        orig: 'btnsRepComparativo',
        paramAccion: "",
        boton: { icon: "fas fa-search", texto: "CONSULTAR" },
        clase: "btn btn-sm btn-primary",
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: 'btnsRepComparativo',
        paramAccion: "",
        boton: { icon: "fas fa-search", texto: "LIMPIAR" },
        clase: "btn btn-sm btn-warning",
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: 'btnsRepComparativo',
        paramAccion: "",
        boton: { icon: "fas fa-file-excel", texto: "EXCEL" },
        clase: "btn btn-sm btn-outline-success",
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        habilitar: false,
      },
    ]
  }

  ngOnInit(): void {
    setTimeout(() => this.cargaInicial(), 50)

    this.ngConfig.setTranslation({
      monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    })
  }

  async cargaInicial() {
    this.lcargando.ctlSpinner(true)
    try {
      this.mensajeSpinner = 'Cargando Centro de Costos'
      let response = await this.apiService.getCentroCostos();
      response.unshift({ id: 0, nombre: 'Todos' })
      this.cmb_centro_costo = response

      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error en Carga Inicial')
    }
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "CONSULTAR":
        this.getReporte()
        break;
      case "LIMPIAR":
        this.limpiar()
        break;
      case "EXCEL":
        this.exportExcel()
        break;

      default:
        break;
    }
  }

  async getReporte() {
    let message = '';
    if (this.filter.tipo_reporte == null) message += '* No ha seleccionado el Tipo de Reporte.<br>'
    if (moment(this.filter.fecha_final).diff(moment(this.filter.fecha_inicio)) < 0) message += '* La seleccion de fechas es invalida.<br>'
    if (message.length > 0) {
      this.toastr.warning(message, 'Validacion de Consulta', { enableHtml: true })
      return;
    }

    if (this.filter.centro_costo == null) this.filter.centro_costo = 0;

    let data = {
      params: {
        filter: this.filter,
      }
    }

    this.lcargando.ctlSpinner(true)
    try {
      this.mensajeSpinner = 'Cargando Cuentas'
      this.columnas = [];
      this.registros = [];

      let response: Array<any> = await this.apiService.getComparativo(data);
      console.log(response)
      let periodo1 = moment(this.filter.fecha_inicio).format('YYYYMM')
      let periodo2 = moment(this.filter.fecha_final).format('YYYYMM')
      this.columnas = [periodo1, periodo2]
      // for (let i = 0; i < response.length; i++) {
      //   if (!this.columnas.includes(response[i]['periodo'])) this.columnas.push(response[i]['periodo'])
      // }

      this.columnas.sort()

      for (let i = 0; i < response.length; i++) {
        let data = this.registros.filter((item: any) => item['cuenta'] == response[i]['cuenta'])

        if (data.length == 0) {
          let o = {}
          o['cuenta'] = response[i]['cuenta']
          o['nombre_cuenta'] = response[i]['nombre_cuenta'];
          o[moment(this.filter.fecha_inicio).format('YYYYMM')] = (moment(this.filter.fecha_inicio).format('YYYYMM') == response[i]['periodo']) ? response[i]['valor_total'] : 0;
          o[moment(this.filter.fecha_final).format('YYYYMM')] = (moment(this.filter.fecha_final).format('YYYYMM') == response[i]['periodo']) ? response[i]['valor_total'] : 0;
          // o[response[i]['periodo']] = response[i]['valor_total'];
          this.registros.push(o)
        } else {
          data[0][response[i]['periodo']] = response[i]['valor_total'];
        }

        this.registros.sort((a, b) => {
          if (a.cuenta > b.cuenta) {
            return 1;
          }
          if (a.cuenta < b.cuenta) {
            return -1;
          }
          return 0;
        })

        // Analisis Horizontal
        this.registros.map((item: any) => {
          let diff = item[periodo2] - item[periodo1]
          item['horizontal'] = { valor: Math.abs(diff / item[periodo1]), direccion: diff > 0 }
        })

      }

      // Analisis Vertical
      let sum_periodo1 = this.registros.reduce((acc, curr) => acc + parseFloat(curr[periodo1]), 0)
      let sum_periodo2 = this.registros.reduce((acc, curr) => acc + parseFloat(curr[periodo2]), 0)
      console.log(sum_periodo1, sum_periodo2)
      this.registros.map((item: any) => {
        item['vertical'] = {}
        item['vertical'][periodo1] = item[periodo1] / sum_periodo1
        item['vertical'][periodo2] = item[periodo2] / sum_periodo2
      })

      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error cargando Cuentas')
    }
  }

  exportExcel() {
    this.xlsService.exportAsExcelFile(this.registros, `ReporteComparativo${this.filter.tipo_reporte}`)
  }

  limpiar() {
    this.filter = {
      tipo_reporte: null,
      centro_costo: 0,
      nivel: 4,
      fecha_inicio: new Date(),
      fecha_final: new Date(),
    }
  }
}
