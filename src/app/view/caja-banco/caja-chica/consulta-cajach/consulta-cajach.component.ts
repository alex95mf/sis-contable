import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from "rxjs";
import * as moment from "moment";
import { Router } from "@angular/router";
import "sweetalert2/src/sweetalert2.scss";
import { ToastrService } from "ngx-toastr";
import * as myVarGlobals from "../../../../global";
import { ConsultaCajachService } from "./consulta-cajach.services";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "../../../../services/commonServices";
import { CommonVarService } from "../../../../services/common-var.services";
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
declare const $: any;
@Component({
standalone: false,
  selector: 'app-consulta-cajach',
  templateUrl: './consulta-cajach.component.html',
  styleUrls: ['./consulta-cajach.component.scss']
})
export class ConsultaCajachComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();
  validaDt: any = false;
  infoData: any;
  processing: any = false;
  permisions: any;
  dataUser: any;
  viewDate: Date = new Date();
  fromDatePicker: Date = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
  toDatePicker: Date = new Date();
  arrayCajachica: Array<any> = [];
  arrayTipo: Array<any> = [];
  arrayDocumento: Array<any> = [];
  cajaChica: any = 0;
  tipo: any = 0;
  documento: any = 0;
  vmButtons:any = [];

  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;


  constructor(private toastr: ToastrService,
    private router: Router,
    private reportesSrv: ConsultaCajachService,
    private modalService: NgbModal,
    private commonServices: CommonService,
    private commonVarSrv: CommonVarService) { }

  ngOnInit(): void {
    this.vmButtons = [
			{ orig: "btnsConsultCajaChica", paramAccion: "", boton: { icon: "fa fa-eraser", texto: "LIMPIAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-dark boton btn-sm", habilitar: false, imprimir: false},
			{ orig: "btnsConsultCajaChica", paramAccion: "", boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false, imprimir: false},
			{ orig: "btnsConsultCajaChica", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false, imprimir: false},
			{ orig: "btnsConsultCajaChica", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "PDF" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false, imprimir: false},
		  ];

    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 10);

    this.getPermisions();
  }
  getPermisions() {
    this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
    let id_rol = this.dataUser.id_rol;
    let data = {
      codigo: myVarGlobals.fRCajaChica,
      id_rol: id_rol
    }
    this.commonServices.getPermisionsGlobas(data).subscribe(res => {
      this.permisions = res['data'][0];
      if (this.permisions.ver == "0") {
        this.toastr.info("Usuario no tiene permiso para ver reportes movimientos Caja Chica.");
        this.vmButtons = [];
      } else {
        this.processing = true;
        this.getBoxSmallXUsuario();
      }
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

	metodoGlobal(evento: any) {
		switch (evento.items.boton.texto) {
		    case "EXCEL":
          $('#tablaConsultCjChica').DataTable().button( '.buttons-excel' ).trigger();
        break;
        case "IMPRIMIR":
          $('#tablaConsultCjChica').DataTable().button( '.buttons-print' ).trigger();
        break;
        case "PDF":
          $('#tablaConsultCjChica').DataTable().button( '.buttons-pdf' ).trigger();
        break;
        case "LIMPIAR":
        this.informaciondtlimpiar();
        break;
		}
	}

  getBoxSmallXUsuario() {
    this.reportesSrv.getBoxSmallXUsuario().subscribe(res => {
      this.arrayCajachica = res['data'];
      this.getAccountSmallBox();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getAccountSmallBox() {
    this.reportesSrv.getAccountSmallBox().subscribe(res => {
      this.arrayTipo = res['data'];
      this.getTipoDoc();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getTipoDoc() {
    this.reportesSrv.getTipoDoc().subscribe(res => {
      this.arrayDocumento = res['data'];
      this.getTableReport();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getTableReport() {
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      search: true,
      paging: true,
      scrollY: "200px",
      scrollCollapse: true,
      order: [[ 1, "desc" ]],
      buttons: [{
        extend: "excel",
        footer: true,
        title: "Reporte",
        filename: "reportes",
      },
      {
        extend: "print",
        footer: true,
        title: "Reporte",
        filename: "report print",
      },
      {
        extend: "pdf",
        footer: true,
        title: "Reporte",
        filename: "Reporte",
      },
    ],
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json",
      },
    };
    let data = {
      dateFrom: moment(this.fromDatePicker).format('YYYY-MM-DD'),
      dateTo: moment(this.toDatePicker).format('YYYY-MM-DD'),
      cajaChica: this.cajaChica == 0 ? null : this.cajaChica,
      tipo: this.tipo == 0 ? null : this.tipo,
      documento: this.documento == 0 ? null : this.documento,
    };
    (this as any).mensajeSpinner = "Cargando...";
    this.lcargando.ctlSpinner(true);
    this.reportesSrv.getMovimiento(data).subscribe(res => {
      this.lcargando.ctlSpinner(false);
      this.validaDt = true;
      this.processing = true;
      this.infoData = res['data'];

      setTimeout(() => {
        this.dtTrigger.next(null);
      }, 50);
    }, error => {
      this.lcargando.ctlSpinner(false);
      setTimeout(() => {
        this.dtTrigger.next(null);
      }, 50);
      this.toastr.info(error.error.message);
    });
  }

  rerender(): void {
    this.infoData = [];
    this.validaDt = false;
    this.dtElement.dtInstance.then((dtInstance: any) => {
      dtInstance.destroy();
      this.getTableReport();
    });
  }

  filterCajaChica(data) {
    if (this.cajaChica != 0) {
      this.cajaChica = data;
      this.rerender();
    } else {
      this.rerender();
    }
  }

  filterTipo(data) {
    if (this.tipo != 0) {
      this.tipo = data;
      this.rerender();
    } else {
      this.rerender();
    }
  }

  filterDocumento(data) {
    if (this.documento != 0) {
      this.documento = data;
      this.rerender();
    } else {
      this.rerender();
    }
  }

  informaciondtlimpiar() {
    this.cajaChica = 0;
    this.tipo = 0;
    this.documento = 0;
    this.fromDatePicker = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
    this.toDatePicker = new Date();
    this.rerender();
  }

}
