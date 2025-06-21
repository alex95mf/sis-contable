import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2';
import * as myVarGlobals from 'src/app/global';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';

import { DepreciacionService } from './depreciacion.service';
import { ModalBusquedaComponent } from './modal-busqueda/modal-busqueda.component';
import { ExcelService } from 'src/app/services/excel.service';
import { MatPaginator } from '@angular/material/paginator';
import Botonera from 'src/app/models/IBotonera';

@Component({
standalone: false,
  selector: 'app-depreciacion',
  templateUrl: './depreciacion.component.html',
  styleUrls: ['./depreciacion.component.scss']
})
export class DepreciacionComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent
  @ViewChild(MatPaginator) paginator: MatPaginator;
  fTitle: string = 'Depreciación de Bienes'
  mensajeSpinner: string
  vmButtons: Botonera[] = []

  dataUser: any
  permissions: any
  filter: any = {
    tipo: 'BLD',
    fecha_desde: moment().format('YYYY-MM-DD'),
    fecha_hasta: moment().format('YYYY-MM-DD'),
  }
  paginate: any = {
    perPage: 500,
    pageIndex: 0,
    page: 1,
    length: 0,
    pageSizeOptions: [500, 750, 1000, 1250]
  }

  tipoBienes: any[] = []
  bienes: any[] = []

  depreciacion: any = {
    fecha: moment().format('YYYY-MM-DD'),
    num_documento: null,
    estado: 'A',
    observacion: null,
    detalles: []
  }

  constructor(
    private commonService: CommonService,
    private commonVarService: CommonVarService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private apiService: DepreciacionService,
    private excelService: ExcelService,
  ) {
    this.apiService.depreciacion$.subscribe(
      (res: any) => {
        this.vmButtons[0].habilitar = true
        this.vmButtons[2].habilitar = false
        this.vmButtons[4].habilitar = false
        this.paginator.disabled = true;
        (this as any).mensajeSpinner = 'Obteniendo detalles...'
        this.lcargando.ctlSpinner(true);

        this.apiService.getDepreciacionDetalles(res.id_depreciacion).subscribe(
          (response: any) => {
            console.log(response)
            Object.assign(this.depreciacion, response.data)
            this.lcargando.ctlSpinner(false)
          },
          (err: any) => {
            console.log(err)
            this.lcargando.ctlSpinner(false)
            this.toastr.warning(err.error.message, 'Error cargando Detalles')
          }
        )
      }
    )

    this.vmButtons = [
      {
        orig: "btnsBienesMovimientoDepreciacion",
        paramAccion: "",
        boton: { icon: "fas fa-save", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsBienesMovimientoDepreciacion",
        paramAccion: "",
        boton: { icon: "fas fa-file-import", texto: "BUSCAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsBienesMovimientoDepreciacion",
        paramAccion: "",
        boton: { icon: "fas fa-trash-alt", texto: "ELIMINAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsBienesMovimientoDepreciacion",
        paramAccion: "",
        boton: { icon: "fas fa-eraser", texto: "LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsBienesMovimientoDepreciacion",
        paramAccion: "",
        boton: { icon: "fas fa-file-excel", texto: "EXCEL" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: true,
      },
    ]
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.validaPermisos()
    }, 50)
  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case "GUARDAR":
        this.almacenaDepreciacion()
        break;
      case "BUSCAR":
        this.expandBusqueda()
        break;
      case "LIMPIAR":
        this.clearForm()
        break;
      case "EXCEL":
        this.exportExcel()
        break;
      case "ELIMINAR":
        this.deleteDocumento()
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
      codigo: myVarGlobals.fMovDepreciacion,
      id_rol: this.dataUser.id_rol
    }).subscribe(
      (res: any) => {
        this.permissions = res.data[0]
        if (this.permissions.abrir == '0') {
          this.lcargando.ctlSpinner(false)
          this.vmButtons = [];
          this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle)
        } else {
          this.lcargando.ctlSpinner(false)
          setTimeout(() => this.getCatalogos(), 250)
        }
      },
      (err: any) => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }

  getCatalogos() {
    (this as any).mensajeSpinner = 'Obteniendo Catalogos...'
    this.lcargando.ctlSpinner(true);

    this.apiService.getTipoBienes().subscribe(
      (res: any) => {
        // console.log(res)
        res.data.forEach((elem: any) => {
          const { id_catalogo, valor, descripcion } = elem
          this.tipoBienes = [...this.tipoBienes, { valor: valor, descripcion: descripcion }]
        })
        // this.getBienes()
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Catalogo Tipo Bienes')
      }
    )
  }

  async consultar() {
    Object.assign(this.paginate, { page: 1, pageIndex: 0 })
    Object.assign(this.depreciacion, { num_documento: null, observacion: null })

    // Revisar si hay depreciacion para año y mes de la fecha
    this.lcargando.ctlSpinner(true);
    (this as any).mensajeSpinner = 'Revisando documentos anteriores'
    let response = await this.apiService.searchDocumento({ fecha: this.depreciacion.fecha })
    console.log(response)
    // Si existe documento, cargar documento
    if (response.id_depreciacion) {
      this.vmButtons[0].habilitar = true
      this.vmButtons[2].habilitar = false
      this.vmButtons[4].habilitar = false
      this.paginator.disabled = true;
      Object.assign(this.depreciacion, response)
      this.lcargando.ctlSpinner(false)
    }
    // De lo contrario, obtener bienes
    else {
      this.getBienes()
    }

  }

  getBienes() {
    if (this.permissions.consultar == '0') {
      this.lcargando.ctlSpinner(false)
      this.toastr.warning('No tiene permisos para consultar bienes a depreciar', 'Permiso Denegado')
      return
    }

    this.paginator.disabled = false;
    (this as any).mensajeSpinner = "Cargando Bienes"
    // this.lcargando.ctlSpinner(true);

    this.apiService.getBienes({ filter: this.filter, paginate: this.paginate }).subscribe(
      (res: any) => {
        // console.log(res)
        const { current_page, total, per_page } = res.data
        Object.assign(this.paginate, { page: current_page, length: total, perPage: per_page })
        this.depreciacion.detalles = res.data.data


        this.depreciacion.detalles.map((element: any) => {
          element.valor_depreciacion = parseFloat(element.depreciacion_detalle[0].depreciacion_mensual),
            element.valor_actual = parseFloat(element.costo) - parseFloat(element.depreciacion_acumulada),
            element.valor_depreciado = parseFloat(element.depreciacion_acumulada) + parseFloat(element.depreciacion_detalle[0].depreciacion_mensual)
        })

        console.log(this.depreciacion.detalles);

        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Bienes')
      }
    )
  }

  almacenaDepreciacion() {
    if (this.permissions.guardar == '0') {
      this.toastr.warning('No tiene permisos para registrar una Depreciacion', 'Permiso Denegado')
      return
    }

    let message = ''

    if (!this.depreciacion.detalles.length) message += '* No hay bienes cargados a depreciar.<br>'
    if (this.depreciacion.observacion == null || !this.depreciacion.observacion.trim().length) message += '* No ha ingresado una observacion.<br>'

    if (message.length) {
      this.toastr.warning(message, 'Validacion de Datos', { enableHtml: true })
      return
    }

    Swal.fire({
      title: this.fTitle,
      text: 'Esta seguro de registrar esta Depreciación?',
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Confirmar',
    }).then((result: any) => {
      if (result.isConfirmed) {
        (this as any).mensajeSpinner = 'Almacenando Depreciación'
        this.lcargando.ctlSpinner(true);

        this.apiService.setDepreciacion({ depreciacion: this.depreciacion }).subscribe(
          (res: any) => {
            // Depreciacion guardada.
            console.log(res),
              this.vmButtons[0].habilitar = true
            this.vmButtons[2].habilitar = false
            this.vmButtons[4].habilitar = false
            this.depreciacion.num_documento = res.data.num_documento
            this.lcargando.ctlSpinner(false)
            Swal.fire(this.fTitle, 'Registrado correctamente', 'success')
          },
          (err: any) => {
            console.log(err)
            this.lcargando.ctlSpinner(false)
            this.toastr.warning(err.error.message, 'Error registrando Depreciación')
          }
        )



        // this.apiService.getBienes({ filter: this.filter }).subscribe(
        //   (res: any) => {
        //     this.depreciacion.detalles = res.data
        //     this.depreciacion.detalles.map((element: any) => {
        //       element.valor_depreciacion = parseFloat(element.costo) / 5 / 12,
        //         element.valor_actual = parseFloat(element.costo) - parseFloat(element.depreciacion_acumulada),
        //         element.valor_depreciado = parseFloat(element.depreciacion_acumulada) + (parseFloat(element.costo) / 5 / 12)
        //     })


        //   }
        //   ,
        //   (err: any) => {
        //     console.log(err)
        //     this.lcargando.ctlSpinner(false)
        //     this.toastr.warning(err.error.message, 'Error cargando Bienes para Reporte')
        //   }
        // )
      }
    })
  }

  clearFilter() {
    this.filter = {
      tipo: 'BLD',
      fecha_desde: moment().format('YYYY-MM-DD'),
      fecha_hasta: moment().format('YYYY-MM-DD'),
    }
  }

  changePaginate(event) {
    Object.assign(this.paginate, { perPage: event.pageSize, page: event.pageIndex + 1 })

    this.lcargando.ctlSpinner(true);
    this.getBienes()
  }

  clearForm() {
    Object.assign(
      this.filter,
      {
        tipo: 'BLD',
      }
    )
    Object.assign(
      this.depreciacion,
      {
        fecha: moment().format('YYYY-MM-DD'),
        num_documento: null,
        estado: 'A',
        observacion: null,
        detalles: []
      }
    )
    this.vmButtons[0].habilitar = false
    this.vmButtons[2].habilitar = true
    this.vmButtons[4].habilitar = true
  }

  expandBusqueda() {
    if (this.permissions.consultar == '0') {
      this.toastr.warning('No tiene permisos para consultar Depreciaciones anteriores', 'Permiso Denegado')
      return
    }

    this.modalService.open(ModalBusquedaComponent, { size: 'xl', backdrop: 'static' })
  }

  async exportExcel() {
    if (this.depreciacion.num_documento == null) {
      // De alguna manera magica llegamos a este punto;
      return;
    }
    let exceData = [];

    this.lcargando.ctlSpinner(true);
    try {
      (this as any).mensajeSpinner = 'Exportando Reporte'

      this.depreciacion.detalles.forEach((item: any) => {
        let o = {
          Num: item.id_producto ?? item.fk_producto,
          Codigo: item.codigoproducto ?? item.producto.codigoproducto,
          Nombre: item.nombre,
          Costo: `$ ${parseFloat(item.costo ?? item.valor_costo).toFixed(2)}`,
          Depreciacion: `$ ${parseFloat(item.valor_depreciacion).toFixed(2)}`,
          ValorActual: `$ ${parseFloat(item.valor_actual).toFixed(2)}`,
          Depreciado: `$ ${parseFloat(item.valor_depreciado).toFixed(2)}`,
        }
        exceData.push(o)
      })

      this.excelService.exportAsExcelFile(exceData, this.depreciacion.num_documento)
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error?.message)
    }
  }

  async deleteDocumento() {
    let result = await Swal.fire({
      titleText: 'Eliminar Documento',
      text: 'Esta seguro/a de eliminar este documento?',
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar',
    })

    if (result.isConfirmed) {
      this.lcargando.ctlSpinner(true);
      try {
        (this as any).mensajeSpinner = 'Eliminando Documento'
        await this.apiService.deleteDocumento(this.depreciacion.id_depreciacion)

        this.lcargando.ctlSpinner(false)
        Swal.fire('Documento eliminado correctamente.', '', 'success').then(() => this.clearForm())
      } catch (err) {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error?.message)
      }
    }
  }
}
