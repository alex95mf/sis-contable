import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { ParametrosService } from '../parametros.service';

import moment from 'moment';
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as myVarGlobals from "../../../../../global";

@Component({
  selector: 'app-consulta-parametros',
  templateUrl: './consulta-parametros.component.html',
  styleUrls: ['./consulta-parametros.component.scss']
})
export class ConsultaParametrosComponent implements OnInit {
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
  tipoSelected = 0

  constructor(private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private commonVrs: CommonVarService,
    private apiSrv: ParametrosService) { }

  ngOnInit(): void {

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    this.vmButtons = [
      {
        orig: "btnParametros",
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
      tipo_documento: '',
      codigo: '',
      desdcripcion: '',
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 5,
      page: 1,
      pageSizeOptions: [5, 10]
    }
    
    setTimeout(()=> {
      this.cargarParametros();
    }, 0);
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
    this.cargarParametros();
  }
  asignarTipo(evt) {
    this.filter.tipo = [evt]
   }

   cargarParametros(flag: boolean = false){
    this.mensajeSppiner = "Cargando Configuraciones de Parametros...";
    this.lcargando.ctlSpinner(true);

    if (flag) this.paginate.page = 1 
    
    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate,
      },
      
    }
    this.apiSrv.getConfigParametros(data).subscribe(
      (res: any) => {

        this.documentosDt = res.data.data;
        this.paginate.length = res.data.total;
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
      tipo_documento: '',
      codigo: '',
      desdcripcion: '',
      filterControl: ""
    }
    
  }

  selectOption(data) {
    
      this.closeModal(data);
    
  }

  closeModal(data?:any) {
    if(data){
      this.apiSrv.listaParametros$.emit(data)
    }
    this.activeModal.dismiss();
  }


}
