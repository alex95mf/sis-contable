import {Component,  Inject, OnInit, ViewChild, Input  } from '@angular/core';
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import "sweetalert2/src/sweetalert2.scss";
import { ToastrService } from "ngx-toastr";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "../../../../../services/commonServices";
import { CommonVarService } from "../../../../../services/common-var.services";
import { contableConfService } from "../contable.service";
import { MatDialogRef } from '@angular/material/dialog';

@Component({
standalone: false,
	selector: 'app-parametro-cuenta',
	templateUrl: './parametro-cuenta.component.html',
	styleUrls: ['./parametro-cuenta.component.scss']
})
export class ParametroCuentaComponent implements OnInit {
	/*datable*/
	@ViewChild(DataTableDirective)
	dtElement: DataTableDirective;
	dtOptions: DataTables.Settings = {};
	dtTrigger = new Subject();
	dataDT: any = [];
	validaDt: any = false;
	/*datable*/
	dataUser: any;
	vmButtons: any = [];
	constructor(private toastr: ToastrService,
		private router: Router,
		public activeModal: NgbActiveModal,
		private commonServices: CommonService,
		private commonVarSrv: CommonVarService,
		private contableConfSrv: contableConfService,
		private dialogRef: MatDialogRef <ParametroCuentaComponent>) {}

  ngOnInit(): void {
    this.vmButtons = [
      { orig: "btnCuenta", paramAccion: "", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger btn-sm", habilitar: false, imprimir: false}
    ];

    setTimeout(() => {
      this.commonVarSrv.updPerm.next(true);
      this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
      this.getTableCuenta();
    }, 10);
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "CERRAR":
        this.dialogRef.close(false);
        break;
    }
  }

  getTableCuenta() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 8,
      search: true,
      paging: true,
      scrollY: "300px",
      scrollCollapse: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };

    let data = {
      company_id: this.dataUser.id_empresa
    };
    this.contableConfSrv.getCuentaDetalle(data)
      .subscribe(res => {
        this.validaDt = true;
        this.dataDT = res['data'];
        setTimeout(() => {
          this.dtTrigger.next(null);
          this.commonVarSrv.updPerm.next(false);
        }, 50);
      }, error => {
        this.validaDt = true;
        this.dataDT = [];
        setTimeout(() => {
          this.dtTrigger.next(null);
          this.commonVarSrv.updPerm.next(false);
        }, 50);
        this.toastr.info(error.error.message);
      });
  }

  setDataCuenta(dt) {
    this.commonVarSrv.paramsAccount.next(dt);
    this.dialogRef.close(false);
  }
}
