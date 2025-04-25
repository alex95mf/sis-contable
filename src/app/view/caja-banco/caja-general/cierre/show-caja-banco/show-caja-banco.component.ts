import { Component, Input, OnInit } from '@angular/core';
import { ShowAccountComponent } from '../show-account/show-account.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from "../../../../../services/commonServices";
import { CommonVarService } from '../../../../../services/common-var.services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-show-caja-banco',
  templateUrl: './show-caja-banco.component.html',
  styleUrls: ['./show-caja-banco.component.scss']
})
export class ShowCajaBancoComponent implements OnInit {
  @Input() info: any;
  infoTable: any = [];
  saldo: any = parseFloat("0.00").toFixed(4);
  total: any = parseFloat("0.00").toFixed(4);
  datAccount: any = [];
  c: any = 0;
  validate: any = false;
  validateValue: any = 0;
  vmButtons: any;
  valueAux: any;

  constructor(
    private modalService: NgbModal,
    private commonService: CommonService,
    private commonVarSrvice: CommonVarService,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService
  ) {


    this.commonVarSrvice.setAccountClose.asObservable().subscribe(res => {
      this.c = 0;
      this.c += 1;
      if (this.c == 1 && !this.validate) {
        this.datAccount = [];
        this.datAccount = this.infoTable.filter(e => e.num_cuenta == res.num_cuenta);
        if (this.datAccount.length > 0 && this.c == 1) {
          Swal.fire({
            title: 'Error!!',
            text: "Esta cuenta ya fue seleccionada!!",
            icon: 'error',
            confirmButtonColor: '#d33',
            confirmButtonText: 'Ok'
          }).then((result) => {
          })
        } else {
          res['value'] = 0.00;
          this.infoTable.push(res);
        }
      }
    })
  }

  ngOnInit(): void {

    this.vmButtons = [
      { orig: "btnCierreCajaBanck", paramAccion: "", boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false },
      { orig: "btnCierreCajaBanck", paramAccion: "", boton: { icon: "far fa-plus-square", texto: "AÑADIR CUENTA" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnCierreCajaBanck", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false }
    ];
    this.infoTable = [];
    this.total = (this.info['punto_emision'] != '001') ? parseFloat(this.info['total_venta_periodo']).toFixed(4) : parseFloat(this.info['total_venta']).toFixed(4);
  }

  showAccounts() {
    const modalInvoice = this.modalService.open(ShowAccountComponent, { size: "xl", backdrop: 'static', windowClass: 'viewer-content-general' });
  }

  closeModal() {
    this.validate = true;
    this.activeModal.dismiss();
  }

  deleteAccount(i) {
    this.infoTable.splice(i, 1);
    if (this.infoTable.length > 0) {
      this.saldo = parseFloat('0.00').toFixed(4);
      this.valueAux = parseFloat('0.00').toFixed(4);
      this.infoTable.forEach(element => {
        this.valueAux = parseFloat(this.valueAux) + parseFloat(element['value']);
      });
      this.saldo = parseFloat(this.total) - parseFloat(this.valueAux);
      this.saldo = Number.isNaN(this.saldo) ? parseFloat('0.00') : parseFloat(this.saldo).toFixed(4);
    } else {
      this.saldo = parseFloat('0.00').toFixed(4);
    }
  }

  validateTotal(i) {
    this.saldo = parseFloat('0.00').toFixed(4);
    this.valueAux = parseFloat('0.00').toFixed(4);
    this.infoTable.forEach(element => {
      this.valueAux = parseFloat(this.valueAux) + parseFloat(element['value']);
    });
    this.saldo = parseFloat(this.total) - parseFloat(this.valueAux);
    this.saldo = Number.isNaN(this.saldo) ? parseFloat('0.00') : parseFloat(this.saldo).toFixed(4);
  }

  validateRegister() {
    if (this.infoTable.length > 0) {
      this.infoTable.forEach(element => {
        this.validateValue = parseFloat(this.validateValue) + parseFloat(element['value']);
      });
    }
    if (this.infoTable.length == 0) {
      this.toastr.info("Debe ingresar al menos una cuenta");
    } else if (this.validateValue == 0.00) {
      this.toastr.info("los valores en las cuentas no pueden estar en 0");
    } else {
      Swal.fire({
        text: "Seguro desea realizar el deposito?",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: '#DC3545',
        confirmButtonColor: '#13A1EA',
        confirmButtonText: 'Acepto'
      }).then((result) => {
        if (result.value) {
          this.info['total'] = this.validateValue;
          this.info['cuentas'] = this.infoTable;
          this.closeModal();
          this.commonVarSrvice.setTotalAccount.next(this.info);
        } else {
          this.validateValue = 0.00;
        }
      })
    }
  }

  parsearNum(num) {
    return parseFloat(num);
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "REGRESAR":
        this.closeModal();
        break;
      case "AÑADIR CUENTA":
        this.showAccounts();
        break;
      case "GUARDAR":
        this.validateRegister();
        break;
    }
  }
}
