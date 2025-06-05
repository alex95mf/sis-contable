import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import * as myVarGlobals from '../../../../global';
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { TitulosService } from './titulos.service';
import Botonera from 'src/app/models/IBotonera';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
standalone: false,
  selector: 'app-titulos',
  templateUrl: './titulos.component.html',
  styleUrls: ['./titulos.component.scss']
})
export class TitulosComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent
  fTitle: string = "Emisión de Títulos"
  mensajeSpinner: string
  dataUser: any
  permissions: any
  estados: any[] = [
    { id: 'P', nombre: 'PENDIENTE', class: 'bg-warning' },
    { id: 'G', nombre: 'GENERADO', class: 'bg-success' }
  ]
  vmButtons: Botonera[]
  validaciones = new ValidacionesFactory;

  today = moment()
  fechaSeleccionada = this.today.format('YYYY-MM')

  registros: any[] = []
  cmb_mercados: any[] = [
    { id_catalogo: 0, valor: 'TODOS', descripcion: 'TODOS' },
  ]

  masterSelected: boolean = false
  masterIndeterminate: boolean = false

  filter: any = {
    estado: 'P',
    mercado: 0,
    fecha_desde: this.today.startOf('month').format('YYYY-MM-DD'),
    fecha_hasta: this.today.endOf('month').format('YYYY-MM-DD')
  }

  paginate: any = {
    length: 0,
    perPage: 10,
    page: 1,
    pageSizeOptions: [10, 20, 50]
  }

  chk_simulacion: boolean = false

  constructor(
    private apiService: TitulosService,
    private toastr: ToastrService,
    private commonService: CommonService,
    private excelService: ExcelService,
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsMercadosTitulos",
        paramAccion: "",
        boton: { icon: "fas fa-user-cog", texto: "PROCESAR" },
        clase: "btn btn-primary boton btn-sm",
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: "btnsMercadosTitulos",
        paramAccion: "",
        boton: { icon: "fas fa-file-excel", texto: "EXCEL" },
        clase: "btn btn-success boton btn-sm",
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        habilitar: false,
      },
    ]
    setTimeout(() => {
      this.getCatalogos() // Intercambiar para pasar a staging
      // this.validaPermisos()
    }, 50)
  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case "EXCEL":
        this.exportExcel()
        break;
      case "PROCESAR":
        if (this.chk_simulacion) {
          Swal.fire('Esta en modo Simulacion, no puede procesar los registros', '', 'warning')
          return;
        }

        const procesar = this.registros.filter(e => e.check && e.estado == 'P')

        if (!procesar.length) {
          this.toastr.warning('No hay registros a procesar')
          return
        }

        Swal.fire({
          title: this.fTitle,
          text: `Se procesarán los ${procesar.length} registros mostrados en pantalla.`,
          icon: 'question',
          confirmButtonText: 'Confirmar',
          showCancelButton: true,
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            (this as any).mensajeSpinner = 'Procesando Títulos'
            this.lcargando.ctlSpinner(true)
            this.apiService.processCuota({ cuotas: procesar }).subscribe(
              (res: any) => {
                res.data.forEach((element: any) => {
                  Object.assign(
                    this.registros.find(registro => registro.id_mercado_contrato_detalle == element.id_mercado_contrato_detalle), 
                    { 
                      estado: element.estado, 
                      num_deuda: element.num_deuda,
                      check: false  // Quitar la marca
                    }
                  )
                });
                this.lcargando.ctlSpinner(false)
                Swal.fire(`${res.data.length} registros procesados.`, '', 'success')
                // this.validaciones.mensajeExito(this.fTitle, `${res.data.length} registros procesados.`)
                // this.getContratoDetalles()
              },
              (err: any) => {
                console.log(err)
                this.toastr.error('Error procesando Títulos', this.fTitle)
                this.lcargando.ctlSpinner(false)
              }
            )
          }
        })

        break;

      default:
        break;
    }
  }

  validaPermisos() {
    (this as any).mensajeSpinner = 'Cargando Permisos de Usuario'
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"))

    let params = {
      codigo: myVarGlobals.fRenMercadoTitulo,
      id_rol: this.dataUser.id_rol,
    };

    this.lcargando.ctlSpinner(true)
    this.commonService.getPermisionsGlobas(params).subscribe(
      res => {
        this.permissions = res["data"][0];
        if (this.permissions.abrir == "0") {
          this.lcargando.ctlSpinner(false);
          // this.vmButtons = [];  // Supuestamente deberia desaparecer los botones de accion
          this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle);
        } else {
          // this.getContratoDetalles()
          this.getCatalogos()
        }
      },
      err => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }

  getCatalogos() {
    (this as any).mensajeSpinner = 'Cargando Catalogos'
    // this.lcargando.ctlSpinner(true)
    this.apiService.getCatalogos({ params: "'REN_MERCADO'" }).subscribe(
      (res: any) => {
        // console.log(res)
        res.data.REN_MERCADO.forEach((element: any) => {
          const { id_catalogo, valor, descripcion } = element
          this.cmb_mercados = [...this.cmb_mercados, { id_catalogo: id_catalogo, valor: valor, descripcion: descripcion }]
        })
        // this.lcargando.ctlSpinner(false)
        this.getContratoDetalles()
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Catalogos')
      }
    )
  }

  getContratoDetalles() {
    if (this.chk_simulacion) {
      Object.assign(this.filter, { estado: null })
    }

    (this as any).mensajeSpinner = 'Cargando Titulos por Cobrar...'
    this.lcargando.ctlSpinner(true)
    this.apiService.getContratoDetalles({params: { filter: this.filter, paginate: this.paginate }}).subscribe(
      (res: any) => {
        // console.log(res)
        this.paginate.length = res.data.total
        this.registros = res.data.data
        this.registros.forEach((e: any) => {
          let fecha = e.fecha_desde.split(' ')[0]
          let fecha_cuota = `${fecha.split('-')[0]}/${fecha.split('-')[1]}`
          Object.assign(e, { 
              check: false, 
              fecha_desde: fecha_cuota
            }
          )
        })
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error('Error cargando Titulos por Cobrar', this.fTitle)
      }
    )
  }

  clearFiltros() {
    Object.assign(this.filter, { mercado: 0, estado: 'P', fecha_desde: this.today.startOf('month').format('YYYY-MM-DD'), fecha_hasta: this.today.endOf('month').format('YYYY-MM-DD') })
    this.fechaSeleccionada = moment(this.today).format('YYYY-MM')
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.getContratoDetalles()
  }

  setFecha() {
    this.filter.fecha_desde = moment(this.fechaSeleccionada).startOf('month').format('YYYY-MM-DD')
    this.filter.fecha_hasta = moment(this.fechaSeleccionada).endOf('month').format('YYYY-MM-DD')
  }

  exportExcel() {
    let excelData = [];
    (this as any).mensajeSpinner = 'Exportando Titulos...'
    this.lcargando.ctlSpinner(true)
    this.apiService.getContratoDetalles({params: { filter: this.filter }}).subscribe(
      (res: any) => {
        let registros = res.data
        registros.forEach((e: any) => {
          let fecha = e.fecha_desde.split(' ')[0]
          let fecha_cuota = `${fecha.split('-')[0]}/${fecha.split('-')[1]}`
          Object.assign(e, { 
              check: false, 
              fecha_desde: fecha_cuota
            }
          )
          //
          let o = {
            NumContrato: e.contrato.numero_contrato,
            Contribuyente: e.contrato.fk_contribuyente?.razon_social,
            Ubicacion: `${e.contrato.fk_mercado?.valor} - ${e.contrato.fk_mercado_puesto?.numero_puesto}`,
            Emision: fecha_cuota,
            NumCuota: e.nro_cuota,
            Total: `$ ${e.contrato.total}`,
            Saldo: `$ ${e.saldo}`,
          }
          excelData.push(o)
        })
        this.lcargando.ctlSpinner(false)
        let filename = (this.chk_simulacion) ? 'SimEmisionTitulosMercado' : 'EmisionTitulosMercado' 
        this.excelService.exportAsExcelFile(excelData, filename)
      }
    )
    
  }

  checkIndetereminate() {
    const someSelected = this.registros.reduce((acc, curr) => acc | curr.check, 0)
    const allSelected = this.registros.reduce((acc, curr) => acc & curr.check, 1)

    this.masterIndeterminate = !!(someSelected && !allSelected)
    this.masterSelected = !!allSelected
  }

  selectAll() {
    this.masterIndeterminate = false
    this.registros.map((e: any) => e.check = this.masterSelected)
  }

}
