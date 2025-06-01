import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from "../../../../../services/commonServices";
import { CommonVarService } from '../../../../../services/common-var.services';
import { CierreService } from '../cierre.service';
@Component({
standalone: false,
  selector: 'app-show-account',
  templateUrl: './show-account.component.html',
  styleUrls: ['./show-account.component.scss']
})
export class ShowAccountComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  dataDT: any = [];
  validaDt: any = false;
  dataUser: any;
  vmButtons: any;

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonService: CommonService,
    private commonVarSrvice: CommonVarService,
    private accSrv: CierreService
  ) { }

  ngOnInit(): void {

    this.vmButtons = [
      { orig: "btnCierreCajaBanck", paramAccion: "", boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.getTableAccounts();
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
        }, 50);
      }, error => {
        setTimeout(() => {
          this.dtTrigger.next(null);
        }, 50);
        this.toastr.info(error.error.message);
      });
  }

  setDataAccountBox(dt) {
    this.commonVarSrvice.setAccountClose.next(dt);
    this.closeModal();
  }


  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "REGRESAR":
        this.closeModal();
        break;
    }
  }
}
