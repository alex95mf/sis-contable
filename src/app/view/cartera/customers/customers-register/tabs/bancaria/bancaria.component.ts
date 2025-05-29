import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../../../services/commonServices';
import { CommonVarService } from '../../../../../../services/common-var.services';
import { CustomersRegisterService } from '../../customers-register.service';
import { IngresoService } from '../../../../../inventario/producto/ingreso/ingreso.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as myVarGlobals from '../../../../../../global';
declare const $: any;
@Component({
standalone: false,
	selector: 'app-bancaria',
	templateUrl: './bancaria.component.html',
	styleUrls: ['./bancaria.component.scss']
})
export class BancariaComponent implements OnInit {
	dataContact: any = {};
	storeConDel: any = [];
	editInfoContact: any = false;
	estadoBncario: any = false;
	positionUpdate: any;
	cuentaModify: any = [];
	cuentaDelete: any = [];
	arrayCliente: Array < any > = [];
	dataCatalogo: Array < any > = [];
	arraybancaria: Array < any > = [];
	validateSearch: any = false;
	action: any;
	dAction: any = false;
	newOrigin: any;
	tipoOrigin: any;
	valueLabel: any;
	dataUser: any;
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
  
  constructor(private modalService: NgbModal, private ingresoSrv: IngresoService,
    private toastr: ToastrService, private commonServices: CommonService,
    private customerServ: CustomersRegisterService, private cVsrv: CommonVarService) {
  
    this.commonServices.actionsSearchClient.asObservable().subscribe(res => {
      this.validateSearch = true;
      if (res.cuenta.length > 0) {
        this.dataContact.girado = res.razon_social;
        this.dataContact.nombreGirador = res.razon_social;
        this.dataContact.fk_catalogo = 0;
        this.dataContact.estado = "Solicitada";
        this.arraybancaria = res.cuenta;
        this.cuentaDelete = [];
        this.dAction = true;
      } else {
        this.dataContact.girado = res.razon_social;
        this.dataContact.nombreGirador = res.razon_social;
        this.dataContact.fk_catalogo = 0;
        this.dataContact.estado = "Solicitada";
        this.cuentaModify = [];
        this.arraybancaria = [];
        this.cuentaDelete = [];
      }
    })
    this.commonServices.actionsClient.asObservable().subscribe(res => {
      this.cuentaModify = []; //modifBancaria
      this.arraybancaria = [];
      this.cuentaDelete = []; //deleteBancaria
      this.validateSearch = false;
      if (res.new) {
        this.dAction = true;
      } else if (res.cancel) {
        this.dAction = false;
        this.cleanForm();
        this.arraybancaria = [];
      }
    })
  
    this.commonServices.cuentaClient.asObservable().subscribe(res => {
      if (this.validateSearch) {
        let data = {
          cuenta_modify: this.cuentaModify,
          cuenta_delete: this.cuentaDelete
        };
        this.commonServices.resCuentaClient.next(data);
      } else {
        let data = {
          cuenta_modify: this.arraybancaria,
          cuenta_delete: []
        }
        this.commonServices.resCuentaClient.next(data);
      }
    })
  
    this.commonServices.nameClient.asObservable().subscribe(res => {
      this.razonSocial = res
      this.dataContact.girado = this.razonSocial;
      this.dataContact.nombreGirador = this.razonSocial;
      this.dataContact.fk_catalogo = 0;
      this.dataContact.estado = 0;
    })
  }
  
  ngOnInit(): void {
    this.getCliente();
  }
  
  getCliente() {
    this.customerServ.getCliente().subscribe(res => {
      this.arrayCliente = res['data'];
      this.getCiudades();
    }, )
  }
  
  getCiudades() {
    let data = {
      tipo: "'BANCO'"
    }
    this.customerServ.getCiudades(data).subscribe(res => {
      this.dataCatalogo = res['data']['catalogos'];
    }, error => {
      this.toastr.info(error.error.message);
    })
  }
  
  cancelcatalogo() {
    this.dataModalsCatalogo = {};
  }
  
  /* Modal Catalogo*/
  setCatalogoTitle(d, type, data) {
    $('#locationModals').appendTo("body").modal('show');
    this.newOrigin = d; //titulo modal
    this.tipoOrigin = type; //tipo nif
    this.valueLabel = data; //nombre del input
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
        if (action == "ADD_CATALOGO") {
          ($('#locationModals') as any).modal('hide');
          this.crearCatalogo();
        }
      }
    })
  }
  
  crearCatalogo() {
    let data = {
      ip: this.commonServices.getIpAddress(),
      accion: `Registro de valor ${this.dataModalsCatalogo.value} como nuevo catálogo`,
      id_controlador: myVarGlobals.fCliente,
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
  
  /*Bancaria Datos*/
  
  async addContact() {
    if (this.validateSearch) {
      await this.validaGlobalData().then(respuesta => {
        if (respuesta) {
          (this.dataContact.cliente_girado == undefined || this.dataContact.cliente_girado == false) ? this.dataContact.cliente_girado = "0": this.dataContact.cliente_girado = "1";
          this.cuentaModify.push(this.dataContact);
          this.arraybancaria.push(this.dataContact);
          this.cleanForm();
          document.getElementById("idCliente").focus();
        }
      })
    } else {
      await this.validaGlobalData().then(respuesta => {
        if (respuesta) {
          (this.dataContact.cliente_girado == undefined || this.dataContact.cliente_girado == false) ? this.dataContact.cliente_girado = "0": this.dataContact.cliente_girado = "1";
          this.arraybancaria.push(this.dataContact);
          this.cleanForm();
          document.getElementById("idCliente").focus();
  
        }
      })
    }
  }
  
  cleanForm() {
    if (this.validateSearch) {
      this.estadoBncario = false;
      this.editInfoContact = false;
      this.dataContact = {
        girado: this.razonSocial,
        cliente_girado: false,
        fk_catalogo: 0,
        nombreGirador: this.razonSocial,
        cuenta_bancaria: undefined,
        entidad_bancaria: undefined,
        estado: 0
      };
  
    } else {
      this.editInfoContact = false;
      this.dataContact = {
        girado: this.razonSocial,
        cliente_girado: false,
        fk_catalogo: 0,
        nombreGirador: this.razonSocial,
        cuenta_bancaria: undefined,
        entidad_bancaria: undefined,
        estado: 0
      };
    }
  }
  
  setProducto(event) {
    if (this.dataContact.cliente_girado) {
      this.otroProducto = true;
      this.dataContact.cliente_girado = event;
      this.dataContact.girado = undefined;
      this.dataContact.nombreGirador = undefined;
    } else {
      this.otroProducto = false;
      this.dataContact.girado = this.razonSocial;
      this.dataContact.nombreGirador = this.razonSocial;
      this.dataContact.cliente_girado = event;
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
  
  changeOtro(evt) {
    if (this.dataContact.nombreGirador != undefined) {
      this.dataContact.girado = evt;
    }
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
  
  setBancaria(event) {
    let dataValor = this.dataCatalogo['BANCO'].find(e => e.id_catalogo == event);
    this.dataContact.entidad_bancaria = dataValor.valor
  }
  
  }