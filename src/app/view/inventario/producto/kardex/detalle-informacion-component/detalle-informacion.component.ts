import { Component, OnInit, Input, NgZone } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonService } from "../../../../../services/commonServices";
import { KardexService } from "../kardex.service";
import { CommonVarService } from '../../../../../services/common-var.services';
import { Router } from "@angular/router";
import "sweetalert2/src/sweetalert2.scss";
const Swal = require("sweetalert2");

@Component({
  selector: 'app-detalle-informacion-component',
  templateUrl: './detalle-informacion.component.html',
  styleUrls: ['./detalle-informacion.component.scss']
})
export class DetalleInformacionComponent implements OnInit {
  @Input() dts: any;

  permissions: any;
  processing: any = false;
  processingtwo: any = false;

  data:any;
  constructor(public activeModal: NgbActiveModal,
    private router: Router,
    private zone: NgZone,
    private toastr: ToastrService,
    private commonServices: CommonService,
    private kardexSrv: KardexService,
    private commonVarSrvice: CommonVarService) { }

  ngOnInit(): void { this.data = this.dts;
  }
 /* actions modals */
 closeModal() {
  this.activeModal.dismiss();
}
}
