import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../../../../../app/services/commonServices';
import { CommonVarService } from '../../../../../app/services/common-var.services';
import { SeguridadService } from '../../../panel-control/accesos/seguridad/seguridad.service';
import { ToastrService } from 'ngx-toastr';
import * as myVarGlobals from '../../../../global';
import { Router } from '@angular/router';
import moment from 'moment';
import { OrdenesService } from './ordenes.service';
import { AnexosDocComponent } from '../../../commons/modals/anexos-doc/anexos-doc.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../../environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ShowOrderComponent } from './show-order/show-order.component';
import { Socket } from '../../../../services/socket.service';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
declare const $: any;

@Component({
standalone: false,
  selector: 'app-ordenes',
  templateUrl: './ordenes.component.html',
  styleUrls: ['./ordenes.component.scss']
})
export class OrdenesComponent implements OnInit {

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();

  processing: any;
  dataEmpresa: any = {};
  dataUser: any;
  descriptionAnulated: any;

  arrayProveedor: any;
  arrayUsers: any;
  permisions: any;
  toDatePicker: Date = new Date();
  fecha: any = moment(this.toDatePicker).format('YYYY-MM-DD HH:mm:ss');

  /*user*/
  UserSelect: any = 0;
  moduloUser: any = "";
  emailUser: any = "";
  flagUser: any = true;

  /*edit users*/
  editname: any;
  editPerfil: any;
  editCorreo: any;
  observacion: any;
  filtClient: any;

  /*providers*/
  providersSelec: any = 0;
  nomComerPro: any;
  direccionPro: any;
  lineaPro: any;
  telefonoPro: any;
  wsPro: any;

  /*productos*/
  dataProducto = [{ productSelect: 0, codigo: null, description: null, quantity: 0, price: 0.00, totalItems: 0.00, Iva: 0 }];
  arrayProductos: any;
  //productSelect:any;

  /*totales*/
  iva: any;
  ivaConverter: any;
  dataTotales = { subTotalPagado: 0.00, ivaPagado: 0.00, totalPagado: 0.00, ivaBase: 0.00, iva0: 0.00 };
  condiciones: any;
  filters: any = [];
  fields: Object = { text: 'sec', value: 'id' };
  waterMark: string = '  Filtros de solicitud';
  selectFilters: any;
  anexoAdd: any = [];
  emailExist: any;

  /*data table */
  validaDtOrder: any = false;
  dataOrder: any;
  contador: any = 0;
  NexPermisions: any;
  latestStatus: any;
  varDeleteOrde: any;
  position: any = false;
  prefict: any;
  vmButtons: any;

  /*actions*/
  actions: any = { btnNuevo: false, btnGuardar: false, btnEnviar: false, btncancelar: false, btnDescargar: false, dComponet: false };

  /*validateBtnSave */
  btnSave: any = false;

  constructor(private commonServices: CommonService,
    private seguridadServices: SeguridadService,
    private toastr: ToastrService,
    private router: Router,
    private ordenesServices: OrdenesService,
    private modalService: NgbModal,
    private commonVarSrvice: CommonVarService,
    private socket: Socket) {
    this.commonVarSrvice.setDocOrder.asObservable().subscribe(res => {
      this.anexoAdd = [];
      this.anexoAdd = res;
    })
    this.commonVarSrvice.setPosition.asObservable().subscribe(res => {
      this.position = res;
    })

    this.commonVarSrvice.updPerm.asObservable().subscribe(res => {
      (res) ? this.lcargando.ctlSpinner(true) : this.lcargando.ctlSpinner(false);
    })

    this.commonServices.onHandleNotification.asObservable().subscribe(res => {
      if (this.contador == 0) {
        this.contador += 1;
        this.dtElement.dtInstance.then((dtInstance: any) => {
          dtInstance.destroy();
          this.getDataTableOrder();
        });
      }
    })
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "NUEVO":
        this.newOrder();
        break;
      case "GUARDAR":
        this.validaSaveOrder();
        break;
      case "CANCELAR":
        this.delete();
        break;
    }
  }

  ngOnInit(): void {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));

    this.vmButtons = [
      { orig: "btnsOrdenCompra", paramAccion: "", boton: { icon: "fa fa-plus-square-o", texto: "NUEVO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false },
      { orig: "btnsOrdenCompra", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: true },
      { orig: "btnsOrdenCompra", paramAccion: "", boton: { icon: "fa fa-times", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];

    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 50);

    /*obtener el ultimo status*/
    this.prefict = this.dataUser.permisos_doc.filter(e => e.fk_documento == 5);
    if (this.prefict[0]['filtros'] != null && this.prefict[0]['filtros'] != undefined) {
      let filter = this.prefict[0]['filtros'].split(',');
      this.latestStatus = parseInt(filter[filter.length - 1]);
    }
    /*fin*/

    let id_rol = this.dataUser.id_rol;
    let data = {
      codigo: myVarGlobals.fOrdenesCompra,
      id_rol: id_rol
    }
    this.seguridadServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'][0];
      if (this.permisions.ver == "0") {
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de Ordenes de compra");
        this.vmButtons = [];
        this.lcargando.ctlSpinner(false);
      } else {
        (this.permisions.descargar == "0") ? this.actions.btnDescargar = false : this.actions.btnDescargar = true;
        this.getEmpresa();
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  callSection(data) {
    let id = "#" + data;
    let x = document.querySelector(id);
    if (x) {
      setTimeout(() => {
        x.scrollIntoView();
      }, 150);
    }
  }

  getEmpresa() {
    this.seguridadServices.getEmpresa().subscribe(res => {
      this.dataEmpresa.empresa = res['data'];
      this.getSucursales();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.processing = true;
      this.toastr.info(error.error.message);
    })
  }

  getSucursales() {
    let data = {
      id_empresa: this.dataUser.id_empresa
    }
    this.ordenesServices.getSucursales(data).subscribe(res => {
      this.dataEmpresa.suscursales = res['data'];
      this.filterDataEmpresaSucursal();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.processing = true;
      this.toastr.info(error.error.message);
    })
  }

  filterDataEmpresaSucursal() {
    this.dataEmpresa.filterEmpresa = this.dataEmpresa.empresa.filter(e => e.id_empresa == this.dataUser.id_empresa);
    this.dataEmpresa.filterSucursal = this.dataEmpresa.suscursales.filter(e => e.id_sucursal == this.dataUser.id_sucursal);
    this.getProveedores();
  }

  getProveedores() {
    this.ordenesServices.getProveedores().subscribe(res => {
      this.arrayProveedor = res['data'];
      this.getEmpleado();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.processing = true;
      this.toastr.info(error.error.message);
    })
  }

  getEmpleado() {
    this.ordenesServices.getEmpleado().subscribe(res => {
      this.arrayUsers = res['data'];
      this.getProductos();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.processing = true;
      this.toastr.info(error.error.message);
    })
  }

  getProductos() {
    let data = {
      clase: ['Productos', 'Servicios']
    }
    this.ordenesServices.searchProduct(data).subscribe(res => {
      this.arrayProductos = res['data'];
      this.getimpuestos();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.processing = true;
      this.toastr.info(error.error.message);
    })
  }

  getimpuestos() {
    this.ordenesServices.getImpuestos().subscribe(res => {
      this.iva = res['data'][0];
      this.iva = this.iva.valor;
      this.ivaConverter = (this.iva / 100) * 100;
      this.getSolicitudes();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.processing = true;
      this.toastr.info(error.error.message);
    })
  }

  getSolicitudes() {
    let data = {
      id: 4
    }
    this.ordenesServices.geSolicitudes(data).subscribe(res => {
      this.filters = res['data'];
      this.getDataTableOrder();
    }, error => {
      this.getDataTableOrder();
      this.processing = true;
    })
  }

  getSolicitudesAux() {
    let data = {
      id: 4
    }
    this.ordenesServices.geSolicitudes(data).subscribe(res => {
      this.filters = res['data'];
    }, error => {
      this.processing = true;
    })
  }




  getDataTableOrder() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 8,
      search: true,
      paging: true,
      order: [[ 0, "desc" ]],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };
    this.ordenesServices.presentaTablaOrder()
      .subscribe(res => {
        this.processing = true;
        this.validaDtOrder = true;
        this.dataOrder = res['data'];
        if (this.position) {
          setTimeout(() => {
            this.callSection('tudiv');
          }, 500);
        }
        setTimeout(() => {
          this.dtTrigger.next(null);
          this.lcargando.ctlSpinner(false);
        }, 50);
      }, error => {
        this.validaDtOrder = true;
        this.dataOrder = [];
        setTimeout(() => {
          this.dtTrigger.next(null);
          this.lcargando.ctlSpinner(false);
        }, 50);
      });
  }

  nexStatus(dt) {
    if (this.permisions.editar == "0") {
      this.toastr.info("Usuario no tiene Permiso para actualizar el estado");
    } else {
      let permission = this.commonServices.filterPermissionStatus(dt.filter_doc, 5);
      this.NexPermisions = this.commonServices.filterNexStatus(dt.filter_doc, 5);
      if (permission) {
        this.confirmSave("Seguro desea cambiar de estado de la orden?", "MOD_ORDER", dt);
      } else {
        this.toastr.info("Usuario no tiene Permiso para cambiar al siguiente estado o los permisos aún no han sido asignados");
      }
    }
  }

  getFilterProveedor(evt) {
    let filt = this.arrayProveedor.filter(e => e.id_proveedor == evt);
    filt = filt[0];
    if (filt != undefined) {
      this.nomComerPro = filt.nombre_comercial_prov;
      this.direccionPro = filt.direccion;
      this.lineaPro = filt.linea;
      this.telefonoPro = filt.telefono;
      this.wsPro = filt.website;
    } else {
      this.providersSelec = undefined;
      this.nomComerPro = "";
      this.direccionPro = "";
      this.lineaPro = "";
      this.telefonoPro = "";
      this.wsPro = "";
    }
  }

  getFilterUser(evt) {
    this.filtClient = this.arrayUsers.filter(e => e.id_personal == evt);
    this.filtClient = this.filtClient[0];
    if (this.filtClient != undefined) {
      this.moduloUser = this.filtClient.cargo;
      this.emailUser = this.filtClient.email;
    } else {
      this.moduloUser = "";
      this.emailUser = "";
    }
  }

  changeAction() {
    this.flagUser = !this.flagUser;
    this.editname = "";
    this.editPerfil = "";
    this.editCorreo = "";
  }

  getDataProduct(evt, index) {
    if (evt != 0) {
      let filt = this.arrayProductos.filter(e => e.id_producto == evt);
      filt = filt[0];
      let validt = false;
      this.dataProducto.forEach(element => {
        if (element.codigo == filt.codigoProducto) { validt = true; }
      });
      if (validt) {
        Swal.fire(
          'Atención!',
          'Este producto ya se encuenta en la lista ingresada!',
          'error'
        )
      } else {
        /* this.dataProducto[index].price = filt.PVP; */
        this.dataProducto[index].price = 0.00;
        this.dataProducto[index].codigo = filt.codigoProducto;
        this.dataProducto[index].Iva = filt.Iva;
        setTimeout(() => {
          document.getElementById('idAmount').focus();
        }, 50);
      }
    }/* else{

    } */
  }

  sumTotal(index) {
    this.dataTotales.subTotalPagado = 0.00;
    this.dataTotales.ivaPagado = 0.00;
    this.dataTotales.totalPagado = 0.00;
    this.dataTotales.ivaBase = 0.00;
    this.dataTotales.iva0 = 0.00;

    /* this.dataProducto[index].totalItems = this.dataProducto[index].quantity * this.dataProducto[index].price;
    this.dataProducto.forEach(element => {
      this.dataTotales.subTotalPagado += element.totalItems;
    });
    this.dataTotales.ivaPagado = this.dataTotales.subTotalPagado * (this.ivaConverter / 100);
    this.dataTotales.totalPagado = this.dataTotales.subTotalPagado + this.dataTotales.ivaPagado; */

    this.dataProducto[index].totalItems = this.dataProducto[index].quantity * this.dataProducto[index].price;
    this.dataProducto.forEach(element => {
      if (element.Iva == 1) {
        this.dataTotales.subTotalPagado += element.totalItems;
        this.dataTotales.ivaBase += element.totalItems;
      } else {
        this.dataTotales.iva0 += element.totalItems;
      }
    });
    this.dataTotales.ivaPagado = this.dataTotales.ivaBase * (this.ivaConverter / 100);
    this.dataTotales.subTotalPagado += this.dataTotales.iva0;
    this.dataTotales.totalPagado = this.dataTotales.subTotalPagado + this.dataTotales.ivaPagado;

  }

  addItems() {
    if (this.permisions.agregar == "0") {
      this.toastr.info("Usuario no tiene permiso para agregar");
    } else {
      let items = { productSelect: 0, codigo: null, description: null, quantity: 0, price: 0.00, totalItems: 0.00, Iva: 0 };
      this.dataProducto.push(items);
    }
  }

  deleteItems(index) {
    if (this.permisions.eliminar == "0") {
      this.toastr.info("Usuario no tiene permiso para eliminar");
    } else {
      this.dataTotales.subTotalPagado = 0.00;
      this.dataTotales.ivaPagado = 0.00;
      this.dataTotales.totalPagado = 0.00;
      this.dataTotales.ivaBase = 0.00;
      this.dataTotales.iva0 = 0.00;

      this.dataProducto.splice(index, 1);

      /* this.dataProducto.forEach(element => {
        this.dataTotales.subTotalPagado += element.totalItems;
      });
      this.dataTotales.ivaPagado = this.dataTotales.subTotalPagado * (this.ivaConverter / 100);
      this.dataTotales.totalPagado = this.dataTotales.subTotalPagado + this.dataTotales.ivaPagado; */

      this.dataProducto.forEach(element => {
        if (element.Iva == 1) {
          this.dataTotales.subTotalPagado += element.totalItems;
          this.dataTotales.ivaBase += element.totalItems;
        } else {
          this.dataTotales.iva0 += element.totalItems;
        }
      });
      this.dataTotales.ivaPagado = this.dataTotales.ivaBase * (this.ivaConverter / 100);
      this.dataTotales.subTotalPagado += this.dataTotales.iva0;
      this.dataTotales.totalPagado = this.dataTotales.subTotalPagado + this.dataTotales.ivaPagado;

    }
  }

  showAnexosProduct() {
    this.anexoAdd = [];
    var params = { module: this.permisions.id_modulo, component: myVarGlobals.fSolicitud }
    const modalInvoice = this.modalService.open(AnexosDocComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' });
    modalInvoice.componentInstance.params = params;
  }

  newOrder() {
    this.actions.dComponet = true;
    this.actions.btncancelar = true;
    this.actions.btnGuardar = true;
    this.actions.btnNuevo = true;

    this.vmButtons[0].habilitar = true;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = false;
  }


  delete() {
    this.actions.dComponet = false;
    this.actions.btnGuardar = false;
    this.actions.btnEnviar = false;
    this.actions.btnNuevo = false;

    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = true;
    this.vmButtons[2].habilitar = true;

    this.dataProducto = [{ productSelect: 0, codigo: null, description: null, quantity: 0, price: 0.00, totalItems: 0.00, Iva: 0 }];
    this.nomComerPro = "";
    this.direccionPro = "";
    this.lineaPro = "";
    this.telefonoPro = "";
    this.wsPro = "";
    this.UserSelect = 0;
    this.moduloUser = "";
    this.emailUser = "";
    this.flagUser = true;
    this.editname = "";
    this.editPerfil = "";
    this.editCorreo = "";
    this.providersSelec = 0;
    this.observacion = "";
    this.dataTotales = { subTotalPagado: 0.00, ivaPagado: 0.00, totalPagado: 0.00, ivaBase: 0.00, iva0: 0.00 };
    this.selectFilters = undefined;
    this.anexoAdd = [];
    this.condiciones = "";
    this.contador = 0;
  }

  validateDataGlobal() {
    let flag = false;
    let c = 0;
    return new Promise((resolve, reject) => {
      /* if(this.selectFilters == undefined){
        this.toastr.info("seleccione una solicitus de referencia");
        document.getElementById("idsolrefer").focus();
      }else */ if (this.providersSelec == 0) {
        this.toastr.info("seleccione un proveedor");
        document.getElementById("IdProvidersDoc").focus();
      } else if (this.flagUser && this.UserSelect == 0) {
        this.toastr.info("seleccione un cliente a enviar");
        document.getElementById("IdRolesUsersDoc").focus();
      } else if (!this.flagUser && (this.editname == undefined || this.editname == "")) {
        this.toastr.info("Ingrese un nombre de cliente");
        document.getElementById("edtname").focus();
      } else if (!this.flagUser && (this.editPerfil == undefined || this.editPerfil == "")) {
        this.toastr.info("Ingrese un cargo de cliente");
        document.getElementById("edtmod").focus();
      } else if (!this.flagUser && (this.editCorreo == undefined || this.editCorreo == "")) {
        this.toastr.info("Ingrese un correo de cliente");
        document.getElementById("edtemail").focus();
      } else if (!this.flagUser && !this.validarEmail(this.editCorreo)) {
        this.toastr.info("Ingrese un correo válido de cliente");
        document.getElementById("edtemail").focus();
      } else if (this.observacion == undefined || this.observacion == "") {
        this.toastr.info("Ingrese una observación");
        document.getElementById("txobserva").focus();
      } else if (this.dataProducto.length == 0) {
        this.toastr.info("Ingrese al menos un producto");
      } /* else if (this.anexoAdd.length == 0) {
        this.toastr.info("Debe adjuntar una solicitud aprobada previo a la creación de esta orden de compra");
      } else if (this.condiciones == "" || this.condiciones == undefined) {
        this.toastr.info("Ingrese una condición");
        document.getElementById("idCondition").focus();
      } */ else {
        c = 0;
        for (let index = 0; index < this.dataProducto.length; index++) {
          if (this.dataProducto[index].productSelect == 0) {
            c += 1;
            if (c == 1) { this.toastr.info("Falta de seleccionar un producto"); }
            flag = true; return;

          } /* else if (this.dataProducto[index].description == null || this.dataProducto[index].description == "") {
            this.toastr.info("El campo descripción en los productos no puede ser vacio");
            flag = true; break;
          } */ else if (this.dataProducto[index].quantity == 0) {
            c += 1;
            if (c == 1) { this.toastr.info("Revise la cantidad de los productos, no puede estar vacio o ser 0"); }
            flag = true; return;
          } else if (this.dataProducto[index].price == 0.00) {
            c += 1;
            if (c == 1) { this.toastr.info("Revise el precio de los productos, no puede estar vacio o ser 0"); }
            flag = true; return;
          }
        }
        if (!flag && !this.flagUser) {
          let data = {
            email: this.editCorreo
          }
          this.ordenesServices.getEmailExist(data).subscribe(res => {
            if (res['data'].length == 0) {
              this.emailExist = false;
              resolve(true);
            } else {
              this.emailExist = true;
              this.toastr.info("El correo ya existe");
              document.getElementById("edtemail").focus(); return;
            }
          })
        } else {
          (!flag) ? resolve(true) : resolve(false);
        }
      }
    });
  }

  async validaSaveOrder() {
    if (this.permisions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      let resp = await this.validateDataGlobal().then(respuesta => {
        if (respuesta) {
          let prefict = this.dataUser.permisos_doc.filter(e => e.fk_documento == 5);
          let filter = prefict[0]['filtros'].split(',');
          filter = filter[0];
          if (this.commonServices.filterUser(filter, 5)) {
            this.confirmSave("Seguro desea guardar la orden?", "SAVE_ORDER");
          } else {
            this.delete();
            this.toastr.info("Usuario no tiene permiso para crear una orden");
          }
        }
      })
    }
  }

  async confirmSave(message, action, order?: any) {
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
        if (action == "SAVE_ORDER") {
          this.btnSave = true;
          this.processing = false;
          this.saveOrder();
        } else if (action == "DELETE_ORDER") {
          ($('#exampleModal') as any).modal('hide'); /* linea para cerrar el modal de boostrap */
          this.processing = false;
          this.anularOrder(order);
        } else if (action == "MOD_ORDER") {
          this.processing = false;
          this.modOrder(order);
        }
      }
    })
  }

  modOrder(order) {
    this.lcargando.ctlSpinner(true);
    let data = {
      nexPermi: this.NexPermisions,
      id: order.id,
      ip: this.commonServices.getIpAddress(),
      accion: `Cambio de estado de la orden con id ${order.id}`,
      id_controlador: myVarGlobals.fOrdenesCompra,
      filter_doc: this.NexPermisions,
      id_document: 5,
      abbr_doc: this.dataUser.permisos_doc.filter(e => e.fk_documento == 5)[0].codigo,
      notifycation: `Se ha cambiado de estado a la orden de compra por el usuario ${this.dataUser.nombre}`,
      secuence: order.secuence
    }

    let prefict = this.dataUser.permisos_doc.filter(e => e.fk_documento == 5);
    let filter = prefict[0]['filtros'].split(',');
    filter = filter[0];
    let currentStatus = this.commonServices.filterNexStatus(filter, 5);
    if (parseInt(this.latestStatus) != parseInt(currentStatus)) {
      data['usersFilter'] = this.commonServices.filterUserNotification(filter, 5);
      data['usersAprobated'] = null;
      data['idUserAprobated'] = null;
    } else {
      data['usersFilter'] = Array.from(new Set(this.commonServices.allUserNotification(5)));
      data['usersAprobated'] = this.dataUser.nombre;
      data['idUserAprobated'] = this.dataUser.id_usuario;
    }

    this.ordenesServices.updatePermissions(data).subscribe(res => {
      this.delete();
      this.lcargando.ctlSpinner(false);
      this.processing = true;
      this.socket.onEmitNotification(data['usersFilter']);
      this.toastr.success(res['message']);
      setTimeout(() => {
        this.getSolicitudesAux();
      }, 100);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.processing = true;
      this.toastr.info(error.error.message);
    })

  }


  saveOrder() {
    this.lcargando.ctlSpinner(true);
    let prefict = this.dataUser.permisos_doc.filter(e => e.fk_documento == 5);
    let filter = prefict[0]['filtros'].split(',');
    filter = filter[0];

    let data = {
      id_empresa: this.dataEmpresa.filterEmpresa[0].id_empresa,
      id_sucursal: this.dataEmpresa.filterSucursal[0].id_sucursal,
      id_proveedor: this.providersSelec,
      /* id_anexos: this.anexoAdd.id_anexos, */
      num_anexo: Number(this.anexoAdd.length),
      id_cliente: (this.flagUser) ? this.filtClient.id_personal : 0,
      nombre_cliente: (this.flagUser) ? this.filtClient.nombres : this.editname,
      cargo_cliente: (this.flagUser) ? this.moduloUser : this.editPerfil,
      correo_cliente: (this.flagUser) ? this.emailUser : this.editCorreo,
      observacion: this.observacion,
      condiciones: this.condiciones,
      totales: this.dataTotales,
      ref_solicitudes: this.selectFilters,
      list_product: this.dataProducto,
      ip: this.commonServices.getIpAddress(),
      accion: "creación de nueva orden de compra",
      id_controlador: myVarGlobals.fOrdenesCompra,
      notifycation: `Se ha generado una nueva orden compra por el usuario ${this.dataUser.nombre}`,
      abbr_doc: prefict[0].codigo,
      id_document: prefict[0].fk_documento,
      filter_doc: filter,
      usersFilter: this.commonServices.filterUserNotification(filter, 5),
      id_us_aprob: null,
      name_us_aprob: null
    }

    this.ordenesServices.saveOrdersBuy(data).subscribe(res => {
      this.saveAnexo(res['data'], "N");
      this.socket.onEmitNotification(this.commonServices.filterUserNotification(filter, 5));

      this.lcargando.ctlSpinner(false);
      this.processing = true;
      this.socket.onEmitNotification(data['usersFilter']);
      setTimeout(() => {
        this.getSolicitudesAux();
      }, 100);

    }, error => {
      this.processing = true;
      this.btnSave = false;
      this.toastr.info(error.error.message);
    })
  }


  timer: any;
  valida: boolean = false;
  saveAnexo(res: any, tipo) {

    if (this.anexoAdd.length > 0) {
      let params = {};
      if (tipo == "N") {
        params = {
          description: "Ingreso de Anexo de orden de compra",
          module: this.permisions.id_modulo,
          component: myVarGlobals.fOrdenesCompra,
          identifier: res.id_orden,
          ip: this.commonServices.getIpAddress(),
          accion: `Registro de anexos de orden de compra ${res.secuencia.toString().padStart(10, '0')} `,
          id_controlador: myVarGlobals.fOrdenesCompra,
        };
      }

      let contador: any = 0;
      for (let j = 0; j < this.anexoAdd.length; j++) {
        let fileItem = this.anexoAdd[j]._file;
        this.ordenesServices.fileService(fileItem, params).subscribe((res) => {
          contador++;
          if (contador == this.anexoAdd.length) {
            this.toastr.success("Proceso éxitoso");
            this.delete();
          }
        }, (error) => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.message);
        });
      }
    } else {
      this.delete();
      this.lcargando.ctlSpinner(false);
      this.toastr.success("Proceso éxitoso");
    }
  }

  validarEmail(valor) {
    if (/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(valor)) {
      return true;
    } else {
      return false;
    }
  }

  validarEmailExist(email, table) {
    let data = {
      email: email
    }
    this.ordenesServices.getEmailExist(data).subscribe(res => {
      if (res['data'].length == 0) {
        this.emailExist = false;
      } else {
        this.emailExist = true;
      }
    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  validateDeleteOrder() {
    if (this.permisions.eliminar == "0") {
      this.toastr.info("Usuario no tiene permiso de administración para anular Orden ");
    } else {
      /* let permission = this.commonServices.filterPermissionStatus(dt.filter_doc,5);
      this.NexPermisions = this.commonServices.filterNexStatus(dt.filter_doc,5);
      if(permission){
        this.confirmSave("Seguro desea anular la orden?","DELETE_ORDER",dt);
      }else{
        this.toastr.info("Usuario no puede anular la orden");
      }  */
      if (this.descriptionAnulated == "" || this.descriptionAnulated == undefined) {
        document.getElementById('idDesOrderAnulared').focus();
        this.toastr.info("Ingrese un motivo para anular la orden");
      } else {
        this.confirmSave("Seguro desea anular la orden?", "DELETE_ORDER", this.varDeleteOrde);
      }
    }
  }

  setOrder(dt) {
    $('#exampleModal').appendTo("body").modal('show');
    this.varDeleteOrde = dt;
  }

  anularOrder(dt) {
    this.lcargando.ctlSpinner(true);
    let data = {
      id: dt.id,
      ip: this.commonServices.getIpAddress(),
      accion: this.descriptionAnulated,
      id_controlador: myVarGlobals.fOrdenesCompra
    }
    this.contador = 0;
    this.ordenesServices.deleteOrder(data).subscribe(res => {
      this.toastr.success(res['message']);
      this.validaDtOrder = false;
      this.dataOrder = [];
      this.processing = true;
      this.delete();
      this.processing = true;
      this.socket.onEmitNotification(data['usersFilter']);
      this.toastr.success(res['message']);
      setTimeout(() => {
        this.dtElement.dtInstance.then((dtInstance: any) => {
          dtInstance.destroy();
          this.getSolicitudes();
        });
      }, 300);

    }, error => {
      this.toastr.info(error.error.message);
    })
  }

  showOrder(dt) {
    const modalInvoice = this.modalService.open(ShowOrderComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' });
    modalInvoice.componentInstance.order = dt;
    modalInvoice.componentInstance.params = { componente: myVarGlobals.fOrdenesCompra, permSendMail: this.permisions.enviar, perDowload: this.permisions.descargar, preficOrder: this.dataUser.permisos_doc.filter(e => e.fk_documento == 5)[0].codigo, iva: this.ivaConverter, ruc: this.dataEmpresa.filterEmpresa[0].ruc };
  }

}
