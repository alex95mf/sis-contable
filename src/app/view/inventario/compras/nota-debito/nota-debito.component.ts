import { Component, OnInit, ViewChild } from '@angular/core';
import * as myVarGlobals from '../../../../global';
import { CommonService } from '../../../../../app/services/commonServices';
import { CommonVarService } from '../../../../../app/services/common-var.services';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotaDebitoService } from './nota-debito.service';
import 'sweetalert2/src/sweetalert2.scss';
const Swal = require('sweetalert2');
import * as moment from 'moment';
import { ShowNotasDebitoComponent } from './show-notas-debito/show-notas-debito.component';
import { Socket } from '../../../../services/socket.service';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { ConfirmationDialogService } from '../../../../config/custom/confirmation-dialog/confirmation-dialog.service';
import { ReportNotaDebitoInvComponent } from './report-nota-debito/report-nota-debito.component';
import { ShowCuentasInvComponent } from './show-cuentas/show-cuentas.component';

@Component({
standalone: false,
  selector: 'app-nota-debito',
  templateUrl: './nota-debito.component.html',
  styleUrls: ['./nota-debito.component.scss']
})
export class NotaDebitoComponent implements OnInit {

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
  arrayProveedor: any;
  arrayProveedorAux: any;
  customer: any;
  processingtwo: boolean = false;
  ctr: any = 0;
  flag = false;
  contador = 0;
  c = 0;
  ccc = 0;
  
  
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  vmButtons: any;


  constructor(private toastr: ToastrService,
    private commonServices: CommonService,
    private router: Router,
    private modalService: NgbModal,
    private commonVarSrvice: CommonVarService,
    private egsSrv: NotaDebitoService,
    private socket: Socket,
    private confirmationDialogService: ConfirmationDialogService
    ) {

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
        })
      }
      this.dsPrint = true;
      this.btnMov = true;
      this.btnSave = true;
      this.ndventa = res;
      this.cuentas = res['detalle'];
      this.suma.debe = parseFloat(res['total']).toFixed(4);
      this.suma.haber = parseFloat(res['total']).toFixed(4);

      this.vmButtons[0].habilitar = true;
      this.vmButtons[1].habilitar = false;
      this.vmButtons[2].habilitar = false;

    })
  }

  ngOnInit(): void {

     
    this.vmButtons = [
      { orig: "btnNotDebInv", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnNotDebInv", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: true },
      { orig: "btnNotDebInv", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: true, printSection: "print-section-ndv", imprimir: true},
      { orig: "btnNotDebInv", paramAccion: "", boton: { icon: "fas fa-file-alt", texto: "N/DÉBITO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info boton btn-sm", habilitar: false },
      { orig: "btnNotDebInv", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false },
      { orig: "btnNotDebInv", paramAccion: "", boton: { icon: "far fa-file-alt", texto: "REPORTE" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-dark boton btn-sm", habilitar: false },

      { orig: "btnAsiCnInv", paramAccion: "", boton: { icon: "fas fa-plus-square", texto: "AÑADIR CUENTA" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false }
    ];

    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 10);

    this.getPermisions();
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "GUARDAR":
        this.validateSaveND();
        break;
      case "MODIFICAR":
        this.validateUpdateNDV();
        break;
      case "N/DÉBITO":
        this.showNotasdebito();
        break;
      case "CANCELAR":
        this.cancel();
        break;
      case "REPORTE":
        this.reportModalDebito();
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
      codigo: myVarGlobals.fNotaDebitoCompra,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'][0];
      if (this.permisions.ver == "0") {
        this.toastr.info("Usuario no tiene Permiso para ver el formulario nota de débito");
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);
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
      this.getNumAutNotaDebito();
    }, (error) => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    });
  }

  getNumAutNotaDebito() {
    this.egsSrv.getNumAutNotaDebito({ id: 15 }).subscribe(res => {
      this.documentDet = res['data'];
      this.ndventa.num_aut_doc = this.documentDet.num_autorizacion;
       /*obtener el ultimo status*/
      this.prefict = this.dataUser.permisos_doc.filter(e => e.fk_documento == this.documentDet.id);
      if (this.prefict[0]['filtros'] != null && this.prefict[0]['filtros'] != undefined) {
        let filter = this.prefict[0]['filtros'].split(',');
        this.latestStatus = parseInt(filter[filter.length - 1]);
      }
      /*fin*/
      this.getProveedores();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getProveedores() {
    this.egsSrv.getProveedores().subscribe(res => {
      this.arrayProveedor = res['data'];
      this.getSucursal();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  /* getClientes() {
    this.egsSrv.getClients().subscribe((res) => {
      this.arrayClientes = res["data"];
      this.arrayCustomerAux = res['data'];
      this.getSucursal();
    });
  } */

  /* getCustomerFilter(dat) {
    this.arrayCustomerAux = [];
    let res = this.arrayClientes.filter(e => e.num_documento.substring(0, dat.length) == dat.toString()
      || e.razon_social.toLowerCase().substring(0, dat.length) == dat.toLowerCase());
    setTimeout(() => {
      this.arrayCustomerAux = res;
    }, 100);
  } */

  getCustomer(e) {
    if (e != 0) {
      this.customer = this.arrayProveedor.filter(evt => evt.id_proveedor == e)[0];
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
    const modalInvoice = this.modalService.open(ShowCuentasInvComponent, { size: "lg", backdrop: 'static', windowClass: 'viewer-content-general' });
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
    this.cuentasAux = [];
    this.ndventa.num_aut_doc = this.documentDet.num_autorizacion;

    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = true;
    this.vmButtons[2].habilitar = true;
  }

  async validateSaveND() {
    if (this.permisions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      let resp = await this.validateDataGlobal().then(respuesta => {
        /* if (respuesta) {
          this.confirmSave("Seguro desea guardar la nota de débito?", "SAVE_ND");
        } */
        if (respuesta) {
          let prefict = this.dataUser.permisos_doc.filter(e => e.fk_documento == 15);
          let filter = prefict[0]['filtros'].split(',');
          filter = filter[0];
          if (this.commonServices.filterUser(filter, 15)) {
            this.confirmSave("Seguro desea guardar la nota de débito?", "SAVE_ND");
          } else {
            this.cancel();
            this.toastr.info("Usuario no tiene permiso para crear nota de débito  o los permisos aun no han sido asignados");
          }
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
            if (this.c == 1) { this.toastr.info("Revise las columnas del debe y haber, ambas no pueden ser 0 ni estar vacia"); }
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
    this.ndventa['isModule'] = 0;
    this.ndventa['fk_documento'] = this.documentDet.id;
    this.ndventa['detalle'] = this.cuentas;
    this.ndventa['ip'] = this.commonServices.getIpAddress();
    this.ndventa['accion'] = `Se ha generado una nueva nota de débito por un valor de $${parseFloat(this.suma.haber).toFixed(2)} por el usuario ${this.dataUser.nombre}`;
    this.ndventa['id_controlador'] = myVarGlobals.fNotaDebitoCompra;
    this.ndventa['fecha_emision'] = moment(this.ndventa.fecha_emision).format('YYYY-MM-DD');
    this.ndventa['total'] = parseFloat(this.suma.haber);
    this.ndventa['fk_empresa'] = this.dataUser.id_empresa;
    this.ndventa['fk_sucursal'] = this.dataUser.id_sucursal;
    this.ndventa['ciudad'] = this.dataUser.sucursal.ciudad;
    this.ndventa['tipo'] = "NDD-C";
    this.ndventa['tipo_agente'] = "Proveedor";
    this.ndventa['valor_disponible'] = parseFloat(this.suma.haber);
    this.ndventa['telefono'] = this.ndventa['telefono'].toString();
    this.ndventa['flag'] = true;

    let prefict = this.dataUser.permisos_doc.filter(e => e.fk_documento == 15);
    let filter = prefict[0]['filtros'].split(',');
    filter = filter[0];

    this.ndventa['notifycation'] = `Se ha generado una nueva nota de débito por un valor de $${parseFloat(this.suma.haber).toFixed(2)} por el usuario ${this.dataUser.nombre}`;
    this.ndventa['abbr_doc'] = prefict[0].codigo;
    this.ndventa['id_document'] = prefict[0].fk_documento;
    this.ndventa['filter_doc'] = filter;
    this.ndventa['usersFilter'] = this.commonServices.filterUserNotification(filter, 15);

    this.egsSrv.saveNotaDebito(this.ndventa).subscribe(res => {
      this.socket.onEmitNotification(this.commonServices.filterUserNotification(filter, 15));
      this.toastr.success(res['message']);
      setTimeout(() => {
        location.reload();
      }, 200);
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  showNotasdebito() {
    if(this.ndventa.fk_agente == 0){
      this.toastr.info("Por favor seleccione un proveedor");
      return;
    }
    const modalInvoice = this.modalService.open(ShowNotasDebitoComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fNotaDebitoCompra;
    modalInvoice.componentInstance.id_document = this.documentDet.id;
    modalInvoice.componentInstance.fk_agente = this.ndventa.fk_agente;
    modalInvoice.componentInstance.editar = this.permisions.editar;
    this.cancel();
  }

  update() {
    this.ndventa['fk_documento'] = this.documentDet.id;
    this.ndventa['detalle'] = this.cuentas;
    this.ndventa['detalleAux'] = this.cuentasAux;
    this.ndventa['ip'] = this.commonServices.getIpAddress();
    this.ndventa['accion'] = `Actualización para nota de débito por un valor de $${parseFloat(this.suma.haber).toFixed(2)} por el usuario ${this.dataUser.nombre}`;
    this.ndventa['id_controlador'] = myVarGlobals.fNotaDebitoCompra;
    this.ndventa['fecha_emision'] = moment(this.ndventa.fecha_emision).format('YYYY-MM-DD');
    this.ndventa['total'] = parseFloat(this.suma.haber);
    this.ndventa['valor_disponible'] = parseFloat(this.suma.haber);
    this.ndventa['telefono'] = this.ndventa['telefono'].toString();

    this.egsSrv.updatedNotaDebito(this.ndventa).subscribe(res => {
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


  closeModalDebito() {
    ($("#modalNDebitoReport") as any).modal("hide");
    this.processingtwo = false;

  }


  reportModalDebito() {
    if (this.permisions.consultar == "0") {
      this.toastr.info("Usuario no tiene permiso para Consultar Nota Débito");
    } else {
      this.processingtwo = true;

      const dialogRef = this.confirmationDialogService.openDialogMat(ReportNotaDebitoInvComponent, {
        width: '1500px', height: 'auto',
        data: { titulo: "Reporte Nota De Débito", latestStatus: this.latestStatus}
        
      } );
   
      dialogRef.afterClosed().subscribe(resultado => {
        if(resultado!=false && resultado!=undefined){
          

          
        }else{
          this.latestStatus = null;
          this.closeModalDebito();
        }
      }); 

    }
  }
}
