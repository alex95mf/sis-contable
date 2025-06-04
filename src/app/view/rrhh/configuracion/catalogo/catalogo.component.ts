import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import { CatalogoService } from './catalogo.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

interface CatalogoNom {
  id_catalogo?: number|null
  cat_nombre?: string|null
  cat_descripcion?: string|null
  cat_keyword?: string|null
  parent_id?: number|null
  children?: CatalogoNom[]
  parent?: CatalogoNom
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
  mensajeSpinner: string;
  vmButtons: Botonera[] = [];

  formReadonly: boolean = true;

  itemCatalogo: CatalogoNom = {
    id_catalogo: null,
    cat_keyword: null,
    cat_nombre: null,
    cat_descripcion: null,
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
  treeControl = new NestedTreeControl<CatalogoNom>(node => node.children);
  dataSource = new MatTreeNestedDataSource<CatalogoNom>();
  nuevoItemVista: boolean = false

  constructor(
    private apiService: CatalogoService,
    private toastr: ToastrService,
  ) {
    this.vmButtons = [
      {orig: 'btnsCatastroCatalogo', paramAccion: '', boton: { icon: 'far fa-plus-square', texto: 'NUEVO' }, clase: 'btn btn-sm btn-primary', permiso: true, showbadge: false, showimg: true, showtxt: true, habilitar: false },
      {orig: 'btnsCatastroCatalogo', paramAccion: '', boton: { icon: 'far fa-save', texto: 'GUARDAR' }, clase: 'btn btn-sm btn-success', permiso: true, showbadge: false, showimg: true, showtxt: true, habilitar: true },
      {orig: 'btnsCatastroCatalogo', paramAccion: '', boton: { icon: 'far fa-edit', texto: 'MODIFICAR' }, clase: 'btn btn-sm btn-warning', permiso: true, showbadge: false, showimg: true, showtxt: true, habilitar: true },
      {orig: 'btnsCatastroCatalogo', paramAccion: '', boton: { icon: 'far fa-eraser', texto: 'LIMPIAR' }, clase: 'btn btn-sm btn-info', permiso: true, showbadge: false, showimg: true, showtxt: true, habilitar: false },
    ]
  }

  ngOnInit(): void {
    setTimeout(async () => {
      this.lcargando.ctlSpinner(true)
      await this.getListas()
      this.lcargando.ctlSpinner(false)
    }, 0)
  }

  async metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case "NUEVO":
        this.nuevoCatalogo()
        // this.nuevoItem()
        // this.vmButtons[1].habilitar = false
        // this.vmButtons[2].habilitar = true
        // this.nuevoModulo()
        break;
      case "GUARDAR":
        this.lcargando.ctlSpinner(true)
        await this.setCatalogo()
        await this.getListas()
        this.lcargando.ctlSpinner(false)
        break;
      case "MODIFICAR":
        this.lcargando.ctlSpinner(true)
        await this.updateCatalogo()
        await this.getListas()
        this.lcargando.ctlSpinner(false)
        break;
      case "ACTUALIZAR":
        // this.actualizar()
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
      this.mensajeSpinner = 'Cargando Arbol'
      const response = await this.apiService.getArbolNomina()
      console.log(response.data)
      // const estructura = response.data.replaceAll('child0','child').replaceAll('child2','child').replaceAll('child3','child').replaceAll('child4','child').replaceAll('child5','child').replaceAll('child','children')
      // const arbol = JSON.parse(response['data'])
      // console.log(arbol)
      this.dataSource.data = response.data
      this.treeControl.dataNodes = response.data
      this.treeControl.expandAll()
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message)
    }
  }

  async nuevoCatalogo() {
    const result = await Swal.fire({
      titleText: 'Nuevo Catalogo',
      text: `Esta seguro/a desea crear un nuevo Catalogo?`,
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Confirmar'
    })

    if (result.isConfirmed) {
      this.vmButtons[1].habilitar = false
      this.vmButtons[2].habilitar = true
      this.formReadonly = false
      this.itemCatalogo = {id_catalogo: null, cat_nombre: null, cat_descripcion: null, cat_keyword: null, parent_id: null}
    }
  }

  async nodeClick(catalogo: CatalogoNom) {
    this.vmButtons[1].habilitar = true
    this.vmButtons[2].habilitar = false
    this.formReadonly = false
    this.lcargando.ctlSpinner(true)
    await this.getItemCatalogo(catalogo)
    this.lcargando.ctlSpinner(false)
  }

  async getItemCatalogo(catalogo: CatalogoNom) {
    try {
      this.mensajeSpinner = 'Cargando Data'
      const response = await this.apiService.getItemCatalogo(catalogo.id_catalogo, {item: catalogo})
      console.log(response)
      // this.nuevoItemVista = false
      this.itemCatalogo = response.data
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error cargando Item')
    }
  }

  async setCatalogo() {
    try {
      this.mensajeSpinner = 'Almacenando Catalogo'
      const response = await this.apiService.setItemCatalogo({item: this.itemCatalogo})
      console.log(response)
      Swal.fire('Item Almacenado', '', 'success').then(() => this.limpiar())
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error almacenando Item')
    }
  }

  async updateCatalogo() {
    try {
      this.mensajeSpinner = 'Actualizando Item'
      const response = await this.apiService.updateItemCatalogo(this.itemCatalogo.id_catalogo, {item: this.itemCatalogo})
      console.log(response)
      Swal.fire('Item Actualizado', '', 'success').then(() => this.limpiar())
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error almacenando Item')
    }
  }

  limpiar() {
    Object.assign(this.itemCatalogo, {
      id_catalogo: null,
      cat_nombre: null,
      cat_descripcion: null,
      cat_keyword: null,
      parent_id: null,
      parent: null,
    })
    
    this.vmButtons[0].habilitar = false
    this.vmButtons[1].habilitar = true
    this.vmButtons[2].habilitar = true
    this.formReadonly = true
    // this.nuevoItemVista = false
  }

  hasChild = (_: number, node: CatalogoNom) => (!!node.children && node.children.length > 0) || node.parent_id == null;

  handleClickNewChildren = (parent: CatalogoNom) => {
    this.vmButtons[1].habilitar = false
    this.vmButtons[2].habilitar = true
    this.formReadonly = false

    this.itemCatalogo.parent = parent
    this.itemCatalogo.parent_id = parent.id_catalogo
  }
}
