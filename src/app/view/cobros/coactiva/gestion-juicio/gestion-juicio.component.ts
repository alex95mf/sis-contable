import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from "src/app/services/common-var.services";
import { CommonService } from 'src/app/services/commonServices';
import * as myVarGlobals from 'src/app/global';
import * as moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2';

import { GestionJuicioService } from './gestion-juicio.service';
import { ModalDetallesComponent } from '../gestion-expediente/modal-detalles/modal-detalles.component';
import { MatPaginator } from '@angular/material/paginator';
import Botonera from 'src/app/models/IBotonera';

@Component({
standalone: false,
  selector: 'app-gestion-juicio',
  templateUrl: './gestion-juicio.component.html',
  styleUrls: ['./gestion-juicio.component.scss']
})
export class GestionJuicioComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  fTitle: string = "Emisión de Juicios";
  msgSpinner: string;
  dataUser: any;
  permissions: any;
  vmButtons: Botonera[] = []

  expedientes: any[] = [];
  filter: any = {
    contribuyente: null,
    fecha_desde: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
    fecha_hasta: moment().endOf('month').format('YYYY-MM-DD'),
    parajuicio: 1,
  }
  paginate: any = {
    length: 0,
    page: 1,
    pageSizeOptions: [5, 10, 15, 20],
    perPage: 10,
  }

  fecha_emision: string = moment().add(0, 'years').format('YYYY-MM-DD')

  constructor(
    private apiService: GestionJuicioService,
    private toastr: ToastrService,
    private commonService: CommonService,
    private commonVarService: CommonVarService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      {orig: 'btnsGestionJuicio', paramAccion: '', boton: {icon: 'far fa-search', texto: 'CONSULTAR'}, clase: 'btn btn-sm btn-primary', permiso: true, showbadge: false, showimg: true, showtxt: true, habilitar: false, },
      {orig: 'btnsGestionJuicio', paramAccion: '', boton: {icon: 'far fa-eraser', texto: 'LIMPIAR'}, clase: 'btn btn-sm btn-warning', permiso: true, showbadge: false, showimg: true, showtxt: true, habilitar: false, },
      {
        orig: "btnsGestionJuicio",
        paramAccion: "",
        boton: { icon: "fas fa-cog", texto: "PROCESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      }
    ]
    setTimeout(() => {
      // this.validaPermisos()
      this.getExpedientes()
    }, 50);
  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case "CONSULTAR":
        this.consultar()
        break;
      case "LIMPIAR":
        this.limpiarFiltros()
        break;
      case "PROCESAR":
        let procesados = this.expedientes.filter(e => e.juicio == true)
        if (!procesados.length) {
          this.toastr.info('No hay registros a procesar.', this.fTitle)
          return
        }

        this.msgSpinner = "Procesando expedientes"
        this.lcargando.ctlSpinner(true)
        console.log({ expedientes: procesados })
        this.apiService.setJuicios({ expedientes: procesados, fecha_emision: this.fecha_emision }).subscribe(
          (res: any) => {
            console.log(res)
            this.expedientes = this.expedientes.filter(e => e.juicio == false)
            this.lcargando.ctlSpinner(false)
            Swal.fire(`Juicio: ${res.data}`, `${procesados.length} registros procesados.`, 'success')
          },
          (err: any) => {
            console.log(err)
            this.lcargando.ctlSpinner(false)
            this.toastr.error(err.error.message, 'Error procesando Expedientes')
          }
        )
        break;
    }
  }

  validaPermisos = () => {
    this.msgSpinner = 'Cargando Permisos de Usuario...'
    this.lcargando.ctlSpinner(true)
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"))

    let params = {
      codigo: myVarGlobals.fCoacJuicio,
      id_rol: this.dataUser.id_rol,
    };

    this.commonService.getPermisionsGlobas(params).subscribe(
      (res: any) => {
        this.permissions = res["data"][0];
        if (this.permissions.abrir == "0") {
          this.lcargando.ctlSpinner(false);
          // this.vmButtons = [];
          this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle);
        } else {
          this.lcargando.ctlSpinner(false);
          this.getExpedientes()
        }
      },
      (err: any) => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }

  consultar() {
    Object.assign(this.paginate, {page: 1, pageIndex: 0})
    this.paginator.firstPage()
    this.getExpedientes()
  }

  getExpedientes() {
    this.msgSpinner = 'Cargando Expedientes'
    this.lcargando.ctlSpinner(true)
    this.apiService.getExpedientes({ params: {filter: this.filter, paginate: this.paginate} }).subscribe(
      (res: any) => {
        // console.log(res.data)
        if (Array.isArray(res.data) && !res.data.length) {
          this.paginate.length = 0
          this.expedientes = []
          this.lcargando.ctlSpinner(false)
          return;
        }
        
        this.paginate.length = res.data.total
        this.expedientes = res.data.data
       /*  if (res.data.current_page == 1) {
          this.expedientes = res.data.data
        } else {
          this.expedientes = Object.values(res.data.data)
        } */
        this.expedientes.forEach((e: any) => {
          if (e.fecha_recepcion) {
            Object.assign(e, {'vencimiento': moment().diff(moment(e.fecha_recepcion), 'days')})
          }
        })
        this.lcargando.ctlSpinner(false)
      },
      (err: any) => {
        console.log(err)
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Expedientes')
      }
    )
  }

  changePaginate({pageSize, pageIndex}) {
    Object.assign(this.paginate, {perPage: pageSize, page: pageIndex + 1});
    this.getExpedientes();
  }

  expandDetalles(expediente: any) {
    const modal  = this.modalService.open(ModalDetallesComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
    modal.componentInstance.expediente = expediente
  }

  limpiarFiltros() {
    Object.assign(this.filter, {
      contribuyente: null,
      fecha_desde: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
      fecha_hasta: moment().endOf('month').format('YYYY-MM-DD'),
    });
  }
}
