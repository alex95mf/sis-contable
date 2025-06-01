import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'node_modules/sweetalert2/dist/sweetalert2';
import * as moment from 'moment';
import { CatalogoElectronicoService } from './catalogo-electronico.service';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import * as myVarGlobals from "../../../global";
import { XlsExportService } from 'src/app/services/xls-export.service';


@Component({
standalone: false,
  selector: 'app-catalogo-electronico',
  templateUrl: './catalogo-electronico.component.html',
  styleUrls: ['./catalogo-electronico.component.scss']
})
export class CatalogoElectronicoComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false })
   lcargando: CcSpinerProcesarComponent;
  mensajeSppiner: string = "Cargando...";
  fTitle: string = "Infimas";
  msgSpinner: string
  dataUser: any
  permissions: any
  viewSolicitudes: boolean = true
  consultaSolicitudes: boolean = true;
  detalleSolicitud: boolean = false;
  cmb_periodo: any[] = []
  programa: any = [];
  departamento: any = [];
  atribucion: any = [];
  programaPrin: any = [];
  departamentoPrin: any = [];
  atribucionPrin: any = [];

  listaSolicitudes: any = [];
  listaSolicitudesAtribucion: any = [];
  today: any;
  tomorrow: any;
  firstday: any;
  lastday:any;


  nuevaS: any = {}

  total: any = 0;

  vmButtons: any;

  item: any ={}

  atribucionParams: any = {
    programa: null,
    departamento: null,
    atribucion: null
  }
  binding: any

  paginate: any = {
    length: 0,
    perPage: 10,
    page: 1,
    pageIndex: 0,
    pageSizeOptions: [5, 10]
  };
  filter: any = {
    fecha_desde: moment().startOf('month').format('YYYY-MM-DD'),
    fecha_hasta: moment().format('YYYY-MM-DD'),
  };
  dato_Programa: any = []
  datoDepartamento: any = []
  masterSelected: boolean = false
  dropdownSettings:IDropdownSettings = {};

  //periodo: Date = new Date();

  periodo: any = new Date();
  constructor(
    private service: CatalogoElectronicoService,
    private router: Router,
    private toastr: ToastrService,
    private modalDet: NgbModal,
    private commonVrs: CommonVarService,
    private commonService: CommonService,
    private xlsService: XlsExportService,
  ) { }
  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsCatElec", 
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
        orig: "btnsCatElec",
        paramAccion: "",
        boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      },
      { orig: "btnsCatElec",
       paramAccion: "1", 
       boton: { icon: "fas fa-eraser", texto: "EXCEL" }, 
       permiso: true, 
       showtxt: true, 
       showimg: true, 
       showbadge: false, 
       clase: "btn btn-success btn-sm", 
       habilitar: false, 
       imprimir: true
      }
    ]

    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
    this.lastday = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0); 

    this.vmButtons[0].showimg=false
    this.vmButtons[1].showimg=false
    this.periodo =  moment().format('YYYY');

    // this.vmButtons[0].showimg=false

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    setTimeout(async () => 
   {
      this.validaPermisos()
      await this.cargaInicial()
    }, 500);

  }


  async cargaInicial() {
    try {
      this.msgSpinner = "Carga Inicial"
      const resPeriodos = await this.service.getPeriodos()
      console.log(resPeriodos)
      this.cmb_periodo = resPeriodos
    } catch (err) {
      console.log(err)
      this.toastr.warning(err.error?.message, 'Error en Carga Inicial')
    }
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
  onMaterialGroupChange(event){
    console.log(event);
  }
  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.SearchList({});
  }

  periodoSelected(evt: any, year:any){
    console.log(evt)
    this.periodo = evt
    if(evt){
      this.cargarPrograma();
    }
  }


  metodoGlobal(event: any) {
   
    switch (event.items.boton.texto) {
    
      case "REGRESAR":
        this.consultaSolicitudes = true;
        this.detalleSolicitud = false
        this.vmButtons[1].showimg=false
        this.vmButtons[0].showimg=false
        break;
        case "EXCEL":
          this.exportarExcel();
          break;
    }
  }

  // cargarPrograma(){
  //   this.mensajeSppiner = "Cargando Programa...";    
  //   this.lcargando.ctlSpinner(true);

  //   this.service.searchPrograma({}).subscribe((res: any)=>{
  //     console.log(res);
  //     res.map((data)=>{
  //       this.programa.push(data.catalogo)
  //       this.lcargando.ctlSpinner(false);
  //     })
  //   })
  // }
  // cargarPrograma(){
  //   this.mensajeSppiner = "Cargando Programa...";    
  //   this.lcargando.ctlSpinner(true);

  //   this.service.searchPrograma({}).subscribe((res: any)=>{
  //     // console.log(res);
  //     let program = []
  //     res.map((data)=>{
        
  //       let dat = {
  //         ...data.catalogo,
  //         value: data.catalogo['descripcion'] + '-'+ data.catalogo['valor']
  //       }
  //       program.push(dat)
  //       this.lcargando.ctlSpinner(false);
  //     })
  //     this.programa = program
  //     console.log(this.programa);
  //   })
  // }
  cargarPrograma(){
    this.mensajeSppiner = "Cargando Programa...";    
    this.lcargando.ctlSpinner(true);
    let data ={
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
  //   this.mensajeSppiner = "Cargando Programa...";    
  //   this.lcargando.ctlSpinner(true);

  //   let data = {
  //     programa: event
  //   }
  //   console.log('Programa '+data.programa);
  //   this.service.searchDepartamento(data).subscribe((data)=>{
  //     //console.log(data);
  //     this.departamento = data
  //     this.lcargando.ctlSpinner(false);
  //   })
  // }
  // departamentoSearch(event){
  //   // console.log(event);
  //   this.mensajeSppiner = "Cargando Programa...";    
  //   this.lcargando.ctlSpinner(true);
  
  //   let data = {
  //     programa: this.dato_Programa //event.valor
  //   }
  //   console.log(data);
  //   this.service.searchDepartamento(data).subscribe((data: any)=>{
  //     console.log(data);
  //     let depa = []
  //     data.map((res)=>{
  //       let d = {
  //         ...res,
  //         value: res['descripcion'] + '-'+ res['valor'],
  
  //       }
  //       depa.push(d)
  //     })
  //     this.departamento = depa
  //     console.log(this.departamento);
  //     this.lcargando.ctlSpinner(false);
  //   })
  //   }
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
      this.departamentoPrin = depa
      console.log(this.departamento);
      this.lcargando.ctlSpinner(false);
    })
    }

  AtribucionSearch(event){
    //console.log(event);
    this.mensajeSppiner = "Cargando Programa...";    
    this.lcargando.ctlSpinner(true);
    let data = {
      departamento: event
    }
    this.service.searchAtribucion(data).subscribe((dat)=>{
      console.log('atribucion '+dat);
      this.atribucion = dat['data']
      this.lcargando.ctlSpinner(false);
    })
  }

  selectAll() {
    this.listaSolicitudesAtribucion.map((e: any) => e.check = this.masterSelected)
    
  }
  // SearchList(){
  //   // console.log(event);
  //   this.listaSolicitudes = []
  //   this.mensajeSppiner = "Cargando...";    
  //   this.lcargando.ctlSpinner(true);
    
    
  //   let data = {
  //     id: this.datoDepartamento,
  //     params:{
  //       paginate: this.paginate,
  //       filter: this.filter
  //     }

      
  //   }
  //   console.log(data);
  //   this.service.searchSolicitud(data).subscribe((dat)=>{
  //     console.log(dat);
  //     if(dat['data'].length == 0){
  //       this.listaSolicitudes = [];
  //     }else{
  //       // this.listaSolicitudes = dat['data'];
  //       this.paginate.length = dat['data']['total'];
  //       if (dat['data']['current_page'] == 1) {
  //         this.listaSolicitudes = dat['data'];
  //       } else {
  //         this.listaSolicitudes = Object.values(dat['data']);
  //       }
  //     }
  SearchList(event,flag: boolean = false){
    let invalid = ''
    //alert(this.periodo);
    // Validar que la fecha periodo y las del filtro coincidan
    if (this.periodo !== moment(this.filter.fecha_desde, 'YYYY-MM-DD').year().toString() || 
    this.periodo !== moment(this.filter.fecha_hasta, 'YYYY-MM-DD').year().toString()) {
  invalid += '* Rango de fechas inválido.<br>';
}

    
    if (moment(this.filter.fecha_hasta).isBefore(this.filter.fecha_desde)) {
      invalid += '* Rango de fechas invalida.<br>'
    }

    if (invalid.length > 0) {
      this.toastr.warning(invalid, 'Validacion de Datos', {enableHtml: true})
      return
    }

    // console.log(event);
    this.listaSolicitudes = []
    this.mensajeSppiner = "Cargando...";    
    this.lcargando.ctlSpinner(true);
    
    if (flag) Object.assign(this.paginate, {page: 1, pageIndex: 0})
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
      this.service.getCataElectronico({ params: { filter: this.filter } }).subscribe(
        (res: any) => {
          console.log(res)
          if(res.data.length == 0){
            this.toastr.info("No se encontraron datos para generear el reporte Excel")
            this.lcargando.ctlSpinner(false)
          }else{
            // Procesar ordenes
            // let array = []
            //  let order =''
            // res.data.forEach((element: any) => {
            //   array['order'] = JSON.parse(element.ordenes);
            //   console.log(array)
            //   let ord = {}
            //   array['order'].forEach(ordenes => {
            //     ord=  ordenes.o
            //     Object.assign(element,{ordenes: ord})
            //   });
              
             
            // });
            let data = {
              title: 'Catalogo Eletrónico',
              rows:  res.data
            }
            console.log(data)
        
          this.xlsService.exportConsultaCataElectronico(data, 'Catalogo Eletrónico')
          this.lcargando.ctlSpinner(false)
          }
         
          
        },
        (err: any) => {
          console.log(err)
          this.lcargando.ctlSpinner(false)
          this.toastr.error(err.error.message, 'Error cargando reporte de Catalogo Eletrónico')
        }
      )
    }
    
  }

  //     this.lcargando.ctlSpinner(false);
  //   },
  //   (error)=>{
  //     console.log(error);
  //     this.lcargando.ctlSpinner(false);
  //   }
  //   )
  // }

  // SearchList(event){
  //   console.log("Atribucion "+event);
  //   this.mensajeSppiner = "Cargando Programa...";    
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
  //     }

  //   }
  //   this.service.searchSolicitud(data).subscribe((dat)=>{
  //     console.log(dat);
  //     if(dat['data'].length == 0){
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

  catalogoElecDetalle(item){
   //alert(item)
    console.log('Solicitud '+item.id_solicitud)
    this.consultaSolicitudes = false;
    this.detalleSolicitud = true;
    this.vmButtons[0].showimg=false;
    this.vmButtons[1].showimg=true;
    this.item =  item;
  }
  

}
