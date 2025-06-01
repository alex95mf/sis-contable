import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ConsultaConvenioService } from './consulta-convenio.service';

@Component({
  selector: 'app-consulta-convenio',
  templateUrl: './consulta-convenio.component.html',
  styleUrls: ['./consulta-convenio.component.scss']
})
export class ConsultaConvenioComponent implements OnInit {

  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  filter: any;
  paginate: any;

  primer_dia: any;
  ultimo_dia: any;
  hoy: any;
  dia_siguiente: any;

  documentosDt: any = []

  estado = [
    {valor: 'A', descripcion: 'Aprobado'},
    {valor: 'E', descripcion: 'Emitido'},
    {valor: 'X', descripcion: 'Anulado'},
  ]

  tipoDeuda = [
    {valor: 'CO', descripcion: 'Deuda'},
    {valor: 'COTE', descripcion: 'Terreno'},

  ]

  constructor(
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    // private commonSrv: CommonService,
    private commonVrs: CommonVarService,
    private apiSrv: ConsultaConvenioService
  ) { }

  ngOnInit(): void {

    this.hoy = new Date();
    this.dia_siguiente = new Date(this.hoy);
    this.dia_siguiente.setDate(this.dia_siguiente.getDate() + 1);
    this.primer_dia = new Date(this.hoy.getFullYear(),this.hoy.getMonth(), 1);
    this.ultimo_dia = new Date(this.hoy.getFullYear(),this.hoy.getMonth() + 1, 0);

    this.filter = {
      estado: undefined,
      tipo_deuda: undefined,
      razon_social: undefined,
      num_documento: undefined,
      fecha_desde: moment(this.primer_dia).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.ultimo_dia).format('YYYY-MM-DD'),
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10]
    }

    // setTimeout(()=> {
    //   this.cargarDocumentos();
    // }, 0);
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarDocumentos();
  }


  limpiarFiltros() {
    this.filter = {
      estado: undefined,
      tipo_deuda: undefined,
      razon_social: undefined,
      num_documento: undefined,
      fecha_desde: moment(this.primer_dia).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.ultimo_dia).format('YYYY-MM-DD'),
      filterControl: ""
    }
  }


  cargarDocumentos(){
    this.mensajeSppiner = "Cargando lista de documentos de pago...";
    this.lcargando.ctlSpinner(true);

    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate,
      },

    }

    this.apiSrv.getRecDocumentos(data).subscribe(
      (res) => {

        console.log(res);

        this.documentosDt = res['data'];
        this.paginate.length = res['data']['total'];
        if (res['data']['current_page'] == 1) {
          this.documentosDt = res['data']['data'];

          // this.documentosDt['fecha_fin'] =  this.documentosDt['detalles'][ res['data']['data']['detalles'].length - 1]['fecha_plazo_maximo'].split(' ')[0];
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

}
