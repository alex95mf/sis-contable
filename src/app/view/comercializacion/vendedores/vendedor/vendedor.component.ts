import { Component, OnInit, ViewChild } from "@angular/core";
import { VendedorService } from "./vendedor.service";
import { CcSpinerProcesarComponent } from "../../../../config/custom/cc-spiner-procesar.component";
import * as myVarGlobals from "../../../../global";
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { CommonService } from "src/app/services/commonServices";
import { CommonVarService } from "src/app/services/common-var.services";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ShowVendedorComponent } from "./show-vendedor/show-vendedor.component";
import { ModalProductComponent } from "./modal-product/modal-product.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import moment from 'moment';
@Component({
standalone: false,
  selector: "app-vendedor",
  templateUrl: "./vendedor.component.html",
  styleUrls: ["./vendedor.component.scss"],
})
export class VendedorComponent implements OnInit {
  
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
   dtOptions: any = {};
  dtTrigger = new Subject();
  vmButtons: any = [];
  dataUser: any;
  permissions: any;
  catalog: any = {};
  vendedor: any = { tip_doc: 0, fk_linea_producto: 0, fk_sucursal: 0 };
  tamDoc: any = 0;
  actions: any = {
    /* new: false, */
    search: false,
    add: true,
    edit: true,
    cancel: true,
    delete: true,
  };
  detalle_contactos: any = [];
  detalle_edit: any;
  dataProductos = [{ nombre: null, codigoProducto: null, marca: null, stock: 0, cantidad_reservada: 0.00, quantity: 0, price: 0.00, totalItems: 0.00, Iva: 0, action: true }];

  constructor(
    private vendedorSrv: VendedorService,
    private commonServices: CommonService,
    private toastr: ToastrService,
    private commonVrs: CommonVarService,
    private modalService: NgbModal
  ) {
    this.commonVrs.listenvendedor.asObservable().subscribe((res) => {
      if (!res.edit) {
        this.detalle_contactos = [];
        this.detalle_contactos = res.arraycontact;
      } else {
        this.detalle_edit = res;
      }
    });

    this.commonVrs.editVendedor.asObservable().subscribe((res) => {
      this.vmButtons[1].habilitar = true;
      this.vmButtons[2].habilitar = false;
      this.vendedor = res;
    });
  }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsVendedor",
        paramAccion: "",
        boton: { icon: "fa fa-floppy-o", texto: "BUSCAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-info boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsVendedor",
        paramAccion: "",
        boton: { icon: "fa fa-pencil-square-o", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsVendedor",
        paramAccion: "",
        boton: { icon: "fa fa-file-pdf-o", texto: "MODIFICAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsVendedor",
        paramAccion: "",
        boton: { icon: "fa fa-floppy-o", texto: "CANCELAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
      },
    ];

    this.vendedor.inicio_actividades = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    this.vendedor.inicio_actividades = new Date().toISOString().split('T')[0];

    setTimeout(() => {
      this.validatePermission();
    }, 50);
  }

  validatePermission() {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    let params = {
      codigo: myVarGlobals.fVendedor,
      id_rol: this.dataUser.id_rol,
    };

    this.commonServices.getPermisionsGlobas(params).subscribe(
      (res) => {
        this.permissions = res["data"][0];
        if (this.permissions.ver == "0") {
          this.toastr.info(
            "Usuario no tiene Permiso para ver el formulario de Clientes"
          );
          this.vmButtons = [];
          this.lcargando.ctlSpinner(false);
        } else {
          setTimeout(() => {
            this.fillCatalog();
          }, 500);
        }
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  fillCatalog() {
    let data = {
      params: "'DOCUMENTO'",
    };
    this.vendedorSrv.getCatalogs(data).subscribe(
      (res) => {
        this.catalog.documents = res["data"]["DOCUMENTO"];
        this.getGroupsProduct();
        this.getSucursalesVendedor();
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  getGroupsProduct() {
    this.vendedorSrv.getGrupos().subscribe(
      (res) => {
        this.catalog.linea = res["data"];
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  getSucursalesVendedor() {
    this.vendedorSrv.getSucursales().subscribe(
      (res) => {
        this.catalog.sucursal = res["data"];
        this.lcargando.ctlSpinner(false);
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  onlyNumber(event): boolean {
    let key = event.which ? event.which : event.keyCode;
    if (key > 31 && (key < 48 || key > 57)) {
      return false;
    }
    return true;
  }

  /* OnChange */
  docValidate(event) {
    document.getElementById("num_documento").focus();
    if (event == "Cedula") {
      this.tamDoc = 10;
    } else if (event == "Ruc") {
      this.tamDoc = 13;
    } else if (event == "Pasaporte") {
      this.tamDoc = 12;
    }
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "BUSCAR":
        this.showVendedores();
        break;
      case "GUARDAR":
        this.validateSaveVendedor();
        break;
      case "MODIFICAR":
        this.validateUpdateVendedor();
        break;
      case "CANCELAR":
        this.CancelForm();
        break;
    }
  }

  CancelForm() {
    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = true;
    this.vmButtons[3].habilitar = false;

    this.commonVrs.clearContact.next(this.actions);
    this.ClearForm();
  }

  ClearForm() {
    this.vendedor = { tip_doc: 0, fk_linea_producto: 0, fk_sucursal: 0 };
    this.dataProductos = [{ nombre: null, codigoProducto: null, marca: null, stock: 0, cantidad_reservada: 0.00, quantity: 0, price: 0.00, totalItems: 0.00, Iva: 0, action: true }];
    this.detalle_contactos = [];
    this.detalle_edit = undefined;
  }

  async validateSaveVendedor() {
    if (this.permissions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      let resp = await this.validateDataGlobal().then((respuesta) => {
        if (respuesta) {
          this.confirmSave(
            "Seguro desea guardar el vendedor?",
            "SAVE_VENDEDOR"
          );
        }
      });
    }
  }

  async validateUpdateVendedor() {
    if (this.permissions.editar == "0") {
      this.toastr.info("Usuario no tiene permiso para editar");
    } else {
      let resp = await this.validateDataGlobal().then((respuesta) => {
        if (respuesta) {
          this.confirmSave(
            "Seguro desea editar la información del vendedor?",
            "EDIT_VENDEDOR"
          );
        }
      });
    }
  }

  validateDataGlobal() {
    let flag = false;
    return new Promise((resolve, reject) => {
      if (this.vendedor.tip_doc == 0) {
        this.toastr.info("Seleccione un tipo de documneto");
        flag = true;
      } else if (
        this.vendedor.num_doc == "" ||
        this.vendedor.num_doc == undefined
      ) {
        this.toastr.info("Ingrese un número de documento");
        flag = true;
      } else if (this.vendedor.fk_linea_producto == 0) {
        this.toastr.info("Seleccione una linea de producto");
        flag = true;
      } else if (
        this.vendedor.nombre == "" ||
        this.vendedor.nombre == undefined
      ) {
        this.toastr.info("Ingrese un nombre");
        flag = true;
      } else if (
        this.vendedor.direccion == "" ||
        this.vendedor.direccion == undefined
      ) {
        this.toastr.info("Ingrese una dirección");
        flag = true;
      } else if (
        this.vendedor.telefono == "" ||
        this.vendedor.telefono == undefined
      ) {
        this.toastr.info("Ingrese teléfono");
        flag = true;
      } else if (
        this.vendedor.provincia == "" ||
        this.vendedor.provincia == undefined
      ) {
        this.toastr.info("Ingrese una provincia");
        flag = true;
      } else if (
        this.vendedor.ciudad == "" ||
        this.vendedor.ciudad == undefined
      ) {
        this.toastr.info("Ingrese una ciudad");
        flag = true;
      } else if (this.vendedor.fk_sucursal == 0) {
        this.toastr.info("Seleccione una sucursal");
        flag = true;
      } else if (
        this.vendedor.presupuesto <= 0 ||
        this.vendedor.presupuesto > 100000 ||
        this.vendedor.presupuesto == undefined
      ) {
        this.toastr.info("Ingrese un presupuesto válido");
        flag = true;
      } else if (this.vendedor.inicio_actividades == undefined) {
        this.toastr.info("Ingrese la fecha de inicio de actividades");
        flag = true;
      }
      !flag ? resolve(true) : resolve(false);
    });
  }

  async confirmSave(message, action, infodev?: any) {
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
        if (action == "SAVE_VENDEDOR") {
          this.saveVendedor();
        } else if (action == "EDIT_VENDEDOR") {
          this.updateVendedor();
        }
      }
    });
  }

  saveVendedor() {
    this.vendedor["ip"] = this.commonServices.getIpAddress();
    this.vendedor["accion"] = `Ingreso de vendedor`;
    this.vendedor["id_controlador"] = myVarGlobals.fVendedor;
    this.vendedor["detalle"] = this.detalle_contactos;
    this.vendedorSrv.saveVendedor(this.vendedor).subscribe(
      (res) => {
        this.toastr.success(res["message"]);
        this.CancelForm();
      },
      (error) => {
        this.toastr.info(error.error.message);
      }
    );
  }

  updateVendedor() {
    this.vendedor["ip"] = this.commonServices.getIpAddress();
    this.vendedor["accion"] = `Actualización de vendedor`;
    this.vendedor["id_controlador"] = myVarGlobals.fVendedor;

    if (this.detalle_edit != undefined) {
      this.vendedor["detalle"] = this.detalle_edit.arraycontact;
      this.vendedor["deleteVendedor"] = this.detalle_edit.deleteContac;
      this.vendedor["edit"] = true;
    } else {
      this.vendedor["edit"] = false;
    }
    this.vendedorSrv.updateVendedor(this.vendedor).subscribe(
      (res) => {
        this.toastr.success(res["message"]);
        this.CancelForm();
      },
      (error) => {
        this.toastr.info(error.error.message);
      }
    );
  }

  showVendedores() {
    const modalInvoice = this.modalService.open(ShowVendedorComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fVendedor;
    modalInvoice.componentInstance.editar = this.permissions.editar;
    modalInvoice.componentInstance.eliminar = this.permissions.eliminar;
    this.ClearForm();
  }

  addProduct() {
    if (this.permissions.agregar == "0") {
      this.toastr.info("Usuario no tiene permiso para agregar");
    } else {
      localStorage.setItem('dataProductsInvoice', JSON.stringify(this.dataProductos));
      const modalInvoice = this.modalService.open(ModalProductComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' });
      modalInvoice.componentInstance.module = this.permissions.id_modulo;
      modalInvoice.componentInstance.component = 112;
      //modalInvoice.componentInstance.productQuotes = this.arraDetQuote;
      modalInvoice.componentInstance.userGroup = 1;
    }
  }

  deleteItems(index) {
    if (this.permissions.eliminar == "0") {
      this.toastr.info("Usuario no tiene permiso para eliminar");
    } else {
      this.dataProductos[index]['action'] = false;
      this.dataProductos[index]['quantity'] = 0;
      this.dataProductos[index]['price'] = this.dataProductos[index]['PVP'];
      this.dataProductos[index]['totalItems'] = 0.00;
      this.dataProductos[index]['totalAux'] = parseFloat('0.00').toFixed(4);

      /*this.dataProductos.forEach(element => {
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
      this.valueLethers = this.commonVarServices.NumeroALetras(this.dataTotales.totalPagado, false);*/
    }
  }

}
