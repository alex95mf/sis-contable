import { Component, OnInit,ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { environment } from 'src/environments/environment';
import { ButtonRadioActiveComponent } from '../../../../config/custom/cc-panel-buttons/button-radio-active.component';
import * as moment from 'moment';
import { ConsultaMovimientosService } from './consulta-movimientos.service';
import { ExcelService } from 'src/app/services/excel.service';



@Component({
standalone: false,
  selector: 'app-consulta-movimientos',
  templateUrl: './consulta-movimientos.component.html',
  styleUrls: ['./consulta-movimientos.component.scss']
})
export class ConsultaMovimientosComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent; 
  fTitle: string = "Consulta de Movimientos";
  mensajeSpinner: string = "Cargando...";

  vmButtons: any[] = [];
  dataUser: any;
  arrayData2: any=[];
  permissions: any;
  excelData: any [];
  catalog: any = [];
  tipo: any = [];
  motivoC = [];
  motivosCR = [];
  tipoTraslado: any = [];
  dataReporte: any = [];
  arrayBodega: Array<any> = [];

  documento: any = {
    tipo_documento: "", // concepto.codigo
  }

  reportes= [
    {value: 'ING', label:'Ingresos'},
    {value: 'EGR', label:'Egresos'},
    {value: 'TRA', label:'Traslados'},
  ];

  tipoIngreso: any = 0
  motivo: any = 0;
  tipoEgreso: any = 0;
  tipo_traslado: any = 0;
  motivoBol = true;
  observaciones: any = '';
  vehiculo: any = '';
  selectedBodegaOrigen = 0
  selectedBodegaDestino = 0

  today: any;
  tomorrow: any;
  firstday: any;
  lastday:any;
  fecha_desde: any;
  fecha_hasta:any;
 
  selectedReporte: any = 0;


  //today = moment(new Date()).format('YYYY-MM-DD');
 



  constructor(
    private apiService: ConsultaMovimientosService,
    private toastr: ToastrService,
    private excelService: ExcelService,
  ) { }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsRenConsultaReporte",
        paramAccion: "",
        boton: { icon: "far fa-search", texto: "CONSULTAR" },
        clase: "btn btn-primary boton btn-sm",
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: "btnsRenConsultaReporte",
        paramAccion: "",
        boton: { icon: "far fa-eraser", texto: "LIMPIAR" },
        clase: "btn btn-warning boton btn-sm",
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        habilitar: false,
      },
      {
        orig: "btnsRenConsultaReporte",
        paramAccion: "",
        boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" },
        clase: "btn btn-success boton btn-sm",
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        habilitar: true
      },
    ];
    
  this.today = new Date();
  this.tomorrow = new Date(this.today);
  this.tomorrow.setDate(this.tomorrow.getDate() + 1);
  this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
  this.lastday = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0); 

  this.fecha_desde= moment(this.firstday).format('YYYY-MM-DD'),
  this.fecha_hasta=moment(this.today).format('YYYY-MM-DD'),

  

    setTimeout(() => {
      this.getCatalogos()
      this.cargaBodegas()

    }, 75)
    
  }
  
  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "CONSULTAR":
        this.mostrarReporte()
        break;
      case "LIMPIAR":
          this.limpiarForm()
          break;
      case "EXCEL":
        this.exportExcel()
        break;
      default:
        break;
    }
  }

  tipoReporteSelected(event){
    console.log(event);
    if(event == 'ING'){
      this.tipoEgreso = 0
      this.motivo = 0
      this.tipo_traslado = 0
    }else if(event == 'EGR'){
      this.tipoIngreso = 0
      this.tipo_traslado = 0
    }else if(event == 'TRA'){
      this.tipoEgreso = 0
      this.motivo = 0
      this.tipoIngreso = 0
    }
  }
  async cargaBodegas() {
    this.lcargando.ctlSpinner(true);
    try {
      (this as any).mensajeSpinner = 'Cargando Bodegas'
      let bodegas: Array<any> = await this.apiService.getBodegas();
      this.arrayBodega = bodegas
    
      this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error en Carga Bodegas')
    }
  }

  getCatalogos() {
    this.lcargando.ctlSpinner(true);
    let data = {
      params: " 'INV_TIPO_INGRESO','INV_TIPO_EGRESO','INV_MOTIVO_EGRESO','INV_TIPO_TRASLADO'",
    };
    this.apiService.getCatalogs(data).subscribe(
      (res) => {
        console.log(res);
        this.catalog = res["data"]["INV_TIPO_INGRESO"];
        this.tipo = res["data"]["INV_TIPO_EGRESO"];
        this.motivoC = res["data"]["INV_MOTIVO_EGRESO"];
        this.tipoTraslado = res["data"]["INV_TIPO_TRASLADO"];
        console.log(this.catalog);
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }
  
  mostrarCampos(campos){
    console.log(campos);
    let valor = []
    this.motivoC.map((e)=>{
     if( e.grupo===campos){
        valor.push(e);
     } 
    })
    this.motivoBol = false
    this.motivosCR = valor
    console.log(valor);
    if(campos === undefined){
      this.motivo = undefined
      this.motivosCR = []
    }
  }

  
 async mostrarReporte(){
    console.log(this.selectedReporte);
   this.lcargando.ctlSpinner(true);
    try {
      let data = {
        tipo_reporte : this.selectedReporte,
        tipo_ingreso: this.tipoIngreso != 0 ? this.tipoIngreso.descripcion+' '+this.tipoIngreso.valor : 0,
        tipo_egreso: this.tipoEgreso,
        egreso_motivo: this.motivo,
        tipo_traslado: this.tipo_traslado,
        fecha_desde: this.fecha_desde,
        fecha_hasta: this.fecha_hasta,
        observaciones: this.observaciones,
        bodega_origen: this.selectedBodegaOrigen,
        bodega_destino: this.selectedBodegaDestino,
        vehiculo: this.vehiculo
      }

      let response = await this.apiService.getData(data);
        console.log(response)
        if(response.length > 0){
           this.dataReporte = response
           this.vmButtons[2].habilitar = false
        }else{
          this.dataReporte = []
          this.vmButtons[2].habilitar = true
        }
        this.lcargando.ctlSpinner(false)
    } catch (err) {
      console.log(err)
      this.lcargando.ctlSpinner(false)
      this.toastr.error(err.error.message, 'Error consultando Reporte')
    }
  }
  consultaDetalleDocumento(d){
		console.log(d)
    if(d.tipo_documento=='Ingreso'){
      window.open(environment.ReportingUrl + "rpt_comprobante_ingreso_bodega.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_ingreso_bodega=" + d.id, '_blank')
    }
    if(d.tipo_documento=='Egreso'){
      window.open(environment.ReportingUrl + "rep_comprobante_egreso_bodega.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_egreso_bodega=" + d.id, '_blank')
    }
    if(d.tipo_documento=='Traslado'){

      if(d.tipo_traslado==1 || d.tipo_traslado=="1"){
        window.open(environment.ReportingUrl + "rep_bienes_traslado_01.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&p_id=" + d.id , '_blank')
      
      }else if(d.tipo_traslado==2 || d.tipo_traslado=="2"){
        window.open(environment.ReportingUrl + "rep_bienes_traslado_02.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&p_id=" + d.id , '_blank')
      
      }else if(d.tipo_traslado==3 || d.tipo_traslado=="3"){
        window.open(environment.ReportingUrl + "rep_bienes_traslado_03.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&p_id=" + d.id , '_blank')
      
      }else if(d.tipo_traslado==4 || d.tipo_traslado=="4"){
        window.open(environment.ReportingUrl + "rep_bienes_traslado_04.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&p_id=" + d.id , '_blank')
      
      }else if(d.tipo_traslado==5 || d.tipo_traslado=="5"){
        window.open(environment.ReportingUrl + "rep_bienes_traslado_05.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&p_id=" + d.id , '_blank')
      
      }else if(d.tipo_traslado==6 || d.tipo_traslado=="6"){
        window.open(environment.ReportingUrl + "rep_bienes_traslado_06.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&p_id=" + d.id , '_blank')
      
      }else if(d.tipo_traslado==7 || d.tipo_traslado=="7"){
        window.open(environment.ReportingUrl + "rep_bienes_traslado_07.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&p_id=" + d.id , '_blank')
      
      }else if(d.tipo_traslado==8 || d.tipo_traslado=="8"){
        window.open(environment.ReportingUrl + "rep_bienes_traslado_08.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&p_id=" + d.id , '_blank')
      
      }else if(d.tipo_traslado==9 || d.tipo_traslado=="9"){
        window.open(environment.ReportingUrl + "rep_bienes_traslado_09.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&p_id=" + d.id , '_blank')
      
      }else if(d.tipo_traslado==10 || d.tipo_traslado=="10"){
        window.open(environment.ReportingUrl + "rep_bienes_traslado_10.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&p_id=" + d.id , '_blank')
      
      }else if(d.tipo_traslado==11 || d.tipo_traslado=="11") {
        window.open(environment.ReportingUrl + "rep_bienes_traslado_11.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&p_id=" + d.id , '_blank')
      }

    }
  

	}

  exportExcel() {
    let excelData = []

    (this as any).mensajeSpinner = 'Exportando Movimientos'
    this.lcargando.ctlSpinner(true);
        
    this.dataReporte .forEach((e: any) => {
      const data = {
        TipodeDocumento: e.tipo_documento,
        NumerodeDocumento : e.numero_documento,
        FechaDocumento: e.fecha,
        Responsable: e.responsable,
        Solicitante: e.solicita,
        Tipo: e.tipo,
        Motivo: e.motivo,
        Observaciones: e.observaciones,
        Bodega_Origen: e.bodega_origen,
        Bodega_Destino: e.bodega_destino,
        Vehículo: e.vehiculo,
        Item: e.item
        

      }
      excelData.push(data)
    })
       
    this.excelService.exportAsExcelFile(excelData, 'Reporte de Movimientos de Bodega')
    this.lcargando.ctlSpinner(false)
    
  }

  limpiarForm() {

  this.dataReporte = [];
  this.selectedReporte= 0;
  this.tipoIngreso= 0
  this.motivo = 0;
  this.tipoEgreso= 0;
  this.tipo_traslado = 0;
  this.motivoBol = true;
  
  this.fecha_desde= moment(this.firstday).format('YYYY-MM-DD');
  this.fecha_hasta=moment(this.today).format('YYYY-MM-DD');
  this.vmButtons[2].habilitar = true
  this.observaciones=''
  this.selectedBodegaOrigen=0
  this.selectedBodegaDestino=0
  this.vehiculo=''
}

}
