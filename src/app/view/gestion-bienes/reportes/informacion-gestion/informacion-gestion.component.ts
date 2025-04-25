import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { environment } from 'src/environments/environment';
import { ButtonRadioActiveComponent } from 'src/app/config/custom/cc-panel-buttons/button-radio-active.component';
import { InformacionGestionServices } from './informacion-gestion.service';
import * as moment from 'moment';
import { NgSelectComponent } from '@ng-select/ng-select';
import Botonera from 'src/app/models/IBotonera';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-informacion-gestion',
  templateUrl: './informacion-gestion.component.html',
  styleUrls: ['./informacion-gestion.component.scss']
})
export class InformacionGestionComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChildren(NgSelectComponent) selects: Array<NgSelectComponent>;
  fTitle: string = 'Informe de Gestion de Bienes';
  vmButtons: Array<Botonera> = [];
  msgSpinner: string;

  selectedReporte: any;  // Tipo Reporte
  selectedTipo: any;  // Tipo Bien
  selectedData: string;  // Data a mostrar
  selectedGrupo: string;
  mostrarMatriz: boolean = true;

  cmb_tipo_reporte: any[] = [
    { value: 'DEP', descripcion: 'Dependencia' },
    { value: 'RES', descripcion: 'Responsable' },
    { value: 'PGR', descripcion: 'Por Grupo' },
    { value: 'PSG', descripcion: 'Por Subgrupo' },
    { value: 'SUM', descripcion: 'Resumen' },
    // { value: 'GEN', descripcion: 'General' },
  ];
  cmb_grupo: any[] = [];
  cmb_grupo_filter: any[] = [];
  cmb_tipo_bien: Array<any> = [
    { value: 'BCA', label: 'Bienes de Control Administrativo' },
    { value: 'BLD', label: 'Bienes de Larga Duracion' },
  ];
  cmb_data_mostrar: Array<any> = [
    { value: 'cantidad', label: 'Cantidad' },
    { value: 'valor', label: 'Valor' },
  ]

  columnas: Array<string> = [];
  filas: Array<any> = [];
  matriz: any = {};

  constructor(
    private apiService: InformacionGestionServices,
    private toastr: ToastrService,
    private excelService: ExcelService,
  ) {
    this.vmButtons = [
      {
        orig: "btnsRenConsultaReporte",
        paramAccion: "",
        boton: { icon: "far fa-search", texto: "CONSULTAR" },
        clase: "btn btn-primary boton btn-sm",
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: "btnsRenConsultaReporte",
        paramAccion: "",
        boton: { icon: "far fa-eraser", texto: "LIMPIAR" },
        clase: "btn btn-warning boton btn-sm",
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: "btnsRenConsultaReporte",
        paramAccion: "",
        boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" },
        clase: "btn btn-success boton btn-sm",
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        habilitar: true
      },
    ];
  }

  ngOnInit(): void {
    setTimeout(() => this.cargaInicial(), 50);
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "EXCEL":
        this.exportarExcel()
        break;
      case "CONSULTAR":
        this.consultarReporte()
        break;
      case "LIMPIAR":
        this.limpiarFiltros()
        break;
      default:
        break;
    }
  }

  async cargaInicial() {
    this.lcargando.ctlSpinner(true)
    try {
      this.msgSpinner = 'Cargando Grupos'
      let response: Array<any> = await this.apiService.getGruposBienes();
      this.cmb_grupo = response
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error en Carga Inicial')
    }
  }

  limpiarFiltros() {
    this.selects.forEach((select: NgSelectComponent) => select.handleClearClick());
    this.vmButtons[2].habilitar = true
    this.matriz = []
    this.columnas = []
  }

  async consultarReporte() {
    // Validar opciones seleccionadas
    let message: string = '';
    if (this.selectedReporte == undefined || this.selectedReporte == null) message += '* Debe seleccionar un Tipo de Reporte.<br>';
    if (this.selectedReporte != 'DEP' && (this.selectedTipo == undefined || this.selectedTipo == null)) message += '* Debe seleccionar un Tipo de Bien.<br>';
    if (this.selectedReporte != 'SUM' && (this.selectedData == undefined || this.selectedData == null)) message += '* Debe seleccionar los Datos a Mostrar.<br>';
    if (message.length > 0) {
      this.toastr.warning(message, 'Advertencia', { enableHtml: true })
      return;
    }

    
    this.lcargando.ctlSpinner(true)
    try {
      this.filas = []
      this.columnas = [];
      this.matriz = [];

      let response = await this.apiService.getData({ tipo_reporte: this.selectedReporte, tipo_bien: this.selectedTipo, tipo_grupo: this.selectedGrupo });

      // Mostrar Matriz si no es Resumen
      this.mostrarMatriz = this.selectedReporte != 'SUM';
      
      if (this.selectedReporte == 'SUM') {
        this.filas = response
        this.lcargando.ctlSpinner(false)
        return;
      }

      if (this.selectedReporte == 'DEP') {
        console.log(response)
        let valores = response['valores']
        let dependencias = response['dependencias']

        for (let i = 0; i < valores.length; i++) {
          if (!this.columnas.includes(valores[i]['descripciongrupo'])) this.columnas.push(valores[i]['descripciongrupo'])
        }

        this.matriz = dependencias;

        for (let i = 0; i < valores.length; i++) {
          let row = this.matriz.filter((item: any) => item.nombre_dependencia == valores[i]['nombre_dependencia'])
          if (row.length == 0) {
            let o = {};
            o[valores[i]['descripciongrupo']] = valores[i][this.selectedData]
            o['nombre_dependencia'] = valores[i]['nombre_dependencia']
            o['codigo'] = valores[i]['codigo']
            this.matriz.push(o)
          } else {
            row[0][valores[i]['descripciongrupo']] = valores[i][this.selectedData]
            row[0]['nombre_dependencia'] = valores[i]['nombre_dependencia']
            row[0]['codigo'] = valores[i]['codigo']
          }
        }

        this.lcargando.ctlSpinner(false)
        return;
      }

      for (let i = 0; i < response.length; i++) {
        if (!this.columnas.includes(response[i]['descripcion'])) this.columnas.push(response[i]['descripcion'])
      }
      // console.log(this.columnas)
      
      for (let i = 0; i < response.length; i++) {
        let row = this.matriz.filter((item: any) => {
          if (this.selectedReporte == 'RES') {
            return item.responsable == response[i]['responsable']
          }
          return item.date_part == response[i]['date_part']
        })
        if (row.length == 0) {
          let o = {}
          o[response[i]['descripcion']] = response[i][this.selectedData]
          o['date_part'] = response[i]['date_part']
          o['responsable'] = response[i]['responsable']
          this.matriz.push(o)
        } else {
          row[0][response[i]['descripcion']] = response[i][this.selectedData]
          row[0]['date_part'] = response[i]['date_part']
          row[0]['responsable'] = response[i]['responsable']
        }
      }
      // console.log(this.matriz)
      this.vmButtons[2].habilitar = false
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error consultando Reporte')
    }
  }

  exportarExcel() {
    let excelData = [];
    this.matriz.forEach((registro: any) => {
      let o = {};
      Object.assign(o, { periodo: registro.date_part })
      this.columnas.forEach((columna: string) => {
        o[columna] = registro[columna] ?? 0
      })
      excelData.push(o)
    })
    // console.log(excelData);

    this.excelService.exportAsExcelFile(excelData, 'GestionBienes');
  }

  filterByTipoBien(event: any) {
    // console.log(event)
    if (event != undefined && this.selectedReporte == 'PSG') {
      this.lcargando.ctlSpinner(true)
      this.msgSpinner = 'Filtrando Grupos por Tipo de Bien'
      this.cmb_grupo_filter = this.cmb_grupo.filter((item: any) => item.tipo_bien == event.value)
      setTimeout(() => this.lcargando.ctlSpinner(false), 750)
    }
  }
}
