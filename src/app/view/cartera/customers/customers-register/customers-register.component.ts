import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router'
import 'sweetalert2/src/sweetalert2.scss';
import { ToastrService } from 'ngx-toastr';
import * as myVarGlobals from '../../../../global';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomersRegisterService } from './customers-register.service';
import { CommonService } from '../../../../services/commonServices';
import { IngresoService } from '../../../inventario/producto/ingreso/ingreso.service';
import { GlobalTableComponent } from '../../../commons/modals/global-table/global-table.component';
import { PreciosService } from '../../../inventario/producto/precios/precios.service';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { CommonVarService } from '../../../../services/common-var.services';
declare const $: any;
@Component({
standalone: false,
  selector: 'app-customers-register',
  templateUrl: './customers-register.component.html',
  styleUrls: ['./customers-register.component.scss']
})
export class CustomersRegisterComponent implements OnInit {
  
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
    credito: false,
    garantia_credito: false,
    cupo_credito: 0.00,
    valor_credito: 0.00,
    saldo_credito: 0.00,
    garantia_monto: 0.00,
    tipo_documento: 0,
    contribuyente: 0,
    tipo_contribuyente: 0,
    fk_asesor: 0,
    grupo: 0,
    clase: 0,
    linea: 0,
    origen: 0,
    pais: 0,
    provincia: 0,
    ciudad: 0,
    garantia_documento: 0
  };
  catalog: any = {};
  asesores: any = [];

  /* dictionaries */
  groups: Array<any> = [];
  vmButtons: any;
  emailExist: any;

  constructor(private toastr: ToastrService, private router: Router, private commonServices: CommonService,private commonVarServices: CommonVarService,
    private customersSrv: CustomersRegisterService, private ingresoSrv: IngresoService, private priceSrv: PreciosService, private modalService: NgbModal) {

      this.commonServices.resContactClient.asObservable().subscribe(res => {
      this.supplier.contact_delete = res.contact_delete;
      this.supplier.contact_modify = res.contact_modify;
    })

    this.commonServices.resAnexosClient.asObservable().subscribe(res => {
      this.supplier.anexos_delete = res.anexos_delete;
    })

    this.commonVarServices.updPerm.asObservable().subscribe(res => {
      (res) ? this.lcargando.ctlSpinner(true) : this.lcargando.ctlSpinner(false);
    })

    this.commonServices.actionsSearchClient.asObservable().subscribe(res => {
      this.supplier = res;
      console.log(res);
      this.docValidate(this.supplier.tipo_documento);

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
      this.vmButtons[4].habilitar = false;
      this.vmButtons[5].habilitar = false;

      var province = this.supplier.provincia;
      var city = this.supplier.ciudad;

      this.provinceSearch(this.supplier.pais);
      this.citieSearch(this.supplier.provincia);

      setTimeout(() => {
        this.supplier.provincia = province;
        this.province = true;

        this.supplier.ciudad = city;
        this.city = true;
      }, 500);

      this.commonServices.actionsClient.next(this.actions);
    })

    this.commonServices.resCuentaClient.asObservable().subscribe(res => {
      this.supplier.cuenta_modify = res.cuenta_modify;
      this.supplier.cuenta_delete = res.cuenta_delete;
    })
  }

  ngOnInit(): void {

    this.vmButtons = [
      { orig: "btnsCustomeRegister", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "NUEVO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false },
      { orig: "btnsCustomeRegister", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "BUSCAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: false },
      { orig: "btnsCustomeRegister", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: true },
      { orig: "btnsCustomeRegister", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: true },
      { orig: "btnsCustomeRegister", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: true },
      { orig: "btnsCustomeRegister", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "ELIMINAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-dark boton btn-sm", habilitar: true }
    ];
    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 50);

    this.validatePermission();
    this.getUsersAsesor();
  }

  validatePermission() {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));

    let params = {
      codigo: myVarGlobals.fCliente,
      id_rol: this.dataUser.id_rol
    }

    this.commonServices.getPermisionsGlobas(params).subscribe(res => {
      this.permissions = res["data"][0];
      if (this.permissions.ver == "0") {
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de Clientes");
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);
      } else {
        setTimeout(() => {
          this.fillCatalog();
        }, 500);
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  fillCatalog() {
    let data = {
      params: "'DOCUMENTO','PERSONA','CONTRIBUYENTE','ORIGEN','CLASE','PLAZO','PAIS','GARANTIAS','PROVINCIA', 'GRUPO CLIENTE'",
    };
    this.customersSrv.getCatalogs(data).subscribe(res => {
      this.catalog.documents = res["data"]["DOCUMENTO"];
      this.catalog.countries = res["data"]["PAIS"];
      this.catalog.persons = res["data"]["PERSONA"];
      /* this.catalog.contrib = res["data"]["CONTRIBUYENTE"]; */
      this.catalog.origin = res["data"]["ORIGEN"];
      this.catalog.class = res["data"]["CLASE"];
      this.catalog.time = res["data"]["PLAZO"];
      this.catalog.paises = res["data"]["PAIS"];
      this.catalog.provincias = res["data"]["PROVINCIA"];
      this.catalog.garantias = res["data"]["GARANTIAS"];
      this.catalog.grupos = res["data"]["GRUPO CLIENTE"];

      this.supplier.pais = 0;
      this.supplier.provincia = 0;
      this.supplier.ciudad = 0;

      this.getAgentRetencion();
    }, (error) => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  getAgentRetencion() {
    this.customersSrv.getAgentRetencion({}).subscribe(res => {
      this.catalog.contrib = res["data"]

      this.getGroupsProduct();
    }, (error) => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  getGroupsProduct() {
    this.ingresoSrv.getGrupos().subscribe(res => {
      this.catalog.linea = res["data"];
      this.getGroupsPrice();
    }, (error) => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  setClient(data) {
    if (this.permissions.guardar == "0") {
      this.toastr.info("Usuario no tiene Permiso para guardar de Cliente");
      this.router.navigateByUrl('dashboard');
    } else {
      this.lcargando.ctlSpinner(true);
      data.id_controlador = myVarGlobals.fCliente;
      data.accion = `Registro del cliente ${data.docnumber}`;
      data.ip = this.commonServices.getIpAddress();

      this.customersSrv.saveClient(data).subscribe(res => {
        this.lcargando.ctlSpinner(false);
        this.toastr.success(res["message"]);
        this.commonServices.saveClientes.next({ identifier: res['data']['id'] });
        this.CancelForm()
        setTimeout(() => {
          this.getAgentRetencion();
        }, 500);
      }, (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      });
    }
  }

  patchClient(data) {
    if (this.permissions.editar == "0") {
      this.toastr.info("Usuario no tiene Permiso para editar al cliente");
      this.router.navigateByUrl('dashboard');
    } else {
      this.lcargando.ctlSpinner(true);
      delete data['anexos'];
      delete data['contactos'];
      delete data['cuenta'];
      data.id_controlador = myVarGlobals.fCliente;
      data.accion = `Actualización del cliente ${data.id_cliente}`;
      data.ip = this.commonServices.getIpAddress();
      /* console.log(data); */
      this.customersSrv.updateClient(data).subscribe(res => {
        this.toastr.success(res["message"]);
        this.commonServices.saveClientes.next({ identifier: data.id_cliente });
        this.CancelForm()
        setTimeout(() => {
          this.getAgentRetencion();
        }, 500);
      }, (error) => {
        this.toastr.info(error.error.message);
      });
    }
  }

  destroyClient(data) {
    if (this.permissions.eliminar == "0") {
      this.toastr.info("Usuario no tiene Permiso para eliminar al cliente");
      this.router.navigateByUrl('dashboard');
    } else {
      data.id_controlador = myVarGlobals.fCliente;
      data.accion = `Borrado del cliente ${data.id_cliente}`;
      data.ip = this.commonServices.getIpAddress();

      this.customersSrv.deleteClient(data).subscribe(res => {
        this.toastr.success(res["message"]);
        this.CancelForm()
        setTimeout(() => {
          this.getAgentRetencion();
        }, 500);
      }, (error) => {
        this.toastr.info(error.error.message);
      });
    }
  }

  getUsersAsesor() {
    this.customersSrv.getAsesores({ profile: 5 }).subscribe(res => {
      this.asesores = res["data"];
    }, (error) => {
      this.toastr.info(error.error.message);
    });
  }

  getGroupsPrice() {
    this.priceSrv.getGroupPrices().subscribe(res => {
      this.groups = res['data'];
      this.lcargando.ctlSpinner(false);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message)
    })
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
    this.vmButtons[1].habilitar = true;
    this.vmButtons[2].habilitar = false;
    this.vmButtons[3].habilitar = true;
    this.vmButtons[4].habilitar = false;
    this.vmButtons[5].habilitar = true;

    this.supplier.provincia = 0;
    this.supplier.ciudad = 0

    this.province = false;
    this.city = false;

    this.commonServices.actionsClient.next(this.actions);
  }

  CancelForm() {
    this.actions.new = false;
    this.actions.search = false;
    this.actions.add = true;
    this.actions.edit = true;
    this.actions.cancel = true;
    this.actions.delete = true;

    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = true;
    this.vmButtons[3].habilitar = true;
    this.vmButtons[4].habilitar = true;
    this.vmButtons[5].habilitar = true;

    this.commonServices.actionsClient.next(this.actions);
    this.ClearForm();
  }

  ClearForm() {
    this.supplier = {
      credito: false, garantia_credito: false, cupo_credito: 0.00, valor_credito: 0.00, saldo_credito: 0.00, garantia_monto: 0.00,
      tipo_documento: 0,
      contribuyente: 0,
      tipo_contribuyente: 0,
      fk_asesor: 0,
      grupo: 0,
      clase: 0,
      linea: 0,
      origen: 0,
      pais: 0,
      provincia: 0,
      ciudad: 0,
      garantia_documento: 0
    };
  }

  clearSwitchCredit() {
    this.supplier.plazo_credito = "";
    this.supplier.cupo_credito = 0.00;
    this.supplier.valor_credito = 0.00;
    this.supplier.saldo_credito = 0.00;
  }

  clearSwitchGarant() {
    this.supplier.garantia_documento = 0;
    this.supplier.garantia_monto = 0.00;
  }

  calculateCredit() {
    setTimeout(() => {
      let balance = [this.supplier.cupo_credito, this.supplier.valor_credito].reduce((a, b) => {
        return a - b
      })
      this.supplier.saldo_credito = parseFloat(balance).toFixed(2);
    }, 500);
  }

  async saveClient() {
    await this.commonValidate(0).then(resp => {
      if (resp) {
        this.commonServices.contactClient.next(null);
        this.commonServices.cuentaClient.next(null);
        this.supplier.correo_facturacion == undefined ? null : this.supplier.correo_facturacion;
        this.confirmSave("Seguro desea guardar el cliente?", "SET_CLIENT");
      }
    })
  }

  async updateClient() {
    await this.commonValidate(1).then(resp => {
      if (resp) {
        this.commonServices.contactClient.next(null);
        this.commonServices.anexosClient.next(null);
        this.commonServices.cuentaClient.next(null);
        this.confirmSave("Seguro desea actualizar el cliente?", "PATCH_CLIENT");
      }
    });
  }

  deleteClient() {
    this.confirmSave("Seguro desea eliminar el cliente?", "DESTROY_CLIENT");
  }

  /* Validation Forms */
  commonValidate(action) {
    return new Promise((resolve, reject) => {
      this.validarEmailExist(this.supplier.correo_facturacion);
      if (this.supplier.tipo_documento == 0) {
        document.getElementById("tipo_documento").focus();
        this.toastr.info("Seleccione un documento");
      } else if (this.supplier.num_documento == undefined || this.supplier.num_documento == "") {
        document.getElementById("num_documento").focus();
        this.toastr.info("Ingrese un número de documento");
      } else if (this.supplier.contribuyente == 0) {
        document.getElementById("contribuyente").focus();
        this.toastr.info("Seleccione un contribuyente");
      } else if (this.supplier.tipo_contribuyente == 0) {
        document.getElementById("tipo_contribuyente").focus();
        this.toastr.info("Seleccione el tipo contribuyente");
      } else if (this.supplier.razon_social == undefined || this.supplier.razon_social == "") {
        document.getElementById("razon_social").focus();
        this.toastr.info("Ingrese una Razón Social");
      } else if (this.supplier.nombre_comercial_cli == undefined || this.supplier.nombre_comercial_cli == "") {
        document.getElementById("nombre_comercial_cli").focus();
        this.toastr.info("Ingrese un Nombre Comercial");
      } else if (this.supplier.representante_legal == undefined || this.supplier.representante_legal == "") {
        document.getElementById("representante_legal").focus();
        this.toastr.info("Ingrese un Representante Legal");
      } else if (this.supplier.direccion == undefined || this.supplier.direccion == "") {
        document.getElementById("direccion").focus();
        this.toastr.info("Ingrese una dirección");
      } else if (this.supplier.grupo == 0) {
        document.getElementById("grupo").focus();
        this.toastr.info("Seleccione un grupo");
      } else if (this.supplier.clase == 0) {
        document.getElementById("clase").focus();
        this.toastr.info("Seleccione una clase");
      } else if (this.supplier.linea == 0) {
        document.getElementById("linea").focus();
        this.toastr.info("Seleccione una linea");
      } else if (this.supplier.telefono == undefined || this.supplier.telefono == "") {
        document.getElementById("telefono").focus();
        this.toastr.info("Ingrese un teléfono");
      } else if (this.supplier.origen == 0) {
        document.getElementById("origen").focus();
        this.toastr.info("Seleccione un origen");
      } else if (this.supplier.pais == 0 || this.supplier.pais == "") {
        document.getElementById("pais").focus();
        this.toastr.info("Seleccione un país");
      } else if (this.supplier.provincia == 0 || this.supplier.provincia == "") {
        document.getElementById("provincia").focus();
        this.toastr.info("Seleccione una provincia");
      } else if (this.supplier.ciudad == 0 || this.supplier.ciudad == "") {
        document.getElementById("ciudad").focus();
        this.toastr.info("Seleccione una ciudad");
      } else if (!this.validateCredit()) {

      } else if (this.emailExist == true) {
        this.toastr.info("Correo ya existe !!");
        document.getElementById("Idemail").focus();
      } else {
        if (action === 0) {
          this.lcargando.ctlSpinner(true);
          this.customersSrv.validateDoc({ cedula: this.supplier.num_documento }).subscribe(res => {
            this.lcargando.ctlSpinner(false);
            if (res['data'].length > 0) {
              this.toastr.info(`La información ${this.supplier.num_documento} ya se encuentra registrada.`);
              document.getElementById("num_documento").focus();
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

  validateCredit(): boolean {
    if (this.supplier.credito) {
      if (this.supplier.plazo_credito == "") {
        document.getElementById("plazo_credito").focus();
        this.toastr.info("Ingrese una cantidad de facturas");
        return false;
      } else if (this.supplier.cupo_credito == null) {
        document.getElementById("cupo_credito").focus();
        this.toastr.info("Ingrese un cupo de crédito");
        return false;
      }
    } if (this.supplier.garantia_credito) {
      if (this.supplier.garantia_documento == 0) {
        document.getElementById("garantia_documento").focus();
        this.toastr.info("Seleccione un documento de garanía");
        return false;
      } else if (this.supplier.garantia_monto == null) {
        document.getElementById("garantia_monto").focus();
        this.toastr.info("Ingrese un monto de garantía");
        return false;
      }
    }
    return true;
  }

  searchCustomer() {
    const modalInvoice = this.modalService.open(GlobalTableComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content' });
    modalInvoice.componentInstance.title = "CLIENTES";
    modalInvoice.componentInstance.module = this.permissions.id_modulo;
    modalInvoice.componentInstance.component = myVarGlobals.fCliente;
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
    document.getElementById("num_documento").focus();
    if (event == "Cedula") {
      this.tamDoc = 10;
    } else if (event == "Ruc") {
      this.tamDoc = 13;
    } else if (event == "Pasaporte") {
      this.tamDoc = 12;
    }
  }

  searchProvinces(event) {
    this.customersSrv.filterProvinceCity({ grupo: event }).subscribe(res => {
      this.catalog.province = res['data'];

      this.province = true;
      this.city = false;
      setTimeout(() => {
        this.supplier.provincia = undefined;
        this.catalog.city = undefined;
        this.supplier.ciudad = undefined;
      }, 500);
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  searchCities(event) {
    this.customersSrv.filterProvinceCity({ grupo: event }).subscribe(res => {
      this.catalog.city = res['data'];

      this.city = true;
      setTimeout(() => {
        this.supplier.ciudad = undefined;
      }, 500);
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  provinceSearch(event) {
    this.customersSrv.filterProvinceCity({ grupo: event }).subscribe(res => {
      this.catalog.province = res['data'];
      this.province = true;
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  citieSearch(event) {
    this.customersSrv.filterProvinceCity({ grupo: event }).subscribe(res => {
      this.catalog.city = res['data'];
      this.city = true;
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  /* Modals */
  setCatalogoTitle(d, type, data) {
    $('#locationModal').appendTo("body").modal('show');
    this.newOrigin = d;   //titulo modal
    this.tipoOrigin = type;  //tipo nif
    this.valueLabel = data; //nombre del input
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
        if (action == "SET_CLIENT") {
          this.setClient(this.supplier);
        } else if (action == "PATCH_CLIENT") {
          this.patchClient(this.supplier);
        } else if (action == "DESTROY_CLIENT") {
          this.destroyClient(this.supplier);
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
      id_controlador: myVarGlobals.fCliente,
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
      this.toastr.info(error.error.message);
    })
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "NUEVO":
        this.ActivateForm();
        break;
      case "BUSCAR":
        this.searchCustomer();
        break;
      case "GUARDAR":
        this.saveClient();
        break;
      case "MODIFICAR":
        this.updateClient();
        break;
      case "CANCELAR":
        this.CancelForm();
        break;
      case "ELIMINAR":
        this.deleteClient();
        break;
    }
  }

  accountBill() {
    this.supplier.plazo_credito = Math.round(this.supplier.plazo_credito);
  }

  validarEmail(valor) {
    if (/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(valor)) {
      return true;
    } else {
      return false;
    }
  }

  validarEmailExist(email) {
    this.emailExist = false;
    let data = {
      email: email
    }
    this.customersSrv.validateEmailClientes(data).subscribe(res => {
      if (res['data'].length == 0) {
        this.emailExist = false;
      } else {
        this.emailExist = true;
      }
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  setRazonSocial(evt){
    this.commonServices.nameClient.next(evt);
  }

}
