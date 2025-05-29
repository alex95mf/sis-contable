import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
declare const $: any;

@Component({
standalone: false,
  selector: 'app-show-detail-payment',
  templateUrl: './show-detail-payment.component.html',
  styleUrls: ['./show-detail-payment.component.scss']
})
export class ShowDetailPaymentComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();
  @Input() dataDT: any;
  vmButtons:any;


  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnsDetailPayment", paramAccion: "", boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false, imprimir: false },
      { orig: "btnsDetailPayment", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false, imprimir: false },
    ];

    this.getDetailsPayment();
  }

  getDetailsPayment() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      search: true,
      paging: true,
      dom: 'lfrtip',
      order: [[0, "asc"]],
      scrollY: "200px",
      scrollCollapse: true,
      buttons: [{
        extend: 'print',
        footer: true,
        title: 'Detalle de ingresos',
        filename: 'Export_File'
      }],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };
    setTimeout(() => {
      this.dtTrigger.next();
    }, 50);
  }

  closeModal() {
    this.activeModal.dismiss();
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "REGRESAR":
        this.closeModal();
        break;
      case "IMPRIMIR":
        $('#tablaDetailPyment').DataTable().button('.buttons-print').trigger();
        break;
    }
  }

}
