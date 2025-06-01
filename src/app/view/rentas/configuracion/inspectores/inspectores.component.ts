import { Component, OnInit, ViewChild } from '@angular/core';
import { InspectoresService } from './inspectores.service';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { EncargadoComponent } from 'src/app/config/custom/encargado/encargado.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

interface Inspector {
  id_inspector?: number
  fk_empleado?: number
  nombres: string
  tipo_inspeccion: string
  estado: string
}

@Component({
standalone: false,
  selector: 'app-inspectores',
  templateUrl: './inspectores.component.html',
  styleUrls: ['./inspectores.component.scss']
})
export class InspectoresComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  msgSpinner: string;
  vmButtons: Botonera[] = [];

  cmb_tipo_inspeccion: any[] = [
    { value: 'HIGIENE', label: 'Higiene' },
    { value: 'PLANIFICACION', label: 'Planificacion' },
    { value: 'COMISARIA', label: 'Comisaria' },
    { value: 'RENTAS', label: 'Rentas' },
  ]
  cmb_estado: any[] = [
    { value: 'A', label: 'Activo' },
    { value: 'I', label: 'Inactivo' },
  ]

  filter: any = {
    nombre: null,
    tipo_inspeccion: null,
    estado: 'A',
  }
  paginate: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: 0,
  }
  newInspectorView: boolean = false
  newInspector: any = {
    empleado: null,
    tipo_inspeccion: null
  }

  tbl_inspectores: Inspector[] = [];

  onDestroy$: Subject<void> = new Subject();

  constructor(
    private apiService: InspectoresService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private commonVarService: CommonVarService,
  ) {
    this.vmButtons = [
      {
        orig: 'btnsInspectores',
        paramAccion: '',
        boton: { icon: 'far fa-plus-square', texto: 'NUEVO' },
        clase: 'btn btn-sm btn-warning',
        permiso: true,
        showbadge: false,
        showimg: true,
        showtxt: true,
        habilitar: false,
      },
      {
        orig: 'btnsInspectores',
        paramAccion: '',
        boton: { icon: 'far fa-plus-square', texto: 'GUARDAR' },
        clase: 'btn btn-sm btn-success',
        permiso: true,
        showbadge: false,
        showimg: true,
        showtxt: true,
        habilitar: true,
      },
      {
        orig: 'btnsInspectores',
        paramAccion: '',
        boton: { icon: 'far fa-search', texto: 'CONSULTAR' },
        clase: 'btn btn-sm btn-primary',
        permiso: true,
        showbadge: false,
        showimg: true,
        showtxt: true,
        habilitar: false,
      },
      {
        orig: 'btnsInspectores',
        paramAccion: '',
        boton: { icon: 'far fa-eraser', texto: 'LIMPIAR' },
        clase: 'btn btn-sm btn-danger',
        permiso: true,
        showbadge: false,
        showimg: true,
        showtxt: true,
        habilitar: false,
      },
    ]

    this.commonVarService.encargadoSelect.pipe(takeUntil(this.onDestroy$)).subscribe(
      (empleado: any) => {
        console.log(empleado)

        Object.assign(this.newInspector, { empleado })
      }
    )
  }

  ngOnInit(): void {
    setTimeout(() => this.getInspectores(), 0)
  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case "NUEVO":
        this.newInspectorView = true
        this.vmButtons[1].habilitar = false
        break;
      case "CONSULTAR":
        this.consultar()
        break;
      case "LIMPIAR":
        this.clearFilter()
        break;
      case "GUARDAR":
        this.setInspector()
        break;
    
      default:
        break;
    }
  }

  consultar() {
    Object.assign(this.paginate, { pageIndex: 0 })
    this.getInspectores()
  }

  changePage({pageIndex}) {
    Object.assign(this.paginate, { pageIndex })
    this.getInspectores()
  }

  async getInspectores() {
    this.lcargando.ctlSpinner(true)
    try {
      this.msgSpinner = 'Cargando Inspectores'
      let inspectores = await this.apiService.getInspectores({params: { filter: this.filter, paginate: this.paginate }})
      this.paginate.length = inspectores.total;
      this.tbl_inspectores = inspectores.data;
      //
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message, 'Error cargando Inspectores')
    }
  }

  clearFilter() {
    if (this.newInspectorView) {
      Object.assign(this.newInspector, { empleado: null, tipo_inspeccion: null })
    } else {
      Object.assign(this.filter, {
        nombre: null,
        tipo_inspeccion: null,
        estado: null,
      })
    }
  }

  onClicConsultaEmpleados() {
    this.modalService.open(EncargadoComponent, { size: 'xl', backdrop: 'static' })
  }

  async setInspector() {
    // Validacion de Datos
    let message = ''
    if (this.newInspector.tipo_inspeccion == null) message += '* No ha seleccionado un Tipo de Inspeccion.<br>';
    if (this.newInspector.empleado == undefined || this.newInspector.empleado == null) message += '* No ha seleccionado un Empleado.<br>' 
    if(message.length) {
      this.toastr.warning(message, 'Validacion de Datos', {enableHtml: true})
      return
    }

    let result = await Swal.fire({
      titleText: 'Creacion de Inspectores',
      text: 'Esta seguro/a de crear este nuevo Inspector?',
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Crear'
    })

    if (result.isConfirmed) {
      this.lcargando.ctlSpinner(true)
      try {
        this.msgSpinner = 'Almacenando Inspector'
        let inspector = await this.apiService.setInspector({ inspector: this.newInspector })
        console.log(inspector)

        Object.assign(this.newInspector, { empleado: null, tipo_inspeccion: null })
        this.newInspectorView = false
        this.vmButtons[1].habilitar = true

        await this.getInspectores()
        //
        this.lcargando.ctlSpinner(false)
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error?.message, 'Error creando Inspector')
      }
    }

  }

  async deleteInspector(inspector: any) {
    let result = await Swal.fire({
      titleText: 'Eliminacion de Inspector',
      html: 'Esta seguro/a de eliminar este Inspector?<br>Esta accion no elimina al Empleado.',
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar'
    })

    if (result.isConfirmed) {
      this.lcargando.ctlSpinner(true)
      try {
        this.msgSpinner = 'Eliminando Inspector'
        await this.apiService.deleteInspector(inspector.id_inspector);
        await this.getInspectores()
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error?.message, 'Error eliminando Inspector')
      }
    }
  }

}
