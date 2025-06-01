import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { GeneracionService } from 'src/app/view/reg-propiedad/liquidacion/generacion/generacion.service';
import { TablasConfigService } from './tablas-config.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { TablasConfigFormComponent } from './tablas-config-form/tablas-config-form.component';
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import * as myVarGlobals from 'src/app/global';

@Component({
standalone: false,
  selector: 'app-tablas-config',
  templateUrl: './tablas-config.component.html',
  styleUrls: ['./tablas-config.component.scss']
})
export class TablasConfigComponent implements OnInit {
 
  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  fTitle = "Tablas Configuración";
  msgSpinner: string;
  vmButtons = [];
  dataUser: any;
  permissions: any;
  empresLogo: any;

  catalog: any = {};
  tablas: any = { valor: 0 };
  tablasConfigDt: any = [];
  showInactive = false;

  paginate: any;
  filter: any;

  validaciones = new ValidacionesFactory;

  constructor( 
    private tablasConfigSrv: TablasConfigService,
    private commonSrv: CommonService,
    private toastr: ToastrService,
    private commonVarSrv: CommonVarService,
    private modalSrv: NgbModal,) {

    this.commonVarSrv.editarTablasConfig.asObservable().subscribe(
      (res) => {
        //console.log(res);
        if (res) {
          this.cargarTablasConfig();
        }
      }
    )
  }

  ngOnInit(): void {

    this.vmButtons = [
      {
        orig: "btnsTablasConfig",
        paramAccion: "",
        boton: { icon: "fa fa-plus-square", texto: " NUEVO" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
     /* {
        orig: "btnsTablasConfig",
        paramAccion: "",
        boton: { icon: "far fa-square", texto: " MOSTRAR INACTIVOS" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: true,
      }*/
    ];
    this.filter = {
      descripcion: undefined,
      tipo_tabla:0,
      rango_desde: undefined,
      rango_hasta: undefined,
      valor: undefined,
      filterControl: "",
    };

    // TODO: Habilitar codigo en Backend
    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10, 20, 50]
    };

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    setTimeout(()=> {
      this.validaPermisos();
      this.cargarTablasConfig();
      
    }, 0);
  }

  fillCatalog() {
    let data = {
      params: "'REN_TIPO_TABLA_TASA'",
    };
    this.tablasConfigSrv.getCatalogo(data).subscribe(
      
      (res) => {
        this.mensajeSpinner= "Cargando...";
        this.lcargando.ctlSpinner(false);
       //console.log(res);
     
        this.tablas =  res["data"]["REN_TIPO_TABLA_TASA"];
        //console.log(this.tablas);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }
 

  validaPermisos() {
    this.mensajeSpinner = "Verificando permisos del usuario...";
    this.lcargando.ctlSpinner(true);

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    let params = {
      codigo: myVarGlobals.fRTTablasConfig,
      id_rol: this.dataUser.id_rol,
    };

    this.commonSrv.getPermisionsGlobas(params).subscribe(
      (res) => {
        //console.log(res);
        this.permissions = res["data"][0];
        if (this.permissions.ver == "0") {
          this.lcargando.ctlSpinner(false);
          this.toastr.warning("No tiene permisos para ver este formulario.", this.fTitle);
          this.vmButtons = [];
        } else {
          this.cargarTablasConfig();
        }
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  } 
  
  cargarTablasConfig(flag: boolean = false) {
    this.mensajeSpinner = "Cargando listado de tablas...";
    this.lcargando.ctlSpinner(true);

    if (flag) this.paginate.page = 1

    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }
    
    this.tablasConfigSrv.getTablasConfig(data).subscribe(
      (res) => {
        //console.log(res);
        this.tablasConfigDt = res['data']['data'];
        this.paginate.length = res['data']['total'];
        if (res['data']['current_page'] == 1) {
          this.tablasConfigDt = res['data']['data'];
        } else {
          this.tablasConfigDt = Object.values(res['data']['data']);
        }
        this.lcargando.ctlSpinner(false);
        this.fillCatalog();
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )
  }

  showTablasConfigForm(isNew:boolean, data?:any) {
    
    if (!isNew && this.permissions.consultar == "0") {
      this.toastr.warning("No tiene permisos para consultar Tablas.", this.fTitle);
    } else if (isNew && this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos para crear Tablas.", this.fTitle);
    } else {
      const modalInvoice = this.modalSrv.open(TablasConfigFormComponent, {
        size: "lg",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fRTTablasConfig;
      modalInvoice.componentInstance.fTitle = this.fTitle;
      modalInvoice.componentInstance.isNew = isNew;
      modalInvoice.componentInstance.data = data;
      modalInvoice.componentInstance.permissions = this.permissions;
      modalInvoice.componentInstance.tablas = this.tablas;
    }
  }

  metodoGlobal(event){
    switch (event.items.boton.texto) {
      case " NUEVO":
        this.showTablasConfigForm(true, {}); 
       break;
      case " MOSTRAR INACTIVOS":
        //this.changeShowInactive(this.showInactive);
    }
  }
  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarTablasConfig();
  }

  limpiarFiltros() {
    this.filter = {
      descripcion: undefined,
      tipo_tabla:0,
      base_calculo: undefined,
      valor: undefined,
      filterControl: ""
    }
    //this.changeShowInactive(true);
    //this.cargarTablasConfig();
  }

 

}
