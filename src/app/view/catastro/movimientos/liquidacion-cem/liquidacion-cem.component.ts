import { Component, OnInit, ViewChild } from '@angular/core';
import { LiquidacionCemService } from './liquidacion-cem.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { ModalBusquedaComponent } from './modal-busqueda/modal-busqueda.component';
import { MatTable } from '@angular/material/table';

@Component({
standalone: false,
  selector: 'app-liquidacion-cem',
  templateUrl: './liquidacion-cem.component.html',
  styleUrls: ['./liquidacion-cem.component.scss']
})
export class LiquidacionCemComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  @ViewChild(MatTable) table: MatTable<any>;
  mensajeSpinner: string = "Cargando...";
  vmButtons: Botonera[] = [];

  lst_base: any[] = [];
  displayedColumns: string[] = ['base', 'valor'];

  liquidacion_cem: any = {
    num_documento: null,
    nombre: null,
    fecha: moment().format('YYYY-MM-DD'),
    observaciones: null,
    motivo: null,
    plazo: 1,
    rango_inicio: moment().format('YYYY'),
    rango_finalizacion: moment().add(1, 'years').format('YYYY'),
    total: 0,
    estado: 'E',
    txt_zonas: null,
    sum_solares: 0,
    valor_anual: 0,
    valor_anual_solar: 0,
  };

  cmb_motivo: any[] = [];
  cmb_zona: any[] = [];
  cmb_estado: any[] = [
    {value: 'E', label: 'Emitido'},
    {value: 'A', label: 'Aprobado'},
    {value: 'X', label: 'Anulado'},
  ]
  zonasSelected: any[] = [];

  formReadonly: boolean = false;

  constructor(
    private apiService: LiquidacionCemService,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) {
    this.vmButtons = [
      {
        orig: 'btnsLiquidacionCem',
        paramAccion: '',
        boton: { icon: 'fas fa-save', texto: 'GUARDAR' },
        clase: 'btn btn-sm btn-success',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: 'btnsLiquidacionCem',
        paramAccion: '',
        boton: { icon: 'fas fa-check', texto: 'MODIFICAR' },
        clase: 'btn btn-sm btn-info text-white',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: true,
      },
      {
        orig: 'btnsLiquidacionCem',
        paramAccion: '',
        boton: { icon: 'fas fa-search', texto: 'BUSCAR' },
        clase: 'btn btn-sm btn-primary',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: 'btnsLiquidacionCem',
        paramAccion: '',
        boton: { icon: 'fas fa-eraser', texto: 'LIMPIAR' },
        clase: 'btn btn-sm btn-warning',
        permiso: true,
        showimg: true,
        showtxt: true,
        showbadge: false,
        habilitar: false,
      },
    ]

    this.apiService.liquidacionSelected$.subscribe(async (liquidacion: any) => {
      // console.log(liquidacion)
      this.lcargando.ctlSpinner(true);
      try {
        let response = await this.apiService.getLiquidacion(liquidacion.id);
        console.log(response)
        Object.assign(this.liquidacion_cem, response)

        this.lst_base = [];
        response.detalles.forEach((element: any) => {
          this.lst_base.push({ descripcion: element.base, valor: element.valor })
        });
        this.table.renderRows()

        this.lcargando.ctlSpinner(false)
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error?.message)
      }


      this.formReadonly = true
      this.vmButtons[0].habilitar = true
      this.vmButtons[1].habilitar = false
    })
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.cargaInicial()
    }, 0);
  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case "GUARDAR":
        this.setLiquidacion();
        break;
      case "MODIFICAR":
        this.updateLiquidacion();
        break;
      case "BUSCAR":
        this.expandBusqueda();
        break;
      case "LIMPIAR":
        this.limpiarForm();
        break;

      default:
        break;
    }
  }

  async cargaInicial() {
    this.lcargando.ctlSpinner(true);
    try {
      (this as any).mensajeSpinner = 'Cargando'
      let catalogos = await this.apiService.getCatalogos({params: "'CEM_BASE_CALCULO','CEM_MOTIVO_CALCULO','CAT_ZONA'"})
      // console.log(catalogos)

      this.cmb_motivo = catalogos['CEM_MOTIVO_CALCULO'];
      this.cmb_zona = catalogos['CAT_ZONA'];

      this.lst_base = catalogos['CEM_BASE_CALCULO'];
      this.lst_base.map((item: any) => Object.assign(item, { valor: 0 }))
      //
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message)
    }
  }

  sumaBases() {
    let total: number = this.lst_base.reduce((acc, curr) => acc + curr.valor, 0)
    // console.log(total.toFixed(2))
    this.liquidacion_cem.total = total.toFixed(2)

    this.dividirTotal(total)
  }

  dividirTotal(total: number) {
    if (this.liquidacion_cem.sum_solares > 0) {
      let valor_anual = total / this.liquidacion_cem.plazo
      let valor_anual_solar = valor_anual / this.liquidacion_cem.sum_solares

      Object.assign(this.liquidacion_cem, { valor_anual, valor_anual_solar })
    } else {
      Object.assign(this.liquidacion_cem, {
        valor_anual: 0,
        valor_anual_solar: 0,
      })
    }
  }

  calcularRango() {
    let final = parseInt(this.liquidacion_cem.rango_inicio) + parseInt(this.liquidacion_cem.plazo)
    // console.log(final)
    this.liquidacion_cem.rango_finalizacion = final

    this.dividirTotal(this.liquidacion_cem.total)
  }

  async limpiarForm() {
    let result = await Swal.fire({
      titleText: 'Limpieza de Formulario',
      text: 'Esta seguro/a de limpiar el formulario?',
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Limpiar'
    });

    if (result.isConfirmed) {
      this.lcargando.ctlSpinner(true);
      try {
        (this as any).mensajeSpinner = 'Limpiando Formulario'

        Object.assign(this.liquidacion_cem, {
          id: null,
          num_documento: null,
          nombre: null,
          fecha: moment().format('YYYY-MM-DD'),
          observaciones: null,
          motivo: null,
          plazo: 1,
          rango_inicio: moment().format('YYYY'),
          rango_finalizacion: moment().add(1, 'years').format('YYYY'),
          total: 0,
          estado: 'E',
          txt_zonas: null,
          sum_solares: 0,
          valor_anual: 0,
          valor_anual_solar: 0,
        })
        //
        this.formReadonly = false
        this.vmButtons[0].habilitar = false
        this.vmButtons[1].habilitar = true

        let catalogos = await this.apiService.getCatalogos({params: "'CEM_BASE_CALCULO'"})
        this.lst_base = catalogos['CEM_BASE_CALCULO'];
        this.lst_base.map((item: any) => Object.assign(item, { valor: 0 }))
        this.table.renderRows()

        this.lcargando.ctlSpinner(false)
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error?.message)
      }


    }
  }

  handleSelectZonas(event: any[]) {
    const joinedString = event.map(item => item.descripcion).join(', ');
    this.liquidacion_cem.txt_zonas = joinedString
  }

  async getSolares() {
    this.lcargando.ctlSpinner(true);
    try {
      (this as any).mensajeSpinner = 'Obteniendo total de Solares'
      let solares = await this.apiService.getSolares({zonas: this.zonasSelected});
      // console.log(solares)
      this.liquidacion_cem.sum_solares = solares

      this.dividirTotal(this.liquidacion_cem.total)
      //
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message)
    }
  }

  async setLiquidacion() {
    this.lcargando.ctlSpinner(true);
    try {
      (this as any).mensajeSpinner = 'Almacenando Liquidacion'
      let liquidacion = await this.apiService.setLiquidacion({liquidacion: this.liquidacion_cem, detalles: this.lst_base})
      console.log(liquidacion)
      Object.assign(this.liquidacion_cem, { id: liquidacion.id, num_documento: liquidacion.num_documento, txt_zonas: liquidacion.txt_zonas })

      this.formReadonly = true;
      this.vmButtons[0].habilitar = true;
      this.vmButtons[1].habilitar = false;
      //
      this.lcargando.ctlSpinner(false)
      Swal.fire('Liquidacion almacenada correctamente', '', 'success')
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message)
    }
  }

  async updateLiquidacion() {
    let result = await Swal.fire({
      titleText: 'Actualizacion de Liquidacion',
      text: 'Esta seguro/a de actualizar esta liquidacion?',
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Actualizar'
    });

    if (result.isConfirmed) {
      this.lcargando.ctlSpinner(true);
      try {
        (this as any).mensajeSpinner = 'Actualizando Liquidacion'
        let response = await this.apiService.updateLiquidacion(this.liquidacion_cem.id, {liquidacion: this.liquidacion_cem})
        console.log(response)
        //
        this.lcargando.ctlSpinner(false)
        Swal.fire('Liquidacion actualizada correctamente', '', 'success')
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error?.message)
      }

    }
  }

  expandBusqueda() {
    const modal = this.modalService.open(ModalBusquedaComponent, { size: 'xl', backdrop: 'static' })
    modal.componentInstance.cmb_motivo = this.cmb_motivo
  }

}
