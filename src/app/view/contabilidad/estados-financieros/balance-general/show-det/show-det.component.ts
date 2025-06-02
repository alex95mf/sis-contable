import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from "../../../../../services/commonServices";
import { CommonVarService } from '../../../../../services/common-var.services';
import { BalanceGeneralService } from '../balance-general.service';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';
import { Socket } from '../../../../../services/socket.service';
import * as moment from 'moment';
import { CcSpinerProcesarComponent } from '../../../../../config/custom/cc-spiner-procesar.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
standalone: false,
  selector: 'app-show-det',
  templateUrl: './show-det.component.html',
  styleUrls: ['./show-det.component.scss']
})
export class ShowDetComponent implements OnInit {

  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  @Input() arrayAcc: any;
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
  suma: any = { debe: parseFloat('0.00'), haber: parseFloat('0.00') };

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
    this.arrayAcc[0]['detalle'].forEach(element => {
      if (this.arrayAcc[0].IDENTIFICADOR == 'M') {
        this.suma.debe = parseFloat(this.suma.debe) + parseFloat(element.valor_deb);
        this.suma.haber = parseFloat(this.suma.haber) + parseFloat(element.valor_cre);
      } else {
        this.suma.debe = parseFloat(this.suma.debe) + parseFloat(element.debe);
        this.suma.haber = parseFloat(this.suma.haber) + parseFloat(element.haber);
      }
    });
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.empresLogo = this.dataUser.logoEmpresa;
  }

  closeModal() {
    this.activeModal.dismiss();
  }

}
