import { Component, OnInit, ViewChild } from '@angular/core';
import * as myVarGlobals from '../../../../global';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { CommonService } from '../../../../services/commonServices';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BodegaIngresoServices } from './bodega-ingreso.services'
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { ModalMovimientoComponent } from './modal-movimiento/modal-movimiento.component';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { ConfirmationDialogService } from '../../../../config/custom/confirmation-dialog/confirmation-dialog.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare const $: any;

@Component({
standalone: false,
  selector: 'app-bodega-ingreso',
  templateUrl: './bodega-ingreso.component.html',
  styleUrls: ['./bodega-ingreso.component.scss']
})
export class BodegaIngresoComponent implements OnInit {
  mensajeSppiner: string = "Cargando...";
	@ViewChild(CcSpinerProcesarComponent, {
		static: false
	}) lcargando: CcSpinerProcesarComponent;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  //dtOptions: DataTables.Settings = {};
  dtOptions: any = {};
  dtTrigger = new Subject();
  processing: any = false;
  dataUser: any;
  permisions: any;
  dataEmpresa: any;
  empresaSeleccionado: any;
  sucursalSeleccionado: any;
  userSeleccionado: any;
  ciudadSeleccionado: any;
  estadoBodega: any;
  dataSucursal: any;
  disbledSucursal: any = false;
  disbledUser: any = false;
  dataUsers: any;
  nombreBodega: any;
  telefono: any;
  direccionBodega: any;
  dataCatalogo: any;
  disabledBodega: any = false;
  dguardarbodega: any = false;
  dmodificarBodega: any = false;
  dcancelBodega: any = false;
  dborrarBodega: any = false;
  dataUpdate: any;
  enCero: any = false;
  disabledEstructura: any = false;
  dataBodega: any;
  dataStruct: any;
  dborraStruct: any = false;
  dcancelaStruct: any = false;
  dmodificaStruct: any = false;
  dguardaStruct: any = false;
  bodegaSelect: any;
  tipoAlmaSelect: any;
  filaEstruc: any;
  columnaEstruc: any;
  codigoEstruc: any;
  valida_code: any = false;
  collapse: any = false;
  validaDtStock: any = false;
  dataStockBodega: any;
  nameProduct: any = "";
  udmProduct: any = "";
  numParteProduct: any = "";
  stokProduct: any = "";
  sucursalProduct: any = "";
  CiudadProduct: any = "";
  addressProduct: any = "";
  telfProduct: any = "";
  bodeganameProduct: any  = "";
  FilaProduct: any = "";
  columProduct: any  = "";
  codigoProduct: any = "";
  flag:any = false;


  constructor(
    private commonServices: CommonService,
    private toastr: ToastrService,
    private router: Router,
    private bodegaService: BodegaIngresoServices,
    private modalService: NgbModal,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    this.commonServices.setDataBodega.asObservable().subscribe(res => {
      this.dataUpdate = res;//id_bodega_cab
      this.disabledBodega = true;
      this.vmButtons[0].habilitar = true;
      this.vmButtons[1].habilitar = true;
      this.vmButtons[2].habilitar = false;
      this.vmButtons[3].habilitar = false;

      this.nombreBodega = this.dataUpdate.nombre;
      this.direccionBodega = this.dataUpdate.direccion;
      this.telefono = this.dataUpdate.telefono;
      this.empresaSeleccionado = this.dataUpdate.fk_empresa;
      this.getSucursal();
      this.sucursalSeleccionado = this.dataUpdate.fk_sucursal;
      this.obtenerUsuario();
      this.userSeleccionado = this.dataUpdate.encargado;
      this.ciudadSeleccionado = this.dataUpdate.ciudad;
      this.estadoBodega = this.dataUpdate.estado;
      this.enCero = (this.dataUpdate.stock_menor_cero == 1) ? true : false;
    })

    this.commonServices.setDataStruc.asObservable().subscribe(res => {
      this.dataStruct = res;
      this.disabledEstructura = true;

      this.vmButtons[4].habilitar = true;
      this.vmButtons[5].habilitar = true;
      this.vmButtons[6].habilitar = false;
      this.vmButtons[7].habilitar = false;
      this.bodegaSelect = this.dataStruct.fk_bodega_cab;
      this.tipoAlmaSelect = this.dataStruct.tipo_almacenamiento;
      this.filaEstruc = this.dataStruct.fila;
      this.columnaEstruc = this.dataStruct.columna;
      this.codigoEstruc = this.dataStruct.codigo;
    })
  }

  vmButtons: any = [];
  idBotones:any = "";
  dinamicoBotones(valor:any){
    setTimeout(() => {
      this.vmButtons.forEach(element => {
        if(element.paramAccion == valor){
          element.permiso = true; element.showimg = true;
        }else{
          element.permiso = false; element.showimg = false;
        }
      });
    }, 10);
    
  }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsBodega", paramAccion: "1", boton: { icon: "fa fa-plus-square-o", texto: "NUEVO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsBodega", paramAccion: "1", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: true, imprimir: false},
      { orig: "btnsBodega", paramAccion: "1", boton: { icon: "fa fa-pencil-square-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: true, imprimir: false},
      { orig: "btnsBodega", paramAccion: "1", boton: { icon: "fa fa-eraser", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: true, imprimir: false},

      { orig: "btnsBodega", paramAccion: "2", boton: { icon: "fa fa-plus-square-o", texto: "NUEVO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsBodega", paramAccion: "2", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success btn-sm", habilitar: true, imprimir: false},
      { orig: "btnsBodega", paramAccion: "2", boton: { icon: "fa fa-pencil-square-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: true, imprimir: false},
      { orig: "btnsBodega", paramAccion: "2", boton: { icon: "fa fa-eraser", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: true, imprimir: false},

      { orig: "btnsBodega", paramAccion: "3", boton: { icon: "fa fa-share-square", texto: "MOVER PRODUCTO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: false, imprimir: false},
      { orig: "btnsBodega", paramAccion: "3", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false, imprimir: false },
			{ orig: "btnsBodega", paramAccion: "3", boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false, imprimir: false },
			{ orig: "btnsBodega", paramAccion: "3", boton: { icon: "fa fa-file-pdf-o", texto: "PDF" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false, imprimir: false },

    ];

    setTimeout(() => {
      this.vmButtons.forEach(element => {
        if(element.paramAccion == 1){
          element.permiso = true; element.showimg = true;          
        }else{
          element.permiso = false; element.showimg = false;
        }
      });
    }, 10);
    this.getCiudades();

    setTimeout(() => {
        this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    let id_rol = this.dataUser.id_rol;
    let data = {
      id: 2,
      codigo: myVarGlobals.fBodegaMovimiento,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'];
      if (this.permisions[0].ver == "0") {
        this.lcargando.ctlSpinner(false);
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de Bodega");
      } else {      
        setTimeout(() => {
          this.getStockXCeller();
          this.getEmpresa();
        }, 100);
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }, 10);
  }

  metodoGlobal(evento: any) {
    switch (evento.items.paramAccion+evento.items.boton.texto) {
      case "1NUEVO": 
        this.newBodega();
      break;
      case "1GUARDAR":
        this.validaSaveBodega(); 
      break;
      case "1MODIFICAR": 
      this.validaUpdateBodega();
      break;
      case "1CANCELAR": 
      this.deleteCeller2();
      break;


      case "2NUEVO": 
      this.newStruct();
      break;
      case "2GUARDAR":
        this.validaSaveStruc();
      break;
      case "2MODIFICAR":
        this.validaUpdateStruc();
      break;
      case "2CANCELAR":
        this.deleteStruc2();
      break;


      case "3MOVER PRODUCTO":
     this.sendProductOtherCeller();
      break;
      case "3EXCEL":
				$('#FicheroMover').DataTable().button('.buttons-excel').trigger();
				break;
			case "3PDF":
				$('#FicheroMover').DataTable().button('.buttons-pdf').trigger();
				break;
			case "3IMPRIMIR":
				$('#FicheroMover').DataTable().button('.buttons-print').trigger();
				break;
      
    }
  }

  sendProductOtherCeller() {
    const dialogRef = this.confirmationDialogService.openDialogMat(ModalMovimientoComponent, {width: '1000px',
    height: 'auto', });
    dialogRef.componentInstance.stock = this.dataStockBodega;
    dialogRef.componentInstance.permisions = this.permisions;
    dialogRef.componentInstance.varGlobal = myVarGlobals.fBodegaMovimiento;
  }

  showInfoStock(d) {
    this.nameProduct = d.nombre_producto;
    this.udmProduct = d.UDM;
    this.numParteProduct = d.num_parte;
    this.stokProduct = d.cantidad;
    this.sucursalProduct = d.nombre_sucursal;
    this.CiudadProduct = d.ciudad_bodega;
    this.addressProduct = d.direccion_bodega;
    this.telfProduct = d.telefono;
    this.bodeganameProduct = d.nombre_bodega;
    this.FilaProduct = d.fila;
    this.columProduct = d.columna;
    this.codigoProduct = d.codigo;
  }

  getStockXCeller() {
    if (this.permisions[0].consultar == "0") {
      this.toastr.info("usuario no tiene permiso para consultar");
    } else {
      this.bodegaService.getStockCeller().subscribe(res => {
        this.flag = true;
        this.dtOptions = {
          pagingType: "full_numbers",
          pageLength: 10,
          search: true,
          paging: true,
          buttons: [
            {
              extend: "excel",
              footer: true,
              title: "LISTA DE STOCK POR PRODUCTO",
              filename: "sotk_x_bodega",
            },
            {
              extend: "print",
              footer: true,
              title: "LISTA DE STOCK POR PRODUCTO",
              filename: "sotk_x_bodega",
            },
            {
              extend: "pdf",
              footer: true,
              title: "LISTA DE STOCK POR PRODUCTO",
              filename: "sotk_x_bodega",
              orientation: 'landscape',
            },
          ],
          language: {
            url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json",
          },
        };
        this.bodegaService.getStockCeller()
          .subscribe(res => {
            this.lcargando.ctlSpinner(false);
            this.processing = true;
            this.validaDtStock = true;
            //console.log(res['data']);
            this.dataStockBodega = res['data'];
            setTimeout(() => {
              this.dtTrigger.next();
              //this.ngOnDestroy();
            }, 50);
          }, error => {
            this.lcargando.ctlSpinner(false);
            this.processing = true;
            this.toastr.info(error.error.message);
          });
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.processing = true;
      })
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  validateCode() {
    let data = {
      codigo: this.codigoEstruc
    }
    this.bodegaService.validaCodeStruture(data).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      if (res['data'].length > 0) {
        this.valida_code = true;
      } else {
        this.valida_code = false;
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getEmpresa() {
    this.bodegaService.getEmpresa().subscribe(res => {
 /*      this.lcargando.ctlSpinner(false); */
      this.dataEmpresa = res['data'];
      this.getBodegas();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getBodegas() {
    this.bodegaService.getInformationCellarGeneral().subscribe(res => {
     /*  this.lcargando.ctlSpinner(false); */
      this.dataBodega = res['data'];
      /* this.getStockXCeller(); */
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.processing = true;
    })
  }

  obtenerSucursal(e) {
    if (this.permisions[0].consultar == "0") {
      this.toastr.info("usuario no tiene permiso para consultar");
    } else {
      this.empresaSeleccionado = e;
      this.dataSucursal = undefined;
      setTimeout(() => {
        this.getSucursal(); 
      }, 30);
    }
  }

  getSucursal() {
    if (this.permisions[0].consultar == "0") {
      this.toastr.info("usuario no tiene permiso para consultar");
    } else {
      this.dataUsers = undefined;
      let data = {
        id_empresa: this.empresaSeleccionado
      }
      this.bodegaService.getSucursales(data).subscribe(res => {
/*       this.lcargando.ctlSpinner(false); */

        this.dataSucursal = res['data'];
        this.disbledSucursal = true;
      }, error => {
      this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      })
    }
  }

  obtenerUsuario() {
    if (this.permisions[0].consultar == "0") {
      this.toastr.info("usuario no tiene permiso para consultar");
    } else {
      this.dataUsers = undefined;
      let data = {
        id_empresa: this.empresaSeleccionado,
        id_sucursal: this.sucursalSeleccionado
      }
      this.bodegaService.getUser(data).subscribe(res => {
  /*     this.lcargando.ctlSpinner(false); */
        this.dataUsers = res['data'];
        this.disbledUser = true;
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      })
    }
  }

  getCiudades() {
      let data = {
        tipo: "'CIUDAD','TIPO ALMACENAMIENTO'"
      }
      this.bodegaService.getCiudades(data).subscribe(res => {
        this.dataCatalogo = res['data']['catalogos'];
      }, error => {
        this.toastr.info(error.error.message);
      })
  }

  inputNumVal(event): boolean {
    let key = (event.which) ? event.which : event.keyCode;
    if (key > 31 && (key < 45 || key > 57)) {
      return false;
    }
    return true;
  }

  newBodega() {
    this.disabledBodega = true;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = true;
    this.vmButtons[3].habilitar = false;
    this.deleteCeller();
  }

  newStruct() {
    this.disabledEstructura = true;
    this.vmButtons[5].habilitar = false;
    this.vmButtons[6].habilitar = true;
    this.vmButtons[7].habilitar = false;
    this.deleteStruc();
  }

  deleteCeller() {
    this.nombreBodega = "";
    this.direccionBodega = "";
    this.telefono = "";
    this.empresaSeleccionado = "";
    this.sucursalSeleccionado = "";
    this.userSeleccionado = "";
    this.ciudadSeleccionado = "";
    this.estadoBodega = "";
    this.enCero = false;
  }

  deleteStruc() {
    this.bodegaSelect = "";
    this.tipoAlmaSelect = "";
    this.filaEstruc = "";
    this.columnaEstruc = "";
    this.codigoEstruc = "";
  }

  deleteStruc2() {
    this.bodegaSelect = "";
    this.tipoAlmaSelect = "";
    this.filaEstruc = "";
    this.columnaEstruc = "";
    this.codigoEstruc = "";
    this.disabledEstructura = false;
    this.vmButtons[4].habilitar = false;
    this.vmButtons[5].habilitar = true;
    this.vmButtons[6].habilitar = true;
    this.vmButtons[7].habilitar = true;
  }

  async validaUpdateBodega() {
    if (this.permisions[0].editar == "0") {
      this.toastr.info("usuario no tiene permiso para editar");
    } else {
      let resp = await this.validaGlobal().then(respuesta => {
        if (respuesta) {
          this.confirmAction("Seguro desea actualizar el registro?", "UPDATE_BODEGA");
        }
      })
    }
  }

  async validaSaveBodega() {
    if (this.permisions[0].guardar == "0") {
      this.toastr.info("usuario no tiene permiso para guardar");
    } else {
      let resp = await this.validaGlobal().then(respuesta => {
        if (respuesta) {
          this.confirmAction("Seguro desea guardar el registro?", "ADD_BODEGA");
        }
      })
    }
  }

  async validaUpdateStruc() {
    if (this.permisions[0].editar == "0") {
      this.toastr.info("usuario no tiene permiso para editar");
    } else {
      let resp = await this.validaGlobalStruc().then(respuesta => {
        if (respuesta) {
          this.confirmAction("Seguro desea actualizar el registro?", "UPDATE_STRUCT");
        }
      })
    }
  }

  async validaSaveStruc() {
    this.validateCode();
    if (this.permisions[0].guardar == "0") {
      this.toastr.info("usuario no tiene permiso para guardar");
    } else {
      let resp = await this.validaGlobalStruc().then(respuesta => {
        setTimeout(() => {
          if (!this.valida_code) {
            if (respuesta) {
              this.confirmAction("Seguro desea guardar el registro?", "ADD_STRUC");
            }
          } else {
            this.toastr.info("Código ya se existe");
          }
        }, 1000);
      })
    }
  }

  validaGlobal() {
    return new Promise((resolve, reject) => {
      if (this.nombreBodega == undefined || this.nombreBodega == "") {
        this.toastr.info("Ingrese un nombre");
        document.getElementById('Idnombre').focus();
      } else if (this.direccionBodega == undefined || this.direccionBodega == "") {
        this.toastr.info("Ingrese una dirección");
        document.getElementById('IdAddress').focus();
      } else if (this.telefono == undefined || this.telefono == "") {
        this.toastr.info("Ingrese un teléfono");
        document.getElementById('IdTelefono').focus();
      } else if (this.empresaSeleccionado == undefined || this.empresaSeleccionado == "") {
        this.toastr.info("Seleccione una empresa");
      } else if (this.sucursalSeleccionado == undefined || this.sucursalSeleccionado == "") {
        this.toastr.info("Seleccione una sucursal");
      } else if (this.userSeleccionado == undefined || this.userSeleccionado == "") {
        this.toastr.info("Seleccione un encargado");
      } else if (this.ciudadSeleccionado == undefined || this.ciudadSeleccionado == "") {
        this.toastr.info("Seleccione una ciudad");
      } else if (this.estadoBodega == undefined) {
        this.toastr.info("Seleccione un estado");
      } else {
        resolve(true);
      }
    });
  }

  validaGlobalStruc() {
    return new Promise((resolve, reject) => {
      if (this.bodegaSelect == undefined || this.bodegaSelect == "") {
        this.toastr.info("Seleccione una bodega");
      } else if (this.tipoAlmaSelect == undefined || this.tipoAlmaSelect == "") {
        this.toastr.info("Seleccione un tipo de almacenamiento");
      } else if (this.filaEstruc == "" || this.filaEstruc == undefined) {
        this.toastr.info("Ingrese una fila");
        document.getElementById('IdFilaEs').focus();
      } else if (this.columnaEstruc == "" || this.columnaEstruc == undefined) {
        this.toastr.info("Ingrese una columna");
        document.getElementById('IdColumnaEs').focus();
      } else if (this.codigoEstruc == "" || this.codigoEstruc == undefined) {
        this.toastr.info("Ingrese un codigo");
        document.getElementById('IdCodigoEs').focus();
      } else {
        resolve(true);
      }
    });
  }

  async confirmAction(message, action) {
    Swal.fire({
      title: "Atención!!",
      text: message,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#DC3545',
      confirmButtonColor: '#13A1EA',
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.value) {
        if (action == "ADD_BODEGA") {
          this.saveBodega();
        } else if (action == "UPDATE_BODEGA") {
          this.updateBodega();
        } else if (action == "ADD_STRUC") {
          this.saveStruct();
        } else if (action == "UPDATE_STRUCT") {
          this.updateStruct();
        }
      }
    })
  }

  updateStruct() {
    let data = {
      bodega: this.bodegaSelect,
      tipo: this.tipoAlmaSelect,
      fila: this.filaEstruc,
      columna: this.columnaEstruc,
      codigo: this.codigoEstruc,
      id_struct: this.dataStruct.id_bodega_det,
      ip: this.commonServices.getIpAddress(),
      accion: `Actualización de la bodega con código ${this.codigoEstruc}`,
      id_controlador: myVarGlobals.fBodegaMovimiento
    }
    this.bodegaService.updateEstruture(data).subscribe(res => {
      this.commonServices.refreshDataTableStruct.next();
      this.deleteStruc();
      this.toastr.success(res['message']);
      this.dmodificaStruct = false;
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  saveStruct() {
    let data = {
      bodega: this.bodegaSelect,
      tipo: this.tipoAlmaSelect,
      fila: this.filaEstruc,
      columna: this.columnaEstruc,
      codigo: this.codigoEstruc,
      ip: this.commonServices.getIpAddress(),
      accion: `Ingreso de nueva estructura de bodega con código ${this.codigoEstruc}`,
      id_controlador: myVarGlobals.fBodegaMovimiento
    }
    this.bodegaService.saveEstruture(data).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.commonServices.refreshDataTableStruct.next();
      this.deleteStruc();
      this.toastr.success(res['message']);
      this.dguardaStruct = false;
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  updateBodega() {
    this.lcargando.ctlSpinner(true);
    let data = {
      nombre: this.nombreBodega,
      direccion: this.direccionBodega,
      telefono: this.telefono,
      empresa: this.empresaSeleccionado,
      sucursal: this.sucursalSeleccionado,
      encargado: this.userSeleccionado,
      ciudad: this.ciudadSeleccionado,
      estado: this.estadoBodega,
      id_bodega: this.dataUpdate.id_bodega_cab,
      stockMenorCero: (this.enCero) ? 1 : 0,
      ip: this.commonServices.getIpAddress(),
      accion: `Actualización de datos de la bodega ${this.nombreBodega}`,
      id_controlador: myVarGlobals.fBodegaMovimiento
    }
    this.bodegaService.updateBodega(data).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.commonServices.refreshDataTable.next();
      this.deleteCeller2();
      this.toastr.success(res['message']);
      this.dmodificarBodega = false;
      this.getBodegas();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  deleteCeller2() {
    this.nombreBodega = "";
    this.direccionBodega = "";
    this.telefono = "";
    this.empresaSeleccionado = "";
    this.sucursalSeleccionado = "";
    this.userSeleccionado = "";
    this.ciudadSeleccionado = "";
    this.estadoBodega = "";
    this.enCero = false;
    this.disabledBodega = false;
    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = true;
    this.vmButtons[2].habilitar = true;
    this.vmButtons[3].habilitar = true;
  }

  saveBodega() {
    this.lcargando.ctlSpinner(true);
    let data = {
      nombre: this.nombreBodega,
      direccion: this.direccionBodega,
      telefono: this.telefono,
      empresa: this.empresaSeleccionado,
      sucursal: this.sucursalSeleccionado,
      encargado: this.userSeleccionado,
      ciudad: this.ciudadSeleccionado,
      estado: this.estadoBodega,
      stockMenorCero: (this.enCero) ? 1 : 0,
      ip: this.commonServices.getIpAddress(),
      accion: `Ingreso de la nueva bodega ${this.nombreBodega}`,
      id_controlador: myVarGlobals.fBodegaMovimiento
    }
    this.bodegaService.saveBodega(data).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.commonServices.refreshDataTable.next();
      this.deleteCeller2();
      this.toastr.success(res['message']);
      this.dguardarbodega = false;
      this.getBodegas();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  addCollapse() {
    this.collapse = !this.collapse;
    if (this.collapse) {
      document.getElementById('collapseExample').classList.remove("collapse");
      document.getElementById('collapseExample').classList.add("collapsing");
      setTimeout(() => {
        document.getElementById('collapseExample').classList.remove("collapsing");
        document.getElementById('collapseExample').classList.add("collapse");
        document.getElementById('collapseExample').classList.add("show");
      }, 500);
    } else {
      document.getElementById('collapseExample').classList.remove("show");
    }
  }
}
