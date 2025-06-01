import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from "rxjs";
import * as moment from "moment";
import { Router } from "@angular/router";
import "sweetalert2/src/sweetalert2.scss";
import { ToastrService } from "ngx-toastr";
import * as myVarGlobals from "../../../global";
import { ReportesService } from "./reportes.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "../../../services/commonServices";
import { CommonVarService } from "../../../services/common-var.services";
import { ValidacionesFactory } from '../../../config/custom/utils/ValidacionesFactory';
import { CcSpinerProcesarComponent } from '../../../config/custom/cc-spiner-procesar.component';
declare const $: any;
@Component({
standalone: false,
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();
  processing: any = false;
  dataUser: any;
  permissions: any;
  viewDate: Date = new Date();
  fromDatePicker:  Date = new Date(this.viewDate.getFullYear(), 0, 1);
  flag: number = 0;
  toDatePicker: Date = new Date();
  validaDtUser: any = false;
  arrayproducts: Array<any> = [];
  guardarolT: Array<any> = [];
  arrayGrupo: Array<any> = [];
  totalIngresos:any;
  totalEgresos:any;
  permisions: any;
  producto: any = 0;
  movimiento:any = 0;
  arrayMovimiento: Array<any> = [
    { id: 1, name: "Ingreso" },
    { id: 2, name: "Egreso" },
  ];
  grupo:any = 0;
  prueba:any;
  stockActual: any;
  presentaStock: any = false;

  validaciones: ValidacionesFactory = new ValidacionesFactory();
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  vmButtons: any;
  pStockActual:any;
	dataStock:any;

  constructor(private toastr: ToastrService,
    private router: Router,
    private reportesSrv: ReportesService,
    private modalService: NgbModal,
    private commonServices: CommonService,
    private commonVarSrv: CommonVarService) { }

  ngOnInit(): void {

    this.vmButtons = [
      { orig: "btnInfKarProvr", paramAccion: "", boton: { icon: "fa fa-eraser", texto: "LIMPIAR FILTROS" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-dark boton btn-sm", habilitar: false, imprimir: false},
			{ orig: "btnInfKarProvr", paramAccion: "", boton: { icon: "fa fa-file-excel-o", texto: "EXCEL" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-success boton btn-sm", habilitar: false, imprimir: false},
			{ orig: "btnInfKarProvr", paramAccion: "", boton: { icon: "fa fa-print", texto: "IMPRIMIR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-warning boton btn-sm", habilitar: false, imprimir: false},
			{ orig: "btnInfKarProvr", paramAccion: "", boton: { icon: "fa fa-file-pdf-o", texto: "PDF" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-danger boton btn-sm", habilitar: false, imprimir: false},
    ];

    setTimeout(() => {
      this.permisos();
    }, 10)

  }

  metodoGlobal(evento: any) {
		switch (evento.items.boton.texto) {
		    case "EXCEL":
          $('#tablaInfKarProvr').DataTable().button( '.buttons-excel' ).trigger();
        break;
        case "IMPRIMIR":
          $('#tablaInfKarProvr').DataTable().button( '.buttons-print' ).trigger();
        break;
        case "PDF":
          $('#tablaInfKarProvr').DataTable().button( '.buttons-pdf' ).trigger();
        break;
        case "LIMPIAR FILTROS":
        this.informaciondtlimpiar();
        break;
		}
	}

  permisos() {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    let id_rol = this.dataUser.id_rol;
    let data = {
      id: 2,
      codigo: myVarGlobals.fRkardexProveduria,
      id_rol: id_rol,
    };
    this.commonServices.getPermisionsGlobas(data).subscribe(
      (res) => {
         this.permisions = res['data'][0];
      if (this.permisions.ver == "0") {
          this.toastr.info(
            "Usuario no tiene Permiso para ver el formulario de Kardex/Preveduría");
              this.vmButtons = [];
              this.guardarolT = [];
        } else {
          setTimeout(() => {
            this.stockActual = 0;
            this.getDataTabledos();
            this.SumaTotales();
            this.getBodega();
          }, 1000);
        }
      },
      (error) => {
        this.toastr.info(error.error.message);
      }
    );
  }

  getBodega() {
    this.reportesSrv.getProductPro().subscribe(res => {
      this.arrayproducts = res['data'];
      this.getGrupo();
    },)
  }

  getGrupo() {
    this.reportesSrv.getProGrupo().subscribe(res => {
      this.arrayGrupo = res['data'];
    },)
  }

    getDataTabledos() {
      let fechaActual = moment(this.viewDate).format("YYYY-MM-DD");
      let fechaIngresoHasta = moment(this.toDatePicker).format("YYYY-MM-DD");
      let fechaIngresoDesde = moment(this.fromDatePicker).format("YYYY-MM-DD");
      // if (fechaActual != fechaIngresoHasta) {
      //   this.toDatePicker = new Date();
      // } else if (fechaActual != fechaIngresoDesde) {
      //   this.fromDatePicker = new Date(this.viewDate.getFullYear(), 0, 1);
      // } else if (fechaIngresoDesde < fechaIngresoDesde) {
      //   this.fromDatePicker = new Date(this.viewDate.getFullYear(), 0, 1);
      // }
        let data = {
      dateFrom: moment(this.fromDatePicker).format("YYYY-MM-DD"),
      dateTo: moment(this.toDatePicker).format("YYYY-MM-DD"),
      producto: this.producto == 0 ? null : this.producto,
      movimiento: this.movimiento == 0 ? null : this.movimiento,
     /*  grupo: this.grupo == 0 ? null : this.grupo, */
    };

        this.dtOptions = {
            pagingType: "full_numbers",
            pageLength: 50,
            search: true,
            paging: true,
            responsive: true,
            order: [[ 0, "desc" ]],
            buttons: [{
                    extend: "excel",
                    footer: true,
                    charset: 'UTF-8',
                    bom: true,
                    title: "Reporte",
                    filename: "reportes",
                },
                {
                    extend: "print",
                    footer: true,
                    title: "Reporte",
                    filename: "report print",
                    customize: function(win) {
                        $(win.document.body).find('td').addClass('centrard text-right');
                        $(win.document.body).find('tbody').css('font-size', '11px');
                    }
                },
                {
                    extend: "pdfHtml5",
                    footer: true,
                    title: "REPORTE KARDEX PROVEDURÍA",
                    filename: "Reporte",
                    customize: function(doc) {
                        doc.defaultStyle.fontSize = 8,
                            doc.defaultStyle.alignment = 'right',
                            doc.styles.title = {
                                color: '#404a63',
                                fontSize: '14',
                                alignment: 'center',
                                bold: true,
                            }, //title
                            doc.styles.tableHeader = {
                                fillColor: '#404a63',
                                color: 'white',
                                fontSize: '11',
                                alignment: 'center',
                                bold: true,
                            }
                    },
                },
            ],

            language: {
                url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json",
            },
        };
        this.mensajeSppiner = "Cargando...";
        this.lcargando.ctlSpinner(true);
        this.reportesSrv.tablaReportdos(data).subscribe(res => {
            this.validaDtUser = true;
            this.lcargando.ctlSpinner(false);
            this.guardarolT = res['data'];
            if (res['data'].length > 0) {
              this.SumaTotales();
              this.vmButtons[1].habilitar = false;
              this.vmButtons[2].habilitar = false;
              this.vmButtons[3].habilitar = false;
            } else {
              this.vmButtons[1].habilitar = true;
              this.vmButtons[2].habilitar = true;
              this.vmButtons[3].habilitar = true;
                this.totalIngresos = 0;
                this.totalEgresos = 0;
            }
            setTimeout(() => {
                this.dtTrigger.next(null);
            }, 50);
        }, error => {
            this.validaDtUser = true;
            this.lcargando.ctlSpinner(false);
            setTimeout(() => {
                this.dtTrigger.next(null);
            }, 50);
            this.toastr.info(error.error.message);
        });
    }

    rerender(): void {
        this.validaDtUser = true;
        this.lcargando.ctlSpinner(true);
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.getDataTabledos();
        });
    }

  SumaTotales(){
    var total = 0;
    var totals = 0;
    for (let i = 0; i < this.guardarolT.length; i++) {
      if(this.guardarolT[i]["tipo"] == "Ingreso"){
        total += this.guardarolT[i]["cantidad"];
      } else if (this.guardarolT[i]["tipo"] == "Egreso") {
        totals += this.guardarolT[i]["cantidad"];
      }
      this.totalIngresos = total;
      this.totalEgresos = totals;
    }
    this.saldoProducto();
  }

  saldoProducto() {
    var total = 0;
    for (let i = 0; i < this.guardarolT.length; i++) {
      if (isNaN(parseFloat(this.guardarolT[i]["ingreso"])) && isNaN(parseFloat(this.guardarolT[i]["egreso"]))) {
        total += 0;
      } else{
        total += this.guardarolT[i]["ingreso"];
        this.guardarolT[i]["ingreso"] = total;
        this.prueba = total -= this.guardarolT[i]["egreso"] ;
        this.guardarolT[i]["egreso"] = this.prueba;
      }
    }

  }

  filterProducto(data){
        if (this.producto != 0) {
            this.producto = data
             this.dataStock = this.arrayproducts.find(e => e.id == this.producto);
              this.presentaStock = true;
             this.stockActual = this.dataStock.stock;
            this.rerender();
        } else {
          this.stockActual = this.dataStock.stock;
            this.rerender();
        }
  }


  tipoMovimiento(data){
        if (this.movimiento != 0) {
            this.movimiento = data
            this.rerender();
        } else {
            this.rerender();
        }
  }


  getFilterGrupo(evt) {
          if (this.grupo != 0) {
            this.grupo = evt;
            this.rerender();
        } else {
            this.rerender();
        }

  }

  informaciondtlimpiar(){
    this.producto = 0;
    this.movimiento = 0;
    this.grupo = 0;
    this.fromDatePicker = new Date(this.viewDate.getFullYear(), 0, 1);
    this.toDatePicker = new Date();
    this.rerender();
    this.totalEgresos = 0;
    this.totalIngresos  = 0;
    this.stockActual = 0;
  }
}
