import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ModalService } from '../modal.service'
import { ToastrService } from 'ngx-toastr';
import { CommonService } from "../../../../services/commonServices";
import { CommonVarService } from '../../../../services/common-var.services';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
@Component({
standalone: false,
  selector: 'app-global-table',
  templateUrl: './global-table.component.html',
  styleUrls: ['./global-table.component.scss']
})
export class GlobalTableComponent implements OnInit {
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
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
  vmButtons: any;

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: ModalService,
    private toastr: ToastrService,
    private commonService: CommonService,
    private commonVarSrvice: CommonVarService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.commonVarSrvice.updPerm.next(true);
    }, 10);

    this.vmButtons = [
      { orig: "btnGlobal", paramAccion: "", boton: { icon: "fas fa-chevron-left", texto: "REGRESAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false }
    ];

    this.getDataTableGlobals();
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    this.nameUser = this.dataUser.nombre;

    /*obtener el ultimo status*/
    /* this.prefict = this.dataUser.permisos_doc.filter(e => e.fk_documento == 5);
    if (this.prefict[0]['filtros'] != null && this.prefict[0]['filtros'] != undefined) {
      let filter = this.prefict[0]['filtros'].split(',');
      this.latestStatus = parseInt(filter[filter.length - 1]);
    } */
    /*fin*/
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "REGRESAR":
        this.closeModal();
        break;
    }
  }

  getDataTableGlobals() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      search: true,
      paging: true,
      scrollY: "200px",
      scrollCollapse: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      }
    };

    let data = {
      module: this.module,
      component: this.component
    }
    if (this.title == "PROVEEDOR") {
      this.modalService.searchProviders(data)
        .subscribe(res => {
          this.validaDt = true;
          this.dataDT = res['data'];         
          setTimeout(() => {
            this.dtTrigger.next();
            this.commonVarSrvice.updPerm.next(false);
          }, 50);
        }, error => {
          this.validaDt = true;
          this.dataDT = [];
          this.commonVarSrvice.updPerm.next(false);
          setTimeout(() => {
            this.dtTrigger.next();
          }, 50);
        });
    } else if (this.title == "CLIENTES") {
      this.modalService.searchCustomer(data)
        .subscribe(res => {
          this.validaDt = true;
          this.dataDT = res['data'];
          
          setTimeout(() => {
            this.dtTrigger.next();
            this.commonVarSrvice.updPerm.next(false);
          }, 50);
        }, error => {
          this.validaDt = true;
          this.dataDT = [];
          this.commonVarSrvice.updPerm.next(false);
          setTimeout(() => {
            this.dtTrigger.next();
          }, 50);
        });
    } else if (this.title == "PRODUCTO") {
      this.modalService.searchProduct(data)
        .subscribe(res => {
          this.validaDt = true;
          this.dataDT = res['data'];         
          setTimeout(() => {
            this.dtTrigger.next();
            this.commonVarSrvice.updPerm.next(false);
          }, 50);
        }, error => {
          this.validaDt = true;
          this.dataDT = [];
          this.commonVarSrvice.updPerm.next(false);
          setTimeout(() => {
            this.dtTrigger.next();
          }, 50);
        });
    } else if (this.title == "SOLICITUD") {
      data['documento_id'] = this.documento_id
      this.modalService.searchSolicitud(data)
        .subscribe(res => {
          this.validaDt = true;
          this.dataDT = res['data'];
          setTimeout(() => {
            this.dtTrigger.next();
            this.commonVarSrvice.updPerm.next(false);
          }, 50);
        }, error => {
          this.validaDt = true;
          this.dataDT = [];
          this.commonVarSrvice.updPerm.next(false);
          setTimeout(() => {
            this.dtTrigger.next();
          }, 50);
        });
    } else if (this.title == "ORDENES") {
      this.modalService.searchOrders()
        .subscribe(res => {
          this.validaDt = true;
          this.dataDT = res['data'];
          setTimeout(() => {
            this.dtTrigger.next();
            this.commonVarSrvice.updPerm.next(false);
          }, 50);
        }, error => {
          this.validaDt = true;
          this.dataDT = [];
          this.commonVarSrvice.updPerm.next(false);
          setTimeout(() => {
            this.dtTrigger.next();
          }, 50);
        });
    }
    else if (this.title == "COTIZACIONES") {
      this.modalService.searchQuotes()
        .subscribe(res => {
          this.validaDt = true;
          this.dataDT = res['data'];
          
          setTimeout(() => {
            this.dtTrigger.next();
            this.commonVarSrvice.updPerm.next(false);
          }, 50);
        }, error => {
          this.validaDt = true;
          this.dataDT = [];
          this.commonVarSrvice.updPerm.next(false);
          setTimeout(() => {
            this.dtTrigger.next();
          }, 50);
        });
    }
  }

  closeModal() {
    this.activeModal.dismiss();
  }

  setDataproviders(providers) {
    this.commonService.actionsSearchProviders.next(providers);
    this.closeModal();
  }

  setDataCustomer(client) {
    this.commonService.actionsSearchClient.next(client);
    this.closeModal();
  }

  setDataProduct(product) {
    this.commonService.actionsSearchProduct.next(product.codigoProducto.trim());
    this.closeModal();
  }

  setDataSolicitud(request) {
    this.commonService.actionsSearchSolicitud.next(request);
    this.closeModal();
  }


  SetnexStatus(next) {
    this.commonVarSrvice.nextStatus.next(next);
    this.closeModal();
  }

  SetDeleteDocument(solicitud) {
    this.commonVarSrvice.deleteDocument.next(solicitud);
    this.closeModal();
  }

  setOrders(dt) {
    this.commonVarSrvice.listenOrders.next(dt);
    this.closeModal();
  }

  setQuotes(dt) {
    this.commonVarSrvice.listenQuotes.next(dt);
    this.closeModal();
  }

}

