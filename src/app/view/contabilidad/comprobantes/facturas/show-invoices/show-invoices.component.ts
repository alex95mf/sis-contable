import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/commonServices';
import { CommonVarService } from 'src/app/services/common-var.services';
import { FacturasService } from '../facturas.service'
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';

@Component({
standalone: false,
  selector: 'app-show-invoices',
  templateUrl: './show-invoices.component.html',
  styleUrls: ['./show-invoices.component.scss']
})
export class ShowInvoicesComponent implements OnInit {


  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
   dtOptions: any = {};
  dtTrigger = new Subject();
  @Input() title: any;
  @Input() module: any;
  @Input() component: any;
  @Input() documento_id: any;
  dataDT: any = [];
  validaDt: any = false;
  dataUser: any;
  nameUser: any;
  permissions: any;
  prefict: any;
  latestStatus: any;
  vmButtons: any = [];

  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  constructor(
    public activeModal: NgbActiveModal,
    private cmpSrv: FacturasService,
    private toastr: ToastrService,
    private commonService: CommonService,
    private commonVarSrvice: CommonVarService
  ) { }

  ngOnInit(): void {

    this.vmButtons = [
      { orig: "btnShowIvs", paramAccion: "", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];
    setTimeout(() => {
      this.commonVarSrvice.updPerm.next(true);
      this.getInvoiceProveduria();
    }, 10);
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "CERRAR":
        this.closeModal();
        break;
    }
  }

  getInvoiceProveduria() {
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
    this.cmpSrv.ComprasRegistradas().subscribe(res => {
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
      this.toastr.info(error.error.message);
    });
  }

  closeModal() {
    this.activeModal.dismiss();
  }

  setActivo(dt) {
    dt['detalle'].forEach((el, idx, arr) => {
      arr[idx]['old_quantity'] = el.cantidad
    });
    this.commonVarSrvice.listenSetBuyProv.next(dt);
    this.closeModal();
  }

}
