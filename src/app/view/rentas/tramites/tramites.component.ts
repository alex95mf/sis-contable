import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment';

import { ModalTramiteDetallesComponent } from './modal-tramite-detalles/modal-tramite-detalles.component';
import { TramitesService } from './tramites.service';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonService } from 'src/app/services/commonServices';
import { ExcelService } from 'src/app/services/excel.service';
import * as myVarGlobals from 'src/app/global';

@Component({
standalone: false,
  selector: 'app-tramites',
  templateUrl: './tramites.component.html',
  styleUrls: ['./tramites.component.scss']
})
export class TramitesComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  mensajeSpinner: string
  fTitle: string = 'Registro de Trámites'
  vmButtons: any[] = []
  dataUser: any
  permissions: any

  departamentos: any[] = []
  disposiciones: any[] = [
    { id: 'PRO', nombre: 'PROCEDER' },
    { id: 'ARC', nombre: 'ARCHIVAR' },
    { id: 'RES', nombre: 'RESPONDER' },
    { id: 'VER', nombre: 'VERIFICAR' },
    { id: 'EMI', nombre: 'EMITIR' },
    { id: 'ASI', nombre: 'ASISTIR' },
    { id: 'FIR', nombre: 'FIRMAR' },
  ]

  tramites: any[] = []

  filter: any = {
    fecha_desde: moment().startOf('month').format('YYYY-MM-DD'),
    fecha_hasta: moment().format('YYYY-MM-DD'),
    departamento: null,
    disposicion: null,
  }

  paginate: any = {
    page: 1,
    perPage: 10,
    pageSizeOptions: [5, 10, 20, 50],
    total: 0,
  }


  constructor(
    private commonService: CommonService,
    private toastr: ToastrService,
    private apiService: TramitesService,
    private modalService: NgbModal,
    private excelService: ExcelService,
  ) {
    this.vmButtons = [
      {
        orig: "btnsRenTramites",
        paramAccion: "",
        boton: { icon: "fas fa-plus-square", texto: "NUEVO" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsRenTramites",
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

    this.apiService.newTramite$.subscribe(
      (result: any) => {
        this.tramites.push(result)
      }
    )

    this.apiService.updateTramite$.subscribe(
      (result: any) => {
        Object.assign(this.tramites.find((e: any) => e.id_tramite == result.id_tramite), result)
        // this.tramites.find((e: any) => e.id_tramite == result.id_tramite)
      }
    )

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.validaPermisos()
    }, 50)
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "NUEVO":
        this.nuevoTramite()
        break;

      case "EXCEL":
        this.exportExcel()
        break;

      default:
        break;
    }
  }

  validaPermisos() {
    (this as any).mensajeSpinner = 'Cargando Permisos de Usuario...';
    this.lcargando.ctlSpinner(true);

    let params = {
      codigo: myVarGlobals.fRenTramites,
      id_rol: this.dataUser.id_rol,
    };

    this.commonService.getPermisionsGlobas(params).subscribe(
      res => {
        this.permissions = res["data"][0];
        if (this.permissions.abrir == "0") {
          this.lcargando.ctlSpinner(false);
          this.vmButtons = [];  // Supuestamente deberia desaparecer los botones de accion
          this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle);
        } else {
          this.lcargando.ctlSpinner(false);
          setTimeout(() => {
            this.getCatalogos()
          }, 50);
        }
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }

  getCatalogos() {
    (this as any).mensajeSpinner = 'Cargando Catalogos'
    this.lcargando.ctlSpinner(true);
    this.apiService.getCatalogos({ params: "'PLA_DEPARTAMENTO'" }).subscribe(
      (res: any) => {
        // console.log(res)
        res.data.PLA_DEPARTAMENTO.forEach((element: any) => {
          const { id_catalogo, valor, descripcion } = element
          this.departamentos = [...this.departamentos, { id_catalogo: id_catalogo, valor: valor, descripcion: descripcion }]
        });
        this.lcargando.ctlSpinner(false)
        this.getTramites()
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Catalogos')
      }
    )
  }

  consultar() {
    Object.assign(this.paginate, { page: 1 })
    this.getTramites()
  }

  getTramites() {
    (this as any).mensajeSpinner = 'Cargando Tramites'
    this.lcargando.ctlSpinner(true);
    this.apiService.getTramites({ params: { filter: this.filter, paginate: this.paginate } }).subscribe(
      (res: any) => {
        // console.log(res)
        Object.assign(this.paginate, { length: res.data.total })
        this.tramites = (res.data.current_page == 1) ? res.data.data : Object.values(res.data.data)
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Tramites')
      }
    )
  }

  clearFiltros() {
    this.filter = {
      fecha_desde: moment().startOf('month').format('YYYY-MM-DD'),
      fecha_hasta: moment().format('YYYY-MM-DD'),
      departamento: null,
      disposicion: null,
    }
  }

  changePaginate(event) {
    Object.assign(this.paginate, { perPage: event.pageSize, page: event.pageIndex + 1 })

    this.lcargando.ctlSpinner(true);
    this.getTramites()
  }

  nuevoTramite() {
    const modal = this.modalService.open(ModalTramiteDetallesComponent, { size: 'xl', backdrop: 'static' })
    modal.componentInstance.nuevo = true
  }

  editTramite(tramite: any) {
    const modal = this.modalService.open(ModalTramiteDetallesComponent, { size: 'xl', backdrop: 'static' })
    modal.componentInstance.nuevo = false
    modal.componentInstance.data = tramite
  }

  exportExcel() {
    let excelData = [];

    (this as any).mensajeSpinner = 'Exportando Trámites'
    this.lcargando.ctlSpinner(true);
    this.apiService.getTramites({ params: { filter: this.filter } }).subscribe(
      (res: any) => {
        try {
          res.data.map(e => e.created_at = moment(e.created_at).format('YYYY-MM-DD'))
          res.data.forEach((e: any) => {
            const data = {
              Documento: `${e.tipo_documento} ${e.numero_documento}`,
              FechaDocumento: e.fecha_documento,
              FechaRecibido: e.fecha_recibido,
              HoraRecibido: e.hora_recibido,
              Departamento: e.departamento?.valor,
              Tema: e.tema,
              Destino: e.destino,
              FechaEntrega: e.fecha_entrega,
              HoraEntrega: e.hora_entrega,
              Disposicion: e.disposicion,
            }
            excelData.push(data)
          })
        } catch (err) {
          console.log(err)
          this.lcargando.ctlSpinner(false)
          this.toastr.error('', 'Error exportando Trámites')
        }
        this.excelService.exportAsExcelFile(excelData, 'RentasTramites')
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error obteniendo Trámites')
      }
    )
  }

}
