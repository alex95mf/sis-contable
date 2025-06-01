import { Component, OnInit, ViewChild,Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Botonera from 'src/app/models/IBotonera';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { SubrogacionService } from '../subrogacion.service';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-consulta-subrogacion',
  templateUrl: './modal-consulta-subrogacion.component.html',
  styleUrls: ['./modal-consulta-subrogacion.component.scss']
})
export class ModalConsultaSubrogacionComponent implements OnInit {
  mensajeSppiner: string = "Cargando...";
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
  objGetAccionPersonal: any = []
  totalRecords: number;

  constructor(
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private commonVrs: CommonVarService,
    private apiSrv: SubrogacionService
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
      nombre: '',
      fecha_desde: moment(this.primer_dia).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.ultimo_dia).format('YYYY-MM-DD'),
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
  this.mensajeSppiner = "Cargando lista de subrogaciones";
  this.lcargando.ctlSpinner(true);
  let data= {
    params: {
      filter: this.filter,
      paginate: this.paginate,
      
    }
  }
  console.log(data)
  this.apiSrv.consultaAccionPersonal(data).subscribe(
    (res: any) => {
       console.log(res);
       if(res.status==1){
        this.objGetAccionPersonal = res['data'];
        this.paginate.length = res['data']['total'];
        if (res['data']['current_page'] == 1) {
          this.objGetAccionPersonal = res['data']['data'];
        } else {
          this.objGetAccionPersonal = Object.values(res['data']['data']);
        }
        // this.objGetAccionPersonal = res.data.data;
        // this.totalRecords= res.data?.total[0]?.count
        this.lcargando.ctlSpinner(false);
       }
       else{
        this.lcargando.ctlSpinner(false);
       }
    },
    (err: any) => {
      console.log(err);
      this.lcargando.ctlSpinner(false);
    }
  )
  }

  limpiarFiltros() {
    this.filter = {
      nombre: undefined,
      fecha_desde: moment(this.primer_dia).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.ultimo_dia).format('YYYY-MM-DD'),
      filterControl: ""
    }
  }

  selectOption(data) {
    this.closeModal(data);
  }

  closeModal(data?: any) {
    if (data) {
      //this.commonVrs.selectRecDocumento.next(data);
      this.apiSrv.consultaSubrogacion$.emit(data)
      console.log(data);
    }
    this.activeModal.dismiss();
  }

  

}
