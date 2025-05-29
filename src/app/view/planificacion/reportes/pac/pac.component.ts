import { Component, OnInit, ViewChild } from '@angular/core';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ToastrService } from 'ngx-toastr';
import { XlsExportService } from 'src/app/services/xls-export.service';
import * as myVarGlobals from 'src/app/global';
import { CommonService } from 'src/app/services/commonServices';

import { PacService } from './pac.service';
import Botonera from 'src/app/models/IBotonera';

@Component({
standalone: false,
  selector: 'app-pac',
  templateUrl: './pac.component.html',
  styleUrls: ['./pac.component.scss']
})
export class PacComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent
  fTitle = 'Reporte Planificacion Anual de Compras'
  msgSpinner: string
  vmButtons: Botonera[]
  dataUser: any
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

  mision: any;
  compras: Array<any> = [];

  seleccion = {
    programa: {},
    departamento: {}
  }

  constructor(
    private api: PacService,
    private toastr: ToastrService,
    private xlsService: XlsExportService,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsReportePAC",
        paramAccion: "",
        boton: { icon: "fa fa-search", texto: "CONSULTAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsReportePAC",
        paramAccion: "",
        boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: true,
      },
    ]
    setTimeout(() => {
      this.validaPermisos()
    }, 75)
  }

  metodoGlobal(evt) {
    switch (evt.items.boton.texto) {
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
        this.export()
        break;
    
      default:
        break;
    }
  }

  validaPermisos() {
    /** Obtiene los permisos del usuario y valida si puede trabajar sobre el formulario */
    this.msgSpinner = 'Cargando Permisos de Usuario'
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    let params = {
      codigo: myVarGlobals.fRepPAC,
      id_rol: this.dataUser.id_rol,
    };

    this.lcargando.ctlSpinner(true)
    this.commonService.getPermisionsGlobas(params).subscribe(
      (res: any) => {
        this.permissions = res["data"][0];
        if (this.permissions.abrir == "0") {
          this.lcargando.ctlSpinner(false);
          this.vmButtons = [];
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
      this.periodos = await this.api.getPeriodos();

      this.msgSpinner = 'Cargando Programas'
      this.programas = await this.api.getProgramas();
      this.programas.map((programa: any) => Object.assign(programa, { label: `${programa.descripcion}. ${programa.valor}` }))

      this.msgSpinner = 'Cargando Departamentos'
      this.departamentos = await this.api.getDepartamentos();
      this.departamentos.map((departamento: any) => Object.assign(departamento, { label: `${departamento.descripcion}. ${departamento.valor}`}))

      // this.msgSpinner = 'Cargando Datos Adicionales'
      // let response: any = await this.api.getCatalogo({params: ""})
      
      

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
    // this.bienes = []
  }

  handleSelectDepartamento(event) {
    if (event == undefined) return;
    this.departamentoObjectSelected = event
    // this.bienes = []
  }

  async handleClickBuscar() {
    this.lcargando.ctlSpinner(true)
    try {
      // Obtener la Mision ?
      this.msgSpinner = 'Obteniendo Mision'
      this.mision = await this.api.getMision({departamento: this.departamentoObjectSelected})

      // Obtener las Compras
      this.msgSpinner = 'Cargando Datos'
      const bienesResponse = await this.api.getBienesPlus({periodo: this.periodoSelected, departamento: this.departamentoObjectSelected})
      console.log(bienesResponse)
      bienesResponse.forEach((element: any) => Object.assign(element, { 
        referencial_total: 0 ,
        idps: element.solicitud_cab.reduce((acc: string[], curr: any) => {
          acc.push(curr.idp)
          return acc
        }, []).join(', ')
      }))
      this.compras = bienesResponse
      // periodo_estimado: ((element.fk_bien.periodo1 || element.fk_bien.periodo2 || element.fk_bien.periodo3) ? '1 ' : '') + ((element.fk_bien.periodo4 || element.fk_bien.periodo5 || element.fk_bien.periodo6) ? '2 ' : '') + ((element.fk_bien.periodo7 || element.fk_bien.periodo8 || element.fk_bien.periodo9) ? '3 ' : '') + ((element.fk_bien.periodo10 || element.fk_bien.periodo11 || element.fk_bien.periodo12) ? '4' : '')
      /* this.compras.map((compra: any) => Object.assign(compra, {
        requerimiento_general: compra.fk_atribucion.valor,
        direccion_unidad: compra.fk_departamento.descripcion,
        cedula_asignacion: compra.cedula_asignacion,
        codigo: compra.fk_bien.partida_presupuestaria.valor,
        requerimiento_especifico: compra.fk_bien.partida_presupuestaria.nombre + '\n-\n' + compra.fk_bien.descripcion,
        fuente_financiamiento: compra.fk_bien.fuente_financ?.valor ?? 'N/A',
        categoria_producto: compra.fk_bien.codigo_cpc?.valor ?? 'NO',
        tipo_compra: compra.fk_bien.tipo_compra?.valor ?? 'N/A',
        tipo_regimen: compra.fk_bien.tipo_regimen?.valor ?? 'N/A',
        tipo_producto: compra.fk_bien.tipo_producto?.valor ?? 'N/A',
        catalogo_electronico: (compra.fk_bien.cat_elec == 0) ? 'NO' : 'SI',
        procedimiento_sugerido: compra.fk_bien.proc_sugerido?.valor ?? 'N/A',
        unidad_medida: compra.fk_bien.u_medida ?? 'N/A',
        precio_parcial: compra.precio_total,
        // TODO: Calcular la suma de los precios parciales por bien
        precio_referencial: 0,
        valor_total: compra.precio_total,
        periodo_estimado: ((compra.fk_bien.periodo1 || compra.fk_bien.periodo2 || compra.fk_bien.periodo3) ? '1 ' : '') + ((compra.fk_bien.periodo4 || compra.fk_bien.periodo5 || compra.fk_bien.periodo6) ? '2 ' : '') + ((compra.fk_bien.periodo7 || compra.fk_bien.periodo8 || compra.fk_bien.periodo9) ? '3 ' : '') + ((compra.fk_bien.periodo10 || compra.fk_bien.periodo11 || compra.fk_bien.periodo12) ? '4' : '')
      }))

      console.log(this.compras) */

      this.vmButtons[1].habilitar = false
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error cargando Bienes')
    }
  }

  /* getProgramas() {
    this.msgSpinner = 'Cargando Programas'
    this.lcargando.ctlSpinner(true)
    this.api.getProgramas().subscribe(
      res => {
        // console.log(res['data'])
        // Manejar respuesta aqui
        res['data'].forEach(element => {
          let obj = {
            id: element.id_catalogo,
            nombre: element.valor,
            codigo: element.descripcion
          }
          this.programas.push({...obj})
        });
        this.lcargando.ctlSpinner(false)
      },
      err => {
        this.lcargando.ctlSpinner(false)
        console.log(err)
        this.toastr.error(err.error.message, 'Error cargando Programas')
      }
    )
  } */

  /* getDepartamentos(evt) {
    let data = {
      programa: evt.nombre
    }
    this.departamentos = []
    this.compras = []
    this.vmButtons[0].habilitar = true
    this.msgSpinner = 'Cargando Departamentos'
    this.lcargando.ctlSpinner(true)
    this.api.getDepartamentos(data).subscribe(
      res => {
        // console.log(res)
        // Manejar respuesta aqui
        res['data'].forEach(element => {
          let obj = {
            id: element.id_catalogo,
            nombre: element.valor,
            codigo: element.descripcion
          }
          this.departamentos.push({...obj})
        });
        this.lcargando.ctlSpinner(false)
      },
      err => {
        this.lcargando.ctlSpinner(false)
        console.log(err)
        this.toastr.error(err.error.message, 'Error cargando Departamentos')
      }
    )
    Object.assign(this.seleccion.programa, evt)
  } */

  /* cargaMision(evt) {
    let data = {
      departamento: evt.nombre
    }
    this.msgSpinner = 'Cargando Mision'
    this.lcargando.ctlSpinner(true)
    this.api.getMision(data).subscribe(
      res => {
        this.seleccion.departamento['mision'] = res['data']['valor']
        this.getCompras(evt)
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Departamentos')
      }
    )
    Object.assign(this.seleccion.departamento, evt)
  } */

  /* getCompras(evt) {
    if (this.permissions.consultar == 0) {
      this.toastr.warning("No tiene permisos para consultar.", this.fTitle)
      this.lcargando.ctlSpinner(false)
      return
    }

    let data = {
      departamento: evt
    }
    this.compras = []
    this.vmButtons[0].habilitar = false
    this.msgSpinner = 'Cargando detalles'
    // this.lcargando.ctlSpinner(true)
    this.api.getBienesPlus(data).subscribe(
      res => {
        // console.log(res['data'])
        // Manejar respuesta aqui
        res['data'].forEach(element => {
            let obj = {
              requerimiento_general: element.fk_atribucion.valor,
              prg: element.fk_programa.descripcion,
              direccion_unidad: element.fk_programa.descripcion + element.fk_departamento.descripcion,
              cedula_asignacion: element.cedula_asignacion,
              codigo: element.fk_bien.partida_presupuestaria.valor,
              requerimiento_especifico: element.fk_bien.partida_presupuestaria.descripcion + '\n-\n' + element.fk_bien.descripcion,
              fuente_financiamiento: element.fk_bien.fuente_financ !== null ? element.fk_bien.fuente_financ.valor : 'N/A',
              categoria_producto: element.fk_bien.codigo_cpc !== null ? element.fk_bien.codigo_cpc.valor : 'NO',
              tipo_compra: element.fk_bien.tipo_compra !== null ? element.fk_bien.tipo_compra.valor : 'N/A',
              tipo_regimen: element.fk_bien.tipo_regimen !== null ? element.fk_bien.tipo_regimen.valor : 'N/A',
              tipo_producto: element.fk_bien.tipo_producto !== null ? element.fk_bien.tipo_producto.valor : 'N/A',
              catalogo_electronico: element.fk_bien.cat_elec !== null ? element.fk_bien.cat_elec.valor : 'N/A',
              procedimiento_sugerido: element.fk_bien.proc_sugerido !== null ? element.fk_bien.proc_sugerido.valor : 'N/A',
              cantidad: element.cantidad,
              unidad_medida: element.fk_bien.u_medida !== null ? element.fk_bien.u_medida.valor : 'N/A',
              precio_unitario: element.precio_unitario,
              precio_parcial: element.precio_total,
              // TODO: Calcular la suma de los precios parciales por bien
              precio_referencial: 0,
              valor_total: element.precio_total,
              // TODO: Calcular el periodo estimado basado en los meses de compra estimados
              periodo_estimado: ((element.fk_bien.periodo1 || element.fk_bien.periodo2 || element.fk_bien.periodo3) ? '1 ' : '') + ((element.fk_bien.periodo4 || element.fk_bien.periodo5 || element.fk_bien.periodo6) ? '2 ' : '') + ((element.fk_bien.periodo7 || element.fk_bien.periodo8 || element.fk_bien.periodo9) ? '3 ' : '') + ((element.fk_bien.periodo10 || element.fk_bien.periodo11 || element.fk_bien.periodo12) ? '4' : '')
            }
            this.compras.push({...obj})
        })
        this.lcargando.ctlSpinner(false)
      },
      err => {
        this.lcargando.ctlSpinner(false)
        console.log(err)
        this.toastr.error(err.error.message, 'Error cargando Compras')
      }
    )
  } */

  export() {
    if (this.permissions.exportar == 0) {
      this.toastr.warning("No tiene permisos para exportar.", this.fTitle)
      return
    }
    let rows = []

    this.compras.forEach((item: any) => {
      rows.push({
        requerimiento_general: item.fk_atribucion?.catalogo?.valor,
        prg: item.programa.descripcion,
        direccion_unidad: item.departamento?.valor,
        cedula_asignacion: 'N/A',
        codigo: item.partida_presupuestaria?.codigo ?? 'N/A',
        requerimiento_especifico: item.partida_presupuestaria?.nombre ?? 'N/A',
        fuente_financiamiento: item.fuente_financ?.valor ?? 'N/A',
        categoria_producto: item.codigo_cpc?.nombre ?? 'N/A',
        tipo_compra: item.tipo_compra?.valor ?? 'N/A',
        bien_codificable: item.bien_codificable ?? 'N/A',
        tipo_regimen: item.tipo_regimen?.valor ?? 'N/A',
        tipo_producto: item.tipo_producto?.valor ?? 'N/A',
        catalogo_electronico: item.cat_elec == 0 ? 'NO' : 'SI',
        procedimiento_sugerido: item.proc_sugerido?.valor ?? 'N/A',
        cantidad: item.cantidad_ajustada,
        unidad_medida: item.u_medida,
        precio_unitario: item.costo_unitario_ajustado,
        precio_parcial: item.costo_total_ajustado,
        precio_referencia: 0,
        valor_total: item.costo_total,
        periodo_estimado: ((item.periodo1 || item.periodo2 || item.periodo3) ? '1 ' : '') + ((item.periodo4 || item.periodo5 || item.periodo6) ? '2 ' : '') + ((item.periodo7 || item.periodo8 || item.periodo9) ? '3 ' : '') + ((item.periodo10 || item.periodo11 || item.periodo12) ? '4' : '')
      })
    })

    let data = {
      title: 'Matriz del Plan Anual de Contrataciones',
      subtitle: 'Informacion General',
      departamento: this.departamentoSelected,
      objetivo_operativo: this.mision.valor,
      programa: this.programaSelected,
      rows
    }



    this.xlsService.exportReportePAContrataciones(data, 'Reporte PAC')
  }

  bienCodificable(evt, compra) {
    compra['bien_codificable'] = evt
  }

}
