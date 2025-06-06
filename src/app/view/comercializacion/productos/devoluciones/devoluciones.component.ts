import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DevolucionesService } from './devoluciones.service'
import * as myVarGlobals from '../../../../global';
import { CommonService } from '../../../../services/commonServices';
import { CommonVarService } from '../../../../services/common-var.services';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Socket } from '../../../../services/socket.service';
import { ShowDevolucionComponent } from './show-devolucion/show-devolucion.component'
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';

@Component({
standalone: false,
  selector: 'app-devoluciones',
  templateUrl: './devoluciones.component.html',
  styleUrls: ['./devoluciones.component.scss']
})
export class DevolucionesComponent implements OnInit {


  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  dataBuy: any = { motivo_dev: 0, tipo_pago: "Tipo", forma_pago: "Forma", estado_dev: "En proceso", asesor: { nombre: "Nombre acesor" }, client: { cupo_credito: "0.00", saldo_credito: "0.00", razon_social: "Nombre cliente" }, name_doc: "Tipo documento" };
  dataTotales = { subTotalPagado: 0.00, ivaPagado: 0.00, totalPagado: 0.00, ivaBase: 0.00, iva0: 0.00 };
  dataProducto = [{ product: { nombre: "Nombre producto" }, code_product: "xxxxxxxxxxx", costo_unitario: 0.00, cant_pendiente: 0.00, cantidad: 0.00, cant_devuelta: 0.00, costo_total: 0.00, pagaIva: 0, cantidadAux: 0.00 }];
  customer: any = { asesor: { nombre: null }, customerSelect: null, cupo_credito: "0.00", saldo_credito: "0.00" };
  actions: any = { btnGuardar: true, btnMod: false };
  permissions: any;
  processing: boolean = false;
  dataUser: any;
  dataDifered: any = null;
  flagBtnDired: any = false;
  prefict: any;
  latestStatus: any;
  dateConverter: any;
  toDatePicker: Date = new Date();
  arrayCustomer: any;
  ivaConverter: any;
  arrayProductos: any;
  num_aut: any = "N/A";
  num_fac: any = "N/A";
  arrayTipoDoc: any;
  arrayMotivo: any;
  causaSelect: any = 0;
  num_doc_search: any = 0;
  observacion: any = "";
  validateNum: any = false;
  total_anterior: any;
  vmButtons: any;
  id_cliente_search: any = 0;
  totalView: any = { total_devolucion: 0, totalPagadoAux: 0 };
  flag: any = false;

  constructor(
    private dvlSrv: DevolucionesService,
    private commonServices: CommonService,
    private commonVarServices: CommonVarService,
    private toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal,
    private socket: Socket,
    private elementRef: ElementRef
  ) {

    this.commonVarServices.updPerm.asObservable().subscribe(res => {
      (res) ? this.lcargando.ctlSpinner(true) : this.lcargando.ctlSpinner(false);
    })

    this.commonVarServices.showDevolutionsListen.asObservable().subscribe(res => {
      this.editDevolution(res);
    })
  }

  async editDevolution(res) {
    this.actions.btnGuardar = false;
    this.actions.btnMod = true;

    this.vmButtons[0].habilitar = true;
    (res.estado_dev == 'Aprobado' || res.estado_dev == 'Anulado') ? this.vmButtons[1].habilitar = true : this.vmButtons[1].habilitar = false;
    (res.estado_dev == 'Aprobado' || res.estado_dev == 'Anulado') ? this.flag = true : this.flag = false;
    this.totalView.total_devolucion = parseFloat('0');
    this.id_cliente_search = res.fk_cliente;
    let result = this.searchSales(this.id_cliente_search).then(resultado => {
      /* console.log(this.arrayFactura,res.num_doc); */
      this.num_doc_search = res.num_doc;
      this.dataBuy = res;
      this.total_anterior = this.dataBuy.total_anterior;
      this.dataTotales.subTotalPagado = this.dataBuy.subtotal;
      this.dataTotales.ivaPagado = this.dataBuy.iva_valor;
      this.dataTotales.totalPagado = this.dataBuy.total;
      this.totalView.total_devolucion = parseFloat(res.total_nota_credito);
      this.totalView.totalPagadoAux = this.dataBuy.total_anterior;
      this.observacion = res.descripcion_dev;
      this.dataProducto = res['details'];
      this.dataProducto.forEach(element => {
        element['costo_total'] = parseFloat(element['costo_total'].toString());
        element['costo_unitario'] = parseFloat(element['costo_unitario'].toString());
        element['cant_pendiente'] = parseFloat(element['cant_pendiente'].toString());
        element['cantidad'] = parseFloat(element['cantidad_vendida'].toString());
        element['cantidadAux'] = parseFloat(element['cantidad_vendida'].toString());
        element['cant_devuelta'] = parseFloat(element['cant_devuelta'].toString());
      });
      this.causaSelect = this.dataBuy.motivo_dev;
      this.toDatePicker = this.dataBuy.fecha_dev;
      this.dataBuy.fecha = this.dataBuy.fecha_venta;
      this.getNameDoc(this.dataBuy.fk_tipo_doc);
      this.dataBuy.estado_dev = (this.dataBuy.estado_dev == undefined) ? "En proceso" : this.dataBuy.estado_dev;
      this.validateNum = true;
    })
  }

  ngOnInit(): void {

    this.vmButtons = [
      { orig: "btnsDevolVentas", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnsDevolVentas", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "MODIFICAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: true },
      { orig: "btnsDevolVentas", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "DEVOLUCIONES" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false },
      { orig: "btnsDevolVentas", paramAccion: "", boton: { icon: "fa fa-pencil-square-o", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];

    //this.elementRef.nativeElement.ownerDocument.body.style = 'background: url(/assets/img/fondo1.jpg);background-size: cover !important;no-repeat;';
    this.dateConverter = moment(this.toDatePicker).format('YYYY-MM-DD');
    setTimeout(() => {
      this.validatePermission();
    }, 50);
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "GUARDAR":
        this.validateSaveDevolution();
        break;
      case "MODIFICAR":
        this.validateUpdate();
        break;
      case "DEVOLUCIONES":
        this.showDevolution();
        break;
      case "CANCELAR":
        this.cancel();
        break;
    }
  }

  validatePermission() {
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    /*obtener el ultimo status*/
    this.prefict = this.dataUser.permisos_doc.filter(e => e.fk_documento == 25);
    if (this.prefict[0]['filtros'] != null && this.prefict[0]['filtros'] != undefined) {
      let filter = this.prefict[0]['filtros'].split(',');
      this.latestStatus = parseInt(filter[filter.length - 1]);
    }

    let params = {
      codigo: myVarGlobals.fDevoluciones,
      id_rol: this.dataUser.id_rol
    }
    this.commonServices.getPermisionsGlobas(params).subscribe(res => {
      this.permissions = res["data"][0];
      if (this.permissions.ver == "0") {
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de Ventas");
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);
      } else {
        this.processing = true;
        this.getCatalogos();
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.processing = true;
    });
  }

  getCatalogos() {
    let data = {
      params: "'MOTIVO DEVOLUCION'"
    }
    this.dvlSrv.getCatalogos(data).subscribe(res => {
      this.arrayMotivo = res['data']['MOTIVO DEVOLUCION'];
      this.getCustomers();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.processing = true
    })
  }

  getCustomers() {
    this.dvlSrv.getCustomers().subscribe(res => {
      this.arrayCustomer = res['data'];
      this.getimpuestos();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.processing = true
    })
  }

  getimpuestos() {
    this.dvlSrv.getImpuestos().subscribe(res => {
      this.ivaConverter = (res['data'][0].valor / 100) * 100;
      this.getTypeDocument();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.processing = true
    })
  }

  getTypeDocument() {
    let data = {
      params: "'V','C'"
    }
    this.dvlSrv.getTypeDocument(data).subscribe(res => {
      this.arrayTipoDoc = res['data']['V'];
      this.lcargando.ctlSpinner(false);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.processing = true;
    })
  }

  getNameDoc(id) {
    this.dataBuy.name_doc = this.arrayTipoDoc.filter(e => e.id = id)[0]['nombre'];
  }

  cancel() {
    this.flag = false;
    this.observacion = "";
    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = true;
    this.id_cliente_search = 0;
    this.causaSelect = 0;
    this.validateNum = false;
    this.num_doc_search = 0;
    this.actions = { btnGuardar: true, btnMod: false };
    this.dataBuy = { motivo_dev: 0, tipo_pago: "Tipo", forma_pago: "Forma", estado_dev: "En proceso", asesor: { nombre: "Nombre acesor" }, client: { cupo_credito: "0.00", saldo_credito: "0.00", razon_social: "Nombre cliente" }, name_doc: "Tipo documento" };
    this.dataTotales = { subTotalPagado: 0.00, ivaPagado: 0.00, totalPagado: 0.00, ivaBase: 0.00, iva0: 0.00 };
    this.totalView = { total_devolucion: 0, totalPagadoAux: 0 }
    this.dataProducto = [{ product: { nombre: "Nombre producto" }, code_product: "xxxxxxxxxxx", costo_unitario: 0.00, cant_pendiente: 0.00, cantidad: 0.00, cant_devuelta: 0.00, costo_total: 0.00, pagaIva: 0, cantidadAux: 0.00 }];
  }

  cancelTwo() {
    /* this.flag = false;
    this.observacion = "";
    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = true; */
    /* this.id_cliente_search = 0; */
    this.causaSelect = 0;
    this.validateNum = false;
    /* this.num_doc_search = 0; */
    /* this.actions = { btnGuardar: true, btnMod: false }; */
    this.dataBuy = { motivo_dev: 0, tipo_pago: "Tipo", forma_pago: "Forma", estado_dev: "En proceso", asesor: { nombre: "Nombre acesor" }, client: { cupo_credito: "0.00", saldo_credito: "0.00", razon_social: "Nombre cliente" }, name_doc: "Tipo documento" };
    this.dataTotales = { subTotalPagado: 0.00, ivaPagado: 0.00, totalPagado: 0.00, ivaBase: 0.00, iva0: 0.00 };
    this.totalView = { total_devolucion: 0, totalPagadoAux: 0 }
    this.dataProducto = [{ product: { nombre: "Nombre producto" }, code_product: "xxxxxxxxxxx", costo_unitario: 0.00, cant_pendiente: 0.00, cantidad: 0.00, cant_devuelta: 0.00, costo_total: 0.00, pagaIva: 0, cantidadAux: 0.00 }];
  }

  sumTotal(index) {
    if (this.dataProducto[index].cant_devuelta > this.dataProducto[index].cantidadAux) {
      this.toastr.info('La cantidad a devolver no debe ser mayor a la vendida');
    } else {
      this.dataProducto[index].cantidad = this.dataProducto[index].cantidadAux;
      this.dataProducto[index].cantidad = this.dataProducto[index].cantidad - this.dataProducto[index].cant_devuelta;
      this.dataTotales.subTotalPagado = parseFloat('0.00');
      this.dataTotales.ivaPagado = parseFloat('0.00');
      this.dataTotales.totalPagado = parseFloat('0.00');
      this.dataTotales.ivaBase = parseFloat('0.00');
      this.dataTotales.iva0 = parseFloat('0.00');
      this.totalView.total_devolucion = parseFloat('0.00');

      this.dataProducto[index].costo_total = parseFloat(this.dataProducto[index].cantidad.toString()) * parseFloat(this.dataProducto[index].costo_unitario.toString());
      this.dataProducto.forEach(element => {
        if (element.pagaIva == 1 && (this.dataBuy.fk_tipo_doc != 8)) {
          this.dataTotales.subTotalPagado = parseFloat(this.dataTotales.subTotalPagado.toString()) + parseFloat(element.costo_total.toString());
          this.dataTotales.ivaBase = parseFloat(this.dataTotales.ivaBase.toString()) + parseFloat(element.costo_total.toString());
        } else {
          this.dataTotales.iva0 = parseFloat(this.dataTotales.iva0.toString()) + parseFloat(element.costo_total.toString());
        }
      });
      this.dataTotales.ivaPagado = parseFloat(this.dataTotales.ivaBase.toString()) * (this.ivaConverter / 100);
      this.dataTotales.subTotalPagado = parseFloat(this.dataTotales.subTotalPagado.toString()) + parseFloat(this.dataTotales.iva0.toString());
      this.dataTotales.totalPagado = parseFloat(this.dataTotales.subTotalPagado.toString()) + parseFloat(this.dataTotales.ivaPagado.toString());
      this.totalView.total_devolucion = parseFloat(this.totalView.totalPagadoAux.toString()) - parseFloat(this.dataTotales.totalPagado.toString())
    }
  }

  async validateSaveDevolution() {
    if (this.permissions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      let resp = await this.validateDataGlobal().then(respuesta => {
        if (respuesta) {
          let prefict = this.dataUser.permisos_doc.filter(e => e.fk_documento == 25);
          let filter = prefict[0]['filtros'].split(',');
          filter = filter[0];
          if (this.commonServices.filterUser(filter, 25)) {
            this.confirmSave("Seguro desea guardar la devolución?", "SAVE_DEVOLUTION");
          } else {
            this.cancel();
            this.toastr.info("Usuario no tiene permiso para hacer devolucion de ventas o los permisos aun no han sido asignados");
          }
        }
      })
    }
  }

  async validateUpdate() {
    if (this.permissions.editar == "0") {
      this.toastr.info("Usuario no tiene permiso para editar la información");
    } else {
      let resp = await this.validateDataGlobal().then(respuesta => {
        if (respuesta) {
          let prefict = this.dataUser.permisos_doc.filter(e => e.fk_documento == 25);
          let filter = prefict[0]['filtros'].split(',');
          filter = filter[0];
          if (this.commonServices.filterUser(filter, 25)) {
            this.confirmSave("Seguro desea editar la devolución?", "UPDATED_DEVOLUTION");
          } else {
            this.cancel();
            this.toastr.info("Usuario no tiene permiso para hacer devolucion de ventas o los permisos aun no han sido asignados");
          }
        }
      })
    }
  }

  validateDataGlobal() {
    let flag = false;
    let c = 0;
    return new Promise((resolve, reject) => {
      if (this.causaSelect == 0) {
        this.toastr.info("Seleccione un motivo de devolución");
        document.getElementById("idMotivo").focus(); return;
      } else if (this.toDatePicker == null) {
        this.toastr.info("Selecione una fecha de devolución");
        document.getElementById("idbtndifered").focus(); return;
      } else if (this.observacion == "") {
        this.toastr.info("Ingrese una observación por el cual se hace la devolución");
        document.getElementById("idobs").focus(); return;
      } else {
        c = 0;
        this.dataProducto.forEach(element => {
          if (this.causaSelect == "Producto pendiente") {
            if (element['cant_devuelta'] > element['cant_pendiente']) {
              c += 1;
              if (c == 1) { this.toastr.info("La cantidad devuelta no puede ser mayor a la pendiente cuando la devolucion es por producto pendiente"); }
              flag = true; return;
            }
          } else {
            if (element['cant_devuelta'] > (element['cantidadAux'] - element['cant_pendiente'])) {
              c += 1;
              if (c == 1) { this.toastr.info(`La cantidad devuelta no puede ser mayor a la cantidad entregada ${element['cantidadAux'] - element['cant_pendiente']}`); }
              flag = true; return;
            }
          }
        });
        (!flag) ? resolve(true) : resolve(false);
      }
    });
  }

  async confirmSave(message, action, infodev?: any) {
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
        if (action == "SAVE_DEVOLUTION") {
          this.saleDevolution();
        } else if (action == "UPDATED_DEVOLUTION") {
          this.updateDevolution();
        }
      }
    })
  }

  saleDevolution() {
    this.lcargando.ctlSpinner(true);
    this.dataBuy['fecha_dev'] = moment(this.toDatePicker).format('YYYY-MM-DD');
    this.dataBuy['motivo_dev'] = this.causaSelect;
    this.dataBuy['descripcion_dev'] = this.observacion;
    this.dataBuy['estado_dev'] = this.dataBuy.estado_dev;
    this.dataBuy['iva_valor'] = this.dataTotales.ivaPagado;
    this.dataBuy['subtotal'] = this.dataTotales.subTotalPagado;
    this.dataBuy['total'] = this.dataTotales.totalPagado;
    this.dataBuy['base_cero'] = this.dataTotales.iva0;
    this.dataBuy['base_iva'] = this.dataTotales.ivaBase;
    this.dataBuy['fk_usuario'] = this.dataUser.id_usuario;
    this.dataBuy['total_anterior'] = this.total_anterior;

    let prefict = this.dataUser.permisos_doc.filter(e => e.fk_documento == 25);
    let filter = prefict[0]['filtros'].split(',');
    filter = filter[0];

    let data = {
      info: this.dataBuy,
      detalle: this.dataProducto,
      ip: this.commonServices.getIpAddress(),
      accion: `Devolución en venta con número de factura ${this.dataBuy.num_doc} por motivo ${this.dataBuy.motivo_dev} por el usuario ${this.dataUser.nombre}`,
      id_controlador: myVarGlobals.fDevoluciones,
      notifycation: `Se ha generado una devolución en venta con número de factura ${this.dataBuy.num_doc} por motivo ${this.dataBuy.motivo_dev} por el usuario ${this.dataUser.nombre}`,
      abbr_doc: prefict[0].codigo,
      id_document: prefict[0].fk_documento,
      filter_doc: filter,
      usersFilter: this.commonServices.filterUserNotification(filter, 25)
    }
    this.dvlSrv.saveDevolucion(data).subscribe(res => {
      this.socket.onEmitNotification(this.commonServices.filterUserNotification(filter, 25));
      this.toastr.success(res['message']);
      Swal.fire({
        title: 'Proceso exitoso!!',
        text: `Será reridigido al proceso de aprobaciones en caso de que necesite ser aprobada esta devolución`,
        icon: 'success',
        confirmButtonColor: '#4DBD74',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        this.router.navigateByUrl('comercializacion/facturacion/aprobaciones');
      })
      this.cancel();
      setTimeout(() => {
        this.getTypeDocument()
      }, 200);
    }, error => {
      this.toastr.info(error.error.message);
    })

  }

  updateDevolution() {
    this.lcargando.ctlSpinner(true);
    this.dataBuy['fecha_dev'] = moment(this.toDatePicker).format('YYYY-MM-DD');
    this.dataBuy['motivo_dev'] = this.causaSelect;
    this.dataBuy['descripcion_dev'] = this.observacion;
    this.dataBuy['estado_dev'] = this.dataBuy.estado_dev;
    this.dataBuy['iva_valor'] = this.dataTotales.ivaPagado;
    this.dataBuy['subtotal'] = this.dataTotales.subTotalPagado;
    this.dataBuy['total'] = this.dataTotales.totalPagado;
    this.dataBuy['base_cero'] = this.dataTotales.iva0;
    this.dataBuy['base_iva'] = this.dataTotales.ivaBase;
    this.dataBuy['fk_usuario'] = this.dataUser.id_usuario;
    this.dataBuy['total_anterior'] = this.total_anterior;

    let prefict = this.dataUser.permisos_doc.filter(e => e.fk_documento == 25);
    let filter = prefict[0]['filtros'].split(',');
    filter = filter[0];

    let data = {
      info: this.dataBuy,
      detalle: this.dataProducto,
      ip: this.commonServices.getIpAddress(),
      accion: `Actualización de devolución en venta con número de factura ${this.dataBuy.num_doc} por motivo ${this.dataBuy.motivo_dev} por el usuario ${this.dataUser.nombre}`,
      id_controlador: myVarGlobals.fDevoluciones,
      notifycation: `Se ha generado una actualización de devolución en venta con número de factura ${this.dataBuy.num_doc} por motivo ${this.dataBuy.motivo_dev} por el usuario ${this.dataUser.nombre}`,
      abbr_doc: prefict[0].codigo,
      id_document: prefict[0].fk_documento,
      filter_doc: filter,
      usersFilter: this.commonServices.filterUserNotification(filter, 25)
    }
    this.dvlSrv.updatedDevolucion(data).subscribe(res => {
      this.socket.onEmitNotification(this.commonServices.filterUserNotification(filter, 25));
      this.toastr.success(res['message']);
      this.cancel();
      setTimeout(() => {
        this.getTypeDocument()
      }, 200);
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  showDevolution() {
    const modalInvoice = this.modalService.open(ShowDevolucionComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' });
  }

  arrayFactura: any = [];
  searchSales(evt) {
    if (this.permissions.consultar == "0") {
      this.toastr.info("Usuario no tiene Permiso para realizar consultas");
    } else {
      this.cancelTwo();
      return new Promise((resolve, reject) => {
        this.lcargando.ctlSpinner(true);
        this.dvlSrv.getVentasDevolucionXCliente({ id_cliente: evt }).subscribe(res => {
          this.lcargando.ctlSpinner(false);
          this.arrayFactura = res['data'];
          this.num_doc_search = 0;
          resolve(true);
        }, error => {
          this.lcargando.ctlSpinner(false);
          resolve(true);
          this.arrayFactura = [];
          this.toastr.info("No se encontro información para este cliente");
        })
      });
    }
  }

  getVentasDevolucion(params) {
    this.cancelTwo();
    if (params != 0) {
      this.dataBuy = [];
      this.dataBuy = this.arrayFactura.filter(e => e.num_doc == params)[0];
      if (this.dataBuy.estado_dev == "En proceso" || this.dataBuy.estado_dev == "Aprobado" && this.vmButtons[0].habilitar == false) {
        this.validateNum = false;
        Swal.fire({
          title: 'Error!!',
          text: "Ya existe una devolución para este documento o la Factura no ha sido cancelada en su totalidad",
          icon: 'error',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Ok'
        }).then((result) => {
        })
      } else {
        setTimeout(() => {
          this.total_anterior = this.dataBuy.total;
          this.dataTotales.subTotalPagado = this.dataBuy.subtotal;
          this.dataTotales.ivaPagado = this.dataBuy.iva_valor;
          this.dataTotales.totalPagado = this.dataBuy.total;
          this.totalView.totalPagadoAux = this.dataBuy.total;
          this.dataProducto = this.dataBuy['quotesdetails'];
          this.dataProducto.forEach(element => {
            element['costo_total'] = element['costo_total'];
            element['costo_unitario'] = element['costo_unitario'];
            element['cant_pendiente'] = element['cant_pendiente'];
            element['cantidad'] = element['cantidad'];
            element['cantidadAux'] = element['cantidad'];
            element['cant_devuelta'] = 0.00;
          });
          this.getNameDoc(this.dataBuy.fk_tipo_doc);
          /* this.dataBuy.estado_dev = (this.dataBuy.estado_dev == undefined) ? "En proceso" : this.dataBuy.estado_dev; */
          this.validateNum = true;
        }, 100);
      }
    }
  }

}
