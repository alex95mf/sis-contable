import { Component, OnInit, ViewChild } from '@angular/core';
import * as myVarGlobals from '../../../../global';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../services/commonServices';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { IngresoService } from './ingreso.service'
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { DataTableDirective } from 'angular-datatables';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GlobalTableComponent } from '../../../commons/modals/global-table/global-table.component'
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';

declare const $: any;

@Component({
standalone: false,
  selector: 'app-ingreso-producto',
  templateUrl: './ingreso.component.html',
  styleUrls: ['./ingreso.component.scss']
})
export class IngresoComponent implements OnInit {

  
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  dataGrupo: any = [];
  dataTipo: any = [{ id: "Producto", nombre: "Producto" }, { id: "Materia Prima", nombre: "Materia Prima" }];
  dataTipoCompra: any = [{ id: "Local", nombre: "Local" }, { id: "Importación", nombre: "Importación" }, { id: "Producción", nombre: "Producción" }];
  dataMetodoCosto: any = [{ id: "Directo", nombre: "Directo" }, { id: "Promedio", nombre: "Promedio" }];
  dataProServicio: any = [{ id: "Productos", nombre: "Productos" }, { id: "Servicios", nombre: "Servicios" }];
  dataMarcas: any;
  dataModelos: any;
  dataColores: any;
  dataPaises: any;
  dataUMC: any;
  dataUMV: any;
  dataUser: any;
  permisions: any;
  grupoSelect: any = 0;
  tipoSelect: any = "Producto";
  TipoCompraSelect: any = 0;
  origenData: any = 0;
  presentacionData: any;
  descuentoData: any;
  tasaData: any;
  udmcSelect: any = 0;
  udmvSelect: any = 0;
  CBData: any;
  sugeridoData: any;
  enVentaData: any = true;
  minimoData: any;
  maximoData: any;
  nameData: any;
  metCostoSelect: any = 0;
  claseSelect: any = 0;
  costoData: any = 0;
  codigoData: any;
  checkCodigo: any;
  genericoData: any;
  NumParteData: any;
  marcaSelect: any = 0;
  modeloSelect: any = 0;
  colorSelect: any = 0;
  formulaSelect: any;
  newCatalogo: any;
  tipoCatalogo: any;
  valNameGlobal: any;
  valorCatalogo: any = null;
  description: any = null;
  valueLabel: any;
  btnBorrar: any = true;
  btncancelar: any = true;
  btnModificar: any = true;
  btnGuardar: any = true;
  btnNuevo: any;
  disabledProduct: any;
  randomGenerate: any;
  disabledCode: any;
  processing: any;
  checkAuth: any = false;
  dataContabilidad: any = {};
  newCodeSend: any;
  disabledForCheck: any;
  formulaData: any;
  btnDelete: any = true;
  searchData: any;
  searchDataUpdateDelete: any;
  disabledModSearch: any = false;
  editCode: any;
  editSelectCode: any;
  id_group_receibed: any;
  materiaPrima: any = false;
  disabledMateriaPrima: any = false;
  disabledClaseServicio: any = false;
  dbQr: any = false;
  dAction: any = false;
  btnBuscar: any = false;
  observation: any = "";
  marcaSelectNew: any = null;
  disableMarca: any = true;
  flag: any = false;

  /* dictionaries */
  masa: Array<any> = [];
  long: Array<any> = [];
  aranceles: Array<any> = [];
	vmButtons: any = [];
  arrayCountrys: Array<any> = [];
  disabledFormula:any = false;

  /* valores pedidos/liquidacion */
  values: any = {
    fk_arancel: 0, code: "", porcentaje: 0, nombre:"", fk_unidad_masa: 0, masa: 0.00, fk_unidad_longitud: 0, longitud_1: 0.00, longitud_2: 0.00, longitud_3: 0.00
  }
  stockaData:any;
  /* Datatables */
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtOptions: any = {};
  dtTrigger = new Subject();
  stockActualData: any = false;
  disabledCostor: any = true;
  dataUDM: Array<any> = [];

  constructor(private toastr: ToastrService, private commonServices: CommonService, private router: Router,
    private ingresoService: IngresoService, private modalService: NgbModal) {
    this.commonServices.sendAccountingInv.asObservable().subscribe(res => {
      this.dataContabilidad = res;
    });

    this.commonServices.formulaInformation.asObservable().subscribe(res => {
      if (Object.entries(res).length > 0) {
        this.formulaData = res;
        if (this.formulaData.header !== undefined) {
          this.costoData = this.formulaData.header.costFinalFormCab
        }
      }
    });

    this.commonServices.cancelFormula.asObservable().subscribe(res => {
      this.checkAuth = false;
      this.disabledForCheck = false;
      this.costoData = 0;
    });

    this.commonServices.actionsSearchProduct.asObservable().subscribe(res => {
      this.searchData = res;
      this.searchProduct();
    })
  }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnIProducto", paramAccion: "1", boton: { icon: "fa fa-plus-square-o", texto: "NUEVO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false},
      { orig: "btnIProducto", paramAccion: "1", boton: { icon: "fa fa-search", texto: "BUSCAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false},
      { orig: "btnIProducto", paramAccion: "1", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: true},
      { orig: "btnIProducto", paramAccion: "1", boton: { icon: "fas fa-edit", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: true},
      { orig: "btnIProducto", paramAccion: "1", boton: { icon: "fa fa-times", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: true},
      { orig: "btnIProducto", paramAccion: "1", boton: { icon: "fa fa-trash-o", texto: "ELIMINAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-secondary boton btn-sm", habilitar: true},

      // Modal de Marca, Modelo, Color
      { orig: "btnIProductoModal", paramAccion: "2", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false},
      { orig: "btnIProductoModal", paramAccion: "2", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false},
      // Modal Codigo de Barra
      { orig: "btnIQrModal", paramAccion: "3", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false},
      // Modal Tarifas Arancelarias
      { orig: "btnarancelModal", paramAccion: "4", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false},
    ];

    setTimeout(() => {
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    let id_rol = this.dataUser.id_rol;
    let data = {
      id: 2,
      codigo: myVarGlobals.fIngresoProducto,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'];
      if (this.permisions[0].ver == "0") {
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de Ingreso de productos");
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);
      } else {
        this.id_group_receibed = localStorage.getItem("id_grupo");
        this.getGrupos();
        this.getCurrencys();
        this.getAranceles();
        this.values.porcentaje = "";
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);

    })
  }, 150);
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto+evento.items.paramAccion) {
        case "NUEVO1":
        this.newProduct();
        break;
        case "BUSCAR1":
        this.searchModoalsProduct();
        break;
        case "GUARDAR1":
        this.validaSaveProduct();
        break;
        case "MODIFICAR1":
        this.validaUpdateproducto();
        break;
      case "CANCELAR1":
      this.borrar();
        break;
        case "ELIMINAR1":
      this.validateDeleteProduct();
        break;
        case "CERRAR2":
          this.cancelcatalogo();
        break;
        case "GUARDAR2":
          this.vaidateSaveCatalogo();
        break;
        case "CERRAR3":
          ($('#exampleModalQr') as any).modal('hide');
        break;
        case "CERRAR4":
         this.closeModal();
        break;
    }
  }


  setTasaDescuento() {
    if (!this.descuentoData) { this.tasaData = 0; }
  }

  generaActionRawMaterial(e) {
    this.values = { fk_arancel: 1, code: 1, porcentaje: 0, nombre: "No aplica", fk_unidad_masa: 0, masa: 0.00, fk_unidad_longitud: 0, longitud_1: 0.00, longitud_2: 0.00, longitud_3: 0.00 }
    if (this.claseSelect == "Servicios") {
      this.dbQr = false;
      this.disabledMateriaPrima = true;
      this.metCostoSelect = "Directo"
      this.materiaPrima = false;
      this.CBData = "No aplica para servicio";
      this.origenData = 0;
      this.TipoCompraSelect = 0;
      /* this.descuentoData = false; */
      /* this.tasaData = 0; */
      this.minimoData = 0;
      this.maximoData = 0;
      this.sugeridoData = 0;
      this.udmcSelect = 0;
      this.udmvSelect = 0;
      this.presentacionData = "";
      this.genericoData = "";
      this.NumParteData = "";
      this.marcaSelect = 0;
      this.modeloSelect = 0;
      this.colorSelect = 0;
      this.codigoData = "";
      this.enVentaData = true;
      this.checkCodigo = false;
    } else {
      this.dbQr = (this.codigoData != "") ? true : false;
      this.TipoCompraSelect = "Compra";
      this.udmcSelect = "Metro";
      this.udmvSelect = "Metro";
      this.disabledMateriaPrima = false;
      this.CBData = "";
    }
  }

  getGrupos() {
    this.ingresoService.getGrupos().subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.dataGrupo = res['data'];
      this.getCatalogos();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    })
  }

  getCatalogos
  () {
    let data = {
      params: "'MODELOS','MARCAS','COLORES','UNIDAD DE MEDIDA','PAIS','UDM_LONGITUD','UDM_MASA'"
    }
    this.ingresoService.getCatalogos(data).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.dataMarcas = res['data']['MARCAS'];
      this.dataModelos = res['data']['MODELOS'];
      this.dataColores = res['data']['COLORES'];
      this.dataPaises = res['data']['PAIS'];
      this.dataUDM = res['data']['UNIDAD DE MEDIDA'];
      this.getUDM();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)

    })
  }

  selectedModels(event) {
    this.dataModelos = undefined;
    this.ingresoService.filterProvinceCity({ grupo: event }).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.dataModelos = res['data'];
      this.disableMarca = false;
      this.modeloSelect = 0;
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getUDM() {
    this.ingresoService.getUDM().subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.dataUMC = res['data'];
      this.dataUMV = res['data'];
      if (this.id_group_receibed != undefined) {
        this.grupoSelect = this.id_group_receibed;
        this.newProduct();
        localStorage.removeItem("id_grupo")
        setTimeout(() => {
          document.getElementById("idTipo").focus();
        }, 1000);
      }
      this.getUDMByMagnitude();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    })
  }

  getUDMByMagnitude() {
    let data = { in: ["Masa", "Longitud"] };
    this.ingresoService.getUDMMagnitudeConversion(data).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.masa = res["data"]["udms"]["Masa"]
      this.long = res["data"]["udms"]["Longitud"]

    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)

    })
  }

  getAranceles() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      search: true,
      paging: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    }
    this.ingresoService.getAvailableAranceles().subscribe(res => {
      this.aranceles = res["data"]
      this.lcargando.ctlSpinner(false);
      this.processing = true;
      setTimeout(() => {
        this.dtTrigger.next(null);
      }, 50);
    }, error => {
      this.processing = true;
      this.aranceles = [];
      this.lcargando.ctlSpinner(false);

      setTimeout(() => {
        this.dtTrigger.next(null);
      }, 50);
      this.toastr.info(error.error.message)
    })
  }

  presentarCodBarra(){
    $('#exampleModalQr').appendTo('body').modal('show');
  }

  presentarAranceles(){
    $('#ArancelesModal').appendTo('body').modal('show');
  }

  setCatalogoTitle(d, type, data) {
    $('#exampleModal').appendTo("body").modal('show');
    this.newCatalogo = d;
    this.tipoCatalogo = type;
    this.valueLabel = data;
  }

  vaidateSaveCatalogo() {
    if (this.permisions[0].guardar == "0") {
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
    this.ingresoService.getValidaNameGlobal(data).subscribe(res => {
      this.valNameGlobal = false;
    }, error => {
      this.valNameGlobal = true;
      this.toastr.info(error.error.message);
    })
  }

  crearCatalogo() {
    this.lcargando.ctlSpinner(true);
    let data = {
      ip: this.commonServices.getIpAddress(),
      accion: `Registro de ${this.valorCatalogo} como nuevo catálogo`,
      id_controlador: myVarGlobals.fIngresoProducto,
      tipo: this.tipoCatalogo,
      group: (this.marcaSelectNew != undefined) ? this.marcaSelectNew : null,
      descripcion: this.description,
      valor: this.valorCatalogo,
      estado: "A",
      id_empresa: this.commonServices.getDataUserLogued().id_empresa
    }

    this.ingresoService.saveRowCatalogo(data).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.toastr.success(res['message']);
      this.disableMarca = true;
      this.description = null;
      this.valorCatalogo = null;
      this.marcaSelectNew = null;
      this.colorSelect = 0;
      this.modeloSelect = 0;
      this.marcaSelect = 0;
      this.dataMarcas = undefined;
      this.dataModelos = undefined;
      this.dataColores = undefined;
      this.flag = false;
      this.getCatalogos();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  cancelcatalogo() {
    this.description = null;
    this.valorCatalogo = null;
    ($('#exampleModal') as any).modal('hide');
  }


  rand_code(chars, lon) {
    if (!this.checkCodigo) {
      this.editSelectCode = true;
      let code = "";
      let x = 0;
      for (x = 0; x < lon; x++) {
        let rand = Math.floor(Math.random() * chars.length);
        code += chars.substr(rand, 1);
      }
      this.randomGenerate = code;

      let data = {
        secuencial: this.randomGenerate/* "198456689" */
      }
      this.ingresoService.validateSecuencial(data).subscribe(res => {
        this.lcargando.ctlSpinner(false);
        this.codigoData = this.claseSelect.substring(0, 3) + "-" + code;
        this.codigoData = this.codigoData.toUpperCase();
        this.dbQr = (this.claseSelect == "Productos") ? true : false;
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.codigoData = "";
        this.checkCodigo = false;
        this.dbQr = (this.claseSelect == "Productos") ? false : true;
        this.toastr.info(error.error.message);
      })
    } else {
      this.dbQr = (this.claseSelect == "Productos" && (this.codigoData == "")) ? true : false;
      this.editSelectCode = false;
      this.codigoData = "";
    }
  }

  generateCode() {
    this.checkCodigo = !this.checkCodigo;
    this.codigoData = "";

    /* let filt = this.dataGrupo.filter(d => d.id_grupo == e)
    filt = filt[0]['clase'].substring(0, 1) */
  }

  newProduct() {
    /* this.btnBuscar = true; */
    this.disabledClaseServicio = false;
/*  this.btnBorrar = false;
    this.btnGuardar = false;
    this.btncancelar = false;
    this.btnModificar = true;
    this.btnDelete = true; */
    this.disabledProduct = true;
    this.searchData = "";
    this.editCode = false;
    this.formulaData = undefined;
    this.dataContabilidad = undefined;

    this.vmButtons[1].habilitar = true;
    this.vmButtons[2].habilitar = false;
    this.vmButtons[4].habilitar = false;

    if (this.searchDataUpdateDelete != undefined) { this.borrar() }
    let data = {
      nuevo: this.disabledProduct
    }
    this.commonServices.disabledComponent.next(data);
  }

  async validaUpdateproducto() {
    if (this.permisions[0].editar == "0") {
      this.toastr.info("Usuario no tiene permiso para actualizar");
    } else {
      /* if(this.searchDataUpdateDelete.fk_formula != null) {this.commonServices.updateData.next(null)}; */
      let val1 = (this.searchDataUpdateDelete.fk_formula != null) ? true : false;
      this.commonServices.updateData.next(val1);
      let resp = await this.validaGlobalData().then(respuesta => {
        if (respuesta) {
          if (this.checkAuth && this.formulaData == undefined) {
            this.toastr.info("debe ingresar al menos un producto para la formula");
            this.validaDataFormula();
          } else if (this.checkAuth && this.formulaData.details.length == 0) {
            this.validaDataFormula();
            this.toastr.info("debe ingresar al menos un producto para la formula");
          } else if (this.checkAuth && this.formulaData.header.magFormCab == null) {
            this.validaDataFormula();
            this.toastr.info("Seleccione una magnitud para la formula");
          } else {
            this.confirmSave("Seguro desea actualizar la información?", "UPDATE_PRODUCT");
          }
        }
      })
    }
  }

  async validaSaveProduct() {
    if (this.permisions[0].guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      let resp = await this.validaGlobalData().then(respuesta => {
        if (respuesta) {
          let data = {
            codigoProducto: this.codigoData,
            num_parte: (this.NumParteData != undefined) ? this.NumParteData : ""
          }
          this.ingresoService.validateProducto(data).subscribe(res => {
            if (this.dataContabilidad != undefined) {
              if (this.dataContabilidad.costos == 0) {
                this.validaDataContabilidad();
                this.toastr.info("Seleccione una cuenta de costo");
              } else if (this.dataContabilidad.descuentos == 0) {
                this.validaDataContabilidad();
                this.toastr.info("Seleccione una cuenta de descuento");
              } else if (this.dataContabilidad.devoluciones == 0) {
                this.validaDataContabilidad();
                this.toastr.info("Seleccione una cuenta de devolucion");
              } else if (this.dataContabilidad.perdidas == 0) {
                this.validaDataContabilidad();
                this.toastr.info("Seleccione una cuenta de perdidas");
              } else if (this.dataContabilidad.ventas == 0) {
                this.validaDataContabilidad();
                this.toastr.info("Seleccione una cuenta de ventas");
              } else if (this.dataContabilidad.inventario == 0) {
                this.validaDataContabilidad();
                this.toastr.info("Seleccione una cuenta de inventario");
              } else if (this.dataContabilidad.iva_compra == 0 && this.dataContabilidad.iva === true) {
                this.validaDataContabilidad();
                this.toastr.info("Seleccione una cuenta de Iva Compra");
              } else if (this.dataContabilidad.iva_venta == 0 && this.dataContabilidad.iva === true) {

                this.validaDataContabilidad();
                this.toastr.info("Seleccione una cuenta de Iva Ventas");
              } else if (this.checkAuth && this.formulaData == undefined) {
                this.toastr.info("debe ingresar al menos un producto para la formula");
                this.validaDataFormula();
              } else if (this.checkAuth && this.formulaData.header.magFormCab == 0) {
                this.validaDataFormula();
                this.toastr.info("Seleccione una magnitud para la formula");
              } else {
                this.confirmSave("Seguro desea guardar el producto?", "SAVE_PRODUCT");
              }
            } else {
              this.validaDataContabilidad();
              this.toastr.info("Complete la información en la sección de contabilidad");
            }
          }, error => {
            this.toastr.info(error.error.message);
          })
        }
      })
    }
  }

  validaGlobalData() {
    return new Promise((resolve, reject) => {
/*       if (this.descuentoData && (this.tasaData == undefined || this.tasaData.toString() == "" || this.tasaData == null)
        && this.claseSelect == "Productos") {
        let autFocus = document.getElementById("idTasa").focus();
        this.toastr.info("Ingrese una tasa de descuento");
      } else if ((this.sugeridoData == undefined || this.sugeridoData.toString() == "") && this.claseSelect == "Productos") {
        this.toastr.info("Ingrese una tasa de descuento");
      } else */ if ((this.sugeridoData == undefined || this.sugeridoData.toString() == "") && this.claseSelect == "Productos") {
        let autFocus = document.getElementById("idSSugerido").focus();
        this.toastr.info("Ingrese un stock sugerido");
      } else if (this.origenData == 0 && this.claseSelect == "Productos") {
        let autFocus = document.getElementById("idOrigen").focus();
        this.toastr.info("Ingrese un origen");
      } else if (this.codigoData == undefined || this.codigoData == "") {
        let autFocus = document.getElementById("idCodigo").focus();
        this.toastr.info("Ingrese ó genere un código");
      } else if ((this.minimoData == undefined || this.minimoData.toString() == "") && this.claseSelect == "Productos") {
        let autFocus = document.getElementById("idSMinimo").focus();
        this.toastr.info("Ingrese un stock mínimo");
      } else if ((this.maximoData == undefined || this.maximoData.toString() == "") && this.claseSelect == "Productos") {
        let autFocus = document.getElementById("idSMaximo").focus();
        this.toastr.info("Ingrese un stock máximo");
      } else if (this.nameData == undefined || this.nameData == "") {
        let autFocus = document.getElementById("idname").focus();
        this.toastr.info("Ingrese un nombre de producto");
      } else if (this.costoData == undefined || this.costoData.toString() == "") {
        let autFocus = document.getElementById("idCost").focus();
        this.toastr.info("Ingrese un costo");
      } else if ((this.presentacionData == undefined || this.presentacionData == "")
        && this.claseSelect == "Productos") {
        let autFocus = document.getElementById("idPreseentacion").focus();
        this.toastr.info("Ingrese una presentación");
      } else if ((this.genericoData == undefined || this.genericoData == "") && this.claseSelect == "ProducSSSStos") {
        let autFocus = document.getElementById("idGenerico").focus();
        this.toastr.info("Ingrese un nombre genérico");
      } else if ((this.NumParteData == undefined || this.NumParteData == "") && this.claseSelect == "Productos") {
        let autFocus = document.getElementById("idnumPar").focus();
        this.toastr.info("Ingrese un número de parte");
       }else if ((this.marcaSelect == 0 || this.marcaSelect == "") && this.claseSelect == "Productos") {
        let autFocus = document.getElementById("idMarcaSelect").focus();
        this.toastr.info("Seleccione una marca");
      } else if ((this.modeloSelect == 0 || this.modeloSelect == "") && this.claseSelect == "Productos") {
        let autFocus = document.getElementById("idModeloSelect").focus();
        this.toastr.info("Seleccione un modelo");
      } else if ((this.colorSelect == 0 || this.colorSelect == "") && this.claseSelect == "Productos") {
        let autFocus = document.getElementById("idColorSelect").focus();
        this.toastr.info("Seleccione un color");
      } else if ((this.minimoData > this.maximoData) && this.claseSelect == "Productos") {
        let autFocus = document.getElementById("idSMinimo").focus();
        this.toastr.info("Stock mínimo no puede ser mayor que el stock máximo");
      } else if (this.values.fk_unidad_masa == 0 && this.claseSelect == "Productos") {

        /* this.toastr.info("Seleccione una magnitud");
      } else if (this.values.fk_unidad_longitud == 0 && this.claseSelect == "Productos") {
        this.toastr.info("Seleccione una unidad de medida");
      } else if (this.values.fk_unidad_masa != 0 && this.claseSelect == "Productos" && this.values.masa <= 0.00) {
        this.toastr.info("La magnitud no puede ser 0");
      } else if (this.values.fk_unidad_longitud != 0 && this.claseSelect == "Productos" && (this.values.longitud_1 <= 0 || this.values.longitud_2 <= 0 || this.values.longitud_3 <= 0)) {
        this.toastr.info("Los valores de unidad de medida no pueden ser 0"); */

        this.toastr.info("Seleccione una UDM Peso");
      } else if (this.values.fk_unidad_longitud == 0 && this.claseSelect == "Productos") {
        this.toastr.info("Seleccione una UDM Peso");
      } else if (this.values.fk_unidad_masa != 0 && this.claseSelect == "Productos" && this.values.masa <= 0.00) {
        this.toastr.info("La UDM Peso no puede ser 0");
      } else if (this.values.fk_unidad_longitud != 0 && this.claseSelect == "Productos" && (this.values.longitud_1 <= 0 || this.values.longitud_2 <= 0 || this.values.longitud_3 <= 0)) {
        this.toastr.info("Los valores de unidad de medida Volumen no pueden ser 0");
      } else if (this.values.fk_arancel == 0 && this.claseSelect == "Productos") {
        this.toastr.info("Seleccione un arancel");
      } else {
        resolve(true);
      }
    });
  }

  validaDataContabilidad() {
    this.commonServices.selectContabilidad.next(true);
  }

  validaDataFormula() {
    this.commonServices.selectFormula.next(null);
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
          ($('#exampleModal') as any).modal('hide'); /* linea para cerrar el modal de boostrap */
          this.crearCatalogo();
        } else if (action == "SAVE_PRODUCT") {
          this.saveProduct();
        } else if (action == "DELETE_PRODUCT") {
          this.deleteProduct();
        } else if (action == "UPDATE_PRODUCT") {
          this.updateProduct();
        }
      }
    })
  }

  async updateProduct() {
    this.lcargando.ctlSpinner(true);
    let datagroup = this.dataGrupo.filter(d => d.id_grupo == this.grupoSelect)
    let codigo = null;
    let nivel = null;
    let codigo_padre = null;
    if (datagroup[0]['id_grupo'] != this.searchDataUpdateDelete['fk_grupo']) {
      let c = await this.generateCidgoFatherChildren().then(res => {
        codigo = res;
        nivel = (parseInt(datagroup[0]['nivel']) + 1).toString();
        codigo_padre = datagroup[0]['codigo'];
      })
    }

    let data = {
      id_producto: this.searchDataUpdateDelete.id_producto,
      id_grupo: datagroup[0]['id_grupo'],
      tipo: (this.materiaPrima) ? "Materia Prima" : "Producto",
      clase: this.claseSelect,
      en_venta: (this.enVentaData) ? 1 : 0,
      codigo_producto: this.codigoData,
      codigo_barra: this.codigoData,//this.CBData,
      numero_parte: this.NumParteData,
      secuencial: this.searchDataUpdateDelete.secuencial,
      nombre: this.nameData,
      generico: this.genericoData,
      tipo_compra: this.TipoCompraSelect,
      id_formula: this.searchDataUpdateDelete.fk_formula,
      marca: this.marcaSelect,
      modelo: this.modeloSelect,
      color: this.colorSelect,
      udmc: this.udmcSelect,
      umdv: this.udmvSelect,
      presentacion: this.presentacionData,
      procedencia: this.origenData,
      stock: this.searchDataUpdateDelete.stock,
      en_producccion: this.searchDataUpdateDelete.enProduccion,
      en_tra_local: this.searchDataUpdateDelete.enTransitoLocal,
      en_importacion: this.searchDataUpdateDelete.enImportacion,
      min_stock: this.minimoData,
      max_stock: this.maximoData,
      suge_stock: this.sugeridoData,
      bajo_stock: this.searchDataUpdateDelete.bajoStock,
      costo: parseFloat(this.costoData),
      costo_anterior: this.searchDataUpdateDelete.costoAnterior,
      metodo_costo: this.metCostoSelect,
      /* descuento: (this.descuentoData) ? 1 : 0, */
      /* tasa_descuento: this.tasaData, */
      pvp: this.searchDataUpdateDelete.PVP,
      precio_1: this.searchDataUpdateDelete.precio1,
      precio_2: this.searchDataUpdateDelete.precio2,
      precio_3: this.searchDataUpdateDelete.precio3,
      precio_4: this.searchDataUpdateDelete.precio4,
      precio_5: this.searchDataUpdateDelete.precio5,
      estado: "A",
      nivel: (nivel == null) ? this.searchDataUpdateDelete.nivel : nivel,
      codigo: (codigo == null) ? this.searchDataUpdateDelete.codigo : codigo,
      codigo_padre: (codigo_padre == null) ? this.searchDataUpdateDelete.codigo_padre : codigo_padre,
      ip: this.commonServices.getIpAddress(),
      accion: `Actualización del producto ${this.nameData} con código ${this.searchDataUpdateDelete.codigo}`,
      id_controlador: myVarGlobals.fIngresoProducto,
      observation: this.observation,
      magnitude: this.values
    }

    if (this.dataContabilidad != undefined) {
      data['cuenta_costo'] = this.dataContabilidad.costos;
      data['cuenta_venta'] = this.dataContabilidad.ventas;
      data['cuenta_devolu'] = this.dataContabilidad.devoluciones;
      data['cuenta_descuento'] = this.dataContabilidad.descuentos;
      data['cuenta_perdida'] = this.dataContabilidad.perdidas;
      data['deducible_ir'] = (this.dataContabilidad.impuestoRent) ? 1 : 0;
      data['iva'] = (this.dataContabilidad.iva) ? 1 : 0;
      data['iva_compra'] = this.dataContabilidad.iva_compra;
      data['iva_venta'] = this.dataContabilidad.iva_venta
      data['cuenta_inventario'] = this.dataContabilidad.inventario;
    } else {
      data['cuenta_costo'] = this.searchDataUpdateDelete.cuentaCostos;
      data['cuenta_venta'] = this.searchDataUpdateDelete.cuentaVentas;
      data['cuenta_devolu'] = this.searchDataUpdateDelete.cuentaDevoluciones;
      data['cuenta_descuento'] = this.searchDataUpdateDelete.cuentaDescuentos;
      data['cuenta_perdida'] = this.searchDataUpdateDelete.cuentaPerdida;
      data['deducible_ir'] = (this.searchDataUpdateDelete.deducibleIR) ? 1 : 0;
      data['iva'] = (this.searchDataUpdateDelete.Iva) ? 1 : 0;
      data['iva_compra'] = this.searchDataUpdateDelete.IvaCompra;
      data['iva_venta'] = this.searchDataUpdateDelete.IvaVenta
      data['cuenta_inventario'] = this.searchDataUpdateDelete.cuentaInvCosto;
    }

    if (this.checkAuth) {
      data['detail_formula'] = this.formulaData.details;
      data['complements_formula'] = this.formulaData.complements;
      data['header_formula'] = this.formulaData.header;
      data['comdel'] = this.formulaData.comdel;
      data['detdel'] = this.formulaData.detdel;
    }
    data['anxDel'] = this.formulaData.anxDel;

    this.ingresoService.updateProduct(data).subscribe(res => {
      this.toastr.success(res['message']);
      let params = { module: this.permisions[0].id_modulo, component: myVarGlobals.fIngresoProducto, identifier: this.searchDataUpdateDelete.id_producto }
      this.commonServices.setAnexos.next(params);
      this.borrar();
      setTimeout(() => {
        this.getGrupos();
        this.getCurrencys();
      }, 300);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })

  }

  async saveProduct() {
    this.lcargando.ctlSpinner(true);
    let codigo;
    let c = await this.generateCidgoFatherChildren().then(res => {
      codigo = res;
    })
    let datagroup = this.dataGrupo.filter(d => d.id_grupo == this.grupoSelect)
    let data = {
      id_grupo: datagroup[0]['id_grupo'],
      tipo: (this.materiaPrima) ? "Materia Prima" : "Producto",
      clase: this.claseSelect,
      en_venta: (this.enVentaData) ? 1 : 0,
      codigo_producto: this.codigoData.toUpperCase(),
      codigo_barra: this.codigoData,
      numero_parte: this.NumParteData,
      secuencial: this.randomGenerate,
      nombre: this.nameData,
      generico: this.genericoData,
      tipo_compra: this.TipoCompraSelect,
      id_formula: null,
      marca: this.marcaSelect,
      modelo: this.modeloSelect,
      color: this.colorSelect,
      udmc: this.udmcSelect,
      umdv: this.udmvSelect,
      presentacion: this.presentacionData,
      procedencia: this.origenData,
      stock: 0,
      en_producccion: 0,
      en_tra_local: 0,
      en_importacion: 0,
      min_stock: this.minimoData,
      max_stock: this.maximoData,
      suge_stock: this.sugeridoData,
      bajo_stock: true,
      costo: parseFloat(this.costoData),
      costo_anterior: 0,
      metodo_costo: this.metCostoSelect,
      descuento: (this.descuentoData) ? 1 : 0,
     /*  tasa_descuento: this.tasaData, */
     tasa_descuento: 0,
      cuenta_costo: this.dataContabilidad.costos,
      cuenta_venta: this.dataContabilidad.ventas,
      cuenta_devolu: this.dataContabilidad.devoluciones,
      cuenta_descuento: this.dataContabilidad.descuentos,
      cuenta_perdida: this.dataContabilidad.perdidas,
      deducible_ir: (this.dataContabilidad.impuestoRent) ? 1 : 0,
      iva: (this.dataContabilidad.iva) ? 1 : 0,
      iva_compra: this.dataContabilidad.iva_compra,
      iva_venta: this.dataContabilidad.iva_venta,
      cuenta_inventario: this.dataContabilidad.inventario,
      pvp: 0,
      precio_1: 0,
      precio_2: 0,
      precio_3: 0,
      precio_4: 0,
      precio_5: 0,
      estado: "A",
      nivel: (parseInt(datagroup[0]['nivel']) + 1).toString(),
      codigo: codigo,
      codigo_padre: datagroup[0]['codigo'],
      ip: this.commonServices.getIpAddress(),
      accion: `Creación del nuevo producto ${this.nameData} con código ${codigo}`,
      id_controlador: myVarGlobals.fIngresoProducto,
      observation: this.observation,
      reserva: 0,
      magnitude: this.values
    }
    if (this.checkAuth) {
      data['detail_formula'] = this.formulaData.details;
      data['complements_formula'] = this.formulaData.complements;
      data['header_formula'] = this.formulaData.header;
    }
    this.ingresoService.saveProduct(data).subscribe(res => {
      this.toastr.success(res['message']);
      let params = { module: this.permisions[0].id_modulo, component: myVarGlobals.fIngresoProducto, identifier: res['data']['id'] }
      this.commonServices.setAnexos.next(params);
      this.borrar();
      setTimeout(() => {
      /*   location.reload(); */
      this.id_group_receibed = localStorage.getItem("id_grupo");
      this.getGrupos();
      this.getCurrencys();
      }, 300);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  generateCidgoFatherChildren() {
    return new Promise((resolve, reject) => {
      let filt = this.dataGrupo.filter(d => d.id_grupo == this.grupoSelect)
      let data = {
        code_father: filt[0]['codigo']
      }
      this.ingresoService.getMaxCodeChildren(data).subscribe(res => {
        let codigo = res['data'].codigo;
        let subcadena = codigo.split(".", -1);
        let subcadenaFinal = subcadena[subcadena.length - 1];
        let cadenaSumada = parseInt(subcadenaFinal) + 1;
        this.newCodeSend = filt[0]['codigo'] + "." + cadenaSumada.toString();
        resolve(this.newCodeSend);
      }, error => {
        this.newCodeSend = filt[0]['codigo'] + "." + "1";
        resolve(this.newCodeSend);
      })
    });
  }

  searchModoalsProduct() {
    const modalInvoice = this.modalService.open(GlobalTableComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content' });
    modalInvoice.componentInstance.title = "PRODUCTO";
    modalInvoice.componentInstance.module = this.permisions[0].id_modulo;
    modalInvoice.componentInstance.component = myVarGlobals.fIngresoProducto;
  }

  borrar() {

    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = true;
    this.vmButtons[3].habilitar = true;
    this.vmButtons[4].habilitar = true;
    this.vmButtons[5].habilitar = true;

    this.observation = "";
    this.dbQr = false;
    this.disabledMateriaPrima = false;
    this.dAction = false;
    this.grupoSelect = 0;
    this.materiaPrima = false;
    this.TipoCompraSelect = 0;
    this.metCostoSelect =0;
    this.claseSelect = 0;
    this.origenData = 0;
    this.presentacionData = "";
/*     this.tasaData = ""; */
    this.CBData = "";
    this.sugeridoData = "";
    this.codigoData = "";
    this.minimoData = "";
    this.maximoData = "";
    this.nameData = "";
    this.costoData = 0;
    this.genericoData = "";
    this.NumParteData = "";
    this.marcaSelect = 0;
    this.modeloSelect = 0;
    this.colorSelect = 0;
    this.udmcSelect = 0;
    this.udmvSelect = 0;
    this.formulaSelect = undefined;
  /*   this.enVentaData = false; */
     this.enVentaData = true;
/*     this.descuentoData = false; */
    this.checkCodigo = false;
    this.checkAuth = false;
    this.randomGenerate = "";
    this.stockActualData = false;
    if (this.searchDataUpdateDelete != undefined) { this.searchDataUpdateDelete = undefined }

    this.values = {
      fk_arancel: 0, code: "",porcentaje: 0, nombre:"", fk_unidad_masa: 0, masa: 0.00, fk_unidad_longitud: 0, longitud_1: 0.00, longitud_2: 0.00, longitud_3: 0.00
    }

    let data = {
      borrar: true
    }
    this.commonServices.disabledComponent.next(data);
    this.disabledProduct = true;
    this.rerender();
  }

  tabSelection() {
    this.checkAuth = !this.checkAuth;
    if (this.checkAuth) {
      /* this.disabledMateriaPrima = true; */
      this.dAction = true;
      this.disabledForCheck = true;
      this.disabledFormula = false;
      this.metCostoSelect = "Directo";
      this.costoData = 0;
    } else {
      this.materiaPrima = false;
      /* this.disabledMateriaPrima = false; */
      this.dAction = false;
      this.disabledForCheck = false;
      this.costoData = 0;
    }
    this.commonServices.setClassPills.next(this.checkAuth);
  }

  searchProduct() {
    this.lcargando.ctlSpinner(true);
    if (this.permisions[0].consultar == "0") {
      this.toastr.info("Usuario no tiene permiso para consultar");
    } else {
      if (this.searchData == undefined || this.searchData == "") {
        this.lcargando.ctlSpinner(false);
        let autFocus = document.getElementById("IdValorCatalogo").focus();
        this.toastr.info("Ingrese un número de parte");
      } else {
        this.lcargando.ctlSpinner(false);
        this.borrar();
        let data = {
          num_parte: this.searchData,
          module: this.permisions[0].id_modulo,
          component: myVarGlobals.fIngresoProducto
        }
        this.ingresoService.searchProduct(data).subscribe(res => {
          this.lcargando.ctlSpinner(false);
          this.searchDataUpdateDelete = res['data'];
          /* this.disabledClaseServicio = true; */
          if (this.searchDataUpdateDelete.clase == "Servicios") {
            this.dbQr = false;
            this.disabledClaseServicio = true;
            this.disabledMateriaPrima = true;
            this.metCostoSelect = "Directo"
            this.materiaPrima = false;
            this.CBData = "No aplica para servicio";
            this.origenData = 0;
            this.TipoCompraSelect = 0;
           /*  this.descuentoData = false; */
            /* this.tasaData = 0; */
            this.minimoData = 0;
            this.maximoData = 0;
            this.sugeridoData = 0;
            this.udmcSelect = 0;
            this.udmvSelect = 0;
            this.presentacionData = "";
            this.genericoData = "";
            this.NumParteData = "";
            this.marcaSelect = 0;
            this.modeloSelect = 0;
            this.colorSelect = 0;
            this.codigoData = "";
            this.enVentaData = false;
            this.checkCodigo = false;
          } else {
            this.dbQr = true;
          }
          /* this.btnDelete = false;
          this.btnModificar = false;
          this.btnGuardar = true;
          this.btncancelar = false; */
          this.vmButtons[0].habilitar = true;
          this.vmButtons[1].habilitar = false;
          this.vmButtons[2].habilitar = true;
          this.vmButtons[3].habilitar = false;
          this.vmButtons[4].habilitar = false;
          this.vmButtons[5].habilitar = false;
          this.disabledProduct = true;
          this.dataContabilidad = undefined;
          this.formulaData = {};
          this.setDataUpdateDelete();
        }, error => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.message);
        })
      }
    }
  }

  setDataUpdateDelete() {
    console.log(this.searchDataUpdateDelete)
    if (this.searchDataUpdateDelete.fk_formula != null) {
      this.disabledForCheck = true;
      this.metCostoSelect = "Directo";
      (this.searchDataUpdateDelete.fk_formula != null) ? this.disabledFormula = false : this.disabledFormula = true;
    };
    if (this.searchDataUpdateDelete.clase == "Productos") {
      this.disabledMateriaPrima = (this.searchDataUpdateDelete.fk_formula != null) ? true : false;
      (this.searchDataUpdateDelete.fk_formula != null) ? this.disabledFormula = false : this.disabledFormula = true; //disabled check
    }
    this.disabledModSearch = (this.searchDataUpdateDelete.fk_formula != null) ? true : false;
    (this.searchDataUpdateDelete.fk_formula != null) ? this.disabledFormula = false : this.disabledFormula = true;
    this.checkAuth = (this.searchDataUpdateDelete.fk_formula != null) ? true : false;
    this.grupoSelect = this.searchDataUpdateDelete.fk_grupo;
    this.materiaPrima = (this.searchDataUpdateDelete.tipo == "Producto") ? false : true;
    this.TipoCompraSelect = this.searchDataUpdateDelete.tipoCompra;
    this.claseSelect = this.searchDataUpdateDelete.clase;
    this.enVentaData = (this.searchDataUpdateDelete.enVenta == 1) ? true : false;
   /*  this.descuentoData = (this.searchDataUpdateDelete.descuento == 1) ? true : false;
    this.tasaData = this.searchDataUpdateDelete.tasa_descuento; */
    this.udmcSelect = this.searchDataUpdateDelete.UDMCompra;
    this.udmvSelect = this.searchDataUpdateDelete.UDMVenta;
    this.sugeridoData = this.searchDataUpdateDelete.sugStock;
    this.origenData = this.searchDataUpdateDelete.procedencia;
    this.codigoData = this.searchDataUpdateDelete.codigoProducto;
    this.editCode = true;
    this.checkCodigo = true;
    this.checkCodigo = true;
    this.minimoData = this.searchDataUpdateDelete.minStock;
    this.maximoData = this.searchDataUpdateDelete.maxStock;
    this.stockaData = this.searchDataUpdateDelete.stock;
    this.nameData = this.searchDataUpdateDelete.nombre;
    this.metCostoSelect = this.searchDataUpdateDelete.metodoCosto;
    this.costoData = this.searchDataUpdateDelete.costo;
    this.CBData = this.searchDataUpdateDelete.codigoBarra;
    this.presentacionData = this.searchDataUpdateDelete.presentacion;
    this.genericoData = this.searchDataUpdateDelete.generico;
    this.NumParteData = this.searchDataUpdateDelete.num_parte;
    this.marcaSelect = this.searchDataUpdateDelete.marca;
    this.modeloSelect = this.searchDataUpdateDelete.modelo;
    this.colorSelect = this.searchDataUpdateDelete.color;
    this.observation = this.searchDataUpdateDelete.observation;

    var dataAccount = {};
    dataAccount['cuenta_costo'] = this.searchDataUpdateDelete.cuentaCostos;
    dataAccount['cuenta_descuento'] = this.searchDataUpdateDelete.cuentaDescuentos;
    dataAccount['cuenta_devolucion'] = this.searchDataUpdateDelete.cuentaDevoluciones;
    dataAccount['cuenta_perdida'] = this.searchDataUpdateDelete.cuentaPerdida;
    dataAccount['cuenta_venta'] = this.searchDataUpdateDelete.cuentaVentas;
    dataAccount['deducible_ir'] = this.searchDataUpdateDelete.deducibleIR;
    dataAccount['iva'] = this.searchDataUpdateDelete.Iva;
    dataAccount['cuenta_inventario'] = this.searchDataUpdateDelete.cuentaInvCosto;
    dataAccount['iva_compra'] = this.searchDataUpdateDelete.IvaCompra;
    dataAccount['iva_venta'] = this.searchDataUpdateDelete.IvaVenta;
    dataAccount['anexos'] = this.searchDataUpdateDelete.anexos;

    if (this.searchDataUpdateDelete.fk_formula != null) {
      dataAccount['formuladetails'] = this.searchDataUpdateDelete.formulecab;
    }

    (this.metCostoSelect == 'Promedio') ?  this.disabledCostor = true : this.disabledCostor = false;;

    /* UDM */
    this.values.fk_unidad_masa = (this.searchDataUpdateDelete.fk_unidad_masa != null) ? this.searchDataUpdateDelete.fk_unidad_masa : 0;
    this.values.masa = (this.searchDataUpdateDelete.masa != null) ? this.searchDataUpdateDelete.masa : 0.00;
    this.values.fk_unidad_longitud = (this.searchDataUpdateDelete.fk_unidad_longitud != null) ? this.searchDataUpdateDelete.fk_unidad_longitud : 0;
    this.values.longitud_1 = (this.searchDataUpdateDelete.longitud_1 != null) ? this.searchDataUpdateDelete.longitud_1 : 0.00;
    this.values.longitud_2 = (this.searchDataUpdateDelete.longitud_2 != null) ? this.searchDataUpdateDelete.longitud_2 : 0.00;
    this.values.longitud_3 = (this.searchDataUpdateDelete.longitud_3 != null) ? this.searchDataUpdateDelete.longitud_3 : 0.00;

    /* Aranceles */
    this.values.fk_arancel = (this.searchDataUpdateDelete.fk_arancel != null) ? this.searchDataUpdateDelete.fk_arancel : 0;
    this.values.code = (this.searchDataUpdateDelete.code != null || this.searchDataUpdateDelete.code != "") ? this.searchDataUpdateDelete.code : "";
    (this.searchDataUpdateDelete.fk_arancel == undefined || this.searchDataUpdateDelete.fk_arancel == "") ?  this.values.porcentaje = "" :  this.values.porcentaje = this.aranceles[this.searchDataUpdateDelete.fk_arancel]['tarifa_arancelaria'];
    (this.searchDataUpdateDelete.fk_arancel == undefined || this.searchDataUpdateDelete.fk_arancel == "") ?  this.values.nombre = "" :  this.values.nombre = this.aranceles[this.searchDataUpdateDelete.fk_arancel]['nombre'];
    this.commonServices.editDeleteData.next(dataAccount);
     this.stockActualData = true;
  }

  validateDeleteProduct() {
    if (this.permisions[0].eliminar == "0") {
      this.toastr.info("Usuario no tiene permiso para consultar");
    } else {
      this.confirmSave("Seguro desea eliminar el producto?", "DELETE_PRODUCT");
    }
  }

  deleteProduct() {
    this.lcargando.ctlSpinner(true);
    let data = {
      ip: this.commonServices.getIpAddress(),
      accion: `Eliminación del producto con número de parte ${this.searchDataUpdateDelete.num_parte}`,
      id_controlador: myVarGlobals.fIngresoProducto,
      id_producto: this.searchDataUpdateDelete.id_producto
    }
    this.ingresoService.deleteProduct(data).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.toastr.success(res['message']);
      setTimeout(() => {
        location.reload();
      }, 300);
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  /* Modals */
  getArancelEvent(idx) {
    this.values.fk_arancel = this.aranceles[idx]['id'];
    this.values.code = this.aranceles[idx]['codigo'];
    this.values.porcentaje = this.aranceles[idx]['tarifa_arancelaria'];
    this.values.nombre = this.aranceles[idx]['nombre'];
    this.closeModal();
  }

  closeModal() {
    ($('#ArancelesModal') as any).modal('hide');
  }

  getCurrencys() {
    this.ingresoService.getCurrencys().subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.arrayCountrys = res['data'];
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
}

metodoCosto(data){
   if(data == 'Promedio'){
     this.disabledCostor = true;
   }else {
    this.disabledCostor = false;
   }
}

rerender(): void {
  this.processing = true;
  this.lcargando.ctlSpinner(true);
  this.dtElement.dtInstance.then((dtInstance: any) => {
    dtInstance.destroy();
    this.getAranceles();
  });
}

}
