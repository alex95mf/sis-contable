import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../../../services/commonServices';
import { CommonVarService } from '../../../../../../services/common-var.services';
import { SuppliersService } from '../../suppliers.service'

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  dataContact: any = {};
  arraycontact: any = [];
  storeConDel: any = [];
  editInfoContact: any = false;
  positionUpdate: any;
  contantModify: any = [];
  contantDelete: any = [];
  validateSearch: any = false;
  action: any;
  dAction: any = false;


  constructor(private toastr: ToastrService, private commonServices: CommonService, private supierServices: SuppliersService,
    private cVsrv: CommonVarService) {
    this.commonServices.contactProvider.asObservable().subscribe(res => {
      if (this.validateSearch) {
        let data = {
          contact_modify: this.contantModify,
          contact_delete: this.contantDelete
        };
        this.commonServices.resContactProvider.next(data);
      } else {
        let data = {
          contact_modify: this.arraycontact,
          contact_delete: []
        }
        this.commonServices.resContactProvider.next(data);
      }
    })

    this.commonServices.actionsSearchProviders.asObservable().subscribe(res => {
      this.validateSearch = true;
      if (res.contactos.length > 0) {
        this.arraycontact = res.contactos;
        this.contantDelete = [];
        this.dAction = true;
      } else {
        this.contantModify = [];
        this.arraycontact = [];
        this.contantDelete = [];
      }
    })

    this.commonServices.actionsSuppliers.asObservable().subscribe(res => {
      this.contantModify = [];
      this.arraycontact = [];
      this.contantDelete = [];
      this.validateSearch = false;
      if (res.new) {
        this.dAction = true;
      } else if (res.cancel) {
        this.dAction = false;
        this.cleanForm();
        this.arraycontact = [];
      }
    })
  }

  ngOnInit(): void {
  }

  async addContact() {
    this.cVsrv.updPerm.next(true);
    if (this.validateSearch) {
      await this.validaGlobalData().then(respuesta => {
        this.cVsrv.updPerm.next(false);
        if (respuesta) {
          this.cVsrv.updPerm.next(false);
          this.contantModify.push(this.dataContact);
          this.arraycontact.push(this.dataContact);
          this.cleanForm();
          document.getElementById("idName").focus();
        }
      })

    } else {

      await this.validaGlobalData().then(respuesta => {
        this.cVsrv.updPerm.next(false);
        if (respuesta) {
          this.cVsrv.updPerm.next(false);
          this.arraycontact.push(this.dataContact);
          this.cleanForm();
          document.getElementById("idName").focus();
        }
      })
    }
  }


  cleanForm() {
    this.editInfoContact = false;
    this.dataContact = {};
  }

  deleteContact(item, pos) {
    if (this.validateSearch) {
      this.editInfoContact = false;
      this.contantDelete.push(item);
      this.arraycontact.splice(pos, 1);
    } else {
      this.editInfoContact = false;
      this.arraycontact.splice(pos, 1);
    }
  }

  editContact(dt, pos) {
    if (this.validateSearch) {
      this.positionUpdate = pos;
      this.editInfoContact = true;
      this.dataContact = dt;
      this.contantModify.push(this.dataContact);
    } else {
      this.positionUpdate = pos;
      this.editInfoContact = true;
      this.dataContact = dt;
    }
  }

  updateContact() {
    this.arraycontact[this.positionUpdate]['nombre'] = this.dataContact.nombre;
    this.arraycontact[this.positionUpdate]['cargo'] = this.dataContact.cargo;
    this.arraycontact[this.positionUpdate]['telefono'] = this.dataContact.telefono;
    this.arraycontact[this.positionUpdate]['celular'] = this.dataContact.celular;
    this.arraycontact[this.positionUpdate]['correo'] = this.dataContact.correo;
    this.cleanForm();
  }

  validarEmail(valor) {
    if (/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(valor)) {
      this.cVsrv.updPerm.next(false);
      return true;
    } else {
      this.cVsrv.updPerm.next(false);
      return false;
    }
  }

  validaGlobalData() {
    return new Promise((resolve, reject) => {
      if (this.dataContact.nombre == "" || this.dataContact.nombre == undefined) {
        document.getElementById("idName").focus();
        this.toastr.info("ingrese un nombre");

      } else if (this.dataContact.cargo == "" || this.dataContact.cargo == undefined) {
        document.getElementById("idCargo").focus();
        this.toastr.info("ingrese un cargo");
        this.cVsrv.updPerm.next(false);
      } else if (this.dataContact.telefono == "" || this.dataContact.telefono == undefined) {
        document.getElementById("idTelefono").focus();
        this.toastr.info("ingrese un número de teléfono");
        this.cVsrv.updPerm.next(false);
      } else if (this.dataContact.celular == "" || this.dataContact.celular == undefined) {
        document.getElementById("idCelular").focus();
        this.toastr.info("ingrese un número celular");
        this.cVsrv.updPerm.next(false);
      } else if (this.dataContact.correo == "" || this.dataContact.correo == undefined) {
        document.getElementById("idCorreo").focus();
        this.toastr.info("ingrese un correo electrónico");
        this.cVsrv.updPerm.next(false);
      } else if (!this.validarEmail(this.dataContact.correo)) {
        this.toastr.info("El correo no es válido !!");
        this.cVsrv.updPerm.next(false);
        document.getElementById("idCorreo").focus();
      } else {
        this.cVsrv.updPerm.next(true);
        this.supierServices.validateEmailPrividers({ email: this.dataContact.correo }).subscribe(res =>{
          this.cVsrv.updPerm.next(false);
          if (res['data'].length > 0) {
            this.cVsrv.updPerm.next(false);
            this.toastr.info("El correo ya existe!!");
            document.getElementById("idCorreo").focus();
          } else {
            this.cVsrv.updPerm.next(false);
            resolve(true);
          }
        })
      }
    });
  }

}

