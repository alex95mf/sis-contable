import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BodegaIngresoServices } from '../bodega-ingreso.services';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import { CommonService } from '../../../../../services/commonServices';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-modal-movimiento',
  templateUrl: './modal-movimiento.component.html',
  styleUrls: ['./modal-movimiento.component.scss']
})
export class ModalMovimientoComponent implements OnInit {
  @Input() stock: any;
  @Input() permisions: any;
  @Input() varGlobal: any;

  section: any = "desde";
  productSend: any;
  dataBodega: any;
  processing: any = false;
  dBReceived: any = false;
  dPsend: any = false;
  dQsend: any = false;
  listProduct: any;
  bodegaSend: any;
  IdProductSend: any;
  quantityAvailableSend: any;
  quantitySend: any = 0;
  bodegaReceived: any;
  productReceived: any;
  quantyAvaReceived: any;
  quantityReceibed: any;
  productSelectSend: any;
  productSelectReceived: any;
  hoy: Date = new Date;
  fecha = this.hoy.getDate() + '-' + (this.hoy.getMonth() + 1) + '-' + this.hoy.getFullYear();
  hora = this.hoy.getHours() + ':' + this.hoy.getMinutes() + ':' + this.hoy.getSeconds();
  fechaYHora = this.fecha + '  ' + this.hora;
  btnPrint:any = false;
  vmButtons: any = [];

  constructor(public activeModal: NgbActiveModal, private bodegaService: BodegaIngresoServices, private toastr: ToastrService,
    private commonServices: CommonService,private dialogRef: MatDialogRef <ModalMovimientoComponent>) { }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnMovproducto", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning btn-sm", habilitar: false, printSection: "print-section", imprimir: true},
      { orig: "btnMovproducto", paramAccion: "", boton: { icon: "fa fa-share-square", texto: "ENVIAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: false, imprimir: false},
      { orig: "btnMovproducto", paramAccion: "", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info btn-sm", habilitar: false, imprimir: false},
    ];

    this.getBodegas();
  }

  closeModal() {
    /* if(this.btnPrint){
      Swal.fire({
        title: 'Atención',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        }
      })
    } */
 /*    this.activeModal.dismiss(); */
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "CERRAR":
        this.dialogRef.close(false);
        break;
      case "IMPRIMIR":
        break;
      case "ENVIAR":
        this.validateSendProduct();
        break;
    }
  }
  

  changeSection(section) {
    this.section = section;
  }

  getBodegas() {
    this.bodegaService.getInformationCellarGeneral().subscribe(res => {
      this.dataBodega = res['data'];
      this.processing = true;
    }, error => {
      this.processing = true;
    })
  }

  getCellerSend(e) {
    this.bodegaSend = e;
    this.listProduct = this.stock.filter(d => d.id_bodega_cab == e);
    this.dBReceived = true;
    this.dPsend = true;
    this.dQsend = true;
    this.setInformation();
  }

  setInformation() {
    this.productSend = undefined;
    this.quantityAvailableSend = "";
    this.quantitySend = 0;
    this.productReceived = ""; this.quantyAvaReceived = "";
  }

  getQuantyProduct(e) {
    this.IdProductSend = e;
    this.productSelectSend = this.stock.filter(d => d.id_bodega_cab == this.bodegaSend && d.id_producto == this.IdProductSend);
    this.quantityAvailableSend = this.productSelectSend[0].cantidad;
    this.productReceived = this.productSelectSend[0].nombre_producto;
    document.getElementById('idquSend').focus();
  }

  getProductReceibed(e) {
    this.bodegaReceived = e;
    this.productSelectReceived = this.stock.filter(d => d.id_bodega_cab == e && d.id_producto == this.IdProductSend);
    this.quantyAvaReceived = (this.productSelectReceived.length == 0) ? 0 : this.productSelectReceived[0].cantidad;
  }

  validateSendProduct() {
    if (this.permisions[0].enviar == "0") {
      this.toastr.info("usuario no tiene permiso para enviar");
    } else {
      if (this.bodegaSend == this.bodegaReceived) {
        this.toastr.info("No puede hacer un traslado a la misma bodega, verifque la información");
      } else {
        if (this.bodegaSend == undefined || this.bodegaSend == "") {
          this.toastr.info("Seleccione una bodega de envío");
        } else if (this.productSend == undefined || this.productSend == "") {
          this.toastr.info("Seleccione una producto de envío");
        } else if (this.quantityAvailableSend < this.quantitySend) {
          this.toastr.info("No puede enviar una cantidad mayor a la disponible");
          document.getElementById('idquSend').focus();
        } else if (this.quantitySend == 0) {
          this.toastr.info("La cantidad a enviar no puede ser 0");
          document.getElementById('idquSend').focus();
        } else if (this.bodegaReceived == undefined || this.bodegaReceived == "") {
          this.toastr.info("Seleccione la bodega que recibe");
        } else {
          this.confirmAction("Seguro desea enviar el producto?", "SEND_PRODUCT");
        }
      }
    }
  }

  async confirmAction(message, action) {
    Swal.fire({
      title: "Atención!!",
      text: message,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#DC3545',
      confirmButtonColor: '#13A1EA',
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.value) {
        if (action == "SEND_PRODUCT") {
          this.processing = false;
          this.sendProduct();
        }
      }
    })
  }

  sendProduct() {
    let dataReceived = this.stock.filter(d => d.id_bodega_cab == this.bodegaReceived);
    let data = {
      id_empresa: this.productSelectSend[0].id_empresa,
      sucursal_send: this.productSelectSend[0].id_sucursal,
      bodega_send: this.productSelectSend[0].id_bodega_cab,
      percha_send: this.productSelectSend[0].id_bodega_detalle,
      sucursal_received: (this.productSelectReceived.length == 0) ? dataReceived[0].id_sucursal : this.productSelectReceived[0].id_sucursal,
      bodega_received: (this.productSelectReceived.length == 0) ? dataReceived[0].id_bodega_cab : this.productSelectReceived[0].id_bodega_cab,
      id_producto: this.productSelectSend[0].id_producto,
      cantidad_send: this.quantitySend,
      estado: "A",
      ip: this.commonServices.getIpAddress(),
      accion: `Registro de envio del producto ${this.productSelectSend[0].nombre_producto} desde la bodega ${this.productSelectSend[0].nombre_bodega} hacia la bodega ${(this.productSelectReceived.length == 0) ? dataReceived[0].nombre_bodega : this.productSelectReceived[0].nombre_bodega}`,
      id_controlador: this.varGlobal
    }
    this.bodegaService.saveSendotherSucursal(data).subscribe(res => {
      this.toastr.success(res['message']);
      this.processing = true;
      this.btnPrint = true;
      this.vmButtons[1] = false;
      //this.closeModal();
    }, error => {
      this.toastr.info(error.error.message);
    })
  }
}

