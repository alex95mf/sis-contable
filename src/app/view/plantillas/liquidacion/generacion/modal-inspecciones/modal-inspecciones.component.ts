import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { GeneracionService } from '../generacion.service';

import * as myVarGlobals from 'src/app/global';
import * as moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
standalone: false,
  selector: 'app-modal-inspecciones',
  templateUrl: './modal-inspecciones.component.html',
  styleUrls: ['./modal-inspecciones.component.scss']
})
export class ModalInspeccionesComponent implements OnInit {
  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent,{ static: false })
  lcargando: CcSpinerProcesarComponent;

  @Input() permissions: any;
  @Input() contribuyente: any;

  fTitle: any;
  vmButtons: any = [];
  dataUser: any;

  filter: any;
  paginate: any;

  today: any;
  tomorrow: any;
  firstday: any;
  lastday:any;

  inspeccionesDt: any;

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
    private generacionSrv: GeneracionService
  ) { }

  ngOnInit(): void {

    this.vmButtons = [
      {
        orig: "btnInspecciones",
        paramAction: "",
        boton: {icon: "fas fa-chevron-left", texto: " REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ];

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
    this.lastday = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0);

    this.filter = {
      razon_social: undefined,
      fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      numero_orden: undefined,
      estado: undefined,
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [2, 5, 10, 20, 50]
    }

    setTimeout(()=>{
      this.cargarInspecciones();
    },0)

  }

  cargarInspecciones() {
    this.mensajeSpinner = "Cargando inspecciones...";
    this.lcargando.ctlSpinner(true);

    let data = {
      contribuyente: this.contribuyente,
      params: {
        tipo_inspeccion: "RENTAS",
        // filter: this.filter,
        // paginate: this.paginate
      }

    }

    this.generacionSrv.getInspecciones(data).subscribe(
      (res) => {
        console.log(res);

        this.inspeccionesDt = res['data']['ordenes_inspeccion'];
        /*this.paginate.length = res['data']['total'];
        if (res['data']['current_page'] == 1) {
          this.inspeccionesDt = res['data']['data'];
        } else {
          this.inspeccionesDt = Object.values(res['data']);
        }*/
        console.log(this.inspeccionesDt);
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )

  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.closeModal();
        break;
    }
  }

  selectInspeccion(data) {
    this.closeModal(data);
  }

  limpiarFiltros() {

  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarInspecciones();
  }

  closeModal(data?: any) {
    if(data){
      this.commonVarSrv.selectInspeccionRentas.next(data);
    }
    this.modal.dismiss();
  }

}

