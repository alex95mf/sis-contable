import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import * as moment from "moment";
import "sweetalert2/src/sweetalert2.scss";
import { ToastrService } from "ngx-toastr";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonService } from "../../../../../services/commonServices";
import { CommonVarService } from "../../../../../services/common-var.services";
import { MovContableService } from "../mov-contable.service";

@Component({
	selector: 'app-mov-asiento-documento',
	templateUrl: './mov-asiento-documento.component.html',
	styleUrls: ['./mov-asiento-documento.component.scss']
})
export class MovAsientoDocumentoComponent implements OnInit {
    @Input() dts: any;
    presentDt: any = false;
    processing: any = false;
    arrayCab: Array <any> = [];
    arrayTable: Array <any> = [];
    type: any;
    tipeDocumento: any;
    numero: any;
    idAsiento: any;
    dtDocumento: any;
    constructor(private toastr: ToastrService,
      private router: Router,
      public activeModal: NgbActiveModal,
      private commonServices: CommonService,
      private commonVarSrv: CommonVarService,
      private reportesSrv: MovContableService) {}

    ngOnInit(): void {
      this.reportesSrv.getMovientoCabData().subscribe(res => {
        this.presentDt = true;
        this.processing = true;   
        this.arrayCab = res["data"].filter((e) => e.fk_tp_doc == this.dts.fk_tp_doc && e.num_doc == this.dts.num_doc && e.id == this.dts.fk_cont_mov_cab);
        this.arrayTable = this.arrayCab;
        this.type = this.arrayCab[0].type;
        this.tipeDocumento = this.arrayCab[0].nombre;
        this.numero = this.arrayTable[0].num_doc.length == "1" ? this.arrayTable[0].num_doc.toString().padStart(10, '0') : this.arrayTable[0].num_doc;
      });
    }

    closeModal() {
      this.activeModal.dismiss();
    }

}