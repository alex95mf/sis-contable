import { Component, OnInit, ViewChild} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { GeneracionService } from 'src/app/view/reg-propiedad/liquidacion/generacion/generacion.service';
import { TasasVariasService } from './tasas-varias.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { TasasVariasFormComponent } from './tasas-varias-form/tasas-varias-form.component';
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import * as myVarGlobals from 'src/app/global';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tasas-varias',
  templateUrl: './tasas-varias.component.html',
  styleUrls: ['./tasas-varias.component.scss']
})
export class TasasVariasComponent implements OnInit {

  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  fTitle = "Tasas Varias";
  msgSpinner: string;
  vmButtons = [];
  dataUser: any;
  permissions: any;
  catalog: any = {};
  
  tasas: any = { valor: 0 };
  tasasVariasDt: any = [];
  showInactive = false;

  dataO: any = [];
  tipoCalculoList = [
    {value: "VA",label: "VALOR"},
    {value: "TA",label: "TABLA"},
    {value: "FA",label: "FACTOR"},
    {value: "IN",label: "INPUT"},
    {value: "AL",label: "ALCABALA"},
    {value: "PL",label: "PLUSVALIA"}
  ]

  paginate: any;
  filter: any;

  validaciones = new ValidacionesFactory;

  constructor( private tasasVariasSrv: TasasVariasService,
    private commonSrv: CommonService,
    private toastr: ToastrService,
    private commonVarSrv: CommonVarService,
    private modalSrv: NgbModal) { 

      this.commonVarSrv.editarTasasVarias.asObservable().subscribe(
        (res) => {
          //console.log(res);
          if (res) {
            this.cargarTasasVarias(false);
          }
        }
      )
    }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsTasasVarias",
        paramAccion: "",
        boton: { icon: "fa fa-plus-square", texto: " NUEVO" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsTasasVarias",
        paramAccion: "",
        boton: { icon: "far fa-square", texto: " MOSTRAR INACTIVOS" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      },
      // {
      //   orig: "btnsTasasVarias",
      //   paramAccion: "",
      //   boton: { icon: "far fa-file-pdf", texto: " IMPRIMIR" },
      //   permiso: true,
      //   showtxt: true,
      //   showimg: true,
      //   showbadge: false,
      //   clase: "btn btn-info boton btn-sm",
      //   habilitar: false,
      //   printSection: "PrintSection", imprimir: true
      // }
    ];

  
    this.filter = {
      codigo: undefined,
      descripcion: undefined,
      estado: ['A', 'I'],
      motivacion_legal:undefined,
      tipo_calculo:0,
      tipo_tabla:0,
      valor:undefined,
      filterControl: "",
    };

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10]
    };

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    setTimeout(()=> {
      this.validaPermisos();
      this.cargarTasasVarias(true);
      this.getCatalogos()
      
    }, 0);
  }

  /* reporte(){
    window.open(environment.ReportingUrl + "Prueba/rpt_tasas_cv.xls?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&p_estado=" + "A"+ "&p_valor=" + "3", '_blank')
  } */



  validaPermisos() {
    this.mensajeSpinner = "Verificando permisos del usuario...";
    this.lcargando.ctlSpinner(true);

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    let params = {
      codigo: myVarGlobals.fRTTasasVarias,
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
          this.cargarTasasVarias(true);
        }
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  getCatalogos() {
    let data = {
      params: "'REN_TIPO_TABLA_TASA'",
    };
    this.tasasVariasSrv.getCatalogo(data).subscribe(
      
      (res) => {
        //console.log('tasaaaaas'+res);
        this.tasas = res["data"]['REN_TIPO_TABLA_TASA'];
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  fillBorradoManual() {
   
    if( this.filter.codigo == "") {
      this.filter.codigo = undefined;
     
    }else if(this.filter.descripcion == ""){
      this.filter.descripcion = undefined;
    }else if (this.filter.motivacion_legal == ""){
      this.filter.motivacion_legal = undefined;
    }
    else if (this.filter.valor == ""){
      this.filter.valor = undefined;
    }

    this.paginate.page = 1

    this.cargarTasasVarias(false)
   
}

  cargarTasasVarias(inicial: boolean) {
    this.mensajeSpinner = "Cargando listado de tasas...";
    this.lcargando.ctlSpinner(true);

    let data = {
      params: {
        filter: inicial ? undefined : this.filter,
        paginate: this.paginate
      }
    }
    
    this.tasasVariasSrv.getTasasVarias(data).subscribe(
      (res) => {
        //console.log(res);
        this.tasasVariasDt = res['data']['data'];
        this.paginate.length = res['data']['total'];
        if (res['data']['current_page'] == 1) {
          this.tasasVariasDt = res['data']['data'];
        } else {
          this.tasasVariasDt = Object.values(res['data']['data']);
        }
        this.lcargando.ctlSpinner(false);
       
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )
  }

  metodoGlobal(event){
    switch (event.items.boton.texto) {
      case " NUEVO":
        this.showTasasVariasForm(true, {}); 
       break;
      case " MOSTRAR INACTIVOS":
        this.changeShowInactive(this.showInactive);
      break;
      // case " IMPRIMIR":
      //   this.reporte();
    }
  }

  showTasasVariasForm(isNew:boolean, data?:any) {
    
    if (!isNew && this.permissions.consultar == "0") {
      this.toastr.warning("No tiene permisos para consultar Tasas.", this.fTitle);
    } else if (isNew && this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos para crear Tasas.", this.fTitle);
    } else {
      const modalInvoice = this.modalSrv.open(TasasVariasFormComponent, {
        size: "lg",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fRTTasasVarias;
      modalInvoice.componentInstance.fTitle = this.fTitle;
      modalInvoice.componentInstance.isNew = isNew;
      modalInvoice.componentInstance.data = data;
      modalInvoice.componentInstance.permissions = this.permissions;
      modalInvoice.componentInstance.tasas = this.tasas;
      
    }
  }

  // reporte(){
  //   //window.open("http://vmi1057060.contaboserver.net:9090/jasperserver/rest_v2/reports/reports/prueba/rpt_tasas_gjrn.html?&j_username=jasperadmin&j_password=Todotek.2023@**",'_blank')
  //   window.open(environment.ReportingUrl + "prueba/rpt_tasas_gjrn.xlsx?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&p_estado=" + "A" + "&p_valor=" + "3", '_blank')
  // }


  deleteTasasVarias(id) {
    //console.log(id);
    if (this.permissions.eliminar == "0"){
      this.toastr.warning("No tiene permisos para eliminar Tasas.", this.fTitle);
    } else {
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "¿Seguro que desea eliminar esta Tasa?",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        cancelButtonColor: '#F86C6B',
        confirmButtonColor: '#4DBD74',
      }).then((result) => {
        if (result.isConfirmed) {
          this.mensajeSpinner = "Eliminando tasa..."
          this.lcargando.ctlSpinner(true);
          this.tasasVariasSrv.deleteTasasVarias(id).subscribe(
            (res) => {
              //console.log(res);

              if (res["status"] == 1) {
                this.lcargando.ctlSpinner(false);
                this.cargarTasasVarias(false);
                Swal.fire({
                  icon: "success",
                  title: "Registro Eliminado",
                  text: res['message'],
                  showCloseButton: true,
                  confirmButtonText: "Aceptar",
                  confirmButtonColor: '#20A8D8',
                });
              } else {
                this.lcargando.ctlSpinner(false);
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: res['message'],
                  showCloseButton: true,
                  confirmButtonText: "Aceptar",
                  confirmButtonColor: '#20A8D8',
                });
              }
            },
            (error) => {
              this.lcargando.ctlSpinner(false);
              this.toastr.info(error.error.message);
            }
          )
        }
      });
    }
  }
  changeShowInactive(showInactive) {
    if (showInactive) {
      this.vmButtons[1].boton.icon = 'far fa-square';
      this.filter.estado = ['A', 'I'];
    } else {
      this.vmButtons[1].boton.icon = 'far fa-check-square';
      this.filter.estado = ['I'];
    }
    this.showInactive = !this.showInactive;
    this.cargarTasasVarias(false);
  }
  
  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarTasasVarias(false);
  }

  limpiarFiltros() {
    this.filter = {
      codigo: undefined,
      descripcion: undefined,
      motivacion_legal: undefined,
      tipo_tabla: 0,
      tipo_calculo: 0,
      filterControl: ""
    }

  }

}
