import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { MantenimientoService } from '../mantenimiento.service';

import moment from 'moment';
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as myVarGlobals from "../../../../../global";

@Component({
standalone: false,
  selector: 'app-list-busqueda',
  templateUrl: './list-busqueda.component.html',
  styleUrls: ['./list-busqueda.component.scss']
})
export class ListBusquedaComponent implements OnInit {

  
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  dataUser: any;
  @Input() module_comp: any;
  @Input() permissions: any;
  @Input() verifyRestore: any;
  @Input() validate: any;
  @Input() subgrupo:any;
  vmButtons: any;
  documentosDt: any = [];
  paginate: any;
  filter: any;
  primer_dia: any;
  ultimo_dia: any;
  hoy: any;
  dia_siguiente: any;
  estado: any = [
    {valor:'P',descripcion: 'Pendiente'},
    {valor:'C',descripcion: 'Carrado'}
  ]


  constructor(
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private commonVrs: CommonVarService,
    private apiSrv: MantenimientoService
  ) { }
  ngOnInit(): void {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.vmButtons = [
      {
        orig: "btnListRecDocumento",
        paramAction: "",
        boton: { icon: "fas fa-search", texto: " CONSULTAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnListRecDocumento",
        paramAction: "",
        boton: { icon: "fas fa-eraser", texto: " LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnListRecDocumento",
        paramAction: "",
        boton: { icon: "fas fa-chevron-left", texto: " REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ]
    this.hoy = new Date();
    this.dia_siguiente = new Date(this.hoy);
    this.dia_siguiente.setDate(this.dia_siguiente.getDate() + 1);
    this.primer_dia = new Date(this.hoy.getFullYear(), this.hoy.getMonth(), 1);
    this.ultimo_dia = new Date(this.hoy.getFullYear(), this.hoy.getMonth() + 1, 0);
    this.filter = {

      // fecha_desde: moment(this.primer_dia).format('YYYY-MM-DD'),
      // fecha_hasta: moment(this.ultimo_dia).format('YYYY-MM-DD'),
      fecha_desde: moment(this.primer_dia).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.ultimo_dia).format('YYYY-MM-DD'),
      estado: undefined,
      num_documento: undefined,
      filterControl: ""
    }
    this.paginate = {
      length: 0,
      perPage: 5,
      page: 1,
      pageSizeOptions: [5, 10]
    }
    setTimeout(() => {
      this.cargarDocumentos();
    }, 50);
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.closeModal();
        break;
        case " CONSULTAR":
          this.cargarDocumentos();
          break;
          case " LIMPIAR":
            this.limpiarFiltros();
            break;
    }
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarDocumentos();
  }

  cargarDocumentos() {
    (this as any).mensajeSpinner = "Cargando listado de productos...";
    this.lcargando.ctlSpinner(true);
   // console.log(this.subgrupo)

    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate,
      },
    }
    this.apiSrv.getMantenimiento(data).subscribe(
      (res) => {
        console.log(res);
        this.documentosDt = res['data'];
        this.paginate.length = res['data']['total'];
        if (res['data']['current_page'] == 1) {
          this.documentosDt = res['data']['data'];
        } else {
          this.documentosDt = Object.values(res['data']['data']);
        }
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  limpiarFiltros() {
    this.filter = {
      num_documento: undefined,
      fecha_desde: moment(this.primer_dia).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.ultimo_dia).format('YYYY-MM-DD'),
      estado: undefined,
      filterControl: ""
    }
  }

  selectOption(data: any) {

    this.closeModal(data);
    data['validacion'] = this.validate
    this.commonVrs.selectPrestamo.next(data);
    this.closeModal()
    // console.log("aquii")
    // console.log(data);

      // Swal.fire({
      //   icon: "warning",
      //   title: "¡Atención!",
      //   text: "¿Seguro que desea visualizar este prodcuto? Los campos llenados y cálculos realizados serán reiniciados.",
      //   showCloseButton: true,
      //   showCancelButton: true,
      //   showConfirmButton: true,
      //   cancelButtonText: "Cancelar",
      //   confirmButtonText: "Aceptar",
      //   cancelButtonColor: '#F86C6B',
      //   confirmButtonColor: '#4DBD74',
      // }).then((result) => {
      //   if (result.isConfirmed) {
      //     this.closeModal(data);
      //     data['validacion'] = this.validate
      //     this.commonVrs.selectProducto.next(data);
      //     this.closeModal()
      //     // console.log("aquii")
      //     // console.log(data);
      //   }
      // });

  }

  closeModal(data?: any) {

    this.activeModal.dismiss();
  }


}
