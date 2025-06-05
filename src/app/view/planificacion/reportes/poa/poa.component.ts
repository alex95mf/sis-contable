import { Component, OnInit, ViewChild } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { XlsExportService } from 'src/app/services/xls-export.service';

import * as myVarGlobals from 'src/app/global';
import { CommonService } from 'src/app/services/commonServices';

import { PoaService } from './poa.service';

@Component({
standalone: false,
  selector: 'app-poa',
  templateUrl: './poa.component.html',
  styleUrls: ['./poa.component.scss']
})
export class PoaComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent
  mensajeSpinner: string
  fTitle: string = "Reporte Plan Operativo Anual"
  vmButtons: any = []
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

  atribuciones: Array<any> = [];

  lst_objetivo_estrategico: Array<any> = []

  gad_mision: string = 'Somos la institución de gobierno del cantón La Libertad, \
  que promueve el desarrollo social y económico de sus habitantes, en base al \
  cumplimiento de las competencias municipales, la participación ciudadana, \
  la administración y la gestión eficiente de recursos, que le permiten atender \
  las necesidades de los libértense con calidez y eficiencia'
  gad_vision: string = 'Ser la institución municipal modelo a nivel nacional \
  en la gestión y administración eficiente de los recursos adaptándose a \
  los cambios del entorno para sostener y maximizar el desarrollo social y  \
  económico alcanzado en beneficios de sus habitantes'
  gad_objetivos: string = 'Garantizar que la gestión municipal y los servicios que \
  presta el GAD sean eficientes y eficaces para fortalecer la Administración Pública.'
  obj_componentes: any = {}
  


  constructor(
    private api: PoaService,
    private toastr: ToastrService,
    private xlsService : XlsExportService,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {

    this.vmButtons = [

      {
        orig: "btnsReporte",
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
        orig: "btnsReporte",
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
    }, 150)
  }
  
  metodoGlobal(evt) {
    switch (evt.items.boton.texto) {
      case "PDF":
        
        break;
        case "CONSULTAR":
          if (this.periodoObjectSelected == undefined || this.programaObjectSelected == undefined 
            || this.departamentoObjectSelected == undefined
          )
          {
            this.toastr.warning("Por favor seleccione Periodo, Programa y Departamento..", this.fTitle);
            return;
          }

          this.handleClickBuscar()
          break;
      case "EXCEL":
        this.exportarXLS()
        break;
      default:
        break;
    }
  }

  validaPermisos() {
    (this as any).mensajeSpinner = 'Cargando Permisos de Usuario'
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    let params = {
      codigo: myVarGlobals.fRepoPOA,
      id_rol: this.dataUser.id_rol,
    };

    this.lcargando.ctlSpinner(true)
    this.commonService.getPermisionsGlobas(params).subscribe(
      res => {
        this.permissions = res["data"][0];
        if (this.permissions.abrir == "0") {
          this.lcargando.ctlSpinner(false);
          this.vmButtons = [];
          this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle);
        } else {
          setTimeout(() => {
            // this.cargaProgramas();
            this.cargaInicial()
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
      (this as any).mensajeSpinner = 'Cargando Periodos'
      this.periodos = await this.api.getPeriodos();

      (this as any).mensajeSpinner = 'Cargando Programas'
      this.programas = await this.api.getProgramas();
      this.programas.map((programa: any) => Object.assign(programa, { label: `${programa.descripcion}. ${programa.valor}` }))

      (this as any).mensajeSpinner = 'Cargando Departamentos'
      this.departamentos = await this.api.getDepartamentos();
      this.departamentos.map((departamento: any) => Object.assign(departamento, { label: `${departamento.descripcion}. ${departamento.valor}`}))

      (this as any).mensajeSpinner = 'Cargando Datos Adicionales'
      let response: any = await this.api.getCatalogo({params: "'PLA_OE'"})
      this.lst_objetivo_estrategico = response.PLA_OE
      

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
      // Obtener los Objetivos y Componentes del Programa
      (this as any).mensajeSpinner = 'Cargando Objetivos y Componentes'
      this.obj_componentes = await this.api.getObjetivosComponentes({periodo: this.periodoObjectSelected, programa: this.programaObjectSelected, departamento: this.departamentoObjectSelected})

      // Obtener la Mision
      (this as any).mensajeSpinner = 'Obteniendo la Mision'
      let mision: any = await this.api.getMision({/* periodo: this.periodoObjectSelected, */ departamento: this.departamentoObjectSelected})
      Object.assign(this.obj_componentes, { mision: mision.valor })

      // Obtener las Atribuciones
      (this as any).mensajeSpinner = 'Cargando las Atribuciones'
      this.atribuciones = await this.api.getAtribuciones({periodo: this.periodoObjectSelected, departamento: this.departamentoObjectSelected})
      this.atribuciones.map((atribucion: any) => {
        let fuente_finaciemiento = [];
        let presupuestado = 0;
        let devengado = 0;
        let pagado = 0;
        if (Array.isArray(atribucion.bienes) && atribucion.bienes.length > 0) {
          atribucion.bienes.forEach((bien: any) => {
            // Obtiene la fuente de financiamiento
            if (bien.fuente_financ != null && !fuente_finaciemiento.includes(bien.fuente_financ.valor)) {
              fuente_finaciemiento.push(bien.fuente_financ.valor)  
            }
            // Calcula el valor presupuestado
            presupuestado += parseFloat(bien.costo_total)  
            // Obtener el valor devengado
            let solicitado = 0
            bien.solicitud.forEach((solic: any) => {
              solicitado += solic.cantidad_requerida
            });
            devengado = solicitado * bien.costo_unitario
            // Obtiene el presupuesto pagado
            pagado += parseFloat(bien.pagado)  
          })
        }
        Object.assign(atribucion, {
          fuente_finaciemiento: fuente_finaciemiento,
          presupuestado: presupuestado,
          devengado: devengado,
          pagado: pagado
        })
      })
      // console.log(atribuciones)
      
      this.vmButtons[0].habilitar = false
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error cargando Bienes')
    }
  }

  /* cargaProgramas() {
    if (this.permissions.consultar == 0) {
      this.toastr.warning("No tiene permitido consultar", this.fTitle);
      this.lcargando.ctlSpinner(false)
      return
    }

    (this as any).mensajeSpinner = 'Cargando Programas'
    this.lcargando.ctlSpinner(true)
    this.api.getProgramas().subscribe(
      res => {
        // console.log(res)
        res['data'].forEach(element => {
          let obj = {
            id: element.id_catalogo,
            nombre: element.valor,
            codigo: element.descripcion
          }
          this.programas.push({ ...obj })
        });
        
        this.cargaObjetivosEstrategicos()
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Programas')
      }
    )
  } */

  /* cargaDepartamentos(evt) {
    // Housekeeping
    this.departamentos = []
    this.atribuciones = []
    this.obj_componentes = {}

    // Deshabilita los botones de exportacion
    this.vmButtons[0].habilitar = true
    // this.vmButtons[1].habilitar = true

    (this as any).mensajeSpinner = 'Cargando Departamentos'
    let data = {
      programa: evt.nombre
    }

    this.lcargando.ctlSpinner(true)
    this.api.getDepartamentos(data).subscribe(
      res => {
        res['data'].forEach(element => {
          let obj = {
            id: element.id_catalogo,
            nombre: element.valor,
            codigo: element.descripcion
          }
          this.departamentos.push({ ...obj })
        })
        this.cargaObjetivosComponentes(evt)
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Departamentos')
      }
    )
  } */

  /* cargaObjetivosComponentes(evt) {
    this.obj_componentes = {}
    let data = {
      programa: evt
    }
    (this as any).mensajeSpinner = 'Cargando Objetivos y Componentes'

    this.api.getObjetivosComponentes(data).subscribe(
      res => {
        // console.log(res['data'][0])
        Object.assign(this.obj_componentes, res['data'][0])
        this.lcargando.ctlSpinner(false)
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Objetivos y Componentes')
      }
    )

  } */

  /* cargaMision(evt) {
    let data = {
      departamento: evt.nombre
    }
    (this as any).mensajeSpinner = 'Cargando Mision'

    this.lcargando.ctlSpinner(true)
    this.api.getMision(data).subscribe(
      res => {
        this.obj_componentes['mision'] = res['data']['valor']
        this.cargaAtribuciones(evt)
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Departamentos')
      }
    )
  } */

  /* cargaObjetivosEstrategicos() {
    (this as any).mensajeSpinner = 'Cargando Objetivos Estrategicos'
    let data = {
      params: "'PLA_OE'"
    }
    this.api.getCatalogs(data).subscribe(
      res => {
        res['data']['PLA_OE'].forEach(element => {
          this.oe.push(element.valor)
        })
        this.lcargando.ctlSpinner(false)
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Objetivos Estrategicos')
      }
    )
  } */

  /* cargaAtribuciones(evt) {
    let data = {
      departamento: evt
    }
    (this as any).mensajeSpinner = 'Cargando Atribuciones'
    this.atribuciones = []

    this.lcargando.ctlSpinner(true)
    this.api.getAtribuciones(data).subscribe(
      res => {
        console.log(res['data'])
        res['data'].forEach(element => {
          // Cargar las atribuciones
          let obj = {
            id: element.catalogo.id_catalogo,
            nombre: element.catalogo.valor,
            formula: element.formula,
            frecuencia: element.frecuencia == null ? 'N/A' : element.frecuencia.valor,
            meta: element.meta,
            prevision: element.prevision == null ? 'N/A' : element.prevision.valor,
            periodo1: element.cuatrimestre1,
            periodo2: element.cuatrimestre2,
            periodo3: element.cuatrimestre3,
            periodo4: element.cuatrimestre4,
            fuentes_fin: [],
            presupuestado: 0,
            devengado: 0,
            pagado: 0,
          }

          // Obtener presupuesto y fuentes de financiacion de los bienes de cada atribucion
          if (Array.isArray(element.bienes) && element.bienes.length > 0) {
            element.bienes.forEach((bien: any) => {
              // Obtiene la fuente de financiamiento
              if (bien.fuente_financ != null && !obj.fuentes_fin.includes(bien.fuente_financ.valor)) {
                obj.fuentes_fin.push(bien.fuente_financ.valor)  
              }
              // Calcula el valor presupuestado
              obj.presupuestado += parseFloat(bien.costo_total)  
              // Obtener el valor devengado
              let solicitado = 0
              bien.solicitud.forEach((solic: any) => {
                solicitado += solic.cantidad_requerida
              });
              obj.devengado = solicitado * bien.costo_unitario
              // Obtiene el presupuesto pagado
              obj.pagado += parseFloat(bien.pagado)  
            })
          }

          this.atribuciones.push({ ...obj })
        })

        // Habilita los botones de exportacion
        this.vmButtons[0].habilitar = false
        // this.vmButtons[1].habilitar = false

        this.lcargando.ctlSpinner(false)
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Atribuciones')
      }
    )
  } */

  exportarXLS()
  {
    if (this.permissions.exportar == 0) {
      this.toastr.warning("No tiene permitido exportar", this.fTitle)
      return
    }
    let data = {
      title: 'Plan Operativo Anual Institucional Para el Año ' + (new Date().getFullYear() + 1),
      subtitle: 'Información General',
      gad_mision: this.gad_mision,
      gad_vision: this.gad_vision,
      gad_objetivo: this.gad_objetivos,
      oe: this.lst_objetivo_estrategico
    }

    let rows = []

    for (let i = 0; i < this.atribuciones.length; i++)
    {
      let row = {
        ods: this.obj_componentes.ods?.descripcion,
        meta_ods: this.obj_componentes.meta_ods?.descripcion,
        opg: this.obj_componentes.opg?.descripcion,  // Objetivos de Plan de Gobierno || Objetivos Nacionales de Desarrollo
        ppg: this.obj_componentes.ppg?.descripcion,
        eje: this.obj_componentes.eje?.descripcion,
        meta_zonal: this.obj_componentes.meta_zonal?.descripcion,
        competencia: this.obj_componentes.competencia?.valor,
        oe: this.obj_componentes.oe?.valor,
        meta_resultado: this.obj_componentes.meta_resultado?.valor,
        indicador: this.obj_componentes.indicador?.valor,
        tendencia: this.obj_componentes.tendencia?.valor,
        intervencion: this.obj_componentes.intervencion?.valor,
        objetivo_operativo: this.obj_componentes.mision,
        nombre: this.atribuciones[i].catalogo.valor,
        formula: this.atribuciones[i].formula,
        frecuencia: this.atribuciones[i].frecuencia?.valor,
        meta: this.atribuciones[i].meta,
        prevision: this.atribuciones[i].prevision?.valor,
        periodo1: `${this.atribuciones[i].cuatrimestre1} %`,
        periodo2: `${this.atribuciones[i].cuatrimestre2} %`,
        periodo3: `${this.atribuciones[i].cuatrimestre3} %`,
        periodo4: `${this.atribuciones[i].cuatrimestre4} %`,
        responsables: '',
        financiamiento: this.atribuciones[i].fuente_finaciemiento.join(', '),
        presupuestado: `$ ${this.atribuciones[i].presupuestado}`,
        devengado: `$ ${this.atribuciones[i].devengado}`,
        pagado: `$ ${this.atribuciones[i].pagado}`
      }
      rows.push({...row})
    }

    data['rows'] = rows
    console.log(data);
    // console.log(rows)
    this.xlsService.exportReportePOA('Reporte POA', data)
  }

}
