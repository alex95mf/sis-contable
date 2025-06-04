import { Component, OnInit, ViewChild } from "@angular/core";
import { ConceptoService } from "./concepto.service";
import { CcSpinerProcesarComponent } from "../../../../config/custom/cc-spiner-procesar.component";
import * as myVarGlobals from "../../../../global";
import { CommonService } from "src/app/services/commonServices";
import { CommonVarService } from "src/app/services/common-var.services";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ShowConceptoComponent } from "./show-concepto/show-concepto.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { connectableObservableDescriptor } from "rxjs/internal/observable/ConnectableObservable";
@Component({
standalone: false,
  selector: "app-concepto",
  templateUrl: "./concepto.component.html",
  styleUrls: ["./concepto.component.scss"],
})
export class ConceptoComponent implements OnInit {
  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false })
  lcargando: CcSpinerProcesarComponent;
  vmButtons: any = [];
  dataUser: any;
  permissions: any;
  catalog: any = {};
  concepto: any = { estado: 0, tiene_tarifa: false, id_tarifa: 0 };
  tarifas: any = {};
  actions: any = {
    //new: false, 
    //search: false,
    add: true,
    edit: true,
    cancel: true,
    delete: true,
  };
  detalle: any = [];
  detalle_orig: any = [];
  detalle_edit: any = [];
  detalle_delete: any = [];
  detalle_new: any = [];

  constructor(
    private conceptoSrv: ConceptoService,
    private commonServices: CommonService,
    private toastr: ToastrService,
    private commonVrs: CommonVarService,
    private modalService: NgbModal
  ) {
    /*this.commonVrs.listenConcepto.asObservable().subscribe((res) => {
      if (!res.edit) {
        this.detalle = [];
        this.detalle = res.arraycontact;
      } else {
        this.detalle_edit = res;
      }
    });*/

    this.commonVrs.editConcepto.asObservable().subscribe((res) => {
      this.CancelForm();
      this.vmButtons[1].habilitar = true;
      this.vmButtons[2].habilitar = false;
      this.concepto = res;
      this.detalle = res.concepto_detalle;
      //console.log(res);
      let data = {id_concepto: res.id_concepto};
      //console.log(data);
      this.conceptoSrv.getTarifa(data).subscribe(
        (res2) => {
          this.tarifas = res2["data"];
          console.log(res2);
        },
        (error) => {
          this.toastr.info(error.error.message);
        }
      )
      Object.assign(this.detalle_orig, JSON.parse(JSON.stringify(res.concepto_detalle)));
    });
  }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsConcepto",
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
        orig: "btnsConcepto",
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
        orig: "btnsConcepto",
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
        orig: "btnsConcepto",
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
      codigo: myVarGlobals.fRenContrato,
      id_rol: this.dataUser.id_rol,
    };

    this.commonServices.getPermisionsGlobas(params).subscribe(
      (res) => {
        this.permissions = res["data"][0];
        if (this.permissions.ver == "0") {
          this.toastr.info(
            "Usuario no tiene Permiso para ver el formulario de Conceptos"
          );
          this.vmButtons = [];
          this.lcargando.ctlSpinner(false);
        } else {
          /*setTimeout(() => {
            this.fillCatalog();
          }, 500);*/
        }
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  /*fillCatalog() {
    let data = {
      params: "'DOCUMENTO'",
    };
    this.conceptoSrv.getCatalogs(data).subscribe(
      (res) => {
        this.catalog.documents = res["data"]["DOCUMENTO"];
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }*/

  onlyNumber(event): boolean {
    let key = event.which ? event.which : event.keyCode;
    if (key > 31 && (key < 48 || key > 57)) {
      return false;
    }
    return true;
  }

  addItems() {
    if (this.permissions.agregar == "0") {
      this.toastr.info("Usuario no tiene permiso para agregar");
    } else {
      let items = { fk_concepto: this.concepto.id_concepto, codigo_detalle: null, nombre_detalle: null, tiene_tarifa: false, estado: 0, id_usuario: this.dataUser.id_usuario };
      this.detalle.push(items);
    }
  }

  /* OnChange */
  /*docValidate(event) {
    document.getElementById("num_documentoumento").focus();
    if (event == "Cedula") {
      this.tamDoc = 10;
    } else if (event == "Ruc") {
      this.tamDoc = 13;
    } else if (event == "Pasaporte") {
      this.tamDoc = 12;
    }
  }*/

  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "BUSCAR":
        this.showConceptos();
        break;
      case "GUARDAR":
        this.validateSaveConcepto();
        break;
      case "MODIFICAR":
        this.validateUpdateConcepto();
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

    this.ClearForm();
  }

  ClearForm() {
    this.tarifas = [];
    this.concepto = { estado: 0, tiene_tarifa: false, id_tarifa: 0 };
    this.detalle = [];
    this.detalle_edit = [];
    this.detalle_delete = [];
    this.detalle_new = [];
    this.detalle_orig = []
  }

  CancelFormLite() {
    this.detalle_edit = [];
    this.detalle_delete = [];
    this.detalle_new = [];
    this.detalle_orig = [];
    Object.assign(this.detalle_orig, JSON.parse(JSON.stringify(this.detalle)));
  }

  deleteItems(index) {
    if (this.permissions.eliminar == "0") {
      this.toastr.info("Usuario no tiene permiso para eliminar");
    } else {
      let itemEliminado = this.detalle.splice(index, 1)[0];
      if (itemEliminado.id_concepto_detalle != undefined) {
        this.detalle_delete.push(itemEliminado);
      };
    }
  }

  async validateSaveConcepto() {
    if (this.permissions.guardar == "0") {
      this.toastr.info("Usuario no tiene permiso para guardar");
    } else {
      let resp = await this.validateDataGlobal().then((respuesta) => {
        if (respuesta) {
          this.confirmSave(
            "Seguro desea guardar el concepto?",
            "SAVE_CONCEPTO"
          );
        }
      });
    }
  }

  async validateUpdateConcepto() {
    if (this.permissions.editar == "0") {
      this.toastr.info("Usuario no tiene permiso para editar");
    } else {
      let resp = await this.validateDataGlobal().then((respuesta) => {
        if (respuesta) {
          this.confirmSave(
            "Seguro desea editar la información del concepto?",
            "EDIT_CONCEPTO"
          );
        }
      });
    }
  }

  validateDataGlobal() {
    let flag = false;
    return new Promise((resolve, reject) => {
      if (
        this.concepto.codigo == "" ||
        this.concepto.codigo == undefined
      ) {
        this.toastr.info("Ingrese un código para el Concepto");
        flag = true;
      } else if (
        this.concepto.nombre == "" ||
        this.concepto.nombre == undefined
      ) {
        this.toastr.info("Ingrese una descripción para el Concepto");
        flag = true;
      } else if (this.concepto.estado == 0) {
        this.toastr.info("Seleccione un Estado");
        flag = true;
      } else if (
        this.concepto.cuenta_deudora == "" ||
        this.concepto.cuenta_deudora == undefined
      ) {
        this.toastr.info("Ingrese una Cuenta Deudora");
        flag = true;
      } else if (
        this.concepto.cuenta_acreedora == "" ||
        this.concepto.cuenta_acreedora == undefined
      ) {
        this.toastr.info("Ingrese una Cuenta Acreedora");
        flag = true;
      } else if (
        this.concepto.codigo_presupuesto == "" ||
        this.concepto.codigo_presupuesto == undefined
      ) {
        this.toastr.info("Ingrese un Código de Presupuesto");
        flag = true;
      } 
      this.detalle.forEach(element => {
        if (element.codigo_detalle == "" || element.codigo_detalle == undefined) {
          this.toastr.info("Ingrese el Código del detalle");
          flag = true;
        } else if (element.nombre_detalle == "" || element.nombre_detalle == undefined) {
          this.toastr.info("Ingrese el Código del detalle");
          flag = true;
        } else if (element.estado == 0) {
          this.toastr.info("Seleccione un Estado para el detalle");
          flag = true;
        }
      });
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
        if (action == "SAVE_CONCEPTO") {
          this.saveConcepto();
        } else if (action == "EDIT_CONCEPTO") {
          this.updateConcepto();
        }
      }
    });
  }

  saveConcepto() {
    this.lcargando.ctlSpinner(true);
    this.concepto["ip"] = this.commonServices.getIpAddress();
    this.concepto["accion"] = `Ingreso de concepto`;
    this.concepto["id_controlador"] = myVarGlobals.fRenContrato;
    this.concepto["detalle"] = this.detalle;
    this.concepto['id_usuario'] = this.dataUser.id_usuario;
    this.conceptoSrv.saveConcepto(this.concepto).subscribe(
      (res1) => {
        let data = {
          id_concepto: res1["data"]["id_concepto"]
        }
        this.conceptoSrv.getDetalle(data).subscribe((res2)=> {
          this.detalle = res2["data"];
        })
        //this.toastr.success(res["message"]);
        this.lcargando.ctlSpinner(false);
        Swal.fire({
          title: "Operación exitosa",
          text: res1["message"],
          icon: "success",
        })
        this.vmButtons[1].habilitar = true;
        this.vmButtons[2].habilitar = false;
        this.CancelFormLite();
      },
      (error) => {
        //this.toastr.info(error.error.message);
        this.lcargando.ctlSpinner(false);
        Swal.fire({
          title: "¡Error!",
          text: error.error.message,
          icon: "warning",
        })
      }
    );
  }

  updateConcepto() {
    this.lcargando.ctlSpinner(true);
    this.concepto["ip"] = this.commonServices.getIpAddress();
    this.concepto["accion"] = `Actualización de concepto`;
    this.concepto["id_controlador"] = myVarGlobals.fRenContrato;

    this.detalle.forEach(element => {
      let origElement = this.detalle_orig.find(item => item.id_concepto_detalle == element.id_concepto_detalle);
      if (element.id_concepto_detalle == undefined) {
        this.detalle_new.push(element);
      } else if (JSON.stringify(origElement) != JSON.stringify(element)) {
        this.detalle_edit.push(element);
      }
    });
    if (this.detalle_new.length > 0) {
      this.concepto["detalle_new"] = this.detalle_new;
    }
    if (this.detalle_edit.length > 0) {
      this.concepto["detalle_edit"] = this.detalle_edit;
    }
    if (this.detalle_delete.length > 0) {
      this.concepto["detalle_delete"] = this.detalle_delete;
    }
    this.conceptoSrv.updateConcepto(this.concepto).subscribe(
      (res1) => {
        let data = {
          id_concepto: this.concepto["id_concepto"]
        }
        this.conceptoSrv.getDetalle(data).subscribe((res2)=> {
          this.detalle = res2["data"];
        })
        //this.toastr.success(res["message"]);
        this.lcargando.ctlSpinner(false);
        Swal.fire({
          title: "Operación exitosa",
          text: res1["message"],
          icon: "success",
        })
        this.CancelFormLite();
      },
      (error) => {
        //this.toastr.info(error.error.message);
        this.lcargando.ctlSpinner(false);
        Swal.fire({
          title: "¡Error!",
          text: error.error.message,
          icon: "warning",
        })
      }
    );
  }

  showConceptos() {
    const modalInvoice = this.modalService.open(ShowConceptoComponent, {
      size: "xl",
      backdrop: "static",
      windowClass: "viewer-content-general",
    });
    modalInvoice.componentInstance.module_comp = myVarGlobals.fRenContrato;
    modalInvoice.componentInstance.editar = this.permissions.editar;
    modalInvoice.componentInstance.eliminar = this.permissions.eliminar;
  }
  
}