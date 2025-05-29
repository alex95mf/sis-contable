import { Component, OnInit, ViewChild } from '@angular/core';
import { ReporteService } from './visualizador.service';
import { ExcelService } from 'src/app/services/excel.service';
import { XlsExportService } from 'src/app/services/xls-export.service';
import { CommonService } from 'src/app/services/commonServices';
import * as myVarGlobals from 'src/app/global';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

declare const $: any;

@Component({
standalone: false,
  selector: 'app-visualizador',
  templateUrl: './visualizador.component.html',
  styleUrls: ['./visualizador.component.scss']
})
export class VisualizadorComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando : CcSpinerProcesarComponent
  fTitle : string = "Reporte de Plan Anual de Compras por Departamento"
  msgSpinner : string
  vmButtons : any
  dataUser : any
  permissions: any

  periodos: Array<any>;
  periodoSelected: number;
  periodoObjectSelected: any;
  programas: Array<any>;
  programaSelected: any = null;
  programaObjectSelected: any
  departamentos: Array<any>;
  departamentoSelected: any = null;
  departamentosFilter: Array<any> = [];
  departamentoObjectSelected: any;
  bienes: Array<any> = [];
  total: number = 0;

  // Formulario Busqueda
  // periodo = moment().subtract(1, 'year').format('YYYY')
  // programas = []
  // departamentos = []
  // programa = 0
  // departamento = 0
  // atribuciones = []
  // atribucion = 0

  // Catalogos
  // 'PLA_TIPO_COMPRA','PLA_U_MED','PLA_TIPO_PRODUCTO','PLA_PROC_SUGE','PLA_TIPO_REGIMEN','PLA_TIPO_PRESUPUESTO'
  lst_tipo_compra: Array<any>;
  lst_unidades_medida: Array<any>;
  lst_tipo_producto: Array<any>;
  lst_procedimiento_sugerido: Array<any>;
  lst_tipo_regimen: Array<any>;
  lst_tipo_presupuesto: Array<any>;

  constructor(
    private apiService : ReporteService,
    private toastr : ToastrService,
    private excelService : ExcelService,
    private xlsService : XlsExportService,
    private commonServices : CommonService
  ) { }

  ngOnInit(): void {
    this.vmButtons = [

      { orig: "planAtriRepo", paramAccion: "", boton: { icon: "fa fa-search", texto: "CONSULTAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: false, imprimir: false},

      { orig: "planAtriRepo", paramAccion: "", boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: true, imprimir: false}

    ]
    setTimeout(() => {
      this.validaPermisos()
    }, 50)
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {

      case "CONSULTAR":
        if (this.periodoObjectSelected == undefined || this.programaObjectSelected == undefined
          || this.departamentoObjectSelected == undefined)
          {
            this.toastr.warning("Por favor seleccione Periodo, Programa y Departamento..", this.fTitle);
            return;
          }
        this.handleClickBuscar()
        break;
      case "EXCEL":
        this.handleClickExcel()
        break;
    }
  }

  validaPermisos() {
    this.msgSpinner = 'Cargando Permisos de Usuario'
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    let params = {
      codigo: myVarGlobals.fAttrReporte,
      id_rol: this.dataUser.id_rol,
    };

    this.lcargando.ctlSpinner(true)
    this.commonServices.getPermisionsGlobas(params).subscribe(
      res => {
        this.permissions = res["data"][0];
        if (this.permissions.abrir == "0") {
          this.lcargando.ctlSpinner(false);
          this.vmButtons = [];  // Supuestamente deberia desaparecer los botones de accion
          this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle);
        } else {
          setTimeout(() => {
            this.cargaInicial();
          }, 250)
        }
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }

  async cargaInicial() {
    try {
      this.msgSpinner = 'Cargando Periodos'
      this.periodos = await this.apiService.getPeriodos();

      this.msgSpinner = 'Cargando Programas'
      this.programas = await this.apiService.getProgramas();
      this.programas.map((programa: any) => Object.assign(programa, { label: `${programa.descripcion}. ${programa.valor}` }))

      this.msgSpinner = 'Cargando Departamentos'
      this.departamentos = await this.apiService.getDepartamentos();
      this.departamentos.map((departamento: any) => Object.assign(departamento, { label: `${departamento.descripcion}. ${departamento.valor}`}))

      this.msgSpinner = 'Cargando Datos Adicionales'
      let response: any = await this.apiService.getCatalogo({params: "'PLA_TIPO_COMPRA','PLA_U_MED','PLA_TIPO_PRODUCTO','PLA_PROC_SUGE','PLA_TIPO_REGIMEN','PLA_TIPO_PRESUPUESTO'"})
      this.lst_tipo_compra = response.PLA_TIPO_COMPRA
      this.lst_unidades_medida = response.PLA_U_MED
      this.lst_tipo_producto = response.PLA_TIPO_PRODUCTO
      this.lst_procedimiento_sugerido = response.PLA_PROC_SUGE
      this.lst_tipo_regimen = response.PLA_TIPO_REGIMEN
      this.lst_tipo_presupuesto = response.PLA_TIPO_PRESUPUESTO

      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error cargando Datos Iniciales')
    }
  }

  handlePeriodoSelected(event) {
    if (event == undefined) return;
    this.periodoObjectSelected = event
  }

  handleSelectPrograma(event) {
    if (event == undefined) return;
    this.programaObjectSelected = event
    this.departamentosFilter = this.departamentos.filter((departamento: any) => departamento.grupo == event.valor)
    this.departamentoSelected = null
    this.bienes = []
  }

  handleSelectDepartamento(event) {
    if (event == undefined) return;
    this.departamentoObjectSelected = event
    this.bienes = []
  }

  async handleClickBuscar() {
    this.total = 0;

    this.lcargando.ctlSpinner(true)
    try {
      this.msgSpinner = 'Cargando Bienes'
      this.bienes = await this.apiService.getBienes({periodo: this.periodoSelected, departamento: this.departamentoObjectSelected.id_catalogo});
      console.log(this.bienes)
      this.bienes.map((bien: any) => Object.assign(bien, {
        tipo_compra: (bien.tipo_compra != 0) ? this.lst_tipo_compra.find((tipo: any) => tipo.id_catalogo == bien.tipo_compra).valor : null,
        tipo_producto: (bien.tipo_producto != 0) ? this.lst_tipo_producto.find((tipo: any) => tipo.id_catalogo == bien.tipo_producto).valor : null,
        cat_elec: (bien.cat_elec == 0) ? 'NO' : 'SI',
        proc_sugerido: (bien.proc_sugerido != 0) ? this.lst_procedimiento_sugerido.find((proc: any) => proc.id_catalogo == bien.proc_sugerido).valor : null,
        fondos_bid: (bien.fondos_bid == 0) ? 'NO' : 'SI',
        tipo_regimen: (bien.tipo_regimen != 0) ? this.lst_tipo_regimen.find((tipo: any) => tipo.id_catalogo == bien.tipo_regimen).valor : null,
        tipo_presupuesto: (bien.tipo_presupuesto != 0) ? this.lst_tipo_presupuesto.find((tipo: any) => tipo.id_catalogo == bien.tipo_presupuesto).valor : null
      }))

      this.bienes.forEach((bien: any) => {
        let solicitudes: any = {};
        let cantidades: any = {};
        for (let i = 1; i <= 12; i++) {
          solicitudes[i] = 0;
          cantidades[i] = 0;
          bien.solicitud_cab.forEach((solicitud: any) => {
            let mes = moment(solicitud.fecha_creacion).format('M');
            if (mes == `${i}`) {
              solicitudes[i]++;
              cantidades[i] += solicitud.cantidad_requerida
            }
          })
        }
        Object.assign(bien, {solicitudes, cantidades})
      })

      this.total = this.bienes.reduce((acc: number, curr: any) => acc + parseFloat(curr.costo_total), 0)

      this.vmButtons[1].habilitar = false
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error cargando Bienes')
    }
  }

  handleClickExcel() {
    let excelData: Array<any> = [];

    let rows: Array<any> = [];
    Object.keys(this.bienes).forEach(key => {
      let row: any = {}
      row['PartidaPresupuestaria'] = this.bienes[key].partida_presupuestaria?.codigo ?? 'N/A' + ' - ' + this.bienes[key].partida_presupuestaria?.nombre ?? 'N/A'
      row['CodigoCPC'] = this.bienes[key].codigo_cpc?.cod_unificado ?? 'N/A' + ' - ' + this.bienes[key].codigo_cpc?.nombre ?? 'N/A'
      row['TipoCompra'] = this.bienes[key].tipo_compra
      row['UnidadMedida'] = this.bienes[key].u_medida
      row['TipoProducto'] = this.bienes[key].tipo_producto
      row['CatalogoElectronico'] = this.bienes[key].cat_elec
      row['ProcedimientoSugerido'] = this.bienes[key].proc_sugerido
      row['FondosBID'] = this.bienes[key].fondos_bid
      row['TipoRegimen'] = this.bienes[key].tipo_regimen
      row['TipoPresupuesto'] = this.bienes[key].tipo_presupuesto
      rows.push(row)
    })

    for (let i = 0; i < rows.length; i++) {
      let row: any = {};
      Object.assign(row, this.bienes[i], rows[i])
      excelData.push(row)
    }

    let row = {}
    row['descripcion'] = 'TOTAL'
    row['costo_total'] = this.total
    excelData.push(row)

    this.xlsService.exportReportePAC(excelData, 'ReportePAC')
  }

  /* cargaCatalogo() {
    this.msgSpinner = 'Cargando Catalogos'
    let data = {
      params: "'PLA_PROGRAMA','PLA_DEPARTAMENTO',\
      'PLA_COD_PRESUP','PLA_COD_CPC','PLA_TIPO_COMPRA','PLA_U_MED','PLA_TIPO_PRODUCTO',\
      'PLA_AFIRMACION','PLA_PROC_SUGE','PLA_TIPO_REGIMEN','PLA_TIPO_PRESUPUESTO'"
    }

    this.lcargando.ctlSpinner(true)
    this.apiSrv.getCatalogos(data).subscribe(
      res => {
        // console.log(res['data'])

        res['data']['PLA_PROGRAMA'].forEach(r => {
          const { id_catalogo, valor, descripcion } = r
          this.programas = [...this.programas, { id: id_catalogo, nombre: valor, codigo: descripcion }]
        })
        res['data']['PLA_DEPARTAMENTO'].forEach(r => {
          const { id_catalogo, valor, descripcion, grupo } = r
          this.departamentos = [...this.departamentos, { id: id_catalogo, nombre: valor, programa: grupo, codigo: descripcion }]
        })
        res['data']['PLA_COD_PRESUP'].forEach(r => {
          const { id_catalogo, valor, descripcion } = r
          this.partidas = [...this.partidas, { id: id_catalogo, valor: valor, descripcion: descripcion }]
        })
        res['data']['PLA_COD_CPC'].forEach(r => {
          const { id_catalogo, valor, descripcion } = r
          this.cpc = [...this.cpc, { id: id_catalogo, valor: valor, descripcion: descripcion }]
        })
        res['data']['PLA_TIPO_COMPRA'].forEach(r => {
          const { id_catalogo, valor } = r
          this.tipoCompras = [...this.tipoCompras, { id: id_catalogo, valor: valor }]
        })
        res['data']['PLA_U_MED'].forEach(r => {
          const { id_catalogo, valor } = r
          this.uMedidas = [...this.uMedidas, { id: id_catalogo, valor: valor }]
        })
        res['data']['PLA_TIPO_PRODUCTO'].forEach(r => {
          const { id_catalogo, valor } = r
          this.tipoProductos = [...this.tipoProductos, { id: id_catalogo, valor: valor }]
        })
        res['data']['PLA_AFIRMACION'].forEach(r => {
          const { id_catalogo, valor } = r
          this.afirmaciones = [...this.afirmaciones, { id: id_catalogo, valor: valor }]
        })
        res['data']['PLA_PROC_SUGE'].forEach(r => {
          const { id_catalogo, valor } = r
          this.procSugeridos = [...this.procSugeridos, { id: id_catalogo, valor: valor }]
        })
        res['data']['PLA_TIPO_REGIMEN'].forEach(r => {
          const { id_catalogo, valor } = r
          this.tipoRegimenes = [...this.tipoRegimenes, { id: id_catalogo, valor: valor }]
        })
        res['data']['PLA_TIPO_PRESUPUESTO'].forEach(r => {
          const { id_catalogo, valor } = r
          this.tipoPresupuestos = [...this.tipoPresupuestos, { id: id_catalogo, valor: valor }]
        })
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Catalogos')
      }
    )
  } */

  /* selectProg(event) {
    this.departamento = 0
    this.total = 0
    this.bienesAttr = []
    this.vmButtons[0].habilitar = true
    this.deptProg = this.departamentos.filter(d => d.programa == event.nombre)
  } */

  /* selectDept(event) {
    this.msgSpinner = 'Cargando Bienes por Departamento'
    this.bienesAttr = []
    this.total = 0
    this.vmButtons[0].habilitar = false
    // Cargar Bienes asociados con el Departamento
    let data = {
      departamento: event.id
    }

    this.lcargando.ctlSpinner(true)
    this.apiSrv.getBienes(data).subscribe(
      res => {
        this.lcargando.ctlSpinner(false)
        console.log(res['data'])
        res['data'].forEach(b => {
          let bien = {
            partPresupuestaria: (b.partida_presupuestaria == null || b.partida_presupuestaria == 0) ? {id: 0, valor: 'NA', descripcion: 'NA'} : this.partidas.find(p => p.id == b.partida_presupuestaria),
            codigoCPC: (b.codigo_cpc == null || b.codigo_cpc == 0) ? {id: 0, valor: 'NA', descripcion: 'NA'} : this.cpc.find(p => p.id == b.codigo_cpc),
            tipoCompra: (b.tipo_compra == null || b.tipo_compra == 0) ? { id: 0, valor: 'No asignado' } : this.tipoCompras.find(p => p.id == b.tipo_compra),
            descripcion: b.descripcion,
            cant: b.cantidad,
            uMedida: this.uMedidas.find(p => p.id == b.fk_medida),
            costoUnitario: b.costo_unitario,
            costoTotal: b.costo_total,
            periodo1: b.periodo1,
            periodo2: b.periodo2,
            periodo3: b.periodo3,
            periodo4: b.periodo4,
            periodo5: b.periodo5,
            periodo6: b.periodo6,
            periodo7: b.periodo7,
            periodo8: b.periodo8,
            periodo9: b.periodo9,
            periodo10: b.periodo10,
            periodo11: b.periodo11,
            periodo12: b.periodo12,
            tipoProducto: (b.tipo_producto == null || b.tipo_producto == 0) ? { id: 0, valor: 'No asignado' } : this.tipoProductos.find(p => p.id == b.tipo_producto),
            catalogoElectronico: (b.cat_elec == null || b.cat_elec == 0) ? { id: 0, valor: 'No asignado' } : this.afirmaciones.find(p => p.id == b.cat_elec),
            procSugerido: (b.proc_sugerido == null || b.proc_sugerido == 0) ? { id: 0, valor: 'No asignado' } : this.procSugeridos.find(p => p.id == b.proc_sugerido),
            fondosBID: (b.fondos_bid == null || b.fondos_bid == 0) ? { id: 0, valor: 'No asignado' } : this.afirmaciones.find(p => p.id == b.fondos_bid),
            codOperacion: b.codigo_operacion == null ? '' : b.codigo_operacion,
            codProyecto: b.codigo_proyecto == null ? '' : b.codigo_proyecto,
            tipoRegimen: (b.tipo_regimen == null || b.tipo_regimen == 0) ? { id: 0, valor: 'No asignado' } : this.tipoRegimenes.find(p => p.id == b.tipo_regimen),
            tipoPresupuesto: (b.tipo_presupuesto == null || b.tipo_presupuesto == 0) ? { id: 0, valor: 'No asignado' } : this.tipoPresupuestos.find(p => p.id == b.tipo_presupuesto)
          }
          this.total += parseFloat(b.costo_total)
          this.bienesAttr.push(bien)
        })
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Bienes por Departamento')
      }
    )
  } */

  /* exportar() {
    // Tomado de contabilidad/reportes/balancecomprobacion/balancecomprobacion.component.ts
    if (this.permissions.exportar == 0) {
      this.toastr.warning('No tiene permisos para exportar', this.fTitle)
      return
    }

    let rows = []
    Object.keys(this.bienesAttr).forEach(key => {
      let row = {}
      row['partPresupuestaria'] = this.bienesAttr[key].partPresupuestaria?.valor + ' - ' + this.bienesAttr[key].partPresupuestaria?.descripcion
      row['codigoCPC'] = this.bienesAttr[key].codigoCPC?.valor + ' - ' + this.bienesAttr[key].codigoCPC?.descripcion
      row['tipoCompra'] = this.bienesAttr[key].tipoCompra?.valor
      row['uMedida'] = this.bienesAttr[key].uMedida?.valor
      row['tipoProducto'] = this.bienesAttr[key].tipoProducto?.valor
      row['catalogoElectronico'] = this.bienesAttr[key].catalogoElectronico?.valor,
      row['procSugerido'] = this.bienesAttr[key].procSugerido?.valor
      row['fondosBID'] = this.bienesAttr[key].fondosBID?.valor,
      row['tipoRegimen'] = this.bienesAttr[key].tipoRegimen?.valor,
      row['tipoPresupuesto'] = this.bienesAttr[key].tipoPresupuesto?.valor
      rows.push(row)
    })

    let excelData = []
    for (let i = 0; i < rows.length; i++) {
      let row = {}
      Object.assign(row, this.bienesAttr[i], rows[i])
      excelData.push(row)
    }

    let row = {}
    row['descripcion'] = 'TOTAL'
    row['costoTotal'] = this.total
    excelData.push(row)


    // console.log(this.bienesAttr)
    // console.log(excelData)

    this.xlsService.exportReportePAC(excelData, 'Reporte PAC')
  } */

}
