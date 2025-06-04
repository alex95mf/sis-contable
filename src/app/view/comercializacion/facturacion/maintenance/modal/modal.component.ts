import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { MaintenanceService } from '../maintenance.service'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonVarService } from '../../../../../services/common-var.services'

@Component({
standalone: false,
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
   dtOptions: any = {};
  dtTrigger = new Subject();
  @Input() module: any;
  @Input() component: any;
  products: any;
  dataDT: any = [];
  validaDt: any = false;


  constructor(private maintenanceSrv: MaintenanceService, public activeModal: NgbActiveModal,
    private toastr: ToastrService, private commonVarService: CommonVarService) { }

  ngOnInit(): void {
    this.products = JSON.parse(localStorage.getItem('EditProducts'));
    this.getDataTableGlobals();
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
      component: this.component
    }
    this.maintenanceSrv.searchProduct(data)
      .subscribe(res => {
        this.dataDT = [];
        res['data'].forEach(el => {
          let idx = this.products.findIndex(x => (x.codigoProducto == el.codigoProducto && x.action == true));
          if (idx != -1) {
            el["action"] = true;
            el["Iva"] = this.products[idx]["Iva"];
            el["PVP"] = this.products[idx]["PVP"];
            el["marca"] = this.products[idx]["marca"];
            el["price"] = this.products[idx]["price"];
            el["quantity"] = this.products[idx]["quantity"];
            el["stock"] = this.products[idx]["stock"];
            el["totalItems"] = this.products[idx]["totalItems"];
            el["id_producto"] = el["id_producto"];
            this.dataDT.push(el)
          } else {
            el["action"] = false;
            el["totalItems"] = 0;
            el["quantity"] = 1;
            this.dataDT.push(el)
          }
        });
        setTimeout(() => {
          this.dtTrigger.next(null);
          this.validaDt = true;
        }, 50);
      }, error => {
        this.toastr.info(error.error.message);
      });
  }

  closeModal() {
    this.activeModal.dismiss();
  }

  addListProduct() {
    for (let i = 0; i < this.dataDT.length; i++) {
      this.dataDT[i]['quantity'] = (this.dataDT[i]['quantity'] == undefined) ? 0 : this.dataDT[i]['quantity'];
      this.dataDT[i]['price'] = (this.dataDT[i]['price'] != undefined) ? this.dataDT[i]['price'] : 0.00;
      this.dataDT[i]['totalItems'] = (this.dataDT[i]['totalItems'] == undefined) ? 0.00 : this.dataDT[i]['totalItems'];
      this.dataDT[i]['id_producto'] = this.dataDT[i]['id_producto'];
      this.dataDT[i]['price_min'] = this.dataDT[i]['price_min'];
      this.dataDT[i]['price_max'] = this.dataDT[i]['price_max'];
      if (this.dataDT[i]['action'] == undefined) {
        this.dataDT[i]['action'] = false;
      }
    }
    this.commonVarService.setListProductEdit.next(this.dataDT);
    this.closeModal();
  }
}
