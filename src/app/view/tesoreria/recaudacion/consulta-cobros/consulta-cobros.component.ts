import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConsultaCobrosService } from './consulta-cobros.service'; 
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { ExcelService } from 'src/app/services/excel.service';
import { XlsExportService } from 'src/app/services/xls-export.service';
import * as myVarGlobals from 'src/app/global';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { ConfirmationDialogService } from 'src/app/config/custom/confirmation-dialog/confirmation-dialog.service';
import { VistaArchivoComponent } from 'src/app/view/contabilidad/centro-costo/cc-mantenimiento/vista-archivo/vista-archivo.component';
// import { ModalUsuariosComponent } from 'src/app/config/custom/modal-usuarios/modal-usuarios.component';
import { ModalUsuariosComponent } from './modal-usuarios/modal-usuarios.component';
@Component({
standalone: false,
  selector: 'app-consulta-cobros',
  templateUrl: './consulta-cobros.component.html',
  styleUrls: ['./consulta-cobros.component.scss']
})
export class ConsultaCobrosComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent; 
  fTitle: string = "Consulta de Cobros";
  mensajeSpinner: string;
  vmButtons: any[] = [];
  dataUser: any;
  permissions: any;

  conceptos: any[] = [];
  conceptosMercado: any[] = [];
  mercados: any[] = [];
  reportes: any[] = [];
  cmb_conceptos: any[] = []

  dataCobros : any =[]
  dataCobrosExcel : any =[]
  tasaSelected : any
  general: boolean=true
  porTitulo: boolean=false
  porFormaPago: boolean=false
  dusuario: boolean=true
  dusuarioanulacion: boolean=true
  
  listEstados = [
    // {value: '', label: '--Todos--'},
    {value: 'E', label: 'Emitido'},
    {value: 'A', label: 'Aprobado'},
    {value: 'C', label: 'Cancelado'},
    {value: 'V', label: 'Convenio'},
    {value: 'X', label: 'Anulado'}
  ]
  listTipoCobro = [
    // {value: '', label: '--Todos--'},
    {value: 'TITULO', label: 'Título'},
    {value: 'FORMAPAGO', label: 'Forma de Pago'},
    {value: 'MERCADO', label: 'Mercado'},
  ]
  estadoSelected = 0

  selectedReporte: any = undefined;
  selectedConcepto: any = '';
  today = moment(new Date()).format('YYYY-MM-DD');
  fecha_desde: string = moment(this.today).startOf('month').format('YYYY-MM-DD');
  fecha_hasta: string = moment(this.today).endOf('month').format('YYYY-MM-DD');
  filter: any;
  paginate: any;
  constructor(
    private apiService: ConsultaCobrosService,
    private toastr: ToastrService,
    private excelService: ExcelService,
    private xlsService: XlsExportService,
    private confirmationDialogService: ConfirmationDialogService,
    private modalService: NgbModal,
    private commonVarSrv: CommonVarService,
  ) {
    this.commonVarSrv.selectUsuario.asObservable().subscribe(
      (res)=>{
        console.log(res)
        if(res['tipo'] == 'recaudador'){
          this.filter.id_usuario = res['data']['id_usuario'];
          this.filter.usuario = res['data']['usuario'];
        }

        if(res['tipo']  == 'anulacion'){
          this.filter.id_usuario_anulacion = res['data']['id_usuario'];
          this.filter.usuario_anulacion = res['data']['usuario'];
        }
       
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
        habilitar: false 
      },
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
     
      fecha_desde: moment().startOf('month').format('YYYY-MM-DD'),
      fecha_hasta: moment().endOf('month').format('YYYY-MM-DD'),
      razon_social: '',
      num_documento: '',
      estado: "",
      cuenta_contable:'',
      tipo_cobro: '',
      concepto: 0,
      usuario: '',
      id_usuario: 0,
      id_usuario_anulacion: 0,
      usuario_anulacion: '',
      mercado: 0

    }
    this.paginate = {
      length: 0,
      perPage: 20,
      page: 1,
      pageSizeOptions: [20,50,100,500,1000]
    }

    setTimeout(() => {
      this.getConceptos()
      this.getMercados()
    }, 75)
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "Consultar":
        this.cargarConsulta()
        break;
      case "Pdf":
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
    this.mensajeSpinner = 'Cargando Conceptos';
    this.lcargando.ctlSpinner(true);
    this.apiService.getConceptosFiltro().subscribe(
      (res: any) => {
        console.log(res.data);
        res.data.forEach((element: any) => {
          let o = {
            id: element.id_concepto,
            name: element.nombre,
            codigo: element.codigo
          };
          this.conceptos.push({ ...o });
          this.conceptosMercado = this.conceptos.filter(e => 
                  e.codigo =='AM' || e.codigo =='VP' || e.codigo =='AT'|| e.codigo =='PM'||
                  e.codigo =='LT' || e.codigo =='LE' || e.codigo == 'PT' || e.codigo == 'IN')
          });
          console.log(this.conceptosMercado)
        this.lcargando.ctlSpinner(false);
      },
      (err: any) => {
        console.log(err);
        this.lcargando.ctlSpinner(false);
      }
    )
  }

  getMercados = () => {
    this.mensajeSpinner = 'Obteniendo Mercados'
    this.lcargando.ctlSpinner(true);

    this.apiService.getMercados().subscribe(
      (res: any) => {
        res.data.REN_MERCADO.forEach((element: any) => {
          const { id_catalogo, valor, descripcion } = element
          this.mercados = [...this.mercados, { id_catalogo: id_catalogo, valor: valor, descripcion: descripcion }]
        });
        // this.lcargando.ctlSpinner(false);
       
      },
      err => {
        this.lcargando.ctlSpinner(false);
        this.toastr.error(err.error.message, 'Error cargando Mercados');
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
  asignarTipoCobro(event){
    console.log(event)
    this.dataCobros=[]
    if(event == 'TITULO'){
      this.porTitulo=true
      this.general=false
      this.porFormaPago=false
    }else if(event == 'FORMAPAGO'){
      this.porTitulo=false
      this.general=false
      this.porFormaPago=true
    }else if(event == 'MERCADO'){
      this.porTitulo=true
      this.general=false
      this.porFormaPago=false
    }else{
      this.porTitulo=false
      this.general=true
      this.porFormaPago=false
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

    this.mensajeSpinner = 'Cargando...';
    this.lcargando.ctlSpinner(true);
    if(this.filter.estado==null){
      this.filter.estado = ''
    }
    if(this.filter.usuario==null || this.filter.usuario==''){
      this.filter.id_usuario =0
    }
    if(this.filter.usuario_anulacion==null || this.filter.usuario_anulacion==''){
      this.filter.id_usuario_anulacion =0
    }
    let data= {
      params: {
        filter: this.filter,
        paginate: this.paginate,
        id_componente: myVarGlobals.fContribuyente
      }
    }

    this.apiService.getConsultaCobros(data).subscribe(
      (res: any) => {
         console.log(res);
         if(res.status==1){
          //this.dataCobros = res.data
          this.paginate.length = res.data.total;
          this.dataCobros = res.data.data;
            if (res.data.current_page == 1) {
              this.dataCobros = res.data.data;
            } else {
              this.dataCobros = Object.values(res.data.data);
            }
          this.lcargando.ctlSpinner(false);
         }
         else{
          this.dataCobros =[]
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
    let reporteUrl: string = `${environment.baseUrl}/reports/reporte-jasper?reporte=${this.selectedReporte}&concepto=${this.selectedConcepto}&fecha_desde=${this.fecha_desde}`
    // console.log(reporteUrl)
    window.open(reporteUrl, "_blank")
  }
   */
  modalUsuarios(tipo){
    console.log(tipo)
    let modal = this.modalService.open(ModalUsuariosComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modal.componentInstance.tipo = tipo;
  }

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
  asignarEstado(evt) {
    this.filter.estado = evt
   }

  limpiarFiltros() {
    this.filter= {
      fecha_desde: moment().startOf('month').format('YYYY-MM-DD'),
      fecha_hasta: moment().endOf('month').format('YYYY-MM-DD'),
      razon_social: '',
      num_documento: '',
      estado: "",
      cuenta_contable:'',
      tipo_cobro: '',
      concepto: 0,
      id_usuario: 0,
      mercado: 0,
      usuario: '',
      id_usuario_anulacion: 0,
      usuario_anulacion: '',
    }
    this.estadoSelected = 0

    this.general=true
    this.porTitulo=false
    this.porFormaPago=false
  }

  btnExportarPdf() {


    let fecha_desde = this.filter.fecha_desde
    let fecha_hasta = this.filter.fecha_hasta
    let contribuyente = this.filter.razon_social
    let num_documento = this.filter.num_documento
    let concepto = this.filter.concepto
    let estado = this.filter.estado
    let cuenta_contable = this.filter.cuenta_contable
    let usuario = this.filter.id_usuario
    
    console.log(this.filter.tipo_cobro)
    if(this.filter.tipo_cobro == 'TITULO'){
      window.open(environment.ReportingUrl + "rpt_recaudacion_consulta_cobros_titulos.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&fecha_desde=" + fecha_desde + "&fecha_hasta=" + fecha_hasta + "&contribuyente=" + contribuyente + "&num_documento=" + num_documento+ "&concepto=" + concepto + "&estado=" + estado + "&cuenta_contable=" + cuenta_contable + "&usuario=" + usuario,'_blank')
      console.log(environment.ReportingUrl + "rpt_recaudacion_consulta_cobros_tituloa.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&fecha_desde=" + fecha_desde + "&fecha_hasta=" + fecha_hasta + "&contribuyente=" + contribuyente + "&num_documento=" + num_documento + "&concepto=" + concepto + "&estado=" + estado + "&cuenta_contable=" + cuenta_contable+ "&usuario=" + usuario)
    }
    else if(this.filter.tipo_cobro == 'FORMAPAGO'){
      window.open(environment.ReportingUrl + "rpt_recaudacion_consulta_cobros_formapago.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&fecha_desde=" + fecha_desde + "&fecha_hasta=" + fecha_hasta + "&contribuyente=" + contribuyente + "&num_documento=" + num_documento+ "&concepto=" + concepto + "&estado=" + estado + "&cuenta_contable=" + cuenta_contable + "&usuario=" + usuario,'_blank')
      console.log(environment.ReportingUrl + "rpt_recaudacion_consulta_cobros_formapago.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&fecha_desde=" + fecha_desde + "&fecha_hasta=" + fecha_hasta + "&contribuyente=" + contribuyente + "&num_documento=" + num_documento + "&concepto=" + concepto + "&estado=" + estado + "&cuenta_contable=" + cuenta_contable + "&usuario=" + usuario)
    }
    else if(this.filter.tipo_cobro == 'MERCADO'){
      window.open(environment.ReportingUrl + "rpt_recaudacion_consulta_cobros_mercado.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&fecha_desde=" + fecha_desde + "&fecha_hasta=" + fecha_hasta + "&contribuyente=" + contribuyente + "&num_documento=" + num_documento+ "&concepto=" + concepto + "&estado=" + estado + "&cuenta_contable=" + cuenta_contable + "&usuario=" + usuario,'_blank')
      console.log(environment.ReportingUrl + "rpt_recaudacion_consulta_cobros_mercado.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&fecha_desde=" + fecha_desde + "&fecha_hasta=" + fecha_hasta + "&contribuyente=" + contribuyente + "&num_documento=" + num_documento + "&concepto=" + concepto + "&estado=" + estado + "&cuenta_contable=" + cuenta_contable + "&usuario=" + usuario)
    }else{
      window.open(environment.ReportingUrl + "rpt_recaudacion_consulta_cobros_general.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&fecha_desde=" + fecha_desde + "&fecha_hasta=" + fecha_hasta + "&contribuyente=" + contribuyente + "&num_documento=" + num_documento+ "&concepto=" + concepto + "&estado=" + estado + "&cuenta_contable=" + cuenta_contable + "&usuario=" + usuario,'_blank')
      console.log(environment.ReportingUrl + "rpt_recaudacion_consulta_cobros_general.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&fecha_desde=" + fecha_desde + "&fecha_hasta=" + fecha_hasta + "&contribuyente=" + contribuyente + "&num_documento=" + num_documento + "&concepto=" + concepto + "&estado=" + estado + "&cuenta_contable=" + cuenta_contable + "&usuario=" + usuario)
    }
    


    
  }



 btnExportarExcel() {
  let tipo = ''
  if(this.filter.tipo_cobro=='TITULO'){
    tipo = 'TITULO';
  }else if(this.filter.tipo_cobro=='FORMAPAGO'){
    tipo = 'FORMAPAGO';
  }else{
    tipo = 'GENERAL';
  }

  this.mensajeSpinner = 'Cargando...';
    this.lcargando.ctlSpinner(true);
    if(this.filter.estado==null){
      this.filter.estado = ''
    }
    if(this.filter.usuario==null || this.filter.usuario==''){
      this.filter.id_usuario =0
    }

  let data= {
    params: {
      filter: this.filter,
      paginate: this.paginate,
      id_componente: myVarGlobals.fContribuyente
    }
  }

  this.apiService.getConsultaCobrosExcel(data).subscribe(
    (res: any) => {
       console.log(res);
       if(res.status==1){
        //this.dataCobros = res.data
       
        this.dataCobrosExcel = res.data;
        let dataExcel = {
          title: 'Consulta de Cobros',
          tipo: tipo,
          rows:  this.dataCobrosExcel
        }
        console.log(data)

        this.xlsService.exportConsultaCobros(dataExcel, 'Reporte Consulta de Cobros')
        this.lcargando.ctlSpinner(false);
       }
       else{
        this.dataCobrosExcel =[]
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


}
