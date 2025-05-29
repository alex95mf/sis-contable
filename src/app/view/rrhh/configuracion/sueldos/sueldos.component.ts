import { Component, OnInit, ViewChild,Input, Output } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';

import Swal from 'sweetalert2/dist/sweetalert2.js';
import * as myVarGlobals from 'src/app/global';
import * as moment from 'moment';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { CommonService } from 'src/app/services/commonServices';
import { ToastrService } from 'ngx-toastr';
import { ButtonRadioActiveComponent } from 'src/app/config/custom/cc-panel-buttons/button-radio-active.component';
import { ExcelService } from 'src/app/services/excel.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonVarService } from 'src/app/services/common-var.services';
import { SueldosService } from './sueldos.service';
import { SueldoNuevoComponent } from './sueldo-nuevo/sueldo-nuevo.component';

@Component({
standalone: false,
  selector: 'app-sueldos',
  templateUrl: './sueldos.component.html',
  styleUrls: ['./sueldos.component.scss']
})
export class SueldosComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  fTitle: string = 'Sueldos'
  paginate: any;
  filter: any;
  grupoSelected:any;
  cargoSelected:any;
  tipoContratoSelected:any;
  estadoSelected:any;

  constructor(
    private modal: NgbModal,
    private commonVrs: CommonVarService,
    private apiSrv: SueldosService,
    private toastr: ToastrService,
  ) { 

    this.apiSrv.listaSueldos$.subscribe(
      (res) => {
        //console.log(res);
        if (res) {
          this.LoadTableSueldo();
        }
      }
    );

    this.filter = {
      grupo_ocupacional:0,
      codigo_sectorial:'',
      remuneracion:'',
      cargo:0,
      tipo_contrato:0,
      estado:0,
      filterControl: ""
    }

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10]
    }
  }

  @ViewChild(ButtonRadioActiveComponent, { static: false }) buttonRadioActiveComponent: ButtonRadioActiveComponent;

  vmButtons: any[] = []; 
 

  ngOnInit(): void {

    this.vmButtons = [
      { orig: "btnsTabla", boton: { icon: "fa fa-plus-square-o", texto: "NUEVO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: false, imprimir: false},
      // { orig: "btnsTabla", boton: { icon: "fa fa-pencil-square-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: false, imprimir: false},
      // { orig: "btnsTabla", boton: { icon: "fa fa-eraser", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: true, imprimir: false},
    ];

    setTimeout(() => {
      this.cargaInicial();
    }, 250)

    setTimeout(() => {
      this.LoadTableSueldo();
    }, 250)
    
  }
  
  sueldos: any = [];
  dataUser: any;
  permissions: any;
 // grado: any;
  grado: any[] = [
        { id_grb_ocupacional: 0, grb_grupo_ocupacional: 'TODOS', grb_nivel_grado: '', grb_rbu_valor:'' }
  ]
  cargo: any[] = [
    { id_cargo: 0, car_nombre: 'TODOS', car_descripcion: '' }
  ]
  //cargo:  any;
  contrato: any[] = [
    { id_catalogo: 0, cat_nombre: 'TODOS', cat_descripcion: '' }
  ]


  //contrato: any;
  estado: any;
  mensajeSpiner: string = "Cargando...";
  mensajeSppiner2: string = "Cargando...";
  constDisabled = false;


  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {

      case "NUEVO":
        this.ingresoSueldo(true, {}); 
      break;
      case "MODIFICAR": 
      //this.actualizarData();
      break;
      case "CANCELAR": 
      //this.cerrar();
      break;

    }
  }

  validaPermisos() {
    /** Obtiene los permisos del usuario y valida si puede trabajar sobre el formulario */
    this.mensajeSpiner = 'Cargando Permisos de Usuario'
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    let params = {
      codigo: myVarGlobals.fProgAsignacion,
      id_rol: this.dataUser.id_rol,
    };

    this.lcargando.ctlSpinner(true)
    setTimeout(() => {
      this.cargaInicial();
    }, 250)


    /*this.commonVrs.getPermisionsGlobas(params).subscribe(
      res => {
        this.permissions = res["data"][0];
        if (this.permissions.abrir == "0") {
          this.lcargando.ctlSpinner(false);
          this.vmButtons = [];
          this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle);
        } else {
          setTimeout(() => {
            this.cargaInicial();
          }, 250)
        }
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )*/
  }

  async cargaInicial() {
    try {
      // Carga Listado de Grados
      //this.mensajeSpiner = 'Cargando Grados'
      this.grado = await this.apiSrv.getGrupoOcupacional();
      console.log(this.grado);
      this.grado.forEach((element: any) => {
        const { id_grb_ocupacional, grb_grupo_ocupacional, grb_nivel_grado, grb_rbu_valor } = element
        this.grado = [...this.grado, { id_grb_ocupacional: id_grb_ocupacional, grb_grupo_ocupacional: grb_grupo_ocupacional, grb_nivel_grado: grb_nivel_grado,grb_rbu_valor:grb_rbu_valor }]
      })
  
      // Lista de Cargos
      //this.mensajeSpiner = 'Cargando Cargos'
      this.cargo = await this.apiSrv.getCargos();
      this.cargo.forEach((element: any) => {
        const { id_cargo,car_nombre, car_descripcion } = element
        this.cargo = [...this.cargo, { id_cargo: id_cargo, car_nombre: car_nombre, car_descripcion:car_descripcion }]
      })

      
      //this.programas.map((programa: any) => Object.assign(programa, { presupuesto: 0 }))*/
      // Lista de Cargos
      //this.mensajeSpiner = 'Cargando Tipo de Contratos'
      this.contrato = await this.apiSrv.getTipos('TCC');
      this.contrato.forEach((element: any) => {
        const { id_catalogo,cat_nombre, cat_descripcion } = element
        this.contrato = [...this.contrato, { id_catalogo: id_catalogo, cat_nombre: cat_nombre, cat_descripcion:cat_descripcion }]
      })
      //this.mensajeSpiner = 'Cargando Estados'
      this.estado = await this.apiSrv.getTipos('EST');


      //this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err, 'Error cargando Data Inicial')
    }
  }


  
  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    
    this.lcargando.ctlSpinner(true)
    this.LoadTableSueldo();
  }



  LoadTableSueldo(flag: boolean = false) {
    
    if (flag) this.paginate.page = 1
    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }
    this.mensajeSpiner = "Cargando";
    this.lcargando.ctlSpinner(true)
    this.apiSrv.getSueldos(data).subscribe(
      res => {
        console.log(res)
        this.lcargando.ctlSpinner(false)
        if (res['data'].length == 0) {
          this.sueldos = []
        } else {
          this.paginate.length = res['data']['total'];
          this.sueldos = res['data']['data'];
        //   if (res['data']['current_page'] == 1) {
            
        //  } else {
        //    this.sueldos = Object.values(res['data']['data']);
        //   }
        }
    }
    ,
      (error) => {
        console.log(error)
        this.lcargando.ctlSpinner(false)
        this.toastr.info(error.error.message);
      }
    );
  }

  // ingresoSueldo () {
  //   const modal = this.modal.open(SueldoNuevoComponent, { 
  //     size: 'xl', 
  //     backdrop: 'static', 
  //     windowClass: 'viewer-content-general' 
  //   })
  // }

  ingresoSueldo(isNew:boolean, data?:any) {
 
       const modalInvoice = this.modal.open(SueldoNuevoComponent, {
         size: "xl",
         backdrop: "static",
         windowClass: "viewer-content-general",
       });
       modalInvoice.componentInstance.isNew = isNew;
       modalInvoice.componentInstance.data = data;
       modalInvoice.componentInstance.permissions = this.permissions;
   }

  limpiarFiltros() {
    this.cargaInicial();
    
    this.filter = {
      grupo_ocupacional: 0,
      codigo_sectorial:'',
      remuneracion:'',
      cargo:0,
      tipo_contrato:0,
      estado:0,
      filterControl: ""
    }
  

  }

}
