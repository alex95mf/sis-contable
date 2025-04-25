import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'node_modules/sweetalert2/dist/sweetalert2';
import * as moment from 'moment';
import { ContratacionService } from './contratacion.service';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { DetalleContratacionComponent } from './detalle-contratacion/detalle-contratacion.component';
import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';
import { ModalProveedoresComponent } from 'src/app/config/custom/modal-proveedores/modal-proveedores.component';
import * as myVarGlobals from "../../../global";
import { ExcelService } from 'src/app/services/excel.service';
import { XlsExportService } from 'src/app/services/xls-export.service';
@Component({
  selector: 'app-contratacion',
  templateUrl: './contratacion.component.html',
  styleUrls: ['./contratacion.component.scss']
})
export class ContratacionComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false })
   lcargando: CcSpinerProcesarComponent;
  mensajeSppiner: string = "Cargando...";
  fTitle: string = "Contratación";
  msgSpinner: string
  dataUser: any
  permissions: any
  viewSolicitudes: boolean = true

  verifyRestore = false;
  
  programa: any = [];
  departamento: any = [];
  atribucion: any = [];

  listaSolicitudes: any = [];
  listaSolicitudesAtribucion: any = [];

  nuevaSolicitud: boolean = true;

  nuevaS: any = {}

  total: any = 0;


  vmButtons: any;

  itemBienes: any ={}

  atribucionParams: any = {
    programa: null,
    departamento: null,
    atribucion: null
  }
  binding: any

  paginate: any;
  filter: any;
  firstday: any;
  today: any;
  tomorrow: any;

  estadoSelected: any = 0


  paginateNew: any;
  filterNew: any;
  masterSelected: boolean = false
  atribucionParamsNew: any;

  datoDepartamento: any = []

  dato_Programa: any = []
  excelData: any [];

  dropdownSettings:IDropdownSettings = {};

  fecha: Date = new Date();
  periodo: Date = new Date();
  estadoList = [
    {value: "A",label: "Aprobado"},
    {value: "P",label: "Pendiente"},
    {value: "D",label: "Denegado"},
  ]

  proveedorActive: any = {
    razon_social: ""
  };

  constructor(
    private service: ContratacionService,
    private router: Router,
    private modalDet: NgbModal,
    private commonVrs: CommonVarService,
    private toastr: ToastrService,
    private commonService: CommonService,
    private excelService: ExcelService,
    private xlsService: XlsExportService,
  ) {
    this.commonVrs.selectProveedorCustom.asObservable().subscribe(
      (res) => {
      
        this.proveedorActive = res;
        this.filter.proveedor = res.razon_social
        console.log(this.proveedorActive);
      }
    );
  }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsComprasP", 
      paramAccion: "1", 
      boton: { icon: "fas fa-save", texto: "Guardar" }, 
      permiso: true, 
      showtxt: true,
      showimg: true, 
      showbadge: false, 
      clase: "btn btn-warning btn-sm", 
      habilitar: false, 
      imprimir: false}
      ,
      {
        orig: "btnsComprasP",
        paramAccion: "",
        boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      },
      { orig: "btnsComprasP",
       paramAccion: "1", 
       boton: { icon: "fas fa-eraser", texto: "Limpiar" }, 
       permiso: true, 
       showtxt: true, 
       showimg: true, 
       showbadge: false, 
       clase: "btn btn-danger btn-sm", 
       habilitar: false, 
       imprimir: false},

       { orig: "btnsComprasP",
       paramAccion: "1", 
       boton: { icon: "fas fa-eraser", texto: "EXCEL" }, 
       permiso: true, 
       showtxt: true, 
       showimg: true, 
       showbadge: false, 
       clase: "btn btn-success btn-sm", 
       habilitar: false, 
       imprimir: false}




    ]


    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);

    this.vmButtons[1].showimg= false

    this.filter = {
      num_solicitud:"",
      //estado:['A','P','D'],
      estado: '',
      fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      proveedor: undefined,
      con_contrato: undefined,
      filterControl: ""  
    };

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10]
    };

    this.filterNew = {
      fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      filterControl: ""  
    };

    this.atribucionParamsNew = {
      programa: null,
      departamento: null,
      atribucion: null,
      num_solicitud: null,
      fecha_creacion: moment(this.today).format('YYYY-MM-DD')
    }

    this.paginateNew = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10]
    };

    this.vmButtons[0].showimg=false
    this.vmButtons[1].showimg=false

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };


    setTimeout(() => {
      // this.cargarPrograma()
      // this.SearchList({})
      this.validaPermisos()
    }, 500);

  }
  validaPermisos = () => {
    this.msgSpinner = 'Cargando Permisos de Usuario...';
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    let params = {
      codigo: myVarGlobals.fRenPredUrbanoEmision,
      id_rol: this.dataUser.id_rol,
    };

    this.commonService.getPermisionsGlobas(params).subscribe(
      res => {
        this.permissions = res["data"][0];
        if (this.permissions.abrir == "0") {
          this.lcargando.ctlSpinner(false);
          this.vmButtons = [];
          this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle);
        } else {
          this.cargarPrograma()
          this.SearchList({})
        }
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }

  toggleView() {
    this.viewSolicitudes = !this.viewSolicitudes
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.SearchList({});
  }


  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {

      case "Guardar":
          this.commonVrs.selectContrato.next()
        break;

      case "REGRESAR":
        this.SearchList({})
        this.nuevaSolicitud = true
        this.vmButtons[1].showimg=false
        this.vmButtons[0].showimg=false
        
        break;

        case "Buscar":
          this.SearchList({});
          break;
        case "Limpiar":
          this.limpiar();
          break;
        case "EXCEL":
          this.exportarExcel();
          break;

        
    }
  }

  onMaterialGroupChange(event){
    console.log(event);
  }
  asignarEstado(evt) {
    this.filter.estado = [evt]
   }
  periodoSelected(evt: any, year:any){
    console.log(evt)
    this.periodo = evt
    if(evt){
      this.cargarPrograma();
    }
  }
  cargarPrograma(){
    this.mensajeSppiner = "Cargando Programa...";    
    this.lcargando.ctlSpinner(true);
    
    let data ={
      periodo: this.periodo.getFullYear(),
    }
    console.log(data)
    this.service.searchPrograma(data).subscribe((res: any)=>{
       console.log(res);
       this.lcargando.ctlSpinner(false);
      let program = []
      res.map((data)=>{
        
        let dat = {
          ...data.catalogo,
          value: data.catalogo['descripcion'] + '-'+ data.catalogo['valor']
        }
        program.push(dat)
       // this.lcargando.ctlSpinner(false);
      })
      this.programa = program
      console.log(this.programa);
    })
  }


  departamentoSearch(event){
  // console.log(event);
  this.mensajeSppiner = "Cargando Programa...";    
  this.lcargando.ctlSpinner(true);

  let data = {
    programa: this.dato_Programa //event.valor
  }
  console.log(data);
  this.service.searchDepartamento(data).subscribe((data: any)=>{
    console.log(data);
    let depa = []
    data.map((res)=>{
      let d = {
        ...res,
        value: res['descripcion'] + '-'+ res['valor'],

      }
      depa.push(d)
    })
    this.departamento = depa
    console.log(this.departamento);
    this.lcargando.ctlSpinner(false);
  })
  }
  

  AtribucionSearch(event){
    console.log(event);
    this.mensajeSppiner = "Cargando Programa...";    
    this.lcargando.ctlSpinner(true);
    let data = {
      departamento: event.valor
    }
    this.service.searchAtribucion(data).subscribe((dat)=>{
      console.log(dat);
      this.atribucion = dat['data']
      this.lcargando.ctlSpinner(false);
    })
  }

  
  

  nuevoSolicitud(valor){
    // this.nuevaSolicitud = false
       
    // this.vmButtons[1].showimg=true
    console.log(this.vmButtons[0]);
    // this.moduloDetalle();

  }

  AtribucionSearchNew(event){
    console.log(event);
  }

  selectAll() {
    this.listaSolicitudesAtribucion.map((e: any) => e.check = this.masterSelected)
    
  }

  moduloDetalle(event){
    this.vmButtons[0].showimg=true
    this.vmButtons[1].showimg=true
    this.nuevaSolicitud = false;
    this.itemBienes =  event
  }

  btnExportar() {
    this.mensajeSppiner = "Generando Archivo Excel...";
    this.lcargando.ctlSpinner(true);
    let data = {
      params: {
        filter: this.filter,
      }
    }

    this.excelData = [];
    if (this.permissions.exportar == "0") {
      this.toastr.info("Usuario no tiene permiso para exportar");
    } else {
      Object.keys(this.listaSolicitudes).forEach(key => {
        let filter_values = {};
        filter_values['Número de Solicitud'] = (this.listaSolicitudes[key].num_solicitud != null) ? this.listaSolicitudes[key].num_solicitud.trim() : "";
        filter_values['Proveedor'] = (this.listaSolicitudes[key].proveedor?.razon_social != null) ? this.listaSolicitudes[key].proveedor.razon_social.trim() : "";
        filter_values['Número de Contrato'] = (this.listaSolicitudes[key].con_contrato != null) ? this.listaSolicitudes[key].con_contrato.trim() : "";
        filter_values['Fecha'] = (this.listaSolicitudes[key].fecha_creacion.split(" ")[0] != undefined) ? this.listaSolicitudes[key].fecha_creacion.split(" ")[0] : "";
        filter_values['Valor'] = (this.listaSolicitudes[key].valor != null) ? this.listaSolicitudes[key].valor.trim() : "";
        filter_values['Estado'] = (this.listaSolicitudes[key].estado != undefined) ? (this.listaSolicitudes[key].estado == 'A' ? 'Aprobado' : this.listaSolicitudes[key].estado == 'P' ? 'Pendiente' : 'Denegado'  ) : "";
        this.excelData.push(filter_values);
      })
      this.exportAsXLSX();
      this.lcargando.ctlSpinner(false);
    }
        
      
    
    (error) => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    }
    
  }
  exportarExcel = () => {

    if (this.permissions.exportar == "0") {
      this.toastr.info("Usuario no tiene permiso para exportar");
    } else {
      let data ={
        params: { 
          filter: this.filter 
        }
      }
      let excelData = []
      this.mensajeSppiner = "Generando Archivo Excel..."
      this.lcargando.ctlSpinner(true)
      this.service.getContrataciones({ params: { filter: this.filter } }).subscribe(
        (res: any) => {
          console.log(res)
          if(res.data.length == 0){
            this.toastr.info("No se encontraron datos para generear el reporte Excel")
            this.lcargando.ctlSpinner(false)
          }else{
            let data = {
              title: 'Contrataciones',
              rows:  res.data
            }
            console.log(data)
        
          this.xlsService.exportConsultaContrataciones(data, 'Contrataciones')
          this.lcargando.ctlSpinner(false)
          }
         
          
        },
        (err: any) => {
          console.log(err)
          this.lcargando.ctlSpinner(false)
          this.toastr.error(err.error.message, 'Error cargando Contrataciones')
        }
      )
    }
    
  }

  exportAsXLSX() {
    this.excelService.exportAsExcelFile(this.excelData, 'Reporte de Contratación');
  }

  limpiarFiltro(){
    this.filter = {
      num_solicitud:"",
      estado:['A','P','D'],
      fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      filterControl: "" ,
      proveedor: undefined,
    };
    this.estadoSelected= 0

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10]
    };
  }

  SearchList(event,flag: boolean = false){
    
 
    // console.log(event);
    this.listaSolicitudes = []
    this.mensajeSppiner = "Cargando Programa...";    
    this.lcargando.ctlSpinner(true);
    
    if (flag) this.paginate.page = 1
    let data = {
      id_programa :this.dato_Programa,
      id: this.datoDepartamento,
      params:{
        paginate: this.paginate,
        filter: this.filter
      }

      
    }
    console.log(data);
    this.service.searchSolicitud(data).subscribe((dat)=>{
      console.log(dat);
      if(dat['data'].length == 0){
        this.listaSolicitudes = [];
      }else{
        // this.listaSolicitudes = dat['data'];
        this.paginate.length = dat['data']['total'];
        if (dat['data']['current_page'] == 1) {
          this.listaSolicitudes = dat['data']['data'];
        } else {
          this.listaSolicitudes = Object.values(dat['data']['data']);
        }
      }
      

      this.lcargando.ctlSpinner(false);
    },
    (error)=>{
      console.log(error);
      this.lcargando.ctlSpinner(false);
    }
    )
  }

  limpiar(){
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea limpiar el formulario?.",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
    
      if (result.isConfirmed) {
        this.atribucionParams = {
          programa: null,
          departamento: null,
          atribucion: null
        }
    
        this.atribucionParamsNew = {
          programa: null,
          departamento: null,
          atribucion: null
        }
    
        this.listaSolicitudes = []
      }
    })
    
  }

  expandListProveedores() {
    if (this.permissions.consultar == "0") {
      this.toastr.warning("No tiene permisos consultar Liquidaciones.", this.fTitle);
    } else {
      const modalInvoice = this.modalDet.open(ModalProveedoresComponent, {
        size: "xl",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
      modalInvoice.componentInstance.permissions = this.permissions;
      modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
      //modalInvoice.componentInstance.validacion = 8;
    }
  }

 


}
