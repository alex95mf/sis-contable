import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../../services/commonServices'
import { CommonVarService } from '../../../../../services/common-var.services'
import { IngresoBodegaService } from '../ingreso-bodega.service';
import * as myVarGlobals from '../../../../../global';
import moment from 'moment';
import { ConsultaEstadoClienteComponent } from '../../../../cartera/customers/consulta-estado-cliente/consulta-estado-cliente.component';


@Component({
standalone: false,
  selector: 'app-show-order',
  templateUrl: './show-order.component.html',
  styleUrls: ['./show-order.component.scss']
})
export class ShowOrderComponent implements OnInit {
  @Input() order: any;
  @Input() params: any;
  detOrder: any;
  locality: any;
  dbtnDonwload: any = false;
  processing: any = false;
  processingtwo: any = false;
  dataUserAprobated: any = "";
  dataUserElaborate: any = "";

  /*date*/
  hoy: Date = new Date;
  fecha = this.hoy.getDate() + '-' + (this.hoy.getMonth() + 1) + '-' + this.hoy.getFullYear();
  hora = this.hoy.getHours() + ':' + this.hoy.getMinutes() + ':' + this.hoy.getSeconds();
  fechaYHora = this.fecha + '  ' + this.hora;
  dataUser: any;
  empresLogo: any;
  vmButtons: any;
  dateNow: any;

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private commVarSrv: CommonVarService,
    private orderServices: IngresoBodegaService) { }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "IMPRIMIR":
        this.savePrint();
        break;

      case "ENVIAR CORREO":
        this.sendEmail();
        break;

      case "CERRAR":
        this.closeModal();
        break;
    }
  }

  ngOnInit(): void {
    this.dateNow = moment(this.hoy).format('YYYY-MM-DD');
    setTimeout(() => {
      this.commVarSrv.updPerm.next(true);
    }, 30);

    this.vmButtons = [
      { orig: "btnsShowOrder", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false, printSection: "print-section", imprimir: true },
      { orig: "btnsShowOrder", paramAccion: "", boton: { icon: "fa fa-search", texto: "ENVIAR CORREO" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false, imprimir: false },
      { orig: "btnsShowOrder", paramAccion: "", boton: { icon: "far fa-window-close", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false, imprimir: false }
    ];


    (this.params.perDowload == '0') ? this.dbtnDonwload = false : this.dbtnDonwload = true;
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.empresLogo = this.dataUser.logoEmpresa;
    this.orderServices.getDetOrder({ id: this.order.id }).subscribe(res => {
      this.detOrder = res['data'];
      this.dataUserAprobated = (this.order.name_user_aprobated) ? this.order.name_user_aprobated : "";
      this.processing = true;
      this.commVarSrv.updPerm.next(false);
    }, error => {
      this.commVarSrv.updPerm.next(false);
      this.processing = true;
    })
  }


  closeModal() {
    this.activeModal.dismiss();
  }

  savePrint() {
    let data = {
      ip: this.commonServices.getIpAddress(),
      accion: "Registro de impresion de orden de compra",
      id_controlador: myVarGlobals.fOrdenesCompra
    }
    this.orderServices.printData(data).subscribe(res => {

    }, error => {
      this.toastr.info(error.error.mesagge);
    })
  }

  sendEmail() {
    this.dataUserElaborate = this.commonServices.getDataUserLogued().nombre;
    if (this.params.permSendMail == '0') {
      this.toastr.info("Usuario no tiene permiso para enviar correo");
    } else {
      this.commVarSrv.updPerm.next(true);
      this.orderServices.getEmailsProviders({ id_proveedor: this.order.fk_proveedor }).subscribe(res => {
        this.commVarSrv.updPerm.next(false);
        if (res['data'][0]['email'] != null && res['data'][0]['email'] != "") {
          this.processingtwo = true;
          this.commVarSrv.updPerm.next(true);
          let data = {
            id_order: this.order.id,
            abbr: this.params.preficOrder,
            iva: this.params.iva,
            elaborado: this.dataUserElaborate,
            aprobado: this.dataUserAprobated,
            componente:this.params.componente
          }
          this.orderServices.sendMailOrder(data).subscribe(res => {
            this.toastr.success("Correo enviado con éxito");
            this.processingtwo = false;
            this.commVarSrv.updPerm.next(false);
            this.closeModal();
          }, error => {
            this.commVarSrv.updPerm.next(false);
            this.toastr.info("Hubo un problema en el envio del correo");
          })
        } else {
          Swal.fire({
            title: 'Ingrese un correo',
            input: 'text',
            inputAttributes: {
              autocapitalize: 'off'
            },
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Aceptar',
            showLoaderOnConfirm: true,
            cancelButtonColor: '#DC3545',
            confirmButtonColor: '#13A1EA',
            preConfirm: (correo) => {
              let data = {
                id_order: this.order.id,
                email: correo,
                abbr: this.params.preficOrder,
                iva: this.params.iva,
                elaborado: this.dataUserElaborate,
                aprobado: this.dataUserAprobated,
                componente:this.params.componente
              }
              if (!this.validarEmail(correo) || correo == "" || correo == undefined) {
                this.toastr.info("Debe ingresar un correo valido");
              } else {
                this.processingtwo = true;
                this.commVarSrv.updPerm.next(true);
                this.orderServices.sendMailOrder(data).subscribe(res => {
                  this.toastr.success("Correo enviado con éxito");
                  this.processingtwo = false;
                  this.commVarSrv.updPerm.next(false);
                  this.closeModal();
                }, error => {
                  this.commVarSrv.updPerm.next(false);
                  this.toastr.info("Hubo un problema en el envio del correo");
                })
              }
            },
          })
        }
      })
    }
  }

  validarEmail(valor) {
    if (/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(valor)) {
      return true;
    } else {
      return false;
    }
  }
}
