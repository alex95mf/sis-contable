import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CobranzaService } from '../cobranza.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { CustomersRegisterService } from '../../../customers/customers-register/customers-register.service';
import { IngresoService } from 'src/app/view/inventario/producto/ingreso/ingreso.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
declare const $: any;
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';

@Component({
standalone: false,
  selector: 'app-cuenta-cliente',
  templateUrl: './cuenta-cliente.component.html',
  styleUrls: ['./cuenta-cliente.component.scss']
})
export class CuentaClienteComponent implements OnInit {
  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  @Input() customer: any;
  @Input() id_controlador: any;
  @Input() agregar: any;
  vmButtons
  dataUser: any;

  dataContact: any = {};
  storeConDel: any = [];
  editInfoContact: any = false;
  estadoBncario: any = false;
  positionUpdate: any;
  cuentaModify: any = [];
  cuentaDelete: any = [];
  arrayCliente: Array<any> = [];
  dataCatalogo: Array<any> = [];
  arraybancaria: Array<any> = [];
  validateSearch: any = false;
  action: any;
  dAction: any = false;
  newOrigin: any;
  tipoOrigin: any;
  valueLabel: any;
  permissions: any;
  dataModalsCatalogo: any = {
    value: null,
    description: null
  };
  otroProducto: any = false;
  datact: any = "CTA #";
  razonSocial: any;
  validaBancaria: any;
  disestado: any = true;
  arrayStatus: any = [{
    estado: "Solicitada"
  },
  {
    estado: "Aprobada"
  },
  {
    estado: "Anulado"
  },
  ];

  constructor(public activeModal: NgbActiveModal,
    private crbSrv: CobranzaService,
    private ingresoSrv: IngresoService,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private customerServ: CustomersRegisterService,
    private cVsrv: CommonVarService) {

  }

  ngOnInit(): void {
    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 50);
    this.vmButtons = [
      { orig: "btnAccCustomer", paramAccion: "", boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false },
      { orig: "btnAccCustomer", paramAccion: "", boton: { icon: "far fa-save", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false }
    ];
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.dataContact.estado = "Solicitada";

    this.getCliente();
  }

  getCliente() {
    this.crbSrv.getCliente().subscribe(res => {
      this.arrayCliente = res['data'];
      this.getCiudades();
    })
  }

  getCiudades() {
    let data = {
      tipo: "'BANCO'"
    }
    this.crbSrv.getCiudades(data).subscribe(res => {
      this.dataCatalogo = res['data']['catalogos'];
      this.setCustomer();
    })
  }

  setCustomer() {
    this.validateSearch = true;
    this.dataContact.girado = this.customer.razon_social;
    this.dataContact.nombreGirador = this.customer.razon_social;
    this.dataContact.fk_catalogo = 0;
    /* this.dataContact.estado = 0; */
    this.cuentaModify = [];
    this.arraybancaria = [];
    this.cuentaDelete = [];
    this.lcargando.ctlSpinner(false);
  }

  cancelcatalogo() {
    this.dataModalsCatalogo = {};
  }

  vaidateSaveCatalogo() {

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
      } else if ((this.tipoOrigin == 'BANCO') &&
        (this.dataModalsCatalogo.value == null)) {
        this.toastr.info("Seleccione Banco");
        document.getElementById("IdValorCatalogo").focus();
      } else {
        this.confirmSave('Seguro desea crear el registro?', 'ADD_CATALOGO');
      }
    }, 1000);
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
          ($('#locationModals') as any).modal('hide');
          this.crearCatalogo();
        }
      }
    })
  }

  crearCatalogo() {
    this.lcargando.ctlSpinner(true);
    let data = {
      ip: this.commonServices.getIpAddress(),
      accion: `Registro de valor ${this.dataModalsCatalogo.value} como nuevo catálogo`,
      id_controlador: this.id_controlador,
      tipo: this.tipoOrigin,
      group: null,
      descripcion: this.dataModalsCatalogo.description,
      valor: this.dataModalsCatalogo.value,
      estado: "A",
      id_empresa: this.commonServices.getDataUserLogued().id_empresa
    }
    this.ingresoSrv.saveRowCatalogo(data).subscribe(res => {
      this.toastr.success(res['message']);
      this.dataModalsCatalogo.description = null;
      this.dataModalsCatalogo.value = null;
      this.dataCatalogo = [];
      this.getCiudades();
      ($('#locationModals') as any).modal('hide');
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  deleteContact(item, pos) {
    if (this.validateSearch) {
      this.editInfoContact = false;
      this.cuentaDelete.push(item);
      this.arraybancaria.splice(pos, 1);
    } else {
      this.editInfoContact = false;
      this.arraybancaria.splice(pos, 1);
    }
  }

  editContact(dt, pos) {
    if (this.validateSearch) {
      this.estadoBncario = true;
      this.positionUpdate = pos;
      this.editInfoContact = true;
      this.dataContact = dt;
      this.dataContact.nombreGirador = dt.girado;
      this.cuentaModify.push(this.dataContact);
    } else {
      this.estadoBncario = false;
      this.positionUpdate = pos;
      this.editInfoContact = true;
      this.dataContact = dt;
    }
  }

  async addContact() {
    let customer_acc = {};
    if (this.validateSearch) {
      await this.validaGlobalData().then(respuesta => {
        if (respuesta) {
          (this.dataContact.cliente_girado == undefined || this.dataContact.cliente_girado == false) ? this.dataContact.cliente_girado = "0" : this.dataContact.cliente_girado = "1";
          customer_acc['cliente_girado'] = this.dataContact['cliente_girado'];
          customer_acc['cuenta_bancaria'] = this.dataContact['cuenta_bancaria'];
          customer_acc['entidad_bancaria'] = this.dataContact['entidad_bancaria'];
          customer_acc['estado'] = this.dataContact['estado'];
          customer_acc['fk_catalogo'] = this.dataContact['fk_catalogo'];
          customer_acc['girado'] = this.dataContact['girado'];
          customer_acc['nombreGirador'] = this.dataContact['nombreGirador'];
          customer_acc['fk_cliente'] = this.customer.id_cliente;

          this.cuentaModify.push(customer_acc);
          this.arraybancaria.push(customer_acc);

          this.dataContact.fk_catalogo = 0;
          this.dataContact.cuenta_bancaria = "";
          /* this.cleanForm(); */
          document.getElementById("idCliente").focus();
        }
      })
    } else {
      await this.validaGlobalData().then(respuesta => {
        if (respuesta) {
          (this.dataContact.cliente_girado == undefined || this.dataContact.cliente_girado == false) ? this.dataContact.cliente_girado = "0" : this.dataContact.cliente_girado = "1";

          customer_acc['cliente_girado'] = this.dataContact['cliente_girado'];
          customer_acc['cuenta_bancaria'] = this.dataContact['cuenta_bancaria'];
          customer_acc['entidad_bancaria'] = this.dataContact['entidad_bancaria'];
          customer_acc['estado'] = this.dataContact['estado'];
          customer_acc['fk_catalogo'] = this.dataContact['fk_catalogo'];
          customer_acc['girado'] = this.dataContact['girado'];
          customer_acc['nombreGirador'] = this.dataContact['nombreGirador'];
          customer_acc['fk_cliente'] = this.customer.id_cliente;

          this.arraybancaria.push(customer_acc);

          this.dataContact.fk_catalogo = 0;
          this.dataContact.cuenta_bancaria = "";

          /* this.cleanForm(); */
          document.getElementById("idCliente").focus();

        }
      })
    }
  }

  updateContact() {
    this.arraybancaria[this.positionUpdate]['girado'] = this.dataContact.girado;
    this.arraybancaria[this.positionUpdate]['cliente_girado'] = this.dataContact.cliente_girado;
    this.arraybancaria[this.positionUpdate]['nombreGirador'] = this.dataContact.nombreGirador;
    this.arraybancaria[this.positionUpdate]['fk_catalogo'] = this.dataContact.fk_catalogo;
    this.arraybancaria[this.positionUpdate]['entidad_bancaria'] = this.dataContact.entidad_bancaria;
    this.arraybancaria[this.positionUpdate]['cuenta_bancaria'] = this.dataContact.cuenta_bancaria;
    this.arraybancaria[this.positionUpdate]['estado'] = this.dataContact.estado;
    this.cleanForm();
  }

  cleanForm() {
    if (this.validateSearch) {
      this.estadoBncario = false;
      this.editInfoContact = false;
      this.dataContact.fk_catalogo = 0;
      this.dataContact.cuenta_bancaria = "";
      /* this.dataContact = {
        girado: this.razonSocial,
        cliente_girado: false,
        fk_catalogo: 0,
        cuenta_bancaria: "",
        nombreGirador: this.razonSocial,
        entidad_bancaria: undefined,
        estado: 0
      }; */

    } else {
      this.editInfoContact = false;
      this.dataContact.fk_catalogo = 0;
      this.dataContact.cuenta_bancaria = "";
      /* this.dataContact = {
        girado: this.razonSocial,
        cliente_girado: false,
        fk_catalogo: 0,
        cuenta_bancaria: "",
        nombreGirador: this.razonSocial,
        entidad_bancaria: undefined,
        estado: 0
      }; */
    }
  }

  validaGlobalData() {
    return new Promise((resolve, reject) => {
      if (this.dataContact.girado == "" || this.dataContact.girado == undefined) {
        document.getElementById("idCliente").focus();
        this.toastr.info("ingrese un Nombre Girador");
      } else if (this.dataContact.cliente_girado == true && (this.dataContact.cliente_girado == undefined || this.dataContact.nombreGirador == "")) {
        document.getElementById("idNgirador").focus();
        this.toastr.info("ingrese un Nombre Girador");
      } else if (this.dataContact.fk_catalogo == 0) {
        document.getElementById("identidadBnco").focus();
        this.toastr.info("Seleccione entiDad bancaria");
      } else if (this.dataContact.cuenta_bancaria == "" || this.dataContact.cuenta_bancaria == undefined) {
        document.getElementById("idCuenta").focus();
        this.toastr.info("ingrese número de cuenta");
      } else if (this.dataContact.estado == 0) {
        document.getElementById("idestado").focus();
        this.toastr.info("ingrese número de cuenta");
      } else {
        resolve(true);
      }
    });
  }

  setBancaria(event) {
    if (event != 0) {
      let dataValor = this.dataCatalogo['BANCO'].find(e => e.id_catalogo == event);
      this.dataContact.entidad_bancaria = dataValor.valor
    }
  }

  setCatalogoTitle(d, type, data) {
    $('#locationModals').appendTo("body").modal('show');
    this.newOrigin = d; //titulo modal
    this.tipoOrigin = type; //tipo nif
    this.valueLabel = data; //nombre del input
  }

  changeOtro(evt) {
    if (this.dataContact.nombreGirador != undefined) {
      this.dataContact.girado = evt;
    }
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "REGRESAR":
        this.closeModal();
        break;
      case "GUARDAR":
        this.saveAccountCustomer();
        break;
    }
  }

  closeModal() {
    this.activeModal.dismiss();
  }

  saveAccountCustomer() {
    if (this.agregar == "0") {
      this.toastr.info("Usuario no tiene permiso para agregar");
    } else {
      if (this.arraybancaria.length == 0) {
        this.toastr.info("Debe agregar al menos una cuenta");
      } else {

        let data = {
          ip: this.commonServices.getIpAddress(),
          accion: `Ingreso de nueva cuenta bancaria al cliente ${this.customer.razon_social}`,
          id_controlador: this.id_controlador,
          infoAcc: this.arraybancaria
        }
        Swal.fire({
          title: "Atención!!",
          text: "Seguro desea agregar la cuenta?",
          icon: 'warning',
          showCancelButton: true,
          cancelButtonColor: '#DC3545',
          confirmButtonColor: '#13A1EA',
          confirmButtonText: "Aceptar"
        }).then((result) => {
          if (result.value) {
            this.lcargando.ctlSpinner(true);
            this.crbSrv.saveAccCustomer(data).subscribe(res => {
              this.toastr.success(res['message']);
              this.lcargando.ctlSpinner(false);
              this.closeModal();
            })
          }
        })
      }
    }
  }

}
