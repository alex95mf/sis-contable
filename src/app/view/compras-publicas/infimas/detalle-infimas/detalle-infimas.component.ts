import { Component, Input, OnInit, ViewChild, OnDestroy} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CommonService } from 'src/app/services/commonServices';
import { ModalProveedoresComponent } from 'src/app/config/custom/modal-proveedores/modal-proveedores.component';
import * as myVarGlobals from "../../../../global";
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ToastrService } from 'ngx-toastr';
import moment from 'moment';
import { InfimasService } from '../infimas.service';
import { CierreMesService } from 'src/app/view/contabilidad/ciclos-contables/cierre-de-mes/cierre-mes.service';
import { environment } from 'src/environments/environment';
import { EncargadoComponent } from 'src/app/config/custom/encargado/encargado.component';
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';



@Component({
standalone: false,
  selector: 'app-detalle-infimas',
  templateUrl: './detalle-infimas.component.html',
  styleUrls: ['./detalle-infimas.component.scss']
})
export class DetalleInfimasComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  validaciones: ValidacionesFactory = new ValidacionesFactory()

  fTitle = "Orden de Pago";
  mensajeSpinner: string = "Cargando...";
  vmButtons: any = [];
  listaSolicitudes: any = []
  programa: any = []
  departamento: any = []
  atribucion: any = []
  asigna: any = []
  proceso: any = []
  permissions: any;
  empresLogo: any;
  dataUser: any;
  proveedorActive: any = {
    razon_social: "",
    //id_proveedor:0
  };
  adminActive: any = {
    nombre:"",

  };
  adjudicadoChecked: boolean = true;
  disabledCampo: boolean = false;
  deshabilitar: boolean = false;
  deshabilitarReporte: boolean = true;
  disabledCampoCM: boolean = false;
  disabledCampoCP: boolean = false;
  disabledCampoOC: boolean = false;
  disabledDetalle: boolean = false;


  today: any;
  tomorrow: any;
  firstday: any;
  lastday:any;

  fecha_publicacion:any;
  fecha_recepcion:any;
  fecha:any;

  datosInfimas: any = {
    inf_num_oficio: "",
    inf_fecha_publicacion: moment(new Date()).format('YYYY-MM-DD'),
    con_fecha_adjudicacion: moment(new Date()).format('YYYY-MM-DD'),
    inf_num_sumilla: "",
    inf_cod_sercop: "",
    inf_fecha_recepcion:moment(new Date()).format('YYYY-MM-DD'),
    inf_proveedor_fecha:moment(new Date()).format('YYYY-MM-DD'),
    fk_inf_proveedores:"",
    inf_num_orden:"",
    inf_adj_observaciones:"",
    icp: "",
    idp:""

  }


  detalles: any = {
    programa: null,
    departamento: null,
    atribucion: null,
    asigna: null,
    proceso: null,
    anexos: null,
  }
  infimasDetalles: any =[];

  adjudList: any = [
    {value: "P",label: "PENDIENTE"},
    {value: "S",label: "ADJUDICADO"},
    {value: "N",label: "DESIERTO"}
  ]
  totalAdjudicado: any = 0
  totalCotizado: any = 0
  totalAprobado: any = 0

  @Input() item: any;
  @Input() model: any;

  fileList: FileList;
  fileList2: FileList;
  fileList3: FileList;
  fileList4:FileList;
  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private commonVrs: CommonVarService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private service: InfimasService,
    private cierremesService: CierreMesService
  ) {
    this.commonVrs.selectProveedorCustom.asObservable().subscribe(
      (res) => {
        this.proveedorActive = res;
        this.datosInfimas.inf_cuenta_bancaria = this.proveedorActive.num_cuenta;

      }
    );
    this.commonVrs.compPubInfimas.asObservable().subscribe(
      (res) => {
        //console.log(res)
        if(res.custom1 == 'INF-DATOS'){
          this.disabledCampo = res.validacion;
        }else if(res.custom1 == 'INF-ACTAENTREGA'){
          this.disabledCampoCM = res.validacion;
        }else if(res.custom1 == 'INF-FACTURA'){
          this.disabledCampoCP = res.validacion;
        }else if(res.custom1 == 'INF-PROVEEDOR'){
          this.disabledCampoOC = res.validacion;
        }


      }
    );
    this.commonVrs.encargadoSelect.asObservable().subscribe(
      (res) => {
        //console.log(res)
        this.adminActive.id_empleado= res['id_empleado']
        this.adminActive.nombre = res['emp_full_nombre']
      }
    );



   }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsComprasP",
        paramAccion: "",
        boton: { icon: "fas fa-save", texto: " GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },

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
      }

    ]
    //console.log('Item '+this.item)
    this.today = new Date();
    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.firstday = new Date(this.today.getFullYear(),this.today.getMonth(), 1);
    this.lastday = new Date(this.today.getFullYear(),this.today.getMonth() + 1, 0);

    setTimeout(() => {

      //console.log(this.item)
      let valorTotalCotizado = 0;
      let valorTotalAprobado = 0;
      this.item['detalles'].forEach(element => {
        valorTotalCotizado += +element.precio_cotizado;
        valorTotalAprobado += +element.precio_aprobado;

      });
      this.totalCotizado= valorTotalCotizado
      this.totalAprobado= valorTotalAprobado
      this.infimasDetalles = this.item['detalles']

      //this.calcularTotalAprobado()

      //this.detalles.programa = this.item['catalogo_programa']['valor']

      //console.log(' Programa '+this.detalles.programa)
      //this.detalles.departamento = this.item['catalogo_departamento']['valor']
      //this.detalles.atribucion = this.item['catalogo']['valor']
      if(this.item['tipo_proceso']=='Infimas'){
        this.detalles.proceso = 'INFIMAS'
      }


      this.detalles.anexos = this.item['anexos']
     // this.cargarCondiciones()
      this.datosInfimas = this.item

      if(this.item.inf_fecha_publicacion == undefined || this.item.inf_fecha_publicacion == null){
        this.datosInfimas.inf_fecha_publicacion= moment(new Date()).format('YYYY-MM-DD')
      }
      if(this.item.con_fecha_adjudicacion == undefined || this.item.con_fecha_adjudicacion == null){
        this.datosInfimas.con_fecha_adjudicacion=moment(new Date()).format('YYYY-MM-DD')
      }
      if(this.item.inf_fecha_recepcion == undefined || this.item.inf_fecha_recepcion == null){
        this.datosInfimas.inf_fecha_recepcion=moment(new Date()).format('YYYY-MM-DD')
      }

      if(this.item['proveedor_inf']!=null){
        this.datosInfimas.inf_cuenta_bancaria = this.item['proveedor_inf']['num_cuenta']
        this.proveedorActive.razon_social = this.item.proveedor_inf.razon_social
      }

      //this.datosInfimas.inf_fecha_publicacion = moment(new Date()).format('YYYY-MM-DD')
      //this.datosInfimas.inf_fecha_recepcion = moment(new Date()).format('YYYY-MM-DD')
      if(this.item.inf_proveedor_fecha==null||  this.item.inf_proveedor_fecha == undefined){
        this.datosInfimas.inf_proveedor_fecha = moment(new Date()).format('YYYY-MM-DD')
      }
      if(this.item.inf_num_orden!=null ){
        this.deshabilitar=true
        this.deshabilitarReporte=false
      }

      //this.datosInfimas.inf_proveedor_fecha = this.item.inf_proveedor_fecha.split(" ")[0];
      if(this.datosInfimas.inf_adjudicado=='S'){
       // this.disabledDetalle= true;

        this.proveedorActive.razon_social = this.item.proveedor_inf.razon_social
        if( this.item['administrador_inf']!=null){
          this.adminActive.nombre = this.item['administrador_inf']['emp_full_nombre']
          //this.adminActive.nombre = this.item.inf_admin_compra
        }
       // this.proveedorActive.id_proveedor = this.item.fk_inf_proveedores
        //console.log(this.proveedorActive.id_proveedor)
      }else if(this.datosInfimas.inf_adjudicado=='N' || this.datosInfimas.inf_adjudicado=='P'|| this.adjudList.value == 'N' || this.adjudList.value == 'P'){
        //this.disabledDetalle= false;
        this.proveedorActive.razon_social = "";
        this.adminActive.nombre = "";
        this.datosInfimas.inf_proveedor_fecha=moment(new Date()).format('YYYY-MM-DD');
        this.datosInfimas.valor="";
        this.datosInfimas.inf_cod_necesidad="";
      }


    }, 50);
  }

  metodoGlobal(event: any) {
    switch (event.items.boton.texto) {
      case " GUARDAR":

        this.model = true
        break;
      case "REGRESAR":
        //this.model = true
        break;
    }
  }
  validaPermisos = () => {
    (this as any).mensajeSpinner = 'Cargando Permisos de Usuario...';
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.empresLogo = this.dataUser.logoEmpresa;

    let params = {
      codigo: myVarGlobals.fCompPubInfi,
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

        }
      },
      err => {
        this.lcargando.ctlSpinner(false)
        this.toastr.error(err.error.message, 'Error cargando Permisos de Usuario')
      }
    )
  }

  async validaDatosInfimas() {
    let resp = await this.validaDataGlobal().then((respuesta) => {
      if(respuesta) {
          this.guardarInfimaDatos();
      }
    });
  }

validaDataGlobal() {
  let flag = false;
  return new Promise((resolve, reject) => {
    flag = false;
    // if (this.datosInfimas.inf_fecha_recepcion > this.datosInfimas.inf_fecha_publicacion){
    //   this.toastr.info("La fecha de Recepción no puede ser mayor a la fecha de Publicación");
    //   flag = true;
    // }
    /*else if(
      this.gesTicket.observacion == "" ||
      this.gesTicket.observacion == undefined
    ) {
      this.toastr.info("El campo Observacion no puede ser vacio");
      flag = true;
    }*/
    !flag ? resolve(true) : resolve(false);
  })
}

async validaDetallesInfimas() {



  this.infimasDetalles.forEach(element => {
    if (element.precio_aprobado > element.precio_cotizado){
      this.toastr.info("El valor aprobado: "+element.precio_aprobado+
      " super al precio cotizado: "+element.precio_cotizado)
      return
    }


  });





    this.validaDetallesGlobal().then(respuesta => {
      if (respuesta) {
        this.confirmSave("Seguro desea guardar los detalles de esta solicitud ?", "SAVE_DETALLES");
      }
    }).catch((err) => {
      console.log(err);
      this.toastr.info(err,'Errores de Validacion', { enableHtml: true})
    });

}

validaDetallesGlobal() {
  console.log(this.totalAprobado.toFixed(2), this.totalCotizado.toFixed(2))
  let c = 0;
  let mensajes: string = '';
  return new Promise((resolve, reject) => {

    if(this.totalAprobado.toFixed(2) > this.totalCotizado.toFixed(2)){
      mensajes += "El valor total aprobado de $"+ this.commonService.formatNumberDos(this.totalAprobado.toFixed(2)) +" no puede ser mayor al valor total cotizado $"
        + this.commonService.formatNumberDos(this.totalCotizado.toFixed(2)) + " la diferencia es de $ "
        + (this.commonService.formatNumberDos(this.totalAprobado.toFixed(2) - this.totalCotizado.toFixed(2) )) +"<br>"
    }
    return (mensajes.length) ? reject(mensajes) : resolve(true)

  });
}

async confirmSave(message, action) {

  Swal.fire({
    title: "Atención!!",
    text: message,
    //icon: "warning",
    showCancelButton: true,
    cancelButtonColor: '#DC3545',
    confirmButtonColor: '#13A1EA',
    confirmButtonText: "Aceptar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
   // this.processing = false;
    if (result.value) {
      if (action == "SAVE_DETALLES") {
        this.guardarInfimaDetalles();
      }
    }
  })
}



  calcularTotalAprobado(){
    let valorTotalAprobado = 0;
    this.infimasDetalles.forEach(element => {
       Object.assign(element,{ precio_aprobado:parseFloat(element.cantidad_aprobada) * parseFloat(element.precio_unitario_aprobado)})
      valorTotalAprobado += +element.precio_aprobado;
    });
    this.totalAprobado= valorTotalAprobado
  }
  cargaArchivo(archivos) {
    if (archivos.length > 0) {
      this.fileList = archivos
      setTimeout(() => {
        this.toastr.info('Ha seleccionado ' + this.fileList.length + ' archivo(s).', 'Anexos de Documentación Final')
      }, 50)
    }
  }
  cargaArchivo2(archivos) {
    if (archivos.length > 0) {
      this.fileList2 = archivos
      setTimeout(() => {
        this.toastr.info('Ha seleccionado ' + this.fileList2.length + ' archivo(s).', 'Anexos de Documentación Final')
      }, 50)
    }
  }
  cargaArchivo3(archivos) {
    if (archivos.length > 0) {
      this.fileList3 = archivos
      setTimeout(() => {
        this.toastr.info('Ha seleccionado ' + this.fileList3.length + ' archivo(s).', 'Anexos de Documentación Final')
      }, 50)
    }
  }
  cargaArchivo4(archivos) {
    if (archivos.length > 0) {
      this.fileList4 = archivos
      setTimeout(() => {
        this.toastr.info('Ha seleccionado ' + this.fileList4.length + ' archivo(s).', 'Anexos de Orden de Compra Proveedor')
      }, 50)
    }
  }
  uploadFile() {
    console.log('upload files')
    let data = {
      //module: this.permissions.id_modulo,
      module:20,
      component: myVarGlobals.fCompPubInfi,
      identifier: this.item.id_solicitud,
      id_controlador: myVarGlobals.fCompPubInfi,
      accion: `Nuevo anexo para Datos Infimas ${this.item.id_solicitud}`,
      ip: this.commonService.getIpAddress(),
      custom1:'INF-DATOS'
    }
    if(this.fileList.length!=0){
      for (let i = 0; i < this.fileList.length; i++) {
        this.UploadService(this.fileList[i], data);
      }
    }
    this.fileList = undefined
    this.lcargando.ctlSpinner(false)
  }
  uploadFile2() {
    console.log('upload files')
    let data = {
      //module: this.permissions.id_modulo,
      module:20,
      component: myVarGlobals.fCompPubInfi,
      identifier: this.item.id_solicitud,
      id_controlador: myVarGlobals.fCompPubInfi,
      accion: `Nuevo anexo para Documentacion Final Infimas ${this.item.id_solicitud}`,
      ip: this.commonService.getIpAddress(),
      custom1:'INF-ACTAENTREGA'
    }
    if(this.fileList2.length!=0){
      for (let i = 0; i < this.fileList2.length; i++) {
        this.UploadService(this.fileList2[i], data);
      }
    }

    this.fileList2 = undefined

    this.lcargando.ctlSpinner(false)
  }
  uploadFile3() {
    console.log('upload files')
    let data = {
      //module: this.permissions.id_modulo,
      module:20,
      component: myVarGlobals.fCompPubInfi,
      identifier: this.item.id_solicitud,
      id_controlador: myVarGlobals.fCompPubInfi,
      accion: `Nuevo anexo para Documentacion Final Infimas ${this.item.id_solicitud}`,
      ip: this.commonService.getIpAddress(),
      custom1:'INF-FACTURA'
    }

    if(this.fileList3.length!=0){
      for (let i = 0; i < this.fileList3.length; i++) {
        this.UploadService(this.fileList3[i], data);
      }
    }
    this.fileList3 = undefined

    this.lcargando.ctlSpinner(false)
  }
  uploadFile4() {
    console.log('upload files')
    let data = {
      //module: this.permissions.id_modulo,
      module:20,
      component: myVarGlobals.fCompPubInfi,
      identifier: this.item.id_solicitud,
      id_controlador: myVarGlobals.fCompPubInfi,
      accion: `Nuevo anexo para Orden de Compra en Proveedor Infimas ${this.item.id_solicitud}`,
      ip: this.commonService.getIpAddress(),
      custom1:'INF-PROVEEDOR'
    }

    if(this.fileList4.length!=0){
      for (let i = 0; i < this.fileList4.length; i++) {
        this.UploadService(this.fileList4[i], data);
      }
    }
    this.fileList4 = undefined

    this.lcargando.ctlSpinner(false)
  }

  UploadService(file, payload?: any): void {
    this.service.uploadAnexo(file, payload).subscribe(
      res => {
        this.commonVrs.contribAnexoLoad.next({condi:'infimas'})
      },
      err => {
        this.toastr.info(err.error.message);
      })
  }


  guardarInfimaDatos() {
    Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea guardar datos de Infimas?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
      }).then((result) => {
          if (result.isConfirmed) {

            (this as any).mensajeSpinner = "Verificando período contable";
            this.lcargando.ctlSpinner(true);
            let datos = {
              "anio": Number(moment().format('YYYY')),
              "mes": Number(moment().format('MM')),
            }
              this.cierremesService.obtenerCierresPeriodoPorMes(datos).subscribe(res => {

              /* Validamos si el periodo se encuentra aperturado */
                if (res["data"][0].estado !== 'C') {

                    (this as any).mensajeSpinner = "Guardando datos...";
                    this.lcargando.ctlSpinner(true);

                    let data = {
                      infima: {
                        id_solicitud:this.item.id_solicitud
                      },
                      datos: {
                        num_oficio: this.datosInfimas.inf_num_oficio,
                        fecha_publicacion: this.datosInfimas.inf_fecha_publicacion,
                        num_sumilla: this.datosInfimas.inf_num_sumilla,
                        cod_sercop: this.datosInfimas.inf_cod_sercop,
                        fecha_recepcion: this.datosInfimas.inf_fecha_recepcion,
                      }
                    }

                    this.service.setInfimaDatos(data).subscribe(
                        (res) => {
                          // console.log(res);
                            if (res["status"] == 1) {
                            //this.needRefresh = true;
                            this.lcargando.ctlSpinner(false);
                            Swal.fire({
                                icon: "success",
                                title: "Los Datos fueron guardados con éxito",
                                text: res['message'],
                                showCloseButton: true,
                                confirmButtonText: "Aceptar",
                                confirmButtonColor: '#20A8D8',
                            }).then((result) => {
                              if (result.isConfirmed) {
                                //this.limpiar();
                                this.datosInfimas= res['data']
                                if(this.fileList!=undefined){
                                  this.uploadFile();
                                }

                              }
                            });
                            } else {
                            this.lcargando.ctlSpinner(false);
                            Swal.fire({
                                icon: "error",
                                title: "Error",
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
                    )
                } else {
                  this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
                  this.lcargando.ctlSpinner(false);
                }

              }, error => {
                  this.lcargando.ctlSpinner(false);
                  this.toastr.info(error.error.mesagge);
              })
        }
    });
  }

  guardarInfimaDetalles(){

    (this as any).mensajeSpinner = "Verificando período contable";
    this.lcargando.ctlSpinner(true);
    let datos = {
      "anio": Number(moment().format('YYYY')),
      "mes": Number(moment().format('MM')),
    }
      this.cierremesService.obtenerCierresPeriodoPorMes(datos).subscribe(res => {

      /* Validamos si el periodo se encuentra aperturado */
        if (res["data"][0].estado !== 'C') {
            let data = {
              detalles: this.infimasDetalles
            }
            this.lcargando.ctlSpinner(true);
            this.service.saveInfimaDetalles(data).subscribe(
              (res) => {
                  console.log(res['data']);
                  if (res["status"] == 1) {
                  //this.needRefresh = true;
                  this.lcargando.ctlSpinner(false);
                  Swal.fire({
                      icon: "success",
                      title: "Los Datos fueron guardados con éxito",
                      text: res['message'],
                      showCloseButton: true,
                      confirmButtonText: "Aceptar",
                      confirmButtonColor: '#20A8D8',
                  });
                  let valorTotalCotizado = 0;
                  let valorTotalAprobado = 0;
                  res['data'].forEach(element => {
                    valorTotalCotizado += +element.precio_cotizado;
                    valorTotalAprobado += +element.precio_aprobado;

                  });
                  this.totalCotizado= valorTotalCotizado
                  this.totalAprobado= valorTotalAprobado


                  this.infimasDetalles= res['data']
                  this.lcargando.ctlSpinner(false);

                  } else {
                  this.lcargando.ctlSpinner(false);
                  Swal.fire({
                      icon: "error",
                      title: "Error",
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
            )
        } else {
          this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
          this.lcargando.ctlSpinner(false);
        }

      }, error => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.mesagge);
      })

  }

  generarOrden(){

    this.infimasDetalles.forEach(element => {
      const precioFloat = parseFloat(element.precio_aprobado).toFixed(2);
      // Suma el valor transformado
      this.totalAdjudicado += parseFloat(precioFloat);
     /*  element.precio_aprobado */
    //  this.datosInfimas

    });

    if(this.datosInfimas.inf_valor =='' || this.datosInfimas.inf_valor == 0){
      this.toastr.info("El valor adjudicado debe ser mayor a 0")
      return
    }else if(this.datosInfimas.inf_valor != this.totalAprobado.toFixed(2)){
      console.log(this.datosInfimas.inf_valor +'---------'+this.totalAdjudicado)
      this.toastr.info("El valor adjudicado debe ser igual al valor total aprobado")
      return
    }





    let baseSercop: any = 6700.00
    console.log(this.datosInfimas.inf_valor+'-------'+this.totalCotizado)
    if(this.datosInfimas.inf_adjudicado == 'S' && this.proveedorActive.id_proveedor ==undefined){
      this.toastr.info("Para generar la orden debe seleccionar un Proveedor")
    }
    else if(this.datosInfimas.inf_adjudicado == 'S' && this.adminActive.id_empleado ==undefined){
      this.toastr.info("Para generar la orden debe seleccionar un Administrador de Compra")
    }else if(this.datosInfimas.inf_valor > this.totalCotizado.toFixed(2)){
      this.toastr.info("El valor adjudicado de $"+ this.commonService.formatNumberDos(this.datosInfimas.inf_valor) +" no puede ser mayor al valor total cotizado $"
      + this.commonService.formatNumberDos(this.totalCotizado.toFixed(2)) + " la diferencia es de $ "
      + (this.commonService.formatNumberDos(this.datosInfimas.inf_valor - this.totalCotizado.toFixed(2) )))
    }else if(this.datosInfimas.inf_valor != this.totalAprobado.toFixed(2)){
      this.toastr.info("El valor adjudicado de $"+ this.commonService.formatNumberDos(this.datosInfimas.inf_valor) +" debe ser igual al valor total aprobado de $"
      + this.commonService.formatNumberDos(this.totalAprobado.toFixed(2)) + " la diferencia es de $ "
      + (this.commonService.formatNumberDos(this.datosInfimas.inf_valor - this.totalAprobado.toFixed(2) )))
    }else  if(this.datosInfimas.inf_valor > this.commonService.formatNumberDos(this.datosInfimas.inf_valor)){
      this.toastr.info("El valor adjudicado de $"+ this.commonService.formatNumberDos(this.datosInfimas.inf_valor) +" no debe ser mayor al valor máximo de infimas en base al SERCOP de $"
      + this.commonService.formatNumberDos(baseSercop.toFixed(2)) + " la diferencia es de $ "
      + (this.commonService.formatNumberDos(this.datosInfimas.inf_valor - baseSercop.toFixed(2))))
    }
    else{
      Swal.fire({
        icon: "warning",
        title: "¡Atención!",
        text: "¿Seguro que desea guardar datos de Proveedor de Infimas?",
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        cancelButtonColor: '#F86C6B',
        confirmButtonColor: '#4DBD74',
        }).then((result) => {
            if (result.isConfirmed) {

              (this as any).mensajeSpinner = "Verificando período contable";
              this.lcargando.ctlSpinner(true);
              let datos = {
                "anio": Number(moment().format('YYYY')),
                "mes": Number(moment().format('MM')),
              }
                this.cierremesService.obtenerCierresPeriodoPorMes(datos).subscribe(res => {

                /* Validamos si el periodo se encuentra aperturado */
                  if (res["data"][0].estado !== 'C') {

                    (this as any).mensajeSpinner = "Guardando datos de Proveedor...";
                    this.lcargando.ctlSpinner(true);

                    let data = {
                      infima: {
                        id_solicitud:this.item.id_solicitud
                      },
                      datos: {
                        inf_adjudicado: this.datosInfimas.inf_adjudicado,
                        fk_inf_proveedores:this.proveedorActive.id_proveedor,
                        adj_fecha:this.datosInfimas.inf_proveedor_fecha,
                        adj_valor:this.datosInfimas.inf_valor,
                        adj_cod_necesidad:this.datosInfimas.inf_cod_necesidad,
                        adj_observaciones:this.datosInfimas.inf_adj_observaciones,
                        inf_num_orden:this.datosInfimas.inf_num_orden,
                        inf_admin_compra:this.adminActive.id_empleado,
                      }
                    }

                    this.service.setInfimaProveedor(data).subscribe(
                        (res) => {
                           // console.log(res);
                            if (res["status"] == 1) {
                            //this.needRefresh = true;
                            this.lcargando.ctlSpinner(false);
                            Swal.fire({
                                icon: "success",
                                title: "Los Datos fueron guardados con éxito",
                                text: res['message'],
                                showCloseButton: true,
                                confirmButtonText: "Aceptar",
                                confirmButtonColor: '#20A8D8',
                            }).then((result) => {
                              if (result.isConfirmed) {
                                //this.limpiar();
                                this.datosInfimas= res['data']
                                if(this.datosInfimas.inf_adjudicado=='S'){
                                  this. deshabilitar=true
                                  this.adjudList = this.adjudList.filter(e => e.value != 'P')
                                }

                                this.deshabilitarReporte=false
                                //this.uploadFile();
                              }
                            });
                            } else {
                            this.lcargando.ctlSpinner(false);
                            Swal.fire({
                                icon: "error",
                                title: "Error",
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
                    )
                  } else {
                    this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
                    this.lcargando.ctlSpinner(false);
                  }

                }, error => {
                    this.lcargando.ctlSpinner(false);
                    this.toastr.info(error.error.mesagge);
                })

          }
      });
    }

  }

  guardarInfimaDocFinal(){
     Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "¿Seguro que desea guardar documentación final de Infimas?",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      cancelButtonColor: '#F86C6B',
      confirmButtonColor: '#4DBD74',
      }).then((result) => {
          if (result.isConfirmed) {

            (this as any).mensajeSpinner = "Verificando período contable";
            this.lcargando.ctlSpinner(true);
            let datos = {
              "anio": Number(moment().format('YYYY')),
              "mes": Number(moment().format('MM')),
            }
              this.cierremesService.obtenerCierresPeriodoPorMes(datos).subscribe(res => {

              /* Validamos si el periodo se encuentra aperturado */
                if (res["data"][0].estado !== 'C') {
                  (this as any).mensajeSpinner = "Guardando datos de Documentación Final...";
                  this.lcargando.ctlSpinner(true);

                  let data = {
                    infima: {
                      id_solicitud:this.item.id_solicitud
                    },
                    datos: {
                      inf_cuenta_bancaria: this.datosInfimas.inf_cuenta_bancaria,
                      inf_final_observaciones:this.datosInfimas.inf_final_observaciones,
                    }
                  }

                  this.service.setInfimaDocFinal(data).subscribe(
                      (res) => {
                         // console.log(res);
                          if (res["status"] == 1) {
                          //this.needRefresh = true;
                          this.lcargando.ctlSpinner(false);
                          Swal.fire({
                              icon: "success",
                              title: "Los Datos fueron guardados con éxito",
                              text: res['message'],
                              showCloseButton: true,
                              confirmButtonText: "Aceptar",
                              confirmButtonColor: '#20A8D8',
                          }).then((result) => {
                            if (result.isConfirmed) {
                              //this.limpiar();
                              this.datosInfimas= res['data']
                              if(this.fileList2 != undefined){
                                this.uploadFile2();
                              }

                              if(this.fileList3 != undefined){
                                this.uploadFile3();
                              }


                              // this.commonVrs.compPubInfimas.next(true)
                            }
                          });
                          } else {
                          this.lcargando.ctlSpinner(false);
                          Swal.fire({
                              icon: "error",
                              title: "Error",
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
                  )

                } else {
                  this.toastr.info("El periodo contable se encuentra cerrado, por favor verificar");
                  this.lcargando.ctlSpinner(false);
                }

              }, error => {
                  this.lcargando.ctlSpinner(false);
                  this.toastr.info(error.error.mesagge);
              })
        }
    });
  }


  imprimirOrden(){
      console.log()
        window.open(environment.ReportingUrl + "rep_cpinfimas_orden_compra.pdf?&j_username=" + environment.UserReporting + "&j_password=" + environment.PasswordReporting + "&id_solicitud=" + this.item.id_solicitud , '_blank')
    }


  onCheckboxChange(event: any) {

    if (event.target.checked) {
      //console.log(event.target.checked)
      this.adjudicadoChecked = true;
    } else {
      //console.log('unchecked')
      //console.log(event.target.checked)
      this.adjudicadoChecked = false;
    }
  }

  expandListProveedores() {
    // if (this.permissions.consultar == "0") {
    //   this.toastr.warning("No tiene permisos consultar Proveedores.", this.fTitle);
    // } else {
      const modalInvoice = this.modalService.open(ModalProveedoresComponent,{
        size:"xl",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
      modalInvoice.componentInstance.permissions = this.permissions;
      //modalInvoice.componentInstance.verifyRestore = this.verifyRestore;
      //modalInvoice.componentInstance.validacion = 8;
    }
  //}
  expandListAdminCompra() {
    // if (this.permissions.consultar == "0") {
    //   this.toastr.warning("No tiene permisos consultar Proveedores.", this.fTitle);
    // } else {
      const modalInvoice = this.modalService.open(EncargadoComponent,{
        size:"xl",
        backdrop: "static",
        windowClass: "viewer-content-general",
      });
      modalInvoice.componentInstance.module_comp = myVarGlobals.fRenPredUrbanoEmision;
      modalInvoice.componentInstance.permissions = this.permissions;

    }

  limpiar() {
    this.datosInfimas={
      nro_oficio:"",
      fecha_publicacion:moment(this.firstday).format('YYYY-MM-DD'),
      nro_sumilla:"",
      cod_sercop:"",
      fecha_recepcion:moment(this.firstday).format('YYYY-MM-DD'),
    }

  }

  onlyNumber(event): boolean {
    // console.log(event);
    let key = event.which ? event.which : event.keyCode;
    if (key > 31 && (key < 48 || key > 57)) {
      return false;
    }
    return true;
  }

  //http://vmi1057060.contaboserver.net:9090/jasperserver/rest_v2/reports/reports/rep_cpinfimas_orden_compra.html?id_solicitud=~NULL~

}
