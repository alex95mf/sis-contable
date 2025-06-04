import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { InvoiceService } from '../invoice.service'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonVarService } from '../../../../../services/common-var.services'

@Component({
standalone: false,
  selector: 'app-modal-invoices-product',
  templateUrl: './modal-invoices-product.component.html',
  styleUrls: ['./modal-invoices-product.component.scss']
})
export class ModalInvoicesProductComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
   dtOptions: any = {};
  dtTrigger = new Subject();
  @Input() module: any;
  @Input() component: any;
  @Input() userGroup: any;
  products: any;
  dataDT: any = [];
  validaDt: any = false;
  vmButtons: any;

  constructor(
    private invoiService: InvoiceService,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonVarService: CommonVarService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.commonVarService.updPerm.next(true);
    }, 50);

    this.vmButtons = [
      { orig: "btnroductFac", paramAccion: "", boton: { icon: "fas fa-plus", texto: "AGREGAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false },
      { orig: "btnroductFac", paramAccion: "", boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];
    this.products = JSON.parse(localStorage.getItem('dataProductsInvoice'));
    this.getDataTableGlobals();
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "REGRESAR":
        this.closeModal();
        break;
      case "AGREGAR":
        this.addListProduct();
        break;
    }
  }

  getDataTableGlobals() {
    this.dataDT = [];
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      search: true,
      paging: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };

    let data = {
      module: this.module,
      component: this.component,
      grupo: parseInt(this.userGroup)
    }
    this.invoiService.searchProduct(data)
      .subscribe(res => {
        this.validaDt = true;
        if (this.products[0].codigoProducto == null) {
          Object.keys(res['data']).forEach(key => {
            res['data'][key].price = res['data'][key].PVP;
          })
          this.dataDT = res['data'];
        } else {
          this.dataDT = this.products;
        }
        this.commonVarService.updPerm.next(false);
        setTimeout(() => {
          this.dtTrigger.next(null);
        }, 50);
      }, error => {
        this.validaDt = true
        this.dataDT = [];
        this.commonVarService.updPerm.next(false);
        setTimeout(() => {
          this.dtTrigger.next(null);
        }, 50);
      });
  }

  closeModal() {
    this.activeModal.dismiss();
  }

  addListProduct() {
    for (let i = 0; i < this.dataDT.length; i++) {
      this.dataDT[i]['quantity'] = (this.dataDT[i]['quantity'] == undefined) ? 0 : this.dataDT[i]['quantity'];
      /* this.dataDT[i]['price'] = (this.dataDT[i]['price'] != undefined) ? this.dataDT[i]['price'] : 0.00; */
      this.dataDT[i]['price'] = (this.dataDT[i]['PVP'] != undefined) ? this.dataDT[i]['PVP'] : 0.00;
      this.dataDT[i]['totalItems'] = (this.dataDT[i]['totalItems'] == undefined) ? 0.00 : this.dataDT[i]['totalItems'];
      if (this.dataDT[i]['action'] == undefined) {
        this.dataDT[i]['action'] = false;
      }
    }
    this.commonVarService.setListProductInvoice.next(this.dataDT);
    this.closeModal();
  }

}
