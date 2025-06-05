import { Component, OnInit, ViewChild } from "@angular/core";
import { Subject } from "rxjs";
import * as moment from "moment";
import { Router } from "@angular/router";
import "sweetalert2/src/sweetalert2.scss";
import { ToastrService } from "ngx-toastr";
import * as myVarGlobals from "../../../../global";
import { ReportsCompraService } from "./reports-compra.service";
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "../../../../services/commonServices";
import { CommonVarService } from "../../../../services/common-var.services";
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
declare const $: any;
@Component({
standalone: false,
  selector: 'app-reports-compra',
  templateUrl: './reports-compra.component.html',
  styleUrls: ['./reports-compra.component.scss']
})
export class ReportsCompraComponent implements OnInit {
  
	@ViewChild(CcSpinerProcesarComponent, {
		static: false
	}) lcargando: CcSpinerProcesarComponent;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();

  processing: any = false;
  dataUser: any;
  id_usuario: any;
  perfil: any;
  permissions: any;
  processingQuotes: boolean = false;
  viewDate: Date = new Date();
  fromDatePicker: Date = new Date(
    this.viewDate.getFullYear(),
    this.viewDate.getMonth(),
    1
  );
  toDatePicker: Date = new Date();
  docTipo: any = 0;
  estado: any = 0;
  proveedor: any = 0;
  nombreDoc: any = 0;
  document:any = 0;
  proveedors: Array<any> = [];
  typeDocs: Array<any> = [];
  datoTabla: Array<any> = [];
  vmButtons: any = [];
  constructor(   private toastr: ToastrService,
    private router: Router,
    private reportSrv: ReportsCompraService,
    private commonServices: CommonService,
    private commonVarSrv: CommonVarService) { }

  ngOnInit(): void {
        this.vmButtons = [
			{ orig: "btnreportCom", paramAccion: "", boton: { icon: "fas fa-eraser", texto: "LIMPIAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-dark boton btn-sm", habilitar: false, imprimir: false},
			  { orig: "btnreportCom", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false, imprimir: false},
      { orig: "btnreportCom", paramAccion: "", boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false, imprimir: false},
      { orig: "btnreportCom", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "PDF" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false, imprimir: false},
			];

      setTimeout(() => {
      this.validatePermission();
    }, 10);

  }

  /* validate permissions by windows */
  validatePermission() {
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.id_usuario = this.dataUser.id_usuario;
    this.perfil = this.dataUser.perfil;
    let params = {
      codigo: myVarGlobals.fReporteCompraFac,
      id_rol: this.dataUser.id_rol,
    };
    this.commonServices.getPermisionsGlobas(params).subscribe(
      (res) => {
        this.permissions = res["data"][0];
        if (this.permissions.ver == "0") {
          		this.lcargando.ctlSpinner(false);
          this.toastr.info(
            "Usuario no tiene Permiso para ver el formulario de Reporte Compra"
          );
          this.vmButtons  = [];
          this.datoTabla = [];
        } else {
          setTimeout(() => {
            this.getProveedr();
            this.getTableReport();
          }, 100);
        }
      },
    );
  }

	metodoGlobal(evento: any) {
		switch (evento.items.boton.texto) {
			case "LIMPIAR":
				this.informaciondtlimpiar();
				break;
			case "EXCEL":
				$('#idReportCom').DataTable().button('.buttons-csv').trigger();
				break;
			case "PDF":
				$('#idReportCom').DataTable().button('.buttons-pdf').trigger();
				break;
			case "IMPRIMIR":
				$('#idReportCom').DataTable().button('.buttons-print').trigger();
				break;
		}
	}

  getProveedr() {
    this.reportSrv.getProveedores().subscribe(
      (res) => {
       this.lcargando.ctlSpinner(false);
        this.proveedors = res["data"];
        this.getDocument();
      }, error => {
      this.lcargando.ctlSpinner(false);
    });
  }

  getDocument() {
    this.reportSrv.getDocuments().subscribe(
      (res) => {
        this.lcargando.ctlSpinner(false);
        this.typeDocs = res["data"];
      }, error => {
      this.lcargando.ctlSpinner(false);
    });
  }

  proveedorReporte(evt) {
    	if (this.proveedor != 0) {
			this.proveedor = evt;
			this.rerender();
		} else {
			this.rerender();
		}
  }

 tipoDocument(evt) {
      if (this.docTipo != 0) {
			this.docTipo = evt;
       let iddoc= this.typeDocs.find((e) => e.id == evt);
   this.document = iddoc.nombre;
			this.rerender();
		} else {
			this.rerender();
		}

  }

  estadoReport(evt) {
    	if (this.estado != 0) {
			this.estado = evt;
			this.rerender();
		} else {
			this.rerender();
		}
  }

	getTableReport() {
	  const data = {
      dateFrom: moment(this.fromDatePicker).format("YYYY-MM-DD"),
      dateTo: moment(this.toDatePicker).format("YYYY-MM-DD"),
      tipo_document: this.docTipo == 0 ? null : this.docTipo,
      tipo: this.document == 0 ? null : this.document,
      estado: this.estado == 0 ? null : this.estado,
      proveedor: this.proveedor == 0 ? null : this.proveedor,
    };
		this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      search: true,
      paging: true,
         buttons: [
        {
          extend: "excel",
          footer: true,
          title: "Reporte",
          filename: "Reporte Compra",
        },
        {
          extend: "print",
          footer: true,
          title: "Reporte",
          filename: "Reporte Compra",
        customize: function (win) {
        $(win.document.body).find('stilo').css('text-align', 'right');
        $(win.document.body).find('tbody').css('font-size', '5px');
		}
        },
        {
          extend: "pdf",
          footer: true,
          title: "Reporte Compra",
          filename: "Reporte",
              customize: function (doc) {
              doc.defaultStyle.fontSize = 8,
							doc.defaultStyle.alignment = 'right',
						    doc.styles.title = {
                            color: '#404a63',
                            fontSize: '14',
                            alignment: 'center',
							bold: true,
                        },//title
                        doc.styles.tableHeader = {
                            fillColor:'#404a63',
                            color:'white',
							fontSize:'11',
                            alignment:'center',
								bold: true,
                        }//para cambiar el backgorud del escabezado
		},
				},
      ],
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json",
      },
    };
    this.reportSrv.getReporteConsultar(data).subscribe(res => {
    this.lcargando.ctlSpinner(false);
    this.processingQuotes = true;
    this.datoTabla = res['data'];
    if (this.datoTabla.length > 0) {
      this.vmButtons[1].habilitar = false;
      this.vmButtons[2].habilitar = false;
      this.vmButtons[3].habilitar = false;
  } else {
      this.vmButtons[1].habilitar = true;
      this.vmButtons[2].habilitar = true;
      this.vmButtons[3].habilitar = true;
  }
    setTimeout(() => {
      this.dtTrigger.next(null);
    }, 50);
  }, error => {
    this.lcargando.ctlSpinner(false);
    this.processingQuotes = true;
    setTimeout(() => {
      this.dtTrigger.next(null);
    }, 50);
    this.toastr.info(error.error.message);
  });
}


	rerender(): void {
		this.processingQuotes = true;
		this.dtElement.dtInstance.then((dtInstance: any) => {
			dtInstance.destroy();
			this.getTableReport();
		});
	}

  informaciondtlimpiar(){
    this.fromDatePicker =  new Date(
      this.viewDate.getFullYear(),
      this.viewDate.getMonth(),
      1
    );
    this.toDatePicker = new Date();
    this.docTipo = 0;
    this.document = 0;
    this.estado = 0;
    this.proveedor  = 0;
    this.rerender();
  }

}
