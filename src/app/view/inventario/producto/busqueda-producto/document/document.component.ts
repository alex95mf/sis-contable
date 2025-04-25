import { Component, OnInit, ViewChild,Input  } from '@angular/core';
import { Subject } from "rxjs";
import * as moment from "moment";
import { Router } from "@angular/router";
import "sweetalert2/src/sweetalert2.scss";
import { ToastrService } from "ngx-toastr";
import * as myVarGlobals from "../../../../../global";
import { BusquedaProductoService } from "../busqueda-producto.services";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "../../../../../services/commonServices";
import { CommonVarService } from "../../../../../services/common-var.services";
import { table } from "console";
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit {
@ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();
  dtInstance: Promise<DataTables.Api>;
  processing: any = false;
  validaDtUser: any = false;
  id_producto: any;
  documentT:any;
  @Input() data_documento: any;

  constructor(private toastr: ToastrService, private productSearchSrv: BusquedaProductoService, private commonServices: CommonService, 
  
  private CommonVarService: CommonVarService) { this.CommonVarService.sendAnexos.asObservable().subscribe(res => {
this.id_producto = res;
    }) }

  ngOnInit(): void {
    this.getDataTable(this.data_documento);
  }


  getDataTable(data) {
    this.productSearchSrv.showAnexos(data)
      .subscribe(res => {
        this.validaDtUser = true;
        this.documentT = res['data'];
      }, error => {
        this.toastr.info(error.error.message);
      });
  }

  selectDocument(dt) {
    this.CommonVarService.listenImagenes.next(dt);
  }


}

