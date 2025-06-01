import { Component, OnInit, ViewChild } from '@angular/core';
import * as myVarGlobals from '../../../../global';
import { CommonService } from '../../../../../app/services/commonServices';
import { CommonVarService } from '../../../../../app/services/common-var.services';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShowCuentasComponent } from './show-cuentas/show-cuentas.component';
import { EgresoService } from './egreso.service';
import 'sweetalert2/src/sweetalert2.scss';
const Swal = require('sweetalert2');
import * as moment from 'moment';
import { ShowComprobantesComponent } from './show-comprobantes/show-comprobantes.component';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component'
import { ReportComprobantesComponent } from './report-comprobantes/report-comprobantes.component';
import { ConfirmationDialogService } from '../../../../config/custom/confirmation-dialog/confirmation-dialog.service';
declare const $: any;
@Component({
standalone: false,
  selector: 'app-egreso',
  templateUrl: './egreso.component.html',
  styleUrls: ['./egreso.component.scss']
})
export class EgresoComponent implements OnInit {
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  /*  processing: any = false; */
  dataUser: any;
  empresLogo: any;
  permisions: any;
  compEgre: any = {};
  hoy: Date = new Date();
  hoySet: any;
  cuentas: any = [{ codigo_cta: "Código", nombre_cta: "Nombre cuenta", debe: parseFloat('0.00').toFixed(4), haber: parseFloat('0.00').toFixed(4) },
  { codigo_cta: "Código", nombre_cta: "Nombre cuenta", debe: parseFloat('0.00').toFixed(4), haber: parseFloat('0.00').toFixed(4) }];
  suma: any = { debe: parseFloat('0.00').toFixed(4), haber: parseFloat('0.00').toFixed(4) };
  position: any;
  newOrigin: any;
  tipoOrigin: any;
  valueLabel: any;
  provincias: any;
  provincesSelect: any;
  valueCiudad: any;
  desCiudad: any;
  valNameGlobal: any = false;
  city: any;
  provincia: any = "Guayas";
  forma_pago: any = [];
  compbt: any = { ciudad: "Guayaquil", metodo_pago: 0, fecha_emision: new Date, fecha_post: new Date, typ_acc: 0, fk_centro_costo: 0, num_doc_adq: 0 };
  btnSave: any = false;
  btnMov: any = false;
  type_payments: any;
  foma_pago_update: any;
  bank_update: any;
  nx_tr_update: any;
  fr_pago_updt: any;
  dsbGlobal: any = false;
  arrayCentroCosto: any;
  dataSucursal: any;
  dsPrint: any = false;
  cuentasAux: any = [];
  processingtwo: any = false;
  ctr: any = 0;
  arrayBanck: any = [];
  vmButtons: any;
  flag = false;
  contador = 0;
  c = 0;
  ccc = 0;

  constructor(private toastr: ToastrService,
    private commonServices: CommonService,
    private router: Router,
    private modalService: NgbModal,
    private commonVarSrvice: CommonVarService,
    private egsSrv: EgresoService,
    private confirmationDialogService: ConfirmationDialogService) {

    this.commonVarSrvice.updPerm.asObservable().subscribe(res => {
      (res) ? this.lcargando.ctlSpinner(true) : this.lcargando.ctlSpinner(false);
    })

    this.commonVarSrvice.setAccountComprobantes.asObservable().subscribe(res => {
      this.ctr += 1;
      if (this.ctr == 1) {
        this.cuentas[this.position]['codigo_cta'] = res['codigo'];
        this.cuentas[this.position]['nombre_cta'] = res['nombre'];
      }
    });

    this.commonVarSrvice.setVaucheresEgress.asObservable().subscribe(res => {
      this.compbt.typ_acc = 0;
      let data = {
        type: res['metodo_pago']
      }
      this.lcargando.ctlSpinner(true);
      this.egsSrv.getAvailableMoney(data).subscribe(response => {
        this.dsbGlobal = (res['isModule'] == 1) ? true : false;
        if (this.dsbGlobal) {
          Swal.fire({
            title: 'Atención!!',
            text: "Este comprobante solo puede ser visualizado mas no editado!!",
            icon: 'error',
            confirmButtonColor: '#d33',
            confirmButtonText: 'Ok'
          }).then((result) => {
            this.dsPrint = true;
            this.vmButtons[0].habilitar = true;
            this.vmButtons[1].habilitar = true;
            this.vmButtons[2].habilitar = false;
          })
        } else {
          this.vmButtons[0].habilitar = true;
          this.vmButtons[1].habilitar = false;
          this.vmButtons[2].habilitar = false;
        }

        this.dsPrint = true;
        this.btnMov = true;
        this.btnSave = true;
        this.bank_update = res['fk_cta_affected']
        this.nx_tr_update = res['num_tx'];
        this.fr_pago_updt = res['metodo_pago'];
        this.type_payments = response['data'];
        this.compbt = res;
        this.valueNDV = this.commonServices.formatNumber(res['valor']);
        this.compbt.typ_acc = res['fk_cta_affected'];
        this.cuentas = res['detalle'];
        this.suma.debe = parseFloat(res['valor']).toFixed(4);
        this.suma.haber = parseFloat(res['valor']).toFixed(4);
        if (res['detalle_bank'].length > 0) {
          this.selectAccountBanck(res['detalle_bank'][0]['id_banks']);
        } else {
          this.compbt.typ_acc = 0;
        }
        this.lcargando.ctlSpinner(false);
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      });
    })
  }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsCmpEgreso", paramAccion: "1", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnsCmpEgreso", paramAccion: "1", boton: { icon: "fa fa-pencil-square-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: true },
      { orig: "btnsCmpEgreso", paramAccion: "1", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: true, printSection: "print-section", imprimir: true },
      { orig: "btnsCmpEgreso", paramAccion: "1", boton: { icon: "fas fa-file-alt", texto: "COMPROBANTES" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: false },
      { orig: "btnsCmpEgreso", paramAccion: "1", boton: { icon: "far fa-file-alt", texto: "REPORTE" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-dark boton btn-sm", habilitar: false },
      { orig: "btnsCmpEgreso", paramAccion: "1", boton: { icon: "far fa-window-close", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false },

      { orig: "btnsCiudCmpEg", paramAccion: "2", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnsCiudCmpEg", paramAccion: "2", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];
    setTimeout(() => {
      this.getPermisions();
    }, 10);
  }

  cancelcatalogo() {
    this.valueCiudad = "";
    this.desCiudad = "";
    ($("#locationModal") as any).modal("hide");
  }

  getPermisions() {
    this.lcargando.ctlSpinner(true);
    this.hoySet = moment(this.hoy).format('YYYY-MM-DD');
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.empresLogo = this.dataUser.logoEmpresa;
    let id_rol = this.dataUser.id_rol;
    let data = {
      codigo: myVarGlobals.fComprobanteEgreso,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'][0];
      if (this.permisions.ver == "0") {
        this.toastr.info("Usuario no tiene Permiso para ver el formulario comprobante de egresos");
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);
      } else {
        this.fillCatalog();
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  fillCatalog() {
    let data = {
      params: "'PROVINCIA'",
    };
    this.egsSrv.getCatalogs(data).subscribe(res => {
      this.provincias = res["data"]["PROVINCIA"];
      this.searchCities(this.provincia);
    }, (error) => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  searchCities(event) {
    this.egsSrv.filterProvinceCity({ grupo: event }).subscribe(res => {
      this.city = res['data'];
      this.getCatalogos();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getCatalogos() {
    let data = { fields: ["FORMA PAGO PROVEEDOR"] };
    this.egsSrv.getCommonInformationFormule(data).subscribe(res => {
      this.forma_pago = res['data']['catalogs'];
      let fpAux = [];
      this.forma_pago['FORMA PAGO PROVEEDOR'].forEach(element => {
        if (element['valor'] == "Efectivo" ||
          element['valor'] == "Cheque" ||
          element['valor'] == "Transferencia" ||
          element['valor'] == "Tarjeta Crédito" ||
          element['valor'] == "Tarjeta Débito") {
          fpAux.push(element);
        }
      });
      this.forma_pago['FORMA PAGO PROVEEDOR'] = fpAux;
      this.getCentroCosto();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getCentroCosto() {
    this.egsSrv.getCentroCosto().subscribe(res => {
      this.arrayCentroCosto = res['data'];
      this.getSucursal();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getSucursal() {
    this.egsSrv.getSucursales().subscribe(res => {
      this.dataSucursal = res['data'].filter(e => e.id_sucursal == this.dataUser.id_sucursal)[0];
      this.getNotasDebito();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }


  showAccounts(i) {
    this.ctr = 0;
    this.position = i;
    const modalInvoice = this.modalService.open(ShowCuentasComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' });
  }

  addAccounts() {
    this.cuentas.push({ codigo_cta: "Código", nombre_cta: "Nombre cuenta", debe: parseFloat('0.00').toFixed(2), haber: parseFloat('0.00').toFixed(2) });
  }

  deleteAccount(index) {
    if (this.permisions.eliminar == "0") {
      this.toastr.info("Usuario no tiene permiso para eliminar");
    } else {
      if (!this.btnMov) {
        this.suma.debe = 0.00;
        this.suma.haber = 0.00;
        this.cuentas.splice(index, 1);

        this.cuentas.forEach(element => {
          this.suma.debe = parseFloat(this.suma.debe) + parseFloat(element.debe);
          this.suma.haber = parseFloat(this.suma.haber) + parseFloat(element.haber);
        });

        this.suma.debe = parseFloat(this.suma.debe).toFixed(4);
        this.suma.haber = parseFloat(this.suma.haber).toFixed(4);
      } else {
        /* cuentasAux */
        let acc = this.cuentas[index]['id'];
        this.cuentasAux.push(acc);
        this.suma.debe = 0.00;
        this.suma.haber = 0.00;
        this.cuentas.splice(index, 1);

        this.cuentas.forEach(element => {
          this.suma.debe = parseFloat(this.suma.debe) + parseFloat(element.debe);
          this.suma.haber = parseFloat(this.suma.haber) + parseFloat(element.haber);
        });

        this.suma.debe = parseFloat(this.suma.debe).toFixed(4);
        this.suma.haber = parseFloat(this.suma.haber).toFixed(4);
      }
    }
  }

  sumaDH() {
    this.suma.debe = 0.00;
    this.suma.haber = 0.00;

    this.cuentas.forEach(element => {
      this.suma.debe = Number.isNaN(parseFloat(this.suma.debe) + parseFloat(element.debe)) ? 0.00 : parseFloat(this.suma.debe) + parseFloat(element.debe);
      this.suma.haber = Number.isNaN(parseFloat(this.suma.haber) + parseFloat(element.haber)) ? 0.00 : parseFloat(this.suma.haber) + parseFloat(element.haber);
    });

    this.suma.debe = parseFloat(this.suma.debe).toFixed(4);
    this.suma.haber = parseFloat(this.suma.haber).toFixed(4);
  }

  setCatalogoTitle(d, type, data) {
    $('#locationModal').appendTo("body").modal('show');
    this.newOrigin = d;
    this.tipoOrigin = type;
    this.valueLabel = data;
  }



  vaidateSaveCatalogo() {
    if (this.permisions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      if (this.valueCiudad == null) {
        this.toastr.info("Ingrese un valor");
        document.getElementById("IdValorCatalogo").focus(); return;
      } else {
        let data = {
          valor: this.valueCiudad,
          type: this.tipoOrigin
        }
        this.egsSrv.getValidaNameGlobal(data).subscribe(res => {
          if (this.valNameGlobal) {
            document.getElementById("IdValorCatalogo").focus();
          } else if ((this.tipoOrigin == 'CIUDAD') &&
            (this.provincesSelect == null)) {
            this.toastr.info("Seleccione una Provincia");
            document.getElementById("IdproductSendNg").focus();
          } else {
            this.confirmSave('Seguro desea crear el registro?', 'ADD_CATALOGO');
          }
        }, error => {
          this.toastr.info(error.error.message);
        })
      }
    }
  }



  async confirmSave(message, action) {
    Swal.fire({
      title: "Atención!!",
      text: message,
      type: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#DC3545',
      confirmButtonColor: '#13A1EA',
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.value) {
        if (action == "ADD_CATALOGO") {
          ($('#locationModal') as any).modal('hide');
          this.crearCatalogo();
        } else if (action == "SAVE_COMPROBANTE") {
          this.save();
        } else if (action == "UPDATE_COMPROBANTE") {
          this.update();
        }
      }
    })
  }

  crearCatalogo() {
    let grupo;
    if (this.provincesSelect == null) {
      grupo = null;
    } else if (this.provincesSelect != null) {
      grupo = this.provincesSelect;
    }
    let data = {
      ip: this.commonServices.getIpAddress(),
      accion: `Registro de valor ${this.valueCiudad} como nuevo catálogo`,
      id_controlador: myVarGlobals.fComprobanteEgreso,
      tipo: this.tipoOrigin,
      group: grupo,
      descripcion: this.desCiudad,
      valor: this.valueCiudad,
      estado: "A",
      id_empresa: this.commonServices.getDataUserLogued().id_empresa
    }

    this.egsSrv.saveRowCatalogo(data).subscribe(res => {
      this.toastr.success(res['message']);
      this.desCiudad = null;
      this.valueCiudad = null;
      this.provincesSelect = null;
      this.fillCatalog();
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  validaNameGlobal(value, type) {
    let data = {
      valor: value,
      type: type
    }
    this.egsSrv.getValidaNameGlobal(data).subscribe(res => {
      this.valNameGlobal = false;
    }, error => {
      this.valNameGlobal = true;
      this.toastr.info(error.error.message);
    })
  }

  validateForPag(evt) {
    this.arrayBanck = [];
    this.compbt.typ_acc = 0;
    if (this.compbt.metodo_pago == 0 || this.compbt.metodo_pago == 'Efectivo') {
      this.compbt.num_tx = "";
      this.compbt.num_doc_adq = 0;
      this.compbt.tipo_doc_adq = 0;
    } else if (this.compbt.metodo_pago == "NDC-C") {
      this.compbt.tipo_doc_adq = 23;
      this.compbt.num_tx = "";
      this.compbt.name_bank = "";
    } else {
      this.lcargando.ctlSpinner(true);
      let data = {
        type: evt
      }
      this.egsSrv.getAvailableMoney(data).subscribe(response => {
        this.type_payments = response['data'];
        this.lcargando.ctlSpinner(false);
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      });
      this.compbt.num_tx = "";
      this.compbt.num_doc_adq = 0;
      this.compbt.tipo_doc_adq = 0;
      this.compbt.name_bank = "";
    }
  }

  cancel() {
    this.compbt = { ciudad: "Guayaquil", metodo_pago: 0, fecha_emision: new Date, fecha_post: new Date, typ_acc: 0, fk_centro_costo: 0, num_doc_adq: 0 };
    this.cuentas = [{ codigo_cta: "Código", nombre_cta: "Nombre cuenta", debe: parseFloat('0.00').toFixed(4), haber: parseFloat('0.00').toFixed(4) },
    { codigo_cta: "Código", nombre_cta: "Nombre cuenta", debe: parseFloat('0.00').toFixed(4), haber: parseFloat('0.00').toFixed(4) }];
    this.suma = { debe: parseFloat('0.00').toFixed(4), haber: parseFloat('0.00').toFixed(4) };
    this.btnMov = false;
    this.btnSave = false;
    this.dsPrint = false;
    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = true;
    this.vmButtons[2].habilitar = true;
    this.cuentasAux = [];
    this.getSucursal();
  }

  async validateSaveComprobate() {
    if (this.permisions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      let resp = await this.validateDataGlobal().then(respuesta => {
        if (respuesta) {
          this.confirmSave("Seguro desea guardar el comprobante de egreso?", "SAVE_COMPROBANTE");
        }
      })
    }
  }

  async validateUpdateComprobante() {
    if (this.permisions.editar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      let resp = await this.validateDataGlobal().then(respuesta => {
        if (respuesta) {
          this.confirmSave("Seguro desea actualizar el comprobante de egreso?", "UPDATE_COMPROBANTE");
        }
      })
    }
  }

  validateDataGlobal() {
    return new Promise((resolve, reject) => {
      if (this.compbt.metodo_pago == 0) {
        this.toastr.info("Seleccione un forma de pago");
      } else if (this.compbt.metodo_pago == "NDC-C" && (this.compbt.num_doc_adq == "" || this.compbt.num_doc_adq == undefined)) {
        this.toastr.info("Ingrese un número de transacción");
        document.getElementById('idNumTrx').focus(); return;
      } else if ((this.compbt.metodo_pago != 0 && this.compbt.metodo_pago != 'Efectivo') && this.compbt.typ_acc == 0
        && (this.compbt.metodo_pago != 'NDC-C')) {
        this.toastr.info("Seleccione un tipo de cuenta");
      } else if (this.compbt.beneficiario == "" || this.compbt.beneficiario == undefined) {
        this.toastr.info("Ingrese un beneficiario");
        document.getElementById('idBenf').focus(); return;
      } else if ((this.compbt.num_tx == "" || this.compbt.num_tx == undefined) && (this.compbt.metodo_pago != 'Efectivo')
        && (this.compbt.metodo_pago != 'NDC-C')) {
        this.toastr.info("Ingrese un número de transacción");
        document.getElementById('idNumTrx').focus(); return;
      } else if (this.compbt.concepto == "" || this.compbt.concepto == undefined) {
        this.toastr.info("Ingrese un concepto");
        document.getElementById('idccpt').focus(); return;
      } else if (parseFloat(this.suma.debe) != parseFloat(this.suma.haber)) {
        this.toastr.info("El valor de las sumas totales no son iguales");
      } else if ((this.compbt.metodo_pago == 'NDC-C') && (parseFloat(this.suma.haber) != parseFloat(this.valueNDV))) {
        this.toastr.info(`El total de las sumas $${parseFloat(this.suma.haber).toFixed(2)} no puede ser diferente al de la nota de crédito $${parseFloat(this.valueNDV).toFixed(2)}`);
      } else {
        this.flag = false;
        this.contador = 0;
        this.c = 0;
        this.ccc = 0;
        this.cuentas.forEach(element => {
          if ((element['debe'] > 0.00 && element['haber'] > 0.00)) {
            this.c += 1;
            if (this.c == 1) { this.toastr.info("Revise las columnas del debe y haber, solo una puede ser mayor a 0 en el mismo registro para el asiento contable"); }
            this.flag = true; return;
          } else if ((element['debe'] == 0.00 || element['debe'] == "" || element['debe'] == null) &&
            (element['haber'] == 0.00 || element['haber'] == "" || element['haber'] == null)) {
            this.c += 1;
            if (this.c == 1) { this.toastr.info("Revise las columnas del debe y haber, ambas no pueden ser 0"); }
            this.flag = true; return;
          } else if (element['codigo_cta'] == "Código") {
            this.c += 1;
            if (this.c == 1) { this.toastr.info("Una o varias cuentas no han sido seleccionadas") }
            this.flag = true; return;
          } else {
            this.contador = 0;
            this.cuentas.forEach(elmt => {
              if (element['codigo_cta'] == elmt['codigo_cta']) {
                this.contador += 1;
                if (this.contador > 1) {
                  this.ccc += 1;
                  if (this.ccc == 1) { this.toastr.info("No se pueden repetir las cuentas"); }
                  this.flag = true; return;
                }
              }
            });

            if (this.arrayBanck.length > 0) {
              this.contador = 0;
              this.cuentas.forEach(elmt => {
                if ((elmt['codigo_cta'] == this.arrayBanck[0]['cuenta_contable'])/*  || elmt['haber'] == 0 */) {
                  this.contador += 1;
                }
              });
              if (this.contador == 0) {
                Swal.fire({
                  title: 'Error!!',
                  text: "La cuenta bancaria seleccionada no coincide con ninguna de las cuentas!!",
                  icon: 'error',
                  confirmButtonColor: '#d33',
                  confirmButtonText: 'Ok'
                }).then((result) => {
                })
                this.flag = true; return;
              }
            }
          }
          if (this.arrayBanck.length > 0) {
            this.contador = 0;
            this.cuentas.forEach(elmt => {
              if ((elmt['codigo_cta'] == this.arrayBanck[0]['cuenta_contable']) && elmt['haber'] == 0) {
                this.contador += 1;
              }
            });
            if (this.contador > 0) {
              Swal.fire({
                title: 'Error!!',
                text: "La cuenta bancaria seleccionada debe tener un valor mayor a 0 del lado del haber!!",
                icon: 'error',
                confirmButtonColor: '#d33',
                confirmButtonText: 'Ok'
              }).then((result) => {
              })
              this.flag = true; return;
            }
          }
        });
        (!this.flag) ? resolve(true) : resolve(false);
      }
    });
  }

  save() {
    this.lcargando.ctlSpinner(true);
    this.compbt['isPostDate'] = (moment(this.compbt.fecha_post).format('YYYY-MM-DD') > moment(this.hoy).format('YYYY-MM-DD')) ? 1 : 0;
    this.compbt['fk_documento'] = 12;
    this.compbt['detalle'] = this.cuentas;
    this.compbt['ip'] = this.commonServices.getIpAddress();
    this.compbt['accion'] = `Comprobante de egreso con numero de transaccion ${this.compbt.num_tx} por el usuario ${this.compbt.num_tx}`;
    this.compbt['id_controlador'] = myVarGlobals.fComprobanteEgreso;
    this.compbt['fecha_emision'] = moment(this.compbt.fecha_emision).format('YYYY-MM-DD');
    this.compbt['fecha_post'] = moment(this.compbt.fecha_post).format('YYYY-MM-DD');
    this.compbt['valor'] = parseFloat(this.suma.haber);
    this.compbt['tipo_egreso'] = 'Varios';
    this.compbt['fk_cta_affected'] = this.compbt.typ_acc;
    this.compbt['conciliation'] = this.arrayBanck;
    /* console.log(this.compbt); */
    this.egsSrv.saveComprobante(this.compbt).subscribe(res => {
      this.toastr.success(res['message']);
      this.lcargando.ctlSpinner(false);
      this.cancel();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  showComprobantes() {
    const modalInvoice = this.modalService.open(ShowComprobantesComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fComprobanteEgreso;
  }

  update() {
    this.lcargando.ctlSpinner(true);
    this.compbt['isPostDate'] = (moment(this.compbt.fecha_post).format('YYYY-MM-DD') > moment(this.hoy).format('YYYY-MM-DD')) ? 1 : 0;
    this.compbt['fk_documento'] = 12;
    this.compbt['detalle'] = this.cuentas;
    this.compbt['detalleAux'] = this.cuentasAux;
    this.compbt['ip'] = this.commonServices.getIpAddress();
    this.compbt['accion'] = `Actualización de comprobante de egreso con numero de transaccion ${this.compbt.num_tx} por el usuario ${this.compbt.num_tx}`;
    this.compbt['id_controlador'] = myVarGlobals.fComprobanteEgreso;
    this.compbt['fecha_emision'] = moment(this.compbt.fecha_emision).format('YYYY-MM-DD');
    this.compbt['fecha_post'] = moment(this.compbt.fecha_post).format('YYYY-MM-DD');
    this.compbt['valor'] = parseFloat(this.suma.haber);
    this.compbt['tipo_egreso'] = 'Varios';
    this.compbt['fk_cta_affected'] = this.compbt.typ_acc;
    this.compbt['num_transaccion_updt'] = this.nx_tr_update;
    this.compbt['cuenta_afectada_updt'] = this.bank_update;
    this.compbt['form_pago_updt'] = this.fr_pago_updt;
    this.compbt['conciliation'] = this.arrayBanck;
    /* console.log(this.compbt); */
    this.egsSrv.updatedComprobante(this.compbt).subscribe(res => {
      this.toastr.success(res['message']);
      this.lcargando.ctlSpinner(false);
      this.cancel();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  cutInfo(inf) {
    let infSend = inf.substring(0, 3);
    return infSend;
  }

  closeModalComprob() {
    ($("#modalComprobanteReport") as any).modal("hide");
  }


  reportModalEgreso() {
    if (this.permisions.consultar == "0") {
      this.toastr.info("Usuario no tiene permiso para Consultar Comprobante de Egreso");
    } else {
      $('#modalComprobanteReport').appendTo("body").modal('show');
    }
  }

  selectAccountBanck(evt) {
    if (evt != 0) {
      this.arrayBanck = this.type_payments.filter(e => e.id_banks == evt);
    } else {
      this.arrayBanck = [];
    }
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto + evento.items.paramAccion) {
      case "GUARDAR1":
        this.validateSaveComprobate();
        break;
      case "MODIFICAR1":
        this.validateUpdateComprobante();
        break;
      case "IMPRIMIR1":
        break;
      case "COMPROBANTES1":
        this.showComprobantes();
        break;
      case "REPORTE1":
        this.reportModalReport();
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

  arrayNotas: any;
  getNotasDebito() {
    this.egsSrv.getNotasDebito({ id_document: 23, type: "Proveedor" }).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.arrayNotas = res['data'];
      this.arrayNotas.forEach(element => {
        element['total'] = this.commonServices.formatNumber(element['total']);
      });
      localStorage.setItem('notasDebitoActive', JSON.stringify(this.arrayNotas));
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  valueNDV: any;
  getValue(evt) {
    this.valueNDV = this.commonServices.formatNumber(this.arrayNotas.filter(e => e.secuencia_doc == evt)[0]['total']);
  }

  reportModalReport() {
    if (this.permisions.consultar == "0") {
      this.toastr.info("Usuario no tiene permiso para Consultar Nota Crédito");
    } else {
      this.processingtwo = true;
      const dialogRef = this.confirmationDialogService.openDialogMat(ReportComprobantesComponent, {
        width: '1500px', height: 'auto',
        data: { titulo: "REPORTE COMPROBANTE DE EGRESO" }

      });
      dialogRef.afterClosed().subscribe(resultado => {
        if (resultado != false && resultado != undefined) {
        }
      });
    }
  }

}
