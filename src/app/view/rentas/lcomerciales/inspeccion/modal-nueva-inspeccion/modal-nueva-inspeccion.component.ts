import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import * as moment from 'moment'

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';

import { InspeccionService } from '../inspeccion.service';

@Component({
standalone: false,
  selector: 'app-modal-nueva-inspeccion',
  templateUrl: './modal-nueva-inspeccion.component.html',
  styleUrls: ['./modal-nueva-inspeccion.component.scss']
})
export class ModalNuevaInspeccionComponent implements OnInit {
  @Input() local: any
  @Input() contribuyente: any
  @Input() i_inspeccion: any = null
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent
  fTitle: string = 'Nueva Orden de Inspección'
  edit: boolean = false
  departamento: string = 'RENTAS'
  mensajeSpinner: string
  vmButtons: any[] = []

  inspectores: any[] = []
  inspector: any = 0
  fecha_asignacion: any
  id_rentas: any;

  inspeccion: any = {
    fecha: moment().format('YYYY-MM-DD'),
    fecha_reorden: moment().format('YYYY-MM-DD'),
    secuencia: 1,
    retroactivo: false,
    observaciones: null,
  }
  resultados: any[] = []
  estados_ins: any = {
    'A': {style: 'far fa-check text-success', tooltip: 'Aprobado'},
    'F': {style: 'far fa-times text-danger', tooltip: 'Denegado'},
    'P': {style: 'far fa-minus-circle text-primary', tooltip: 'Pendiente'}
  }

  constructor(
    private toastr: ToastrService,
    private activeModal: NgbActiveModal,
    private commonVarService: CommonVarService,
    private apiService: InspeccionService
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsLcomNuevoIns",
        paramAction: "",
        boton: { icon: "fas fa-save", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsLcomNuevoIns",
        paramAction: "",
        boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ]


    // this.fecha_asignacion = moment(new Date()).format('YYYY-MM-DD')

    if (this.i_inspeccion !== null) {
      this.fTitle = 'Modificar Orden de Inspección'
      this.edit = true
      // this.vmButtons[0].habilitar = true
      setTimeout(() => {
        this.getInspeccion(this.i_inspeccion)
      }, 50)
    }
  }

  getInspeccion(inspeccion: any) {
    (this as any).mensajeSpinner = 'Obteniendo Datos de Inspección'
    this.lcargando.ctlSpinner(true);
    this.apiService.getInspeccion({ inspeccion: inspeccion }).subscribe(
      (res: any) => {
        // console.log(res['data'])
        // this.local.razon_social = res['data']['fk_local']['razon_social']

        let obj = {
          id: res.data.id_inspeccion_orden,
          fecha: moment(res.data.fecha).format('YYYY-MM-DD'),
          fecha_reorden: moment(res.data.fecha_reorden).format('YYYY-MM-DD'),
          secuencia: res.data.secuencia,
          observaciones: res.data.observaciones,
          usuario: res.data.usuario,
          created_at: moment(res.data.created_at).format('YYYY-MM-DD'),
        }
        Object.assign(this.inspeccion, obj)

        this.resultados = []
        res['data']['resultados'].forEach(e => {
          let obj = {
            id: e.id_inspeccion_res,
            departamento: e.tipo_inspeccion,
            fecha: e.fecha,
            inspector: (e.fk_inspector) ? e.fk_inspector.nombres:'N/A' ,
            estado: this.estados_ins[e.aprueba],
            fecha_asignacion: e.fecha_asignacion 
          }
          this.resultados.push({ ...obj })
          this.id_rentas = this.resultados[0].id
          let fecha_asig = this.resultados[0].fecha_asignacion;
          this.fecha_asignacion = fecha_asig ? moment(fecha_asig).format("YYYY-MM-DD") : moment(new Date()).format("YYYY-MM-DD") 
        })
        this.getInspectores()
        // this.lcargando.ctlSpinner(false)
      },
      err => {
        this.lcargando.ctlSpinner(false)
        console.log(err)
        this.toastr.error(err.error.message, 'Error cargando Datos de Inspección')
      }
    )
  }

  metodoGlobal(evt) {
    switch (evt.items.boton.texto) {
      case "GUARDAR":
        if (this.i_inspeccion) {
          this.actualizarInspeccion()
        } else {
          this.almacenarInspeccion()
        }
        break;

      case "REGRESAR":
        this.activeModal.close()
        break;

      default:
        break;
    }
  }

  getInspectores() {
    (this as any).mensajeSpinner = 'Cargando Inspectores'
    // this.lcargando.ctlSpinner(true);
    this.apiService.getInspectores({ tipo: 'RENTAS' }).subscribe(
      (res: any) => {
        // console.log(res['data'])
        res.data.forEach((element: any) => {
          const {id_inspector, nombres} = element
          this.inspectores = [...this.inspectores, { id: id_inspector, nombres: nombres }]
        })
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        this.lcargando.ctlSpinner(false)
        console.log(err)
        this.toastr.error(err.error.message, 'Error cargando Inpectores')
      }
    )
  }

  almacenarInspeccion() {
    (this as any).mensajeSpinner = 'Guardando Orden de Inspección'
    this.lcargando.ctlSpinner(true);
    this.apiService.setInspeccion({ 
      orden: this.inspeccion, 
      fk_local: this.local, 
      fk_contribuyente: this.contribuyente 
    }).subscribe(
      (res: any) => {
        console.log(res)
        let obj = {
          id: res['data']['id_inspeccion_orden'],
          local: this.local.razon_social,
          numero_orden: res['data']['numero_orden'],
          estado_1: this.estados_ins[res['data']['estado_1']],
          estado_2: this.estados_ins[res['data']['estado_2']],
          estado_3: this.estados_ins[res['data']['estado_3']],
          estado_4: this.estados_ins[res['data']['estado_4']],
          fecha: moment(res['data']['fecha']).format('YYYY-MM-DD'),
          fecha_reorden: moment(res['data']['fecha_reorden']).format('YYYY-MM-DD'),
          secuencia: res['data']['secuencia'],
          usuario: res.data.usuario,
        }
        this.activeModal.close()
        this.lcargando.ctlSpinner(false)
        this.commonVarService.setNuevaInspeccion.next(obj)
      },
      err => {
        this.lcargando.ctlSpinner(false)
        console.log(err)
        this.toastr.error(err.error.message, 'Error guardando Orden de Inspección')
      }
    )
  }

  actualizarInspeccion() {
    (this as any).mensajeSpinner = 'Actualizando Orden de Inspección'
    this.lcargando.ctlSpinner(true);
    this.apiService.actualizaInspeccion(this.inspeccion).subscribe(
      (res: any) => {
        console.log(res.data)
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error actualizando Orden de Inspección')
      }
    )
  }

  asignarInspector(inspeccion: any) {
    if (this.inspector === null || this.inspector === 0) {
      Swal.fire({
        title: this.fTitle,
        text: 'Debe seleccionar un inspector',
        icon: 'warning'
      })
      return
    }

    let data = {
      inspeccion: {
        // id: this.resultados.find(e => e.departamento == 'RENTAS').id_inspeccion_res,
        id: this.id_rentas,
        fecha_asignacion: moment(this.fecha_asignacion).format('YYYY-MM-DD'),
        fk_inspector: this.inspector.id
      }
    };
    (this as any).mensajeSpinner = 'Asignando Inspector...'
    this.lcargando.ctlSpinner(true);
    this.apiService.asignaInspector(data).subscribe(
      (res: any) => {
        console.log(res.data)
        this.lcargando.ctlSpinner(false)
        Swal.fire({
          title: this.fTitle,
          text: 'Inspector asignado correctamente',
          icon: 'success'
        }).then(() => this.getInspeccion(this.i_inspeccion))
      },
      err => {
        this.lcargando.ctlSpinner(false)
        console.log(err)
        this.toastr.error(err.error.message, 'Error asignando Inspector')
      }
    )
  }

}
