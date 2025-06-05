import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import * as myVarGlobals from 'src/app/global';

import { GruposService } from './grupos.service';
import { ModalCuentPreComponent } from './modal-cuent-pre/modal-cuent-pre.component';

@Component({
standalone: false,
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.scss']
})
export class GruposComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent
  mensajeSpinner: string
  gridConfig: object
  grid: any
  vmButtons: any[] = []
  dataUser: any
  permissions: any
  fTitle: string = 'Gestion de Grupos de Bienes'

  data: any[] = []
  grupoSelected: boolean = false
  newGroup: boolean = false
  newGrupo: any = {}
  grupo: any = {}

  padre: any = {}

  tipo_bien: any = []

  vidaUtil: boolean = true;

  onDestroy$: Subject<void> = new Subject();

  constructor(
    private apiService: GruposService,
    private toastr: ToastrService,
    private commonService: CommonService,
    private commonVarService: CommonVarService,
    private modalService: NgbModal,
  ) {
    this.gridConfig = {
      id: 'myGrid',
      title: 'Grupos de Inventario',
      height: 'fit',
      selModel: 'row',
      trackOver: true,
      theme: 'gray',
      defaults: {
        type: 'string',
        sortable: false,
        resizable: true,
      },
      data: {
        items: this.data,
        fields: [
          'id_grupo_productos',
          'parent_id',
          'codigo_padre',
          'parent',
          'codigo_grupo_producto',
          'descripcion',
          'codigo_anterior',
          'codigo_cuenta_contable',
          'codigo_cuenta_contable2',
          'codigo_cuenta_contable3',
          'codigo_cuenta_contable4',
          'codigo_cuenta_contable5',
          'codigo_cuenta_contable6',
          'codigo_presupuesto',
          'tipo_bien',
          'vida_util',
        ],
      },
      events: [
        {
          init: this.getGrupos,
          scope: this,
        },
        {
          rowclick: this.handleNodeClick,
          scope: this
        },
      ],
      columns: [
        {
          index: 'codigo_grupo_producto',
          title: 'Codigo',
          type: 'tree',
          width: 125
        },
        {
          index: 'descripcion',
          title: 'Grupo',
          width: 250
        },
        {
          index: 'codigo_anterior',
          title: 'Codigo Anterior'
        },
        {
          index: 'codigo_cuenta_contable',
          title: 'Cuenta Deudora'
        },
        {
          index: 'codigo_cuenta_contable2',
          title: 'Cuenta Acreedora'
        },
        {
          index: 'codigo_presupuesto',
          title: 'Codigo Presupuesto'
        },
        {
          index: 'codigo_cuenta_contable3',
          title: 'Cuenta Orden Debe'
        },
        {
          index: 'codigo_cuenta_contable4',
          title: 'Codigo Orden Haber'
        },
        {
          index: 'codigo_cuenta_contable5',
          title: 'Codigo Dep. Acumulada'
        },
        {
          index: 'codigo_cuenta_contable6',
          title: 'Codigo Gto. Depreciac'
        }
      ]
    };

    this.commonVarService.seleciconCategoriaCuentaPro.pipe(takeUntil(this.onDestroy$)).subscribe(
      (res) => {

        if (this.newGroup) {
          if (res.validacion == 'Deudora') {
            this.newGrupo.codigo_cuenta_contable = res.data.codigo
            // this.descripcion_deudora = res.data.descripcion_original
          } else if (res.validacion == 'Acreedora') {
            this.newGrupo.codigo_cuenta_contable2 = res.data.codigo
            // this.descripcion_acreedora = res.data.descripcion_original
          } else if (res.validacion == 'Presupuestario') {
            this.newGrupo.codigo_presupuesto = res.data.codigo
            // this.descripcion_presupuesto = res.data.descripcion_general
          } else if (res.validacion == 'OD') {
            this.newGrupo.codigo_cuenta_contable3 = res.data.codigo
            // this.descripcion_presupuesto = res.data.descripcion_general
          } else if (res.validacion == 'OH') {
            this.newGrupo.codigo_cuenta_contable4 = res.data.codigo
            // this.descripcion_presupuesto = res.data.descripcion_general
          } else if (res.validacion == 'DA') {
            this.newGrupo.codigo_cuenta_contable5 = res.data.codigo
            // this.descripcion_presupuesto = res.data.descripcion_general
          } else if (res.validacion == 'GD') {
            this.newGrupo.codigo_cuenta_contable6 = res.data.codigo
            // this.descripcion_presupuesto = res.data.descripcion_general
          }

        } else if (this.grupoSelected) {
          if (res.validacion == 'Deudora') {
            this.grupo.codigo_cuenta_contable = res.data.codigo
            // this.descripcion_deudora = res.data.descripcion_original
          } else if (res.validacion == 'Acreedora') {
            this.grupo.codigo_cuenta_contable2 = res.data.codigo
            // this.descripcion_acreedora = res.data.descripcion_original
          } else if (res.validacion == 'Presupuestario') {
            this.grupo.codigo_presupuesto = res.data.codigo
            // this.descripcion_presupuesto = res.data.descripcion_general
          } else if (res.validacion == 'OD') {
            this.grupo.codigo_cuenta_contable3 = res.data.codigo
            // this.descripcion_presupuesto = res.data.descripcion_general
          } else if (res.validacion == 'OH') {
            this.grupo.codigo_cuenta_contable4 = res.data.codigo
            // this.descripcion_presupuesto = res.data.descripcion_general
          } else if (res.validacion == 'DA') {
            this.grupo.codigo_cuenta_contable5 = res.data.codigo
            // this.descripcion_presupuesto = res.data.descripcion_general
          } else if (res.validacion == 'GD') {
            this.grupo.codigo_cuenta_contable6 = res.data.codigo
            //
          }

        }

      }
    );
  }

  ngOnDestroy() {
    this.onDestroy$.next(null);
    this.onDestroy$.complete();
  }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsInvGrupos",
        paramAccion: "",
        boton: { icon: "fas fa-plus-square", texto: "NUEVO" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsInvGrupos",
        paramAccion: "",
        boton: { icon: "fas fa-save", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsInvGrupos",
        paramAccion: "",
        boton: { icon: "fas fa-save", texto: "MODIFICAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-info boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsInvGrupos",
        paramAccion: "",
        boton: { icon: "fas fa-eraser", texto: "LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: true,
      },
    ]

    setTimeout(() => {
      this.validaPermisos()

      this.fillCatalog()
    }, 50)
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "NUEVO":
        this.nuevoGrupo()
        break;

      case "GUARDAR":
        this.saveGrupo()
        break;

      case "MODIFICAR":
        this.updateGrupo()
        break;

      default:
        break;
    }
  }

  validaPermisos() {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    (this as any).mensajeSpinner = 'Cargando Permisos de Usuario...';
    this.lcargando.ctlSpinner(true);

    this.commonService.getPermisionsGlobas({
      codigo: myVarGlobals.fConfGrupos,
      id_rol: this.dataUser.id_rol
    }).subscribe(
      (res: any) => {
        this.permissions = res.data[0]
        if (this.permissions.abrir == '0') {
          this.lcargando.ctlSpinner(false)
          this.vmButtons = []
          this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle)
        } else {
          this.lcargando.ctlSpinner(false)
        }
      },
      (err: any) => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }

  // Llamado al cargar la ventana por el Grid
  getGrupos(grid) {
    this.grid ||= grid
    grid.showLoadMask('Actualizando...')
    this.apiService.getGrupos().subscribe(
      (res: any) => {
        // console.log(res.data)

        grid.setData(res.data)
        grid.update()
        grid.hideLoadMask()

        // this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        // this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Grupos')
      }
    )
  }

  handleNodeClick(grid, node: any) {
    this.newGroup = false

    this.vmButtons[0].habilitar = false
    this.vmButtons[1].habilitar = true
    this.vmButtons[2].habilitar = false

    Object.assign(this.grupo, node.data)
    node.data.parent ? this.padre = node.data.parent : this.padre = { codigo_grupo_producto: null, descripcion: null }

    this.grupoSelected = true

  }

  nuevoGrupo() {
    // Ocultar Grupo mostrado, de aplicar
    this.grupoSelected = false

    Swal.fire({
      title: 'Que desea crear?',
      icon: 'question',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Grupo',
      denyButtonText: 'Subgrupo',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0d6efd',
      denyButtonColor: '#6c757d',
      cancelButtonColor: '#dc3545',
    }).then(async (result: any) => {
      if (result.isConfirmed && !result.isDenied) {
        // Grupo
        // console.log('Nuevo Grupo')
        (this as any).mensajeSpinner = 'Generando codigo'
        this.lcargando.ctlSpinner(true)
        let response = await this.apiService.getLastChild({parent: this.grupo.codigo_padre});
        this.lcargando.ctlSpinner(false)
        this.newGrupo = {
          codigo_grupo_producto: response,
          parent_id: this.grupo.parent_id,  // Se le asigna el codigo del padre del seleccionado
          codigo_padre: this.grupo.codigo_padre,
          codigo_cuenta_contable: null,
          codigo_cuenta_contable2: null,
          codigo_cuenta_contable3: null,
          codigo_cuenta_contable4: null,
          codigo_cuenta_contable5: null,
          codigo_cuenta_contable6: null,
          codigo_presupuesto: null,
          codigo_anterior: null,
          tipo_bien: null,
          vida_util: null,
          descripcion: null,
          estado: 'A',
        }

        // Se muestra el formulario
        this.newGroup = true
        this.vmButtons[0].habilitar = true
        this.vmButtons[1].habilitar = false
        this.vmButtons[2].habilitar = true
      } else if (!result.isConfirmed && result.isDenied) {
        // Subgrupo
        // console.log('Nuevo Subgrupo')
        (this as any).mensajeSpinner = 'Generando codigo'
        this.lcargando.ctlSpinner(true)
        let response = await this.apiService.getLastChild({parent: this.grupo.codigo_grupo_producto});
        this.lcargando.ctlSpinner(false)
        this.newGrupo = {
          codigo_grupo_producto: response, // Se le asigna el codigo del padre para iniciar
          parent_id: this.grupo.id_grupo_productos,  // Se le asigna el id del seleccionado como padre
          codigo_padre: this.grupo.codigo_grupo_producto,
          codigo_cuenta_contable: null,
          codigo_cuenta_contable2: null,
          codigo_cuenta_contable3: null,
          codigo_cuenta_contable4: null,
          codigo_cuenta_contable5: null,
          codigo_cuenta_contable6: null,
          codigo_presupuesto: null,
          codigo_anterior: null,
          tipo_bien: null,
          vida_util: null,
          descripcion: null,
          estado: 'A',
        }

        // Se muestra el formulario
        this.newGroup = true
        this.vmButtons[0].habilitar = true
        this.vmButtons[1].habilitar = false
        this.vmButtons[2].habilitar = true
      } else {
        // Cerro el modal
        return
      }
    })
  }

  saveGrupo() {
    (this as any).mensajeSpinner = 'Almacenando Grupo'
    this.lcargando.ctlSpinner(true)
    this.apiService.setGrupo({ grupo: this.newGrupo }).subscribe(
      (res: any) => {
        console.log(res)
        this.lcargando.ctlSpinner(false)

        this.getGrupos(this.grid)
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error almacenando Grupo')
      }
    )
  }

  fillCatalog() {
    let data = {
      params: "'INV_TIPO_BIEN'",
    };
    this.apiService.getCatalogs(data).subscribe((res) => {
      this.tipo_bien = res["data"]["INV_TIPO_BIEN"];
    });
  }

  tipoBienFun(event) {

    if (event == 'OBR' || event == 'BLD') {
      this.vidaUtil = false;
    } else {
      this.vidaUtil = true;
    }

  }

  updateGrupo() {
    (this as any).mensajeSpinner = 'Actualizando Grupo'
    this.lcargando.ctlSpinner(true)
    this.apiService.updateGrupo(
      this.grupo.id_grupo_productos,
      {
        grupo: {
          codigo_grupo_producto: this.grupo.codigo_grupo_producto, // Se le asigna el codigo del padre para iniciar
          parent_id: this.grupo.parent_id,  // Se le asigna el id del seleccionado como padre
          codigo_cuenta_contable: this.grupo.codigo_cuenta_contable,
          codigo_cuenta_contable2: this.grupo.codigo_cuenta_contable2,
          codigo_cuenta_contable3: this.grupo.codigo_cuenta_contable3,
          codigo_cuenta_contable4: this.grupo.codigo_cuenta_contable4,
          codigo_cuenta_contable5: this.grupo.codigo_cuenta_contable5,
          codigo_cuenta_contable6: this.grupo.codigo_cuenta_contable6,
          codigo_anterior: this.grupo.codigo_anterior,
          codigo_presupuesto: this.grupo.codigo_presupuesto,
          descripcion: this.grupo.descripcion,
          tipo_bien: this.grupo.tipo_bien,
          vida_util: this.grupo.vida_util,
          estado: this.grupo.estado,
        }
      }).subscribe(
        (res: any) => {
          console.log(res)
          this.lcargando.ctlSpinner(false)

          this.getGrupos(this.grid)
        },
        (err: any) => {
          console.log(err)
          this.lcargando.ctlSpinner(false)
          this.toastr.error(err.error.message, 'Error actualizando Grupo')
        }
      )
  }

  modalCuentaContable(valor) {
    let modal = this.modalService.open(ModalCuentPreComponent, {
      size: "xl",
      backdrop: "static",
    })

    modal.componentInstance.validacionModal = true;
    modal.componentInstance.validar = valor;

  }

  modalCodigoPresupuesto() {
    let modal = this.modalService.open(ModalCuentPreComponent, {
      size: "xl",
      backdrop: "static",
    })
    modal.componentInstance.validacionModal = false;
    modal.componentInstance.validar = 'Presupuestario';
  }

}
