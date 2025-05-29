import { Component, OnInit, ViewChild,Input } from "@angular/core";
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
standalone: false,
  selector: 'app-imagenes',
  templateUrl: './imagenes.component.html',
  styleUrls: ['./imagenes.component.scss']
})
export class ImagenesComponent implements OnInit {
  	/* Datatable options */
	@ViewChild(DataTableDirective)
	dtElement: DataTableDirective;
	dtOptions: any = {};
	dtTrigger = new Subject();
  processing: any = false;
  dataUser: any;
  permissions: any;
  validaDtUser: any = false;
  data: any;
  guardarolT:any;
  @Input() data_imagenes: any;
id_producto:any;
  constructor(private toastr: ToastrService, private productSearchSrv: BusquedaProductoService, private commonServices: CommonService, 
  
  private CommonVarService: CommonVarService)  { 

     this.CommonVarService.sendAnexos.asObservable().subscribe(res => {
     this.id_producto = res;
    })
  }

  ngOnInit(): void {
    this.getDataTable(this.data_imagenes);
  }

  getDataTable(data) {
        this.productSearchSrv.showAnexos(data).subscribe(
        res => {
        this.validaDtUser = true;
        this.guardarolT = res["data"];
      }, error => {
        this.toastr.info(error.error.message);
      });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  
  updateCatalogo(dt) {
    this.CommonVarService.listenImagenes.next(dt);
  }

}
