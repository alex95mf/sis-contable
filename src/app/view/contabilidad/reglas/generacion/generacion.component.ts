import { Component, OnInit, ViewChild,EventEmitter,Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneracionService } from './generacion.service';
import * as myVarGlobals from '../../../../global';
import * as moment from 'moment';
import { CommonService } from '../../../../services/commonServices'
import { CommonVarService } from 'src/app/services/common-var.services';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Router } from '@angular/router';
import { ExcelService } from '../../../../services/excel.service';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { ModalCuentPreComponent } from './modal-cuent-pre/modal-cuent-pre.component';
import { ListReglasComponent } from './list-reglas/list-reglas.component';
import { XlsExportService } from 'src/app/services/xls-export.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-generacion',
  templateUrl: './generacion.component.html',
  styleUrls: ['./generacion.component.scss']
})
export class GeneracionComponent implements OnInit {

  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  fTitle = "Reglas";
  msgSpinner: string;
  vmButtons = [];
  dataUser: any;
  permissions: any;

  cierres: Array<any> = []; 
  tipoRegla: any = [];
  codigoDetalles: any = [];
  dataReporte: any = [];
  paginate: any;
  filter: any;

  today: any;
  tomorrow: any;
  firstday: any;
  lastday:any;
  verifyRestore = false;
  addDetalle: any = true;
  formReadOnly: any = false;

  tipoCodigo: any = ""
  tipoMovimiento: any = ""

  reglasDetallesIds: any = []
  totalDebe: number = 0;
  totalHaber: number = 0;
  diferencia: number = 0;

  grupo = {
    id_cuenta_contable: null,
    codigo_grupo_producto: null,
    descripcion: null,
    codigo_cuenta_contable: null,
    codigo_presupuesto: null,
    estado: null,
    descripcion_cuenta: null,
    codigo_oficial:null,
    descripcion_presupuesto: null,
    tipo_bien: null
  }
  id_regla: any = 0
  documento: any = {
    tipo_regla: 0,
    numero_regla:"",
    descripcion:"",
    estado:"",
  }

  tipoCodigoList = [
    {value: "CON",label: "Contable"},
    {value: "PRE",label: "Presupuesto"}
  ] 

  tipoMovimientoList= [
    {value: "D",label: "Debe"},
    {value: "H",label: "Haber"}
  ] 
  periodo: Date = new Date();
  mes_actual: any = 0;
  arrayMes: any =
  [
    {
      id: "0",
      name: "-Todos-"
    },{
      id: "1",
      name: "Enero"
    },
    {
      id: "2",
      name: "Febrero"
    },
    {
      id: "3",
      name: "Marzo"
    },
    {
      id: "4",
      name: "Abril"
    },
    {
      id: "5",
      name: "Mayo"
    },
    {
      id: "6",
      name: "Junio"
    },
    {
      id: "7",
      name: "Julio"
    },
    {
      id: "8",
      name: "Agosto"
    },

    {
      id: "9",
      name: "Septiembre"
    },
    {
      id: "10",
      name: "Octubre"
    },
    {
      id: "11",
      name: "Noviembre"
    },
    {
      id: "12",
      name: "Diciembre"
    },
  ];

  tabActiva: string = 'nav-configuracion'; 


  constructor(
    private apiSrv: GeneracionService,
    private commonSrv: CommonService,
    private toastr: ToastrService,
    private commonVarSrv: CommonVarService,
    private modalSrv: NgbModal,
    private xlsService: XlsExportService,
  ) {
    this.apiSrv.codigos$.subscribe(
      (res)=>{
        console.log(res);
        if(res['validacion']){
          console.log('true')
          this.grupo.codigo_cuenta_contable = res['data']['codigo'];        
          this.grupo.descripcion_cuenta = res['data']['nombre'];
          this.grupo.codigo_oficial = res['data']['codigo_oficial'];
          this.grupo.codigo_presupuesto = "";
          this.grupo.descripcion_presupuesto = "";
         
        }else{
          console.log('false')
          this.grupo.codigo_cuenta_contable ="";        
          this.grupo.descripcion_cuenta = "";
          this.grupo.codigo_oficial = "";
          this.grupo.codigo_presupuesto = res['data']['codigo'];
          this.grupo.descripcion_presupuesto = res['data']['nombre']
        }
      }
    )
    this.apiSrv.listaReglas$.subscribe(
      (res)=>{
        console.log(res);
        this.vmButtons[0].habilitar = true
        this.vmButtons[2].habilitar = false;
        this.documento = res;
        this.id_regla = res['id_regla_cab']
        res.detalles.sort((a, b) => {
          if (a.tipo_codigo > b.tipo_codigo) {
            return 1;
          }
          if (a.tipo_codigo < b.tipo_codigo) {
            return -1;
          }
          return 0;
        })
         res.detalles.forEach(e =>{
            Object.assign(e, {
              codigo_oficial: e.codigo_oficial != null || e.codigo_oficial != "" ? e.codigo_oficial  : undefined,
              codigo: e.cuenta_contable == null || e.cuenta_contable == "" ? e.codigo_presupuesto  : e.cuenta_contable,
              descripcion: e.presupuesto == null ?  e.cuentas?.nombre : e.presupuesto?.nombre ,
              tipo_codigo:e.tipo_codigo
          })
          
          
         });

        this.codigoDetalles = res.detalles;
        this.vmButtons[3].habilitar = false;
        //this.vmButtons[4].habilitar = false;

      }
    )
    
   }

  ngOnInit(): void {
    this.mes_actual = (Number(moment(new Date()).format('MM'))).toString();
   

  
    this.vmButtons = [
      {
        orig: "btnReglas",
        paramAccion: "",
        boton: { icon: "far fa-save", texto: " Guardar" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnReglas",
        paramAccion: "",
        boton: { icon: "far fa-search", texto: " Buscar" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnReglas",
        paramAccion: "",
        boton: { icon: "far fa-edit", texto: " Modificar" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-help boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnReglas",
        paramAccion: "",
        boton: { icon: "far fa-file-pdf", texto: " Imprimir" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-info boton btn-sm",
        habilitar: true,
        //printSection: "PrintSection", imprimir: true
      },
      { 
        orig: "btnReglas", 
        paramAccion: "", 
        boton: { icon: "fa fa-file-excel-o", texto: " Excel" }, 
        permiso: true, 
        showtxt: true, 
        showimg: false, 
        showbadge: false, 
        clase: "btn btn-success boton btn-sm", 
        habilitar: true
      },
      {
        orig: "btnReglas",
        paramAccion: "",
        boton: { icon: "fas fa-eraser", texto: " Limpiar" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      }
    ]


    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10]
    };

    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    
    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
    this.lastday = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0); 

    this.filter = {
     
      fecha_desde: moment().startOf('month').format('YYYY-MM-DD'),
      fecha_hasta: moment().endOf('month').format('YYYY-MM-DD'),
      numero_regla: ""

    }
    // this.filter = {
    //   descripcion: "",
    //   tipo_regla: 0,
    //   tipo_codigo:0,
    //   estado: ['A', 'I'],
    // };

    setTimeout(() => {
      //this.validaPermisos();
      this.getCatalogos();
    
    }, 50);
    
  }

  ChangeMesCierrePeriodos(evento: any) { this.mes_actual = evento; }

  changeTab(tab){
    this.tabActiva = tab;
    console.log(this.tabActiva)
    if( this.tabActiva =='nav-configuracion'){
      console.log('aqui conf')
      this.vmButtons[3].showimg= true;
      this.vmButtons[4].showimg= false;
    }
    if( this.tabActiva =='nav-reporte'){
      console.log('aqui rep')
      this.vmButtons[4].showimg= true;
      this.vmButtons[3].showimg= false;
    }
  }

  metodoGlobal = (event) => {
    switch (event.items.boton.texto) {
      case " Guardar":
        this.validaRegla('save');
        break;
      case " Buscar":
        this.expandListReglas();
        break;
      case " Modificar":
        this.validaRegla('update');
        break;
      case " Imprimir":
        this.exportarPdf()
        break;
      case " Excel":
        this.btnExportarExcel()
        break;
      case " Limpiar":
        this.confirmRestore();
        break;

        
      default:
        break;
    }
  }

  // validaPermisos = () => {
  //   this.msgSpinner = 'Cargando Permisos de Usuario...';
  //   this.lcargando.ctlSpinner(true);
  //   this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    
  //   let params = {
  //     codigo: myVarGlobals.fRenPredUrbanoEmision,
  //     id_rol: this.dataUser.id_rol,
  //   };

  //   this.commonService.getPermisionsGlobas(params).subscribe(
  //     res => {
  //       this.permissions = res["data"][0];
  //       if (this.permissions.abrir == "0") {
  //         this.lcargando.ctlSpinner(false);
  //         this.vmButtons = [];
  //         this.toastr.warning("No tiene permisos para usar este recurso.", this.fTitle);
  //       } else {
  //         // this.lcargando.ctlSpinner(false);
  //         // this.getCajaActiva();
  //         this.getConceptos();
  //         this.fillCatalog();
  //       }
  //     },
  //     err => {
  //       this.lcargando.ctlSpinner(false)
  //       this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
  //     }
  //   )
  // }

  // async validaRegla() {
  //   //if (this.permissions.guardar == "0") {
  //   //  this.toastr.warning("No tiene permisos guardar Reglas.", this.fTitle);
  //   //} else {
  //     let resp = await this.validaDataGlobal().then((respuesta) => {
  //       if (respuesta) {
  //         this.guardarRegla();
  //       }
  //     });
  //   //}
  // }
  async validaRegla(validacion) {
    // if (this.permissions.guardar == "0") {
    //   this.toastr.info("Usuario no tiene permiso para guardar");
    // } else {
      let resp = await this.validaDataGlobal().then((respuesta) => {
        if (respuesta) {
          if(validacion == 'save'){
            this.confirmSave(
              "Seguro desea guardar la Regla?",
              "SAVE_REGLA"
            );
          }else if(validacion == 'update'){
            this.confirmSave(
              "Seguro desea modificar la Regla?",
              "UPDATE_REGLA"
            );
            
          }
          
        }
      });
    //}
  }

  validaDataGlobal() {
   
    let flag = false;
    return new Promise((resolve, reject) => {
      
        if (this.documento.tipo_regla == "" || this.documento.tipo_regla == undefined) {
          this.toastr.info("Debe seleccionar un Tipo de Regla")
          flag = true;
        }
        else if (this.documento.numero_regla == "" || this.documento.numero_regla == undefined) {
          this.toastr.info("Debe ingresar un Número de Regla")
          flag = true;
        }
        else if (this.documento.descripcion == 0 || this.documento.descripcion == undefined) {
          this.toastr.info("Debe ingresar una Descripción")
          flag = true;
        }else if (
          this.codigoDetalles.length <= 0 || !this.codigoDetalles.length
        ) {
          this.toastr.info("Debe ingresar al menos un detalle par la regla")
          flag = true;
        }
     
      !flag ? resolve(true) : resolve(false);
    })
  }

  async confirmSave(message, action, infodev?: any) {
    Swal.fire({
      title: "Atención!!",
      text: message,
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#DC3545",
      confirmButtonColor: "#13A1EA",
      confirmButtonText: "Aceptar",
    }).then((result) => {
      if (result.value) {
        if(action == "SAVE_REGLA"){
          this.guardarRegla()
        } else if(action == "UPDATE_REGLA"){
          this.modificarRegla()
        }
        
      }
    });
  }

  getCatalogos() {
    let data = {
      params: "'CON_TIPO_REGLA'",
      //params: "'OP_CONCEPTOS','PAG_TIPO_DESEMBOLSO'",
    };
    this.msgSpinner = "Buscando tipo de regla...";
    this.lcargando.ctlSpinner(true);
    this.apiSrv.getCatalogo(data).subscribe(

      (res) => {
        this.tipoRegla = res["data"]['CON_TIPO_REGLA'];
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  selectTipoCodigo(event){
    if(this.tipoCodigo!= undefined){
      this.addDetalle = false;
    }else{
     
      this.addDetalle = true;
    }
  }

  agregarItems(){

    if(this.documento.numero_regla=='' || this.documento.numero_regla==undefined){
      this.toastr.info('Debe ingresar un Número de Regla')
    }else if(this.tipoCodigo==0 || this.tipoCodigo==undefined){
      this.toastr.info('Debe seleccionar un Tipo de Código')
    }else if(this.tipoMovimiento==0 || this.tipoMovimiento==undefined){
      this.toastr.info('Debe seleccionar un Tipo de Movimiento')
    }
    // else if(this.tipoCodigo=='PRE'){
    //     if(this.grupo.codigo_presupuesto ==undefined || this.grupo.codigo_presupuesto ==""){
    //       this.toastr.info('Debe seleccionar un Codigo de Presupuesto')
    //     }
    // }else if(this.tipoCodigo=='CON'){
    //     if(this.grupo.codigo_cuenta_contable ==undefined || this.grupo.codigo_cuenta_contable ==""){
    //       this.toastr.info('Debe seleccionar un Codigo de Cuenta ')
    //     }
    // }
    else{
      let nuevo = {}
      nuevo = {
        id_regla_det: 0,
        numero_regla: this.documento.numero_regla,
        tipo_codigo: this.tipoCodigo, 
        tipo_movimiento: this.tipoMovimiento,
        codigo_oficial: this.grupo.codigo_oficial != "" ? this.grupo.codigo_oficial  : undefined,
        codigo: this.grupo.codigo_cuenta_contable == "" ? this.grupo.codigo_presupuesto  : this.grupo.codigo_cuenta_contable,
        descripcion: this.grupo.descripcion_cuenta == "" ? this.grupo.descripcion_presupuesto :this.grupo.descripcion_cuenta ,
      }
      this.codigoDetalles.push(nuevo);
    }

  }

  selectTipoMovimiento(){

  }

 
  guardarRegla() {

    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "Está a punto de guardar una Nueva Regla?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        this.msgSpinner = 'Guardando Regla...';
        this.lcargando.ctlSpinner(true);
        this.documento.estado= 'A'
        let data = {
          documento: this.documento,
          detalles: this.codigoDetalles
        }
       
        this.apiSrv.setRegla(data).subscribe(
          (res) => {
            if (res["status"] == 1) {
              this.documento = res['data'];
              this.id_regla = this.documento.id_regla_cab
              this.formReadOnly = true;
              this.vmButtons[0].habilitar = false;
              //this.vmButtons[2].habilitar = false;
              this.vmButtons[3].habilitar = false;
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "success",
                title: "Regla generada",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8',
              }).then((res) => {
                if (res.isConfirmed) {
                 // this.triggerPrint();
                }
              })
            } else {
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "error",
                title: "Error al generar la nueva regla",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8',
              });
            }
          },
          (error) => {
            this.lcargando.ctlSpinner(false);
            this.toastr.info(error.error.message);
          }
        );
      }
    });
    //}
  }

  modificarRegla(){
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "Está a punto de modificar una Regla?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        this.msgSpinner = 'Modificando Regla...';
        this.lcargando.ctlSpinner(true);
        this.documento.estado= 'A'
        let data = {
          id_regla: this.id_regla,
          documento: this.documento,
          detalles: this.codigoDetalles,
          detallesEliminar: this.reglasDetallesIds
        }
       
        this.apiSrv.updateRegla(data).subscribe(
          (res) => {
            if (res["status"] == 1) {
              this.documento = res['data'];
              this.formReadOnly = true;
              this.vmButtons[0].habilitar = false;
              //this.vmButtons[2].habilitar = false;
              this.vmButtons[3].habilitar = false;
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "success",
                title: "Regla modificada con éxito",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8',
              }).then((res) => {
                if (res.isConfirmed) {
                 // this.triggerPrint();
                }
              })
            } else {
              this.lcargando.ctlSpinner(false);
              Swal.fire({
                icon: "error",
                title: "Error al modificar regla",
                text: res['message'],
                showCloseButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#20A8D8',
              });
            }
          },
          (error) => {
            this.lcargando.ctlSpinner(false);
            this.toastr.info(error.error.message);
          }
        );
      }
    });
  }

  consultarReporte(){

    if( this.documento.numero_regla == undefined ||  this.documento.numero_regla == ''){
      this.toastr.info('El campo número de regla no puede ser vacio')
    }else{
      this.filter.numero_regla = this.documento.numero_regla
      let data = {
        filter: this.filter,
        paginate: this.paginate
      };
      this.msgSpinner = "Cargando reporte...";
      this.lcargando.ctlSpinner(true);
      this.apiSrv.consultaReporte(data).subscribe(
  
        (res) => {
         
          res["data"].forEach(e => {
           
            this.totalDebe += +e.valor_debe_regla;
            this.totalHaber += +e.valor_haber_regla;

          })
          if(this.totalDebe != this.totalHaber){
            this.diferencia= this.totalDebe - this.totalHaber
          }
          this.dataReporte = res["data"];
          if(this.tabActiva == 'nav-reporte' && this.dataReporte.length > 0){
            this.vmButtons[4].habilitar = false;
          }
          this.lcargando.ctlSpinner(false);
        },
        (error) => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.message);
        }
      );
    }

   
  }

  btnExportarExcel() {

    let data = {
      title: 'Reporte reglas ESIGEF',
      rows:  this.dataReporte
    }
    console.log(data)
  
    this.xlsService.exportReglasEsigef(data, 'Reporte reglas ESIGEF')
  }

  modalCuentaContable(data) {
    let modal = this.modalSrv.open(ModalCuentPreComponent, {
      size: "lg",
      backdrop: "static",
      windowClass: "viewer-content-general",
    })

    modal.componentInstance.validacionModal = data;
    modal.componentInstance.validar = true
  

  }

  expandListReglas() {
    // abre modal de forma de pago distinto para cada titulo que se vaya a pagar
    const modal = this.modalSrv.open(ListReglasComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' })
    // modal.componentInstance.contr = this.contribuyenteActive;
    modal.componentInstance.permissions = this.permissions;
    modal.componentInstance.tipoRgla = this.tipoRegla;
    
  }
  removeDetalleReglas(d) {
    if (d.id_regla_det !== null ||d.id_regla_det !== 0  ) this.reglasDetallesIds.push(d.id_regla_det)
    console.log(this.reglasDetallesIds)
    this.codigoDetalles.splice(this.codigoDetalles.indexOf(d), 1)
    
  }

  exportarPdf(){
    window.open(environment.ReportingUrl + "rpt_contabilidad_reglas_esigef.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_regla_cab=" + this.id_regla, '_blank')

    //rpt_contabilidad_reglas_esigef
  }


  confirmRestore() {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea reiniciar el formulario?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
    }).then((result) => {
      if (result.isConfirmed) {
        this.restoreForm();
      }
    });
  }

  restoreForm() {

    this.addDetalle = true;
    this.formReadOnly = false;
    this.codigoDetalles = [];
    this.documento = {
      tipo_regla: 0,
      numero_regla:"",
      descripcion:"",
    }
    this.grupo = {
      id_cuenta_contable: null,
      codigo_grupo_producto: null,
      descripcion: null,
      codigo_cuenta_contable: null,
      codigo_oficial: null,
      codigo_presupuesto: null,
      estado: null,
      descripcion_cuenta: null,
      descripcion_presupuesto: null,
      tipo_bien: null
    }

    this.tabActiva = 'nav-configuracion'
    this.tipoCodigo = ""
    this.tipoMovimiento = ""
    this.vmButtons[0].habilitar = false;
    this.vmButtons[2].habilitar = true;
    this.vmButtons[3].habilitar = true;
    this.vmButtons[4].habilitar = true;
    this.vmButtons[4].showimg = false;
    this.vmButtons[5].habilitar = false;
  }

  limpiarFiltros() {
    this.filter= {
      fecha_desde: moment().startOf('month').format('YYYY-MM-DD'),
      fecha_hasta: moment().endOf('month').format('YYYY-MM-DD'),
      numero_regla: '',
    }
    this.vmButtons[4].habilitar = true;
  }

}
