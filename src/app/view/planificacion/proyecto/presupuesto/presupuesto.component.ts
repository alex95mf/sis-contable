import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { PresupuestoService } from './presupuesto.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonService } from 'src/app/services/commonServices';
import * as myVarGlobals from 'src/app/global';
import { ModalBuscaCodigoComponent } from './modal-busca-codigo/modal-busca-codigo.component';
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import { NgSelectComponent } from '@ng-select/ng-select';
@Component({
standalone: false,
  selector: 'app-presupuesto',
  templateUrl: './presupuesto.component.html',
  styleUrls: ['./presupuesto.component.scss']
})
export class PresupuestoComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChildren(NgSelectComponent) selectables: QueryList<NgSelectComponent>;
  fTitle = 'Asignacion de Partidas Presupuestarias'
  mensajeSpinner: string
  vmButtons: any
  dataUser: any
  permissions: any

  periodos: Array<any>;
  periodoSelected: number = null;
  periodoObjectSelected: any = null;
  programas: Array<any>;
  programaSelected: any = null;
  programaObjectSelected: any = null;
  departamentos: Array<any>;
  departamentoSelected: any = null;
  departamentosFilter: Array<any>;
  departamentoObjectSelected: any = null;
  bienes: Array<any> = [];

  cmb_fondos_bid: Array<any> = [
    {value: 0, label: 'NO'},
    {value: 1, label: 'SI'}
  ]
  cmb_tipo_presupuesto: Array<any>;
  cmb_fuente_financiamiento: Array<any>;

  validaciones = new ValidacionesFactory();

  // programas = []
  // departamentos = []
  // atribuciones = []
  // codigos = []
  // tipoPresupuesto = []
  // fuentesFinanciamiento = []

  programa: any = 0
  departamento: any = 0
  atribucion: any = 0
  codigo: any

  deptProg = []
  attrDept = []
  fondosBidDisabled: boolean = true

  codDesc: string = ''

  constructor(
    private apiSrv: PresupuestoService, 
    private toastr: ToastrService, 
    private commonServices: CommonService,
    private modalService: NgbModal,
    ) {
      this.apiSrv.selectCodigoPresupuesto$.subscribe(
        (res: any) => {
          console.log(res)
          Object.assign(
            this.bienes.find((bien: any) => bien.id == res.bien.id).partida_presupuestaria,
            {
              codigo: res.codigo_presupuesto.codigo,
              descripcion_general: res.codigo_presupuesto.descripcion_general,
              nombre: res.codigo_presupuesto.nombre,
            }
          )
        }
      )
    }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsAsigPartPres", paramAccion: "", boton: { icon: "fa fa-search", texto: "CONSULTAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false },
      { orig: "btnsAsigPartPres", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: true },
      { orig: "btnsAsigPartPres", paramAccion: "", boton: { icon: "fas fa-times", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ]
    setTimeout(() => {
      this.validaPermisos()
    }, 50)

  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "CONSULTAR":
        // Mensaje de confirmacion de haber guardado
        this.handleClickBuscar()
        break;
      case "GUARDAR":
        // Mensaje de confirmacion de haber guardado
        this.handleClickGuardar()
        break;
      case "CANCELAR":
        // Limpiar las listas
        this.handleClearForm()
        break;
      default:
        break;
    }
  }

  validaPermisos() {
    (this as any).mensajeSpinner = 'Cargando Permisos de Usuario'
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    let params = {
      codigo: myVarGlobals.fAttrPartida,
      id_rol: this.dataUser.id_rol,
    };

    this.lcargando.ctlSpinner(true);
    this.commonServices.getPermisionsGlobas(params).subscribe(
      res => {
        this.permissions = res["data"][0];
        if (this.permissions.abrir == "0") {
          this.lcargando.ctlSpinner(false);
          this.vmButtons = [];  // Supuestamente deberia desaparecer los botones de accion
          this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle);
        } else {
          setTimeout(() => {
            // this.vmButtons[0].habilitar = false  // Es manejado por seleccionaPrograma()
            this.cargaInicial();
          }, 250)
        }
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }

  async cargaInicial() {
    (this as any).mensajeSpinner = 'Cargando Periodos'
    this.periodos = await this.apiSrv.getPeriodos();
    
    (this as any).mensajeSpinner = 'Cargando Programas'
    this.programas = await this.apiSrv.getProgramas();
    this.programas.map((programa: any) => Object.assign(programa, { label: `${programa.descripcion}. ${programa.valor}` }));
    
    (this as any).mensajeSpinner = 'Cargando Departamentos'
    this.departamentos = await this.apiSrv.getDepartamentos();
    this.departamentos.map((departamento: any) => Object.assign(departamento, { label: `${departamento.descripcion}. ${departamento.valor}`}));
    
    (this as any).mensajeSpinner = 'Cargando Catalogos'
    let response: any = await this.apiSrv.getCatalogo({params: "'PLA_TIPO_PRESUPUESTO','PLA_FUENTE_FI'"})
    this.cmb_tipo_presupuesto = response.PLA_TIPO_PRESUPUESTO
    this.cmb_fuente_financiamiento = response.PLA_FUENTE_FI

    this.lcargando.ctlSpinner(false)
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
    this.lcargando.ctlSpinner(true);
    try {
      (this as any).mensajeSpinner = 'Cargando Bienes'
      this.bienes = await this.apiSrv.getBienes({periodo: this.periodoSelected, departamento: this.departamentoObjectSelected.id_catalogo});
      this.bienes.map((bien: any) => Object.assign(bien, { 
        fondosBidDisabled: bien.fondos_bid == 0,
        partida_presupuestaria: {
          codigo: (bien.partida_presupuestaria != null) ? bien.partida_presupuestaria.codigo : null,
          descripcion_general: (bien.partida_presupuestaria != null) ? bien.partida_presupuestaria.descripcion_general : null,
          nombre: (bien.partida_presupuestaria != null) ? bien.partida_presupuestaria.nombre : null,
        }
      }))
      this.vmButtons[1].habilitar = false
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error cargando Bienes')
    }
  }

  handleClearForm() {
    Swal.fire({
      title: 'Seguro/a de borrar el formulario?',
      text: 'Todos los cambios no seran guardados',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.bienes = []
        this.vmButtons[1].habilitar = true
        this.selectables.map((select: NgSelectComponent) => select.handleClearClick())
      }
    })
  }

  async handleClickGuardar() {
    this.lcargando.ctlSpinner(true);
    try {
      (this as any).mensajeSpinner = 'Asignando Partidas Presupuestarias'
      let response = await this.apiSrv.setPartidas({bienes: this.bienes})
      console.log(response)

      this.lcargando.ctlSpinner(false)
      Swal.fire('Partidas Presupuestarias asignadas correctamente', '', 'success')
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error asignando Partidas Presupuestarias')
    }
  }

  /* cargaCatalogos() {
    (this as any).mensajeSpinner = 'Cargando Catalogos'
    let data = {
      params: "'PLA_PROGRAMA','PLA_DEPARTAMENTO','PLA_COD_PRESUP','PLA_TIPO_PRESUPUESTO','PLA_AFIRMACION','PLA_FUENTE_FI'"
    }

    this.lcargando.ctlSpinner(true);
    this.apiSrv.getCatalogos(data).subscribe(
      (res: any) => {
        res['data']['PLA_PROGRAMA'].forEach(p => {
          const { id_catalogo, valor, descripcion } = p
          this.programas = [...this.programas, { id: id_catalogo, nombre: valor, codigo: descripcion }]
        })
        res['data']['PLA_DEPARTAMENTO'].forEach(d => {
          const { id_catalogo, valor, descripcion, grupo } = d
          this.departamentos = [...this.departamentos, { id: id_catalogo, nombre: valor, programa: grupo, codigo: descripcion }]
        })
        res['data']['PLA_COD_PRESUP'].forEach(a => {
          const { id_catalogo, valor, descripcion } = a
          this.codigos = [...this.codigos, { id: id_catalogo, valor: valor, descripcion: descripcion }]
        })
        res['data']['PLA_AFIRMACION'].forEach(p => {
          const { id_catalogo, valor } = p
          this.fondosBid = [...this.fondosBid, { id: id_catalogo, nombre: valor }]
        })
        res['data']['PLA_TIPO_PRESUPUESTO'].forEach(p => {
          const { id_catalogo, valor } = p
          this.tipoPresupuesto = [...this.tipoPresupuesto, { id: id_catalogo, nombre: valor }]
        })
        res['data']['PLA_FUENTE_FI'].forEach(p => {
          const { id_catalogo, valor } = p
          this.fuentesFinanciamiento = [...this.fuentesFinanciamiento, { id: id_catalogo, nombre: valor}]
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
    (this as any).mensajeSpinner = 'Filtrando Departamentos'
    this.lcargando.ctlSpinner(true);
    this.deptProg = this.departamentos.filter(d => d.programa == event)
    this.departamento = 0
    this.bienesAttr = []
    setTimeout(() => this.lcargando.ctlSpinner(false), 750)
  } */

  /* selectDept(event) {
    // this.attrDept = this.atribuciones.filter(a => a.departamento == event)
    (this as any).mensajeSpinner = 'Cargando Bienes y Servicios'
    this.bienesAttr = []

    let data = {
      departamento: event.id
    }
    this.lcargando.ctlSpinner(true);
    this.apiSrv.getBienesDepartamento(data).subscribe(
      (res: any) => {
        console.log(res['data'])
        res.data.forEach((b: any) => {
          let bien = {
            id: b.id,
            descripcion: b.descripcion,
            cant: b.cantidad,
            cUnitario: b.costo_unitario,
            cTotal: b.costo_total,
            partida: (b.partida_presupuestaria !== 0 && b.partida_presupuestaria !== null) ? { id: 0, valor: b.partida_presupuestaria.codigo, descripcion: b.partida_presupuestaria.descripcion_general } : { id: 0, valor: '', descripcion: '' },
            fondosBid: (b.fondos_bid !== 0 && b.fondos_bid !== null) ? this.fondosBid.find(f => f.id == b.fondos_bid) : { id: null, nombre: '' },
            cOperacion: b.codigo_operacion,
            cProyecto: b.codigo_proyecto,
            fuenteFinanciamiento: (b.fuente_financ !==0 && b.fuente_financ !== null) ? this.fuentesFinanciamiento.find(t => t.id == b.fuente_financ) : { id: 0, nombre: ''},
            tipoPresupuesto: (b.tipo_presupuesto !== 0 && b.tipo_presupuesto !== null) ? this.tipoPresupuesto.find(t => t.id == b.tipo_presupuesto) : { id: 0, nombre: '' },
            fondosBidDisabled: (b.fondos_bid !== null && b.fondos_bid !== 0) ? this.fondosBid.find(f => f.id == b.fondos_bid).nombre != 'SI' : 1
          }
          this.bienesAttr.push(bien)
          // this.selectFondos(bien.fondosBid, bien)
        })
        this.lcargando.ctlSpinner(false)
        this.vmButtons[0].habilitar = false
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Bienes y Servicios')
      }
    )
  } */

  selectFondos(event, bien) {
    if (event == undefined) return;
    // Si el Producto es adquirido con fondos BID, habilitar los campos relacionados
    bien.fondosBidDisabled = event.label == 'NO'
  }

  calculaTotal(bien) {
    bien.costo_total = bien.cantidad * bien.costo_unitario
  }

  /* asignaPartPresupuestaria() {
    if (this.permissions.guardar == '0') {
      this.toastr.warning('No tiene los permisos para usar este recurso', this.fTitle)
      return
    }

    (this as any).mensajeSpinner = 'Almacenando cambios'
    let data = {
      bienes: this.bienesAttr
    }

    this.lcargando.ctlSpinner(true);
    this.apiSrv.asignaPartida(data).subscribe(
      (res: any) => {
        this.lcargando.ctlSpinner(false)
        Swal.fire('Datos almacenados correctamente', '', 'success')
        this.vmButtons[0].habilitar = true
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error asignando Partida Presupuestaria')
      }
    )

  } */

  /* clear() {
    this.deptProg = []
    this.attrDept = []
    this.bienesAttr = []
    this.programa = 0
    this.departamento = 0
    this.atribucion = 0
    this.vmButtons[0].habilitar = true
  } */

  buscaCodigoPresupuesto(idx: number, bien: any) {
    // Obtener valor ingresado
    const elem = document.querySelector(`#query-${idx}`) as HTMLInputElement
    const query = elem?.value
    elem.value = ''

    // Llevarlo al modal para su busqueda
    const modal = this.modalService.open(ModalBuscaCodigoComponent, { size: 'xl', backdrop: 'static' })
    modal.componentInstance.query = query
    modal.componentInstance.bien = bien
  }

}
