import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { GeneracionIcpService } from '../generacion-icp.service';

import * as moment from 'moment';
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as myVarGlobals from "../../../../../global";

@Component({
standalone: false,
  selector: 'app-list-rec-documentos',
  templateUrl: './list-rec-documentos.component.html',
  styleUrls: ['./list-rec-documentos.component.scss']
})
export class ListRecDocumentosComponent implements OnInit {

  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  dataUser: any;

  @Input() module_comp: any;
  @Input() permissions: any;
  @Input() verifyRestore: any;

  vmButtons: any;
  documentosDt: any = [];
  paginate: any;
  filter: any;

  primer_dia: any;
  ultimo_dia: any;
  hoy: any;
  dia_siguiente: any;
  estadoSelected = 0

   estadoList = [
    {value: "T",label: "TODOS"},
    {value: "E",label: "Emitido"},
    {value: "A",label: "Aprobado"},
    {value: "C",label: "Comprometido"},
    {value: "P",label: "Pagado"},
    {value: "D",label: "Devengado"},
    {value: "X",label: "Anulado"}
  ]


  constructor(
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private commonVrs: CommonVarService,
    private apiSrv: GeneracionIcpService
  ) { }

  ngOnInit(): void {

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    this.vmButtons = [
      {
        orig: "btnListRecDocumento",
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


    this.hoy = new Date();
    this.dia_siguiente = new Date(this.hoy);
    this.dia_siguiente.setDate(this.dia_siguiente.getDate() + 1);
    this.primer_dia = new Date(this.hoy.getFullYear(),this.hoy.getMonth(), 1);
    this.ultimo_dia = new Date(this.hoy.getFullYear(),this.hoy.getMonth() + 1, 0);


    this.filter = {
      razon_social: undefined,
      num_documento: undefined,
      observacion: undefined,
      fecha_desde: moment(this.primer_dia).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.ultimo_dia).format('YYYY-MM-DD'),
      estado:'T',
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 5,
      page: 1,
      pageSizeOptions: [5, 10]
    }

    setTimeout(()=> {
      this.cargarDocumentos();
    }, 50);

  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " REGRESAR":
        this.closeModal();
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
  asignarEstado(evt) {
    this.filter.estado = evt
   }

  cargarDocumentos(){
    this.mensajeSpinner = "Cargando lista de documentos de cobro...";
    this.lcargando.ctlSpinner(true);

    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate,
      },
      codigo: "ICP"
    }

    this.apiSrv.getGeneracionIdp(data).subscribe(
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
    this.estadoSelected = 0
    this.filter = {
      razon_social: undefined,
      num_documento: undefined,
      observacion: undefined,
      fecha_desde: moment(this.primer_dia).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.ultimo_dia).format('YYYY-MM-DD'),
      estado:'T',
      filterControl: ""
    }
  }

  selectOption(data) {
    if (this.verifyRestore) {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "¿Seguro que desea visualizar este Documento de pago? Los campos llenados y cálculos realizados serán reiniciados.",
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
      this.commonVrs.selectRecDocumento.next(data);
    }
    this.activeModal.dismiss();
  }


}
