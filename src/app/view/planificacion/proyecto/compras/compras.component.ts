import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import * as myVarGlobals from 'src/app/global';

import { ComprasService } from './compras.service';
import { ModalCodigoComprasComponent } from './modal-codigo-compras/modal-codigo-compras.component';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
standalone: false,
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.scss']
})
export class ComprasComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChildren(NgSelectComponent) selectables: QueryList<NgSelectComponent>;
  fTitle : string = 'Asignacion de Codigo de Compras Publicas'
  mensajeSpinner : string
  vmButtons : any
  dataUser: any
  permissions: any

  periodos: Array<any>;
  periodoSelected: number = null;
  periodoObjectSelected: any;
  programas: Array<any>;
  programaSelected: string = null;
  programaObjectSelected: any;
  departamentos : Array<any>;
  departamentoSelected: any = null;
  departamentoObjectSelected: any = null;
  departamentosFilter: Array<any> = [];
  bienes: Array<any> = [];
  cmb_tipo_compra: Array<any> = [];
  cmb_tipo_regimen: Array<any> = [];
  cmb_procedimiento_sugerido: Array<any> = [];
  cmb_tipo_producto: Array<any> = [];
  cmb_catalogo_electronico: Array<any> = [
    {value: 0, label: 'NO'},
    {value: 1, label: 'SI'}
  ]


  partidas : any = []
  tipoCompras : any = []
  tiposRegimen : any = []
  procsSugeridos : any = []
  tiposProducto : any = []
  catElectronico : any = []

  query_cpc: string

  regimenProc = []

  programa : any = 0
  departamento : any = 0

  constructor(
    private apiSrv : ComprasService, 
    private toastr : ToastrService, 
    private commonServices: CommonService, 
    private modalService: NgbModal,
    private commonVarService: CommonVarService
  ) {
    this.apiSrv.codComprasSelected$.subscribe(
      (res: any) => {
        // console.log(res)
        Object.assign(
          this.bienes.find((bien: any) => bien.id == res.bien.id),
          { codigo_cpc: res.codigo_cpc }
        )
      }
    )
  }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsAsigCPC", paramAccion: "", boton: { icon: "fas fa-search", texto: "CONSULTAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false },
      { orig: "btnsAsigCPC", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: true },
      { orig: "btnsAsigCPC", paramAccion: "", boton: { icon: "fas fa-times", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ]
    
    setTimeout(() => {
      this.validaPermisos()
    }, 50)
    
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {

      case "CONSULTAR":
if (this.periodoSelected == undefined || this.programaSelected == undefined || this.departamentoSelected == undefined)
{
  this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle);
  return;
}


        this.handleClickBuscar()
        break;
      case "GUARDAR":
        this.asignaCPC()
        break;
      case "CANCELAR":
        this.handleClickCancelar()
        break;
      default:
        break;
    }
  }

  validaPermisos() {
    (this as any).mensajeSpinner = 'Cargando Permisos de Usuario'
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    let params = {
      codigo: myVarGlobals.fAttrCompras,
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
      err => {
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
    let response: any = await this.apiSrv.getCatalogo({params: "'PLA_TIPO_COMPRA','PLA_TIPO_REGIMEN','PLA_PROC_SUGE','PLA_TIPO_PRODUCTO'"})
    console.log(response)
    this.cmb_tipo_compra = response.PLA_TIPO_COMPRA
    this.cmb_tipo_regimen = response.PLA_TIPO_REGIMEN
    this.cmb_procedimiento_sugerido = response.PLA_PROC_SUGE
    this.cmb_tipo_producto = response.PLA_TIPO_PRODUCTO

    this.lcargando.ctlSpinner(false)
  }

  async handleClickBuscar() {
    this.lcargando.ctlSpinner(true);
    try {
      (this as any).mensajeSpinner = 'Cargando Bienes'
      this.bienes = await this.apiSrv.getBienes({periodo: this.periodoSelected, departamento: this.departamentoObjectSelected.id_catalogo});
      this.bienes.map((bien: any) => Object.assign(bien, { 
        procSugeridos: (bien.tipo_regimen != 0) ? this.cmb_procedimiento_sugerido.filter((tipo: any) => tipo.grupo == this.cmb_tipo_regimen.find((tipo: any) => tipo.id_catalogo == bien.tipo_regimen).valor) : [],
        codigo_cpc: {
          cod_unificado: (bien.codigo_cpc != null) ? bien.codigo_cpc.cod_unificado : null,
          nombre: (bien.codigo_cpc != null) ? bien.codigo_cpc.nombre : null
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
        this.bienes = [];
        this.vmButtons[0].habilitar = true
        this.selectables.map((select: NgSelectComponent) => select.handleClearClick())
      }
    })
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
    this.bienes = [];
  }

  handleSelectDepartamento(event) {
    if (event == undefined) return;
    this.departamentoObjectSelected = event
    this.bienes = [];
  }

  handleClickCancelar() {
    this.bienes = [];
    this.selectables.map((select: NgSelectComponent) => select.handleClearClick())
  }

  /* cargaCatalogos() {
    (this as any).mensajeSpinner = 'Cargando Catalogos'
    let data = {
      params: "'PLA_PROGRAMA','PLA_DEPARTAMENTO','PLA_COD_PRESUP','PLA_TIPO_COMPRA','PLA_TIPO_REGIMEN','PLA_PROC_SUGE','PLA_TIPO_PRODUCTO','PLA_AFIRMACION','PLA_COD_CPC'"
    }
    this.lcargando.ctlSpinner(true);
    this.apiSrv.getCatalogos(data).subscribe(
      (res: any) => {
        res['data']['PLA_PROGRAMA'].forEach(p => {
          let programa = {
            id: p.id_catalogo,
            nombre: p.valor,
            codigo: p.descripcion
          }
          this.programas.push(programa)
        })
        res['data']['PLA_DEPARTAMENTO'].forEach(d => {
          let departamento = {
            id: d.id_catalogo,
            nombre: d.valor,
            programa: d.grupo,
            codigo: d.descripcion
          }
          this.departamentos.push(departamento)
        })
        
        res['data']['PLA_COD_PRESUP'].forEach(a => {
          let partida = {
            id: a.id_catalogo,
            valor: a.valor,
            descripcion: a.descripcion
          }
          this.partidas.push(partida)
        })
        
        res['data']['PLA_TIPO_COMPRA'].forEach(a => {
          let tipoCompra = {
            id: a.id_catalogo,
            valor: a.valor,
            descripcion: a.descripcion
          }
          this.tipoCompras.push(tipoCompra)
        })
        res['data']['PLA_TIPO_REGIMEN'].forEach(a => {
          let tipoRegimen = {
            id: a.id_catalogo,
            valor: a.valor
          }
          this.tiposRegimen.push(tipoRegimen)
        })
        res['data']['PLA_PROC_SUGE'].forEach(a => {
          let procSugerido = {
            id: a.id_catalogo,
            valor: a.valor,
            grupo: a.grupo
          }
          this.procsSugeridos.push(procSugerido)
        })
        res['data']['PLA_TIPO_PRODUCTO'].forEach(a => {
          let tipoProducto = {
            id: a.id_catalogo,
            valor: a.valor
          }
          this.tiposProducto.push(tipoProducto)
        })
        res['data']['PLA_AFIRMACION'].forEach(a => {
          let afirmacion = {
            id: a.id_catalogo,
            valor: a.valor
          }
          this.catElectronico.push(afirmacion)
        })
        this.lcargando.ctlSpinner(false)
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Catalogos')
      }
    )
  } */

  /* selectProg(event) {
    if (event === 0) {
      this.deptProg = []
      this.departamento = 0
      this.bienesAttr = []
      return
    }

    this.departamento = 0
    this.deptProg = this.departamentos.filter(d => d.programa == event.nombre)
  } */

  /* async selectDept(event) {
    this.bienesAttr = []
    (this as any).mensajeSpinner = 'Cargando Bienes y Servicios'
    this.lcargando.ctlSpinner(true);

    try {
      this.bienesAttr = await this.apiSrv.getBienes({departamento: this.departamento.id})
      console.log(this.bienesAttr)
      this.bienesAttr.forEach((item: any) => {
        // console.log(item.proc_sugerido, typeof item.proc_sugerido)
        // if (item.codigo_cpc !== null) {
        //   item.codigo_cpc = item.codigo_cpc.id_catalogo
        // }
        if (item.proc_sugerido !== null && item.proc_sugerido !== 0) {
          Object.assign(
            item, 
            { procSugeridos: this.procsSugeridos.filter(q => q.grupo == this.procsSugeridos.find(p => p.id == item.proc_sugerido).grupo) }
          )
        }
      })
      this.vmButtons[0].habilitar = false
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err, 'Error cargando Bienes y Servicios')
    }
  } */

  selectRegimen(event, bienRef) {
    if (event == undefined) return;
    console.log(event, bienRef)
    // bien.procSugeridos = []
    Object.assign(
      this.bienes.find((bien: any) => bien.id == bienRef.id),
      { procSugeridos: this.cmb_procedimiento_sugerido.filter((procs: any) => procs.grupo == event.valor)}
    )
  }

  /* clear() {
    this.deptProg = []
    this.bienesAttr = []
    this.programa = 0
    this.departamento = 0
    this.vmButtons[0].habilitar = true
  } */

  async asignaCPC() {
    if (this.permissions.guardar == 0) {
      this.toastr.warning('No tiene permisos para usar este recurso', this.fTitle)
      return
    };

    (this as any).mensajeSpinner = 'Guardando datos...'
    this.lcargando.ctlSpinner(true);

    try {
      let response = await this.apiSrv.asignaCPC({bienes: this.bienes})
      console.log(response)

      this.lcargando.ctlSpinner(false)
      Swal.fire('Codigo de Compras asignado correctamente', '', 'success')
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error asignando codigo CPC')
    }
    /* this.apiSrv.asignaCPC({detalles: this.bienesAttr}).subscribe(
      res => {
        // console.log(res['data'])
        this.lcargando.ctlSpinner(false)
        Swal.fire({
          title: this.fTitle,
          text: res['data'],
          icon: 'success'
        })
        this.vmButtons[0].habilitar = true
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error asignando codigo CPC')
      }
    ) */
  }


expandCodigoCompras(idx: number, bien: any) {
  const modal = this.modalService.open(
    ModalCodigoComprasComponent,
    { size: 'lg', backdrop: 'static' }
  )
  modal.componentInstance.bien = bien
}

  /* buscaCodigoCompra(i, bien) {
    // Obtener valor ingresado
    const elem = document.querySelector(`#query-${i}`) as HTMLInputElement
    const query = elem?.value
    elem.value = ''

    // Llevarlo al modal para su busqueda
    const modal = this.modalService.open(ModalBuscaCodigoComponent, { size: 'lg', backdrop: 'static' })
    modal.componentInstance.query = query
    modal.componentInstance.bien = bien

  } */
}
