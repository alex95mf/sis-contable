import { Component, OnInit, ViewChild, OnDestroy, Input,NgZone  } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ReportsServiceInvoice } from "../reports-invoice.service";
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "../../../../../services/commonServices";
import { CommonVarService } from "../../../../../services/common-var.services";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import * as moment from "moment";
import * as myVarGlobals from "../../../../../global";
import 'sweetalert2/src/sweetalert2.scss';  
const Swal = require('sweetalert2');

@Component({
standalone: false,
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent implements OnInit {
  
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();

  validaDtUser: any = false;
  guardarolT: any = [];
  processing: any = false;
  processingtwo: any = false;
  data:any;
  flag: number = 0;
  cliente:any;

  clientes:Array<any> = [];
  constructor(private toastr: ToastrService, private reportInvoice: ReportsServiceInvoice, private commonServices: CommonService,
    private commonVarSrvice: CommonVarService,public activeModal: NgbActiveModal, private router: Router, private zone: NgZone) { }

  ngOnInit(): void {
    this.getClientes();
 this.getDataTable();
 
  }

   /* actions modals */
   closeModal() {
    this.activeModal.dismiss();
  }

  getClientes() {
    this.reportInvoice.getClients().subscribe((res) => {
      this.clientes = res["data"];
    });
  }

  getDataTable() {
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      search: true,
      paging: true,
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json",
      },
    };
    this.reportInvoice.getClients().subscribe(
      (res) => {
        this.processing = true;
        this.validaDtUser = true;
        this.flag += 1;
        this.guardarolT = res["data"];
        setTimeout(() => {
          this.dtTrigger.next(null);
        }, 50);
      },
      (error) => {
        this.dtTrigger.next(null);
        this.processing = true;
      }
    );
  }

  getReportsVentados() {
    const data = {
      cliente: this.cliente == undefined ? null : this.cliente
    };

    this.guardarolT = [];
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      search: true,
      paging: true,
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json",
      },
    };

    this.reportInvoice.showserchClienteDos(data).subscribe(
      (res) => {
        this.validaDtUser = true;
        this.processing = true;
        this.flag += 1;
        this.guardarolT = res["data"];
       
        setTimeout(() => {
          this.dtTrigger.next(null);
        }, 50);
      },
      (error) => {
        this.dtTrigger.next(null);
        this.processing = true;
      }
    );
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  searchCliente(event) {
    this.cliente = event;
    this.rerender();
  }

  rerender(): void {
    this.validaDtUser = false;
    if (this.flag >= 1) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.guardarolT = [];
        this.getReportsVentados();
      });
    } else {
      this.getDataTable();
      this.guardarolT = [];
    }
  }

  searchClienteModal(dt) {
    this.commonVarSrvice.setModalCliente.next(dt);
this.closeModal();
  }


}
