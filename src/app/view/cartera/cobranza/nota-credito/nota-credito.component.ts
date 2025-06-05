import { Component, OnInit, ViewChild } from '@angular/core';
import * as myVarGlobals from '../../../../global';
import { CommonService } from '../../../../services/commonServices';
import { CommonVarService } from '../../../../services/common-var.services';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShowCuentasComponent } from './show-cuentas/show-cuentas.component';
import { NotaCreditoService } from './nota-credito.service';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { ShowNotasCreditoComponent } from './show-notas-credito/show-notas-credito.component';
import { Socket } from '../../../../services/socket.service';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
declare const $: any;

@Component({
standalone: false,
  selector: 'app-nota-credito',
  templateUrl: './nota-credito.component.html',
  styleUrls: ['./nota-credito.component.scss']
})
export class NotaCreditoComponent implements OnInit {
  
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
  ncventa: any = { fecha_emision: new Date, causa: 0, fk_agente: 0, ind_electronic: false };
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
    private egsSrv: NotaCreditoService,
    private socket: Socket) {

    this.commonVarSrvice.updPerm.asObservable().subscribe(res => {
      (res) ? this.lcargando.ctlSpinner(true) : this.lcargando.ctlSpinner(false);
    })

    this.commonVarSrvice.setAccountNCV.asObservable().subscribe(res => {
      this.ctr += 1;
      if (this.ctr = 1) {
        this.cuentas[this.position]['codigo_cta'] = res['codigo'];
        this.cuentas[this.position]['nombre_cta'] = res['nombre'];
      }
    });

    this.commonVarSrvice.setNotasCreditoVenta.asObservable().subscribe(res => {
      this.dsbGlobal = (res['isModule'] == 1 || res['filter_doc'] == 4) ? true : false;
      if (this.dsbGlobal) {
        Swal.fire({
          title: 'Atención!!',
          text: "Esta nota de crédito solo puede ser visualizada mas no editada!!",
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
      this.ncventa = res;
      this.dsPrint = true;
      this.btnMov = true;
      this.btnSave = true;
      this.cuentas = res['detalle'];
      this.suma.debe = parseFloat(res['total']).toFixed(2);
      this.suma.haber = parseFloat(res['total']).toFixed(2);
    })
  }

  ngOnInit(): void {

    this.vmButtons = [
      { orig: "btnsNCV", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnsNCV", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: true },
      { orig: "btnsNCV", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: true, printSection: "print-section-ncv", imprimir: true },
      { orig: "btnsNCV", paramAccion: "", boton: { icon: "fas fa-file-alt", texto: "NOTAS/C" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: false },
      { orig: "btnsNCV", paramAccion: "", boton: { icon: "far fa-file-alt", texto: "REPORTE" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-dark boton btn-sm", habilitar: false },
      { orig: "btnsNCV", paramAccion: "", boton: { icon: "far fa-window-close", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
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
      codigo: myVarGlobals.fNotaCreditoVenta,
      id_rol: id_rol
    }

    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'][0];
      if (this.permisions.ver == "0") {
        this.toastr.info("Usuario no tiene Permiso para ver el formulario nota de crédito");
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
      this.getNumAutNotacredito();
    }, (error) => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  getNumAutNotacredito() {
    this.egsSrv.getNumAutNotacredito({ id: 22 }).subscribe(res => {
      this.documentDet = res['data'];
      this.ncventa.num_aut_doc = this.documentDet.num_autorizacion;
      /*obtener el ultimo status*/
      this.prefict = this.dataUser.permisos_doc.filter(e => e.fk_documento == this.documentDet.id);
      if (this.prefict[0]['filtros'] != null && this.prefict[0]['filtros'] != undefined) {
        let filter = this.prefict[0]['filtros'].split(',');
        this.latestStatus = parseInt(filter[filter.length - 1]);
      }
      /*fin*/
      this.getSucursal();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getSucursal() {
    this.egsSrv.getSucursales().subscribe(res => {
      this.dataSucursal = res['data'].filter(e => e.id_sucursal == this.dataUser.id_sucursal)[0];
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
      this.lcargando.ctlSpinner(false);
    }, error => {
      this.lcargando.ctlSpinner(false);
    });
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
       icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#DC3545',
      confirmButtonColor: '#13A1EA',
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.value) {
        if (action == "SAVE_NC") {
          this.save();
        } else if (action == "UPDATE_NCV") {
          this.update();
        }
      }
    })
  }

  getCustomer(e) {
    if (e != 0) {
      this.customer = this.arrayClientes.filter(evt => evt.id_cliente == e)[0];
      this.ncventa.ruc = this.customer.num_documento;
      this.ncventa.telefono = this.customer.telefono;
      this.ncventa.razon_social = this.customer.razon_social;
    } else {
      this.ncventa.ruc = "";
      this.ncventa.telefono = "";
      this.ncventa.razon_social = "";
    }
  }

  cancel() {
    this.ncventa = { fecha_emision: new Date, causa: 0, fk_agente: 0, ind_electronic: false };
    this.cuentas = [
      {
        codigo_cta: "Código", nombre_cta: "Nombre cuenta", debe: parseFloat('0.00').toFixed(2),
        haber: parseFloat('0.00').toFixed(2)
      },
      {
        codigo_cta: "Código", nombre_cta: "Nombre cuenta", debe: parseFloat('0.00').toFixed(2),
        haber: parseFloat('0.00').toFixed(2)
      }
    ];
    this.suma = { debe: parseFloat('0.00').toFixed(2), haber: parseFloat('0.00').toFixed(2) };
    this.btnMov = false;
    this.btnSave = false;
    this.dsPrint = false;
    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = true;
    this.vmButtons[2].habilitar = true;
    this.cuentasAux = [];
    this.ncventa.num_aut_doc = this.documentDet.num_autorizacion;
  }

  async validateSaveNc() {
    if (this.permisions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      let resp = await this.validateDataGlobal().then(respuesta => {
        if (respuesta) {
          let prefict = this.dataUser.permisos_doc.filter(e => e.fk_documento == 22);
          let filter = prefict[0]['filtros'].split(',');
          filter = filter[0];
          if (this.commonServices.filterUser(filter, 22)) {
            this.confirmSave("Seguro desea guardar la nota de crédito?", "SAVE_NC");
          } else {
            this.cancel();
            this.toastr.info("Usuario no tiene permiso para crear nota de crédito  o los permisos aun no han sido asignados");
          }
        }
      })
    }
  }

  async validateUpdateNCV() {
    if (this.permisions.editar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      let resp = await this.validateDataGlobal().then(respuesta => {
        if (respuesta) {
          this.confirmSave("Seguro desea actualizar la nota de crédito?", "UPDATE_NCV");
        }
      })
    }
  }

  validateDataGlobal() {
    return new Promise((resolve, reject) => {
      if ((this.ncventa.fk_agente == 0) && (this.ncventa.razon_social == undefined || this.ncventa.razon_social == "")) {
        this.toastr.info("Ingrese razón social");
        document.getElementById('idrsocial').focus(); return;
      } else if ((this.ncventa.fk_agente == 0) && (this.ncventa.ruc == undefined || this.ncventa.ruc == "")) {
        this.toastr.info("Ingrese ruc");
        document.getElementById('idruc').focus(); return;
      } else if ((this.ncventa.fk_agente == 0) && (this.ncventa.telefono == undefined || this.ncventa.telefono == "")) {
        this.toastr.info("Ingrese teléfono");
        document.getElementById('idtlf').focus(); return;
      } else if (this.ncventa.causa == 0) {
        this.toastr.info("Seleccione un motivo");
      } else if (this.ncventa.fecha_emision == undefined || this.ncventa.fecha_emision == "") {
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
    this.ncventa['isModule'] = 0;
    this.ncventa['fk_documento'] = this.documentDet.id;
    this.ncventa['detalle'] = this.cuentas;
    this.ncventa['ip'] = this.commonServices.getIpAddress();
    this.ncventa['accion'] = `Se ha generado una nueva nota de crédito por un valor de $${parseFloat(this.suma.haber).toFixed(2)} por el usuario ${this.dataUser.nombre}`;
    this.ncventa['id_controlador'] = myVarGlobals.fNotaCreditoVenta;
    this.ncventa['fecha_emision'] = moment(this.ncventa.fecha_emision).format('YYYY-MM-DD');
    this.ncventa['total'] = parseFloat(this.suma.haber);
    this.ncventa['fk_empresa'] = this.dataUser.id_empresa;
    this.ncventa['fk_sucursal'] = this.dataUser.id_sucursal;
    this.ncventa['ciudad'] = this.dataUser.sucursal.ciudad;
    this.ncventa['tipo'] = "NDC-V";
    this.ncventa['tipo_agente'] = "Cliente";
    this.ncventa['valor_disponible'] = parseFloat(this.suma.haber);
    this.ncventa['telefono'] = this.ncventa['telefono'].toString();
    this.ncventa['flag'] = false;

    let prefict = this.dataUser.permisos_doc.filter(e => e.fk_documento == 22);
    let filter = prefict[0]['filtros'].split(',');
    filter = filter[0];

    this.ncventa['notifycation'] = `Se ha generado una nueva nota de crédito por un valor de $${parseFloat(this.suma.haber).toFixed(2)} por el usuario ${this.dataUser.nombre}`;
    this.ncventa['abbr_doc'] = prefict[0].codigo;
    this.ncventa['id_document'] = prefict[0].fk_documento;
    this.ncventa['filter_doc'] = filter;
    this.ncventa['usersFilter'] = this.commonServices.filterUserNotification(filter, 22);

    this.egsSrv.saveNotacredito(this.ncventa).subscribe(res => {
      this.socket.onEmitNotification(this.commonServices.filterUserNotification(filter, 22));
      this.toastr.success(res['message']);
      this.getNumAutNotacredito();
      setTimeout(() => {
        this.cancel();
      }, 1000);
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  showNotasCredito() {
    const modalInvoice = this.modalService.open(ShowNotasCreditoComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fNotaCreditoVenta;
    modalInvoice.componentInstance.id_document = this.documentDet.id;
    modalInvoice.componentInstance.editar = this.permisions.editar;
    this.cancel();
  }

  update() {
    this.lcargando.ctlSpinner(true);
    this.ncventa['fk_documento'] = this.documentDet.id;
    this.ncventa['detalle'] = this.cuentas;
    this.ncventa['detalleAux'] = this.cuentasAux;
    this.ncventa['ip'] = this.commonServices.getIpAddress();
    this.ncventa['accion'] = `Actualización para nota de crédito por un valor de $${parseFloat(this.suma.haber).toFixed(2)} por el usuario ${this.dataUser.nombre}`;
    this.ncventa['id_controlador'] = myVarGlobals.fNotaCreditoVenta;
    this.ncventa['fecha_emision'] = moment(this.ncventa.fecha_emision).format('YYYY-MM-DD');
    this.ncventa['total'] = parseFloat(this.suma.haber);
    this.ncventa['valor_disponible'] = parseFloat(this.suma.haber);
    this.ncventa['telefono'] = this.ncventa['telefono'].toString();

    this.egsSrv.updatedNotaCredito(this.ncventa).subscribe(res => {
      this.toastr.success(res['message']);
      this.getNumAutNotacredito();
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

  closeModalReport() {
    ($("#modalNCreditoReport") as any).modal("hide");
  }

  reportModalReport() {
    if (this.permisions.consultar == "0") {
      this.toastr.info("Usuario no tiene permiso para Consultar Nota Crédito");
    } else {
      $('#modalNCreditoReport').appendTo("body").modal('show');
    }
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "GUARDAR":
        this.validateSaveNc();
        break;
      case "MODIFICAR":
        this.validateUpdateNCV();
        break;
      case "IMPRIMIR":
        break;
      case "NOTAS/C":
        this.showNotasCredito();
        break;
      case "REPORTE":
        this.reportModalReport();
        break;
      case "CANCELAR":
        this.cancel();
        break;
    }
  }

}
