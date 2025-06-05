import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as myVarGlobals from '../../../../global';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { BodegaComprasService } from './bodega-compras.service';
import { CommonService } from '../../../../services/commonServices'
import { ConfirmPurchaseWineryComponent } from '../../../commons/modals/confirm-purchase-winery/confirm-purchase-winery.component'
import * as moment from "moment";
import { CommonVarService } from '../../../../services/common-var.services';
import { Socket } from '../../../../services/socket.service';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { ViewFacCompraComponent } from './view-fac-compra/view-fac-compra.component';
import { ConfirmationDialogService } from '../../../../config/custom/confirmation-dialog/confirmation-dialog.service';
@Component({
standalone: false,
  selector: 'app-bodega-compras',
  templateUrl: './bodega-compras.component.html',
  styleUrls: ['./bodega-compras.component.scss']
})
export class BodegaComprasComponent implements OnInit {
  /* Datatable options */

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();
  toDatePicker: Date = new Date();
  fecha: any = moment(this.toDatePicker).format("YYYY-MM-DD HH:mm:ss");

  nameUser: any;
  nameUsersPrint: any;
  /* Common params */
  validaDtUser: any = false;
  guardaT: any = [];
  processing: boolean = false;
  purchaseSelected: any;
  /* Const params */
  dataUser: any;
  permisions: any;
  btnPrint: any;
  descuentoData: any;
  dbotones: any = true;
  array: any = false;
  detalleFacturacion: any;
  compra: any;
  detalleCompra: any = [];
  actions: any = {
    ver: false,
    imprimir: false,
    confirmar: false,
    perchar: false /* desactivado con true */
  }
  confirmaDespacho: any;
  prueba: any;
  empresLogo: any;
  constructor(private toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal,
    private commonServices: CommonService,
    private bodegaCompSrv: BodegaComprasService,
    private commonVarSrvice: CommonVarService,
    private confirmationDialogService: ConfirmationDialogService) {
    this.commonVarSrvice.refreshPurchases.asObservable().subscribe(res => {
      this.dtElement.dtInstance.then((dtInstance: any) => {
        dtInstance.destroy();
        this.getDataTableCompraIngreso();
      });
    })
  }

  ngOnInit(): void {
    this.empresLogo = "assets/img/logo-menu.png";
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.nameUsersPrint = this.dataUser.nombre;

    setTimeout(() => {
      this.permissions();
    }, 10);
  }

  /* Api call */
  permissions() {
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    let data = {
      codigo: myVarGlobals.fBodegaCompras,
      id_rol: this.dataUser.id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'];
      if (this.permisions[0].ver == "0") {
        this.toastr.info("Usuario no tiene permiso para ver el formulario Bodega Compras");
        this.lcargando.ctlSpinner(false);
        this.dbotones = false;
      } else {
        this.getDataTableCompraIngreso();
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getDataTableCompraIngreso() {
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      search: true,
      paging: true,
      destroy: true,
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json",
      },
    };
    this.lcargando.ctlSpinner(true);
    this.bodegaCompSrv.presentaTablaCompra()
      .subscribe(res => {
        this.validaDtUser = true;
        this.lcargando.ctlSpinner(false);
        this.guardaT = res['data'];
        setTimeout(() => {
          this.dtTrigger.next(null);
        }, 50);
      }, error => {
        setTimeout(() => {
          this.validaDtUser = true;
          this.lcargando.ctlSpinner(false);
          this.guardaT = [];
          this.dtTrigger.next(null);
        }, 50);
      });
  }

  /* despachear() {
    if (this.confirmaDespacho == "1") {
      this.actions.perchar = false;
      this.actions.imprimir = true;
    } else {
      this.actions.perchar = true;
      this.actions.imprimir = false;
    }
  } */
  ////////////////////////////////

  ConfirmImprimr(dt) {
    this.detalleCompra = dt;
    this.bodegaCompSrv.getDetCompraBodega({
      id: dt.id_compra,
    }).subscribe(
      (res) => {
        this.detalleFacturacion = res["data"];
      },
      (error) => {
        this.toastr.info(error.error.mesagge);
      }
    );

  }

  /* Modals */
  ConfirmPurchase(dt) {
    const dialogRef = this.confirmationDialogService.openDialogMat(ConfirmPurchaseWineryComponent, {
      width: '1000px',
      height: 'auto',
    });
    dialogRef.componentInstance.dt = dt;

  }

  showInformation(dts) {
    const dialogRef = this.confirmationDialogService.openDialogMat(ViewFacCompraComponent, {
      width: '1000px',
      height: 'auto',
    });
    dialogRef.componentInstance.dts = dts;
  }
}
