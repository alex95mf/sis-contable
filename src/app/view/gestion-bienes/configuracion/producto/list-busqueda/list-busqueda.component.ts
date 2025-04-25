import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { ProductoService } from '../producto.service'; 

import moment from 'moment';
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as myVarGlobals from "../../../../../global";

@Component({
  selector: 'app-list-busqueda',
  templateUrl: './list-busqueda.component.html',
  styleUrls: ['./list-busqueda.component.scss']
})
export class ListBusquedaComponent implements OnInit {

  mensajeSppiner: string = "Cargando...";
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

  constructor(
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private commonVrs: CommonVarService,
    private apiSrv: ProductoService
  ) { }
  ngOnInit(): void {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.vmButtons = [
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
      codigoData: null,
      nameData: null,
      numero_ingreso_bodega: undefined,
      filterControl: ""
    }
    this.paginate = {
      length: 0,
      perPage: 7,
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
        this.activeModal.close();
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

  cargarDocumentos(flag: boolean = false) {
    this.mensajeSppiner = "Cargando listado de productos...";
    this.lcargando.ctlSpinner(true);
   // console.log(this.subgrupo)
   if (flag) this.paginate.page = 1
    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate,
      },
    }
    this.apiSrv.getAllProducts(data).subscribe(
      (res) => {
        console.log(res);
        this.paginate.length = res['data']['total'];
        this.documentosDt = res['data']['data'];
        
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
      codigoData: undefined,
      nameData: undefined,
      numero_ingreso_bodega: undefined,
      fecha_desde: moment(this.primer_dia).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.ultimo_dia).format('YYYY-MM-DD'),
      filterControl: ""
    }


    
  }

  selectOption(data: any) {

    // this.closeModal(data);
    data['validacion'] = this.validate
    this.commonVrs.selectProducto.next(data);
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

  closeModal(data?: any) {
    
    this.activeModal.dismiss();
  }


}
