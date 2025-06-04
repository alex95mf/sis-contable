import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from "../../../../../services/commonServices";
import { CommonVarService } from '../../../../../services/common-var.services';
import { NotaDebitoService } from '../nota-debito.service';

@Component({
standalone: false,
  selector: 'app-show-cuentas',
  templateUrl: './show-cuentas.component.html',
  styleUrls: ['./show-cuentas.component.scss']
})
export class ShowCuentasComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
   dtOptions: any = {};
  dtTrigger = new Subject();
  dataDT: any = [];
  validaDt: any = false;
  dataUser: any;
  vmButtons:any;

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonService: CommonService,
    private commonVarSrvice: CommonVarService,
    private accSrv: NotaDebitoService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.commonVarSrvice.updPerm.next(true);
    }, 50);

    this.vmButtons = [
      { orig: "btnAccNDc", paramAccion: "", boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.getTableAccounts();
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "REGRESAR":
        this.closeModal();
        break;
    }
  }

  closeModal() {
    this.activeModal.dismiss();
  }

  getTableAccounts() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 8,
      search: true,
      paging: true,
      scrollY: "200px",
      scrollCollapse: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };

    let data = { company_id: this.dataUser.id_empresa };
    this.accSrv.getAccountsByDetails(data)
      .subscribe(res => {
        this.validaDt = true;
        this.dataDT = res['data'];
        setTimeout(() => {
          this.dtTrigger.next(null);
          this.commonVarSrvice.updPerm.next(false);
        }, 50);
      }, error => {
        this.validaDt = true;
        this.dataDT = [];
        setTimeout(() => {
          this.dtTrigger.next(null);
          this.commonVarSrvice.updPerm.next(false);
        }, 50);
      });
  }

  setDataAccount(dt) {
    this.commonVarSrvice.setAccountNDV.next(dt);
    this.closeModal();
  }

}
