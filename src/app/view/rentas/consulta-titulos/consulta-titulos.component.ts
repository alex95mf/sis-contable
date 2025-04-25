import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ConsultaTitulosService } from './consulta-titulos.service'; 
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ExcelService } from 'src/app/services/excel.service';
import { XlsExportService } from 'src/app/services/xls-export.service';
import * as myVarGlobals from 'src/app/global';
import { ConfirmationDialogService } from 'src/app/config/custom/confirmation-dialog/confirmation-dialog.service';
import { VistaArchivoComponent } from 'src/app/view/contabilidad/centro-costo/cc-mantenimiento/vista-archivo/vista-archivo.component';
import { ModalTasasComponent } from './modal-tasas/modal-tasas.component';

@Component({
  selector: 'app-consulta-titulos',
  templateUrl: './consulta-titulos.component.html',
  styleUrls: ['./consulta-titulos.component.scss']
})
export class ConsultaTitulosComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent; 
  fTitle: string = "Consulta de Títulos";
  msgSpinner: string;
  vmButtons: any[] = [];
  dataUser: any;
  permissions: any;

  conceptos: any[] = [];
  reportes: any[] = [];

  dataTitulos : any =[]
  dataTitulosExcel : any =[]
  tasaSelected : any
  
  listEstados = [
    {value: '0', label: '--Todos--'},
    {value: 'E', label: 'Emitido'},
    {value: 'A', label: 'Aprobado'},
    {value: 'C', label: 'Cancelado'},
    {value: 'V', label: 'Convenio'},
    {value: 'X', label: 'Anulado'}
  ]

  selectedReporte: any = undefined;
  selectedConcepto: any = '';
  today = moment(new Date()).format('YYYY-MM-DD');
  fecha_desde: string = moment(this.today).startOf('month').format('YYYY-MM-DD');
  fecha_hasta: string = moment(this.today).endOf('month').format('YYYY-MM-DD');
  filter: any;
  paginate: any;
  constructor(
    private apiService: ConsultaTitulosService,
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
      { orig: "btnsConsultaTitulos", 
        paramAccion: "", 
        boton: { icon: "fa fa-search", texto: "Consultar" }, 
        permiso: true, 
        showtxt: true, 
        showimg: true, 
        showbadge: false, 
        clase: "btn btn-action boton btn-sm", 
        habilitar: false },

      {
        orig: "btnsConsultaTitulos",
        paramAccion: "",
        boton: { icon: "far fa-file-pdf", texto: "Pdf" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
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
        habilitar: false
      },
      { orig: "btnsConsultaTitulos", 
        paramAccion: "", 
        boton: { icon: "fas fa-eraser", texto: "Limpiar" }, 
        permiso: true, 
        showtxt: true, 
        showimg: true, 
        showbadge: false, 
        clase: "btn btn-sm btn-warning boton btn-sm", 
        habilitar: false 
      }

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
      cuenta_contable: ''

    }
    this.paginate = {
      length: 0,
      perPage: 20,
      page: 1,
      pageSizeOptions: [20,50,100,500,1000]
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
      case "Pdf":
        //this.mostrarReporte()
        this.btnExportarPdf()
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
    this.msgSpinner = 'Cargando Conceptos';
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
  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);
    this.cargarConsulta();
  }


  cargarConsulta(){

    this.msgSpinner = 'Cargando...';
    this.lcargando.ctlSpinner(true);
    if(this.filter.estado==null){
      this.filter.estado = ''
    }

    let data= {
      params: {
        filter: this.filter,
        paginate: this.paginate,
        id_componente: myVarGlobals.fContribuyente
      }
    }


    this.apiService.getConsultaTitulos(data).subscribe(
      (res: any) => {
        console.log(res);
        if(res.status==1){
         //this.dataCobros = res.data
         this.paginate.length = res.data.total;
        //  res.data.data.forEach(e => {
        //   e.codigo_presupuesto = e.codigo_presupuesto_haber !== undefined ? e.codigo_presupuesto_haber : e.codigo_presupuesto;
        //   e.nombre_presupuesto = e.nombre_presupuesto_haber !== undefined ? e.nombre_presupuesto_haber : e.nombre_presupuesto;
        //  });
         this.dataTitulos = res.data.data;
           if (res.data.current_page == 1) {
             this.dataTitulos = res.data.data;
           } else {
             this.dataTitulos = Object.values(res.data.data);
           }
         this.lcargando.ctlSpinner(false);
        }
        else{
         this.dataTitulos =[]
         this.lcargando.ctlSpinner(false);
        }
       
      },
      (err: any) => {
        console.log(err);
        this.lcargando.ctlSpinner(false);
      }
    )
    
  }

  /*
  mostrarReporte() {
    // let reporteUrl: string = `${environment.baseUrl}/reports/reporte-jasper?reporte=${this.selectedReporte}&concepto=${this.selectedConcepto}&fecha_desde=${this.fecha_desde}`
    // // console.log(reporteUrl)
    // window.open(reporteUrl, "_blank")
  }*/
   

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
      fecha_desde: moment().startOf('month').format('YYYY-MM-DD'),
      fecha_hasta: moment().endOf('month').format('YYYY-MM-DD'),
      razon_social: '',
      num_documento: '',
      estado: '',
      tasa: '',
      id_tasa:null,
      codigo_tasa: '',
      cuenta_contable: ''
    }

    this.dataTitulos =[]
  //   Object.assign(this.filter, {
  //     selectedConcepto: ' ',
  //     fecha_desde: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
  //     fecha_hasta: moment().endOf('month').format('YYYY-MM-DD')
     

  // })
}

btnExportarPdf() {


  let fecha_desde = this.filter.fecha_desde
  let fecha_hasta = this.filter.fecha_hasta
  let contribuyente = this.filter.razon_social
  let num_documento = this.filter.num_documento
  let concepto = this.filter.concepto
  let estado = this.filter.estado
  let cuenta_contable = this.filter.cuenta_contable
 
  window.open(environment.ReportingUrl + "rpt_rentas_consulta_titulos.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&fecha_desde=" + fecha_desde + "&fecha_hasta=" + fecha_hasta + "&contribuyente=" + contribuyente + "&num_documento=" + num_documento+ "&concepto=" + concepto + "&estado=" + estado + "&cuenta_contable=" + cuenta_contable,'_blank')
  console.log(environment.ReportingUrl + "rpt_rentas_consulta_titulos.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&fecha_desde=" + fecha_desde + "&fecha_hasta=" + fecha_hasta + "&contribuyente=" + contribuyente + "&num_documento=" + num_documento + "&concepto=" + concepto + "&estado=" + estado + "&cuenta_contable=" + cuenta_contable)
}



 btnExportarExcel() {


  this.msgSpinner = 'Cargando...';
  this.lcargando.ctlSpinner(true);
  if(this.filter.estado==null){
    this.filter.estado = ''
  }

  let data= {
    params: {
      filter: this.filter,
      paginate: this.paginate,
      id_componente: myVarGlobals.fContribuyente
    }
  }


  this.apiService.getConsultaTitulosExcel(data).subscribe(
    (res: any) => {
      console.log(res);
      if(res.status==1){
        res.data.forEach(e =>{
          Object.assign(e ,{subtotal: parseFloat(e.subtotal),exoneraciones: parseFloat(e.exoneraciones),total: parseFloat(e.total)})
        })

        // res.data.forEach(e => {
        //   e.codigo_presupuesto = e.codigo_presupuesto_haber !== undefined ? e.codigo_presupuesto_haber : e.codigo_presupuesto;
        //   e.nombre_presupuesto = e.nombre_presupuesto_haber !== undefined ? e.nombre_presupuesto_haber : e.nombre_presupuesto;
        //   e.subtotal = parseFloat(e.subtotal)
        //   e.exoneraciones = parseFloat(e.exoneraciones)
        //   e.total = parseFloat(e.total)
        // });
       this.dataTitulosExcel = res.data;
       if(this.dataTitulosExcel.length > 0){
        let dataExcel = {
          title: 'Consulta de Títulos',
          rows:  this.dataTitulosExcel
        }
        console.log(data)
      
        this.xlsService.exportConsultaTitulos(dataExcel, 'Reporte Consulta de Títulos')
       }
      
       this.lcargando.ctlSpinner(false);
      }
      else{
       this.dataTitulosExcel =[]
       this.lcargando.ctlSpinner(false);
      }
     
    },
    (err: any) => {
      console.log(err);
      this.lcargando.ctlSpinner(false);
    }
  )


  
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
  expandTasas() {
    const modalInvoice = this.modalService.open(ModalTasasComponent,{
      size:"xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
    modalInvoice.componentInstance.permissions = this.permissions;
    //modalInvoice.componentInstance.tasas = this.tasas;
    modalInvoice.componentInstance.conceptos = this.conceptos;
    modalInvoice.componentInstance.fTitle = "Tasas";
  }

}
