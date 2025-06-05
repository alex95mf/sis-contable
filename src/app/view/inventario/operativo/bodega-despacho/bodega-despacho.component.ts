import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { CommonService } from '../../../../services/commonServices';
import { CommonVarService } from '../../../../services/common-var.services';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import * as myVarGlobals from '../../../../global';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BodegaDespachoService } from './bodega-despacho.service';
import * as moment from 'moment';
import { ShowInvoiceComponent } from './show-invoice/show-invoice.component';
import { ConfirmInvoiceComponent } from './confirm-invoice/confirm-invoice.component'
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { ConfirmationDialogService } from '../../../../config/custom/confirmation-dialog/confirmation-dialog.service';
@Component({
standalone: false,
  selector: 'app-bodega-despacho',
  templateUrl: './bodega-despacho.component.html',
  styleUrls: ['./bodega-despacho.component.scss']
})
export class BodegaDespachoComponent implements OnInit {
	
	@ViewChild(CcSpinerProcesarComponent, {
		static: false
	}) lcargando: CcSpinerProcesarComponent;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();
  dataUser: any;
  processing: any = false;
  permisions: any;
  validaDt: any = false;
  infoDt: any = [];
  vmButtons: any = [];
  viewDate: Date = new Date();
  fromDatePicker: Date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
  toDatePicker: Date = new Date();

  constructor(
    private despachoService: BodegaDespachoService,
    private toastr: ToastrService,
    private router: Router,
    private commonServices: CommonService,
    private modalService: NgbModal,
    private commonVarService: CommonVarService,
		private confirmationDialogService: ConfirmationDialogService
  ) {
    this.commonVarService.listenDispached.asObservable().subscribe(res => {
      this.rerender();
    })

    this.commonVarService.updPerm.asObservable().subscribe(res => {
      (res) ? this.lcargando.ctlSpinner(true); : this.lcargando.ctlSpinner(false);
    })
  }

  ngOnInit(): void {
    setTimeout(() => {
        this.lcargando.ctlSpinner(true);
        this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
        let id_rol = this.dataUser.id_rol;
        let data = {
          id: 2,
          codigo: myVarGlobals.fDespacho,
          id_rol: id_rol
        }
        this.commonServices.getPermisionsGlobas(data).subscribe(res => {
          this.permisions = res['data'];
          if (this.permisions[0].ver == "0") {
            this.lcargando.ctlSpinner(false);
            this.toastr.info("Usuario no tiene Permiso para ver el formulario despacho de bodega");
            this.infoDt = [];
          } else {
            this.getTableSalesInvoice();
          }
        }, error => {
          this.lcargando.ctlSpinner(false);
          this.toastr.info(error.error.message);
        })
    }, 10);
  }

  getTableSalesInvoice() {
    let data = {
      date: moment(this.fromDatePicker).format('YYYY-MM-DD'),
      date2: moment(this.toDatePicker).format('YYYY-MM-DD')
    }
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      search: true,
      paging: true,
      order: [[ 1, "desc" ]],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };
    this.despachoService.getSalesInvoice(data)
      .subscribe(res => {
        this.lcargando.ctlSpinner(false);
        this.processing = true;
        this.infoDt = res['data'];
        this.validaDt = true;
        setTimeout(() => {
          this.dtTrigger.next(null);
        }, 150);
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.validaDt = true;
        this.dtTrigger.next(null);
        this.processing = true;
      });
  }

  getTableSalesInvoiceFilter() {
    let data = {
      date: moment(this.fromDatePicker).format('YYYY-MM-DD'),
      date2: moment(this.toDatePicker).format('YYYY-MM-DD')
    }
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      search: true,
      paging: true,
      order: [[ 1, "desc" ]],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };
    this.despachoService.getSalesInvoice(data)
      .subscribe(res => {
        this.lcargando.ctlSpinner(false);
        this.processing = true;
        this.infoDt = res['data'];
        this.validaDt = true;
        setTimeout(() => {
          this.dtTrigger.next(null);
        }, 150);
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.validaDt = true;
        this.dtTrigger.next(null);
        this.processing = true;
      });
  }

  rerender(): void {
    this.validaDt = false;
    this.infoDt = [];
    this.dtElement.dtInstance.then((dtInstance: any) => {
      dtInstance.destroy();
      this.getTableSalesInvoiceFilter();
    });
  }

  showInvoice(dt) {
    if (this.permisions[0].consultar == "0") {
      this.toastr.info("Usuario no tiene Permiso para consultar");
    } else {
      const modalInvoice =  this.confirmationDialogService.openDialogMat(ShowInvoiceComponent,
        {
        width: '1500px',
        height: 'auto',
      });
      modalInvoice.componentInstance.invoice = dt;
      modalInvoice.componentInstance.params = { perDowload: this.permisions.descargar, preficInvoice: this.dataUser.permisos_doc.filter(e => e.fk_documento == 2)[0].codigo };
    }
  }

  dispacheInvoice(dt) {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    const modalInvoice = this.confirmationDialogService.openDialogMat(ConfirmInvoiceComponent,
      {
        width: '1500px',
        height: 'auto',
      });
    modalInvoice.componentInstance.invoice = dt;
    modalInvoice.componentInstance.params = { perSave: this.permisions.guardar, preficInvoice: this.dataUser.permisos_doc.filter(e => e.fk_documento == 2)[0].codigo };
    modalInvoice.componentInstance.form = myVarGlobals.fDespacho;
    modalInvoice.componentInstance.user = this.dataUser.nombre;
  }

}
