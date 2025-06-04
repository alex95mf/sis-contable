import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router'
import 'sweetalert2/src/sweetalert2.scss';
import { ToastrService } from 'ngx-toastr';
import * as myVarGlobals from '../../../../global';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SuppliersService } from './suppliers.service'
import { CommonService } from '../../../../services/commonServices';
import { CommonVarService } from '../../../../services/common-var.services';
import { IngresoService } from '../../producto/ingreso/ingreso.service'
import { GlobalTableComponent } from '../../../commons/modals/global-table/global-table.component'
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
declare const $: any;
import { DropDownTreeComponent } from '@syncfusion/ej2-angular-dropdowns';

@Component({
standalone: false,
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent implements OnInit {
  @ViewChild("vaSelect") myInputVariable: ElementRef;
  public ddTree: DropDownTreeComponent;
  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  newOrigin: any;
  tipoOrigin: any;
  valueLabel: any;
  dataCatalogos: any;
  dataModalsCatalogo: any = { countries: null, provinces: null, value: null, description: null };

  /* extenal information */
  infoArrayContact: any = [];

  /* Actions */
  actions: any = {
    new: false,
    search: false,
    add: true,
    edit: true,
    cancel: true,
    delete: true,
  }

  /* validations */
  dataUser: any;
  permissions: any;
  processing: boolean = false;
  tamDoc: any = 0;
  province: boolean = false;
  city: boolean = false;
  validateDoc: boolean = false;


  /* Information */
  supplier: any = {
    switchCredit: false,
    switchGarant: false,
    cupcredit: 0.00,
    valcredit: 0.00,
    totalcredit: 0.00,
    valmonto: 0.00,
    document: 0,
    constribuyente: 0,
    tipcontribuyente: 0,
    tipo: 0,
    linea: 0,
    docgarantia: 0,
    timecredit: 0,
    origin: 0,
    country: 0,
    province: 0,
    city: 0
  };

  catalog: any = {};
  vmButtons: any;

  treeData: any = false;
  fields: any;
  checkAuth: any = true;
  lineaSendId: any;
  varAux: any = " Seleccione un grupo";
  flagDropDown: any = false;


  constructor(private toastr: ToastrService, private router: Router, private commonServices: CommonService, private commonVarServices: CommonVarService,
    private supplierSrv: SuppliersService, private ingresoSrv: IngresoService, private modalService: NgbModal) {
    this.commonServices.resContactProvider.asObservable().subscribe(res => {
      this.supplier.contact_delete = res.contact_delete;
      this.supplier.contact_modify = res.contact_modify;
    })

    this.commonServices.resAnexosProvider.asObservable().subscribe(res => {
      this.supplier.anexos_delete = res.anexos_delete;

    })

    this.commonVarServices.updPerm.asObservable().subscribe(res => {
      (res) ? this.lcargando.ctlSpinner(true) : this.lcargando.ctlSpinner(false);
    })

    this.commonServices.actionsSearchProviders.asObservable().subscribe(res => {

      if (res.linea != null) {
        this.lineaSendId = res.linea;
        this.supplier.linea = this.catalog.linea.filter(e => e.id_grupo == res.linea)[0]['nombre'];
        this.myInputVariable['currentText'] = this.supplier.linea;
        res.linea = this.lineaSendId;
        this.varAux = this.myInputVariable['currentText'];
      }

      this.supplier = res;
      this.supplier['ruc_axiliar'] = res['docnumber'];

      this.docValidate(this.supplier.document);
      this.actions.new = true;
      this.actions.search = true;
      this.actions.add = true;
      this.actions.edit = false;
      this.actions.cancel = false;
      this.actions.delete = false;

      this.vmButtons[0].habilitar = true;
      this.vmButtons[1].habilitar = true;
      this.vmButtons[2].habilitar = true;
      this.vmButtons[3].habilitar = false;
      //this.vmButtons[4].habilitar = false;
      this.vmButtons[5].habilitar = false;

      var province = this.supplier.province;
      var city = this.supplier.city;
      this.changeGroup(this.supplier.tipo);
      this.provinceSearch(this.supplier.country);
      this.citieSearch(this.supplier.province);

      setTimeout(() => {
        this.supplier.province = province;
        this.province = true;

        this.supplier.city = city;
        this.city = true;
      }, 500);

      this.commonServices.actionsSuppliers.next(this.actions);
    })
  }

  PrintSectionCDI() {
    let el: HTMLElement = this.myInputVariable.nativeElement as HTMLElement;
    el.click();
    this.onChange();
  }

  ngOnInit(): void {

    this.vmButtons = [
      { orig: "btnsProviderRegister", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "NUEVO" }, permiso: false, showtxt: true, showimg: false, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false },
      { orig: "btnsProviderRegister", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "BUSCAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: true },
      { orig: "btnsProviderRegister", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: true },
      { orig: "btnsProviderRegister", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: true },
      { orig: "btnsProviderRegister", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false },
      { orig: "btnsProviderRegister", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "ELIMINAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-dark boton btn-sm", habilitar: true }
    ];

    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 50);
    this.ActivateForm();
    this.validatePermission();
  }

  /* Call Api  */
  validatePermission() {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));

    let params = {
      codigo: myVarGlobals.fProveedores,
      id_rol: this.dataUser.id_rol
    }

    this.commonServices.getPermisionsGlobas(params).subscribe(res => {
      this.permissions = res["data"][0];
      if (this.permissions.ver == "0") {
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de Proveedores");
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);
      } else {
        setTimeout(() => {
          this.processing = true;
          this.fillCatalog();
        }, 1000);
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  fillCatalog() {
    let data = {
      params: "'DOCUMENTO','PERSONA','CONTRIBUYENTE','ORIGEN','CLASE','PLAZO','PAIS','GARANTIAS','PROVINCIA'",
    };
    this.supplierSrv.getCatalogs(data).subscribe(res => {
      this.catalog.documents = res["data"]["DOCUMENTO"];
      this.catalog.countries = res["data"]["PAIS"];
      this.catalog.persons = res["data"]["PERSONA"];
      /* this.catalog.contrib = res["data"]["CONTRIBUYENTE"]; */
      this.catalog.origin = res["data"]["ORIGEN"];
      this.catalog.class = res["data"]["CLASE"].filter(e => e.valor != "Representaciones" && e.valor != "Mixto");
      this.catalog.time = res["data"]["PLAZO"];
      this.catalog.paises = res["data"]["PAIS"];
      this.catalog.provincias = res["data"]["PROVINCIA"];
      this.catalog.garantias = res["data"]["GARANTIAS"];

      this.supplier.country = 0;
      this.supplier.province = 0;
      this.supplier.city = 0;
      let flagSend = "";
      this.supplier.tipo = this.catalog.class[0]['valor'];
      if (this.supplier.tipo == "Productos - Inventario") {
        flagSend = "I";
      } else if (this.supplier.tipo == "Servicios") {
        flagSend = "S";
      } else if (this.supplier.tipo == "Proveeduria") {
        flagSend = "P";
      } else if (this.supplier.tipo == "Activos") {
        flagSend = "A";
      }

      this.getAgentRetencion(flagSend);
    }, (error) => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  getAgentRetencion(flagSend) {
    this.supplierSrv.getAgentRetencion({}).subscribe(res => {
      this.catalog.contrib = res["data"]
      this.getGroupsProduct(flagSend);
    }, (error) => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  getGroupsProduct(flagSend) {
    this.ingresoSrv.getGrupos().subscribe(res => {
      this.catalog.linea = res["data"];
      this.getTreeProduct({ inactive: this.checkAuth, flag: flagSend });
    }, (error) => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  getTreeProduct(data) {
    this.supplierSrv.getTreeProducts(data).subscribe(res => {
      this.treeData = res['data'];
      (this.treeData.length == 0) ? this.fields = undefined :
        this.fields = { dataSource: res['data'], value: 'id_grupo', text: 'name', child: 'subChild', expanded: 'expanded' };
      this.lcargando.ctlSpinner(false);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.mesagge);
    })
  }

  changeGroup(evt) {
    this.lcargando.ctlSpinner(true);
    let flagSend = "";
    if (evt == "Productos - Inventario") {
      flagSend = "I";
    } else if (evt == "Servicios") {
      flagSend = "S";
    } else if (evt == "Proveeduria") {
      flagSend = "P";
    } else {
      flagSend = "A";
    }
    this.treeData = [];
    this.fields = undefined;
    this.getTreeProduct({ inactive: this.checkAuth, flag: flagSend });
  }

  setProveedor(data) {
    if (this.permissions.guardar == "0") {
      this.toastr.info("Usuario no tiene Permiso para guardar de Proveedores");
      this.router.navigateByUrl('dashboard');
    } else {
      this.lcargando.ctlSpinner(true);
      data.id_controlador = myVarGlobals.fProveedores;
      data.accion = `Registro del proveedor ${data.docnumber}`;
      data.ip = this.commonServices.getIpAddress();
      (this.supplier.linea != "" && this.supplier.linea != undefined && this.supplier.linea != null) ? data.linea = this.lineaSendId : data.linea = "";

      this.supplierSrv.saveProveedores(data).subscribe(res => {
        this.toastr.success(res["message"]);
        this.lcargando.ctlSpinner(false);
        this.commonServices.saveProveedores.next({ identifier: res['data']['id'] });
        this.CancelForm();
        setTimeout(() => {
          this.fillCatalog();
        }, 300);
      }, (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      });
    }
  }

  patchProveedor(data) {
    if (this.permissions.editar == "0") {
      this.toastr.info("Usuario no tiene Permiso para editar al proveedor");
      this.router.navigateByUrl('dashboard');
    } else {
      this.lcargando.ctlSpinner(true);
      delete data['anexos'];
      delete data['contactos'];

      data.id_controlador = myVarGlobals.fProveedores;
      data.accion = `Actualización del proveedor ${data.id_proveedor}`;
      data.ip = this.commonServices.getIpAddress();
      (this.supplier.linea != "" && this.supplier.linea != undefined && this.supplier.linea != null) ? data.linea = this.lineaSendId : data.linea = "";

      this.supplierSrv.updateProveedores(data).subscribe(res => {
        this.toastr.success(res["message"]);
        this.lcargando.ctlSpinner(false);
        this.commonServices.saveProveedores.next({ identifier: data.id_proveedor });
        this.CancelForm();
        setTimeout(() => {
          this.fillCatalog();
        }, 300);
      }, (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      });
    }
  }

  destroyProveedor(data) {
    this.lcargando.ctlSpinner(true);
    if (this.permissions.eliminar == "0") {
      this.toastr.info("Usuario no tiene Permiso para eliminar al proveedor");
      this.router.navigateByUrl('dashboard');
    } else {
      data.id_controlador = myVarGlobals.fProveedores;
      data.accion = `Borrado del proveedor ${data.id_proveedor}`;
      data.ip = this.commonServices.getIpAddress();

      this.supplierSrv.deleteProveedor(data).subscribe(res => {
        this.toastr.success(res["message"]);
        this.lcargando.ctlSpinner(false);
        this.CancelForm();
        setTimeout(() => {
          this.fillCatalog();
        }, 300);
      }, (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      });
    }
  }

  /* Common Methods */
  ActivateForm() {
    this.actions.new = true;
    this.actions.search = true;
    this.actions.add = false;
    this.actions.edit = true;
    this.actions.cancel = false;
    this.actions.delete = true;

    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = false;
    this.vmButtons[3].habilitar = true;
    //this.vmButtons[4].habilitar = false;
    this.vmButtons[5].habilitar = true;

    this.supplier.province = 0;
    this.supplier.city = 0

    this.province = false;
    this.city = false;
    this.commonServices.actionsSuppliers.next(this.actions);
  }

  CancelForm() {
    this.actions.new = true;
    this.actions.search = false;
    this.actions.add = true;
    this.actions.edit = true;
    this.actions.cancel = true;
    this.actions.delete = true;

    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = false;
    this.vmButtons[3].habilitar = true;
    //this.vmButtons[4].habilitar = true;
    this.vmButtons[5].habilitar = true;
    this.varAux = " Seleccione un grupo";

    this.commonServices.actionsSuppliers.next(this.actions);
    this.ClearForm();
  }

  ClearForm() {
    this.lcargando.ctlSpinner(true);
    /* this.supplier = {
      switchCredit: false, switchGarant: false, cupcredit: 0.00, valcredit: 0.00, totalcredit: 0.00, valmonto: 0.00,
    }; */
    this.supplier = {
      switchCredit: false,
      switchGarant: false,
      cupcredit: 0.00,
      valcredit: 0.00,
      totalcredit: 0.00,
      valmonto: 0.00,
      document: 0,
      constribuyente: 0,
      tipcontribuyente: 0,
      tipo: 0,
      linea: 0,
      docgarantia: 0,
      timecredit: 0,
      origin: 0,
      country: 0,
      province: 0,
      city: 0
    };

    let flagSend = "";
    this.supplier.tipo = this.catalog.class[0]['valor'];
    if (this.supplier.tipo == "Productos - Inventario") {
      flagSend = "I";
    } else if (this.supplier.tipo == "Servicios") {
      flagSend = "S";
    } else if (this.supplier.tipo == "Proveeduria") {
      flagSend = "P";
    } else if (this.supplier.tipo == "Activos") {
      flagSend = "A";
    }
    this.getTreeProduct({ inactive: this.checkAuth, flag: flagSend });

  }

  clearSwitchCredit() {
    this.supplier.timecredit = 0;
    this.supplier.cupcredit = 0.00;
    this.supplier.valcredit = 0.00;
    this.supplier.totalcredit = 0.00;
  }

  clearSwitchGarant() {
    this.supplier.docgarantia = 0;
    this.supplier.valmonto = 0.00;
  }

  calculateCredit() {
    setTimeout(() => {
      let balance = [this.supplier.cupcredit, this.supplier.valcredit].reduce((a, b) => {
        return a - b
      })
      this.supplier.totalcredit = parseFloat(balance).toFixed(2);
    }, 500);
  }

  async saveProveedor() {
    await this.commonValidate(0).then(resp => {
      if (resp) {
        this.commonServices.contactProvider.next(null);
        this.confirmSave("Seguro desea guardar el proveedor?", "SET_SUPPLIERS");
      }
    })
  }

  async updateProveedor() {
    await this.commonValidate(1).then(resp => {
      if (resp) {
        this.commonServices.contactProvider.next(null);
        this.commonServices.anexosProvider.next(null);
        this.confirmSave("Seguro desea actualizar el proveedor?", "PATCH_SUPPLIERS");
      }
    });
  }

  deleteProveedor() {
    this.confirmSave("Seguro desea eliminar el proveedor?", "DESTROY_SUPPLIERS");
  }

  /* Validation Forms */
  commonValidate(action) {
    return new Promise((resolve, reject) => {
      if (this.supplier.document == 0) {
        document.getElementById("document").focus();
        this.toastr.info("Seleccione un documento");
      } else if (this.supplier.docnumber == undefined || this.supplier.docnumber == 0) {
        document.getElementById("docNumber").focus();
        this.toastr.info("Ingrese un número de documento");
      } else if ((this.supplier.docnumber.toString().length < 10 || this.supplier.docnumber.toString().length > 10) && this.supplier.document == 'Cedula') {
        document.getElementById("docNumber").focus();
        this.toastr.info("Cantidad de dígitos no corresponde al tipo de documento");
      } else if ((this.supplier.docnumber.toString().length < 13 || this.supplier.docnumber.toString().length > 13) && this.supplier.document == 'Ruc') {
        document.getElementById("docNumber").focus();
        this.toastr.info("Cantidad de dígitos no corresponde al tipo de documento");
      } else if (this.supplier.constribuyente == 0) {
        document.getElementById("constribuyente").focus();
        this.toastr.info("Seleccione un contribuyente");
      } else if (this.supplier.tipcontribuyente == 0) {
        document.getElementById("tipcontribuyente").focus();
        this.toastr.info("Seleccione el tipo contribuyente");
      } else if (this.supplier.rsocial == undefined || this.supplier.rsocial == "") {
        document.getElementById("rsocial").focus();
        this.toastr.info("Ingrese una Razón Social");
      } else if (this.supplier.ncomercial == undefined || this.supplier.ncomercial == "") {
        document.getElementById("ncomercial").focus();
        this.toastr.info("Ingrese un Nombre Comercial");
      } else if (this.supplier.replegal == undefined || this.supplier.replegal == "") {
        document.getElementById("replegal").focus();
        this.toastr.info("Ingrese un Representante Legal");
      } else if (this.supplier.address == undefined || this.supplier.address == "") {
        document.getElementById("address").focus();
        this.toastr.info("Ingrese una dirección");
      } else if (this.supplier.tipo == 0) {
        document.getElementById("tipo").focus();
        this.toastr.info("Seleccione un tipo de proveeduría");
      } else if (this.supplier.linea == "" || this.supplier.linea == undefined || this.supplier.linea == null) {
        document.getElementById("linea").focus();
        this.toastr.info("Seleccione una linea de producto");
      } else if (this.supplier.phone == undefined || this.supplier.phone == "") {
        document.getElementById("phone").focus();
        this.toastr.info("Ingrese un teléfono");
      } else if (this.supplier.origin == 0) {
        document.getElementById("origin").focus();
        this.toastr.info("Seleccione un origen");
      } else if (this.supplier.country == undefined || this.supplier.country == 0) {
        document.getElementById("country").focus();
        this.toastr.info("Seleccione un país");
      } else if (this.supplier.province == undefined || this.supplier.province == 0) {
        document.getElementById("province").focus();
        this.toastr.info("Seleccione una provincia");
      } else if (this.supplier.city == undefined || this.supplier.city == 0) {
        document.getElementById("city").focus();
        this.toastr.info("Seleccione una ciudad");
      } else if (!this.validateCredit()) {
        /* Su validación se encuentra en otra función */
      } else if (!this.validarEmail(this.supplier.email)) {
        this.toastr.info("El correo no es válido !!");
        document.getElementById("idCorreoFac").focus();
      } else {
        if (action === 0) {
          this.lcargando.ctlSpinner(true);
          this.supplierSrv.validateDoc({ cedula: this.supplier.docnumber }).subscribe(res => {
            this.lcargando.ctlSpinner(false);
            if (res['data'].length > 0) {
              this.toastr.info(`La información ${this.supplier.docnumber} ya se encuentra registrada.`);
              document.getElementById("docNumber").focus();
            } else {
              resolve(true);
            }
          });
        } else if (action === 1) {
          resolve(true);
        }
      }
    });
  }

  validarEmail(valor) {
    if (/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(valor)) {
      return true;
    } else {
      return false;
    }
  }

  validateCredit(): boolean {
    if (this.supplier.switchCredit) {
      if (this.supplier.timecredit == 0) {
        document.getElementById("timecredit").focus();
        this.toastr.info("Seleccione un plazo de crédito");
        return false;
      } else if (this.supplier.cupcredit == null) {
        document.getElementById("cupcredit").focus();
        this.toastr.info("Ingrese un cupo de crédito");
        return false;
      }
    } if (this.supplier.switchGarant) {
      if (this.supplier.docgarantia == undefined) {
        document.getElementById("docgarantia").focus();
        this.toastr.info("Seleccione un documento de garanía");
        return false;
      } else if (this.supplier.valmonto == null) {
        document.getElementById("valmonto").focus();
        this.toastr.info("Ingrese un monto de garantía");
        return false;
      }
    }
    return true;
  }

  searchProviders() {
    const modalInvoice = this.modalService.open(GlobalTableComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content' });
    modalInvoice.componentInstance.title = "PROVEEDOR";
    modalInvoice.componentInstance.module = this.permissions.id_modulo;
    modalInvoice.componentInstance.component = myVarGlobals.fProveedores;
  }

  onlyNumber(event): boolean {
    let key = (event.which) ? event.which : event.keyCode;
    if (key > 31 && (key < 48 || key > 57)) {
      return false;
    }
    return true;
  }

  /* OnChange */
  docValidate(event) {
    document.getElementById("docNumber").focus();
    if (event == "Cedula") {
      this.tamDoc = 10;
    } else if (event == "Ruc") {
      this.tamDoc = 13;
    } else if (event == "Pasaporte") {
      this.tamDoc = 12;
    }
  }

  searchProvinces(event) {
    this.lcargando.ctlSpinner(true);
    this.supplierSrv.filterProvinceCity({ grupo: event }).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.catalog.province = res['data'];

      this.province = true;
      this.city = false;
      setTimeout(() => {
        this.supplier.province = 0;
        this.catalog.city = undefined;
        this.supplier.city = 0;
      }, 500);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  searchCities(event) {
    this.lcargando.ctlSpinner(true);
    this.supplierSrv.filterProvinceCity({ grupo: event }).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.catalog.city = res['data'];

      this.city = true;
      setTimeout(() => {
        this.supplier.city = 0;
      }, 500);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  provinceSearch(event) {
    this.supplierSrv.filterProvinceCity({ grupo: event }).subscribe(res => {
      this.catalog.province = res['data'];
      this.province = true;
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  citieSearch(event) {
    this.supplierSrv.filterProvinceCity({ grupo: event }).subscribe(res => {
      this.catalog.city = res['data'];
      this.city = true;
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  /* Modals */
  setCatalogoTitle(d, type, data) {
    $('#locationModal').appendTo("body").modal('show');
    this.newOrigin = d;
    this.tipoOrigin = type;
    this.valueLabel = data;
  }

  cancelcatalogo() {
    this.dataModalsCatalogo = {};
  }

  vaidateSaveCatalogo() {
    if (this.permissions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      if (this.dataModalsCatalogo.value == null) {
        this.toastr.info("Ingrese un valor");
        document.getElementById("IdValorCatalogo").focus();
        return;
      } else {
        this.validaNameGlobal(this.dataModalsCatalogo.value, this.tipoOrigin);
      }
      setTimeout(() => {
        if (this.dataModalsCatalogo.valNameGlobal) {
          document.getElementById("IdValorCatalogo").focus();
        } else if ((this.tipoOrigin == 'PROVINCIA') &&
          (this.dataModalsCatalogo.countries == null)) {
          this.toastr.info("Seleccione país");
          document.getElementById("IdproductSendNg").focus();
        } else if ((this.tipoOrigin == 'CIUDAD') &&
          (this.dataModalsCatalogo.provinces == null)) {
          this.toastr.info("Seleccione una Provincia");
          document.getElementById("IdproductSendNg").focus();
        } else {
          this.confirmSave('Seguro desea crear el registro?', 'ADD_CATALOGO');
        }
      }, 1000);
    }
  }

  validaNameGlobal(value, type) {
    let data = {
      valor: value,
      type: type
    }
    this.ingresoSrv.getValidaNameGlobal(data).subscribe(res => {
      this.dataModalsCatalogo.valNameGlobal = false;
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.dataModalsCatalogo.valNameGlobal = true;
      this.toastr.info(error.error.message);
    })
  }

  /* Confirm CRUD's */
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
        if (action == "SET_SUPPLIERS") {
          this.setProveedor(this.supplier);
        } else if (action == "PATCH_SUPPLIERS") {
          this.patchProveedor(this.supplier);
        } else if (action == "DESTROY_SUPPLIERS") {
          this.destroyProveedor(this.supplier);
        } else if (action == "ADD_CATALOGO") {
          ($('#locationModal') as any).modal('hide');
          this.crearCatalogo();
        }
      }
    })
  }

  crearCatalogo() {
    let grupo;
    if (this.dataModalsCatalogo.provinces == null && this.dataModalsCatalogo.countries == null) {
      grupo = null;
    } else if (this.dataModalsCatalogo.countries != null) {
      grupo = this.dataModalsCatalogo.countries;
    } else if (this.dataModalsCatalogo.provinces != null) {
      grupo = this.dataModalsCatalogo.provinces;
    }
    let data = {
      ip: this.commonServices.getIpAddress(),
      accion: `Registro de valor ${this.dataModalsCatalogo.value} como nuevo catálogo`,
      id_controlador: myVarGlobals.fProveedores,
      tipo: this.tipoOrigin,
      group: grupo,
      descripcion: this.dataModalsCatalogo.description,
      valor: this.dataModalsCatalogo.value,
      estado: "A",
      id_empresa: this.commonServices.getDataUserLogued().id_empresa
    }

    this.ingresoSrv.saveRowCatalogo(data).subscribe(res => {
      this.toastr.success(res['message']);
      this.dataModalsCatalogo.description = null;
      this.dataModalsCatalogo.value = null;
      this.dataModalsCatalogo.provinces = null;
      this.dataModalsCatalogo.countries = null;
      this.province = false;
      this.city = false;

      this.catalog = {};
      this.fillCatalog();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "NUEVO":
        this.ActivateForm();
        break;
      case "BUSCAR":
        this.searchProviders();
        break;
      case "GUARDAR":
        this.saveProveedor();
        break;
      case "MODIFICAR":
        this.updateProveedor();
        break;
      case "CANCELAR":
        this.CancelForm();
        break;
      case "ELIMINAR":
        this.deleteProveedor();
        break;
    }
  }

  selectCountry(e) {
    if (e == 0 || e == 'Extranjero') {
      this.supplier.country = 0;
      this.supplier.city = 0;
      this.supplier.province = 0;
      this.catalog.city = undefined;
      this.catalog.province = undefined;
    } else {
      this.supplier.country = this.catalog.countries.filter(evt => evt.valor == "Ecuador")[0]['valor']
      this.searchProvinces(this.supplier.country);
    }
  }

  onChange() {
    this.lineaSendId = "";
    this.supplier.linea = this.myInputVariable['currentValue'][0];
    this.lineaSendId = this.myInputVariable['currentValue'][0];
  }

}
