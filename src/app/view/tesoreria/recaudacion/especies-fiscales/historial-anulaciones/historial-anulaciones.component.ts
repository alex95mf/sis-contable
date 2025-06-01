import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { EspeciesFiscalesService } from '../especies-fiscales.service';

@Component({
  selector: 'app-historial-anulaciones',
  templateUrl: './historial-anulaciones.component.html',
  styleUrls: ['./historial-anulaciones.component.scss']
})
export class HistorialAnulacionesComponent implements OnInit {

  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, {static:false})
  lcargando: CcSpinerProcesarComponent;

  @Input() data: any;

  fTitle = "Historial de anulaciones de especies fiscales"

  historialAnulaciones: any = [];

  paginate: any;
  filter: any;

  vmButtons: any;

  today: any;
  firstday: any;
  tomorrow: any;
  lastday: any;

  constructor(
    private modal: NgbActiveModal,
    private service: EspeciesFiscalesService,
    private toastr: ToastrService,
    private modalDet: NgbModal,
    private commonVarSrv: CommonVarService
  ) { }

  ngOnInit(): void {

    this.vmButtons = [
      
      {
        orig: "btnsConfiguracionContable",
        paramAccion: "",
        boton: { icon: "fas fa-chevron-left", texto: " CRERRAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
    ]

    this.today = new Date();
    this.firstday = moment(this.today).startOf('month').format('YYYY-MM-DD')
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    //this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
    this.lastday = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0); 

    this.filter = {
      fecha_desde: undefined,
      fecha_hasta: undefined,
      filterControl: "",
    };



    // TODO: Habilitar codigo en Backend

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10, 20, 50]
    };

    setTimeout(() => {
      this.getHistorialAnulaciones()
    }, 500);
  }


  getHistorialAnulaciones(){
    this.mensajeSppiner = "Cargando listado de Configuracion Contable...";
    this.lcargando.ctlSpinner(true);
    let data = {
      id: this.data.id_especie_fiscal,
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }
    this.service.getanulacionEspeciesfiscales(data).subscribe(
      (res)=>{
        this.paginate.length = res['data']['total'];
        if(res['data']['current_page'] == 1){
          this.historialAnulaciones = res['data']['data'];
        }else{
          this.historialAnulaciones = Object.values(res['data']['data']);
        }
        this.lcargando.ctlSpinner(false);

      },(error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )
  }


  metodoGlobal(event) {
    switch (event.items.boton.texto) {

      case " CRERRAR":
        this.modal.close();
      break;
      
    }
  }


  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    // this.cargarEspeciesFiscales('');
  }

}
