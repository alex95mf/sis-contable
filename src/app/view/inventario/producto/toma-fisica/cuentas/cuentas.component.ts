import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from "rxjs";
import moment from "moment";
import { Router } from "@angular/router";
import "sweetalert2/src/sweetalert2.scss";
import { ToastrService } from "ngx-toastr";
import * as myVarGlobals from "../../../../../global";
import { cuentaFisicaService } from "./cuentas.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "../../../../../services/commonServices";
import { CommonVarService } from "../../../../../services/common-var.services";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
standalone: false,
  selector: 'app-cuentas',
  templateUrl: './cuentas.component.html',
  styleUrls: ['./cuentas.component.scss']
})
export class CuentasComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();
  validaDt: any = false;
  infoData: any;
  processing: any = false;
  processingtwo: any = false;
  permisions: any;
  dataUser: any;
  constructor( private toastr: ToastrService,
    private router: Router,
    private cuentaFisicaSrv: cuentaFisicaService,
    private commonServices: CommonService,
    private commonVarSrv: CommonVarService) { }

  ngOnInit(): void {
    this.processingtwo = true;
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.getTableReport()
  }

  getTableReport() {
   this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 5,
        search: true,
        paging: true,
        dom: "frtip",
        /* scrollY: "200px",
        scrollCollapse: true, */
        language: {
            url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
        }
    };
    this.cuentaFisicaSrv.tablaCuenta().subscribe(res => {
      this.validaDt = true;
      this.infoData = res['data'];
      setTimeout(() => {
        this.dtTrigger.next(null);
      }, 50);
    }, error => {
      setTimeout(() => {
        this.dtTrigger.next(null);
      }, 50);
      this.toastr.info(error.error.message);
    });
  }

  selectCuenta(dt){
    this.commonVarSrv.setCuentasFisica.next(dt);
    this.closeModal();
  }

  closeModal() {
    ($("#modalSearchCuenta") as any).modal("hide"); //linea para cerrar el modal de boostrap
    this.processingtwo = false;
  }
}
