import { Component, OnInit,ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ReportesIceService } from './reportes-ice.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';
import * as myVarGlobals from 'src/app/global';

import { ExcelService } from 'src/app/services/excel.service';
import { ModalDepartamentosComponent } from 'src/app/config/custom/modal-departamentos/modal-departamentos.component';
import { environment } from 'src/environments/environment';
import { XlsExportService } from 'src/app/services/xls-export.service';



@Component({
  selector: 'app-reportes-ice',
  templateUrl: './reportes-ice.component.html',
  styleUrls: ['./reportes-ice.component.scss']
})
export class ReportesIceComponent implements OnInit {
  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  fTitle = "Reportes ICE";
  msgSpinner: string;
  vmButtons = [];
  dataUser: any;
  permissions: any;
  categorias: any = {};
  subCategorias: any = {};
  ticket: any = {};
  tareas: any = {};

  ticketsDt: any = [];
  
  paginate: any;
  filter: any;

  today: any;
  tomorrow: any;
  firstday: any;
  lastday:any;
  estadoSelected = 0
  prioridadSelected = 0
  estadoList = [
    {value: "P",label: "PENDIENTE"},
    {value: "C",label: "CERRADO"}
  ]
  prioridadList = [
    {value: "A",label: "ALTA"},
    {value: "M",label: "MEDIA"},
    {value: "B",label: "BAJA"},
    
  ]

  tipoTraList = [
    {value: "I",label: "INTERNO"},
    {value: "E",label: "EXTERNO"},
    
  ]
  excelData: any = []
  departamentoSelect: any = {
    dep_nombre:""
  };

  constructor(private reporteIceSrv: ReportesIceService,
    private commonSrv: CommonService,
    private toastr: ToastrService,
    private commonVarSrv: CommonVarService,
    private modalSrv: NgbModal,
    private xlsService: XlsExportService,
    private excelService: ExcelService ) { 
      
    
  


      
    }

  ngOnInit(): void {

    this.vmButtons = [

      {
        orig: "btnsBandejaTrabajo",
        paramAccion: "",
        boton: { icon: "fa fa-search", texto: " CONSULTAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsBandejaTrabajo",
        paramAccion: "",
        boton: { icon: "fa fa-file-excel-o", texto: " EXCEL" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsBandejaTrabajo",
        paramAccion: "",
        boton: { icon: "fa fa-eraser", texto: " LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      }
      /* {
         orig: "btnsBandejaTrabajo",
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
         orig: "btnsTicket",
         paramAccion: "",
         boton: { icon: "far fa-square", texto: " MOSTRAR INACTIVOS" },
         permiso: true,
         showtxt: true,
         showimg: true,
         showbadge: false,
         clase: "btn btn-warning boton btn-sm",
         habilitar: false,
       }*/
     ];
     this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
    this.lastday = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0); 

    
    this.filter = {
      
      fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
      fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
      estado: ['P','C'],
      nombre: "",
      tipo_tramite:0,
      dep_nombre:"",
      id_departamento:0
    
    };

    this.paginate = {
      length: 0,
      perPage: 20,
      page: 1,
      pageSizeOptions: [20, 50,100,200]
    };

   
    setTimeout(()=> {
      this.validaPermisos();
      this.cargarTicketsGlobal();
 //     this.getCatalogoCategoria();
     
    }, 0);

  }
  metodoGlobal(event){
    switch (event.items.boton.texto) {
      case " EXCEL":
          this.exportarExcel();
      break;
      case " CONSULTAR":

      Object.assign(this.paginate, { page: 1 });


  
      
        this.cargarTicketsGlobal();
    break;
    case " LIMPIAR":
      this.limpiarFiltros();
  break;
    }
  }




  validaPermisos() {
    this.mensajeSpinner = "Verificando permisos del usuario...";
    this.lcargando.ctlSpinner(true);

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    let params = {
      codigo: myVarGlobals.fRTTickets,
      id_rol: this.dataUser.id_rol,
    };

    this.commonSrv.getPermisionsGlobas(params).subscribe(
      (res) => {
       // console.log(res);
        this.permissions = res["data"][0];
        if (this.permissions.ver == "0") {
          this.lcargando.ctlSpinner(false);
          this.toastr.warning("No tiene permisos para ver este formulario.", this.fTitle);
          this.vmButtons = [];
        } else {
          this.cargarTicketsGlobal();
        }
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

 

   asignarEstado(evt) {
    this.filter.estado = [evt]
   }
   asignarPrioridad(evt) {
    this.filter.prioridad = [evt]
   }

  cargarTicketsGlobal() {
    this.mensajeSpinner = "Cargando listado de Tramites...";
    this.lcargando.ctlSpinner(true);

    let data = {
      params: {
        filter: this.filter,
        paginate: this.paginate
      }
    }
    console.log(data);
    
    
    this.reporteIceSrv.getReportesIce(data).subscribe(
      (res) => {
        console.log(res);

      //  return;
        this.ticketsDt = res['data']['data'];
        this.paginate.length = res['data']['total'][0]['count'];

        this.lcargando.ctlSpinner(false);

        return;
        if (res['data']['current_page'] == 1) {
          this.ticketsDt = res['data']['data'];
        } else {
           this.ticketsDt = Object.values(res['data']['data']);
          console.log(this.ticketsDt)
        }

        this.ticketsDt.forEach((e: any) => {

            //CALCULO DE LA FECHA MAXIMA PARA GESTION DEL TRAMITE
            let today = moment()//hoy
            let fecha = new Date(e.tramites?.fecha); //fecha de creacion del tramite
            let diasConf = parseInt(e.tareas?.dias_totales); // Dias totales configurados
            fecha.setDate(fecha.getDate() + diasConf); // Sumamos los dias totales a la fecha
            let fechaM = moment(fecha).format('YYYY-MM-DD') //Formateamos la fecha
            Object.assign(e, { fecha_maxima: fechaM }) //Asignamos la fecha maxima al arreglo de tramites

            let dias_trascurridos =  Math.abs(today.diff(moment(e.tramites?.fecha), 'days'))
            let dias_vencidos = moment(fechaM).diff(moment(fecha), 'days')
            let dias_disponibles = parseInt(e.tareas?.dias_totales)

          // CALCULO DE EL TIEMPO TRASCURRIDO DESDE EL INICIO DEL TRAMITE
          if(e.tareas != null && e.tareas.dias_totales != null){
            
            let fecha_vencida = moment(fechaM).add( 1, 'days')
            if(fecha_vencida<=today){
              Object.assign(e, {vencimientoT: 'día(s) transcurrido(s)', diasT: Math.abs(dias_vencidos),dias_trans:dias_trascurridos, classT: 'text-danger'})
            }else if(fecha_vencida==today){
              Object.assign(e, {vencimientoT: 'día(s) para gestionar', diasT: Math.abs(today.diff(fecha_vencida, 'days')), dias_trans:dias_trascurridos,classT: 'text-warning' })
            }else if(fecha_vencida > today && today.diff(fecha_vencida, 'days') != 0){
              Object.assign(e, {vencimientoT: 'día(s) para gestionar', diasT: Math.abs(today.diff(fecha_vencida, 'days')),dias_trans:dias_trascurridos,classT: 'text-success' })
            }else if(fecha_vencida > today && today.diff(fecha_vencida, 'days') == 0){
              Object.assign(e, { vencimientoT: 'Tiene '+dias_disponibles+' días(s) para gestionar', diasT:'',dias_trans:dias_trascurridos, class: 'text-success' })
            }
          }

          if(e.flujo_pasos != null && e.flujo_pasos.dias != null){
          if(e.estado_seguimiento=='P'){
            console.log('Pendiente')
            if (e.fecha) {
              let dias_disponibles = parseInt(e.flujo_pasos.dias)
              let fecha_creacion = moment(e.fecha)
              let today = moment()
              let fecha_vencida = moment(e.fecha).add(dias_disponibles + 1, 'days')
            /*  console.log('fecha en que vence '+moment(fecha_vencida).format('YYYY/MM/DD'))
              console.log('fecha en que se creo '+moment(moment(e.fecha)).format('YYYY/MM/DD'))
              console.log('diferencia de dias ' +moment(Math.abs(moment().diff(fecha_vencida, 'days'))).format('YYYY/MM/DD'))*/
              if(fecha_vencida<=today){
                Object.assign(e, {fecha_v:fecha_vencida, vencimiento: 'día(s) vencido(s)', dias: Math.abs(today.diff(moment(e.fecha).add(dias_disponibles, 'days'), 'days')),dias_config: dias_disponibles, class: 'text-danger'})
              }else if(fecha_vencida==today){
                Object.assign(e, {fecha_v:fecha_vencida, vencimiento: 'día(s) para gestionar', dias: Math.abs(today.diff(fecha_vencida, 'days')),dias_config: dias_disponibles, class: 'text-warning' })
              }else if(fecha_vencida > today && today.diff(fecha_vencida, 'days') != 0){
                Object.assign(e, { fecha_v:fecha_vencida,vencimiento: 'día(s) para gestionar', dias: Math.abs(today.diff(fecha_vencida, 'days')),dias_config: dias_disponibles, class: 'text-success' })
              }else if(fecha_vencida > today && today.diff(fecha_vencida, 'days') == 0){
                Object.assign(e, { fecha_v:fecha_vencida,vencimiento: 'Tiene '+dias_disponibles+' días(s) para gestionar', dias:'',dias_config: dias_disponibles, class: 'text-success' })
              }

              
            }
          }else{
            console.log('diferente de Pendiente')
            if (e.updated_at) {
              let dias_disponibles = parseInt(e.flujo_pasos.dias)
              let fecha_creacion = moment(e.fecha)
              let today = moment(e.updated_at)
              let fecha_vencida = fecha_creacion.add(dias_disponibles, 'days')

              if(fecha_vencida<=today){
                Object.assign(e, {fecha_v:fecha_vencida, vencimiento: 'Se gestionó en '+Math.abs(today.diff(fecha_vencida, 'days'))+' día(s)', dias: '',dias_config: dias_disponibles, class: 'text-danger'})
              }else if(fecha_vencida==today){
                Object.assign(e, {fecha_v:fecha_vencida, vencimiento: 'día(s) para gestionar', dias: Math.abs(today.diff(fecha_vencida, 'days')),dias_config: dias_disponibles, class: 'text-warning' })
              }else if(fecha_vencida > today && today.diff(fecha_vencida, 'days') != 0){
                Object.assign(e, { fecha_v:fecha_vencida,vencimiento: 'Se gestionó en '+Math.abs(today.diff(fecha_vencida, 'days'))+' día(s)', dias: '',dias_config: dias_disponibles, class: 'text-success' })
                
                // if (e.id_tramite_seguimiento==89){
                //   console.log('fecha en que vence '+moment(fecha_vencida).format('YYYY/MM/DD'))
                //   console.log('fecha en que se creo '+moment(moment(e.updated_at)).format('YYYY/MM/DD'))
                //   console.log(Object.assign(e, { fecha_v:fecha_vencida,vencimiento: 'día(s) para gestionar', dias: Math.abs(today.diff(fecha_vencida, 'days')),dias_config: dias_disponibles, class: 'text-success' })
                //   )
                // }


              }else if(fecha_vencida > today && today.diff(fecha_vencida, 'days') == 0){
                Object.assign(e, { fecha_v:fecha_vencida,vencimiento: 'Se gestionó en '+dias_disponibles+' días(s)', dias:'',dias_config: dias_disponibles, class: 'text-success' })
               
              }
            }
          }
        }
          
        })
        this.lcargando.ctlSpinner(false);
       
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    )
  }
  exportarExcel() {
    
    this.mensajeSpinner = "Generando Archivo Excel...";
    this.lcargando.ctlSpinner(true); 


    this.ticketsDt.forEach(item => {
      item.total_ice = parseFloat(item.total_ice);
      item.porcentaje_ice = parseFloat(item.porcentaje_ice);
    });


    let data = {
      title: 'Detalle Ice',
      fecha_desde: this.filter.fecha_desde,
      fecha_hasta:this.filter.fecha_hasta,
      rows: this.ticketsDt
    }
    this.xlsService.exportExcelReporteIce(data, 'ice')
    this.lcargando.ctlSpinner(false); 
    return;
    this.excelData = [];
          Object.keys(this.ticketsDt).forEach(key => {
            let filter_values = {};
            filter_values['ID'] = key;
            filter_values['Fecha'] = (this.ticketsDt[key].tramites?.fecha.split(" ")[0] != undefined) ? this.ticketsDt[key].tramites?.fecha.split(" ")[0] : "";
            filter_values['Usuario Creador'] = (this.ticketsDt[key]?.usuario?.nombre != null) ? this.ticketsDt[key]?.usuario?.nombre.trim() : "";
            filter_values['Departamento'] = (this.ticketsDt[key]?.usuario?.departamento?.dep_nombre != null) ? this.ticketsDt[key]?.usuario?.departamento?.dep_nombre.trim() : "";
            filter_values['Nombre Trámite'] = (this.ticketsDt[key].tareas?.nombre != null) ? this.ticketsDt[key].tareas?.nombre.trim() : "";
            filter_values['Observación Trámite'] = (this.ticketsDt[key].tramites?.observacion != undefined) ? this.ticketsDt[key].tramites?.observacion.trim() : "";
            filter_values['Estado Trámite'] = (this.ticketsDt[key].estado != undefined) ? (this.ticketsDt[key].estado == 'P' ? 'Pendiente' : 'Cerrado') : '';
            filter_values['Fecha Seguimiento'] = (this.ticketsDt[key].fecha.split(" ")[0] != undefined) ? this.ticketsDt[key].fecha.split(" ")[0] : "";
            filter_values['Estado Seguimiento'] = (this.ticketsDt[key].estado != undefined) ? (this.ticketsDt[key].estado == 'P' ? 'Pendiente' : 'Cerrado') : '';
            filter_values['Observación Seguimiento'] = (this.ticketsDt[key].observacion != undefined) ? this.ticketsDt[key].observacion : "";
            filter_values['Respuesta'] = (this.ticketsDt[key].respuesta != undefined) ? (this.ticketsDt[key].respuesta == 'S' ? 'Si' : 'N') : '';
            

            this.excelData.push(filter_values);
          })

        
          this.exportAsXLSX();
          this.lcargando.ctlSpinner(false); 
  }
  exportAsXLSX() {
    this.excelService.exportAsExcelFile(this.excelData, 'Excel Trámites');
  }

  
  descargarPdf(tramite){
    console.log(tramite.tramite.id_tramite)
    window.open(environment.ReportingUrl + "rep_administracion_tramites_cierre.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_tramite=" + tramite.id_tramite , '_blank')

  }




  modalDepartamentos(){
    let modal = this.modalSrv.open(ModalDepartamentosComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })
  }


  limpiarFiltros() {
     this.filter = {
       fecha_desde: moment(this.firstday).format('YYYY-MM-DD'),
       fecha_hasta: moment(this.today).format('YYYY-MM-DD'),
       estado: ['P','C'],
       nombre: "",
       tipo_tramite:0,
       dep_nombre:""
     }
     this.estadoSelected = 0
     this.prioridadSelected = 0
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarTicketsGlobal();
  }

 
}
