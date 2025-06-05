import { Component, OnInit, ViewChild } from '@angular/core';
import * as myVarGlobals from '../../../../global';
import { CommonService } from '../../../../../app/services/commonServices';
import { CommonVarService } from '../../../../../app/services/common-var.services';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdquisicionesService } from './adquisiciones.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { DiferedCuotasComponent } from './difered-cuotas/difered-cuotas.component';
import { ShowActivosComponent } from './show-activos/show-activos.component';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
declare const $: any;
@Component({
standalone: false,
  selector: 'app-adquisiciones',
  templateUrl: './adquisiciones.component.html',
  styleUrls: ['./adquisiciones.component.scss']
})
export class AdquisicionesComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
   dtOptions: any = {};
  dtTrigger = new Subject();
  processing: any = false;
  dataUser: any;
  permissions: any;
  arrayAux: any = [{ id: "Nuevo", nombre: "Nuevo" }, { id: "Usado", nombre: "Usado" }];
  viewDate: Date = new Date();
  /* fromDatePicker: Date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1); */
  fromDatePicker: Date = new Date();
  toDatePicker: Date = new Date();
  iva: any;
  ivaConverter: any;
  dataProducto: any = [{ fk_grupo: 0, estado: "Nuevo", codigo: "", nombre: "", descripcion: null, vida_util: 0, valor_actual: 0, valor_depreciacion: 0, depreciacion: 0, precio: 0.00, Iva: 1, fk_origen: 0, marca: 0, modelo: 0 }];
  activof: any = { claseSelect: "ATFI", subtotal: 0.00, valor_iva: 0.00, total: 0.00, isactive: 1, fecha_compra: null, tipo_pago: 0, forma_pago: 0, fk_origen: 54, fk_proveedor: 0 };
  actions: any = { btnSave: false, btnmod: false, btnactivo: false, btncancel: false, dglobal: false };
  editCode = false;
  checkCodigo: any;
  editSelectCode: any;
  randomGenerate: any;
  dbQr: any = false;
  validaDt = false;
  dataDT = [];
  arrayDepre: any;
  arrayCountrys: any;
  dataModelos: any;
  dataMarcas: any;
  disableMarca: any = false;
  newCatalogo: any;
  tipoCatalogo: any;
  valueLabel: any;
  valorCatalogo: any = null;
  flag: any = false;
  description: any = null;
  marcaSelectNew: any = null;
  marcaSelect: any;
  modeloSelect: any;
  colorSelect: any;
  valNameGlobal: any;
  tip_doc: any;
  arrayProveedor: any;
  tipo_pago: any;
  forma_pago: any;
  flagBtnDired: any = false;
  dataDifered: any = null;
  flagCountry: any = "assets/img/flags/flag-little/flag-black.png";
  /* temporal flag */
  last_doc: any;
  view: any = { showSubt: 0, showIva: 0, showTotal: 0 }
  c:any = 0;
  constructor(
    private toastr: ToastrService,
    private commonServices: CommonService,
    private router: Router,
    private commonVarSrv: CommonVarService,
    private modalService: NgbModal,
    private adqSrv: AdquisicionesService
  ) {
    this.commonVarSrv.listenDiferedActivoFijo.asObservable().subscribe(res => {
      this.dataDifered = res;
    })

    this.commonVarSrv.updPerm.asObservable().subscribe(res => {
      (res) ? this.lcargando.ctlSpinner(true); : this.lcargando.ctlSpinner(false);
    })

    this.commonVarSrv.listenSetActivoFijo.asObservable().subscribe(res => {
      this.activof = res;
      this.dataProducto = res['detalle'];
      this.dataProducto.forEach(element => {
        element['precio'] = element['precio'].toFixed(2);
      });
      this.activof.fk_origen = this.dataProducto[0].fk_origen;
      this.changeFlag();
      this.dataDifered = res['type_difered'];
      this.actions.dglobal = true;
      this.actions.btnmod = true;
      this.flagBtnDired = (res['tipo_pago'] == 'Crédito') ? true : false;
      this.last_doc = res['num_doc'];

      this.view.showSubt = this.activof.subtotal;
      this.view.showIva = this.activof.valor_iva;
      this.view.showTotal = this.activof.total;

      this.vmButtons[0].habilitar = true;
      this.vmButtons[1].habilitar = false;
    })
  }


  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  vmButtons: any;

  ngOnInit(): void {

    this.vmButtons = [
      { orig: "btnAdqAcFij", paramAccion: "1", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnAdqAcFij", paramAccion: "1", boton: { icon: "fa fa-pencil-square-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: true },
      { orig: "btnAdqAcFij", paramAccion: "1", boton: { icon: "fa fa-car", texto: "ACTIVOS" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: false },
      { orig: "btnAdqAcFij", paramAccion: "1", boton: { icon: "fa fa-times", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false },

      { orig: "btnMdlnew", paramAccion: "2", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnMdlnew", paramAccion: "2", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false }
    ];

    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 10);

    this.activof.fecha_compra = this.fromDatePicker;
    this.activof.fecha_baja = this.toDatePicker;
    this.getPermisions();
  }

  getPermisions() {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    let id_rol = this.dataUser.id_rol;
    let data = {
      codigo: myVarGlobals.fAdquisicion,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permissions = res['data'][0];
      if (this.permissions.ver == "0") {
        this.lcargando.ctlSpinner(false);
        this.vmButtons = [];
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de Activo fijo");
      } else {
        this.getInfoDEpreciaciones();
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto + evento.items.paramAccion) {
      case "GUARDAR1":
        this.validateSaveActiveFijo();
        break;
      case "MODIFICAR1":
        this.validateUpdateActive();
        break;
      case "ACTIVOS1":
        this.showActivos();
        break;
      case "CANCELAR1":
        this.cancel();
        break;

      case "GUARDAR2":
        this.vaidateSaveCatalogo();
        break;
      case "CERRAR2":
        this.cancelcatalogo();
        break;
    }
  }

  getInfoDEpreciaciones() {
    this.adqSrv.getInfoDEpreciaciones().subscribe(res => {
      this.arrayDepre = res['data'];
      this.getCurrencys();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  rand_code(chars, lon, index) {
    this.editSelectCode = true;
    let code = "";
    let x = 0;
    for (x = 0; x < lon; x++) {
      let rand = Math.floor(Math.random() * chars.length);
      code += chars.substr(rand, 1);
    }
    this.randomGenerate = code;
    let data = {
      codigo: this.randomGenerate
    }
    this.lcargando.ctlSpinner(true);
    this.adqSrv.validateSecuencial(data).subscribe(res => {
      this.dataProducto[index].codigo = this.activof.claseSelect.substring(0, 3) + "-" + code;
      this.dataProducto[index].codigo = this.dataProducto[index].codigo.toUpperCase();
      this.dbQr = true;
      this.lcargando.ctlSpinner(false);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.dataProducto[index].codigo = "";
      this.dbQr = false;
      this.toastr.info(error.error.message);
    })
  }

  generateCode() {
    if (this.activof.codigo != "") {
      this.dbQr = true;
    }
  }

  getCurrencys() {
    this.adqSrv.getCurrencys().subscribe(res => {
      this.arrayCountrys = res['data'];
      this.changeFlag();
      this.getCatalogos();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  selectedModels(event) {
    /* this.dataModelos = undefined;
    this.adqSrv.filterProvinceCity({ grupo: event }).subscribe(res => {
      this.dataModelos = res['data'];
      this.disableMarca = false;
      this.activof.modelo = undefined;
    }, error => {
      this.toastr.info(error.error.message);
    }) */
  }

  getCatalogos() {
    let data = {
      params: "'MODELOS','MARCAS','TIPO PAGO','FORMA PAGO'"
    }
    this.adqSrv.getCatalogos(data).subscribe(res => {
      this.dataMarcas = res['data']['MARCAS'];
      this.dataModelos = res['data']['MODELOS'];
      localStorage.setItem('Mod', JSON.stringify(this.dataModelos));
      this.tipo_pago = res['data']['TIPO PAGO'];
      this.forma_pago = res['data']['FORMA PAGO'];
      this.getTypeDocument();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    })
  }

  changeDisabledBtn() {
    if (this.activof.tipo_pago == 'Crédito') {
      this.flagBtnDired = true;
    } else {
      this.flagBtnDired = false;
    }
  }

  changeFechOne() {
    if (this.activof.fecha_compra > this.activof.fecha_baja) {
      this.toastr.info("La fecha de compra no puede ser mayor a la fecha actual");
      this.activof.fecha_compra = new Date();
    } else {
      this.dataProducto.forEach(element => {
        element['fk_grupo'] = 0;
      });
    }
  }

  changeFechTwo() {
    this.activof.fecha_baja = new Date();
  }

  cancel() {
    this.flagBtnDired = false;
    this.dataDifered = null;
    this.flag = false;
    this.disableMarca = false;
    this.dbQr = false;
    this.activof.claseSelect = "ATFI";
    this.activof.subtotal = 0.00;
    this.activof.valor_iva = 0.00;
    this.activof.total = 0.00;
    this.activof.subtotal = 0.00;
    this.activof.isactive = 1;
    this.activof.observaciones = "";
    this.activof.num_doc = "";
    this.activof.autorizacion = "";
    this.activof.tipo_pago = 0;
    this.activof.forma_pago = 0;
    this.activof.fk_proveedor = 0;
    this.actions = { btnSave: false, btnmod: false, btnactivo: false, btncancel: false, dglobal: false };
    this.dataProducto = [{ fk_grupo: 0, estado: "Nuevo", codigo: "", nombre: "", descripcion: null, vida_util: 0, valor_actual: 0, valor_depreciacion: 0, depreciacion: 0, precio: 0.00, Iva: 1, fk_origen: 0, marca: 0, modelo: 0 }];
    this.activof.fecha_compra == this.fromDatePicker;
    this.activof.fk_origen = 54;
    this.view = { showSubt: 0, showIva: 0, showTotal: 0 };
    //true: deshabilita false: habilita
    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = true;
    this.c = 0;
    this.changeFlag();
  }

  setCatalogoTitle(d, type, data) {
    $('#exampleModalL1').appendTo("body").modal('show');
    this.newCatalogo = d;
    this.tipoCatalogo = type;
    this.valueLabel = data;
  }

  vaidateSaveCatalogo() {
    if (this.permissions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      this.flag = true;
      if (this.valorCatalogo == null) {
        document.getElementById("IdValorCatalogo").focus();
        this.toastr.info("Ingrese un valor");
        this.flag = false;
        return;
      } else if (this.tipoCatalogo == "MODELOS" && (this.marcaSelectNew == "" || this.marcaSelectNew == null)) {
        this.toastr.info("Seleccione una Marca");
        this.flag = false;
        return;
      } else {
        this.validaNameGlobal(this.valorCatalogo, this.tipoCatalogo);
        setTimeout(() => {
          if (this.valNameGlobal) {
            document.getElementById("IdValorCatalogo").focus();
            this.toastr.info("Ingrese un valor");
          } else {
            this.confirmSave('Seguro desea crear el registro?', 'ADD_CATALOGO');
          }
        }, 1000);
      }
    }
  }

  validaNameGlobal(value, type) {
    let data = {
      valor: value,
      type: type
    }
    this.adqSrv.getValidaNameGlobal(data).subscribe(res => {
      this.valNameGlobal = false;
    }, error => {
      this.valNameGlobal = true;
      this.toastr.info(error.error.message);
    })
  }

  cancelcatalogo() {
    this.description = null;
    this.valorCatalogo = null;
    ($('#exampleModalL1') as any).modal('hide');
  }

  async confirmSave(message, action) {
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
        if (action == "ADD_CATALOGO") {
          ($('#exampleModalL1') as any).modal('hide'); /* linea para cerrar el modal de boostrap */
          this.crearCatalogo();
        } else if (action == "SAVE_ACTIVO") {
          this.saveActivo();
        } else if (action == "UPDATED_ACTIVO") {
          this.updatedAtive();
        }
      }
    })
  }

  crearCatalogo() {
    let data = {
      ip: this.commonServices.getIpAddress(),
      accion: `Registro de ${this.valorCatalogo} como nuevo catálogo`,
      id_controlador: myVarGlobals.fAdquisicion,
      tipo: this.tipoCatalogo,
      group: (this.marcaSelectNew != undefined) ? this.marcaSelectNew : null,
      descripcion: this.description,
      valor: this.valorCatalogo,
      estado: "A",
      id_empresa: this.commonServices.getDataUserLogued().id_empresa
    }

    this.adqSrv.saveRowCatalogo(data).subscribe(res => {
      this.toastr.success(res['message']);
      this.disableMarca = true;
      this.description = null;
      this.valorCatalogo = null;
      this.marcaSelectNew = null;
      this.colorSelect = undefined;
      this.dataMarcas = undefined;
      this.dataModelos = undefined;
      this.flag = false;
      this.getCatalogos();
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  getTypeDocument() {
    let data = {
      params: "'C'"
    }
    this.adqSrv.getTypeDocument(data).subscribe(res => {
      this.tip_doc = res['data']['C'];
      this.activof.fk_doc = this.tip_doc[0].id;
      this.getProveedores();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.processing = true;
      this.toastr.info(error.error.message)
    })
  }

  getProveedores() {
    this.adqSrv.getProveedores().subscribe(res => {
      this.arrayProveedor = res['data'];
      this.getimpuestos();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.processing = true;
      this.toastr.info(error.error.message);
    })
  }

  getimpuestos() {
    this.adqSrv.getImpuestos().subscribe(res => {
      this.activof.iva = res['data'][0];
      this.activof.iva = this.activof.iva.valor;
      this.activof.iva = (this.activof.iva / 100) * 100;
      this.processing = true;
      this.lcargando.ctlSpinner(false);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.processing = true;
      this.toastr.info(error.error.message);
    })
  }

  addItems() {
    if (this.permissions.agregar == "0") {
      this.toastr.info("Usuario no tiene permiso para agregar");
    } else {
      let items = { fk_grupo: 0, estado: "Nuevo", codigo: "", nombre: "", descripcion: null, vida_util: 0, valor_actual: 0, valor_depreciacion: 0, depreciacion: 0, precio: 0.00, Iva: 1, fk_origen: 0, marca: 0, modelo: 0 };
      this.dataProducto.push(items);
    }
  }

  setNumCuotas() {
    const modalInvoice = this.modalService.open(DiferedCuotasComponent, { size: "lg", backdrop: 'static', windowClass: 'viewer-content-general' });
    modalInvoice.componentInstance.diferedEdit = this.dataDifered;
    modalInvoice.componentInstance.ammount = parseFloat(this.activof.total.toString());
    modalInvoice.componentInstance.edit = this.vmButtons[1].habilitar;
  }

  showActivos() {
    const modalInvoice = this.modalService.open(ShowActivosComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' });
  }

  deleteItems(index) {
    if (this.permissions.eliminar == "0") {
      this.toastr.info("Usuario no tiene permiso para eliminar");
    } else {
      this.activof.subtotal = 0.00;
      this.activof.valor_iva = 0.00;
      this.activof.total = 0.00;
      this.view.showSubt = 0;
      this.view.showIva = 0;
      this.view.showTotal = 0;
      this.dataProducto.splice(index, 1);

      this.dataProducto.forEach(element => {
        this.activof.subtotal = parseFloat(this.activof.subtotal)  + parseFloat(element.precio);
      });
      this.activof.valor_iva = this.activof.subtotal * (this.activof.iva / 100);
      this.activof.total = this.activof.subtotal + this.activof.valor_iva;

      this.view.showSubt = this.activof.subtotal;
      this.view.showIva = this.activof.valor_iva;
      this.view.showTotal = this.activof.total;
    }
  }

  sumTotal(index, dt) {
    this.activof.subtotal = 0.00;
    this.activof.valor_iva = 0.00;
    this.activof.total = 0.00;
    this.view.showSubt = 0;
    this.view.showIva = 0;
    this.view.showTotal = 0;

    this.dataProducto.forEach(element => {
      this.activof.subtotal = parseFloat(this.activof.subtotal)  + parseFloat(element.precio);
    });
    this.activof.valor_iva = this.activof.subtotal * (this.activof.iva / 100);
    this.activof.total = this.activof.subtotal + this.activof.valor_iva;
    /* this.dataProducto[index].fk_grupo = 0;
    this.dataProducto[index].codigo = null;
    this.dataProducto[index].estado = 0;
    this.dataProducto[index].nombre = null;
    this.dataProducto[index].descripcion = null;
    this.dataProducto[index].depreciacion = 0;
    this.dataProducto[index].vida_util = 0;
    this.dataProducto[index].valor_actual = 0;
    this.dataProducto[index].valor_depreciacion = 0;
    this.dataProducto[index].fk_origen = 0;
    this.dataProducto[index].marca = null;
    this.dataProducto[index].modelo = null; */

    this.view.showSubt = this.activof.subtotal;
    this.view.showIva = this.activof.valor_iva;
    this.view.showTotal = this.activof.total;
  }

  selectGroupDepreciacion(i, dt) {
    /*generar el codigo automaticamente*/
    this.rand_code('ActivoFijo', 10, i);
    /*sacar meses de depreciacion en base a la fecha compra*/
    this.getDepreciation(i, dt);
  }

  getDepreciation(i, dt) {
    let depre = this.arrayDepre.filter(e => e.id == dt);
    /*obtengo los meses de depreciacion*/
    this.dataProducto[i].depreciacion = moment(this.toDatePicker).diff(moment(this.activof.fecha_compra), 'month');
    /*obtengo el valor depreciado*/
    this.dataProducto[i].valor_depreciacion = (((parseFloat(this.dataProducto[i].precio) / depre[0]['años_depreciables']) / 12) * this.dataProducto[i].depreciacion).toFixed(2);
    /* obtengo la vida útil*/
    this.dataProducto[i].vida_util = ((12 * depre[0]['años_depreciables']) - this.dataProducto[i].depreciacion);
    /*obtengo el valor actual*/
    this.dataProducto[i].valor_actual = (parseFloat(this.dataProducto[i].precio) - parseFloat(this.dataProducto[i].valor_depreciacion)).toFixed(2);
  }

  async validateSaveActiveFijo() {
    if (this.permissions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      let resp = await this.validateDataGlobal().then(respuesta => {
        if (respuesta) {
          this.confirmSave("Seguro desea guardar la compra de activos?", "SAVE_ACTIVO");
        }
      })
    }
  }

  validateDataGlobal() {
    let flag = false;
    return new Promise((resolve, reject) => {
      if (this.dataDifered != null && (parseFloat(this.activof.total).toFixed(2) != parseFloat(this.dataDifered.amount).toFixed(2))
        && this.activof.tipo_pago == 'Crédito') {
        this.toastr.info("El valor diferido no es igual al valor total de la factura, favor revise ambos valores");
        document.getElementById("idbtndifered").focus(); return;
      } else if (this.activof.tipo_pago == 'Crédito' && this.dataDifered == null) {
        this.toastr.info("Debe diferir el total de la factura cuando el tipo de pago es a Crédito");
        document.getElementById("idbtndifered").focus(); return;
      } else if (this.activof.num_doc == "" || this.activof.num_doc == undefined) {
        this.toastr.info("debe ingresar un número de documento");
        document.getElementById("idmudoc").focus(); return;
      } else if (this.activof.tipo_pago == undefined || this.activof.tipo_pago == "" || this.activof.tipo_pago == 0) {
        this.toastr.info("Seleccione un tipo de pago");
        document.getElementById("idTipoPagoSelect").focus(); return;
      } else if (this.activof.autorizacion == "" || this.activof.autorizacion == undefined) {
        this.toastr.info("debe ingresar un número de autorización");
        document.getElementById("IdnumAut").focus(); return;
      } else if (this.activof.forma_pago == undefined || this.activof.forma_pago == "" || this.activof.forma_pago == 0) {
        this.toastr.info("Seleccione una forma de pago");
        document.getElementById("idFormaPago").focus(); return;
      } else if (this.activof.fk_proveedor == 0) {
        this.toastr.info("seleccione un proveedor");
        document.getElementById("IdProvidersDoc").focus(); return;
      } else if (this.activof.fk_origen == 0) {
        this.toastr.info("seleccione un país de origen");
        document.getElementById("idOrigin").focus(); return;
      } else if (this.dataProducto.length == 0) {
        this.toastr.info("debe ingresar al menos un producto");
      } else if (this.dataProducto.length == 1 && this.dataProducto[0].fk_grupo == 0) {
        this.toastr.info("debe ingresar al menos un producto");
      } else {
        this.c = 0;
        this.dataProducto.forEach(element => {
          if (element['precio'] == 0 || element['precio'] == "" || element['codigo'] == null || element['estado'] == 0
            || element['nombre'] == null || element['fk_grupo'] == 0 || element['marca'] == 0 || element['modelo'] == 0) {
            this.c += 1;
            if (this.c == 1) {this.toastr.info("Revise la información en los items, la información no está completa")}
            flag = true; return;
          }
        });
        (!flag) ? resolve(true) : resolve(false);
      }
    });
  }

  saveActivo() {
    this.dataProducto.forEach(element => {
      element['fk_origen'] = this.activof.fk_origen;
    });

    let info;
    if (this.activof.tipo_pago == "Contado") {
      let objCoutas = {};
      objCoutas['Num_cuota'] = 1;
      objCoutas['monto_cuota'] = this.activof.total.toFixed(2);
      objCoutas['fecha_vencimiento'] = moment(this.toDatePicker).format('YYYY-MM-DD');
      let arrCoutas = [];
      arrCoutas.push(objCoutas);
      info = {
        amount: this.activof.total.toFixed(2),
        cuotas: 1,
        difered: arrCoutas
      }
    }
    this.activof['detalle'] = this.dataProducto;
    this.activof['type_difered'] = (this.activof.tipo_pago == "Contado") ? info : this.dataDifered;
    this.activof['fecha_compra'] = moment(this.activof['fecha_compra']).format("YYYY-MM-DD");
    this.activof['fecha_baja'] = moment(this.toDatePicker).format("YYYY-MM-DD");
    this.activof['ip'] = this.commonServices.getIpAddress()
    this.activof['id_controlador'] = myVarGlobals.fAdquisicion
    this.activof['accion'] = `Compra de activo fijo con número de documento ${this.activof['num_doc']}`;

    (this as any).mensajeSpinner = "Guardando...";
    this.lcargando.ctlSpinner(true);
   /*  console.log(this.activof); */
    this.adqSrv.saveActivo(this.activof).subscribe(res => {
      localStorage.removeItem('Mod');
      this.lcargando.ctlSpinner(false);
      this.cancel();
      this.toastr.success(res['message']);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  updatedAtive() {
    this.dataProducto.forEach(element => {
      element['fk_origen'] = this.activof.fk_origen;
    });
    let info;
    if (this.activof.tipo_pago == "Contado") {
      let objCoutas = {};
      objCoutas['Num_cuota'] = 1;
      objCoutas['monto_cuota'] = this.activof.total.toFixed(2);
      objCoutas['fecha_vencimiento'] = moment(this.toDatePicker).format('YYYY-MM-DD');
      let arrCoutas = [];
      arrCoutas.push(objCoutas);
      info = {
        amount: this.activof.total.toFixed(2),
        cuotas: 1,
        difered: arrCoutas
      }
    }
    this.activof['last_doc'] = this.last_doc;
    this.activof['detalle'] = this.dataProducto;
    this.activof['type_difered'] = (this.activof.tipo_pago == "Contado") ? info : this.dataDifered;
    this.activof['fecha_compra'] = moment(this.activof['fecha_compra']).format("YYYY-MM-DD");
    this.activof['fecha_baja'] = moment(this.toDatePicker).format("YYYY-MM-DD");
    this.activof['ip'] = this.commonServices.getIpAddress();
    this.activof['id_controlador'] = myVarGlobals.fAdquisicion;
    this.activof['accion'] = `Actialización de activo fijo con número de documento ${this.activof['num_doc']}`;

    (this as any).mensajeSpinner = "Guardando...";
    this.lcargando.ctlSpinner(true);
    this.adqSrv.updatedActivo(this.activof).subscribe(res => {
      localStorage.removeItem('Mod');
      this.lcargando.ctlSpinner(false);
      this.cancel();
      this.toastr.success(res['message']);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  async validateUpdateActive() {
    if (this.permissions.editar == "0") {
      this.toastr.info("Usuario no tiene permiso para actualizar");
    } else {
      let resp = await this.validateDataGlobal().then(respuesta => {
        if (respuesta) {
          this.confirmSave("Seguro desea actualizar la información de activos?", "UPDATED_ACTIVO");
        }
      })
    }
  }

  changeFlag() {
    if (this.activof.fk_origen != 0) {
      this.flagCountry = this.arrayCountrys.filter(e => e.id == this.activof.fk_origen)[0]['flag'];
    } else {
      this.flagCountry = "assets/img/flags/flag-little/flag-black.png";
    }
  }

  searchModelo(evt, index) {
    this.dataModelos = JSON.parse(localStorage.getItem('Mod'));
    let ModAux;
    if (evt != 0) {
      ModAux = this.dataModelos.filter(e => e.grupo == evt);
      this.dataModelos = ModAux;
    } else {
      this.dataProducto[index].modelo = 0;
    }
  }

}
