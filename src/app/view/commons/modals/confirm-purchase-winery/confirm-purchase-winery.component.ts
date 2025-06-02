import { Component, OnInit, Input, NgZone, ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonService } from "../../../../services/commonServices";
import { BodegaComprasService } from "../../../inventario/operativo/bodega-compras/bodega-compras.service";
import { CommonVarService } from '../../../../services/common-var.services';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { Router } from "@angular/router";
import * as moment from "moment";
import * as myVarGlobals from "../../../../global";
import "sweetalert2/src/sweetalert2.scss";
import Swal from 'sweetalert2';
import { MatDialogRef } from '@angular/material/dialog';
import { resolve } from "url";
@Component({
standalone: false,
  selector: "app-confirm-purchase-winery",
  templateUrl: "./confirm-purchase-winery.component.html",
  styleUrls: ["./confirm-purchase-winery.component.scss"],
})
export class ConfirmPurchaseWineryComponent implements OnInit {
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @Input() dt: any;
  products: any;
  permissions: any;
  toDatePicker: Date = new Date();
  fecha: any = moment(this.toDatePicker).format("YYYY-MM-DD HH:mm:ss");
  up: any;
  up_id: any;
  dataUser: any;
  processing: any = false;
  processingtwo: any = false;
  checkinform: any;
  observation: any;
  checkData: any;
  cant: any;
  confDoc: any;
  dcheck: any = true;
  nombre_document: any;
  detalle: any;
  guardar: any = false;

  observacion: any;
  valcon: any;
  va: any;
  contador: any = 0;
  envioDetalle: any;
  prueba: any;
  data
  //dAction: any = true;
  modal: any = {
    save: false,
    cancel: false
  }
  despacho: any;
  upCiudad: any;
  empresLogo: any;
  dtAnterior: Array<any> = [];
  vmButtons: any = [];
  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private zone: NgZone,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private bodegaCompSrv: BodegaComprasService,
    private commonVarSrvice: CommonVarService, private dialogRef: MatDialogRef<ConfirmPurchaseWineryComponent>
  ) {
  }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsConfirmar", paramAccion: "", boton: { icon: "far fa-save", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false, imprimir: false },
      { orig: "btnsConfirmar", paramAccion: "", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false },
    ];

    setTimeout(() => {
      this.up = this.dt;
      this.upCiudad = this.up.ciudad == undefined ? this.upCiudad = "" : this.up.ciudad,
        this.up_id = this.dt.id_compra;
      this.empresLogo = "assets/img/logo-menu.png";
      this.nombre_document = this.dt.tipo_doc_compra;
      this.observacion = this.dt.observacion_confirmacion;
      this.validatePermission();
    }, 10);
  }

  /* validation  */
  validatePermission() {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.lcargando.ctlSpinner(true);
    let params = {
      codigo: myVarGlobals.fBodegaCompras,
      id_rol: this.dataUser.id_rol,
    };
    this.commonServices.getPermisionsGlobas(params).subscribe(
      (res) => {
        this.permissions = res["data"][0];
        if (this.permissions.ver == "0") {
          this.toastr.info("Usuario no tiene Permiso para ver el formulario de Confirmacion de Ingreso");
          this.vmButtons = [];
          this.lcargando.ctlSpinner(false);
        } else {
          this.getAsDetails();
          this.bodegaCompSrv.getDetCompraBodega({
            id: this.dt.id_compra,
          }).subscribe(
            (res) => {
              this.products = res["data"];
              this.products.forEach(element => {
                element['cant_recibida_aux'] = element['cant_recibida'];
              });
              this.lcargando.ctlSpinner(false);
            },
            (error) => {
              this.lcargando.ctlSpinner(false);
            }
          );
        }
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "GUARDAR":
        this.guardarConfirmacion();
        break;
      case "CERRAR":
        this.dialogRef.close(false);
        break;
    }
  }

  getAsDetails() {
    let data = {
      id: this.dt.id_compra,
    };
    this.bodegaCompSrv.getDetCompraBodega(data).subscribe(res => {
      this.dtAnterior = res["data"];
    })
  }


  setProducto(p, index) {
    this.checkData = p;
    if (this.checkData.confirmar == true) {
      this.products[index]["cant_recibida"] = this.checkData.cantidad - this.checkData.cant_recibida_aux;
      (<HTMLInputElement>(document.getElementById("element" + index))).disabled = true;
    }
    else if (this.checkData.confirmar == false) {
      (<HTMLInputElement>(document.getElementById("element" + index))).disabled = false;
      this.products[index]["cant_recibida"] = this.checkData.cant_recibida_aux;
    }
  }

  validateAmount(i) {
    let res = 0;
    res = this.products[i]['cantidad'] - this.products[i]['cant_recibida_aux'];
    if (this.products[i]["cant_recibida"] > res) {
      Swal.fire({
        title: 'Error!!',
        text: `No puede ingresar una cantidad mayor a ${res} que es lo que falta por recibir`,
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Ok'
      }).then((result) => {
        this.products[i]["cant_recibida"] = this.products[i]["cant_recibida_aux"];
      })
    }
  }

  /* guardarConfirmacion() {
    if (this.permissions.guardar == "0") {
      this.toastr.info("Usuario no tiene Permiso para guardar ");
      this.router.navigateByUrl("dashboard");
    }
    else {
          this.confirmSave("Seguro desea guardar el registro?", "SAVE_CARGA");
    }
  } */

  async guardarConfirmacion() {
    if (this.permissions.guardar == "0") {
      this.vmButtons[0].habilitar = true;
      this.toastr.info("Usuario no tiene permiso para guardar");
      this.closeModal();
    } else {
      this.vmButtons[0].habilitar = false;
      let resp = await this.validateDataGlobal().then(respuesta => {
        if (respuesta) {
          this.confirmSave("Seguro desea guardar el registro?", "SAVE_CARGA");
        }
      })
    }
  }

  validateDataGlobal() {
    let flag = false;
    return new Promise((resolve, reject) => {
      this.products.forEach((el, idx, array) => {
        if (el.cant_recibida > el.cantidad) {
          this.toastr.info(`La cantidad a recibir del producto ${el.nombre_producto} no puede ser mayor.`);
          document.getElementById('element' + idx).focus();
          return false;
        }
        else if (el.cant_recibida === 0) {
          this.toastr.info(`La cantidad a recibir del producto ${el.nombre_producto} no puede  ser igual a cero  `);
          document.getElementById('element' + idx).focus();
          return false;
        } else {
          resolve(true);
        }
      })
    });
  }


  saveConfirma() {
    this.lcargando.ctlSpinner(true);
    let dataConf = this.products.filter((e) => e.confirmar == 0);
    if (dataConf.length > 0) {
      this.despacho = 0;
    } else {
      this.despacho = 1;
    }

    let data = {
      fk_compras_cab: this.dt.id_compra,
      observacion_confirmacion: this.observation,
      fecha_confirmacion: this.fecha,
      ip: this.commonServices.getIpAddress(),
      accion: "Confirmación de Facturacion",
      id_controlador: myVarGlobals.fBodegaCompras,
      productInfo: this.products,
      productsAnt: this.dtAnterior,
      despacho: this.despacho
    };

    this.bodegaCompSrv.saveConfirmation(data).subscribe(res => {
      this.toastr.success(res['message']);
      this.lcargando.ctlSpinner(false);
      this.commonVarSrvice.refreshPurchases.next(null);
      this.dialogRef.close(false);
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  async confirmSave(message, action) {
    Swal.fire({
      title: "Atención!!",
      text: message,
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#DC3545",
      confirmButtonColor: "#13A1EA",
      confirmButtonText: "Aceptar",
    }).then((result) => {
      if (result.value) {
        if (action == "SAVE_CARGA") {
          this.saveConfirma();
        }
      }
    });
  }

  clean() {
    this.products.confirmar = '';
  }

  /* actions modals */
  closeModal() {
    this.activeModal.dismiss();
  }
}
