import { Component, OnInit, ViewChild } from "@angular/core";
import { ContribuyenteService } from "./contribuyente.service";
import { CcSpinerProcesarComponent } from "../../../../config/custom/cc-spiner-procesar.component";
import * as myVarGlobals from "../../../../global";
import { CommonService } from "src/app/services/commonServices";
import { CommonVarService } from "src/app/services/common-var.services";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ModalContribuyentesComponent } from "src/app/config/custom/modal-contribuyentes/modal-contribuyentes.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
@Component({
standalone: false,
  selector: "app-contribuyente",
  templateUrl: "./contribuyente.component.html",
  styleUrls: ["./contribuyente.component.scss"],
})
export class ContribuyenteComponent implements OnInit {
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  vmButtons: any = [];
  dataUser: any;
  permissions: any;
  catalog: any = {};
  contribuyente: any = { tipo_documento: 0 };
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

  constructor(
    private contribuyenteSrv: ContribuyenteService,
    private commonServices: CommonService,
    private toastr: ToastrService,
    private commonVrs: CommonVarService,
    private modalService: NgbModal
  ) {
    this.commonVrs.listencontribuyente.asObservable().subscribe((res) => {
      if (!res.edit) {
        this.detalle_contactos = [];
        this.detalle_contactos = res.arraycontact;
      } else {
        this.detalle_edit = res;
      }
    });

    // this.commonVrs.editContribuyente.asObservable().subscribe((res) => {
    //   console.log(res);
    //   this.vmButtons[1].habilitar = true;
    //   this.vmButtons[2].habilitar = false;
    //   this.contribuyente = res;
    // });

    this.commonVrs.selectContribuyenteCustom.asObservable().subscribe((res) => {
      console.log(res);
      this.vmButtons[1].habilitar = true;
      this.vmButtons[2].habilitar = false;
      this.vmButtons[4].habilitar = false;
      this.contribuyente = res;
    });
  }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsContribuyente",
        paramAccion: "",
        boton: { icon: "fas fa-search", texto: "BUSCAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-info boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsContribuyente",
        paramAccion: "",
        boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsContribuyente",
        paramAccion: "",
        boton: { icon: "fa fa-pencil-square-o", texto: "MODIFICAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: true,
      },
      {
        orig: "btnsContribuyente",
        paramAccion: "",
        boton: { icon: "fa fa-eraser", texto: "CANCELAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsContribuyente",
        paramAccion: "",
        boton: { icon: "fa fa-trash", texto: "ELIMINAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: true,
      },
    ];

    setTimeout(() => {
      this.validatePermission();
    }, 50);
  }

  validatePermission() {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

    let params = {
      codigo: myVarGlobals.fContribuyente,
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
    this.contribuyenteSrv.getCatalogs(data).subscribe(
      (res) => {
        this.catalog.documents = res["data"]["DOCUMENTO"];
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
    document.getElementById("num_documentoumento").focus();
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
        this.showContribuyentes();
        break;
      case "GUARDAR":
        this.validateSaveContribuyente();
        break;
      case "MODIFICAR":
        this.validateUpdateContribuyente();
        break;
      case "CANCELAR":
        this.CancelForm();
        break;
      case "ELIMINAR":
        this.deleteContribuyente();
        break;
    }
  }

  deleteContribuyente() {
    // if (this.eliminar == "0") {
    //   this.toastr.info("usuario no tiene permiso para eliminar  registro");
    // } else {
      Swal.fire({
        title: "Atención!!",
        text: "Seguro desea eliminar el registro?",
        icon: "warning",
        confirmButtonColor: "#d33",
        confirmButtonText: "Ok",
      }).then((result) => {
        if (result.value) {
          this.lcargando.ctlSpinner(true);
          let data = {
            id_contribuyente: this.contribuyente.id_cliente,
            ip: this.commonServices.getIpAddress(),
            accion: "Eliminación de contribuyente",
            id_controlador: myVarGlobals.fContribuyente,
          };
          this.contribuyenteSrv.deleteContribuyente(data).subscribe(
            (res) => {
              this.lcargando.ctlSpinner(false);
              this.toastr.success(res["message"]);
              // this.closeModal();
            },
            (error) => {
              this.lcargando.ctlSpinner(false);
              this.toastr.info(error.error.message);
            }
          );
        }
      });
    // }
  }

  CancelForm() {
    this.vmButtons[0].habilitar = false;
    this.vmButtons[1].habilitar = false;
    this.vmButtons[2].habilitar = true;
    this.vmButtons[3].habilitar = false;
    this.vmButtons[4].habilitar = true;

    this.commonVrs.clearContact.next(this.actions);
    this.ClearForm();
  }

  ClearForm() {
    this.contribuyente = { tipo_documento: 0 };
    this.detalle_contactos = [];
    this.detalle_edit = undefined;
  }

  async validateSaveContribuyente() {
    if (this.permissions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      let resp = await this.validateDataGlobal().then((respuesta) => {
        if (respuesta) {
          this.confirmSave(
            "Seguro desea guardar el contribuyente?",
            "SAVE_VENDEDOR"
          );
        }
      });
    }
  }

  async validateUpdateContribuyente() {
    if (this.permissions.editar == "0") {
      this.toastr.info("Usuario no tiene permiso para editar");
    } else {
      let resp = await this.validateDataGlobal().then((respuesta) => {
        if (respuesta) {
          this.confirmSave(
            "Seguro desea editar la información del contribuyente?",
            "EDIT_VENDEDOR"
          );
        }
      });
    }
  }

  validateDataGlobal() {
    let flag = false;
    return new Promise((resolve, reject) => {
      if (this.contribuyente.tipo_documento == 0) {
        this.toastr.info("Seleccione un tipo de documneto");
        flag = true;
      } else if (
        this.contribuyente.num_documento == "" ||
        this.contribuyente.num_documento == undefined
      ) {
        this.toastr.info("Ingrese un número de documento");
        flag = true;
      } else if (
        this.contribuyente.razon_social == "" ||
        this.contribuyente.razon_social == undefined
      ) {
        this.toastr.info("Ingrese una razon_social");
        flag = true;
      } else if (
        this.contribuyente.direccion == "" ||
        this.contribuyente.direccion == undefined
      ) {
        this.toastr.info("Ingrese una dirección");
        flag = true;
      } else if (
        this.contribuyente.telefono == "" ||
        this.contribuyente.telefono == undefined
      ) {
        this.toastr.info("Ingrese teléfono");
        flag = true;
      } else if (
        this.contribuyente.provincia == "" ||
        this.contribuyente.provincia == undefined
      ) {
        this.toastr.info("Ingrese una provincia");
        flag = true;
      } else if (
        this.contribuyente.ciudad == "" ||
        this.contribuyente.ciudad == undefined
      ) {
        this.toastr.info("Ingrese una ciudad");
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
          this.saveContribuyente();
        } else if (action == "EDIT_VENDEDOR") {
          this.updateContribuyente();
        }
      }
    });
  }

  saveContribuyente() {
    this.contribuyente["ip"] = this.commonServices.getIpAddress();
    this.contribuyente["accion"] = `Ingreso de contribuyente`;
    this.contribuyente["id_controlador"] = myVarGlobals.fContribuyente;
    this.contribuyente["detalle"] = this.detalle_contactos;
    this.contribuyenteSrv.saveContribuyente(this.contribuyente).subscribe(
      (res) => {
        this.toastr.success(res["message"]);
        this.CancelForm();
      },
      (error) => {
        this.toastr.info(error.error.message);
      }
    );
  }

  updateContribuyente() {
    this.contribuyente["ip"] = this.commonServices.getIpAddress();
    this.contribuyente["accion"] = `Actualización de contribuyente`;
    this.contribuyente["id_controlador"] = myVarGlobals.fContribuyente;

    if (this.detalle_edit != undefined) {
      this.contribuyente["detalle"] = this.detalle_edit.arraycontact;
      this.contribuyente["deleteContribuyente"] = this.detalle_edit.deleteContac;
      this.contribuyente["edit"] = true;
    } else {
      this.contribuyente["edit"] = false;
    }
    this.contribuyenteSrv.updateContribuyente(this.contribuyente).subscribe(
      (res) => {
        this.toastr.success(res["message"]);
        this.CancelForm();
      },
      (error) => {
        this.toastr.info(error.error.message);
      }
    );
  }

  showContribuyentes() {
    const modalInvoice = this.modalService.open(ModalContribuyentesComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fContribuyente;
    modalInvoice.componentInstance.editar = this.permissions.editar;
    modalInvoice.componentInstance.eliminar = this.permissions.eliminar;
    this.ClearForm();
  }
  
}