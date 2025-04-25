import { Component, OnInit, ViewChild } from "@angular/core";
import { DistribuidorService } from "./distribuidor.service";
import { CcSpinerProcesarComponent } from "../../../../config/custom/cc-spiner-procesar.component";
import * as myVarGlobals from "../../../../global";
import { CommonService } from "src/app/services/commonServices";
import { CommonVarService } from "src/app/services/common-var.services";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ShowDistribuidorComponent } from "./show-distribuidor/show-distribuidor.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
@Component({
  selector: "app-distribuidor",
  templateUrl: "./distribuidor.component.html",
  styleUrls: ["./distribuidor.component.scss"],
})
export class DistribuidorComponent implements OnInit {
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  vmButtons: any = [];
  dataUser: any;
  permissions: any;
  catalog: any = {};
  distribuidor: any = { tip_doc: 0, fk_linea_producto: 0, fk_sucursal: 0, zona: 0, sector: 0 };
  tamDoc: any = 0;
  catalogSector: any = []
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

  constructor(
    private distribuidorSrv: DistribuidorService,
    private commonServices: CommonService,
    private toastr: ToastrService,
    private commonVrs: CommonVarService,
    private modalService: NgbModal
  ) {
    this.commonVrs.listendistribuidor.asObservable().subscribe((res) => {
      if (!res.edit) {
        this.detalle_contactos = [];
        this.detalle_contactos = res.arraycontact;
      } else {
        this.detalle_edit = res;
      }
    });

    this.commonVrs.editDistribuidor.asObservable().subscribe((res) => {
      this.vmButtons[1].habilitar = true;
      this.vmButtons[2].habilitar = false;
      this.distribuidor = res;
      this.zonaValidate(res.zona);
    });
  }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsDistribuidor",
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
        orig: "btnsDistribuidor",
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
        orig: "btnsDistribuidor",
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
        orig: "btnsDistribuidor",
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

    setTimeout(() => {
      this.validatePermission();
    }, 50);
  }

  validatePermission() {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    let params = {
      codigo: myVarGlobals.fDistribuidor,
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
      params: "'DOCUMENTO', 'ZONA', 'SECTOR'",
    };
    this.distribuidorSrv.getCatalogs(data).subscribe(
      (res) => {
        this.catalog.documents = res["data"]["DOCUMENTO"];
        this.catalog.zona = res["data"]["ZONA"];
        this.catalog.sector = res["data"]["SECTOR"];
        this.getGroupsProduct();
        this.getSucursalesDistribuidor();
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  getGroupsProduct() {
    this.distribuidorSrv.getGrupos().subscribe(
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

  getSucursalesDistribuidor() {
    this.distribuidorSrv.getSucursales().subscribe(
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

  zonaValidate(event) {
    console.log(event);
    console.log(this.catalog.zona);
    let zonaGrupo = this.catalog.zona.find( ({ id_catalogo }) => id_catalogo === +event ).valor;
    console.log(zonaGrupo);
    this.catalogSector = []
    this.catalog.sector.forEach(element => {
      if (element.grupo == zonaGrupo) this.catalogSector.push(element);
    });
    /*document.getElementById("sector0").removeAttribute("disabled");
    this.distribuidor.zona = 0;
    document.getElementById("sector0").setAttribute("disabled", "");*/
  }

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "BUSCAR":
        this.showDistribuidores();
        break;
      case "GUARDAR":
        this.validateSaveDistribuidor();
        break;
      case "MODIFICAR":
        this.validateUpdateDistribuidor();
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
    this.distribuidor = { tip_doc: 0, fk_linea_producto: 0, fk_sucursal: 0, zona: 0, sector: 0};
    this.catalogSector = [];
    this.detalle_contactos = [];
    this.detalle_edit = [];
  }

  async validateSaveDistribuidor() {
    if (this.permissions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      let resp = await this.validateDataGlobal().then((respuesta) => {
        if (respuesta) {
          this.confirmSave(
            "Seguro desea guardar el distribuidor?",
            "SAVE_VENDEDOR"
          );
        }
      });
    }
  }

  async validateUpdateDistribuidor() {
    if (this.permissions.editar == "0") {
      this.toastr.info("Usuario no tiene permiso para editar");
    } else {
      let resp = await this.validateDataGlobal().then((respuesta) => {
        if (respuesta) {
          this.confirmSave(
            "Seguro desea editar la información del distribuidor?",
            "EDIT_VENDEDOR"
          );
        }
      });
    }
  }

  validateDataGlobal() {
    let flag = false;
    return new Promise((resolve, reject) => {
      if (this.distribuidor.tip_doc == 0) {
        this.toastr.info("Seleccione un tipo de documneto");
        flag = true;
      } else if (
        this.distribuidor.num_doc == "" ||
        this.distribuidor.num_doc == undefined
      ) {
        this.toastr.info("Ingrese un número de documento");
        flag = true;
      } else if (this.distribuidor.fk_linea_producto == 0) {
        this.toastr.info("Seleccione una linea de producto");
        flag = true;
      } else if (
        this.distribuidor.nombre == "" ||
        this.distribuidor.nombre == undefined
      ) {
        this.toastr.info("Ingrese un nombre");
        flag = true;
      } else if (
        this.distribuidor.direccion == "" ||
        this.distribuidor.direccion == undefined
      ) {
        this.toastr.info("Ingrese una dirección");
        flag = true;
      } else if (
        this.distribuidor.telefono == "" ||
        this.distribuidor.telefono == undefined
      ) {
        this.toastr.info("Ingrese teléfono");
        flag = true;
      } else if (this.distribuidor.zona == 0) {
        this.toastr.info("Ingrese una zona");
        flag = true;
      } else if (this.distribuidor.sector == 0) {
        this.toastr.info("Ingrese una sector");
        flag = true;
      } else if (this.distribuidor.fk_sucursal == 0) {
        this.toastr.info("Seleccione una sucursal");
        flag = true;
      } else if (
        this.distribuidor.presupuesto <= 0 ||
        this.distribuidor.presupuesto > 100000 ||
        this.distribuidor.presupuesto == undefined
      ) {
        this.toastr.info("Ingrese un presupuesto válido");
        flag = true;
      } else if (this.distribuidor.inicio_actividades == undefined) {
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
          this.saveDistribuidor();
        } else if (action == "EDIT_VENDEDOR") {
          this.updateDistribuidor();
        }
      }
    });
  }

  saveDistribuidor() {
    this.distribuidor["ip"] = this.commonServices.getIpAddress();
    this.distribuidor["accion"] = `Ingreso de distribuidor`;
    this.distribuidor["id_controlador"] = myVarGlobals.fDistribuidor;
    this.distribuidor["detalle"] = this.detalle_contactos;
    this.distribuidorSrv.saveDistribuidor(this.distribuidor).subscribe(
      (res) => {
        this.toastr.success(res["message"]);
        this.CancelForm();
      },
      (error) => {
        this.toastr.info(error.error.message);
      }
    );
  }

  updateDistribuidor() {
    this.distribuidor["ip"] = this.commonServices.getIpAddress();
    this.distribuidor["accion"] = `Actualización de distribuidor`;
    this.distribuidor["id_controlador"] = myVarGlobals.fDistribuidor;

    if (this.detalle_edit != undefined) {
      this.distribuidor["detalle"] = this.detalle_edit.arraycontact;
      this.distribuidor["deleteDistribuidor"] = this.detalle_edit.deleteContac;
      this.distribuidor["edit"] = true;
    } else {
      this.distribuidor["edit"] = false;
    }
    this.distribuidorSrv.updateDistribuidor(this.distribuidor).subscribe(
      (res) => {
        this.toastr.success(res["message"]);
        this.CancelForm();
      },
      (error) => {
        this.toastr.info(error.error.message);
      }
    );
  }

  showDistribuidores() {
    const modalInvoice = this.modalService.open(ShowDistribuidorComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fDistribuidor;
    modalInvoice.componentInstance.editar = this.permissions.editar;
    modalInvoice.componentInstance.eliminar = this.permissions.eliminar;
    this.ClearForm();
  }
  
}