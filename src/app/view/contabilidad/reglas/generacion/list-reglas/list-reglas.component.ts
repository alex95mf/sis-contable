import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { GeneracionService } from '../generacion.service'; 

import moment from 'moment';
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as myVarGlobals from "../../../../../global";

@Component({
  selector: 'app-list-reglas',
  templateUrl: './list-reglas.component.html',
  styleUrls: ['./list-reglas.component.scss']
})
export class ListReglasComponent implements OnInit {

  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  dataUser: any;

  @Input() module_comp: any;
  @Input() permissions: any;
  @Input() verifyRestore: any;
 

  vmButtons: any;
  reglasDt: any = [];
  paginate: any;
  filter: any;
  tipoRegla: any = [];

  primer_dia: any;
  ultimo_dia: any;
  hoy: any;
  dia_siguiente: any;
  tipoReglaSelected = 0
  
  tipoCodigoList = [
    {value: "CON",label: "Contable"},
    {value: "PRE",label: "Presupuesto"}
  ]

  constructor(
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonSrv: CommonService,
    private commonVrs: CommonVarService,
    private apiSrv: GeneracionService
  ) { }

  ngOnInit(): void {

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    this.vmButtons = [
      {
        orig: "btnListReglas",
        paramAction: "",
        boton: {icon: "fas fa-chevron-left", texto: " Regresar" },
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
      tipo_regla: undefined,
      tipo_codigo: undefined,
      tipo: undefined,
      descripcion:"",
      numero_regla: "",
      codigo_presupuesto: "",
      codigo_cuenta_contable: "",
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 5,
      page: 1,
      pageSizeOptions: [5, 10]
    }
    console.log(this.tipoRegla)
    
    setTimeout(()=> {
      this.cargarReglas();
      this.getCatalogos();
    }, 0);

  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case " Regresar":
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
    this.cargarReglas();
  }
  asignarTipo(evt) {
    this.filter.tipo = [evt]
   }
   getCatalogos() {
    let data = {
      params: "'CON_TIPO_REGLA'",
      //params: "'OP_CONCEPTOS','PAG_TIPO_DESEMBOLSO'",
    };
    this.mensajeSppiner = "Buscando tipo de regla...";
    this.lcargando.ctlSpinner(true);
    this.apiSrv.getCatalogo(data).subscribe(

      (res) => {
        this.tipoRegla = res["data"]['CON_TIPO_REGLA'];
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }
 

   cargarReglas(flag: boolean = false){
    this.mensajeSppiner = "Cargando lista de reglas...";
    this.lcargando.ctlSpinner(true);

    if (flag) this.paginate.page = 1 
    
    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate,
      },
      codigo: "OP"
    }

    this.apiSrv.getReglas(data).subscribe(
      (res) => {
        if(res['data']['data'].length > 0){
          this.reglasDt = res['data']['data'];
          this.paginate.length = res['data']['total'];
          console.log(this.reglasDt)
          console.log(this.reglasDt[0]['detalles'])
          this.lcargando.ctlSpinner(false);
        }else{
          this.reglasDt = []
          this.lcargando.ctlSpinner(false);
        }
        
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }
  onlyNumber(event): boolean {
    let key = (event.which) ? event.which : event.keyCode;
    if (key > 31 && (key < 48 || key > 57)) {
      return false;
    }
    return true;
  }

  limpiarFiltros() {
    this.filter = {
      tipo_regla: undefined,
      tipo_codigo: undefined,
      tipo: undefined,
      descripcion:"",
      filterControl: ""
    }
    this.tipoReglaSelected = 0
  }

  selectOption(data) {
    if (this.verifyRestore) {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "¿Seguro que desea visualizar esta regla? Los campos llenados y cálculos realizados serán reiniciados.",
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
      this.apiSrv.listaReglas$.emit(data)
    }
    this.activeModal.dismiss();
  }

}
