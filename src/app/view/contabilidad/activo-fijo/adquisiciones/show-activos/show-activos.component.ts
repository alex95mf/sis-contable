import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from "../../../../../services/commonServices";
import { CommonVarService } from '../../../../../services/common-var.services';
import { AdquisicionesService } from '../adquisiciones.service'
import { CcSpinerProcesarComponent } from '../../../../../config/custom/cc-spiner-procesar.component';

@Component({
standalone: false,
  selector: 'app-show-activos',
  templateUrl: './show-activos.component.html',
  styleUrls: ['./show-activos.component.scss']
})
export class ShowActivosComponent implements OnInit {

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
  vmButtons: any = [];

  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  constructor(
    public activeModal: NgbActiveModal,
    private adqSrv: AdquisicionesService,
    private toastr: ToastrService,
    private commonService: CommonService,
    private commonVarSrvice: CommonVarService
  ) { }

  ngOnInit(): void {

    this.vmButtons = [
      { orig: "btnSwAtv", paramAccion: "", boton: { icon: "fa fa-times", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false}
    ];

    setTimeout(() => {
      this.commonVarSrvice.updPerm.next(true);
    }, 10);
    this.getDataTableActivos();
  }

  metodoGlobal(evento: any) {
		switch (evento.items.boton.texto) {
      case "CERRAR":
        this.closeModal();
      break;
		}
	}

  getDataTableActivos() {
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

    
    this.adqSrv.searchActivos().subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.validaDt = true;
      this.dataDT = res['data'];
      setTimeout(() => {
        this.dtTrigger.next(null);
        this.commonVarSrvice.updPerm.next(false);
      }, 50);
    }, error => {
      this.validaDt = true;
      this.dataDT = [];
      this.commonVarSrvice.updPerm.next(false);
      setTimeout(() => {
        this.dtTrigger.next(null);
      }, 50);
      this.toastr.info(error.error.message);
    });

  }

  closeModal() {
    this.activeModal.dismiss();
  }

  setActivo(dt) {
    this.commonVarSrvice.listenSetActivoFijo.next(dt);
    this.closeModal();
  }
}
