import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from "rxjs";
import * as moment from "moment";
import { Router } from "@angular/router";
import "sweetalert2/src/sweetalert2.scss";
import { ToastrService } from "ngx-toastr";
import * as myVarGlobals from "../../../../../global";
import { cuentaFisicaService } from "../cuentas/cuentas.service";
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "../../../../../services/commonServices";
import { CommonVarService } from "../../../../../services/common-var.services";

@Component({
standalone: false,
  selector: 'app-cuenta-views',
  templateUrl: './cuenta-views.component.html',
  styleUrls: ['./cuenta-views.component.scss']
})
export class CuentaViewsComponent implements OnInit {
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
  constructor(private toastr: ToastrService,
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
         language: {
             url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
         }
     };
     this.cuentaFisicaSrv.tablaCuenta().subscribe(res => {
       this.validaDt = true;
       this.infoData = res['data'];
       setTimeout(() => {
         this.dtTrigger.next();
       }, 50);
     }, error => {
       setTimeout(() => {
         this.dtTrigger.next();
       }, 50);
       this.toastr.info(error.error.message);
     });
   }
 
   selectCuentaDos(dt){
     this.commonVarSrv.setCuentasFisicados.next(dt);
     this.closeModal();
   }
 
   closeModal() {
     ($("#modalSearchCuentaDos") as any).modal("hide"); //linea para cerrar el modal de boostrap
     this.processingtwo = false;
   }
 }
 
