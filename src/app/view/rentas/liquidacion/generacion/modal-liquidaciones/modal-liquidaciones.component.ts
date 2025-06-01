import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { GeneracionService } from '../generacion.service';
import * as moment from 'moment';

@Component({
standalone: false,
  selector: 'app-modal-liquidaciones',
  templateUrl: './modal-liquidaciones.component.html',
  styleUrls: ['./modal-liquidaciones.component.scss']
})
export class ModalLiquidacionesComponent implements OnInit {

  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, {static:false}) 
  lcargando: CcSpinerProcesarComponent;

  dataUser: any;

  vmButtons: any;
  liquidacionesDt: any = [];
  paginate: any;
  filter: any;

  today: any;
  tomorrow: any;
  firstday: any;
  lastday:any;

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private commonVarSrv: CommonVarService,
    private generacionSrv: GeneracionService,
  ) { }

  ngOnInit(): void {

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    this.vmButtons = [
      {
        orig: "btnListLiqRen",
        paramAction: "",
        boton: {icon: "fas fa-chevron-left", texto: " REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      }
    ]

    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
    this.lastday = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0);

    this.filter = {
      razon_social: undefined,
      fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      num_documento: undefined,
      estado: ["A"],
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 5,
      page: 1,
      pageSizeOptions: [5, 10]
    }

    setTimeout(()=> {
      this.cargarLiquidaciones();
    }, 0);

  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.closeModal();
        break;
    }
  }

  cargarLiquidaciones() {
    this.mensajeSppiner = "Cargando lista de Liquidaciones...";
    this.lcargando.ctlSpinner(true);

    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate,
      }
    }

    this.generacionSrv.getLiquidacionEmision(data).subscribe(
      (res) => {
        this.liquidacionesDt = res ['data'];
        this.paginate.length = res['data']['total'];
        if (res['data']['current_page'] == 1) {
          this.liquidacionesDt = res['data']['data'];
        } else {
          this.liquidacionesDt = Object.values(res['data']['data']);
        }
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarLiquidaciones();
  }

  limpiarFiltros() {
    this.filter.razon_social = undefined,
    this.filter.fecha_desde = moment(this.firstday).format('YYYY-MM-DD'),
    this.filter.fecha_hasta = moment(this.today).format('YYYY-MM-DD'),
    this.filter.num_documento = undefined,
    this.filter.estado = ["A"],
    this.filter.filterControl = ""
  }

  selectOption(liq){
    this.closeModal(liq);
  }

  closeModal(liq?: any) {
    if(liq){
      this.mensajeSppiner = 'Obteniendo Liquidacion...';
      this.lcargando.ctlSpinner(true);
      
      this.generacionSrv.getLiquidacionCompleta(liq.id_liquidacion).subscribe(
        res => {
          this.lcargando.ctlSpinner(false);
          let data = {
            contr: liq.contribuyente,
            liquidacion: res['data']
          }
          this.commonVarSrv.editLiquidacion.next(data);
          this.activeModal.close();
        },
        err => {
          this.lcargando.ctlSpinner(false)
          this.toastr.error(err.error.message, 'Error obteniendo Liquidacion')
        }
      )
    } else {
      this.activeModal.dismiss();  
    }
     
  }

}
