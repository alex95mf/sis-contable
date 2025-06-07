import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import * as myVarGlobals from 'src/app/global';
import { CommonService } from 'src/app/services/commonServices';
import { ToastrService } from 'ngx-toastr';
import { NuevaConsultaService } from './nueva-consulta.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CcModalTablaCuentaComponent } from 'src/app/config/custom/cc-modal-tabla-cuenta/cc-modal-tabla-cuenta.component';
import * as moment from 'moment';
import { Chart } from 'chart.js';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
standalone: false,
  selector: 'app-nueva-consulta',
  templateUrl: './nueva-consulta.component.html',
  styleUrls: ['./nueva-consulta.component.scss']
})
export class NuevaConsultaComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild('canvas') chartElementRef: ElementRef
  mensajeSpinner: string = "Cargando...";
  vmButtons: Botonera[] = [];

  dataUser: any;
  permisions: any;

  ref: DynamicDialogRef;
  LoadOpcionCentro: boolean;

  codigo: any | null = null
  nombre: any | null = null
  codigo_hasta: any | null = null
  nombre_hasta: any | null = null
  centrocosto: any | null = null
  cmb_centro: any[] = []
  filter: any = {
    fecha_desde: moment().startOf('month').format('YYYY-MM-DD'),
    fecha_hasta: moment().format('YYYY-MM-DD'),
  }

  dtConsultaAsiento: any[] = []
  chart: any;

  constructor(
    private apiService: NuevaConsultaService,
    private commonServices: CommonService,
    private toastr: ToastrService,
    public dialogService: DialogService,
    private excelService: ExcelService,
  ) {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));

    this.vmButtons = [
      { orig: "btnsNuevaConsultaComponent", paramAccion: "2", boton: { icon: "fa fa-search", texto: "CONSULTAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: false, imprimir: false },
      { orig: "btnsNuevaConsultaComponent", paramAccion: "2", boton: { icon: "fa fa-eraser", texto: "LIMPIAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning btn-sm", habilitar: false, imprimir: false },
      // { orig: "btnsNuevaConsultaComponent", paramAccion: "2", boton: { icon: "fa fa-file-pdf-o", texto: "PDF" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false },
      { orig: "btnsNuevaConsultaComponent", paramAccion: "2", boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: true, imprimir: false }
    ];
  }

  ngOnInit(): void {
    setTimeout(async () => {
      this.lcargando.ctlSpinner(true);
      await this.validaPermisos()
      this.lcargando.ctlSpinner(false)
    }, 0)
  }

  async validaPermisos() {
    let data = {
      id: 2,
      codigo: myVarGlobals.fComDiario,
      id_rol: this.dataUser.id_rol
    }

    try {
      (this as any).mensajeSpinner = 'Cargando Permisos'
      let response = await this.commonServices.getPermisionsGlobas(data) as any;
      console.log(response.data)
      this.permisions = response.data[0]
      //
      if (this.permisions.abrir == "0") {
        this.lcargando.ctlSpinner(false);
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de Comprobante Diario");
        this.vmButtons = [];
        return;
      }

      await this.cargaInicial();

    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error cargando Permisos')
    }
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "CONSULTAR":
        this.CargarLibroDiario();
        break;
      case "LIMPIAR":
        this.clearFilter();
        break;
      case "EXCEL":
        this.DescargarExcel();
        break;
      case "PDF":
        // this.DescargarPdf();
        break;
      default:
        break;

    }
  }

  async cargaInicial() {
    try {
      (this as any).mensajeSpinner = 'Cargando Catalogos'
      let catalogos = await this.apiService.getCentroCostos() as any;
      console.log(catalogos)
      this.cmb_centro = catalogos.data

    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error cargando Permisos')
    }
  }

  onClicConsultaPlanCuentas() {
    this.ref = this.dialogService.open(CcModalTablaCuentaComponent, {
      header: 'Cuentas',
      width: '70%',
      contentStyle: { "max-height": "500px", "overflow": "auto" },
      baseZIndex: 10000
    });

    this.ref.onClose.subscribe((cuentas: any) => {
      if (cuentas) {
        this.codigo = cuentas.data.codigo
        this.nombre = cuentas.data.nombre
      }
    });
  }

  onClicConsultaPlanCuentasHasta() {
    if (this.codigo === '') {
      this.toastr.info("Debe seleccionar filtro de la cuenta desde donde se desea consultar el mayor.");
      return;
    }

    this.ref = this.dialogService.open(CcModalTablaCuentaComponent, {
      header: 'Cuentas',
      width: '70%',
      contentStyle: { "max-height": "500px", "overflow": "auto" },
      baseZIndex: 10000
    });

    this.ref.onClose.subscribe((cuentas: any) => {

      if (cuentas) {
        this.codigo_hasta = cuentas.data.codigo;
        this.nombre_hasta = cuentas.data.nombre;
      }

    });
  }

  CargarLibroDiario() {
    // Validacion de Datos
    /* let message = ''

    if (this.codigo == null) message += '* No ha seleccionado Cuenta Desde.<br>'
    if (this.codigo_hasta == null) message += '* No ha seleccionado Cuenta Hasta.<br>'

    if (message.length) {
      this.toastr.warning(message, 'Validacion de Datos', { enableHtml: true })
      return;
    } */

    this.dtConsultaAsiento = [];
    let desde = moment(this.filter.fecha_desde).format('YYYYMMDD');
    let hasta = moment(this.filter.fecha_hasta).format('YYYYMMDD');
    let cuenta = this.codigo ?? '';
    let cuenta_hasta = this.codigo_hasta;
    let centro = (this.centrocosto) ? this.centrocosto : 0;

    this.lcargando.ctlSpinner(true);
    (this as any).mensajeSpinner = 'Consultado'
    if (cuenta !== '') {
      this.apiService.getLibroDiario(desde, hasta, cuenta, cuenta_hasta, centro).subscribe(
        (res: any) => {
          console.log(res);
          this.lcargando.ctlSpinner(false);
          this.dtConsultaAsiento = res.data;
          this.buildChart(res.data)
          this.vmButtons[2].habilitar = false
        },
        (error: any) => {
          console.log(error)
          this.lcargando.ctlSpinner(false);
        }
      )

    } else {
      this.apiService.getLibroDiarioSin(desde, hasta, centro).subscribe(
        (res: any) => {
          console.log(res);
          this.lcargando.ctlSpinner(false);
          this.dtConsultaAsiento = res.data;
          this.buildChart(res.data)
          this.vmButtons[2].habilitar = false
        },
        (error: any) => {
          console.log(error)
          this.lcargando.ctlSpinner(false);
          this.toastr.error(error.error.message, 'Error cargando Registros')
        }
      )
    }
  }

  buildChart(data: any[]) {
    const centroTotals: { [centro: number]: number } = {};
    // Calculate the totals
    data.forEach((item) => {
      // const centro = item.centro;
      const debito = parseFloat(item.debito);

      // Find the matching centro in cmb_centro list
      const centroInfo = this.cmb_centro.find((centro) => centro.id === item.centro);

      // Use the "nombre" if found, otherwise use "General"
      const nombre = centroInfo ? centroInfo.nombre : 'General';

      // Add the debito to the corresponding centro in centroTotals
      if (nombre in centroTotals) {
        centroTotals[nombre] += debito;
      } else {
        centroTotals[nombre] = debito;
      }
    });
    // console.log(centroTotals);

    this.chart = this.chartPie(Object.keys(centroTotals), Object.values(centroTotals));
  }

  clearFilter() {
    Object.assign(this.filter, {
      fecha_desde: moment().startOf('month').format('YYYY-MM-DD'),
      fecha_hasta: moment().format('YYYY-MM-DD'),
    })

    this.codigo = null
    this.codigo_hasta = null
    this.nombre = null
    this.nombre_hasta = null
    this.centrocosto = null

    this.dtConsultaAsiento = [];

    this.vmButtons[2].habilitar = true
  }

  chartPie(labels: string[], data: number[]) {
    const ctx = this.chartElementRef.nativeElement
    return new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: 'Valores',
          data: data,
          backgroundColor: [
            '#2B3A67',
            '#496A81',
            '#66999B',
            '#B3AF8F',
            '#FFC482',

            '#2B3A67',
            '#496A81',
            '#66999B',
            '#B3AF8F',
            '#FFC482',

            '#2B3A67',
            '#496A81',
            '#66999B',
            '#B3AF8F',
            '#FFC482',
          ],
          borderWidth: 1,
        }]
      },
      options: {
        aspectRatio: 2.5,
        plugins: {
          legend: {
            display: true
          }
        },
      }
    });
  }

  DescargarExcel() {
    let excelData = [];
    this.dtConsultaAsiento.forEach((element: any) => {
      let o = {
        Fecha: moment(element.fecha).format('YYYY-MM-DD'),
        Numero: element.num_doc,
        Cuenta: element.cuenta.replace('.', ''),
        DescripcionCuenta: element.descripcion_cuenta,
        Detalle: element.detalle,
        Debe: element.debito,
        Haber: element.credito,
        CodPartida: element.codigo_partida,
        Partida: element.partida ?? 'N/A',
        ValorPartida: element.valor_partida ?? 0,
      }
      excelData.push(o)
    })

    this.excelService.exportAsExcelFile(excelData, 'ConsultaCentroCosto')
  }
}
