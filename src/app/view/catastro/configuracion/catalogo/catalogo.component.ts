import { Component, OnInit, ViewChild } from '@angular/core';
import { CatalogoService } from './catalogo.service';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import { MatTree, MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource } from '@angular/material/tree';
import Swal from 'sweetalert2';

interface Catalogo {
  id_catalogo?: number
  tipo: string
  valor: string
  descripcion: string
  categoria: string
  parent_id: number|null
  grupo: string|null
  estado: string
  children?: Catalogo[]
  parent?: Catalogo
}

interface FlatNode {
  expandable: boolean
  name: string
  level: number
}

@Component({
standalone: false,
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss']
})
export class CatalogoComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  @ViewChild('txtTipo') txtTipo: HTMLInputElement;
  msgSpinner: string;
  vmButtons: Botonera[] = [];

  formReadonly: boolean = false;

  itemCatalogo: Catalogo = {
    id_catalogo: null,
    tipo: null,
    valor: null,
    descripcion: null,
    categoria: null,
    grupo: null,
    estado: 'A',
    parent_id: null,
  }

  cmb_tipo: any[] = [
    { value: 'L', label: 'Lista' },
    { value: 'E', label: 'Elemento' },
  ]
  cmb_estado: any[] = [
    { value: 'A', label: 'Activo' },
    { value: 'I', label: 'Inactivo' },
  ]

  treeControl = new NestedTreeControl<Catalogo>(node => node.children);
  dataSource = new MatTreeNestedDataSource<Catalogo>();
  nuevoItemVista: boolean = false
  nuevoItemCatalogo: Catalogo = {
    id_catalogo: null,
    tipo: null,
    valor: null,
    descripcion: null,
    categoria: null,
    grupo: null,
    parent_id: null,
    estado: 'A',
  }

  constructor(
    private apiService: CatalogoService,
    private toastr: ToastrService,
  ) {
    this.vmButtons = [
      {orig: 'btnsCatastroCatalogo', paramAccion: '', boton: { icon: 'far fa-plus-square', texto: 'NUEVO' }, clase: 'btn btn-sm btn-primary', permiso: true, showbadge: false, showimg: true, showtxt: true, habilitar: false },
      {
        orig: 'btnsCatastroCatalogo',
        paramAccion: '',
        boton: { icon: 'fas fa-save', texto: 'GUARDAR' },
        clase: 'btn btn-sm btn-success',
        permiso: true,
        showbadge: false,
        showimg: true,
        showtxt: true,
        habilitar: true,
      },
      {
        orig: 'btnsCatastroCatalogo',
        paramAccion: '',
        boton: { icon: 'fas fa-edit', texto: 'MODIFICAR' },
        clase: 'btn btn-sm btn-success',
        permiso: true,
        showbadge: false,
        showimg: true,
        showtxt: true,
        habilitar: true,
      },
      {
        orig: 'btnsCatastroCatalogo',
        paramAccion: '',
        boton: { icon: 'fas fa-sync', texto: 'ACTUALIZAR' },
        clase: 'btn btn-sm btn-dark',
        permiso: true,
        showbadge: false,
        showimg: true,
        showtxt: true,
        habilitar: false,
      },
      {
        orig: 'btnsCatastroCatalogo',
        paramAccion: '',
        boton: { icon: 'fas fa-eraser', texto: 'LIMPIAR' },
        clase: 'btn btn-sm btn-warning',
        permiso: true,
        showbadge: false,
        showimg: true,
        showtxt: true,
        habilitar: false,
      },
    ]
  }

  ngOnInit(): void {
    setTimeout(async () => {
      this.lcargando.ctlSpinner(true)
      await this.getListas()
      this.lcargando.ctlSpinner(false)
    }, 0)
  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case "NUEVO":
        // this.nuevoItem()
        // this.vmButtons[1].habilitar = false
        // this.vmButtons[2].habilitar = true
        this.nuevoModulo()
        break;
      case "GUARDAR":
        this.setCatalogo()
        break;
      case "MODIFICAR":
        this.updateCatalogo()
        break;
      case "ACTUALIZAR":
        this.actualizar()
        break;
      case "LIMPIAR":
        this.limpiar()
        break;
    
      default:
        break;
    }
  }

  async getListas() {
    try {
      this.msgSpinner = 'Cargando Arbol'
      // const arbol = await this.apiService.getListas({root: 'CATASTRO'})
      const response = await this.apiService.getArbol()
      console.log(response)
      const estructura = response.data.replaceAll('child0','child').replaceAll('child2','child').replaceAll('child3','child').replaceAll('child4','child').replaceAll('child5','child').replaceAll('child','children')
      const arbol = JSON.parse(estructura)
      console.log(arbol)
      this.dataSource.data = arbol
      this.treeControl.dataNodes = arbol
      this.treeControl.expandAll()
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message)
    }
  }

  async setCatalogo() {
    // Validar Datos
    let message = '';

    if (this.nuevoItemCatalogo.valor == null || this.nuevoItemCatalogo.valor.trim().length == 0) message += '* No ha ingresado un Valor.<br>'
    if (this.nuevoItemCatalogo.descripcion == null || this.nuevoItemCatalogo.descripcion.trim().length == 0) message += '* No ha ingresado una Descripcion.<br>'
    if (this.nuevoItemCatalogo.categoria == null) message += '* No ha seleccionado una Categoria.<br>'
    // if (this.nuevoItemCatalogo.parent_id == null || this.nuevoItemCatalogo.grupo == null) message += '* No ha seleccionado una categoria/lista del Catalogo de Catastro.<br>'

    if (message.length > 0) {
      this.toastr.warning(message, 'Validacion de Datos', { enableHtml: true})
      return;
    }

    const result = await Swal.fire({
      titleText: 'Creacion de nuevo Catalogo',
      text: 'Esta seguro/a de crear este nuevo catalogo?',
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar'
    })

    if (result.isConfirmed) {
      this.lcargando.ctlSpinner(true)
      try {
        this.msgSpinner = 'Almacenando Catalogo'
        let response = await this.apiService.setCatalogo({catalogo: this.nuevoItemCatalogo})
        console.log(response)

        this.limpiar()
        await this.getListas()

        this.lcargando.ctlSpinner(false)
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error?.message)
      }
    }
  }

  async handleClickNewChildren(node: any) {
    const result = await Swal.fire({
      titleText: 'Nuevo Catalogo',
      text: `Esta seguro/a desea crear un nuevo hijo para el catalogo ${node.descripcion}?`,
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Confirmar'
    })

    if (result.isConfirmed) {
      console.log(node)
  
      this.vmButtons[0].habilitar = true
      this.vmButtons[1].habilitar = false
      this.vmButtons[2].habilitar = true
  
      this.nuevoItemVista = true
  
      Object.assign(this.nuevoItemCatalogo, {
        tipo: node.valor,
        parent_id: node.id_catalogo,
        grupo: node.valor,
        parent: {...node}
      })
    }
  }

  handleSelectCategoria({value}) {
    this.txtTipo.disabled = value !== 'E'
  }

  async updateCatalogo() {
    // Validar Datos
    let message = '';

    if (this.itemCatalogo.descripcion == null || this.itemCatalogo.descripcion.trim().length == 0) message += '* No ha ingresado un NOMBRE.<br>'

    if (message.length > 0) {
      this.toastr.warning(message, 'Validacion de Datos', { enableHtml: true})
      return;
    }

    // Confirmar con el usuario
    let result = await Swal.fire({
      titleText: 'Modificacion de Catalogo',
      text: 'Esta seguro/a de modificar este catalogo?',
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Modificar'
    })

    if (result.isConfirmed) {
      this.lcargando.ctlSpinner(true)
      try {
        this.msgSpinner = 'Modificando Catalogo'
        let response = await this.apiService.putCatalogo(this.itemCatalogo.id_catalogo, {catalogo: this.itemCatalogo})
        console.log(response)
        //
        this.lcargando.ctlSpinner(false)
        Swal.fire('Catalogo actualizado', '', 'success').then(() => {
          this.limpiar()
          this.actualizar()
        })
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error?.message)
      }
    }
  }

  async actualizar() {
    this.lcargando.ctlSpinner(true)
    await this.getListas()
    this.lcargando.ctlSpinner(false)
  }

  limpiar() {
    Object.assign(this.itemCatalogo, {
      id_catalogo: null,
      tipo: null,
      valor: null,
      descripcion: null,
      categoria: null,
      grupo: null,
      parent_id: null,
      parent: null,
    })

    Object.assign(this.nuevoItemCatalogo, {
      id_catalogo: null,
      tipo: null,
      valor: null,
      descripcion: null,
      categoria: null,
      grupo: null,
      parent_id: null,
      parent: null,
    })
    this.vmButtons[0].habilitar = false
    this.vmButtons[1].habilitar = true
    this.vmButtons[2].habilitar = true
    this.formReadonly = false
    this.nuevoItemVista = false
  }

  /* handleSelectTipo({value}) {
    Object.assign(this.itemCatalogo, {
      categoria: value
    })
  } */

  async nodeClick(catalogo: Catalogo) {
    /* if (catalogo.categoria == 'L') {
      Object.assign(this.itemCatalogo, {
        valor: null,
        descripcion: null,
        categoria: null,
        estado: 'A',
        grupo: catalogo.valor,
        parent_id: catalogo.id_catalogo
      })
      this.vmButtons[0].habilitar = false
      this.vmButtons[1].habilitar = true
      this.formReadonly = false
    } else {
      Object.assign(this.itemCatalogo, catalogo)
      this.vmButtons[1].habilitar = true
      this.vmButtons[2].habilitar = false
      this.formReadonly = true
    } */
    this.vmButtons[1].habilitar = true
    this.vmButtons[2].habilitar = false
    this.lcargando.ctlSpinner(true)
    await this.getItemCatalogo(catalogo)
    this.lcargando.ctlSpinner(false)
  }

  async getItemCatalogo(catalogo: Catalogo) {
    try {
      this.msgSpinner = 'Cargando Data'
      const response = await this.apiService.getItemCatalogo({item: catalogo})
      console.log(response)
      this.nuevoItemVista = false
      this.itemCatalogo = response.data
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error cargando Item')
    }
  }

  hasChild = (_: number, node: Catalogo) => (!!node.children && node.children.length > 0) || ['L','M'].includes(node.categoria);

  /* async nuevoItem() {
    let msgInvalid = '';

    if (this.itemCatalogo.id_catalogo == null) msgInvalid += '* No ha seleccionado un Item de referencia.<br>';

    if (msgInvalid.length) {
      this.toastr.warning(msgInvalid, 'Validacion de Datos', {enableHtml: true})
      return;
    }


    const result = await Swal.fire({
      titleText: 'Nuevo item de Catalogo',
      text: 'Que tipo de Item desea crear?',
      icon: 'question',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Lista',
      denyButtonText: 'Elemento',
      cancelButtonText: 'Cancelar',
    })

    if (this.itemCatalogo.categoria == 'L') {
      Object.assign(this.nuevoItemCatalogo, {parent_id: this.itemCatalogo.id_catalogo, grupo: this.itemCatalogo.valor, parent: {...this.itemCatalogo}})
    } else {
      Object.assign(this.nuevoItemCatalogo, {parent_id: this.itemCatalogo.parent.id_catalogo, grupo: this.itemCatalogo.parent.valor, parent: {...this.itemCatalogo.parent}})
    }

    this.nuevoItemVista = true

    this.vmButtons[1].habilitar = false
    this.vmButtons[2].habilitar = true
    if (result.isConfirmed) {
      // Lista
      Object.assign(this.nuevoItemCatalogo, { categoria: 'L', })
    } else if (result.isDenied) {
      // Elemento
      Object.assign(this.nuevoItemCatalogo, { categoria: 'E', })
    } else {
      this.vmButtons[1].habilitar = true
      this.vmButtons[2].habilitar = true
      this.nuevoItemVista = false
    }
  } */

  async nuevoModulo() {
    const result = await Swal.fire({
      titleText: 'Nueva Configuracion',
      text: `Esta seguro/a desea crear una nueva Configuracion?`,
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Confirmar'
    })

    if (result.isConfirmed) {
      Object.assign(this.nuevoItemCatalogo, {
        categoria: 'M',
        tipo: 'SIS_MODULOS',
        parent_id: null,
        grupo: null,
        estado: 'A',
      })
      this.nuevoItemVista = true
      this.vmButtons[1].habilitar = false
      this.vmButtons[2].habilitar = true
    }
  }

}
