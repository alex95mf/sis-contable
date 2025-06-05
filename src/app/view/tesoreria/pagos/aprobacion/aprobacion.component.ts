import { Component, OnInit, ViewChild } from '@angular/core';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as moment from 'moment';
//import * as myVarGlobals from "../../../../global";
import { CommonService } from 'src/app/services/commonServices';
import { ToastrService } from 'ngx-toastr';
import { CommonVarService } from 'src/app/services/common-var.services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AprobacionService } from './aprobacion.service'; 
import * as myVarGlobals from 'src/app/global';
import { ModalGestionComponent } from '../aprobacion/modal-gestion/modal-gestion.component';
import { ModalImprimirComponent } from './modal-imprimir/modal-imprimir.component';
import { ExcelService } from 'src/app/services/excel.service';
import jsPDF from 'jspdf';
import { NgxPrintDirective } from 'ngx-print';

@Component({
standalone: false,
  selector: 'app-aprobacion',
  templateUrl: './aprobacion.component.html',
  styleUrls: ['./aprobacion.component.scss']
})
export class AprobacionComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
 
  fTitle = "Gestión (Ordenenes de Pago)";
  mensajeSpinner: string = "Cargando...";
  vmButtons: any = [];
  vmButtonsI:any = [];
  dataUser: any;
  permissions: any;
  empresLogo: any;
  conceptos: any = {};

  nomina: boolean = false

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

  tipoOrden = []
  todosOption = { valor: 'TODOS', descripcion: '- TODOS -' };
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
    {value: "E",label: "Emitido"},
    {value: "A",label: "Aprobado"},
    {value: "C",label: "Pagado"},
    {value: "N",label: "Negado"}
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
    private apiSrv: AprobacionService,
    private excelService: ExcelService,
  ) { 
    this.commonVrs.bandTrabTicket.asObservable().subscribe(
      (res) => {
        //console.log(res);
        if (res) {
          this.cargarOrdenesPago();
        }
      }
    )
   
  }

  ngOnInit(): void {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.empresLogo = this.dataUser.logoEmpresa;

    this.vmButtonsI = [
      
      {
        orig: "btnsOrdPag",
        paramAccion: "",
        boton: { icon: "far fa-file-pdf", texto: " IMPRIMIR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-info boton btn-sm",
        habilitar: false,
        printSection: "PrintSection", imprimir: true
      },
     
    ]



    this.vmButtons = [
      
      {
        orig: "btnsOrdPag",
        paramAccion: "",
        boton: { icon: "far fa-file-pdf", texto: " IMPRIMIR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-info boton btn-sm",
        habilitar: false,
        printSection: "PrintSection", imprimir: true
      },
      { 
        orig: "btnsOrdPag", 
        paramAccion: "2", 
        boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, 
        permiso: true, 
        showtxt: true, 
        showimg: true, 
        showbadge: false, 
        clase: "btn btn-success boton btn-sm", 
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
      estado: ['P', 'E','A','N','C'],
      razon_social:"",
      tipo_orden: "",
      empleado: ''
    };

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10]
    };

    setTimeout(()=> {
      this.validaPermisos();
      this.cargarOrdenesPago();
      this.getCatalogoConceptos();
    }, 50);

  }

  validaPermisos() {
    (this as any).mensajeSpinner = "Verificando permisos del usuario...";
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

  tipoSelected(event){
    if (event == 'NOMINA') {
      this.nomina = true
    }else{
      this.nomina = false
    }
  }


  btnExportar() {
  

    let data = {
      params: {
        filter: this.filter,
      
      }
    }
    (this as any).mensajeSpinner = "Generando reporte Excel...";
    this.lcargando.ctlSpinner(true);
    //this.apiSrv.getRecDocumentosExport(data).subscribe(
      this.apiSrv.getRecDocumentosAprobar(data).subscribe( 
      (res)=>{
        console.log(res);
        this.exportList = res['data']
        this.excelData = [];
        
       
       
        if (this.permissions.exportar == "0") {
          this.toastr.info("Usuario no tiene permiso para exportar");
        } else {
          Object.keys(this.exportList).forEach(key => {

            if(this.filter.tipo_orden =='NOMINA'){
              let filter_values = {};
              filter_values['ID'] = key;
              filter_values['Documento'] = (this.exportList[key].documento != null) ? this.exportList[key].documento.trim() : "";
              filter_values['Usuario Creador'] = (this.exportList[key].usuario.nombre != null) ? this.exportList[key].usuario.nombre.trim() : "";
              filter_values['Fecha'] = (this.exportList[key].fecha.split(" ")[0] != undefined) ? this.exportList[key].fecha.split(" ")[0] : "";
              filter_values['Empleado'] = (this.exportList[key].empleados?.emp_full_nombre != null) ? this.exportList[key].empleados?.emp_full_nombre.trim() : "";
              filter_values['Valor'] = (this.exportList[key].total != undefined) ? this.exportList[key].total : "";
              filter_values['Estado'] = (this.exportList[key].estado != undefined) ? (this.exportList[key].estado == 'E' ? 'Emitido' : this.exportList[key].estado == 'A' ? 'Aprobado' : this.exportList[key].estado == 'N' ? 'Negado' : this.exportList[key].estado == 'C' && 'Pagado' ) : "";
              this.excelData.push(filter_values);
            }else{
              let filter_values = {};
              filter_values['ID'] = key;
              filter_values['Documento'] = (this.exportList[key].documento != null) ? this.exportList[key].documento.trim() : "";
              filter_values['Usuario Creador'] = (this.exportList[key].usuario.nombre != null) ? this.exportList[key].usuario.nombre.trim() : "";
              filter_values['Fecha'] = (this.exportList[key].fecha.split(" ")[0] != undefined) ? this.exportList[key].fecha.split(" ")[0] : "";
              filter_values['Proveedor'] = (this.exportList[key].proveedor?.razon_social != null) ? this.exportList[key].proveedor.razon_social.trim() : "";
              filter_values['Valor'] = (this.exportList[key].total != undefined) ? this.exportList[key].total : "";
              filter_values['Estado'] = (this.exportList[key].estado != undefined) ? (this.exportList[key].estado == 'E' ? 'Emitido' : this.exportList[key].estado == 'A' ? 'Aprobado' : this.exportList[key].estado == 'N' ? 'Negado' : this.exportList[key].estado == 'C' && 'Pagado' ) : "";
              this.excelData.push(filter_values);
            }
           
          })
          this.exportAsXLSX();
          this.lcargando.ctlSpinner(false);
        }
      }
    )
    
  }


  exportAsXLSX() {
    this.excelService.exportAsExcelFile(this.excelData, 'Ordenes de pago');
  }


  getCatalogoConceptos() {
    let data = {
      params: "'OP_CONCEPTOS','PAG_TIPO_DESEMBOLSO','REC_TIPO_ORDENP'",
    };
    (this as any).mensajeSpinner = "Buscando concepto...";
    this.lcargando.ctlSpinner(true);
    this.apiSrv.getCatalogoConcepto(data).subscribe(
      
      (res) => {
        console.log(res)
        this.conceptos = res["data"]['OP_CONCEPTOS'];
        this.tipoDesembolso = res["data"]['PAG_TIPO_DESEMBOLSO'];
        
        res["data"]["REC_TIPO_ORDENP"].forEach(element => {
          let data = {
            valor: element.valor,
            descripcion: element.descripcion
          }
          this.tipoOrden.push(data)
        });
        
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
    
    (this as any).mensajeSpinner = "Cargando Ordenes de Pago...";
    this.lcargando.ctlSpinner(true);

    if (flag) this.paginate.page = 1

    console.log(this.paginate.page + ' nro Pagina');

    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }
    
    this.apiSrv.getRecDocumentosAprobar(data).subscribe(
      (res) => {
       console.log(res['data'])
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

  showModalGestion(isNew:boolean, data?:any) {
    
     console.log(this.tipoDesembolso);
     if (!isNew && this.permissions.consultar == "0") {
       this.toastr.warning("No tiene permisos para consultar Ordenes de Pago.", this.fTitle);
     } else if (isNew && this.permissions.guardar == "0") {
       this.toastr.warning("No tiene permisos para crear Ordenes de Pago.", this.fTitle);
     } else {
 
 
       const modalInvoice = this.modalService.open(ModalGestionComponent, {
         size: "xl",
         backdrop: "static",
         windowClass: "viewer-content-general",
       });
       modalInvoice.componentInstance.module_comp = myVarGlobals.fRTTickets;
       modalInvoice.componentInstance.fTitle = this.fTitle;
       modalInvoice.componentInstance.isNew = isNew;
       modalInvoice.componentInstance.data = data;
       modalInvoice.componentInstance.permissions = this.permissions;
       modalInvoice.componentInstance.ordenes = this.ordenes;
       
     }
   }
   showModalImprimir(isNew:boolean, data?:any) {
    
    console.log(this.tipoDesembolso);
    if (!isNew && this.permissions.consultar == "0") {
      this.toastr.warning("No tiene permisos para consultar Ordenes de Pago.", this.fTitle);
    } else if (isNew && this.permissions.guardar == "0") {
      this.toastr.warning("No tiene permisos para crear Ordenes de Pago.", this.fTitle);
    } else {


      const modalInvoice = this.modalService.open(ModalImprimirComponent, {
        size: "xl",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fRTTickets;
      modalInvoice.componentInstance.fTitle = this.fTitle;
      modalInvoice.componentInstance.isNew = isNew;
      modalInvoice.componentInstance.data = data;
      modalInvoice.componentInstance.permissions = this.permissions;
      modalInvoice.componentInstance.ordenes = this.ordenes;
      
    }
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
      estado: ['P', 'E','A','C','N'],
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

