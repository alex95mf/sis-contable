import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'node_modules/sweetalert2/dist/sweetalert2';
import * as moment from 'moment';
import { InfimasService } from './infimas.service';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DetalleInfimasComponent } from './detalle-infimas/detalle-infimas.component';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ModalProveedoresComponent } from 'src/app/config/custom/modal-proveedores/modal-proveedores.component';
import * as myVarGlobals from "../../../global";
import { XlsExportService } from 'src/app/services/xls-export.service';




@Component({
standalone: false,
  selector: 'app-infimas',
  templateUrl: './infimas.component.html',
  styleUrls: ['./infimas.component.scss']
})
export class InfimasComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false })
   lcargando: CcSpinerProcesarComponent;

  fTitle: string = "Infimas";
  mensajeSpinner: string
  dataUser: any
  permissions: any
  viewSolicitudes: boolean = true
  consultaSolicitudes: boolean = true;
  detalleSolicitud: boolean = false;

  programa: any = [];
  departamento: any = [];
  atribucion: any = [];
  programaPrin: any = [];
  departamentoPrin: any = [];
  atribucionPrin: any = [];

  listaSolicitudes: any = [];
  listaSolicitudesAtribucion: any = [];


  cmb_periodo: any[] = []

  today: any;
  tomorrow: any;
  firstday: any;
  lastday:any;

  fecha: Date = new Date();
  periodo: any = new Date();
  estadoList = [
    {value: "A",label: "Aprobado"},
    {value: "P",label: "Pendiente"},
    {value: "D",label: "Denegado"},
  ]

  nuevaS: any = {}

  total: any = 0;

  vmButtons: any;

  item: any ={}
  estadoSelected: any = 0

  atribucionParams: any = {
    programa: null,
    departamento: null,
    atribucion: null
  }
  binding: any

  paginate: any;
  filter: any;
  dato_Programa: any = []
  datoDepartamento: any = []

  masterSelected: boolean = false
  dropdownSettings:IDropdownSettings = {};
  verifyRestore = false;
  proveedorActive: any = {
    razon_social: ""
  };

  constructor(
    private service: InfimasService,
    private router: Router,
    private modalDet: NgbModal,
    private commonVrs: CommonVarService,
    private toastr: ToastrService,
    private commonService: CommonService,
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
      {
        orig: "btnsComprasPI",
        paramAccion: "1",
        boton: { icon: "fas fa-save", texto: "Guardar" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning btn-sm",
        habilitar: false,
        imprimir: false
      }
      ,
      {
        orig: "btnsComprasPI",
        paramAccion: "",
        boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      },
     { orig: "btnsComprasPI",
        paramAccion: "1",
        boton: { icon: "fas fa-search", texto: "CONSULTAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary btn-sm",
        habilitar: false,
        imprimir: false
      },
        { orig: "btnsComprasPI",
          paramAccion: "1",
          boton: { icon: "fas fa-eraser", texto: "LIMPIAR" },
          permiso: true,
          showtxt: true,
          showimg: true,
          showbadge: false,
          clase: "btn btn-danger btn-sm",
          habilitar: false,
          imprimir: false
        },

      { orig: "btnsComprasPI",
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
    this.lastday = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0);

    this.periodo =  moment().format('YYYY');


    this.filter = {
      num_solicitud:"",
      //estado:['A','P','D'],
      estado:"",
      proveedor: undefined,
      fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      filterControl: ""
    };

    this.paginate = {
      length: 0,
      perPage: 20,
      page: 1,
      pageSizeOptions: [20, 50,100,200]
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

    setTimeout(async () => {
      // this.cargarPrograma();
      // this.SearchList({});
      this.validaPermisos()
      await this.cargaInicial()
    }, 500);

  }

  async cargaInicial() {
    try {
      (this as any).mensajeSpinner = "Carga Inicial"
      const resPeriodos = await this.service.getPeriodos()
      console.log(resPeriodos)
      this.cmb_periodo = resPeriodos
    } catch (err) {
      console.log(err)
      this.toastr.warning(err.error?.message, 'Error en Carga Inicial')
    }
  }

  validaPermisos = () => {
    (this as any).mensajeSpinner = 'Cargando Permisos de Usuario...';
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

      case "REGRESAR":
        this.consultaSolicitudes = true;
        this.detalleSolicitud = false
        this.vmButtons[0].showimg=false
        this.vmButtons[1].showimg=false;
        this.vmButtons[2].showimg=true;
        this.vmButtons[3].showimg=true;
        break;
        case "EXCEL":
          this.exportarExcel();
          break;

          case"CONSULTAR":
          this.SearchList(this.atribucionParams.atribucion,true);
        break;

        case"LIMPIAR":
        this.limpiarFiltro();
      break;

    }
  }

  // cargarPrograma(){
  //   (this as any).mensajeSpinner = "Cargando Programa...";
  //   this.lcargando.ctlSpinner(true);

  //   this.service.searchPrograma({}).subscribe((res: any)=>{
  //     console.log(res);
  //     res.map((data)=>{

  //       this.programaPrin.push(data.catalogo)
  //       this.lcargando.ctlSpinner(false);
  //     })
  //   })
  // }
  cargarPrograma(){
    (this as any).mensajeSpinner = "Cargando Programa...";
    this.lcargando.ctlSpinner(true);
    let data ={
      //periodo: this.periodo.getFullYear(),
      periodo: Number(this.periodo),
    }
    this.service.searchPrograma(data).subscribe((res: any)=>{
      // console.log(res);
      let program = []
      res.map((data)=>{

        let dat = {
          ...data.catalogo,
          value: data.catalogo['descripcion'] + '-'+ data.catalogo['valor']
        }
        program.push(dat)
        this.lcargando.ctlSpinner(false);
      })
      this.programaPrin = program
      this.lcargando.ctlSpinner(false);
      console.log(this.programa);
    })
  }

  // departamentoSearch(event){
  //   //console.log('Programa '+event);
  //   (this as any).mensajeSpinner = "Cargando Programa...";
  //   this.lcargando.ctlSpinner(true);

  //   let data = {
  //     programa: event
  //   }
  //   console.log('Programa '+data.programa);
  //   this.service.searchDepartamento(data).subscribe((data)=>{
  //     //console.log(data);

  //     this.departamentoPrin = data
  //     this.lcargando.ctlSpinner(false);
  //   })
  // }
  departamentoSearch(event){
    // console.log(event);
    (this as any).mensajeSpinner = "Cargando Programa...";
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
      this.departamentoPrin = depa
      console.log(this.departamento);
      this.lcargando.ctlSpinner(false);
    })
    }

  selectAll() {
    this.listaSolicitudesAtribucion.map((e: any) => e.check = this.masterSelected)

  }

  AtribucionSearch(event){
    //console.log(event);
    (this as any).mensajeSpinner = "Cargando Programa...";
    this.lcargando.ctlSpinner(true);
    let data = {
      departamento: event
    }
    this.service.searchAtribucion(data).subscribe((dat)=>{
      console.log('atribucion '+dat);

      this.atribucionPrin = dat['data']
      this.lcargando.ctlSpinner(false);
    })
  }
  // SearchList(event){
  //   console.log("Atribucion "+event);
  //   (this as any).mensajeSpinner = "Cargando Programa...";
  //   this.lcargando.ctlSpinner(true);
  //   // let data = {
  //   //   id: event,
  //   //   paramns:{
  //   //     paginate: this.paginate,
  //   //     filter: this.filter
  //   //   }

  //   // }
  //   let data = {
  //     atribucion:{
  //       id_catalogo: event
  //     },
  //     paramns:{
  //           paginate: this.paginate,
  //           filter: this.filter
  //         }

  //   }
  //   this.service.searchSolicitud(data).subscribe((dat)=>{
  //     console.log(dat);
  //     if(dat['data'].length == 0){
  //       console.log(dat['data'])
  //       this.listaSolicitudes = [];
  //     }else{
  //       this.listaSolicitudes = dat['data'];
  //     }
  //     // this.atribucionParams = {
  //     //   programa: null,
  //     //   departamento: null,
  //     //   atribucion: null
  //     // }

  //     this.lcargando.ctlSpinner(false);
  //   },
  //   (error)=>{
  //     console.log(error);
  //     this.lcargando.ctlSpinner(false);
  //   }
  //   )
  // }
  SearchList(event,flag: boolean = false){
    // console.log(event);
    this.listaSolicitudes = []
    (this as any).mensajeSpinner = "Cargando Programa...";
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

  infimasDetalle(item){
    console.log('Solicitud '+item.id_solicitud)
    this.consultaSolicitudes = false;
    this.detalleSolicitud = true;
    this.vmButtons[0].showimg=false
    this.vmButtons[1].showimg=true;
    this.vmButtons[2].showimg=false;
    this.vmButtons[3].showimg=false;
    this.item =  item
  }
  limpiarFiltro(){
    this.filter = {
      num_solicitud:"",
      estado:['A','P','D'],
      proveedor: undefined,
      fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      filterControl: ""
    };
    this.estadoSelected= 0

    this.paginate = {
      length: 0,
      perPage: 20,
      page: 1,
      pageSizeOptions: [20, 50,100,200]
    };
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
      (this as any).mensajeSpinner = "Generando Archivo Excel..."
      this.lcargando.ctlSpinner(true);
      this.service.getInfimas({ params: { filter: this.filter } }).subscribe(
        (res: any) => {
          console.log(res)
          if(res.data.length == 0){
            this.toastr.info("No se encontraron datos para generear el reporte Excel")
            this.lcargando.ctlSpinner(false)
          }else{
            let data = {
              title: 'Infimas',
              rows:  res.data
            }
            console.log(data)
          this.xlsService.exportConsultaInfimas(data, 'Infimas')
          this.lcargando.ctlSpinner(false)
          }


        },
        (err: any) => {
          console.log(err)
          this.lcargando.ctlSpinner(false)
          this.toastr.error(err.error.message, 'Error cargando Infimas')
        }
      )
    }

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
