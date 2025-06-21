import { Component, OnInit, ViewChild } from '@angular/core';
import * as myVarGlobals from '../../../global';
import { CommonService } from '../../../../app/services/commonServices';
import { CommonVarService } from '../../../../app/services/common-var.services';
import { EgresosService } from './egresos.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import moment from 'moment';
import { CcSpinerProcesarComponent } from '../../../config/custom/cc-spiner-procesar.component';
import { ValidacionesFactory } from '../../../config/custom/utils/ValidacionesFactory';

@Component({
standalone: false,
  selector: 'app-egresos',
  templateUrl: './egresos.component.html',
  styleUrls: ['./egresos.component.scss']
})
export class EgresosComponent implements OnInit {
  processing: any;
  permisions: any;
  dataUser: any;
  arrayProduct: any;
  productSelect: any = 0;
  hoy: Date = new Date;
  fecha = this.hoy.getDate() + '-' + (this.hoy.getMonth() + 1) + '-' + this.hoy.getFullYear();
  hora = this.hoy.getHours() + ':' + this.hoy.getMinutes() + ':' + this.hoy.getSeconds();
  fechaYHora = this.fecha + '  ' + this.hora;
  product: any = { cantidad_solicitada: 0, detalle: { cantidad: 0 } };
  solicitud: any = { fk_departamento: 0, fk_usuario_sol: 0, nombre_solicitante: null, fromDatePicker: new Date };
  dataGrupo: any;
  infoUsers: any;
  empresLogo: any;
  validatePrint = false;
  infoProduct: any = [];

  validaciones: ValidacionesFactory = new ValidacionesFactory();

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  vmButtons: any;
  dateNow: any;

  constructor(
    private egrSrv: EgresosService,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.dateNow = moment(this.hoy).format('YYYY-MM-DD');

    this.vmButtons = [
      { orig: "btnSumEntr", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnSumEntr", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: true, printSection: "print-section", imprimir: true },
      { orig: "btnSumEntr", paramAccion: "", boton: { icon: "fa fa-ban", texto: "CANCELAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];

    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 10);

    this.getPermisions();
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "GUARDAR":

        if (this.infoProduct.length == 0) {
          this.toastr.warning('Por favor añada items al listado');
          return;
        }
        if (this.solicitud.fk_departamento == 0) {
          this.toastr.warning('Por favor seleccionar departamento solicitante');
          return;
        }
        if (this.solicitud.fk_usuario_sol == 0) {
          this.toastr.warning('Por favor seleccionar Usuario Autorizador');
          return;
        }
        this.validateSaveProve();
        break;
      case "IMPRIMIR":
        if (this.infoProduct.length == 0) {
          this.toastr.warning('No existe datos a imprimir');
          return;
        }
        this.printSection();
        break;
      case "CANCELAR":
        this.cancel();
        break;
    }
  }

  getPermisions() {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.empresLogo = this.dataUser.logoEmpresa;
    let id_rol = this.dataUser.id_rol;
    let data = {
      codigo: myVarGlobals.fProveeduriaEgresos,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'][0];
      if (this.permisions.ver == "0") {
        this.lcargando.ctlSpinner(false);
        this.toastr.info("Usuario no tiene Permiso para ver el formulario de egresos de proveeduria");
        this.vmButtons = [];
      } else {
        this.getStockXSucursal();
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getStockXSucursal() {
    this.egrSrv.getStockXSucursal().subscribe(res => {
      this.arrayProduct = res['data'];
      this.getGrupo();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  cancel() {
    this.product = { cantidad_solicitada: 0, detalle: { cantidad: 0 } };
    this.solicitud.fk_departamento = 0;
    this.solicitud.nombre_solicitante = null;
    this.solicitud.fromDatePicker = new Date;
    this.productSelect = 0;
    this.infoProduct = [];
    this.validatePrint = false;
  }

  getGrupo() {
    this.egrSrv.getGrupo().subscribe(res => {
      this.dataGrupo = res['data'];
      this.getUsuario();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getUsuario() {
    this.egrSrv.getUsuario().subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.infoUsers = res['data'];
      this.solicitud.fk_usuario_sol = this.dataUser.id_usuario;
      this.processing = true;
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.processing = true;
      this.toastr.info(error.error.message);
    })
  }

  getDataProduct(event) {
    if (event != 0) {
      this.product = this.arrayProduct.filter(e => e.id == event)[0]
      let validt = false;
      this.infoProduct.forEach(element => {
        if (element.codigo == this.product.codigo) { validt = true; }
      });
      if (validt) {
        Swal.fire({
          title: "Atención!!",
          text: "Este productoya se encuenta en la lista ingresada!",
          icon: 'error',
          confirmButtonColor: '#DC3545',
          confirmButtonText: "Aceptar"
        }).then((result) => {
          if (result.value) {
            this.productSelect = 0;
          }
        })
      } else {
        this.product.cantidad_solicitada = 0;
        setTimeout(() => {
          document.getElementById('idAmount').focus();
        }, 100);
      }
    } else {
      this.product.cantidad_solicitada = 0;
    }
  }

  addProduct() {
    if (this.permisions.agregar == "0") {
      this.toastr.info("Usuario no tiene Permiso para agregar productos");
    } else {
      if (this.productSelect == 0) {
        this.toastr.info("Debe seleccionar un producto");
      } else if (this.solicitud.fk_departamento == 0) {
        this.toastr.info("Debe seleccionar un departamento solicitante");
      } else if (this.solicitud.fk_usuario_sol == 0) {
        this.toastr.info("Debe seleccionar un usuario autorizador");
      } else if (this.product.cantidad_solicitada <= 0) {
        this.toastr.info("La cantidad no puede ser 0 ");
      } else if (this.solicitud.nombre_solicitante == null || this.product.nombre_solicitante == "") {
        this.toastr.info("Debe ingresar un nombre de solicitante");
      } else {
        this.infoProduct.push(this.product);
        this.vmButtons[1].habilitar = false;
        this.productSelect = 0;
        this.product = { cantidad_solicitada: 0, detalle: { cantidad: 0 } };
      }
    }
  }

  deleteItems(i) {
    this.infoProduct.splice(i, 1);
    if (this.infoProduct.length == 0) {
      this.vmButtons[1].habilitar = true;
      this.productSelect = 0;
      this.product = { cantidad_solicitada: 0, detalle: { cantidad: 0 } };
    }
  }

  printSection() {
    if (this.permisions.imprimir == "0") {
      this.toastr.info("Usuario no tiene Permiso para imprimir");
    } else {
      if (this.infoProduct.length == 0) {
        this.toastr.info("Debe ingresar al menos un producto");
      } else {
        this.validatePrint = true;
      }
    }
  }

  getInfoDepartamento(id) {
    let nombre = this.dataGrupo.filter(e => e.id_grupo == id)[0].nombre_grupo;
    return nombre;
  }

  getInfoUusario(id) {
    let nombre = this.infoUsers.filter(e => e.id_usuario == id)[0].nombre;
    return nombre;
  }

  async validateSaveProve() {
    if (this.permisions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      if (this.infoProduct.length == 0) {
        this.toastr.info("Ingrese al menos un producto"); return;
      } else if (!this.validatePrint) {
        Swal.fire({
          title: 'Error!!',
          text: "Debe imprimir el documento, una vez que guarde no podrá imprimirlo",
          icon: 'error',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Ok'
        }).then((result) => {
        })
      } else {
        Swal.fire({
          title: "Atención!!",
          text: "Seguro desea guardar la entrega de proveeduria?",
          icon: 'warning',
          showCancelButton: true,
          cancelButtonColor: '#DC3545',
          confirmButtonColor: '#13A1EA',
          confirmButtonText: "Aceptar"
        }).then((result) => {
          if (result.value) {
            this.save();
          }
        })
      }
    }
  }

  save() {
    this.solicitud['listProduct'] = this.infoProduct;
    this.solicitud['fecha_solicitud'] = moment(this.solicitud.fromDatePicker).format('YYYY-MM-DD');
    this.solicitud.ip = this.commonServices.getIpAddress();
    this.solicitud.accion = `Egresos de productos por el usuario ${this.dataUser.nombre}`;
    this.solicitud.id_controlador = myVarGlobals.fProveeduriaEgresos;
    (this as any).mensajeSpinner = "Guardando...";
    this.lcargando.ctlSpinner(true);
    this.egrSrv.saveEgresProv(this.solicitud).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.toastr.success(res['message']);
      this.cancel();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  validaCantidad() {
    if (this.product.cantidad_solicitada > this.product.detalle.cantidad) {
      setTimeout(() => {
        this.product.cantidad_solicitada = 0;
      }, 3000);
    }
  }

  changerequest(evt) {
    if (evt != 0) {
      document.getElementById('idNamerequest').focus();
    }
  }
}
