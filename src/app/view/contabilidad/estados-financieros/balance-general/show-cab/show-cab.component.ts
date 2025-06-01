import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from "../../../../../services/commonServices";
import { CommonVarService } from '../../../../../services/common-var.services';
import { BalanceGeneralService } from '../balance-general.service';
import 'sweetalert2/src/sweetalert2.scss';
const Swal = require('sweetalert2');
import { Socket } from '../../../../../services/socket.service';
import * as moment from 'moment';
import { CcSpinerProcesarComponent } from '../../../../../config/custom/cc-spiner-procesar.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShowDetComponent } from '../show-det/show-det.component'

@Component({
standalone: false,
  selector: 'app-show-cab',
  templateUrl: './show-cab.component.html',
  styleUrls: ['./show-cab.component.scss']
})
export class ShowCabComponent implements OnInit {

  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  @Input() infoAccount: any;
  @Input() Account: any;
  dataDT: any = [];
  validaDt: any = false;
  dataUser: any;
  hoy: Date = new Date;
  fecha = this.hoy.getDate() + '-' + (this.hoy.getMonth() + 1) + '-' + this.hoy.getFullYear();
  hora = this.hoy.getHours() + ':' + this.hoy.getMinutes() + ':' + this.hoy.getSeconds();
  empresLogo: any;
  latestStatus: any;
  prefict: any;
  NexPermisions: any;
  fechaDelete: any = new Date();

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private commonService: CommonService,
    private commonVarSrvice: CommonVarService,
    private accSrv: BalanceGeneralService,
    private socket: Socket,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.getTableAccounts();
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.empresLogo = this.dataUser.logoEmpresa;
  }

  closeModal() {
    this.activeModal.dismiss();
  }

  getTableAccounts() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      search: true,
      paging: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };
    this.validaDt = true;
    this.dataDT = this.infoAccount;
    setTimeout(() => {
      this.dtTrigger.next(null);
    }, 50);
  }

  detailSeat(dt) {
    let arrayAcc = this.dataDT.filter(e => e.id == dt.id && e.IDENTIFICADOR == dt.IDENTIFICADOR);
    if (arrayAcc.length > 0) {
      const modalInvoice = this.modalService.open(ShowDetComponent, { size: "lg", backdrop: 'static', windowClass: 'viewer-content-general' });
      modalInvoice.componentInstance.arrayAcc = arrayAcc;
    }
  }

}
