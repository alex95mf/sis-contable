import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FormularioCientoTresService } from './formulario-ciento-tres.service'; 
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ExcelService } from 'src/app/services/excel.service';
import { XlsExportService } from 'src/app/services/xls-export.service';
import * as myVarGlobals from 'src/app/global';


@Component({
standalone: false,
  selector: 'app-formulario-ciento-tres',
  templateUrl: './formulario-ciento-tres.component.html',
  styleUrls: ['./formulario-ciento-tres.component.scss']
})
export class FormularioCientoTresComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent; 
  fTitle: string = "Formulario 103-104";
  mensajeSpinner: string = "Cargando...";
  vmButtons: any[] = [];
  dataUser: any;
  permissions: any;

  dataFormularioTres : any =[]
  dataFormularioCuatro : any =[]

  dataFormularioTresExcel : any =[]
  dataFormularioCuatroExcel : any =[]
  selectedReporte: any = undefined;

  selectedForm: any = 'nav-form-tres-tab';
 
  today = moment(new Date()).format('YYYY-MM-DD');
  fecha_desde: string = moment(this.today).startOf('month').format('YYYY-MM-DD');
  fecha_hasta: string = moment(this.today).endOf('month').format('YYYY-MM-DD');
  filter: any;
  paginate: any;
  periodo: any = moment().format('YYYY');
  mes_actual: any = Number(moment(new Date()).format('MM'));
  cmb_periodo: any[] = []
  arrayMes: any = [{id: 0,name: "-Todos-" },{id: 1,name: "Enero"},{id: 2,name: "Febrero"},{id: 3,name: "Marzo"},{id: 4,name: "Abril"},{id: 5,name: "Mayo"},{id:6,name: "Junio"},{id:7,name: "Julio"},{id: 8,name: "Agosto"},{id: 9,name: "Septiembre"},{id: 10,name: "Octubre"},{id: 11,name: "Noviembre"}, {id: 12,name: "Diciembre" }];
  constructor(
    private apiService: FormularioCientoTresService,
    private toastr: ToastrService,
    private excelService: ExcelService,
    private xlsService: XlsExportService,
    private modalService: NgbModal,
  ) {
   }

  ngOnInit(): void {

    this.mes_actual = Number(moment(new Date()).format('MM'))
    Number(moment(new Date()).format('MM'))
    this.vmButtons = [
      {
        orig: "btnsFlujoEfectivo",
        paramAccion: "",
        boton: { icon: "far fa-file-search", texto: "PROCESAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsFormulario",
        paramAccion: "",
        boton: { icon: "far fa-search", texto: "CONSULTAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },      
      { 
        orig: "btnsFormulario", 
        paramAccion: "", 
        boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, 
        permiso: true, 
        showtxt: true, 
        showimg: true, 
        showbadge: false, 
        clase: "btn btn-success boton btn-sm", 
        habilitar: true
      },
      { 
        orig: "btnsFormulario", 
        paramAccion: "", 
        boton: { icon: "fa fa-eraser", texto: "LIMPIAR" }, 
        permiso: true, 
        showtxt: true, 
        showimg: true, 
        showbadge: false, 
        clase: "btn btn-warning boton btn-sm", 
        habilitar: false
      },
    ];
    

    this.filter = {
      // concepto: '',
      // codigo: 'TODOS',
      // fecha_desde: moment().startOf('month').format('YYYY-MM-DD'),
      // fecha_hasta: moment().endOf('month').format('YYYY-MM-DD'),
      // razon_social: '',
      // num_documento: '',
      // estado: '',
      // tasa: '',
      // id_tasa:null,
      // codigo_tasa: '',
      // cuenta_contable: ''

    }
    this.paginate = {
      length: 0,
      perPage: 50,
      page: 1,
      pageSizeOptions: [50,100,500,1000]
    }

    setTimeout(() => {
     //this.cargarConsulta()
     this.cargaInicial()
    }, 75)
  }
  ChangeMesCierrePeriodos(evento: any) { this.mes_actual = evento; } 


  ChangeYearPeriodos(evento:any){
    console.log(evento.periodo);
    this.ChangeMesCierrePeriodos(this.mes_actual)
  }

  async cargaInicial() {
    try {
     
      const resPeriodos = await this.apiService.getPeriodos()
      console.log(resPeriodos)
      this.cmb_periodo = resPeriodos

    } catch (err) {
      console.log(err)
      this.toastr.warning(err.error?.message, 'Error en Carga Inicial')
    }
  }



  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "PROCESAR":
        this.procesarSp()
        break;
      case "CONSULTAR":
        this.cargarConsulta()
        break;
      case "EXCEL":
      this.btnExportarExcel()
        break;
      case "LIMPIAR":
        this.limpiarForm()
          break;
      default:
        break;
    }
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarConsulta();
  }

  periodoSelected(evt: any, year:any){
    this.periodo = evt
  }
  cargarConsulta(){
      if(this.selectedForm == 'nav-form-tres-tab'){
        this.cargarConsultaFormTres()
      }
      if(this.selectedForm == 'nav-form-cuatro-tab'){
        this.cargarConsultaFormCuatro()
      }
  }

  cargarConsultaFormTres(){

    (this as any).mensajeSpinner = 'Cargando...';
    this.lcargando.ctlSpinner(true);
    let data= {
      params: {
        filter: this.filter,
        paginate: this.paginate,
        id_componente: myVarGlobals.fContribuyente,
        periodo: Number(this.periodo),
        mes: Number(this.mes_actual)
      }
    }


    this.apiService.getFormularioTres(data).subscribe(
      (res: any) => {
        console.log(res);
        this.vmButtons[1].habilitar = false;
        if(res.length>0){
         //this.dataCobros = res.data
         //this.paginate.length = res.data.total;
         //this.dataFormularioTres = res.data;
         this.dataFormularioTres = res;
          //  if (res.data.current_page == 1) {
          //    this.dataFormularioTres = res.data;
          //  } else {
          //    this.dataFormularioTres = Object.values(res.data);
          //  }
         this.vmButtons[2].habilitar=false
         this.lcargando.ctlSpinner(false);
        }
        else{
         this.dataFormularioTres =[]
         this.lcargando.ctlSpinner(false);
        }
       
      },
      (err: any) => {
        console.log(err);
        this.lcargando.ctlSpinner(false);
      }
    )
    
  }
  cargarConsultaFormCuatro(){

    (this as any).mensajeSpinner = 'Cargando...';
    this.lcargando.ctlSpinner(true);
    let data= {
      params: {
        filter: this.filter,
        paginate: this.paginate,
        id_componente: myVarGlobals.fContribuyente,
        periodo: Number(this.periodo),
        mes: Number(this.mes_actual)
      }
    }


    this.apiService.getFormularioCuatro(data).subscribe(
      (res: any) => {
        console.log(res);
        this.vmButtons[1].habilitar = false;
        if(res.length>0){
          this.dataFormularioCuatro = res
         //this.dataCobros = res.data
        //  this.paginate.length = res.data.total;
        //  this.dataFormularioCuatro = res.data;
        
        //    if (res.data.current_page == 1) {
        //      this.dataFormularioCuatro = res.data;
        //    } else {
        //      this.dataFormularioCuatro = Object.values(res.data);
        //    }
         this.vmButtons[2].habilitar=false
         this.lcargando.ctlSpinner(false);
        }
        else{
         this.dataFormularioCuatro =[]
         this.lcargando.ctlSpinner(false);
        }
       
      },
      (err: any) => {
        console.log(err);
        this.lcargando.ctlSpinner(false);
      }
    )
    
  }

  procesarSp(){
    if(this.selectedForm == 'nav-form-tres-tab'){
      this.procesarSpCientoTres()
    }
    if(this.selectedForm == 'nav-form-cuatro-tab'){
      this.procesarSpCientoCuatro()
    }
}
  procesarSpCientoTres(){
    if(this.periodo ==undefined){
      this.toastr.info('Debe seleccionar un Período');
    }
    else if(this.mes_actual==undefined || this.mes_actual=='' || this.mes_actual==0){
      this.toastr.info('Debe seleccionar un Mes');
    }
    else{
  
      let data = {
        periodo: Number(this.periodo),
        mes: Number(this.mes_actual)
      }
    
      this.lcargando.ctlSpinner(true);
      this.apiService.procesarSpCientoTres(data).subscribe(res => {
        this.lcargando.ctlSpinner(false);
        Swal.fire({
          icon: "success",
          title: "El proceso fue ejecutado con éxito",
          text: res['message'],
          showCloseButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#20A8D8',
         })
        //this.toastr.info('El proceso fue ejecutado con éxito');
      },error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.mesagge);
      });
    }
   }
   procesarSpCientoCuatro(){
    if(this.periodo ==undefined){
      this.toastr.info('Debe seleccionar un Período');
    }
    else if(this.mes_actual==undefined || this.mes_actual=='' || this.mes_actual==0){
      this.toastr.info('Debe seleccionar un Mes');
    }
    else{
  
      let data = {
        periodo: Number(this.periodo),
        mes: Number(this.mes_actual)
      }
    
      this.lcargando.ctlSpinner(true);
      this.apiService.procesarSpCientoCuatro(data).subscribe(res => {
        this.lcargando.ctlSpinner(false);
        Swal.fire({
          icon: "success",
          title: "El proceso fue ejecutado con éxito",
          text: res['message'],
          showCloseButton: true,
          confirmButtonText: "Aceptar",
          confirmButtonColor: '#20A8D8',
         })
        //this.toastr.info('El proceso fue ejecutado con éxito');
      },error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.mesagge);
      });
    }
   }
  limpiarFiltros() {
    this.filter= {
      // concepto: '',
      // codigo: 'TODOS',
      // fecha_desde: moment().startOf('month').format('YYYY-MM-DD'),
      // fecha_hasta: moment().endOf('month').format('YYYY-MM-DD'),
      // razon_social: '',
      // num_documento: '',
      // estado: '',
      // tasa: '',
      // id_tasa:null,
      // codigo_tasa: '',
      // cuenta_contable: ''
    }
    this.vmButtons[1].habilitar = true;
    this.dataFormularioTres =[]
    this.dataFormularioCuatro =[]
}

limpiarForm(){
  this.periodo = moment().format('YYYY');
  this.mes_actual = Number(moment(new Date()).format('MM'));
  this.dataFormularioTres =[]
  this.dataFormularioCuatro =[]
  this.vmButtons[2].habilitar=true
}

 btnExportarExcel() {

  if(this.selectedForm == 'nav-form-tres-tab'){

    (this as any).mensajeSpinner = "Generando Archivo Excel..."; 
		this.lcargando.ctlSpinner(true); 

    let data= {
      params: {
        filter: this.filter,
        paginate: this.paginate,
        id_componente: myVarGlobals.fContribuyente,
        periodo: Number(this.periodo),
        mes: Number(this.mes_actual)
      }
    }


    this.apiService.getFormularioTres(data).subscribe(
      (res: any) => {
      this.dataFormularioTresExcel = res;
      this.dataFormularioTresExcel.forEach(e => {
        Object.assign(e, {base: parseFloat(e.base),porcentaje: parseFloat(e.porcentaje) / 100,valor_retencion: parseFloat(e.valor_retencion) });
      })
      if(this.dataFormularioTresExcel.length > 0){
        let data = {
				  title: 'Formulario 103',
          rows:  this.dataFormularioTresExcel
				}
        this.xlsService.exportFormularioCientoTres(data, 'Formulario 103')
        this.lcargando.ctlSpinner(false);
      }else{
				this.toastr.info("No hay datos para exportar")
				this.lcargando.ctlSpinner(false); 
			}
      
    }, error => {
			this.toastr.info(error.error.mesagge);
			this.lcargando.ctlSpinner(false);
		});

    // let data = {
    //   title: 'Formulario 103',
    //   rows:  this.dataFormularioTres
    // }
    // console.log(data)
  
    // this.xlsService.exportFormularioCientoTres(data, 'Formulario 103')
  }
  if(this.selectedForm == 'nav-form-cuatro-tab'){

    (this as any).mensajeSpinner = "Generando Archivo Excel..."; 
		this.lcargando.ctlSpinner(true); 

    let data= {
      params: {
        filter: this.filter,
        paginate: this.paginate,
        id_componente: myVarGlobals.fContribuyente,
        periodo: Number(this.periodo),
        mes: Number(this.mes_actual)
      }
    }


    this.apiService.getFormularioCuatro(data).subscribe(
      (res: any) => {
      this.dataFormularioCuatroExcel = res
      this.dataFormularioCuatroExcel.forEach(e => {
        Object.assign(e, {base: parseFloat(e.base),porcentaje: parseFloat(e.porcentaje) / 100,valor_retencion: parseFloat(e.valor_retencion) });
      })
      if(this.dataFormularioCuatroExcel.length > 0){
        let data = {
				  title: 'Formulario 104',
          rows:  this.dataFormularioCuatroExcel
				}
        this.xlsService.exportFormularioCientoCuatro(data, 'Formulario 104')
        this.lcargando.ctlSpinner(false);
      }else{
				this.toastr.info("No hay datos para exportar")
				this.lcargando.ctlSpinner(false); 
			}
      
    }, error => {
			this.toastr.info(error.error.mesagge);
			this.lcargando.ctlSpinner(false);
		});
    // let data = {
    //   title: 'Formulario 104',
    //   rows:  this.dataFormularioCuatro
    // }
    // console.log(data)
  
    // this.xlsService.exportFormularioCientoCuatro(data, 'Formulario 104')
  }

  
}

handleChange(event){
  console.log(event.target.id)
  this.selectedForm = event.target.id
}

 

}
