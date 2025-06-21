import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { FormRentasService } from '../form-rentas.service';

import * as myVarGlobals from 'src/app/global';
import moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { MatPaginator } from '@angular/material/paginator';

@Component({
standalone: false,
  selector: 'app-modal-inspecciones',
  templateUrl: './modal-inspecciones.component.html',
  styleUrls: ['./modal-inspecciones.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalInspeccionesComponent implements OnInit {
  
  @ViewChild(CcSpinerProcesarComponent,{ static: false })
  lcargando: CcSpinerProcesarComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator

  @Input() permisos: any;

  fTitle: any;
  vmButtons: any = [];
  dataUser: any;

  filter: any = {
    razon_social: undefined,
    fecha_desde: moment().startOf('month').format('YYYY-MM-DD'),
    fecha_hasta: moment().format('YYYY-MM-DD'),
    numero_orden: undefined,
    estado: undefined,
    filterControl: ""
  };
  paginate: any = {
    length: 0,
    perPage: 8,
    page: 1,
    pageIndex: 0
  };

  today: any;
  tomorrow: any;
  firstday: any;
  lastday:any;

  inspeccionesDt: any[] = [];

  listaEstados: any = [
    {
      value: "A",
      label: "Abierto",
    },
    {
      value: "C",
      label: "Cerrado",
    },
    {
      value: "P",
      label: "Pendiente",
    },
  ];

  constructor(
    private modal: NgbActiveModal,
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private commonVarSrv: CommonVarService,
    private formSrv: FormRentasService
  ) {
    this.vmButtons = [
      {
        orig: "btnInspecciones",
        paramAction: "",
        boton: {icon: "fas fa-search", texto: "CONSULTAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnInspecciones",
        paramAction: "",
        boton: {icon: "fas fa-eraser", texto: "LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnInspecciones",
        paramAction: "",
        boton: {icon: "fas fa-chevron-left", texto: "REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ];

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
  }

  ngOnInit(): void {

    setTimeout(()=>{
      this.cargarInspecciones();
    },0)

  }

  cargarInspecciones() {
    (this as any).mensajeSpinner = "Cargando inspecciones...";
    this.lcargando.ctlSpinner(true);

    // if (this.filter.numero_orden == "" || this.filter.razon_social == "") {
    //   this.limpiarFiltros();
    // }

    let data = {
      params: {
        tipo_inspeccion: "RENTAS",
        filter: this.filter,
        paginate: this.paginate,
      }
    };

    this.formSrv.getInspecciones(data).subscribe(
      (res: any) => {
        // console.log(res);
        // this.inspeccionesDt = res ['data'];
        this.paginate.length = res['data']['total'];
        this.inspeccionesDt = (res.data.current_page == 1) ? res.data.data : Object.values(res.data.data)
        
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        console.log(error);
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );

  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "REGRESAR":
        this.closeModal();
        break;
      case "CONSULTAR":
        this.consultar();
        break;
      case "LIMPIAR":
        this.limpiarFiltros();
        break;
    }
  }

  selectInspeccion(data) {
    this.closeModal(data);
  }

  cargarTodo(dt) {
    (this as any).mensajeSpinner = "Cargando datos de la inspeccion...";
    this.lcargando.ctlSpinner(true);


    let data = {
      inspeccion: {
        id: dt.fk_orden
      },
      module: this.permisos.id_modulo,
    }

    this.formSrv.cargarInspeccionCompleta(data).subscribe(
      (res) => {
        // console.log(res['data']);
        this.commonVarSrv.getInspeccionCompleta.next(res['data']);
        this.lcargando.ctlSpinner(false);
        this.modal.close();
      },
      (error) => {
        console.log(error);
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
        // this.modal.close();
      }
    )
  }

  limpiarFiltros() {
    this.filter = {
      razon_social: undefined,
      fecha_desde: moment().startOf('month').format('YYYY-MM-DD'),
      fecha_hasta: moment().format('YYYY-MM-DD'),
      numero_orden: undefined,
      estado: undefined,
      filterControl: ""
    };
  }

  changePaginate({pageIndex}) {
    Object.assign(this.paginate, {page: pageIndex + 1});
    this.cargarInspecciones();
  }

  consultar() {
    Object.assign(this.paginate, {page: 1, pageIndex: 0})
    this.paginator.firstPage()
    this.cargarInspecciones()
  }

  closeModal(data?: any) {
    if(data){
      this.commonVarSrv.selectInspeccionRentas.next(data);
    }
    this.modal.dismiss();
  }

}

