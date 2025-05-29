import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { CommonService } from "src/app/services/commonServices";
import { CommonVarService } from "src/app/services/common-var.services";
import { VendedorService } from "../vendedor.service";

@Component({
standalone: false,
  selector: "app-contactos-vendedor",
  templateUrl: "./contactos.component.html",
  styleUrls: ["./contactos.component.scss"],
})
export class ContactosVendedorComponent implements OnInit {
  dataContact: any = {};
  arraycontact: any = [];
  storeConDel: any = [];
  editInfoContact: any = false;
  positionUpdate: any;
  newcontant: any = [];
  contantDelete: any = [];
  validateSearch: any = false;
  action: any;
  dAction: any = false;

  constructor(
    private toastr: ToastrService,
    protected commonServices: CommonService,
    private commonVsrv: CommonVarService,
    private vendedroSrv: VendedorService
  ) {
    this.commonVsrv.editVendedorContact.asObservable().subscribe((res) => {
      this.validateSearch = true;
      if (res.length > 0) {
        this.arraycontact = res;
        this.contantDelete = [];
       /*  this.newcontant = []; */
      } else {
       /*  this.newcontant = []; */
        this.arraycontact = [];
        this.contantDelete = [];
      }
    });

    this.commonVsrv.clearContact.asObservable().subscribe((res) => {
      this.validateSearch = false;
       /*  this.newcontant = []; */
        this.arraycontact = [];
        this.contantDelete = [];
    });
  }

  ngOnInit(): void {}

  async addContact() {
    if (this.validateSearch) {
      await this.validaGlobalData().then((respuesta) => {
        if (respuesta) {
          /* this.newcontant.push(this.dataContact); */
          this.arraycontact.push(this.dataContact);
          let data = {
            arraycontact: this.arraycontact,
            edit: this.validateSearch,
            /* newContactos: this.newcontant, */
            deleteContac: this.contantDelete,
          };
          this.commonVsrv.listenvendedor.next(data);
          this.cleanForm();
          document.getElementById("idName").focus();
        }
      });
    } else {
      await this.validaGlobalData().then((respuesta) => {
        if (respuesta) {
          this.arraycontact.push(this.dataContact);
          let data = {
            arraycontact: this.arraycontact,
            edit: this.validateSearch,
          };
          this.commonVsrv.listenvendedor.next(data);
          this.cleanForm();
          document.getElementById("idName").focus();
        }
      });
    }
  }

  cleanForm() {
    this.editInfoContact = false;
    this.dataContact = {};
  }

  deleteContact(item, pos) {
    if (this.validateSearch) {
      this.contantDelete.push(item);
      this.arraycontact.splice(pos, 1);
      /* this.newcontant = this.arraycontact.filter((e) => e.id == undefined); */
      let data = {
        arraycontact: this.arraycontact,
        edit: this.validateSearch,
        deleteContac: this.contantDelete,
        /* newContactos: this.newcontant, */
      };
      this.commonVsrv.listenvendedor.next(data);
    } else {
      this.arraycontact.splice(pos, 1);
      let data = {
        arraycontact: this.arraycontact,
        edit: this.validateSearch,
      };
      this.commonVsrv.listenvendedor.next(data);
    }
  }

  editContact(dt, pos) {
    if (this.validateSearch) {
      this.positionUpdate = pos;
      this.editInfoContact = true;
      this.dataContact = dt;
    } else {
      this.positionUpdate = pos;
      this.editInfoContact = true;
      this.dataContact = dt;
    }
  }

  updateContact() {
    this.arraycontact[this.positionUpdate]["nombre"] = this.dataContact.nombre;
    this.arraycontact[this.positionUpdate]["cargo"] = this.dataContact.cargo;
    this.arraycontact[this.positionUpdate]["telefono"] =
      this.dataContact.telefono;
    this.arraycontact[this.positionUpdate]["celular"] =
      this.dataContact.celular;
    this.arraycontact[this.positionUpdate]["correo"] = this.dataContact.correo;
    this.arraycontact[this.positionUpdate]["ciudad"] = this.dataContact.ciudad;
    let data = {
      arraycontact: this.arraycontact,
      edit: this.validateSearch,
      /* newContactos: this.newcontant, */
      deleteContac: this.contantDelete,
    };
    this.commonVsrv.listenvendedor.next(data);
    this.cleanForm();
  }

  validarEmail(valor) {
    if (
      /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(valor)
    ) {
      return true;
    } else {
      return false;
    }
  }

  validaGlobalData() {
    return new Promise((resolve, reject) => {
      if (
        this.dataContact.nombre == "" ||
        this.dataContact.nombre == undefined
      ) {
        document.getElementById("idName").focus();
        this.toastr.info("ingrese un nombre");
      } else if (
        this.dataContact.cargo == "" ||
        this.dataContact.cargo == undefined
      ) {
        document.getElementById("idCargo").focus();
        this.toastr.info("ingrese un cargo");
      } else if (
        this.dataContact.telefono == "" ||
        this.dataContact.telefono == undefined
      ) {
        document.getElementById("idTelefono").focus();
        this.toastr.info("ingrese un número de teléfono");
      } else if (
        this.dataContact.celular == "" ||
        this.dataContact.celular == undefined
      ) {
        document.getElementById("idCelular").focus();
        this.toastr.info("ingrese un número celular");
      } else if (
        this.dataContact.correo == "" ||
        this.dataContact.correo == undefined
      ) {
        document.getElementById("idCorreo").focus();
        this.toastr.info("ingrese correo electrónico");
      } else if (!this.validarEmail(this.dataContact.correo)) {
        this.toastr.info("El correo no es válido !!");
        document.getElementById("idCorreo").focus();
      } else if (
        this.dataContact.ciudad == "" ||
        this.dataContact.ciudad == undefined
      ) {
        document.getElementById("idCiudad").focus();
        this.toastr.info("ingrese una ciudad");
      } else {
        this.vendedroSrv
          .validateEmailContacto({ email: this.dataContact.correo })
          .subscribe((res) => {
            if (res["data"].length > 0) {
              this.toastr.info("El correo ya existe!!");
              document.getElementById("idCorreo").focus();
            } else {
              resolve(true);
            }
          });
      }
    });
  }
}
