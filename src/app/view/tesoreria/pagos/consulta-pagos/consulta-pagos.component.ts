import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ConsultaPagosService } from './consulta-pagos.service'; 
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ExcelService } from 'src/app/services/excel.service';
import { XlsExportService } from 'src/app/services/xls-export.service';
import * as myVarGlobals from 'src/app/global';
import { ConfirmationDialogService } from 'src/app/config/custom/confirmation-dialog/confirmation-dialog.service';
import { VistaArchivoComponent } from 'src/app/view/contabilidad/centro-costo/cc-mantenimiento/vista-archivo/vista-archivo.component';

@Component({
standalone: false,
  selector: 'app-consulta-pagos',
  templateUrl: './consulta-pagos.component.html',
  styleUrls: ['./consulta-pagos.component.scss']
})
export class ConsultaPagosComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent; 
  fTitle: string = "Consulta de Pagos";
  mensajeSpinner: string;
  vmButtons: any[] = [];
  dataUser: any;
  permissions: any;

  conceptos: any[] = [];
  reportes: any[] = [];

  dataPagos : any =[]
  dataPagosFactura : any =[]
  tasaSelected : any
  
  listEstados = [
    {value: '0', label: '--Todos--'},
    {value: 'E', label: 'Emitido'},
    {value: 'A', label: 'Aprobado'},
    {value: 'C', label: 'Cancelado'},
    {value: 'V', label: 'Convenio'},
    {value: 'X', label: 'Anulado'}
  ]

  listTipoDoc = [
    {value: 'PAGO', label: 'Pago'},
    {value: 'FACTURA', label: 'Factura'},
  ]

  tipo_documento: any = 'PAGO'

  selectedReporte: any = undefined;
  selectedConcepto: any = '';
  today = moment(new Date()).format('YYYY-MM-DD');
  fecha_desde: string = moment(this.today).startOf('month').format('YYYY-MM-DD');
  fecha_hasta: string = moment(this.today).endOf('month').format('YYYY-MM-DD');
  filter: any;
  constructor(
    private apiService: ConsultaPagosService,
    private toastr: ToastrService,
    private excelService: ExcelService,
    private xlsService: XlsExportService,
    private confirmationDialogService: ConfirmationDialogService,
    private modalService: NgbModal,
  ) {

    this.apiService.listaTasas$.subscribe(
      (res) => {
        console.log(res)
        this.tasaSelected = res
        this.filter.tasa = res.codigo +'-'+res.descripcion
        this.filter.id_tasa = res.id_tasas_varias
        this.filter.codigo_tasa = res.codigo
      }
    )
   }

  ngOnInit(): void {
    this.vmButtons = [
     
      // {
      //   orig: "btnsConsultaTitulos",
      //   paramAccion: "",
      //   boton: { icon: "far fa-file-pdf", texto: "PDF" },
      //   permiso: true,
      //   showtxt: true,
      //   showimg: true,
      //   showbadge: false,
      //   clase: "btn btn-danger boton btn-sm",
      //   habilitar: false,
      // },
      { orig: "btnsConsultaTitulos", 
        boton: { icon: "fa fa-floppy-o", texto: "Consultar" }, 
        permiso: true, 
        showtxt: true, 
        showimg: true, 
        showbadge: false, 
        clase: "btn btn-primary btn-sm", 
        habilitar: false, 
      },   
      { 
        orig: "btnsConsultaTitulos", 
        paramAccion: "", 
        boton: { icon: "fa fa-file-excel-o", texto: "Excel" }, 
        permiso: true, 
        showtxt: true, 
        showimg: true, 
        showbadge: false, 
        clase: "btn btn-success boton btn-sm", 
        habilitar: true
      },
      { orig: "btnsConsultaTitulos", 
        boton: { icon: "fa fa-eraser", texto: "Limpiar" }, 
        permiso: true, 
        showtxt: true, 
        showimg: true, 
        showbadge: false, 
        clase: "btn btn-warning btn-sm", 
        habilitar: false, 
      },

    ];

    this.filter = {
      concepto: '',
      codigo: 'TODOS',
      fecha_desde: moment().startOf('month').format('YYYY-MM-DD'),
      fecha_hasta: moment().endOf('month').format('YYYY-MM-DD'),
      razon_social: '',
      num_documento: '',
      estado: '',
      tasa: '',
      id_tasa:null,
      codigo_tasa: '',
      num_factura: ''

    }

    setTimeout(() => {
      this.getConceptos()
    }, 75)
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "Consultar":
        this.cargarConsulta()
        break;
      case "Excel":
        this.btnExportarExcel()
        break;
      case "Limpiar":
        this.limpiarFiltros()
        break;
      default:
        break;
    }
  }


  getConceptos() {
    this.mensajeSpinner = 'Cargando Conceptos';
    this.lcargando.ctlSpinner(true);
    this.apiService.getConceptos().subscribe(
      (res: any) => {
        console.log(res.data);
        res.data.forEach((element: any) => {
          let o = {
            id: element.id_concepto,
            name: element.nombre,
            codigo: element.codigo
          };
          this.conceptos.push({ ...o });
        });
        this.lcargando.ctlSpinner(false);
      },
      (err: any) => {
        console.log(err);
        this.lcargando.ctlSpinner(false);
      }
    )
  }

  handlerSelectedConcepto(event){
    console.log(event)
    if(event!=undefined){
      this.filter.concepto = event.id;
      this.filter.codigo = event.codigo;
    }else{
      this.filter.concepto = null;
      this.filter.codigo = 'TODOS';
    }
    
  }


  selectedTipoDoc(event){
    console.log(event)
    if(event == 'PAGO'){
      if(this.dataPagos.length > 0){
        this.vmButtons[1].habilitar = false
      }else{
        this.vmButtons[1].habilitar = true
      }
    }
    if(event == 'FACTURA'){
      if(this.dataPagosFactura.length > 0){
        this.vmButtons[1].habilitar = false
      }else{
        this.vmButtons[1].habilitar = true
      }
    }
  }
  cargarConsulta(){

    this.mensajeSpinner = 'Cargando...';
    this.lcargando.ctlSpinner(true);
    if(this.filter.estado==null){
      this.filter.estado = ''
    }
    let data= {
     filter: this.filter,
     id_componente: myVarGlobals.fContribuyente
    }
    if(this.tipo_documento == 'FACTURA'){
      this.apiService.getConsultaPagosFacturas(data).subscribe(
        (res: any) => {
           console.log(res.data);
           this.lcargando.ctlSpinner(false);
           if(res.data.length > 0){
            this.dataPagosFactura = res.data
            this.vmButtons[1].habilitar = false
           
           
           }
           else{
            this.dataPagosFactura =[]
            this.vmButtons[1].habilitar = true
           
           }
        },
        (err: any) => {
          console.log(err);
          this.lcargando.ctlSpinner(false);
        }
      )
    }else{
      this.apiService.getConsultaPagos(data).subscribe(
        (res: any) => {
           console.log(res.data);
           this.lcargando.ctlSpinner(false);
           if(res.data.length > 0){
            this.dataPagos = res.data
            this.vmButtons[1].habilitar = false
           }
           else{
            this.dataPagos =[]
            this.vmButtons[1].habilitar = true
           }
        },
        (err: any) => {
          console.log(err);
          this.lcargando.ctlSpinner(false);
        }
      )
    }

   
    
  }

  asignarEstado(evt) {
    this.filter.estado = evt
   }

  /*
  mostrarReporte() {
    let reporteUrl: string = `${environment.baseUrl}/reports/reporte-jasper?reporte=${this.selectedReporte}&concepto=${this.selectedConcepto}&fecha_desde=${this.fecha_desde}`
    // console.log(reporteUrl)
    window.open(reporteUrl, "_blank")
  }
   */

  btnExportar() {
    console.log(this.selectedReporte);
    console.log(this.fecha_desde);
    console.log(this.fecha_hasta);
    console.log(this.selectedConcepto);
    this.apiService.getTiposReporte().subscribe(
      (res: any) => {
         console.log(res.data);
         var variable: "";
        res.data.forEach((element: any) => {
          let o = {
            created_at: element.created_at,
            descripcion: element.descripcion,
            reporte: element.reporte
          };
          console.log(o);
          //this.reportes.push({ ...o });
          if (element.descripcion == this.selectedReporte){
            console.log('desde: '+element.fecha_desde);
            console.log('hasta: '+element.fecha_hasta);
            
            window.open(environment.ReportingUrl +`${element.reporte}`+".xlsx?&j_username=" + environment.UserReporting 
            + "&j_password=" + environment.PasswordReporting+"&fechaInicio=" + this.filter.fecha_desde + "&fechaFin=" + this.filter.fecha_hasta +"&estado="+"A"+"&concepto="+this.filter.selectedConcepto , '_blank')
            //window.open(environment.ReportingUrl + "rep_tasas_plusvalia.pdf?&j_username=" + environment.UserReporting + 
            //"&j_password=" + environment.PasswordReporting + "&id_liquidacion=" + dt.id_liquidacion + "&forma_pago=" + this.pagos[0].tipo_pago_lbl , '_blank')
            console.log(environment.ReportingUrl +`${element.reporte}`+".xlsx?&j_username=" + environment.UserReporting 
            + "&j_password=" + environment.PasswordReporting+"&fechaInicio=" + this.filter.fecha_desde + "&fechaFin=" + this.filter.fecha_hasta+"&estado="+"A"+"&concepto="+this.filter.selectedConcepto);
          }
        });

      },
      (err: any) => {
        console.log(err);
        this.lcargando.ctlSpinner(false);
      }
    )
    
  }

  limpiarFiltros() {
    this.filter= {
      concepto: '',
      codigo: 'TODOS',
      fecha_desde: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
      fecha_hasta: moment().endOf('month').format('YYYY-MM-DD'),
      razon_social: '',
      num_documento: '',
      estado: '',
      tasa: '',
      num_fatura: ''
    }
     this.tipo_documento= 'PAGO'
    Object.assign(this.filter, {
      selectedConcepto: ' ',
      fecha_desde: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
      fecha_hasta: moment().endOf('month').format('YYYY-MM-DD')
     

  })
}



 btnExportarExcel() {
  
  if(this.tipo_documento == 'FACTURA'){
   let data = {
      title: 'Consulta de Títulos',
      rows:  this.dataPagosFactura
    }
    this.xlsService.exportConsultaPagosFactura(data, 'Reporte Consulta de Pagos por Factura')
  }else{
    let data = {
      title: 'Consulta de Títulos',
      rows:  this.dataPagos
    }
    this.xlsService.exportConsultaPagos(data, 'Reporte Consulta de Pagos')
  }
 
}
descargarAnexo(anexo){
  let data = {
    storage: anexo.storage,
    name: anexo.name,
  }

  this.apiService.downloadAnexo(data).subscribe(
    (resultado) => {
      const url = URL.createObjectURL(resultado)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', anexo.nombre)
      link.click()
    },
    err => {
      console.log(err)
      this.toastr.error(err.error.message, 'Error descargando Anexo')
    }
  )
  }
  verAnexo(anexo) {
    // console.log(anexo);
    let data = {
      storage: anexo.storage,
      name: anexo.name
    }

    console.log(data)

    this.apiService.downloadAnexo(data).subscribe(
      (resultado) => {
        const dialogRef = this.confirmationDialogService.openDialogMat(VistaArchivoComponent, {
          width: '1000px', height: 'auto',
          data: {
            titulo: 'Vista de archivo',
            dataUser: this.dataUser,
            objectUrl: URL.createObjectURL(resultado),
            tipoArchivo: anexo.original_type
          }
        })
      },
      err => {
        console.log(err)
        this.toastr.error(err.error.message, 'Error descargando Anexo')
      }
    )
  }


}
