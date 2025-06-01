import { Component, OnInit, ViewChild, OnDestroy, Input, AfterViewInit } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ConsultaAlertasService } from './consulta-alertas.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../services/commonServices'
import * as myVarGlobals from '../../../../global';
import { Router } from '@angular/router';
import flatpickr from 'flatpickr';
import * as moment from 'moment';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { XlsExportService } from 'src/app/services/xls-export.service';
import { ExcelService } from 'src/app/services/excel.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalUsuariosComponent } from 'src/app/config/custom/modal-usuarios/modal-usuarios.component';
import { CommonVarService } from 'src/app/services/common-var.services';


@Component({
standalone: false,
  selector: 'app-consulta-alertas',
  templateUrl: './consulta-alertas.component.html',
  styleUrls: ['./consulta-alertas.component.scss'],
  styles: [`
  :host ::ng-deep .p-datatable .p-datatable-thead  > tr > th {
      position: -webkit-sticky;
      position: sticky;
      top: -10px;
  }

  .layout-news-active :host ::ng-deep .p-datatable tr > th {
      top: 7rem;
  }

`]
})
export class ConsultaAlertasComponent implements OnInit {
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  //dtOptions: DataTables.Settings = {};
  dtOptions: any = {};
  dtTrigger = new Subject();
  validaDtBitacora: any = false;
  dataBitacora: any = [];
  dataUser: any;
  permisions: any;
  viewDate: Date = new Date();
  fromDatePicker: Date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
  toDatePicker: Date = new Date();
  c: any = 0;
  processing: any = false;
  vmButtons: any;
  arrayUsers:any;
  userFilter:any = 0;
  dataBitacoraAux:any = [];

  tipoAlertas: any =[]
  modulos: any = []

  paginate: any;
  filter: any;
  today: any;
  tomorrow: any;
  firstday: any;
  lastday:any;
  excelData: any = []
  dataAlertas : any = [];

  estadoList = [
    {value: 0,label: "PENDIENTE"},
    {value: 1,label: "LEÍDO"},
  ]

  constructor(
    private toastr: ToastrService,
    private commonServices: CommonService,
    private apiService: ConsultaAlertasService,
    private xlsService: XlsExportService,
    private excelService: ExcelService,
    private router: Router,
    private modalService: NgbModal,
    private commonVarSrv :CommonVarService) {

      this.commonVarSrv.selectUsuario.asObservable().subscribe(
        (res)=>{
          console.log(res)
          if(res.valid==1){
            this.filter.id_usuario_envia = res['data']['id_usuario'];
            this.filter.usuario_envia = res['data']['usuario'];
          }
          if(res.valid==2){
            this.filter.id_usuario_recibe = res['data']['id_usuario'];
            this.filter.usuario_recibe = res['data']['usuario'];
          }

        }
      )

     }

  ngOnInit(): void {

    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 10);

    this.vmButtons = [
      { orig: "btnsAlertas", paramAccion: "", boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false, imprimir: false },
      //{ orig: "btnsBitacora", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false, imprimir: false },
    ];

    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
    this.lastday = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0);
    this.filter = {
      fecha_desde_envia: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta_envia: moment(this.lastday).format('YYYY-MM-DD'),
      fecha_desde_recibe: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta_recibe: moment(this.lastday).format('YYYY-MM-DD'),
      usuario_envia: '',
      usuario_recibe: '',
      estado: null,
      documento: '',
      tipo_alerta:'',
      id_usuario_envia:0,
      id_usuario_recibe:0,
      modulo:0

    };

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10]
    };
    let id_rol = this.dataUser.id_rol;
    let data = {
      id: 2,
      codigo: myVarGlobals.fBitacora,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'];
      if (this.permisions[0].ver == "0") {
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de Consulta de Alertas");
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);
      } else {
        this.getCatalogos()
        this.getModulos()
        this.cargarAlertas()
      //  this.getDatabitacora();
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getCatalogos() {
    let data = {
      params: "'TIPO_NOTIFICACION_ALERTA'",
    };
    /*this.mensajeSppiner = "Cargando Catalogos...";
    this.lcargando.ctlSpinner(true);*/
    this.apiService.getCatalogos(data).subscribe(

      (res) => {
        console.log(res["data"]['TIPO_NOTIFICACION_ALERTA'])
        this.lcargando.ctlSpinner(false);
        this.tipoAlertas = res["data"]['TIPO_NOTIFICACION_ALERTA'];
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  async getModulos() {
    try {
      this.mensajeSppiner = 'Cargando Modulos'
      const response = await this.apiService.getModulos();
      console.log(response)
      this.modulos = response.data
      //
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error cargando Catalogos')
    }
  }

  //getModulos

  cargarAlertas(){
    this.mensajeSppiner = 'Cargando...';
    this.lcargando.ctlSpinner(true);

    let data= {
      params: {
        filter: this.filter,
        paginate: this.paginate,

      }
    }
    this.apiService.getConsultaAlertas(data).subscribe(
      (res: any) => {
        console.log(res);
        if(res.status==1){
          this.lcargando.ctlSpinner(false);
          this.dataAlertas = res.data;
        }
      }), error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }

  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  // rerender(): void {
  //   this.validaDtBitacora = false;
  //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //     dtInstance.destroy();
  //     this.getDatabitacora();
  //   });
  // }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "EXCEL":
        //$('#tablaBitacora').DataTable().button('.buttons-excel').trigger();
        this.btnExportarExcel()
        break;
      // case "IMPRIMIR":
      //   $('#tablaBitacora').DataTable().button('.buttons-print').trigger();
      //   break;
    }
  }

  // filterXUser(){
  //   this.validaDtBitacora = false;
  //   this.dataBitacoraAux = [];
  //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //     dtInstance.destroy();
  //     if(this.userFilter == 0){
  //       this.validaDtBitacora = true;
  //       this.dataBitacoraAux = this.dataBitacora;
  //       setTimeout(() => {
  //         this.dtTrigger.next(null);
  //       }, 50);
  //     }else{
  //       this.validaDtBitacora = true;
  //       this.dataBitacoraAux = this.dataBitacora.filter(us => us.id_usuario == this.userFilter);
  //       setTimeout(() => {
  //         this.dtTrigger.next(null);
  //       }, 50);
  //     }
  //   });
  // }


  btnExportarExcel() {


    this.mensajeSppiner = "Generando Archivo Excel...";
    this.lcargando.ctlSpinner(true);


         this.excelData = [];
         console.log(this.dataAlertas);
           Object.keys(this.dataAlertas).forEach(key => {
             let filter_values = {};
             filter_values['Usuario Envia'] = (this.dataAlertas[key].usuario_envia != null) ? this.dataAlertas[key].usuario_envia : "";
             filter_values['Nombres Usuario Envia'] = (this.dataAlertas[key].nombre_usuario_envia != null) ? this.dataAlertas[key].nombre_usuario_envia : "";
             filter_values['Fecha Envio'] = (this.dataAlertas[key].fecha != null) ? this.dataAlertas[key].fecha : "";
             filter_values['Usuario Recibe'] = (this.dataAlertas[key].usuario_recibe != null) ? this.dataAlertas[key].usuario_recibe : "";
             filter_values['Nombres Usuario Recibe'] = (this.dataAlertas[key].nombre_usuario_recibe != null) ? this.dataAlertas[key].nombre_usuario_recibe : "";
             filter_values['Fecha Lectura'] = (this.dataAlertas[key].fecha_lectura != null) ? this.dataAlertas[key].fecha_lectura : "";
             filter_values['Tipo de Alerta'] = (this.dataAlertas[key].tipo_alerta != null) ? this.dataAlertas[key].tipo_alerta : "";
             filter_values['Modulo'] = (this.dataAlertas[key].modulo != null) ? this.dataAlertas[key].modulo : "";
             filter_values['Documento'] = (this.dataAlertas[key].titulo != null) ? this.dataAlertas[key].titulo : "";
             filter_values['Acción'] = (this.dataAlertas[key].accion != null) ? this.dataAlertas[key].accion : "";
             filter_values['Estado'] = (this.dataAlertas[key].estado != null) ? this.dataAlertas[key].estado : "";


             this.excelData.push(filter_values);
             this.lcargando.ctlSpinner(false);
           })
           this.exportAsXLSX();

   }

   exportAsXLSX() {
     this.excelService.exportAsExcelFile(this.excelData, 'Reporte Consulta de Alertas');
   }
  // changePaginate(event) {
  //   let newPaginate = {
  //     perPage: event.pageSize,
  //     page: event.pageIndex + 1,
  //   }
  //   Object.assign(this.paginate, newPaginate);
  //   this.getDatabitacora();
  // }

  modalUsuarios(usuario){
    const modal = this.modalService.open(ModalUsuariosComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modal.componentInstance.valid = usuario;
  }

  limpiarFiltros() {
    this.filter = {
      fecha_desde_envia: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta_envia: moment(this.lastday).format('YYYY-MM-DD'),
      fecha_desde_recibe: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta_recibe: moment(this.lastday).format('YYYY-MM-DD'),
      usuario_envia: '',
      usuario_recibe: '',
      estado: null,
      documento: '',
      tipo_alerta: '',
      id_usuario_envia:0,
      id_usuario_recibe:0,
      modulo:0
    }
    this.dataAlertas = []
  }

}
