import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../../../services/commonServices';
import { CommonVarService } from '../../../../../../services/common-var.services';
import { CustomersRegisterService } from '../../customers-register.service';

@Component({
standalone: false,
  selector: 'app-contactos-customer',
  templateUrl: './contactos.component.html',
  styleUrls: ['./contactos.component.scss']
})
export class ContactosComponent implements OnInit {
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

  constructor(private toastr: ToastrService, private commonServices: CommonService, 
    private customerServ: CustomersRegisterService,private cVsrv: CommonVarService) {
    this.commonServices.contactClient.asObservable().subscribe(res => {
      if (this.validateSearch) {
        let data = {
          contact_modify: this.contantModify,
          contact_delete: this.contantDelete
        };
        this.commonServices.resContactClient.next(data);
      } else {
        let data = {
          contact_modify: this.arraycontact,
          contact_delete: []
        }
        this.commonServices.resContactClient.next(data);
      }
    })

    this.commonServices.actionsSearchClient.asObservable().subscribe(res => {
      this.validateSearch = true;
      if (res.contactos.length > 0) {
        this.arraycontact = res.contactos;
      console.log(this.arraycontact)
        this.contantDelete = [];
        this.dAction = true;
      } else {
        this.contantModify = [];
        this.arraycontact = [];
        this.contantDelete = [];
      }
    })

    this.commonServices.actionsClient.asObservable().subscribe(res => {
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
    if (this.validateSearch) {
      await this.validaGlobalData().then(respuesta => {
        if (respuesta) {
          this.contantModify.push(this.dataContact);
          this.arraycontact.push(this.dataContact);
          this.cleanForm();
          document.getElementById("idName").focus();
        }
      })

    } else {
      await this.validaGlobalData().then(respuesta => {
        if (respuesta) {
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
      return true;
    } else {
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
      } else if (this.dataContact.telefono == "" || this.dataContact.telefono == undefined) {
        document.getElementById("idTelefono").focus();
        this.toastr.info("ingrese un número de teléfono");
      } else if (this.dataContact.celular == "" || this.dataContact.celular == undefined) {
        document.getElementById("idCelular").focus();
        this.toastr.info("ingrese un número celular");
      } else if (this.dataContact.correo == "" || this.dataContact.correo == undefined) {
        document.getElementById("idCorreo").focus();
        this.toastr.info("ingrese correo electrónico");
      } else if (!this.validarEmail(this.dataContact.correo)) {
        this.toastr.info("El correo no es válido !!");
        document.getElementById("idCorreo").focus();
      } else {
        this.customerServ.validateEmailClient({ email: this.dataContact.correo }).subscribe(res => {
          if (res['data'].length > 0) {
            this.toastr.info("El correo ya existe!!");
            document.getElementById("idCorreo").focus();
          } else {
            resolve(true);
          }
        })
      }
    });
  }
}
