import { Component, OnInit, Input } from '@angular/core';
import 'sweetalert2/src/sweetalert2.scss';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../../services/commonServices';
import { BodegaDespachoService } from '../../bodega-despacho/bodega-despacho.service';
import * as myVarGlobals from '../../../../../global';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
standalone: false,
  selector: 'app-show-invoice',
  templateUrl: './show-invoice.component.html',
  styleUrls: ['./show-invoice.component.scss']
})
export class ShowInvoiceComponent implements OnInit {
  @Input() invoice: any;
  @Input() params: any;
  processing: any = false;
  processingtwo: any = false;
  dbtnDonwload: any = false;
  detInvocice: any;
  ivaConverter: any;

  /*date*/
  hoy: Date = new Date;
  fecha = this.hoy.getDate() + '-' + (this.hoy.getMonth() + 1) + '-' + this.hoy.getFullYear();
  hora = this.hoy.getHours() + ':' + this.hoy.getMinutes() + ':' + this.hoy.getSeconds();
  fechaYHora = this.fecha + '  ' + this.hora;
  dataUser: any;
  empresLogo: any;
	vmButtons: any = [];

  constructor(
    private bodegaService: BodegaDespachoService,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private dialogRef: MatDialogRef <ShowInvoiceComponent>
  ) { }

  ngOnInit(): void {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.vmButtons = [
      { orig: "btnDespachoView", paramAccion: "", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false},
      { orig: "btnDespachoView", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false, printSection: "print-section", imprimir: true},
    ];
 
setTimeout(() => {
    this.empresLogo = this.dataUser.logoEmpresa;
    (this.params.perDowload == '0') ? this.dbtnDonwload = false : this.dbtnDonwload = true;
    this.processing = true;
    this.bodegaService.getDetFactura({ id: this.invoice.id_venta }).subscribe(res => {
    this.detInvocice = res['data'];
    this.getimpuestos();
    this.processing = true;
    }, error => {
      this.processing = true;
    })
  }, 10);
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
        case "CERRAR":
        this.dialogRef.close(false);
        break;
        case "IMPRIMIR":
          this.savePrint();
        break;
    }
  }

  closeModal() {
    this.activeModal.dismiss();
  }

  savePrint() {
    let data = {
      ip: this.commonServices.getIpAddress(),
      accion: "Registro de impresion de orden de factura de venta en despacho de bodega",
      id_controlador: myVarGlobals.fFacturaVenta
    }
    this.bodegaService.printData(data).subscribe(res => {

    }, error => {
      this.toastr.info(error.error.mesagge);
    })
  }

  getimpuestos() {
    this.bodegaService.getImpuestos().subscribe(res => {
      let iva = res['data'][0];
      iva = iva.valor;
      this.ivaConverter = (iva / 100) * 100;
    }, error => {
      this.processing = true;
      this.toastr.info(error.error.message);
    })
  }

}
