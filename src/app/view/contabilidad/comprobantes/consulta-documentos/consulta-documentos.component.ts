import { Component, OnInit,ViewChild } from '@angular/core';
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
import { ConsultaDocumentosService } from './consulta-documentos.service';
import { DetallesGestionGarantiaComponent } from './detalles-gestion-garantia/detalles-gestion-garantia.component';

@Component({
  selector: 'app-consulta-documentos',
  templateUrl: './consulta-documentos.component.html',
  styleUrls: ['./consulta-documentos.component.scss']
})
export class ConsultaDocumentosComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
 
  fTitle = "Consulta de Documentos";
  msgSpinner: string;
  vmButtons: any = [];
  estadoList = [
    {value: 'E',label: "EMITIDOO"},
    {value: 'P',label: "PENDIENTE"},
    {value: 'C',label: "CERRADO"}
  ]
  estado: any = [
    {valor:'P',descripcion: 'Pendiente'},
    {valor:'C',descripcion: 'Carrado'},
    {valor:'E',descripcion: 'Emitido'},
  ]

  tipo: any = [
    {valor:'VIA',descripcion: 'Viatico'},
    {valor:'CCH',descripcion: 'Caja Chica'},
    {valor:'MU',descripcion: 'Multas'},
    {valor:'CRUZA',descripcion: 'Cruce de Pagos'},
  ]

  paginate: any;
  filter: any;

  today: any;
  tomorrow: any;
  firstday: any;
  lastday:any;
  excelData: any [];
  exportList: any[];
  dataUser: any;
  permissions: any;
  empresLogo: any;
  
  ordenesDt: any = [];


  constructor(
    private commonService: CommonService,
    private toastr: ToastrService,
    private commonVrs: CommonVarService,
    private modalService: NgbModal,
    private apiSrv: ConsultaDocumentosService,
    private excelService: ExcelService,
    
  ) { }

  ngOnInit(): void {
    // this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    // this.empresLogo = this.dataUser.logoEmpresa;
    this.vmButtons = [
      { 
        orig: "btnsDocumentos", 
        paramAccion: "2", 
        boton: { icon: "fa fa-search", texto: "CONSULTAR" }, 
        permiso: true, 
        showtxt: true, 
        showimg: true, 
        showbadge: false, 
        clase: "btn btn-primary boton btn-sm", 
        habilitar: false
      },
      { 
        orig: "btnsDocumentos", 
        paramAccion: "2", 
        boton: { icon: "fa fa-eraser", texto: "LIMPIAR" }, 
        permiso: true, 
        showtxt: true, 
        showimg: true, 
        showbadge: false, 
        clase: "btn btn-danger boton btn-sm", 
        habilitar: false
      },
      

      { 
        orig: "btnsDocumentos", 
        paramAccion: "2", 
        boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, 
        permiso: true, 
        showtxt: true, 
        showimg: true, 
        showbadge: false, 
        clase: "btn btn-success boton btn-sm", 
        habilitar: false
      },
    
    ]

    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
    this.lastday = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0); 

    
    this.filter = {
      documento: undefined,
      fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      tipo: undefined,
      estado: undefined,
      razon_social_proveedor:undefined,
      razon_social:undefined,
      filterControl: ""
    };

    this.paginate = {
      length: 0,
      perPage: 20,
      page: 1,
      pageSizeOptions: [20, 50,100,200]
    };

    setTimeout(()=> {
    this.cargarDocumentos()
    }, 500);


  }

  metodoGlobal = (event) => {
    switch (event.items.boton.texto) {
      case "CONSULTAR":
     
      this.cargarDocumentos(true);
        break;

        case "LIMPIAR":
     
        this.limpiarFiltros();
          break;
      case "EXCEL":
     
      this.btnExportar();
        break;
      case "PDF":
        
        break;
    }
  }

  cargarDocumentos(flag: boolean = false) {
    
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
    
    this.apiSrv.getRecDocumento(data).subscribe(
      (res) => {
        console.log(res)
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
  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarDocumentos();
  }

  limpiarFiltros() {
    this.filter = {
      documento: undefined,
      fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      tipo: undefined,
      estado: undefined,
      razon_social_proveedor:undefined,
      razon_social:undefined,
      filterControl: ""
    }
  }
  detallesMovimiento(dt){
    let modalDet = this.modalService.open(DetallesGestionGarantiaComponent,{
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })

    modalDet.componentInstance.detalles = dt;

  }

  
  async btnExportar() 
  {
    this.lcargando.ctlSpinner(true)
    try {
      this.msgSpinner = 'Exportando Documentos';


  

    let data = {
      params: {
        filter: this.filter,
      
      }
    }
    this.apiSrv.getRecDocumento(data).subscribe(
      (res)=>{
        this.exportList = res['data']
        this.excelData=[];
        Object.keys(this.exportList).forEach(key =>{
          let filter_values = {};
          filter_values['ID'] = key+1;
          filter_values['Documento'] = (this.exportList[key].documento != null) ? this.exportList[key].documento.trim() : "";
          filter_values['Fecha'] = (this.exportList[key].fecha.split(" ")[0] != undefined) ? this.exportList[key].fecha.split(" ")[0] : "";
          filter_values['Tipo Documento'] = (this.exportList[key].tipo != null) ? this.exportList[key].tipo.trim() : "";
          filter_values['Contribuyente'] = (this.exportList[key].contribuyente != null) ? this.exportList[key].contribuyente.razon_social.trim() : "";
          filter_values['Proveedor'] = (this.exportList[key].proveedor != null) ? this.exportList[key].proveedor.razon_social.trim() : "";
          filter_values['Valor'] = (this.exportList[key].total != undefined) ? this.exportList[key].total : "";
          filter_values['Saldo'] = (this.exportList[key].saldo != undefined) ? this.exportList[key].saldo : "";
          filter_values['Estado'] = (this.exportList[key].estado != undefined) ? (this.exportList[key].estado == 'E' ? 'Emitido' : this.exportList[key].estado == 'P' ? 'Pendiente' : this.exportList[key].estado == 'C' ? 'Cerrado' : this.exportList[key].estado == 'A' && 'Anulado' ) : "";

          this.excelData.push(filter_values);
        })
        //this.exportAsXLSX()
        this.excelService.exportAsExcelFile(this.excelData, 'Consulta de Documentos');
        this.lcargando.ctlSpinner(false);
      }
    )
  } catch (err) {
    console.log(err)
    this.lcargando.ctlSpinner(false)
    this.toastr.error(err.error?.message, 'Error obteniendo Reclamos')
  }

  
  }

  // exportAsXLSX() {
  //   this.excelService.exportAsExcelFile(this.excelData, 'Consulta de Documentos');
    
  // }


}
