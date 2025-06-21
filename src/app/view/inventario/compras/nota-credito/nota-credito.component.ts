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
import moment from 'moment';
import { ShowNotasCreditoComponent } from './show-notas-credito/show-notas-credito.component';
import { Socket } from '../../../../services/socket.service';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { ConfirmationDialogService } from '../../../../config/custom/confirmation-dialog/confirmation-dialog.service';
import { ReportNotaCreditoComponent } from './report-nota-credito/report-nota-credito.component';

@Component({
standalone: false,
  selector: 'app-nota-credito',
  templateUrl: './nota-credito.component.html',
  styleUrls: ['./nota-credito.component.scss']
})
export class NotaCreditoComponent implements OnInit {

  processing: any = false;
  dataUser: any;
  empresLogo: any;
  permisions: any;
  compEgre: any = {};
  hoy: Date = new Date();
  hoySet: any;
  cuentas: any = [
    {
      codigo_cta: "Código", nombre_cta: "Nombre cuenta", debe: parseFloat('0.00').toFixed(4),
      haber: parseFloat('0.00').toFixed(4)
    },
    {
      codigo_cta: "Código", nombre_cta: "Nombre cuenta", debe: parseFloat('0.00').toFixed(4),
      haber: parseFloat('0.00').toFixed(4)
    }
  ];
  suma: any = { debe: parseFloat('0.00').toFixed(4), haber: parseFloat('0.00').toFixed(4) };
  position: any;
  forma_pago: any = [];
  ncventa: any = { fecha_emision: new Date, causa: 0, fk_agente: 0 };
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
  arrayProveedor: any;
  arrayCustomerAux: any;
  customer: any;
  processingtwo: boolean = false;
  ctr: any = 0;

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  vmButtons: any;
  flag = false;
  contador = 0;
  c = 0;
  ccc = 0;
  fecha = this.hoy.getDate() + '-' + (this.hoy.getMonth() + 1) + '-' + this.hoy.getFullYear();
  hora = this.hoy.getHours() + ':' + this.hoy.getMinutes() + ':' + this.hoy.getSeconds();

  constructor(private toastr: ToastrService,
    private commonServices: CommonService,
    private router: Router,
    private modalService: NgbModal,
    private commonVarSrvice: CommonVarService,
    private egsSrv: NotaCreditoService,
    private socket: Socket,
    private confirmationDialogService: ConfirmationDialogService
    ) {

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
        })
      }
      this.ncventa = res;
      this.dsPrint = true;
      this.btnMov = true;
      this.btnSave = true;
      this.cuentas = res['detalle'];
      this.suma.debe = parseFloat(res['total']).toFixed(2);
      this.suma.haber = parseFloat(res['total']).toFixed(2);

      this.vmButtons[0].habilitar = true;
      this.vmButtons[1].habilitar = false;
      this.vmButtons[2].habilitar = false;
    })
  }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnNotCreInv", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnNotCreInv", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: true },
      { orig: "btnNotCreInv", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: true, printSection: "print-section-ncv", imprimir: true},
      { orig: "btnNotCreInv", paramAccion: "", boton: { icon: "fas fa-file-alt", texto: "N/CRÉDITO(S)" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: false },
      { orig: "btnNotCreInv", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false },
      { orig: "btnNotCreInv", paramAccion: "", boton: { icon: "far fa-file-alt", texto: "REPORTE" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-dark boton btn-sm", habilitar: false },

      { orig: "btnAsiCnInvNC", paramAccion: "", boton: { icon: "fas fa-plus-square", texto: "AÑADIR CUENTA" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false }
    ];

    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 10);

    this.getPermisions();
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "GUARDAR":
        this.validateSaveNc();
        break;
      case "MODIFICAR":
        this.validateUpdateNCV();
        break;
      case "N/CRÉDITO(S)":
        this.showNotasCredito();
        break;
      case "CANCELAR":
        this.cancel();
        break;
      case "REPORTE":
        this.reportModalReport();
        break;


      case "AÑADIR CUENTA":
        this.addAccounts();
        break;
    }
  }

  getPermisions() {
    this.hoySet = moment(this.hoy).format('YYYY-MM-DD');
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.empresLogo = this.dataUser.logoEmpresa;
    let id_rol = this.dataUser.id_rol;
    let data = {
      codigo: myVarGlobals.fNotaCreditoCompra,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'][0];
      if (this.permisions.ver == "0") {
        this.lcargando.ctlSpinner(false);
        this.toastr.info("Usuario no tiene Permiso para ver el formulario nota de crédito");
        this.vmButtons = [];
      } else {
        this.processing = true;
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
    this.egsSrv.getNumAutNotacredito({ id: 23 }).subscribe(res => {
      this.documentDet = res['data'];
      this.ncventa.num_aut_doc = this.documentDet.num_autorizacion;

      this.getSucursal();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getSucursal() {
    this.egsSrv.getSucursales().subscribe(res => {
      this.dataSucursal = res['data'].filter(e => e.id_sucursal == this.dataUser.id_sucursal)[0];
      this.getProveedores();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

 /*  getClientes() {
    this.egsSrv.getClients().subscribe((res) => {
      this.arrayClientes = res["data"];
      this.arrayCustomerAux = res['data'];
    });
  } */
  getProveedores() {
    this.egsSrv.getProveedores().subscribe(res => {
      this.arrayProveedor = res['data'];
      this.lcargando.ctlSpinner(false);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  showAccounts(i) {
    this.ctr = 0;
    this.position = i;
    const modalInvoice = this.modalService.open(ShowCuentasComponent, { size: "lg", backdrop: 'static', windowClass: 'viewer-content-general' });
  }

  addAccounts() {
    this.cuentas.push({ codigo_cta: "Código", nombre_cta: "Nombre cuenta", debe: parseFloat('0.00').toFixed(4), haber: parseFloat('0.00').toFixed(4) });
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
      this.customer = this.arrayProveedor.filter(evt => evt.id_proveedor == e)[0];
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
    this.ncventa = { fecha_emision: new Date, causa: 0, fk_agente: 0 };
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
    this.btnMov = false;
    this.btnSave = false;
    this.dsPrint = false;
    this.cuentasAux = [];
    this.ncventa.num_aut_doc = this.documentDet.num_autorizacion;

    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = true;
    this.vmButtons[2].habilitar = true;
  }

  async validateSaveNc() {
    if (this.permisions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      let resp = await this.validateDataGlobal().then(respuesta => {
        if (respuesta) {
          /* let prefict = this.dataUser.permisos_doc.filter(e => e.fk_documento == 23);
          let filter = prefict[0]['filtros'].split(',');
          filter = filter[0];
          if (this.commonServices.filterUser(filter, 23)) { */
            this.confirmSave("Seguro desea guardar la nota de crédito?", "SAVE_NC");
          /* } else {
            this.cancel();
            this.toastr.info("Usuario no tiene permiso para crear nota de crédito  o los permisos aun no han sido asignados");
          } */
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
          }
        });
        (!this.flag) ? resolve(true) : resolve(false);
      }
    });
  }

  save() {
    this.ncventa['isModule'] = 0;
    this.ncventa['fk_documento'] = this.documentDet.id;
    this.ncventa['detalle'] = this.cuentas;
    this.ncventa['ip'] = this.commonServices.getIpAddress();
    this.ncventa['accion'] = `Se ha generado una nueva nota de crédito por un valor de $${parseFloat(this.suma.haber).toFixed(2)} por el usuario ${this.dataUser.nombre}`;
    this.ncventa['id_controlador'] = myVarGlobals.fNotaCreditoCompra;
    this.ncventa['fecha_emision'] = moment(this.ncventa.fecha_emision).format('YYYY-MM-DD');
    this.ncventa['total'] = parseFloat(this.suma.haber);
    this.ncventa['fk_empresa'] = this.dataUser.id_empresa;
    this.ncventa['fk_sucursal'] = this.dataUser.id_sucursal;
    this.ncventa['ciudad'] = this.dataUser.sucursal.ciudad;
    this.ncventa['tipo'] = "NDC-C";
    this.ncventa['tipo_agente'] = "Proveedor";
    this.ncventa['valor_disponible'] = parseFloat(this.suma.haber);
    this.ncventa['telefono'] = this.ncventa['telefono'].toString();
    this.ncventa['flag'] = true;

    /* let prefict = this.dataUser.permisos_doc.filter(e => e.fk_documento == 23);
    let filter = prefict[0]['filtros'].split(',');
    filter = filter[0];

    this.ncventa['notifycation'] = `Se ha generado una nueva nota de crédito por un valor de $${parseFloat(this.suma.haber).toFixed(2)} por el usuario ${this.dataUser.nombre}`;
    this.ncventa['abbr_doc'] = prefict[0].codigo;
    this.ncventa['id_document'] = prefict[0].fk_documento;
    this.ncventa['filter_doc'] = filter;
    this.ncventa['usersFilter'] = this.commonServices.filterUserNotification(filter, 23); */

    this.egsSrv.saveNotacredito(this.ncventa).subscribe(res => {
      //this.socket.onEmitNotification(this.commonServices.filterUserNotification(filter, 23));
      this.toastr.success(res['message']);
      setTimeout(() => {
        location.reload();
      }, 200);
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  showNotasCredito() {
    if(this.ncventa.fk_agente == 0){
      this.toastr.info("Por favor seleccione un proveedor");
      return;
    }

    const modalInvoice = this.modalService.open(ShowNotasCreditoComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fNotaCreditoCompra;
    modalInvoice.componentInstance.id_document = this.documentDet.id;
    modalInvoice.componentInstance.fk_agente = this.ncventa.fk_agente;
    modalInvoice.componentInstance.editar = this.permisions.editar;
    this.cancel();
  }

  update() {
    this.ncventa['fk_documento'] = this.documentDet.id;
    this.ncventa['detalle'] = this.cuentas;
    this.ncventa['detalleAux'] = this.cuentasAux;
    this.ncventa['ip'] = this.commonServices.getIpAddress();
    this.ncventa['accion'] = `Actualización para nota de crédito por un valor de $${parseFloat(this.suma.haber).toFixed(2)} por el usuario ${this.dataUser.nombre}`;
    this.ncventa['id_controlador'] = myVarGlobals.fNotaCreditoCompra;
    this.ncventa['fecha_emision'] = moment(this.ncventa.fecha_emision).format('YYYY-MM-DD');
    this.ncventa['total'] = parseFloat(this.suma.haber);
    this.ncventa['valor_disponible'] = parseFloat(this.suma.haber);
    this.ncventa['telefono'] = this.ncventa['telefono'].toString();

    this.egsSrv.updatedNotaCredito(this.ncventa).subscribe(res => {
      this.toastr.success(res['message']);
      setTimeout(() => {
        location.reload();
      }, 300);
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  cutInfo(inf) {
    let infSend = inf.substring(0, 3);
    return infSend;
  }

  closeModalReport() {
    // ($("#modalNCreditoReport") as any).modal("hide");
    this.processingtwo = false;
  }

  reportModalReport() {
    if (this.permisions.consultar == "0") {
      this.toastr.info("Usuario no tiene permiso para Consultar Nota Crédito");
    } else {
      this.processingtwo = true;

      const dialogRef = this.confirmationDialogService.openDialogMat(ReportNotaCreditoComponent, {
        width: '1500px', height: 'auto',
        data: { titulo: "Reporte Nota de Crédito", latestStatus: this.latestStatus}

      } );

      dialogRef.afterClosed().subscribe(resultado => {
        if(resultado!=false && resultado!=undefined){



        }else{
          this.latestStatus = null;
          this.closeModalReport();
        }
      });

    }
  }

}
