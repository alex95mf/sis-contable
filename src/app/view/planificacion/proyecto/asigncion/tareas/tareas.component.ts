import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import * as moment from 'moment';

import { AsigncionService } from '../asigncion.service';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CcModalTableEmpleadoComponent } from 'src/app/config/custom/modal-component/cc-modal-table-empleado/cc-modal-table-empleado.component';

@Component({
standalone: false,
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.scss']
})
export class TareasComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent
  @Input() programa: any
  @Input() departamento: any
  @Input() atribucion: any
  @Input() periodo: any
  @Input() lst_metas: Array<any>
  vmButtons: any[] = []
  fTitle: string = 'Actividades a Realizar'
  mensajeSpinner: string
  validaciones: ValidacionesFactory = new ValidacionesFactory();
  ref: DynamicDialogRef;


  tareas: Array<any> = []
  responsables: Array<any> = []
  realizacion: number = 0
  meta_seleccionada: any

  constructor(
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonVarService: CommonVarService,
    private apiService: AsigncionService,
    public dialogService: DialogService,
  ) { }

  ngOnInit(): void {
    this.vmButtons = [

      {
        orig: "btnsAttrTareas",
        paramAccion: "",
        boton: { icon: "fas fa-plus", texto: "NUEVA TAREA" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false
      },
      {
        orig: "btnsAttrTareas",
        paramAccion: "",
        boton: { icon: "fas fa-save", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false
      },
      {
        orig: "btnsAttrTareas",
        paramAccion: "",
        boton: { icon: "fas fa-times", texto: "CANCELAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false
      }
    ]

    // this.meta_seleccionada = this.lista_metas.find((m) => m.id_catalogo == this.atribucion.meta) ? this.lista_metas.find((m) => m.id_catalogo == this.atribucion.meta).valor : 0;
    // console.log(this.atribucion.meta)
    // console.log(this.meta_seleccionada)

    setTimeout(() => {
      // this.getResponsables()
      // this.initLoad()
      this.cargaInicial()
    }, 75)
  }

  metodoGlobal(evt) {
    switch (evt.items.boton.texto) {

      case "NUEVA TAREA":
        this.nuevaTarea()
        break;
      case "GUARDAR":
        this.guardaTareas()
        break;

      case "CANCELAR":
        this.activeModal.close()
        break;

      default:
        break;
    }
  }

  async cargaInicial() {
    this.lcargando.ctlSpinner(true)
    try {
      // this.mensajeSpinner = 'Cargando listado de Responsables'
      // this.responsables = await this.apiService.getResponsables()

      this.mensajeSpinner = 'Cargando Tareas de Atribución'
      this.tareas = await this.apiService.getTareas({periodo: this.periodo, programa: this.programa, departamento: this.departamento, atribucion: this.atribucion})
      this.realizacion = this.tareas.reduce((acc, curr) => acc + parseInt(curr.realizacion), 0) / this.tareas.length

      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error cargando Data Inicial')
    }
  }

  metaToPrint(meta_cod: string) {
    return this.lst_metas.find((meta: any) => meta.descripcion == meta_cod).valor
  }
  /* getResponsables() {
    this.mensajeSpinner = 'Cargando Responsables'
    this.lcargando.ctlSpinner(true)
    this.apiService.getResponsables().subscribe(
      (res: any) => {
        // console.log(res)
        res.data.forEach((elem: any) => {
          if (elem.fk_departamento !== null) {
            let obj = {
              programa: {
                id: elem.fk_programa.id_catalogo,
                nombre: elem.fk_programa.valor,
              },
              departamento: {
                id: elem.fk_departamento.id_catalogo,
                nombre: elem.fk_departamento.valor,
              },
              usuario: {
                id: elem.fk_usuario.id_usuario,
                nombre: elem.fk_usuario.nombre,
                email: elem.fk_usuario.email
              }
            }
            this.responsables.push(obj)
          }

        });
        this.lcargando.ctlSpinner(false)
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Responsables')
        console.log(err)
      }
    )
  } */

  /* initLoad() {
    // Si la atribucion tiene tareas, cargarlas
    if (Array.isArray(this.atribucion.tareas) && this.atribucion.tareas.length > 0) {
      this.tareas = this.atribucion.tareas
    }
    this.realizacion = this.atribucion.realizacion_tareas ?? 0
    this.calculaRealizacion()
  } */

  nuevaTarea() {
    let tarea = {
      id: null,
      descripcion: null,
      fecha_inicio: moment(new Date()).format('YYYY-MM-DD'),
      fecha_final: moment(new Date()).add(1, 'day').format('YYYY-MM-DD'),
      fk_responsable: null,  // ID en PLA_RESPONSABLES (id, fk_programa, fk_departamento, fk_usuario, email)
      realizacion: 0,
      finalizado: false,
      fk_meta: this.atribucion.atribucion_data.fk_meta
    }
    this.tareas.push({ ...tarea })
  }

  validateData() {
    return new Promise((resolve, reject) => {
      let message = ''
      let sinDescripcion = 0
      let sinResponsable = 0

      if (!this.tareas.length) {
        message += '* No ha creado tareas.<br>'
      }

      this.tareas.forEach((tarea: any) => {
        if (tarea.descripcion == null || !tarea.descripcion.trim().length) {
          sinDescripcion += 1
        }

        if (tarea.fk_responsable == null) {
          sinResponsable += 1
        }
      })
      if (sinDescripcion > 0) {
        message += `* Existen ${sinDescripcion} tarea(s) sin Descripcion.<br>`
      }

      if (sinResponsable > 0) {
        message += `* Existen ${sinResponsable} tarea(s) sin Responsable.<br>`
      }

      return (!message.length) ? resolve(true) : reject(message);

    })
  }

  async guardaTareas() {
    this.lcargando.ctlSpinner(true)
    try {
      this.mensajeSpinner = 'Validando Datos'
      await this.validateData()

      try {
        this.mensajeSpinner = 'Almacenando Tareas'
        let response = await this.apiService.setTareas({
          periodo: this.periodo,
          programa: this.programa,
          departamento: this.departamento,
          atribucion: this.atribucion,
          tareas: this.tareas
        })
        console.log(response)
        this.tareas = response

        this.lcargando.ctlSpinner(false)
        Swal.fire('Tareas almacenadas correctamente', '', 'success')
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error almacenando Tareas', {enableHtml: true})
      }
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.warning(err, 'Validación de Datos', {enableHtml: true})
    }
  }

  calculaRealizacion() {
    this.realizacion = 0

    if (this.tareas.length > 0) {
      // let valores = this.tareas.map(t => t.realizacion)
      this.realizacion = this.tareas.reduce((acc, curr) => acc + parseInt(curr.realizacion), 0) / this.tareas.length
    }
  }

  expandEmpleados(tarea: any) {
    this.ref = this.dialogService.open(CcModalTableEmpleadoComponent, {
      data: {
        relation: "yes",
        search : null,
        relation_selected : "",
      },
      header: "Empleados",
      width: "70%",
      contentStyle: { "max-height": "500px", overflow: "auto" },
      baseZIndex: 10000,
    });

    this.ref.onClose.subscribe((empleado: any) => {
      console.log(empleado)

      // Asociar tarea con empleado
      tarea.fk_responsable = empleado.id_empleado;
      tarea.responsable = empleado;
    })
  }

  async deleteTarea(tarea: any) {
    const result = await Swal.fire({
      titleText: 'Eliminar Tarea',
      text: 'Esta seguro/a de eliminar esta tarea?',
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar'
    })

    if (result.isConfirmed) {
      this.lcargando.ctlSpinner(true)
      this.mensajeSpinner = 'Eliminando Tarea'
      if (tarea.id != null) {
        try {
          let response = await this.apiService.deleteTarea({tarea})
          console.log(response)
          this.tareas.splice(this.tareas.findIndex((t: any) => t.id == tarea.id), 1)
          this.lcargando.ctlSpinner(false)
        } catch (err) {
          console.log(err)
          this.lcargando.ctlSpinner(false)
          this.toastr.error(err.error?.message, 'Error eliminado Tarea')
        }
      } else {
        //this.tareas.splice(this.tareas.findIndex((t: any) => t.id == tarea.id), 1)
        this.tareas.splice(this.tareas.indexOf(tarea), 1)
        this.lcargando.ctlSpinner(false)
      }

    }
  }

}
