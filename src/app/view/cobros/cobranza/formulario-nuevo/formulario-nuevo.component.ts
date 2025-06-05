import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as moment from 'moment';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { ExcelService } from 'src/app/services/excel.service';

import { FormularioNuevoService } from './formulario-nuevo.service';
import { ModalDetallesComponent } from './modal-detalles/modal-detalles.component';
import { MatPaginator } from '@angular/material/paginator';


@Component({
standalone: false,
  selector: 'app-formulario-nuevo',
  templateUrl: './formulario-nuevo.component.html',
  styleUrls: ['./formulario-nuevo.component.scss']
})
export class FormularioNuevoComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false}) lcargando: CcSpinerProcesarComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator
  fTitle: string = "Gestión de Cobranzas"
  mensajeSpinner: string = "Cargando...";
  dataUser: any;
  permissions: any;
  vmButtons: any;

  cmb_mercados: any[] = []
  cmb_conceptos: any[] = []

  sectores: any[] = [
    { valor: 0, descripcion: 'TODOS' },
  ]
  gestiones: any[] = [
    { valor: 0, descripcion: "TODOS" },
  ];

  liquidacionesDt: any[] = [];
  masterSelected: boolean = false
  masterIndeterminate: boolean = false

  paginate: any = {
    length: 0,
    perPage: 10,
    page: 1,
    pageSizeOptions: [10, 20, 30, 50]
  }
  filter: any = {
    gestion: 0,
    sector: 0,
    mercado: null,
    concepto: null,
    razon_social: null,
    fecha_desde: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
    fecha_hasta: moment().format('YYYY-MM-DD'),
  }
  fecha_emision = moment().add(0, 'years').format('YYYY-MM-DD')

  constructor(
    private modalSrv: NgbModal,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private commonVrs: CommonVarService,
    private apiSrv: FormularioNuevoService,
    private excelService: ExcelService,
  ) {
    this.commonVrs.modalEditionDetallesCobro.asObservable().subscribe(
      (res)=>{
        this.cargarLiquidaciones();
      }
    )

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    this.vmButtons = [
      {
        orig: "btnsGestionCobranza",
        paramAccion: "",
        boton: { icon: "fas fa-bell-plus", texto: "EMITIR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsGestionCobranza",
        paramAccion: "",
        boton: { icon: "fas fa-bell-plus", texto: "EMISION MASIVA" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-info text-light boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsGestionCobranza",
        paramAccion: "",
        boton: { icon: "fas fa-file-excel", texto: "EXCEL" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-outline-success boton btn-sm",
        habilitar: false,
      },
    ]
  }

  ngOnInit(): void {
    setTimeout(()=> {
      this.fillCatalog();
    }, 50);
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "EXCEL":
        this.exportarExcel()
        break;

      case "EMISION MASIVA":
        this.generarNotificacionMasiva()
        break;

      case "EMITIR":
        this.generarNotificacion()
        break;

      default:
        break;
    }
  }

  changePaginate({pageIndex, pageSize}) {
    Object.assign(this.paginate, {page: pageIndex + 1, perPage: pageSize});

    this.lcargando.ctlSpinner(true);
    this.cargarLiquidaciones();
  }

  consultar() {
    Object.assign(this.paginate, { page: 1, pageIndex: 0})
    this.paginator.firstPage()

    this.lcargando.ctlSpinner(true)
    this.cargarLiquidaciones()
  }

  fillCatalog() {
    this.lcargando.ctlSpinner(true);
    (this as any).mensajeSpinner = "Cargando Catalogs";
    this.apiSrv.getCatalogs({params: "'COB_TIPO_GESTION','CAT_SECTOR','REN_MERCADO'"}).subscribe(
      (res: any) => {
        // console.log(res.data);
        res.data.COB_TIPO_GESTION.forEach(e => {
          const { valor, descripcion } = e;
          this.gestiones = [...this.gestiones, { valor: valor, descripcion: descripcion }]
        })
        res.data.CAT_SECTOR.forEach(e => {
          const { valor, descripcion } = e;
          this.sectores = [...this.sectores, {valor: valor, descripcion: descripcion}]
        })
        res.data.REN_MERCADO.forEach(e => {
          const { id_catalogo, valor, descripcion } = e;
          this.cmb_mercados = [...this.cmb_mercados, { id_catalogo: id_catalogo, valor: valor, descripcion: descripcion }]
        })
        // this.lcargando.ctlSpinner(false);
        this.cargarConceptos()
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  cargarConceptos() {
    (this as any).mensajeSpinner = 'Cargando Conceptos'
    this.apiSrv.getConceptos().subscribe(
      (res: any) => {
        res.data.forEach(e => {
          const { id_concepto, nombre } = e
          this.cmb_conceptos = [...this.cmb_conceptos, { id_concepto: id_concepto, nombre: nombre }]
        })
        this.cargarLiquidaciones()
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Conceptos')
      }
    )
  }

  cargarLiquidaciones(){
    let msgInvalid = ''

    if (!moment(this.filter.fecha_desde).isValid()) msgInvalid += '* El campo Fecha Desde es invalido.<br>'
    if (!moment(this.filter.fecha_hasta).isValid()) msgInvalid += '* El campo Fecha Hasta es invalido.<br>'

    if (msgInvalid.length > 0) {
      this.lcargando.ctlSpinner(false)
      this.toastr.warning(msgInvalid, 'Validacion de Datos', {enableHtml: true})
      return;
    }

    (this as any).mensajeSpinner = "Cargando Liquidaciones...";
    // this.lcargando.ctlSpinner(true);
    this.apiSrv.getLiqByContribuyente({params: { filter: this.filter, paginate: this.paginate } }).subscribe(
      (res: any) => {
        // console.log(res);
        if (Array.isArray(res.data) && !res.data.length) {
          this.lcargando.ctlSpinner(false)
          return;
        }

        this.paginate.length = res.data.total;
        this.liquidacionesDt = res.data.data

        this.liquidacionesDt.forEach((element: any) => {
          Object.assign(element, { check: false })
        });

        this.lcargando.ctlSpinner(false);
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false);
        this.toastr.info(err.error.message, 'Error cargando Liquidaciones');
      }
    );
  }

  generarNotificacion() {
    let procesados = this.liquidacionesDt.filter(e => e.check == true && e.fk_notificacion == null)

    if (!procesados.length) {
      Swal.fire('No ha seleccionado liquidaciones a notificar.', '', 'info')
      return
    }

    Swal.fire({
      title: this.fTitle,
      text: `Seguro/a de emitir notificaciones para ${procesados.length} registro(s)?`,
      showCancelButton: true,
      icon: 'question',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        (this as any).mensajeSpinner = 'Emitiendo Notificaciones'
        this.lcargando.ctlSpinner(true)

        this.apiSrv.generarNotificaciones({liquidaciones: procesados, fecha_emision: this.fecha_emision}).subscribe(
          (res: any) => {
            console.log(res)
            this.lcargando.ctlSpinner(false)
            Swal.fire('Notificaciones emitidas correctamente', '', 'success').then(() => {
              this.cargarLiquidaciones()
            })
          },
          (err: any) => {
            console.log(err)
            this.lcargando.ctlSpinner(false)
            this.toastr.error(err.error.message, 'Error emitiendo Notificaciones')
          }
        )
      }
    })
  }

  generarNotificacionMasiva() {
    Swal.fire({
      title: this.fTitle,
      text: `Seguro/a de emitir notificaciones para ${this.paginate.length} registros?`,
      showCancelButton: true,
      icon: 'question',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        (this as any).mensajeSpinner = 'Emitiendo Notificaciones'
        this.lcargando.ctlSpinner(true)
        this.apiSrv.generarNotificacionesMasivo({filter: this.filter, fecha_emision: this.fecha_emision}).subscribe(
          (res: any) => {
            console.log(res)
            this.lcargando.ctlSpinner(false)
            Swal.fire('Notificaciones emitidas correctamente', '', 'success').then(() => {
              this.cargarLiquidaciones()
            })
          },
          (err: any) => {
            console.log(err)
            this.lcargando.ctlSpinner(false)
            this.toastr.error(err.error.message, 'Error emitiendo Notificaciones')
          }
        )
      }
    })
  }

  modalDetalles(liquidacion){
    const modal = this.modalSrv.open(ModalDetallesComponent,{
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });

    modal.componentInstance.liquidacion = liquidacion

  }

  limpiarFiltros() {
    this.filter = {
      gestion: 0,
      sector: 0,
      mercado: null,
      concepto: null,
      contribuyente: null,
      fecha_desde: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
      fecha_hasta: moment().format('YYYY-MM-DD'),
      filterControl: ""
    }
  }

  selectAll() {
    this.masterIndeterminate = false
    this.liquidacionesDt.map((e: any) => e.check = this.masterSelected)
  }

  checkIndetereminate() {
    const someSelected = this.liquidacionesDt.reduce((acc, curr) => acc | curr.check, 0)
    const allSelected = this.liquidacionesDt.reduce((acc, curr) => acc & curr.check, 1)

    this.masterIndeterminate = !!(someSelected && !allSelected)
    this.masterSelected = !!allSelected
  }

  exportarExcel() {
    let excelData = []
    this.liquidacionesDt.forEach((liquidacion: any) => {
      const { documento, fecha, total, ...items } = liquidacion;
      const { razon_social, num_documento, codigo_sector, ...contribuyente  } = liquidacion.contribuyente;
      const { nombre, ...concepto } = liquidacion.concepto;

      const data = {
        Contribuyente: razon_social,
        NumDocumento: num_documento,
        Sector: codigo_sector?.descripcion ?? 'Sin Asignar',
        Documento: documento,
        Concepto: nombre,
        Fecha: fecha,
        Total: total,
      }
      excelData.push(data)
    })
    this.excelService.exportAsExcelFile(excelData, 'GestionCobranza_Titulos');
  }
}
