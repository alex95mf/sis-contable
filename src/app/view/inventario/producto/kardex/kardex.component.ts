import { Component, OnInit, ViewChild } from "@angular/core";
import { Subject } from "rxjs";
import * as moment from "moment";
import { Router } from "@angular/router";
import "sweetalert2/src/sweetalert2.scss";
import { ToastrService } from "ngx-toastr";
import * as myVarGlobals from "../../../../global";
import { KardexService } from "./kardex.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DataTableDirective } from "angular-datatables";
import { CommonService } from "../../../../services/commonServices";
import { CommonVarService } from "../../../../services/common-var.services";
import { IngresoAjusteComponent } from "./ingreso-ajuste-component/ingreso-ajuste.component";
import { DetalleInformacionComponent } from "./detalle-informacion-component/detalle-informacion.component";
import { Socket } from "../../../../services/socket.service";
import { CcSpinerProcesarComponent } from "../../../../config/custom/cc-spiner-procesar.component";
declare const $: any;
@Component({
standalone: false,
  selector: "app-kardex",
  templateUrl: "./kardex.component.html",
  styleUrls: ["./kardex.component.scss"],
})
export class KardexComponent implements OnInit {
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, {
    static: false,
  })
  lcargando: CcSpinerProcesarComponent;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();
  processing: any = false;
  dataUser: any;
  permissions: any;
  viewDate: Date = new Date();
  fromDatePicker: Date = new Date(this.viewDate.getFullYear(), 0, 1);

  toDatePicker: Date = new Date();
  validaDtUser: any = false;
  products: Array<any> = [];
  totales: Array<any> = [];
  guardarolT: Array<any> = [];
  arrayBodega: Array<any> = [];
  typeDocs: Array<any> = [
    {
      id: 1,
      name: "Ingresos",
    },
    {
      id: 2,
      name: "Egresos",
    },
  ];
  con: number = 0;
  flag: number = 0;
  producto: any = 1;
  primeroPro: any;
  docTipo: any = 0;
  filtNombre: any;
  totalIngresos: any;
  totalEgresos: any;
  SaldoProductoingresos: any;
  SaldoProductoegresos: any;
  prueba: any;
  bodegaSearch: any = 0;
  editInfoDetalle: any = false;
  costoPro: any;
  pStockActual: any;
  vmButtons: any = [];
  locality: any;
  dataStock: any;
  proMarca: any = "Marca del Producto";
  empresLogo: any;
  vardata: any = [];
  validaButto: any = true;
  constructor(
    private socket: Socket,
    private toastr: ToastrService,
    private router: Router,
    private kardexSrv: KardexService,
    private modalService: NgbModal,
    private commonServices: CommonService,
    private commonVarSrv: CommonVarService
  ) {}

  ngOnInit(): void {
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.empresLogo = this.dataUser.logoEmpresa;
    this.vmButtons = [
      {
        orig: "btnsKardex",
        paramAccion: "",
        boton: {
          icon: "fa fa-eraser",
          texto: "LIMPIAR",
        },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-dark boton btn-sm",
        habilitar: false,
        imprimir: false,
      },
      {
        orig: "btnsKardex",
        paramAccion: "",
        boton: {
          icon: "fa fa-print",
          texto: "IMPRIMIR",
        },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
        imprimir: false,
      },
      {
        orig: "btnsKardex",
        paramAccion: "",
        boton: {
          icon: "fa fa-file-excel-o",
          texto: "EXCEL",
        },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
        imprimir: false,
      },
      {
        orig: "btnsKardex",
        paramAccion: "",
        boton: {
          icon: "fa fa-file-pdf-o",
          texto: "PDF",
        },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-danger boton btn-sm",
        habilitar: false,
        imprimir: false,
      },
    ];
    setTimeout(() => {
      this.getProductos();
      this.validatePermission();
    }, 10);
  }

  validatePermission() {
    this.lcargando.ctlSpinner(true);
    this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
    this.empresLogo = this.dataUser.logoEmpresa;
    console.log(this.empresLogo);
    let params = {
      codigo: myVarGlobals.fKardex,
      id_rol: this.dataUser.id_rol,
    };
    this.commonServices.getPermisionsGlobas(params).subscribe(
      (res) => {
        this.permissions = res["data"][0];
        if (this.permissions.ver == "0") {
          this.toastr.info(
            "Usuario no tiene Permiso para ver el formulario de Reportes"
          );
          this.vmButtons = [];
          this.lcargando.ctlSpinner(false);
        } else {
          setTimeout(() => {
            this.getTableReport();
          }, 1000);
        }
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
      }
    );
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "LIMPIAR":
        this.informaciondtlimpiar();
        break;
      case "EXCEL":
        $("#tableKardex").DataTable().button(".buttons-excel").trigger();
        this.validaButto = true;
        break;
      case "PDF":
        $("#tableKardex").DataTable().button(".buttons-pdf").trigger();
        this.validaButto = true;
        break;
      case "IMPRIMIR":
        $("#tableKardex").DataTable().button(".buttons-print").trigger();
        this.validaButto = true;
        break;
      /* 	case "AJUSTE":
                this.ingresoAjuste();
                break; */
    }
  }

  informaciondtlimpiar() {
    this.producto = 1;
    this.docTipo = 0;
    this.proMarca = "Marca del Producto";
    this.fromDatePicker = new Date(this.viewDate.getFullYear(), 0, 1);
    this.toDatePicker = new Date();
    this.rerender();
  }

  getProductos() {
    this.kardexSrv.getProducts().subscribe(
      (res) => {
        this.products = res["data"];
        this.primeroPro = this.products[0].nombre;
        this.getBodega();
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  getBodega() {
    this.kardexSrv.getBodegas().subscribe(
      (res) => {
        this.arrayBodega = res["data"];
      },
      (error) => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      }
    );
  }

  resultadoProblemas() {
    /* this.SaldoDolares(); */
    this.SumaTotales();
  }

  SaldoDolaress() {
    var total = 0;
    for (let i = 1; i < this.guardarolT.length; i++) {
      if (
        this.guardarolT[i]["tipo"] == "Ingresos" &&
        this.guardarolT[i]["fk_product"]
      ) {
        total +=
          this.guardarolT[i]["costoUnitario"] * this.guardarolT[i]["cantidad"];
        this.guardarolT[i]["saldo_dolares"] = total;
        /* 	this.guardarolT[i]["prom_total"] = (this.guardarolT[i]["saldo_dolares"] / this.guardarolT[i]["stock_actual"]); */
      } else if (
        this.guardarolT[i]["tipo"] == "Egresos" &&
        this.guardarolT[i]["fk_product"]
      ) {
        total -=
          this.guardarolT[i]["costoUnitario"] * this.guardarolT[i]["cantidad"];
        this.guardarolT[i]["saldo_dolares"] = total;
        this.guardarolT[i]["prom_total"] =
          this.guardarolT[i]["saldo_dolares"] /
          this.guardarolT[i]["stock_actual"];
      }
    }
  }

  SumaTotales() {
    var total = 0;
    var totals = 0;
    for (let i = 0; i < this.guardarolT.length; i++) {
      if (this.guardarolT[i]["tipo"] == "Ingresos") {
        total += this.guardarolT[i]["cantidad"];
      } else if (this.guardarolT[i]["tipo"] == "Egresos") {
        totals += this.guardarolT[i]["cantidad"];
      }
      this.totalIngresos = total;
      this.totalEgresos = totals;
    }
  }

  getTableReport() {
    let fechaActual = moment(this.viewDate).format("YYYY-MM-DD");
    let fechaIngresoHasta = moment(this.toDatePicker).format("YYYY-MM-DD");
    let fechaIngresoDesde = moment(this.fromDatePicker).format("YYYY-MM-DD");
    if (fechaActual != fechaIngresoHasta) {
      this.toDatePicker = new Date();
    } else if (fechaActual != fechaIngresoDesde) {
      this.fromDatePicker = new Date(this.viewDate.getFullYear(), 0, 1);
    } else if (fechaIngresoDesde < fechaIngresoDesde) {
      this.fromDatePicker = new Date(this.viewDate.getFullYear(), 0, 1);
    }
    let data = {
      dateFrom: moment(this.fromDatePicker).format("YYYY-MM-DD"),
      dateTo: moment(this.toDatePicker).format("YYYY-MM-DD"),
      producto: this.producto == 0 ? null : this.producto,
      documento: this.docTipo == 0 ? null : this.docTipo,
      /*bodega: this.bodegaSearch == 0 ? null : this.bodegaSearch,
            filter: this.bodegaSearch == 0 ? null : "bodega", */
    };
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 50,
      search: true,
      paging: true,
      order: false,
      responsive: true,
      buttons: [
        {
          extend: "excel",
          footer: true,
          charset: "UTF-8",
          bom: true,
          title: "INVENTARIO PRODUCTO",
          filename: "inv_kardex_excel",
        },
        {
          extend: "print",
          footer: true,
          title: "INVENTARIO PRODUCTO1",
          filename: "inv_kardex_print",
          customize: function (win) {
            $(win.document.body).find("td").addClass("centrard text-right");
            $(win.document.body).find("tbody").css("font-size", "10px");
            $(win.document.body).css("font-size", "10pt");
            $(win.document.body).prepend(
              '<img src="{{dataUser.logoEmpresa}}" alt="" style="width: 220px;">'
            );
            /* $(win.document.body).find('table').addClass('compact').css('font-size','inherit'); */
            /*      $(win.document.body).prepend('<img src="{{this.empresLogo}}">'); */
          },
        },
        {
          extend: "pdf",
          footer: true,
          title: " ",
          filename: "inv_kardex_pdf",
          orientation: "landscape",
          header: true,
          pageSize: "A4",
          headerRows: 0,
          customize: function (doc) {
            var tblBody = doc.content[1].table.body;
            doc.content[1].layout = {
              hLineWidth: function (i, node) {
                return i === 0 || i === node.table.body.length ? 2 : 1;
              },
              vLineWidth: function (i, node) {
                return i === 0 || i === node.table.widths.length ? 2 : 1;
              },
              hLineColor: function (i, node) {
                return i === 0 || i === node.table.body.length
                  ? "black"
                  : "gray";
              },
              vLineColor: function (i, node) {
                return i === 0 || i === node.table.widths.length
                  ? "black"
                  : "gray";
              },
            };
            $("#tableKardex")
              .find("tr")
              .each(function (ix, row) {
                var index = ix;
                var rowElt = row;
                $(row)
                  .find("td")
                  .each(function (ind, elt) {
                    if (
                      tblBody[index][1].text == "" &&
                      tblBody[index][2].text == ""
                    ) {
                      delete tblBody[index][ind].style;
                      tblBody[index][ind].fillColor = "#FFF9C4";
                    } else {
                      if (tblBody[index][2].text == "") {
                        delete tblBody[index][ind].style;
                        tblBody[index][ind].fillColor = "#FFFDE7";
                      }
                    }
                  });
              });
            var logo = $("#present").val();
            doc.content.splice(0, 0, {
              /*           columns: [{
                            margin: [ 50, 0, 0, 0 ],
                            fit: [ 100 , 100 ],
                            alignment: 'center',
                            image: logo,
                            width: 110
                          }, {
                            margin: [ 0, 0, 0, 0 ],
                              alignment: 'center',
                            text: 'INVENTARIO PRODUCTO',
                            fontSize: 12
                          }] */

              columns: [
                /* { text: 'This is a header', style: 'header' },
                          'No styling here, this is a standard paragraph',
                          { text: 'Another text', style: 'anotherStyle' },
              { text: 'Multiple styles applied', style: [ 'header', 'anotherStyle' ] } */
                {
                width: 150,
                text: "",
                },
                {
                  // star-sized columns fill the remaining space
                  // if there's more than one star-column, available width is divided equally
                  width: 110,
                  alignment: "right",
                  image: logo,
                  //[izquierda, arriba, derecha, abajo]
                  margin: [ 0, 0, 0, 0 ],
                },
                {
                  // fixed width
                  width: 150,
                  text: "",
                },
                {
                  // percentage width
                  alignment: "left",
                  text: "INVENTARIO KARDEX",
                  //[izquierda, arriba, derecha, abajo]
                  margin: [ 10, 10, 10,10 ],
                },
              ],
              columnGap: 15,

            });
            doc.styles.columns = {
                color: '#2D1D10',
            }
          },
        },
      ],

      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json",
      },
    };
    this.lcargando.ctlSpinner(true);
    this.kardexSrv.tablaKardexdos(data).subscribe(
      (res) => {
        this.validaDtUser = true;
        this.lcargando.ctlSpinner(false);
        this.guardarolT = res["data"];
        this.dataStock = this.products.find(
          (e) => e.id_producto == this.producto
        );
        this.pStockActual = this.dataStock.stock;

        if (res["data"].length > 0) {
          this.vmButtons[1].habilitar = false;
          this.vmButtons[2].habilitar = false;
          this.vmButtons[3].habilitar = false;
          this.resultadoProblemas();
          /*        let datap = this.products.find(e => e.id_producto == this.producto)
                console.log(datap) */
          /* this.producto = datap. */
          if (this.dataStock.marca == "") {
            this.proMarca = "Ninguno";
          } else {
            this.proMarca = this.dataStock.marca;
          }
        } else {
          this.vmButtons[1].habilitar = true;
          this.vmButtons[2].habilitar = true;
          this.vmButtons[3].habilitar = true;
          this.totalIngresos = 0;
          this.totalEgresos = 0;

          if (this.dataStock.marca == "") {
            this.proMarca = "Ninguno";
          } else {
            this.proMarca = this.dataStock.marca;
          }
        }
        setTimeout(() => {
          this.dtTrigger.next(null);
        }, 50);
      },
      (error) => {
        this.validaDtUser = true;
        this.lcargando.ctlSpinner(false);
        setTimeout(() => {
          this.dtTrigger.next(null);
        }, 50);
        this.toastr.info(error.error.message);
      }
    );
  }

  rerender(): void {
    this.validaDtUser = true;
    this.lcargando.ctlSpinner(true);
    this.dtElement.dtInstance.then((dtInstance: any) => {
      dtInstance.destroy();
      this.getTableReport();
    });
  }

  filterProducto(data) {
    if (this.producto != 0) {
      this.producto = data;
      let datap = this.products.find((e) => e.id_producto == data);
      console.log(datap.modelo);
      if (datap.marca == "") {
        this.proMarca = "Ninguno";
      } else {
        this.proMarca = datap.marca;
      }
      this.rerender();
    } else {
      this.rerender();
    }
  }

  tipoDocument(evt) {
    if (this.docTipo != 0) {
      this.docTipo = evt;
      this.rerender();
    } else {
      this.rerender();
    }
  }

  /*  getFilterBodega(e) {
        if (this.bodegaSearch != 0) {
            this.bodegaSearch = e;
            this.rerender();
        } else {
            this.rerender();
        }
    } */

  closeModal() {
    ($("#bd-example-modal-lg") as any).modal(
      "hide"
    ); /* linea para cerrar el modal de boostrap */
  }

  /* 	ingresoAjuste() {
    		const modalInvoice = this.modalService.open(IngresoAjusteComponent, {
    			size: "xl",
    			backdrop: 'static',
    			windowClass: 'viewer-content-general'
    		});
    		modalInvoice.componentInstance.products = this.products;
    	}

    	informaciondtKardex(dts) {
    		const modalInvoice = this.modalService.open(DetalleInformacionComponent, {
    			size: "xl",
    			backdrop: 'static',
    			windowClass: 'viewer-content-general'
    		});
    		modalInvoice.componentInstance.dts = dts;
    	} */

  formatNumber(params) {
    this.locality = "en-EN";
    params = parseFloat(params).toLocaleString(this.locality, {
      minimumFractionDigits: 2,
    });
    params = params.replace(/[,.]/g, function (m) {
      return m === "," ? "." : ",";
    });
    return params;
  }

}
