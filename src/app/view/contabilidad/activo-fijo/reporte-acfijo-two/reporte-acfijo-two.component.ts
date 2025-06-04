
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import "sweetalert2/src/sweetalert2.scss";
import { ToastrService } from "ngx-toastr";
import * as myVarGlobals from "../../../../global";
import { ReporteAcfijoService } from '../reporte-adq/reporte-acfijo.services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "../../../../services/commonServices";
import { CommonVarService } from "../../../../services/common-var.services";
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
declare const $: any;
@Component({
standalone: false,
  selector: 'app-reporte-acfijo-two',
  templateUrl: './reporte-acfijo-two.component.html',
  styleUrls: ['./reporte-acfijo-two.component.scss']
})
export class ReporteAcfijoTwoComponent implements OnInit {
  @ViewChild(DataTableDirective)
	dtElement: DataTableDirective;
	dtOptions: any = {};
	dtTrigger = new Subject();
	validaDt: any = false;
	infoDataActivo: any;
	processing: any = false;
	permisions: any;
	dataUser: any;
  vmButtons:any = [];
	locality: any;
  codigo:any = 0;
  grupo:any = 0;
  estado:any = 3;
  origen :any = 0;
  arrayStatus: any = [{ id: 1, nombre: "Activo" }, { id: 0, nombre: "Baja" }];
  arrayCodigo: Array<any> = [];
  arrayGrupo: Array<any> = [];
  arrayCountrys: Array<any> = [];

  mensajeSpinner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

  constructor(private toastr: ToastrService,
    private router: Router,
    private reportesSrv: ReporteAcfijoService,
    private modalService: NgbModal,
    private commonServices: CommonService,
    private commonVarSrv: CommonVarService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.lcargando.ctlSpinner(true);
    }, 10);

    this.getPermisions();
    this.vmButtons = [
			{ orig: "btnsConsultatwo", paramAccion: "", boton: { icon: "fa fa-eraser", texto: "LIMPIAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-dark boton btn-sm", habilitar: false, imprimir: false},
			{ orig: "btnsConsultatwo", paramAccion: "", boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false, imprimir: false},
			{ orig: "btnsConsultatwo", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary boton btn-sm", habilitar: false, imprimir: false},
			{ orig: "btnsConsultatwo", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "PDF" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false, imprimir: false},
		  ];
  }

	getPermisions() {
		this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
		let id_rol = this.dataUser.id_rol;
		let data = {
			codigo: myVarGlobals.fRActivoFijotwo,
			id_rol: id_rol
		}
		this.commonServices.getPermisionsGlobas(data).subscribe(res => {
			this.permisions = res['data'][0];
			if (this.permisions.ver == "0") {
        this.lcargando.ctlSpinner(false);
				this.toastr.info("Usuario no tiene acceso a Consulta de Activo Fijo.");
				this.vmButtons = [];
			} else {
				this.processing = true;
        this.getGrupo();
			}
		}, error => {
      this.lcargando.ctlSpinner(false);
			this.toastr.info(error.error.message);
		})
	}

	metodoGlobal(evento: any) {
		switch (evento.items.boton.texto) {
		    case "EXCEL":
          $('#tablaConsultatwo').DataTable().button( '.buttons-csv' ).trigger();
        break;
        case "IMPRIMIR":
          $('#tablaConsultatwo').DataTable().button( '.buttons-print' ).trigger();
        break;
        case "PDF":
          $('#tablaConsultatwo').DataTable().button( '.buttons-pdf' ).trigger();
        break;
        case "LIMPIAR":
        this.informaciondtlimpiar();
        break;
		}
	}

  getGrupo(){
    this.reportesSrv.getDepreciaciones().subscribe(res => {
      this.arrayGrupo = res['data'];
      this.getCurrencys();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
  }

  getCurrencys() {
    this.reportesSrv.getCurrencys().subscribe(res => {
      this.arrayCountrys = res['data'];
      this.getsCodigos();
    }, error => {
      this.lcargando.ctlSpinner(false);
      this.toastr.info(error.error.message);
    })
}

getsCodigos(){
  this.reportesSrv.getCodigoDt().subscribe(res => {
   this.arrayCodigo = res['data'];
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
    buttons: [{
      extend: "csv",
      footer: true,
      charset: 'UTF-8',
      bom: true,
      title: "CONSULTA ACIVOS FIJOS",
      filename: "reportes",
      exportOptions: {
        columns: [1,2,3,4,5,6,7,8,10],
      }
    },
    {
      extend: "print",
      footer: true,
      title: "CONSULTA ACIVOS FIJOS",
      filename: "report print",
      exportOptions: {
        columns: [1,2,3,4,5,6,7,8,10],
      },
      customize: function( win ) {
        $( win.document.body ).find( 'td' ).css( 'text-align', 'center' );
    }

    },
    {
      extend: "pdf",
      footer: true,
      title: "CONSULTA ACIVOS FIJOS",
      filename: "Reporte",
      exportOptions: {
        columns: [1,2,3,4,5,6,7,8,10],
      }, customize: function ( doc ) {
        doc.defaultStyle.fontSize = 8
        doc.defaultStyle.alignment = 'center';
      }

    },
  ],
    language: {
      url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json",
    },
  };
  let data = {
    grupo: this.grupo == 0 ? null : this.grupo,
    codigo: this.codigo == 0 ? null : this.codigo,
    estado: this.estado == 3 ? null : this.estado,
    origen: this.origen == 0 ? null : this.origen,
  }
  this.mensajeSpinner = "Cargando...";
  this.lcargando.ctlSpinner(true);
  this.reportesSrv.dataActFijoDt(data).subscribe(res => {
    this.lcargando.ctlSpinner(false);
    this.validaDt = true;
    this.processing = true;
    this.infoDataActivo = res['data'];
    setTimeout(() => {
      this.dtTrigger.next(null);
    }, 50);
  }, error => {
    this.lcargando.ctlSpinner(false);
    this.validaDt = true;
    this.processing = true;
    setTimeout(() => {
      this.dtTrigger.next(null);
    }, 50);
    this.toastr.info(error.error.message);
  });
}

rerender(): void {
  this.validaDt = false;
  this.dtElement.dtInstance.then((dtInstance: any) => {
    dtInstance.destroy();
    this.getTableReport();
  });
}

filterGrupo(data){
  if (this.grupo != 0) {
    this.grupo = data
    this.rerender();
    } else{
      this.rerender();
  }
}

  filterOrigen(data){
  if (this.origen != 0) {
    this.origen = data
    this.rerender();
    } else{
      this.rerender();
  }
}


filterEstado(data){
  if (this.estado != 0) {
    this.estado = data
    this.rerender();
    } else{
      this.rerender();
  }
}

filterCodigo(data){
  if (this.codigo != 0) {
    this.codigo = data
    this.rerender();
    } else{
      this.rerender();
  }
}

	informaciondtlimpiar() {
		this.codigo = 0;
		this.origen = 0;
		this.estado = 3;
		this.grupo = 0;
		this.rerender();
	}

  formatNumber(params) {
    this.locality = 'en-EN';
    params = parseFloat(params).toLocaleString(this.locality, {
      minimumFractionDigits: 2
    })
    params = params.replace(/[,.]/g, function (m) {
      return m === ',' ? '.' : ',';
    });
    return params;
  }
}
