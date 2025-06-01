import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { ComprasService } from '../compras.service';

import * as moment from 'moment';
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as myVarGlobals from "../../../../global";import { MatPaginator } from '@angular/material/paginator';
import Botonera from 'src/app/models/IBotonera';
;

@Component({
standalone: false,
  selector: 'app-modal-compras',
  templateUrl: './modal-compras.component.html',
  styleUrls: ['./modal-compras.component.scss']
})
export class ModalComprasComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  dataUser: any;

  @Input() module_comp: any;
  @Input() permissions: any;
  @Input() verifyRestore: any;

  vmButtons: Botonera[] = [];
  documentosDt: any = [];
  paginate = {
    length: 0,
    perPage: 5,
    page: 1,
    pageIndex: 0,
    pageSizeOptions: [5, 10]
  };

  filter = {
    razon_social: null,
    num_documento: null,
    tipo: null,
    estado: 'A',
    fecha_desde: moment().startOf('month').format('YYYY-MM-DD'),
    fecha_hasta: moment().format('YYYY-MM-DD'),
    filterControl: ""
  };

  lst_estados = [
    {value: 'A', label: 'Activo'},
    {value: 'X', label: 'Anulado'},
  ]

  primer_dia: any;
  ultimo_dia: any;
  hoy: any;
  dia_siguiente: any;
  tipoSelected = 0

  tipoOrden = [
    {valor: "PC",descripcion: "PROCESO DE COMPRAS"},
    {valor: "CCH",descripcion: "CAJA CHICA"},
    {valor: "AE",descripcion: "ANTICIPO A EMPLEADOS"},
    {valor: "OT",descripcion: "OTROS"},
  ]

  constructor(
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private commonVrs: CommonVarService,
    private apiSrv: ComprasService
  ) { }

  ngOnInit(): void {

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    this.vmButtons = [
      { orig: 'btnListRecDocumento', paramAccion: '', boton: {icon: 'far fa-search', texto: 'CONSULTAR'}, clase: 'btn btn-sm btn-primary', permiso: true, showbadge: false, showimg: true, showtxt: true, habilitar: false },
      { orig: 'btnListRecDocumento', paramAccion: '', boton: {icon: 'far fa-eraser', texto: 'LIMPIAR'}, clase: 'btn btn-sm btn-warning', permiso: true, showbadge: false, showimg: true, showtxt: true, habilitar: false },
      {
        orig: "btnListRecDocumento",
        paramAccion: "",
        boton: {icon: "fas fa-chevron-left", texto: " REGRESAR" },
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
    this.primer_dia = new Date(this.hoy.getFullYear(),this.hoy.getMonth(), 1);
    this.ultimo_dia = new Date(this.hoy.getFullYear(),this.hoy.getMonth() + 1, 0);

    setTimeout(()=> {
      this.cargarComprasGeneradas();
    }, 0);

  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.closeModal();
        break;
      case "CONSULTAR":
        this.consultar()
        break;
      case "LIMPIAR":
        this.limpiarFiltros()
        break;
    }
  }

  changePaginate({pageIndex, pageSize}) {
    Object.assign(this.paginate, {page: pageIndex + 1, perPage: pageSize});
    this.cargarComprasGeneradas();
  }
  asignarTipo(evt) {
    this.filter.tipo = [evt]
   }

   consultar() {
    Object.assign(this.paginate, { page: 1, pageIndex: 0 })
    this.paginator.firstPage()
    this.cargarComprasGeneradas()
   }

   cargarComprasGeneradas(){
    this.mensajeSppiner = "Cargando lista de compras...";
    this.lcargando.ctlSpinner(true);

    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate,
      },

    }

    this.apiSrv.getComprasGeneradas(data).subscribe(
      (res: any) => {

      console.log(res);
        this.documentosDt = res.data.data
        this.paginate.length = res.data.total
        /* if (res['data']['current_page'] == 1) {
          this.documentosDt = res['data']['data'];
        } else {
          this.documentosDt = Object.values(res['data']['data']);
        } */
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
      razon_social: null,
      num_documento: null,
      tipo: null,
      estado: 'A',
      fecha_desde: moment().startOf('month').format('YYYY-MM-DD'),
      fecha_hasta: moment().format('YYYY-MM-DD'),
      filterControl: ""
    }
    this.tipoSelected = 0
  }

  selectOption(data) {
    if (this.verifyRestore) {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "¿Seguro que desea visualizar esta compra? Los campos llenados y cálculos realizados serán reiniciados.",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        cancelButtonColor: '#F86C6B',
        confirmButtonColor: '#4DBD74',
      }).then((result) => {
        if (result.isConfirmed) {
          this.closeModal(data);
        }
      });
    } else {
      this.closeModal(data);
    }
  }

  closeModal(data?:any) {
    if(data){
      this.apiSrv.listaCompras$.emit(data)
     // this.commonVrs.selectRecDocumentoOrden.next(data);
    }
    this.activeModal.dismiss();
  }

}
