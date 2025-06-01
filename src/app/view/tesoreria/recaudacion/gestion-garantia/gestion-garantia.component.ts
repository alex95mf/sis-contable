import { Component, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as moment from 'moment';
//import * as myVarGlobals from "../../../../global";
import { CommonService } from 'src/app/services/commonServices';
import { ToastrService } from 'ngx-toastr';
import { CommonVarService } from 'src/app/services/common-var.services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import {DetallesMovimientosBancComponent} from './detalles-movimientos-banc/detalles-movimientos-banc.component';
import * as myVarGlobals from 'src/app/global';
// import { ModalGestionComponent } from '../aprobacion/modal-gestion/modal-gestion.component';
// import { ModalImprimirComponent } from './modal-imprimir/modal-imprimir.component';
import { ExcelService } from 'src/app/services/excel.service';
import { GestionGarantiaService } from './gestion-garantia.service';
import { DetallesGestionGarantiaComponent } from './detalles-gestion-garantia/detalles-gestion-garantia.component';
// import { GestionMovimientoBancarioService } from './gestion-movimiento-bancario.service';

@Component({
standalone: false,
  selector: 'app-gestion-garantia',
  templateUrl: './gestion-garantia.component.html',
  styleUrls: ['./gestion-garantia.component.scss']
})
export class GestionGarantiaComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;

  fTitle = "Gestión (Ordenenes de Pago)";
  msgSpinner: string;
  vmButtons: any = [];
  vmButtonsI:any = [];
  dataUser: any;
  permissions: any;
  empresLogo: any;
  conceptos: any = {};

  ordenes: any = {};

  formReadOnly = false;
  titulosDisabled = true;

  proveedorActive: any = {
    razon_social: ""
  };

  ordenesDt: any = [];
  ordenesDeta: any = {};
  ordenesDetalles:any = {};
  ordenesEdit: any = {};


  conceptosList: any = [];
  concepto: any = 0;
  tipoDesembolso: any = 0;

  totalCobro = 0;
  totalPago = 0;
  difCobroPago = 0;

  deudas: any = [];
  fecha = moment(new Date()).format('YYYY-MM-DD  HH:mm');
  verifyRestore = false;

  estadoSelected = 0

  estadoList = [
    {value: 'E',label: "EJECUTADO"},
    {value: 'P',label: "PENDIENTE"},
    {value: 'C',label: "CUMPLIDO"}
  ]


  pagos: any = [];

  formaPago = 0;

  documento: any = {
    id_documento: null,
    tipo_documento: "", // concepto.codigo
    fk_contribuyente: null, // contr id
    fecha: moment(new Date()).format('YYYY-MM-DD'),
    observacion: "",
    estado: "P",
    subtotal: 0,
    total: 0,
    detalles: [], // deudas
    formas_pago: [], // pagos
    fk_caja: 0, // caja activa al momento de cobrar
  }
  paginate: any;
  filter: any;

  today: any;
  tomorrow: any;
  firstday: any;
  lastday:any;
  excelData: any [];
  exportList: any[];

  constructor(
    private commonService: CommonService,
    private toastr: ToastrService,
    private commonVrs: CommonVarService,
    private modalService: NgbModal,
    private apiSrv: GestionGarantiaService,
    private excelService: ExcelService,
  ) {
    // this.commonVrs.bandTrabTicket.asObservable().subscribe(
    //   (res) => {
    //     //console.log(res);
    //     if (res) {
    //       this.cargarOrdenesPago();
    //     }
    //   }
    // )

    this.commonVrs.modalMovimientoBanco.subscribe(
      (res)=>{
        this.cargarOrdenesPago()
      }
    )

  }

  ngOnInit(): void {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.empresLogo = this.dataUser.logoEmpresa;



    this.vmButtons = [

      // {
      //   orig: "btnsOrdPag",
      //   paramAccion: "",
      //   boton: { icon: "far fa-file-pdf", texto: " IMPRIMIR" },
      //   permiso: true,
      //   showtxt: true,
      //   showimg: true,
      //   showbadge: false,
      //   clase: "btn btn-info boton btn-sm",
      //   habilitar: false,
      //   printSection: "PrintSection", imprimir: true
      // },
      {
        orig: "btnsGestionGarantia",
        paramAccion: "2",
        boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-outline-success boton btn-sm",
        habilitar: false
      },
      /*{
        orig: "btnsOrdPag",
        paramAccion: "2",
        boton: { icon: "fa fa-file-pdf-o", texto: "PDF" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false
      },*/
     /* { orig: "btnCCmant", paramAccion: "2", boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false},
      { orig: "btnCCmant", paramAccion: "2", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false},
      { orig: "btnCCmant", paramAccion: "2", boton: { icon: "fa fa-file-pdf-o", texto: "PDF" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false},
     */
    ]


    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
    this.lastday = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0);


    this.filter = {
      id_orden_pago: undefined,
      fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      observacion: "",
      estado: undefined,
      movimiento:undefined
    };

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10, 15, 20]
    };

    setTimeout(()=> {
      this.validaPermisos();
      // this.cargarOrdenesPago();
    }, 500);

  }

  validaPermisos() {
    this.msgSpinner = "Verificando permisos del usuario...";
    this.lcargando.ctlSpinner(true);

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    let params = {
      codigo: myVarGlobals.fRTTickets,
      id_rol: this.dataUser.id_rol,
    };

    this.commonService.getPermisionsGlobas(params).subscribe(
      (res) => {
        //console.log(res);
        this.permissions = res["data"][0];
        if (this.permissions.ver == "0") {
          this.lcargando.ctlSpinner(false);
          this.toastr.warning("No tiene permisos para ver este formulario.", this.fTitle);
          this.vmButtons = [];
        } else {
          this.cargarOrdenesPago();
        }
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  metodoGlobal = (event) => {
    switch (event.items.boton.texto) {
      case "IMPRIMIR":

        break;
      case "EXCEL":
        this.btnExportar();
        break;
      case "PDF":

        break;
    }
  }


  async btnExportar() {

    let excelData = []

    let data = {
      empresa: 1,
      params: {
        filter: this.filter,
      }
    }
    this.lcargando.ctlSpinner(true)
    try {
      let resposne = await this.apiSrv.getGestionGarantia(data) as any
      // console.log(resposne)

      resposne.data.forEach((elem: any) => {

        const {fecha_inicio, fecha_finalizacion, num_poliza, valor, cod_sercop, aseguradora,  riesgo, forma_garantia, estado} = elem
        const {con_contrato, con_num_proceso, con_admin_contrato} = elem.solicitud == null ? {con_contrato: '', con_num_proceso: '', con_admin_contrato: ''} : elem.solicitud
        const {nombre_comercial_prov}  = elem.solicitud?.proveedor ?? {nombre_comercial_prov: ''}

        let objeto = {
          Num_Póliza: num_poliza,
          Suma_aseguradora: valor,
          Vigente_desde: fecha_inicio,
          Vigente_hasta: fecha_finalizacion,
          Estado: estado,
          Riesgo_asegurado: riesgo,
          Aseguradora: aseguradora,
          // Tipo_de_contrato: ,
          Contrato: con_contrato,
          Proceso: con_num_proceso,
          Contratista: nombre_comercial_prov,
          Administrador: con_admin_contrato
        }

        excelData.push(objeto)
      });

      this.lcargando.ctlSpinner(false)
      this.excelService.exportAsExcelFile(excelData, 'Gestion de garantias');
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.warning(err.error?.message)
    }
  }


  getCatalogoConceptos() {
    let data = {
      params: "'OP_CONCEPTOS','PAG_TIPO_DESEMBOLSO'",
    };
    this.msgSpinner = "Buscando concepto...";
    this.lcargando.ctlSpinner(true);
    this.apiSrv.getCatalogoConcepto(data).subscribe(

      (res) => {
        this.conceptos = res["data"]['OP_CONCEPTOS'];
        this.tipoDesembolso = res["data"]['PAG_TIPO_DESEMBOLSO'];
        this.lcargando.ctlSpinner(false);
       // console.log('conceptos '+res);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }
  cargarOrdenesPago(flag: boolean = false) {

    this.msgSpinner = "Cargando Ordenes de Pago...";
    this.lcargando.ctlSpinner(true);

    if (flag) this.paginate.page = 1;

    console.log(this.paginate.page + ' nro Pagina');

    let data = {
      empresa: 1,
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }

    this.apiSrv.getGestionGarantia(data).subscribe(
      (res) => {
        //console.log('documentos'+res);
        this.ordenesDt = res['data'];
        this.paginate.length = res['data']['total'];
        if (res['data']['current_page'] == 1) {
          this.ordenesDt = res['data']['data'];
        } else {
          this.ordenesDt = Object.values(res['data']['data']);
        }
        this.lcargando.ctlSpinner(false);

      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )
  }



  asignarEstado(evt) {
    this.filter.estado = [evt]
   }



  // showModalGestion(isNew:boolean, data?:any) {

  //    console.log(this.tipoDesembolso);
  //    if (!isNew && this.permissions.consultar == "0") {
  //      this.toastr.warning("No tiene permisos para consultar Ordenes de Pago.", this.fTitle);
  //    } else if (isNew && this.permissions.guardar == "0") {
  //      this.toastr.warning("No tiene permisos para crear Ordenes de Pago.", this.fTitle);
  //    } else {


  //      const modalInvoice = this.modalService.open(ModalGestionComponent, {
  //        size: "xl",
  //        backdrop: "static",
  //        windowClass: "viewer-content-general",
  //      });
  //      modalInvoice.componentInstance.module_comp = myVarGlobals.fRTTickets;
  //      modalInvoice.componentInstance.fTitle = this.fTitle;
  //      modalInvoice.componentInstance.isNew = isNew;
  //      modalInvoice.componentInstance.data = data;
  //      modalInvoice.componentInstance.permissions = this.permissions;
  //      modalInvoice.componentInstance.ordenes = this.ordenes;

  //    }
  //  }
  //  showModalImprimir(isNew:boolean, data?:any) {

  //   console.log(this.tipoDesembolso);
  //   if (!isNew && this.permissions.consultar == "0") {
  //     this.toastr.warning("No tiene permisos para consultar Ordenes de Pago.", this.fTitle);
  //   } else if (isNew && this.permissions.guardar == "0") {
  //     this.toastr.warning("No tiene permisos para crear Ordenes de Pago.", this.fTitle);
  //   } else {


  //     const modalInvoice = this.modalService.open(ModalImprimirComponent, {
  //       size: "xl",
  //       backdrop: "static",
  //       windowClass: "viewer-content-general",
  //     });
  //     modalInvoice.componentInstance.module_comp = myVarGlobals.fRTTickets;
  //     modalInvoice.componentInstance.fTitle = this.fTitle;
  //     modalInvoice.componentInstance.isNew = isNew;
  //     modalInvoice.componentInstance.data = data;
  //     modalInvoice.componentInstance.permissions = this.permissions;
  //     modalInvoice.componentInstance.ordenes = this.ordenes;

  //   }
  // }

  detallesMovimiento(dt){
    let modalDet = this.modalService.open(DetallesGestionGarantiaComponent,{
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })

    modalDet.componentInstance.detalles = dt;

  }

  imprimirOrdenById(isNew:boolean, data?:any){
    this.ordenesEdit = JSON.parse(JSON.stringify(data));
    this.ordenesDeta = JSON.parse(JSON.stringify(data['detalles']));
  }


  limpiarFiltros() {
    this.filter = {
      fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      observacion: "",
      estado: undefined,
    }
    this.estadoSelected = 0


  }
  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarOrdenesPago();
  }

}
