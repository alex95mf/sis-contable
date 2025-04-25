import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from "rxjs";
import * as moment from "moment";
import { Router } from "@angular/router";
import "sweetalert2/src/sweetalert2.scss";
import { ToastrService } from "ngx-toastr";
import * as myVarGlobals from "../../../../global";
import { BusquedaProductoService } from "./busqueda-producto.services";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from "angular-datatables";
import { environment } from "../../../../../environments/environment";
import { CommonService } from "../../../../services/commonServices";
import { CommonVarService } from "../../../../services/common-var.services";
import { Socket } from '../../../../services/socket.service';
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import { DetalleComponent } from '../../../comercializacion/productos/solicitud/tabs/detalle/detalle.component';
declare const $: any;
@Component({
  selector: "app-busqueda-producto",
  templateUrl: "./busqueda-producto.component.html",
  styleUrls: ["./busqueda-producto.component.scss"],
})
export class BusquedaProductoComponent implements OnInit {
  mensajeSppiner: string = "Cargando...";
  @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger = new Subject();
  processing: any = false;
  dataUser: any;
  permissions: any;
  validaDtUser: any = false;
  producto: any = 0;
  precio: any = 0;
  generico: any = 0;
  marca: any = 0;
  dataPrecio: Array<any> = [];
  guardarolT: any = [];
  products: Array<any> = [];
  marcas: Array<any> = [];
  click: any = [];
  precioActual: any;
  numero: 0;
  minimo: any;
  minimoPvp: any;
  precioOfeta: any;
  general: any;
  flag: number = 0;
  processingtwo: boolean = false;
  anexos: Array<any> = [];
  newArray: Array<any> = [];
  uri: string = environment.baseUrl;
  id_producto: any;
  dataConsultarDocumento: any;
  data: any;
  ext: any;
  description: any;
  vmButtons: any = [];
  locality: any;
  vmButtonsT: any = [];
  constructor(private socket: Socket,
    private toastr: ToastrService,
    private router: Router,
    private reportesSrv: BusquedaProductoService,
    private modalService: NgbModal,
    private commonServices: CommonService,
    private commonVarSrv: CommonVarService) {this.commonVarSrv.listenImagenes.asObservable().subscribe((res) => {
      this.data = res;
      this.uri = res.location;
      this.ext = res.original_extension;
      this.description = res.description;
      this.general = `${environment.baseUrl}/storage${this.uri}`;
     /*  this.general.setAttribute("draggable", "true"); */
    }); }

    ngOnInit(): void {
      this.vmButtons = [{
          orig: "btnBusqProducto",
          paramAccion: "",
          boton: {
            icon: "fa fa-eraser",
            texto: "LIMPIAR"
          },
          permiso: true,
          showtxt: true,
          showimg: true,
          showbadge: false,
          clase: "btn btn-dark boton btn-sm",
          habilitar: false,
          imprimir: false
        },
        {
          orig: "btnBusqProducto",
          paramAccion: "",
          boton: {
            icon: "fa fa-print",
            texto: "IMPRIMIR"
          },
          permiso: true,
          showtxt: true,
          showimg: true,
          showbadge: false,
          clase: "btn btn-warning boton btn-sm",
          habilitar: false,
          imprimir: false
        },
        {
          orig: "btnBusqProducto",
          paramAccion: "",
          boton: {
            icon: "fa fa-file-excel-o",
            texto: "EXCEL"
          },
          permiso: true,
          showtxt: true,
          showimg: true,
          showbadge: false,
          clase: "btn btn-success boton btn-sm",
          habilitar: false,
          imprimir: false
        },
        {
          orig: "btnBusqProducto",
          paramAccion: "",
          boton: {
            icon: "fa fa-file-pdf-o",
            texto: "PDF"
          },
          permiso: true,
          showtxt: true,
          showimg: true,
          showbadge: false,
          clase: "btn btn-danger boton btn-sm",
          habilitar: false,
          imprimir: false
        },
      ];
      this.buttonsTwo();
      setTimeout(() => {
        this.getPermisions();
      }, 10);
    }
    
    getPermisions() {
      /* this.lcargando.ctlSpinner(true); */
      this.dataUser = JSON.parse(localStorage.getItem('Datauser'));
      let data = {
        codigo: myVarGlobals.fBusquedaProducto,
        id_rol: this.dataUser.id_rol,
      }
      this.commonServices.getPermisionsGlobas(data).subscribe(res => {
        this.permissions = res['data'][0];
        if (this.permissions.ver == "0") {
          this.toastr.info(
            "Usuario no tiene Permiso para ver la consulta de la Busqueda Productos"
          );
          this.router.navigateByUrl('dashboard');
        } else {
          this.getTableReport();
          this.getProductos();
          this.getCatalogos();
          this.processing = true;
        }
      }, error => {
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      })
    }
    
    metodoGlobal(evento: any) {
      switch (evento.items.boton.texto) {
        case "LIMPIAR":
          this.informaciondtlimpiar();
          break;
        case "EXCEL":
          $('#idTablesearchProduct').DataTable().button('.buttons-csv').trigger();
          break;
        case "PDF":
          $('#idTablesearchProduct').DataTable().button('.buttons-pdf').trigger();
          break;
        case "IMPRIMIR":
          $('#idTablesearchProduct').DataTable().button('.buttons-print').trigger();
          break;
      }
    }
    
    
    getTableReport() {
      let data = {
        id_producto: this.producto == 0 ? null : this.producto,
        generico: this.generico == 0 ? null : this.generico,
        marca: this.marca == 0 ? null : this.marca,
        precio: this.precio == 0 ? null : this.precio,
        tipo: this.precio !== 0 ? "tipo" : null,
      }
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 10,
        search: true,
        paging: true,
        buttons: [{
            extend: "csv",
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
            customize: function (win) {
              $(win.document.body).find('td').addClass('centrard text-center');
              $(win.document.body).find('tbody').css('font-size', '11px');
            }
          },
          {
            extend: "pdf",
            footer: true,
            title: "Reporte",
            filename: "Reporte",
            customize: function (doc) {
              doc.defaultStyle.fontSize = 8,
                doc.defaultStyle.alignment = 'center',
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
                } //para cambiar el backgorud del escabezado
            },
          },
        ],
        language: {
          url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
        }
      };
      this.reportesSrv.showserchProducts(data).subscribe(res => {
        this.validaDtUser = true;
        this.guardarolT = res['data'];
        if (this.guardarolT.length > 0) {
          this.vmButtons[1].habilitar = false;
          this.vmButtons[2].habilitar = false;
          this.vmButtons[3].habilitar = false;
      } else {
          this.vmButtons[1].habilitar = true;
          this.vmButtons[2].habilitar = true;
          this.vmButtons[3].habilitar = true;
      }
        this.lcargando.ctlSpinner(false);
        setTimeout(() => {
          this.dtTrigger.next();
        }, 50);
      }, error => {
        this.validaDtUser = true;
        this.lcargando.ctlSpinner(false);
        setTimeout(() => {
          this.dtTrigger.next();
        }, 50);
        this.lcargando.ctlSpinner(false);
        this.toastr.info(error.error.message);
      });
    }
    
    rerender(): void {
      this.validaDtUser = false;
      this.lcargando.ctlSpinner(true);
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.getTableReport();
      });
    }
    
    informaciondtlimpiar() {
      this.producto = 0;
      this.generico = 0;
      this.marca = 0;
      this.precio = 0;
      this.rerender();
    }
    
    informacionProduct(dt) {
      this.commonVarSrv.sendAnexos.next(dt.id_producto);
      this.id_producto = dt.id_producto;
      this.click.codigo = dt.codigoProducto;
      this.click.nombre = dt.nombre;
      this.click.marca = dt.marca;
      this.click.color = dt.color;
      this.click.cantReservada = dt.cantidad_reservada;
      this.click.produccion = dt.enProduccion;
      this.click.procedencia = dt.procedencia;
      this.click.presentacion = dt.presentacion;
      this.click.consumidor = this.formatNumber(parseFloat(dt.pvp_ant));
      this.click.fijo = this.formatNumber(parseFloat(dt.p1a));
      this.click.concurrente = this.formatNumber(parseFloat(dt.p2a));
      this.click.minorista = this.formatNumber(parseFloat(dt.p3a));
      this.click.medio = this.formatNumber(parseFloat(dt.p4a));
      this.click.mayorista = this.formatNumber(parseFloat(dt.p5a));
      this.click.observacion = dt.observation;
      this.click.codigoParte = dt.num_parte;
      this.click.stockActual = this.formatNumber(parseFloat(dt.stock));
      this.click.modelo = dt.modelo;
      this.click.stockTran = this.formatNumber(parseFloat(dt.enTransitoLocal + dt.enImportacion));
      ($("#pills-contabilidad-tab") as any).tab("show");
      $('#modalSeachProduct').appendTo("body").modal('show');
    }
    
    closeModal() {
      this.click = [];
      this.data = [];
      this.general = "";
      ($("#pills-contabilidad-tab") as any).tab("show");
      ($("#modalSeachProduct") as any).modal("hide"); /* linea para cerrar el modal de boostrap */
    }
    
    getCatalogos() {
      let data = {
        id: 2,
      };
      this.dataConsultarDocumento = data;
    }
    
    getProductos() {
      this.reportesSrv.getProducts().subscribe((res) => {
        this.products = res["data"];
        this.getPrecio();
      });
    }
    
    getPrecio() {
      this.reportesSrv.getPrecio().subscribe((res) => {
        this.dataPrecio = res["data"];
        this.getMarca();
      });
    }
    
    getMarca() {
      this.reportesSrv.getMarcas().subscribe((res) => {
        this.marcas = res["data"];
      });
    }
    
    
    searchPrecio(event) {
      if (this.precio != 0) {
        this.precio = event;
        for (let i = 0; i < this.guardarolT.length; i++) {
          if (event == "PVP") {
            this.guardarolT[i]["PVP"];
          } else if (event == "precio1") {
            this.guardarolT[i]["precio1"];
          } else if (event == "precio2") {
            this.guardarolT[i]["precio2"];
          } else if (event == "precio3") {
            this.guardarolT[i]["precio3"];
          } else if (event == "precio4") {
            this.guardarolT[i]["precio4"];
          } else if (event == "precio5") {
            this.guardarolT[i]["precio5"];
          }
        }
        this.rerender();
      } else {
        this.rerender();
      }
    }
    
    filterGenerico(event) {
      if (this.generico != 0) {
        this.generico = event;
        this.rerender();
      } else {
        this.rerender();
      }
    }
    
        
    filterProducto(data) {
      if (this.producto != 0) {
        this.producto = data;
        this.rerender();
      } else {
        this.rerender();
      }
    }

    filterMarca(event) {
      if (this.marca != 0) {
        this.marca = event;
        this.rerender();
      } else {
        this.rerender();
      }
    }
    
    buttonsTwo() {
      this.vmButtonsT = [{
        orig: "btnRepCtasBacnT",
        paramAccion: "",
        boton: {
          icon: "fas fa-times",
          texto: "CERRAR"
        },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-info boton btn-sm",
        habilitar: false,
        imprimir: false
      }, ];
    }
    
    metodoGlobalT(evento: any) {
      switch (evento.items.boton.texto) {
        case "CERRAR":
          this.closeModal();
          break;
      }
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
