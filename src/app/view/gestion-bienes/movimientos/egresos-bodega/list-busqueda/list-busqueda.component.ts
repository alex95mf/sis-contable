import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { EgresosBodegaService } from '../egresos-bodega.service';

import * as moment from 'moment';
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as myVarGlobals from "../../../../../global";
import { MatPaginator } from '@angular/material/paginator';

@Component({
standalone: false,
  selector: 'app-list-busqueda',
  templateUrl: './list-busqueda.component.html',
  styleUrls: ['./list-busqueda.component.scss']
})
export class ListBusquedaComponent implements OnInit {

  
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator

  dataUser: any;
  @Input() module_comp: any;
  @Input() permissions: any;
  @Input() verifyRestore: any;
  @Input() validate: any;
  @Input() subgrupo:any;
  @Input() bodega: number;
  @Input() tipo_bien: string
  vmButtons: any;
  documentosDt: any = [];
  paginate: any;
  filter: any;
  primer_dia: any;
  ultimo_dia: any;
  hoy: any;
  dia_siguiente: any;

  constructor(
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private commonVrs: CommonVarService,
    private apiSrv: EgresosBodegaService
  ) { }
  ngOnInit(): void {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.vmButtons = [
      {
        orig: "btnListRecDocumento",
        paramAction: "",
        boton: { icon: "fas fa-search", texto: "CONSULTAR" },
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
        boton: { icon: "fas fa-eraser", texto: "LIMPIAR" },
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
        boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      },
    ]
    this.hoy = new Date();
    this.dia_siguiente = new Date(this.hoy);
    this.dia_siguiente.setDate(this.dia_siguiente.getDate() + 1);
    this.primer_dia = new Date(this.hoy.getFullYear(), this.hoy.getMonth(), 1);
    this.ultimo_dia = new Date(this.hoy.getFullYear(), this.hoy.getMonth() + 1, 0);
    this.filter = {

      // fecha_desde: moment(this.primer_dia).format('YYYY-MM-DD'),
      // fecha_hasta: moment(this.ultimo_dia).format('YYYY-MM-DD'),
      codigoData: null,
      nameData: null,
      bodega: this.bodega,
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
      case "REGRESAR":
        this.activeModal.close();
        break;
      case "CONSULTAR":
        this.consultar();
        break;
      case "LIMPIAR":
        this.limpiarFiltros();
        break;
    }
  }

  changePaginate({pageIndex}) {
    Object.assign(this.paginate, {page: pageIndex + 1});
    this.cargarDocumentos();
  }

  consultar() {
    Object.assign(this.paginate, {page: 1, pageIndex: 0})
    this.paginator.firstPage()
    this.cargarDocumentos()
  }

  cargarDocumentos() {
    (this as any).mensajeSpinner = "Cargando listado de productos...";
    this.lcargando.ctlSpinner(true);
    // console.log(this.subgrupo)
    //let id = this.subgrupo.id_subgrupo_producto
    // let id = this.subgrupo.id_grupo_productos
    let data = {
      id_subgrupo: this.subgrupo?.id_grupo_productos,
      tipo_bien: this.tipo_bien,
      params: {
        filter: this.filter,
        paginate: this.paginate,
      },
    }
    // console.log(data, id)
    this.apiSrv.getProductosEX(data).subscribe(
      (res) => {
        console.log(res);
        this.documentosDt = res['data']['data'];
        this.paginate.length = res['data']['total'];
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

      // fecha_desde: moment(this.primer_dia).format('YYYY-MM-DD'),
      // fecha_hasta: moment(this.ultimo_dia).format('YYYY-MM-DD'),
      codigoData: null,
      nameData: null,
      bodega: this.bodega,
      filterControl: ""
    }


    // this.filter = {
    //   razon_social: undefined,
    //   num_documento: undefined,
    //   fecha_desde: moment(this.primer_dia).format('YYYY-MM-DD'),
    //   fecha_hasta: moment(this.ultimo_dia).format('YYYY-MM-DD'),
    //   filterControl: ""
    // }
  }

  selectOption(data: any) {

    // this.closeModal(data);
    // data['validacion'] = this.validate
    // this.commonVrs.selectProducto.next(data);
    this.apiSrv.listaProductos$.emit(data)
    this.activeModal.close()
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


}
