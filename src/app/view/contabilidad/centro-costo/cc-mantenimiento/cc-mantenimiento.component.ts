import { Component, OnInit, ViewChild,ElementRef } from "@angular/core";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import * as myVarGlobals from "../../../../global";
import { DataTableDirective } from "angular-datatables";
import { CcMantenimientoService } from "./cc-mantenimiento.service";
import { CommonVarService } from "../../../../services/common-var.services";
import { CommonService } from "../../../../services/commonServices";
import 'sweetalert2/src/sweetalert2.scss';  
const Swal = require('sweetalert2');
import * as moment from "moment";
import { environment } from "../../../../../environments/environment";
import { IngresoService } from "../../../inventario/producto/ingreso/ingreso.service";
import { CcSpinerProcesarComponent } from "../../../../config/custom/cc-spiner-procesar.component";
import { ValidacionesFactory } from "../../../../config/custom/utils/ValidacionesFactory";
import { FileUploader } from "ng2-file-upload";
import { VistaArchivoComponent } from "./vista-archivo/vista-archivo.component";
import { ConfirmationDialogService } from "../../../../config/custom/confirmation-dialog/confirmation-dialog.service";
import { CcClientesComponent } from "./cc-clientes/cc-clientes.component";

declare const $: any;

@Component({
  selector: 'app-cc-mantenimiento',
  templateUrl: './cc-mantenimiento.component.html',
  styleUrls: ['./cc-mantenimiento.component.scss']
})
export class CcMantenimientoComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();
  viewDate: Date = new Date();
  fromDatePicker: Date = new Date();
  toDatePicker: Date = new Date();
  toDatePickerVencimiento: Date = new Date();
  toDatePickerCumplimiento: Date = new Date();
  processing: boolean = false;
  processingtwo: boolean = false;
  permisions: any;
  dataUser: any;
  validaDtUser: any = false;
  guardaT: any = [];
  costo: any = {
    presupuesto: null,
    debito: null,
    saldoa: null,
    credito: null,
    montoCumplimiento: null,
  };
  filesSelect: FileList;
  departamentos: Array<any> = [];
  centroCosto: Array<any> = [];
  guardarolT: Array<any> = [];
  anexos: Array<any> = [];
  catalog: any = {};
  actions: any = {
    dComponet: false, //inputs
    btnNuevo: false,
    btnGuardar: false,
    btncancelar: false,
    btneditar: false,
    btneliminar: false,
  };
  disableVencim: any = false;
  disabledMonto: any = false;
  idCentroCosto: any;
  maxId: any;
  generalDocument: any = "";
  data: any;
  showAnexoclick: any = false;
  location: any;
  id_anexos: any;
  identifier: any;
  idCCosto: any;
  nameOriginal: any;
  vmButtons: any = [];
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  validaciones: ValidacionesFactory = new ValidacionesFactory();
  constructor(
    private toastr: ToastrService,
    private router: Router,
    private commonServices: CommonService,
    private centroCostoSrv: CcMantenimientoService,
    private IngresoSrv: IngresoService,
    private confirmationDialogService: ConfirmationDialogService
  ) { }

  ngOnInit(): void {
    //this.elementRef.nativeElement.ownerDocument.body.style = 'background: url(/assets/img/fondo.jpg);background-size: cover !important;no-repeat;';
    
    $("#divListadocont").collapse("show");
    $("#divMantcont").collapse("hide");
    
    this.vmButtons = [
      { orig: "btnCCmant", paramAccion: "1", boton: { icon: "fa fa-plus-square-o", texto: "NUEVO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false},
      { orig: "btnCCmant", paramAccion: "1", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false},
      { orig: "btnCCmant", paramAccion: "1", boton: { icon: "fa fa-eraser", texto: "ELIMINAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-dark boton btn-sm", habilitar: false},
      { orig: "btnCCmant", paramAccion: "1", boton: { icon: "fa fa-times", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false},

      { orig: "btnCCmant", paramAccion: "2", boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false},
      { orig: "btnCCmant", paramAccion: "2", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false},
      { orig: "btnCCmant", paramAccion: "2", boton: { icon: "fa fa-file-pdf-o", texto: "PDF" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false},
    ];

    setTimeout(() => {
      this.vmButtons.forEach((element, index) => {
        if(index != 0){
          if(element.paramAccion != "2"){
            element.permiso = false;
            element.showimg = false;
          }          
        }
      });
    }, 10);
    
    setTimeout(() => {
      this.lcargando.ctlSpinner(true);  
    }, 10);   


    this.permissions();
  }

  tipoAccion:any = null;
  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "NUEVO":
        $("#divListadocont").collapse("hide");
        $("#divMantcont").collapse("show");
        this.tipoAccion = "N";

        this.vmButtons.forEach((element, index) => {
          if(index != 0){
            element.permiso = true;
            element.showimg = true;
            if(element.paramAccion == "2"){
              element.permiso = false;
              element.showimg = false;
            }          
          }
        });

        this.vmButtons[2].permiso = false;
        this.vmButtons[2].showimg = false;

        this.newCCosto();

        break;

      case "GUARDAR":
        if(this.tipoAccion == "M"){
          this.validaModCosto();
        }else{
          this.validaSaveCosto();
        }
        
        break;

      case "ELIMINAR":
        this.delete();
        break;

      case "CANCELAR":
        $("#divListadocont").collapse("show");
        $("#divMantcont").collapse("hide");

        this.vmButtons.forEach((element, index) => {
          if(index != 0){
            element.permiso = true;
            element.showimg = true;
            if(element.paramAccion == "1"){
              element.permiso = false;
              element.showimg = false;
            }          
          }
        });

        this.cleanparameter();
        
        break;

      /**** */
      case "EXCEL":
        $('#tabla1').DataTable().button( '.buttons-excel' ).trigger();
        break;

      case "IMPRIMIR":
        $('#tabla1').DataTable().button( '.buttons-print' ).trigger();
        break;

      case "PDF":
        $('#tabla1').DataTable().button( '.buttons-pdf' ).trigger();
        break;
    }
  }

  /* Api permisos */
  permissions() {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    let data = {
      codigo: myVarGlobals.fCentroCosto,
      id_rol: this.dataUser.id_rol,
    };
    this.commonServices.getPermisionsGlobas(data).subscribe((res) => {
      this.permisions = res["data"];
      if (this.permisions[0].ver == "0") {
        this.toastr.info(
          "Usuario no tiene permiso para ver el Formulario Centro de Costo"
        );
        this.vmButtons = [];
        // this.router.navigateByUrl("dashboard");
        this.lcargando.ctlSpinner(false);
      } else {
        setTimeout(() => {
          this.processing = true;
          this.getGrupos();
          this.getMax();
          this.showAnexos();
        }, 1000);
      }
    }, error=>{
      this.lcargando.ctlSpinner(false);
    });
  }

  getGrupos() {
    this.centroCostoSrv.presentaTablaGrupo().subscribe((res) => {
      this.departamentos = res["data"];
      this.fillCatalog();
    }, error=>{
      this.lcargando.ctlSpinner(false);
    });
  }

  fillCatalog() {
    let data = {
      params: "'PROVINCIA'",
    };
    this.centroCostoSrv.getCatalogs(data).subscribe((res) => {
      this.catalog.province = res["data"]["PROVINCIA"];
      this.showCosto();
    });
  }

  searchCities(event) {
    this.centroCostoSrv
      .filterProvinceCity({ grupo: event })
      .subscribe((res) => {
        this.catalog.city = res["data"];
      });
  }

  showAnexos() {
    let data = {
      fk_modulo: this.permisions[0].id_modulo,
      fk_component: myVarGlobals.fCentroCosto,
    };
    this.mensajeSppiner = "Cargando";
    this.lcargando.ctlSpinner(true);
    this.centroCostoSrv.showAnexos(data).subscribe((res) => {
      this.lcargando.ctlSpinner(false);
      this.anexos = res["data"];
    }, error=>{
      this.lcargando.ctlSpinner(false);
    });
  }

  newCCosto() {
    this.actions.btnGuardar = true;
    this.actions.btncancelar = true;
    this.actions.dComponet = true;
    this.costo = {};
    this.costo.estado = "A";
    this.itemSeleccionado = undefined;
    this.uploader = new FileUploader(null);
  }

  cleanparameter() {
    this.costo = {};
    this.costo.presupuesto = null;
    this.costo.debito = null;
    this.costo.saldoa = null;
    this.costo.credito = null;
    this.costo.montoCumplimiento = null;
    this.fromDatePicker = new Date();
    this.toDatePicker = new Date();
    this.toDatePickerVencimiento = new Date();
    this.actions.dComponet = false;
    this.actions.btnGuardar = false;
    this.actions.btnNuevo = false;
    this.actions.btneditar = false;
    this.actions.btneliminar = false;
    this.uploader = new FileUploader(null);
    this.costo.estado = null;
    this.itemSeleccionado = undefined;
    $("#ficher").val("");
    this.generalDocument = "";
    this.showAnexoclick = false;
    if (this.costo.provincias = undefined) {
      this.costo.ciudad = "";
    }
  }

  async validaSaveCosto() {
    if (this.permisions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      let resp = await this.validateDataGlobal().then((respuesta) => {
        if (respuesta) {
          this.confirmSave("Seguro desea guardar Registro?", "SAVE_COSTO");
        }
      });
    }
  }

  async validaModCosto() {
    if (this.permisions.modificar == "0") {
      this.toastr.info("Usuario no tiene permiso para modificar");
    } else {
      let resp = await this.validateDataGlobal().then((respuesta) => {
        if (respuesta) {
          this.confirmSave("Seguro desea modificar Registro?", "MOD_COSTO");
        }
      });
    }
  }

  validateDataGlobal() {
    let flag = false;
    return new Promise((resolve, reject) => {
      if (this.costo.tipo == undefined) {
        this.toastr.info("Seleccione Tipo de Centro de Costo !!");
        let autFocus = document.getElementById("IdTipo").focus();
      } else if (this.costo.departamento == undefined) {
        this.toastr.info("Seleccione departamento");
        let autFocus = document.getElementById("IdDepartamento").focus();
      } else if (this.costo.provincias == undefined) {
        this.toastr.info("Seleccione Provincia");
        let autFocus = document.getElementById("idProvincia").focus();
      } else if (this.costo.ciudad == undefined) {
        this.toastr.info("Seleccione Ciudad");
        let autFocus = document.getElementById("IdCiudad").focus();
      } else if (this.costo.director == undefined) {
        this.toastr.info("Ingrese Director");
        let autFocus = document.getElementById("idDirector").focus();
      } else if (this.costo.cliente == undefined) {
        this.toastr.info("Ingrese Cliente");
        let autFocus = document.getElementById("IdCliente").focus();
      } else if (this.costo.estado == undefined) {
        this.toastr.info("Seleccione un estado");
        let autFocus = document.getElementById("IdEstado").focus();
      } else if (this.costo.nombre == undefined) {
        this.toastr.info("Ingrese Nombre");
        let autFocus = document.getElementById("Idnombre").focus();
      } else if (this.costo.presupuesto == undefined) {
        this.toastr.info("Ingrese presupuesto diferente de cero");
        let autFocus = document.getElementById("IdPresupuesto").focus();
      } else if (this.costo.descripcion == undefined) {
        this.toastr.info("Ingrese Descripcion");
        let autFocus = document.getElementById("idDescripcion").focus();
      } else if (
        this.costo.alertaMonto == true &&
        this.costo.montoCumplimiento == undefined
      ) {
        this.toastr.info("Ingrese Cantidad Maxima Aviso");
        let autFocus = document.getElementById("idalertaMonto").focus();
      }/* else if (this.costo.debito == 0) {
        this.toastr.info("Ingreso valor diferente a cero");
        let autFocus = document.getElementById("IdDebito").focus();
      } else if (this.costo.saldoa == 0) {
        this.toastr.info("Ingreso valor diferente a cero");
        let autFocus = document.getElementById("IdSaldoA").focus();
      } else if (this.costo.credito == 0) {
        this.toastr.info("Ingreso valor diferente a cero");
        let autFocus = document.getElementById("IdCredito").focus();
      } */else {
        resolve(true);
      }
    });
  }

  getMax() {
    this.centroCostoSrv.getMaxID().subscribe((res) => {
      this.maxId = res["data"][0].idCosto;
    }, error=>{
      this.lcargando.ctlSpinner(false);
    });
  }

  SaveCentroCosto() {
    let data = {
      tipo: this.costo.tipo,
      nombre: this.costo.nombre,
      departamento: this.costo.departamento,
      descripcion: this.costo.descripcion,
      provincia: this.costo.provincias,
      ciudad: this.costo.ciudad == undefined ? null : this.costo.ciudad,
      presupuesto:
        this.costo.presupuesto == undefined ? null : this.costo.presupuesto,
      fecha_inicio: moment(this.fromDatePicker).format("YYYY-MM-DD"),
      fecha_final: moment(this.toDatePicker).format("YYYY-MM-DD"),
      director: this.costo.director,
      cliente: this.costo.cliente,
      estado: this.costo.estado,
      alerta_vencimiento: this.costo.alertaVencim == true ? 1 : 0,
      alerta_presupuesto: this.costo.alertaMonto == true ? 1 : 0,
      fecha_alerta_vencimiento:
        this.costo.alertaVencim == true
          ? moment(this.toDatePickerVencimiento).format("YYYY-MM-DD")
          : null,
      monto_alerta_cumplimiento:
        this.costo.alertaMonto == true ? this.costo.montoCumplimiento : 0,
      debitos_acumulado: this.costo.debito != null ? this.costo.debito : 0,
      creditos_acumulado: this.costo.saldoa != null ? this.costo.saldoa : 0,
      saldo_acumulado: this.costo.credito != null ? this.costo.credito : 0,
      ip: this.commonServices.getIpAddress(),
      accion: `Registro nuevo centro de costo ${this.costo.nombre} `,
      id_controlador: myVarGlobals.fCentroCosto,
      doc_anexos: Number(this.uploader.queue.length)
    };

    this.mensajeSppiner = "Guardando...";
    this.lcargando.ctlSpinner(true);
    this.centroCostoSrv.saveCentroCosto(data).subscribe(res => {
      
      this.saveAnexo(res, "N");

    }, (error) => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  ModCentroCosto() {
    let data = {
      id: this.idCCosto,
      tipo: this.costo.tipo,
      nombre: this.costo.nombre,
      departamento: this.costo.departamento,
      descripcion: this.costo.descripcion,
      provincia: this.costo.provincias,
      ciudad: this.costo.ciudad == undefined ? null : this.costo.ciudad,
      presupuesto:
        this.costo.presupuesto == undefined ? null : this.costo.presupuesto,
      fecha_inicio: moment(this.fromDatePicker).format("YYYY-MM-DD"),
      fecha_final: moment(this.toDatePicker).format("YYYY-MM-DD"),
      director: this.costo.director,
      cliente: this.costo.cliente,
      estado: this.costo.estado,
      doc_anexos: (Number(this.uploader.queue.length) + Number(this.itemSeleccionado.doc_anexos)),
      alerta_vencimiento: this.costo.alertaVencim == true ? 1 : 0,
      alerta_presupuesto: this.costo.alertaMonto == true ? 1 : 0,
      fecha_alerta_vencimiento:
        this.costo.alertaVencim == true
          ? moment(this.toDatePickerVencimiento).format("YYYY-MM-DD")
          : null,
      monto_alerta_cumplimiento:
        this.costo.alertaMonto == true ? this.costo.montoCumplimiento : 0,
      debitos_acumulado: this.costo.debito,
      creditos_acumulado: this.costo.saldoa,
      saldo_acumulado: this.costo.credito,
      ip: this.commonServices.getIpAddress(),
      accion: `Modificación centro de costo ${this.costo.nombre} `,
      id_controlador: myVarGlobals.fCentroCosto,
    };

    this.mensajeSppiner = "Modificando...";
    this.lcargando.ctlSpinner(true);
    this.centroCostoSrv.editCentroCosto(data).subscribe(res => {
      // this.lcargando.ctlSpinner(false);
      // this.updateAnexo();
      // this.toastr.success(res["message"]);
      // this.recargar();

      this.saveAnexo(res, "M");

    }, (error) => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  deleteCentroCosto() {
    let data = {
      id: this.idCCosto,
      ip: this.commonServices.getIpAddress(),
      accion: `Eliminación del centro del costo  ${this.costo.nombre} `,
      id_controlador: myVarGlobals.fCentroCosto,
    };
    this.mensajeSppiner = "Eliminando...";
    this.lcargando.ctlSpinner(true);
    this.centroCostoSrv.deleteCcosto(data).subscribe((res) => {
      this.lcargando.ctlSpinner(false);
      this.toastr.success(res["message"]);
      this.recargar();
    }, (error) => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  delete() {
    if (this.permisions[0].eliminar == "0") {
      this.toastr.info("Usuario no tiene permiso para eliminar");
    } else {
      this.confirmSave("Seguro desea eliminar el registro?", "DELETE_COSTO");
    }
  }

  timer: any;
  valida:boolean = false;
  saveAnexo(res:any, tipo) {
    let ingresoId = this.maxId + 1;    
    if(this.uploader.queue.length > 0){

      let params = {};
      if(tipo == "N"){
        params = {
          description: "Ingreso de Anexo de Centro de Costo",
          module: this.permisions[0].id_modulo,
          component: myVarGlobals.fCentroCosto,
          identifier: ingresoId ,
          ip: this.commonServices.getIpAddress(),
          accion: `Registro nuevo documento del centro de costo ${this.costo.nombre} `,
          id_controlador: myVarGlobals.fCentroCosto,
        };
      }else{
        params = {
          id_anexo: this.id_anexos == undefined ? "" : this.id_anexos,
          description: "Modificación de Anexo de Centro de Costo",
          ip: this.commonServices.getIpAddress(),
          accion: `Actualización del documento del centro de costo`,
          id_controlador: myVarGlobals.fCentroCosto,
          module: this.permisions[0].id_modulo,
          component: myVarGlobals.fCentroCosto,
          identifier: this.identifier,
        };
      }
  
      this.valida = false;
      this.timer = setInterval(() => {
        if (this.valida) {
          clearInterval(this.timer);
          this.toastr.success(res["message"]);
          setTimeout(() => {
            this.lcargando.ctlSpinner(false);                       
            this.recargar();
          }, 3000);          
        }
      }, 200);

      let contador:any = 0;
      for (let j = 0; j < this.uploader.queue.length; j++) {
        let fileItem = this.uploader.queue[j]._file; 
        this.IngresoSrv.fileService(fileItem, params).subscribe((res) => {
  
          contador++;
          if(contador == this.uploader.queue.length){
            this.valida = true;
          }
        },(error) => {
        });  
      }

      

    }else{
      this.lcargando.ctlSpinner(false);
      this.toastr.success(res["message"]);
      this.recargar();
    }
    
  }

  updateAnexo() {
    var payload = {
      id_anexo: this.id_anexos == undefined ? "" : this.id_anexos,
      description: "Modificación de Anexo de Centro de Costo",
      ip: this.commonServices.getIpAddress(),
      accion: `Actualización del documento del centro de costo`,
      id_controlador: myVarGlobals.fCentroCosto,
      module: this.permisions[0].id_modulo,
      component: myVarGlobals.fCentroCosto,
      identifier: this.identifier,
    };
    this.IngresoSrv.patchFile(this.filesSelect, payload).subscribe(
      /* (res) => {
        if (res["status"] == 200) {
          this.toastr.success(res["message"]);
          setTimeout(() => {
            location.reload();
          }, 1000); 
        }
      }, */
    );
  }

  //SAVE, EDIT, DELETE.
  async confirmSave(message, action) {
    Swal.fire({
      title: "Atención!!",
      text: message,
      type: "warning",
      showCancelButton: true,
      cancelButtonColor: "#DC3545",
      confirmButtonColor: "#13A1EA",
      confirmButtonText: "Aceptar",
    }).then((result) => {
      if (result.value) {
        if (action == "SAVE_COSTO") {
          this.SaveCentroCosto();
        } else if (action == "MOD_COSTO") {
          this.ModCentroCosto();
        } else if (action == "DELETE_COSTO") {
          this.deleteCentroCosto();
        }
      }
    });
  }

  checkVencimiento() {
    if (this.costo.alertaVencim == true) {
      this.disableVencim = true;
    } else if (this.costo.alertaVencim == false) {
      this.disableVencim = false;
      this.toDatePickerVencimiento = new Date();
    }
  }

  checkCumplimiento() {
    if (this.costo.alertaMonto == true) {
      this.disabledMonto = true;
    } else if (this.costo.alertaMonto == false) {
      this.disabledMonto = false;
      this.costo.montoCumplimiento = null;
    }
  }

  subiendoando(files) {
    this.filesSelect = undefined;
    if (files.length > 0) {
      this.filesSelect = files[0];
      setTimeout(() => {
        this.toastr.success("Ha seleccionado " + files.length + " archivos");
      }, 10);
    }
  }
  
  showCosto() {
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      search: true,
      paging: true,
      scrollY: "200px",
      scrollCollapse: true,
      dom: "frtip",
      buttons: [
        {
          extend: "excel",
          footer: true,
          title: "Reporte Kardex Inicial",
          filename: "reportes",
          text: '<button class="btn btn-success" style="width: 150px; height: 43px; font-weight: bold; color:white; box-shadow: 2px 2px 0.5px #666; font-size: 13px;">EXCEL <i class="fa fa-file-excel-o" aria-hidden="true" style="font-size: 19px;margin-right: 10px; margin-top: 4px; margin:6px;"> </i></button>',
        },
        {
          extend: "print",
          footer: true,
          title: "Reporte Kardex Inicial",
          filename: "report print",
          text: '<button class="btn" style="width: 150px; height: 43px; font-weight: bold; background-color:#005CCD ; color:white; box-shadow: 2px 2px 0.5px #666;">IMPRIMIR<i class="fa fa-print" aria-hidden="true" style="font-size: 19px; margin-right: 10px; margin-top: 4px; margin:6px;" ></i></button>',
        },
        {
          extend: "pdf",
          footer: true,
          title: "Reporte Kardex Inicial",
          filename: "KardexPdf",
          text: '<button class="btn btn-danger " style="width: 150px; height: 43px; font-weight: bold; color:white; box-shadow: 2px 2px 0.5px #666; font-size: 13px;">PDF <i class="fa fa-file-pdf-o" aria-hidden="true" style="font-size: 19px; margin-right: 10px; margin-top: 4px; margin:6px;"></i></button>',
        },
      ],
      /*  order: [[ 1, 'desc' ]], */
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json",
      },
    };

    let datosPost:any = {
      id_modulo: this.permisions[0].id_modulo,
      fk_component: myVarGlobals.fCentroCosto
    };
    this.centroCostoSrv.showCentroCosto(datosPost).subscribe(
      (res) => {
        this.validaDtUser = true;
        this.processing = true;
        this.guardarolT = res["data"];
        setTimeout(() => {
          this.dtTrigger.next();
        }, 50);
      },
      (error) => {
        this.processing = true;
        setTimeout(() => {
          this.dtTrigger.next();
        }, 50);
      }
    );
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  itemSeleccionado:any = undefined;
  updateCcosto(dt) {
    this.itemSeleccionado = undefined;
    $("#divListadocont").collapse("hide");
    $("#divMantcont").collapse("show");

    this.vmButtons.forEach((element, index) => {
      if(index != 0){
        element.permiso = true;
        element.showimg = true;
        if(element.paramAccion == "2"){
          element.permiso = false;
          element.showimg = false;
        }          
      }
    });
    this.tipoAccion = "M";
    this.itemSeleccionado = dt;
    this.vmButtons[2].permiso = true;
    this.vmButtons[2].showimg = true;
    this.vmButtons[1].permiso = true;
    this.vmButtons[1].showimg = true;
    if(Number(this.itemSeleccionado.creditos_acumulado) != 0 ||
    Number(this.itemSeleccionado.debitos_acumulado) != 0 ||
    Number(this.itemSeleccionado.saldo_acumulado) != 0 || this.itemSeleccionado.estado == "I"){
      this.vmButtons[2].permiso = false;
      this.vmButtons[2].showimg = false;
    }

    if(this.itemSeleccionado.estado == "I"){
      this.vmButtons[1].permiso = false;
      this.vmButtons[1].showimg = false;
    }


    this.idCCosto = dt.id;
    this.costo.tipo = dt.tipo;
    this.costo.departamento = dt.departamento;
    this.costo.provincias = dt.provincia;
    this.costo.ciudad = dt.ciudad;
    this.costo.director = dt.director;
    this.costo.cliente = dt.cliente.id_cliente;
    this.costo.nombre_comercial_cli = dt.cliente.nombre_comercial_cli;
    this.costo.debito = this.validaciones.roundNumber(parseFloat(dt.debitos_acumulado),2);
    this.costo.saldoa = this.validaciones.roundNumber(parseFloat(dt.saldo_acumulado),2);
    this.costo.credito = this.validaciones.roundNumber(parseFloat(dt.creditos_acumulado),2);
    this.costo.nombre = dt.nombre;
    this.costo.presupuesto = this.validaciones.roundNumber(parseFloat(dt.presupuesto),2);
    this.costo.alertaVencim = dt.alerta_vencimiento == 1 ? true : false;
    this.costo.alertaMonto = dt.alerta_presupuesto == 1 ? true : false;
    /*   dt.alerta_vencimiento == 1 ? ((<HTMLInputElement>document.getElementById("idFechaVencimiento")).disabled = false): ((<HTMLInputElement>document.getElementById("idFechaVencimiento")).disabled = true);
     */
    dt.alerta_vencimiento == 1 ? this.disableVencim = true : this.disableVencim = false;
    dt.alerta_presupuesto == 1 ? this.disabledMonto = true : this.disabledMonto = false;
    dt.fecha_alerta_vencimiento == null ? this.toDatePickerVencimiento = new Date() : this.toDatePickerVencimiento = dt.fecha_alerta_vencimiento;
    this.costo.estado = dt.estado;
    this.costo.descripcion = dt.descripcion;
    this.fromDatePicker = dt.fecha_inicio;
    this.toDatePicker = dt.fecha_final;

    this.costo.montoCumplimiento = this.validaciones.roundNumber(parseFloat(dt.monto_alerta_cumplimiento),2);
    this.actions.dComponet = true;
    this.actions.btnNuevo = true;
    this.actions.btneditar = true;
    this.actions.btncancelar = true;
    this.actions.btneliminar = true;
    this.showAnexoclick = true;

    let filt = this.anexos.filter((e) => e.identifier == dt.id && e.fk_modulo == this.permisions[0].id_modulo && e.fk_component == myVarGlobals.fCentroCosto);
    this.identifier = dt.id;
    if (filt.length > 0) {
      this.identifier = dt.id;
      this.location = filt[0].location;
      this.id_anexos = filt[0].id_anexos;
      this.generalDocument = `${environment.baseUrl}/storage${this.location}`;
    } else {
      this.generalDocument = "assets/img/vista.png";
    }
    this.centroCostoSrv.filterProvinceCity({ grupo: dt.provincia }).subscribe((res) => {
        this.catalog.city = res["data"];
    });
  }

  recargar(){
    $("#divListadocont").collapse("show");
    $("#divMantcont").collapse("hide");

    this.vmButtons.forEach((element, index) => {
      if(index != 0){
        element.permiso = true;
        element.showimg = true;
        if(element.paramAccion == "1"){
          element.permiso = false;
          element.showimg = false;
        }          
      }
    });

    this.cleanparameter();
    this.rerender()

    
  }

  rerender(): void {
    this.guardarolT = [];
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.showCosto();
    });
  }




  /**ARCHIVOS */
  public uploader:FileUploader = new FileUploader(null);
  public hasBaseDropZoneOver:boolean = false;
  public hasAnotherDropZoneOver:boolean = false;
  lArchivo:any;
  fileItem:any;
  isSucc:boolean=false;
  changeSelec(){ 
    if(this.uploader.queue.length > 0){
      
      for (let j = 0; j < this.uploader.queue.length; j++) {
        
        this.fileItem = this.uploader.queue[j]._file; 
        if (this.fileItem.type === "image/jpeg" || this.fileItem.type === "image/jpg" || this.fileItem.type === "image/bmp" || this.fileItem.type === "image/png" 
        || this.fileItem.type === "image/gif" || this.fileItem.type === "image/tif" ||
        this.fileItem.type === "application/pdf"
          || this.fileItem.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
         ||this.fileItem.type ==='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
         ||this.fileItem.type ==='application/vnd.openxmlformats-officedocument.presentationml.presentation'
         //|| this.fileItem.type === "text/plain" 
         || this.fileItem.type==="application/msword"
        ) {
                  

          this.isSucc=true;
        }else{
          this.uploader.queue[j].isError=true;
          this.uploader.queue.splice(j,1);
        }
      }
    }
    this.lArchivo=null;
  }

  public fileOverBase(e:any):void {
    if(this.uploader.queue.length > 0){
      this.hasBaseDropZoneOver = e;
      this.changeSelec();
    }      
  }
 
  public fileOverAnother(e:any):void {
    this.hasAnotherDropZoneOver = e;
  }

  remover(){
    
    if(this.uploader.queue.length === 0){
      this.isSucc=false;
    }else{
      for (let j = 0; j < this.uploader.queue.length; j++) {
        if(this.uploader.queue[j].isSuccess === true){
          this.isSucc=false;
        }
      }
    }
  } 


  abrirVistaArchivo(valor:any){
    const blob = new Blob([valor.file.rawFile], { type: valor.file.type });
    const dialogRef = this.confirmationDialogService.openDialogMat(VistaArchivoComponent, {
      width: '1000px', height: 'auto',
      data: { titulo: "Vista de Archivo", dataUser: this.dataUser, objectUrl: URL.createObjectURL(blob), tipoArchivo: valor.file.type}
      
    } );
 
    dialogRef.afterClosed().subscribe(resultado => {
      if(resultado!=false && resultado!=undefined){

      }
    }); 
  }

  archivoExistente(valores:any){
    this.mensajeSppiner = "Cargando...";
    this.lcargando.ctlSpinner(true);
    let datos: any = {
      storage: valores.storage,
      name: valores.name,
    };
    this.centroCostoSrv.descargar(datos).subscribe((resultado) => {
        this.lcargando.ctlSpinner(false);
        const dialogRef = this.confirmationDialogService.openDialogMat(VistaArchivoComponent, {
          width: '1000px', height: 'auto',
          data: { titulo: "Vista de Archivo", dataUser: this.dataUser, objectUrl: URL.createObjectURL(resultado), tipoArchivo: valores.original_type}          
        } );
     
        dialogRef.afterClosed().subscribe(resultado => {
          if(resultado!=false && resultado!=undefined){
    
          }
        }); 
      }, (error) => {
        this.lcargando.ctlSpinner(false);
      }
    );
  }

  mapearEstados(valor:any){
    if (valor=="A"){
      valor = "ACTIVO";
    }
    if (valor=="I"){
      valor = "ELIMINADO";
    }
    return valor;
  } 

  eliminarArchivoExistente(valor:any){
    Swal.fire({
      title: "Atención!!",
      text: "¿Esta seguro de realizar esta accion?",
      type: "warning",
      showCancelButton: true,
      cancelButtonColor: "#DC3545",
      confirmButtonColor: "#13A1EA",
      confirmButtonText: "Aceptar",
    }).then((result) => {
      if (result.value) {
        this.mensajeSppiner = "Cargando...";
        this.lcargando.ctlSpinner(true);
        valor.ip = this.commonServices.getIpAddress();
        valor.accion = `Eliminacion del archivo adjunto ${valor.original_name}, del documento con id ${valor.identifier} del centro de costo`;
        valor.id_controlador = myVarGlobals.fCentroCosto;
        this.centroCostoSrv.eliminarArchivo(valor).subscribe(datos=>{
          this.lcargando.ctlSpinner(false);
          this.toastr.success("El archivo se elimino correctamente");
          this.recargar();
        }, error=>{
          this.lcargando.ctlSpinner(false);
          this.toastr.info("Error inesperado, no hubo conexion con el servidor")
        });
      }
    }); 
  }

  abrirModalClientes(){
    const dialogRef = this.confirmationDialogService.openDialogMat(CcClientesComponent, {
      width: '1000px', height: 'auto',
      data: { titulo: "Seleccionar Clientes", dataUser: this.dataUser }
      
    } );
 
    dialogRef.afterClosed().subscribe(resultado => {
      if(resultado!=false && resultado!=undefined){
        this.costo.cliente = resultado.id_cliente;
        this.costo.nombre_comercial_cli = resultado.nombre_comercial_cli;
      }
    }); 
  }

}
