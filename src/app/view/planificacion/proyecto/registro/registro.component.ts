import { Component, OnInit, ViewChild } from '@angular/core';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { RegistroService } from './registro.service';
import { ModalComponent } from './modal/modal.component';

@Component({
standalone: false,
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent 
  fTitle = 'Registro de Compras'
  mensajeSpinner: string = ''

  periodos: Array<any> = []
  programas: any = []
  departamentos: any = []
  atribuciones: any = []
  bienes: any = []

  seleccion: any = {
    periodo: null,
    programa: 0,
    departamento: 0,
    atribucion: 0
  }

  constructor(
    private api: RegistroService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.cargaInicial()
    }, 50)
  }

  async cargaInicial() {
    let response;
    // Cargar Periodos
    this.lcargando.ctlSpinner(true);
    try {
      (this as any).mensajeSpinner = 'Cargando Periodos'
      response = await this.api.getPeriodos();
      this.periodos = response;
      
      (this as any).mensajeSpinner = 'Cargando Programas'
      response = await this.api.getProgramas();
      response.map((item: any) => Object.assign(item, { label: `${item.descripcion} - ${item.valor}`}))
      this.lcargando.ctlSpinner(false)
      this.programas = response;
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error en Carga Inicial')
    }
  }

  /* cargaProgramas() {
    (this as any).mensajeSpinner = 'Cargando Programas'
    this.lcargando.ctlSpinner(true);
    this.api.getProgramas().subscribe(
      res => {
        // console.log(res['data']);
        res['data'].forEach(element => {
          let obj = {
            id: element.id_catalogo,
            nombre: element.valor,
            codigo: element.descripcion
          }
          this.programas.push({...obj})
        })
        this.lcargando.ctlSpinner(false)
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Programas')
      }
    )
  } */

  cargaDepartamentos(e) {
    this.departamentos = []
    this.atribuciones = []
    this.bienes = []
    
    (this as any).mensajeSpinner = 'Cargando Departamentos'
    this.lcargando.ctlSpinner(true);
    this.api.getDepartamentos({ programa: e.valor }).subscribe(
      (res: any) => {
        // console.log(res['data']);
        res.data.map((item: any) => Object.assign(item, { label: `${item.descripcion} - ${item.valor}`}))
        this.departamentos = res.data
        /* this.departamentos = res
        res['data'].forEach(element => {
          let obj = {
            id: element.id_catalogo,
            nombre: element.valor,
            codigo: element.descripcion
          }
          this.departamentos.push({...obj})
        }) */
        this.lcargando.ctlSpinner(false)
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Departamentos')
      }
    )
  }

  cargaAtribuciones(e) {
    this.atribuciones = []
    this.bienes = []
    let data = {
      departamento: e.nombre
    };
    (this as any).mensajeSpinner = 'Cargando Atribuciones'
    this.lcargando.ctlSpinner(true);
    this.api.getAtribuciones({ departamento: e.nombre }).subscribe(
      (res: any) => {
        // console.log(res['data']);
        this.atribuciones = res.data;
        /* res['data'].forEach(element => {
          let obj = {
            id: element.id_catalogo,
            nombre: element.valor,
            codigo: element.descripcion
          }
          this.atribuciones.push({...obj})
        }) */
        this.lcargando.ctlSpinner(false)
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Atribuciones')
      }
    )
  }

  cargaBienes(e) {
    this.bienes = []
    let data = {
      periodo: this.seleccion.periodo,
      atribucion: e
    };
    (this as any).mensajeSpinner = 'Cargando Bienes y Servicios'
    this.lcargando.ctlSpinner(true);
    this.api.getBienes(data).subscribe(
      (res: any) => {
        // console.log(res['data']);
        res['data'].forEach(element => {
          if (element.partida_presupuestaria !== null) {  // Validar si los bienes tienen una partida presupuestaria asignada
            let obj = {
              id: element.id,
              nombre: element.descripcion,
              cantidad: element.cantidad,
              costo_unitario: element.costo_unitario,
              costo_total: element.costo_total,
              partida_codigo: element.partida_presupuestaria?.valor,
              partida_descripcion: element.partida_presupuestaria?.descripcion
            }

            if (element.solicitud != null) {
              let solicitado = 0
              let saldo = element.cantidad
              element.solicitud.map((item: any) => {
                solicitado += item.cantidad_requerida
                saldo -= item.cantidad_requerida
              })
              obj['solicitado'] = solicitado
              obj['saldo'] = saldo
            }
            this.bienes.push({...obj})
          }
        })
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Bienes')
      }
    )
  }

  registrarCompra(bien) {
    const modal = this.modalService.open(ModalComponent, { size: 'lg', backdrop: 'static', windowClass: 'viewer-content-general' })
    modal.componentInstance.obj_programa = this.seleccion.programa
    modal.componentInstance.obj_departamento = this.seleccion.departamento
    modal.componentInstance.obj_atribucion = this.seleccion.atribucion
    modal.componentInstance.bien = bien
  }

}
