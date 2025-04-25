import { Component, OnInit, ViewChild } from '@angular/core';
import * as myVarGlobals from '../../../../global';
import { CommonService } from '../../../../../app/services/commonServices';
import { CommonVarService } from '../../../../../app/services/common-var.services';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShowCuentasComponent } from './show-cuentas/show-cuentas.component';
import { NotaDebitoService } from './nota-debito.service';
import 'sweetalert2/src/sweetalert2.scss';
const Swal = require('sweetalert2');
import * as moment from 'moment';
import { ShowNotasDebitoComponent } from './show-notas-debito/show-notas-debito.component';
import { Socket } from '../../../../services/socket.service';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
declare const $: any;
@Component({
  selector: 'app-nota-debito',
  templateUrl: './nota-debito.component.html',
  styleUrls: ['./nota-debito.component.scss']
})
export class NotaDebitoComponent implements OnInit {
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;


  processing: any = false;
  dataUser: any;
  empresLogo: any;
  permisions: any;
  compEgre: any = {};
  hoy: Date = new Date();
  hoySet: any;
  cuentas: any = [
    {
      codigo_cta: "Código", nombre_cta: "Nombre cuenta", debe: parseFloat('0.00').toFixed(2),
      haber: parseFloat('0.00').toFixed(2)
    },
    {
      codigo_cta: "Código", nombre_cta: "Nombre cuenta", debe: parseFloat('0.00').toFixed(2),
      haber: parseFloat('0.00').toFixed(2)
    }
  ];
  suma: any = { debe: parseFloat('0.00').toFixed(2), haber: parseFloat('0.00').toFixed(2) };
  position: any;
  forma_pago: any = [];
  ndventa: any = { fecha_emision: new Date, causa: 0, fk_agente: 0 };
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
  arrayMotivos: any;
  documentDet: any;
  prefict: any;
  latestStatus: any;
  arrayClientes: any;
  arrayCustomerAux: any;
  customer: any;
  processingtwo: boolean = false;
  ctr: any = 0;
  vmButtons: any;
  flag = false;
  contador = 0;
  c = 0;
  ccc = 0;
  date: Date = new Date();
  fecha = this.date.getDate() + '-' + (this.date.getMonth() + 1) + '-' + this.date.getFullYear();
  hora = this.date.getHours() + ':' + this.date.getMinutes() + ':' + this.date.getSeconds();
  

  constructor(private toastr: ToastrService,
    private commonServices: CommonService,
    private router: Router,
    private modalService: NgbModal,
    private commonVarSrvice: CommonVarService,
    private egsSrv: NotaDebitoService,
    private socket: Socket) {

      this.commonVarSrvice.updPerm.asObservable().subscribe(res => {
        (res) ? this.lcargando.ctlSpinner(true) : this.lcargando.ctlSpinner(false);
      })

    this.commonVarSrvice.setAccountNDV.asObservable().subscribe(res => {
      this.ctr += 1;
      if (this.ctr = 1) {
        this.cuentas[this.position]['codigo_cta'] = res['codigo'];
        this.cuentas[this.position]['nombre_cta'] = res['nombre'];
      }
    });

    this.commonVarSrvice.setNotasDebitoVenta.asObservable().subscribe(res => {
      this.dsbGlobal = (res['isModule'] == 1) ? true : false;
      if (this.dsbGlobal) {
        Swal.fire({
          title: 'Atención!!',
          text: "Esta nota de débito solo puede ser visualizada mas no editada!!",
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
      this.ndventa = res;
      this.cuentas = res['detalle'];
      this.suma.debe = parseFloat(res['total']).toFixed(2);
      this.suma.haber = parseFloat(res['total']).toFixed(2);
    })
  }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsNDV", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnsNDV", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: true },
      { orig: "btnsNDV", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: true, printSection: "print-section-ndv", imprimir: true },
      { orig: "btnsNDV", paramAccion: "", boton: { icon: "fas fa-file-alt", texto: "NOTAS/D" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: false },
      { orig: "btnsNDV", paramAccion: "", boton: { icon: "far fa-file-alt", texto: "REPORTE" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-dark boton btn-sm", habilitar: false },
      { orig: "btnsNDV", paramAccion: "", boton: { icon: "far fa-window-close", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];

    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 50);
    this.getPermisions();
  }

  getPermisions() {
    this.hoySet = moment(this.hoy).format('YYYY-MM-DD');
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.empresLogo = this.dataUser.logoEmpresa;
    let id_rol = this.dataUser.id_rol;
    let data = {
      codigo: myVarGlobals.fNotaDebitoVenta,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'][0];
      if (this.permisions.ver == "0") {
        this.toastr.info("Usuario no tiene Permiso para ver el formulario nota de débito");
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
      params: "'NOTA CLIENTE'",
    };
    this.egsSrv.getCatalogs(data).subscribe(res => {
      this.arrayMotivos = res["data"]["NOTA CLIENTE"];
      this.getNumAutNotaDebito();
    }, (error) => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  getNumAutNotaDebito() {
    this.egsSrv.getNumAutNotaDebito({ id: 14 }).subscribe(res => {
      this.documentDet = res['data'];
      this.ndventa.num_aut_doc = this.documentDet.num_autorizacion;
      this.getClientes();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getClientes() {
    this.egsSrv.getClients().subscribe((res) => {
      this.arrayClientes = res["data"];
      this.arrayCustomerAux = res['data'];
      this.getSucursal();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  getCustomerFilter(dat) {
    this.arrayCustomerAux = [];
    let res = this.arrayClientes.filter(e => e.num_documento.substring(0, dat.length) == dat.toString()
      || e.razon_social.toLowerCase().substring(0, dat.length) == dat.toLowerCase());
    setTimeout(() => {
      this.arrayCustomerAux = res;
    }, 100);
  }

  getCustomer(e) {
    if (e != 0) {
      this.customer = this.arrayClientes.filter(evt => evt.id_cliente == e)[0];
      this.ndventa.ruc = this.customer.num_documento;
      this.ndventa.telefono = this.customer.telefono;
      this.ndventa.razon_social = this.customer.razon_social;
    } else {
      this.ndventa.ruc = "";
      this.ndventa.telefono = "";
      this.ndventa.razon_social = "";
    }
  }

  showAccounts(i) {
    this.ctr = 0;
    this.position = i;
    const modalInvoice = this.modalService.open(ShowCuentasComponent, { size: "lg", backdrop: 'static', windowClass: 'viewer-content-general' });
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

        this.suma.debe = parseFloat(this.suma.debe).toFixed(2);
        this.suma.haber = parseFloat(this.suma.haber).toFixed(2);
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

        this.suma.debe = parseFloat(this.suma.debe).toFixed(2);
        this.suma.haber = parseFloat(this.suma.haber).toFixed(2);
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

    this.suma.debe = parseFloat(this.suma.debe).toFixed(2);
    this.suma.haber = parseFloat(this.suma.haber).toFixed(2);
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
        if (action == "SAVE_ND") {
          this.save();
        } else if (action == "UPDATE_NDV") {
          this.update();
        }
      }
    })
  }

  getSucursal() {
    this.egsSrv.getSucursales().subscribe(res => {
      this.dataSucursal = res['data'].filter(e => e.id_sucursal == this.dataUser.id_sucursal)[0];
      this.lcargando.ctlSpinner(false);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  cancel() {
    this.ndventa = { fecha_emision: new Date, causa: 0, fk_agente: 0 };
    this.cuentas = [
      {
        codigo_cta: "Código", nombre_cta: "Nombre cuenta", debe: parseFloat('0.00').toFixed(4),
        haber: parseFloat('0.00').toFixed(4)
      },
      {
        codigo_cta: "Código", nombre_cta: "Nombre cuenta", debe: parseFloat('0.00').toFixed(4),
        haber: parseFloat('0.00').toFixed(4)
      }
    ];
    this.suma = { debe: parseFloat('0.00').toFixed(4), haber: parseFloat('0.00').toFixed(4) };
    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = true;
    this.vmButtons[2].habilitar = true;
    this.btnMov = false;
    this.btnSave = false;
    this.dsPrint = false;
    this.cuentasAux = [];
    this.ndventa.num_aut_doc = this.documentDet.num_autorizacion;
  }

  async validateSaveND() {
    if (this.permisions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      let resp = await this.validateDataGlobal().then(respuesta => {
        if (respuesta) {
          this.confirmSave("Seguro desea guardar la nota de débito?", "SAVE_ND");
        }
      })
    }
  }

  async validateUpdateNDV() {
    if (this.permisions.editar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      let resp = await this.validateDataGlobal().then(respuesta => {
        if (respuesta) {
          this.confirmSave("Seguro desea actualizar la nota de débito?", "UPDATE_NDV");
        }
      })
    }
  }

  validateDataGlobal() {
    return new Promise((resolve, reject) => {
      if (this.ndventa.fk_agente == 0) {
        this.toastr.info("Seleccione una razón social");
      } else if (this.ndventa.causa == 0) {
        this.toastr.info("Seleccione un motivo");
      } else if (this.ndventa.fecha_emision == undefined || this.ndventa.fecha_emision == "") {
        this.toastr.info("Ingrese una fecha");
      } else if (parseFloat(this.suma.debe) != parseFloat(this.suma.haber)) {
        this.toastr.info("El valor de las sumas totales para debe y haber no son iguales");
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
            if (this.c == 1) { this.toastr.info("Revise las columnas del debe y haber, ambas no pueden ser 0 ni estar vacias"); }
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
          }
        });
        (!this.flag) ? resolve(true) : resolve(false);
      }
    });
  }

  save() {
    this.lcargando.ctlSpinner(true);
    this.ndventa['isModule'] = 0;
    this.ndventa['fk_documento'] = this.documentDet.id;
    this.ndventa['detalle'] = this.cuentas;
    this.ndventa['ip'] = this.commonServices.getIpAddress();
    this.ndventa['accion'] = `Se ha generado una nueva nota de débito por un valor de $${parseFloat(this.suma.haber).toFixed(2)} por el usuario ${this.dataUser.nombre}`;
    this.ndventa['id_controlador'] = myVarGlobals.fNotaDebitoVenta;
    this.ndventa['fecha_emision'] = moment(this.ndventa.fecha_emision).format('YYYY-MM-DD');
    this.ndventa['total'] = parseFloat(this.suma.haber);
    this.ndventa['fk_empresa'] = this.dataUser.id_empresa;
    this.ndventa['fk_sucursal'] = this.dataUser.id_sucursal;
    this.ndventa['ciudad'] = this.dataUser.sucursal.ciudad;
    this.ndventa['tipo'] = "NDD-V";
    this.ndventa['tipo_agente'] = "Cliente";
    this.ndventa['valor_disponible'] = parseFloat(this.suma.haber);
    this.ndventa['telefono'] = this.ndventa['telefono'].toString();
    this.ndventa['flag'] = true;

    this.egsSrv.saveNotaDebito(this.ndventa).subscribe(res => {
      this.toastr.success(res['message']);
      this.getNumAutNotaDebito();
      setTimeout(() => {
        this.cancel();
      }, 1000);
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  showNotasdebito() {
    const modalInvoice = this.modalService.open(ShowNotasDebitoComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fNotaDebitoVenta;
    modalInvoice.componentInstance.id_document = this.documentDet.id;
    modalInvoice.componentInstance.editar = this.permisions.editar;
    this.cancel();
  }

  update() {
    this.ndventa['fk_documento'] = this.documentDet.id;
    this.ndventa['detalle'] = this.cuentas;
    this.ndventa['detalleAux'] = this.cuentasAux;
    this.ndventa['ip'] = this.commonServices.getIpAddress();
    this.ndventa['accion'] = `Actualización para nota de débito por un valor de $${parseFloat(this.suma.haber).toFixed(2)} por el usuario ${this.dataUser.nombre}`;
    this.ndventa['id_controlador'] = myVarGlobals.fNotaDebitoVenta;
    this.ndventa['fecha_emision'] = moment(this.ndventa.fecha_emision).format('YYYY-MM-DD');
    this.ndventa['total'] = parseFloat(this.suma.haber);
    this.ndventa['valor_disponible'] = parseFloat(this.suma.haber);
    this.ndventa['telefono'] = this.ndventa['telefono'].toString();

    this.egsSrv.updatedNotaDebito(this.ndventa).subscribe(res => {
      this.toastr.success(res['message']);
      this.getNumAutNotaDebito();
      setTimeout(() => {
        this.cancel();
      }, 1000);
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  cutInfo(inf) {
    let infSend = inf.substring(0, 3);
    return infSend;
  }


  closeModalDebito() {
    ($("#modalNDebitoReport") as any).modal("hide");
    this.processingtwo = false;

  }


  reportModalDebito() {
    if (this.permisions.consultar == "0") {
      this.toastr.info("Usuario no tiene permiso para Consultar Nota Débito");
    } else {
      $('#modalNDebitoReport').appendTo("body").modal('show');
      this.processingtwo = true;
    }
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "GUARDAR":
        this.validateSaveND();
        break;
      case "MODIFICAR":
        this.validateUpdateNDV();
        break;
      case "IMPRIMIR":
        break;
      case "NOTAS/D":
        this.showNotasdebito();
        break;
      case "REPORTE":
        this.reportModalDebito();
        break;
      case "CANCELAR":
        this.cancel();
        break;
    }
  }


}
