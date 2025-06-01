

import { Component, OnInit, ViewChild } from "@angular/core";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import * as myVarGlobals from "../../../../global";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DataTableDirective } from "angular-datatables";
import { OfertasServices } from "./ofertas.service";
import { CommonVarService } from "../../../../services/common-var.services";
import { CommonService } from "../../../../services/commonServices";
import { CcSpinerProcesarComponent } from '../../../../config/custom/cc-spiner-procesar.component';
import "sweetalert2/src/sweetalert2.scss";
import { ConsultaCentroModule } from "src/app/view/contabilidad/centro-costo/consulta/consulta.module";
const Swal = require("sweetalert2");
declare const $: any;
@Component({
standalone: false,
    selector: "app-ofertas",
    templateUrl: "./ofertas.component.html",
    styleUrls: ["./ofertas.component.scss"],
}) export class OfertasComponent implements OnInit {
    mensajeSppiner: string = "Cargando...";
    @ViewChild(CcSpinerProcesarComponent, {
        static: false
    }) lcargando: CcSpinerProcesarComponent;
    /* Datatable options */
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: any = {};
    dtTrigger = new Subject();
    dataUser: any;
    processing: any = false;
    permisions: any;
    precioSelect: any;
    validaDtUser: any = false;
    dataProducto: any;
    vmButtons: any = [];
    locality: any;
    actions: any = {
        dComponet: false, //inputs
        btnNuevo: false,
        btnGuardar: false,
        btncancelar: false,
        btneditar: false,
        btneliminar: false,
    };
    promo: any = {
        cantidad: 0,
        porcentaje: 0,
        descuento: 0,
        cantidadAnterior: 0,
        precio: 0
    };
    processingtwo: boolean = false;
    viewDate: Date = new Date();
    fromDatePicker: Date = new Date(
        this.viewDate.getFullYear(),
        this.viewDate.getMonth(),
        1
    );
    toDatePicker: Date = new Date();
    dataPrecio: any = [];
    guardarolT: any = [];
    disPorcentanje: any = true;
    disFechas: any = true;
    id_precio: any;
    dataShowProducts: any;
    descuento: any;
    id_producto: any;
    proNombre: any = "Nombre producto";
    proCodigo: any = "Código producto";
    proTipo: any = "Tipo producto";
    proGrupo: any = "Grupo producto";

    constructor(private toastr: ToastrService, private router: Router, private modalService: NgbModal, private commonServices: CommonService, private ofertasSrv: OfertasServices,
        private commonVarSrvice: CommonVarService) { }

    ngOnInit(): void {
        this.vmButtons = [{
            orig: "btnsOfertas",
            paramAccion: "",
            boton: {
                icon: "fa fa-pencil-square-o",
                texto: "ACTUALIZAR"
            },
            permiso: true,
            showtxt: true,
            showimg: true,
            showbadge: false,
            clase: "btn btn-info boton btn-sm",
            habilitar: true,
            imprimir: false
        },
        {
            orig: "btnsOfertas",
            paramAccion: "",
            boton: {
                icon: "fa fa-times",
                texto: "CANCELAR"
            },
            permiso: true,
            showtxt: true,
            showimg: true,
            showbadge: false,
            clase: "btn btn-danger boton btn-sm",
            habilitar: true,
            imprimir: false
        },
        {
            orig: "btnsOfertas",
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
            orig: "btnsOfertas",
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
            orig: "btnsOfertas",
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
        setTimeout(() => {
            this.permisos();
        }, 10);
    }

    permisos() {
        this.lcargando.ctlSpinner(true);
        this.dataUser = JSON.parse(localStorage.getItem("Datauser"));
        let id_rol = this.dataUser.id_rol;
        let data = {
            id: 2,
            codigo: myVarGlobals.fOfertas,
            id_rol: id_rol,
        };
        this.commonServices.getPermisionsGlobas(data).subscribe(
            (res) => {
                this.permisions = res["data"][0];
                if (this.permisions.ver == "0") {
                    this.toastr.info("Usuario no tiene Permiso para ver el formulario de Ofertas");
                    this.vmButtons = [];
                    this.lcargando.ctlSpinner(false);
                } else {
                    document.getElementById("idCantidadActual").style.color = "#F89406";
                    document.getElementById("idDescuento").style.color = "green";
                    this.getData();
                    this.getPrecio();
                }
            },
            (error) => {
                this.lcargando.ctlSpinner(false);
                this.toastr.info(error.error.message);
            }
        );
    }

    metodoGlobal(evento: any) {
        switch (evento.items.boton.texto) {
            case "ACTUALIZAR":
                this.validaSaveparameter();
                break;
            case "CANCELAR":
                this.cleanOfert();
                break;
            case "EXCEL":
                $('#tableOfertas').DataTable().button('.buttons-excel').trigger();
                break;
            case "PDF":
                $('#tableOfertas').DataTable().button('.buttons-pdf').trigger();
                break;
            case "IMPRIMIR":
                $('#tableOfertas').DataTable().button('.buttons-print').trigger();
                break;
        }
    }

    getDataTable() {
        this.dtOptions = {
            pagingType: "full_numbers",
            pageLength: 10,
            search: true,
            paging: true,
            buttons: [{
                extend: "excel",
                footer: true,
                title: "Listado de Ofertas Disponible",
                charset: 'UTF-8',
                bom: true,
                filename: "reportes",
            },
            {
                extend: "print",
                footer: true,
                title: "Reporte",
                filename: "Listado de Ofertas Disponible",
                customize: function (win) {
                    $(win.document.body).find('tbody').css('font-size', '11px');
                }
            },
            {
                extend: "pdf",
                footer: true,
                title: "Listado de Ofertas Disponible",
                filename: "Reporte Pdf",
                customize: function (doc) {
                    doc.defaultStyle.fontSize = 10,
                        doc.defaultStyle.alignment = 'center',
                        doc.styles.title = {
                            color: '#404a63',
                            fontSize: '14',
                            alignment: 'center',
                            bold: true,
                        },//title
                        doc.styles.tableHeader = {
                            fillColor: '#404a63',
                            color: 'white',
                            fontSize: '12',
                            alignment: 'center',
                            bold: true,
                        }//para cambiar el backgorud del escabezado
                },
            },
            ],
            language: {
                url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json",
            },
        };
        this.lcargando.ctlSpinner(true);
        this.ofertasSrv.tablaOferts().subscribe(
            (res) => {
                this.lcargando.ctlSpinner(false);
                this.processing = true;
                this.validaDtUser = true;
                this.guardarolT = res["data"];
                if (this.guardarolT.length == 0) {
                    this.vmButtons[2].habilitar = true;
                    this.vmButtons[3].habilitar = true;
                    this.vmButtons[4].habilitar = true;
                } else {
                    this.vmButtons[2].habilitar = false;
                    this.vmButtons[3].habilitar = false;
                    this.vmButtons[4].habilitar = false;
                }
                setTimeout(() => {
                    this.dtTrigger.next(null);
                }, 50);
            },
            (error) => {
                this.lcargando.ctlSpinner(false);
                this.validaDtUser = true;
                this.guardarolT = [];
                this.processing = true;
                setTimeout(() => {
                    this.dtTrigger.next(null);
                }, 50);
                this.vmButtons[2].habilitar = true;
                this.vmButtons[3].habilitar = true;
                this.vmButtons[4].habilitar = true;
            }
        );
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }

    newOferta() {
        this.actions.btnGuardar = true;
        this.actions.btncancelar = true;
        this.actions.dComponet = true;
    }

    getData() {
        let data = {
            id: 1,
        };
        this.dataProducto = data;
    }

    getPrecio() {
        this.ofertasSrv.getPrecio().subscribe((res) => {
            this.dataPrecio = res["data"];
            this.getProducts();
        }, error => {
            this.lcargando.ctlSpinner(false);
        });
    }

    setPorcentaje() {
        if (this.promo.checkPorcentaje == true) {
            (<HTMLInputElement>document.getElementById("idPorcentaje")).disabled =
                false;
        } else {
            (<HTMLInputElement>document.getElementById("idPorcentaje")).disabled =
                true;
        }
    }

    setAgotarStock() {
        if (this.promo.stock == true) {
            this.disFechas = true;
            (<HTMLInputElement>document.getElementById("idFechaPromo")).disabled =
                true;
            this.fromDatePicker = new Date("yyyy-MM-dd");
            this.toDatePicker = new Date("yyyy-MM-dd");
        } else {
            this.disFechas = false;
            (<HTMLInputElement>document.getElementById("idFechaPromo")).disabled =
                false;
            this.fromDatePicker = new Date(
                this.viewDate.getFullYear(),
                this.viewDate.getMonth(),
                1
            );
            this.toDatePicker = new Date();
        }
    }

    cleanOfert() {
        this.vmButtons[0].habilitar = true;
        this.vmButtons[1].habilitar = true;
        this.promo.producto = "";
        this.promo.cantidadAnterior = 0;
        this.promo.cantidad = 0;
        this.promo.descuento = 0;
        this.promo.porcentaje = 0;
        this.promo.promocion = false;
        this.proNombre = "Nombre producto";
        this.proCodigo = "Código producto";
        this.proTipo = "Tipo producto";
        this.proGrupo = "Grupo producto";
        this.promo.precio = 0;
        this.actions.dComponet = false;
        document.getElementById("idPorcentaje").style.border = "none";
        document.getElementById("idGrupoPrecio").style.border = "none";
    }

    searchPrecio(event) {
        document.getElementById("idGrupoPrecio").style.border = "none";
        document.getElementById("idPorcentaje").style.border = "1px solid #1FA2D0";
        this.promo.precio = event;
        let filt = this.dataPrecio.find((e) => e.reference == event);
        let filtDesc = this.guardarolT.find(
            (e) => e.fk_product == this.id_producto
        );
        this.promo.cantidadAnterior = parseFloat(
            filtDesc[filt["reference_two"]]
        ).toFixed(2);
        this.promo.cantidad = parseFloat(filtDesc[filt["reference"]]).toFixed(
            2
        );
        this.promo.promocion = filtDesc.inPromotion == 1 ? true : false;
        this.promo.porcentaje = parseFloat(filtDesc[filt["reference_rate"]]);

        this.promo.descuento = parseFloat(filtDesc[filt["reference_value"]]).toFixed(2);
    }

    Saveoferta() {
        document.getElementById("idPorcentaje").style.border = "none";
        document.getElementById("idGrupoPrecio").style.border = "none";
        let filt = this.dataPrecio.find((e) => e.reference == this.promo.precio);
        let filtDesc = this.guardarolT.find(
            (e) => e.fk_product == this.id_producto
        );
        let data = {
            fk_product: this.id_producto,
            PVP: this.promo.precio == "PVP" ?
                parseFloat(this.promo.cantidad) : parseFloat(filtDesc.PVP),
            precio1: this.promo.precio == "precio1" ?
                parseFloat(this.promo.cantidad) : parseFloat(filtDesc.precio1),
            precio2: this.promo.precio == "precio2" ?
                parseFloat(this.promo.cantidad) : parseFloat(filtDesc.precio2),
            precio3: this.promo.precio == "precio3" ?
                parseFloat(this.promo.cantidad) : parseFloat(filtDesc.precio3),
            precio4: this.promo.precio == "precio4" ?
                parseFloat(this.promo.cantidad) : parseFloat(filtDesc.precio4),
            precio5: this.promo.precio == "precio5" ?
                parseFloat(this.promo.cantidad) : parseFloat(filtDesc.precio5),
            pvp_ant: filt["reference_two"] == "pvp_ant" ?
                parseFloat(this.promo.cantidadAnterior) : parseFloat(filtDesc.pvp_ant),
            p1a: filt["reference_two"] == "p1a" ?
                parseFloat(this.promo.cantidadAnterior) : parseFloat(filtDesc.p1a),
            p2a: filt["reference_two"] == "p2a" ?
                parseFloat(this.promo.cantidadAnterior) : parseFloat(filtDesc.p2a),
            p3a: filt["reference_two"] == "p3a" ?
                parseFloat(this.promo.cantidadAnterior) : parseFloat(filtDesc.p3a),
            p4a: filt["reference_two"] == "p4a" ?
                parseFloat(this.promo.cantidadAnterior) : parseFloat(filtDesc.p4a),
            p5a: filt["reference_two"] == "p5a" ?
                parseFloat(this.promo.cantidadAnterior) : parseFloat(filtDesc.p5a),
            valor_descuento: filt["reference_value"] == "valor_descuento" ?
                parseFloat(this.promo.descuento) : parseFloat(filtDesc.valor_descuento),
            v1: filt["reference_value"] == "v1" ?
                parseFloat(this.promo.descuento) : parseFloat(filtDesc.v1),
            v2: filt["reference_value"] == "v2" ?
                parseFloat(this.promo.descuento) : parseFloat(filtDesc.v2),
            v3: filt["reference_value"] == "v3" ?
                parseFloat(this.promo.descuento) : parseFloat(filtDesc.v3),
            v4: filt["reference_value"] == "v4" ?
                parseFloat(this.promo.descuento) : parseFloat(filtDesc.v4),
            v5: filt["reference_value"] == "v5" ?
                parseFloat(this.promo.descuento) : parseFloat(filtDesc.v5),
            rate: filt["reference_rate"] == "rate" ?
                parseFloat(this.promo.porcentaje) : parseFloat(filtDesc.rate),
            r1: filt["reference_rate"] == "r1" ?
                parseFloat(this.promo.porcentaje) : parseFloat(filtDesc.r1),
            r2: filt["reference_rate"] == "r2" ?
                parseFloat(this.promo.porcentaje) : parseFloat(filtDesc.r2),
            r3: filt["reference_rate"] == "r3" ?
                parseFloat(this.promo.porcentaje) : parseFloat(filtDesc.r3),
            r4: filt["reference_rate"] == "r4" ?
                parseFloat(this.promo.porcentaje) : parseFloat(filtDesc.r4),
            r5: filt["reference_rate"] == "r5" ?
                parseFloat(this.promo.porcentaje) : parseFloat(filtDesc.r5),
            inPromotion: this.promo.promocion == true ? 1 : 0,
            ip: this.commonServices.getIpAddress(),
            accion: "Registro actualizado de productos " +
                filtDesc.nombre_producto +
                "en Oferta ",
            id_controlador: myVarGlobals.fOfertas,
        };

        this.ofertasSrv.SaveOferta(data).subscribe(
            (res) => {
                this.toastr.success(res["message"]);
                this.cleanOfert();
                this.dataProducto = { id: 1 };
                this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    dtInstance.destroy();
                    this.getPrecio();
                });
            },
            (error) => {
                this.toastr.info(error.error.message);
            }
        );
    }

    async confirmSave(message, action) {
        Swal.fire({
            title: "Atención!!",
            text: message,
            type: "warning",
            showCancelButton: true,
            cancelButtonColor: "#DC3545",
            confirmButtonColor: "#13A1EA",
            confirmButtonText: "Aceptar",
        }).then((result) => {
            if (result.value) {
                if (action == "SAVE_OFERTA") {
                    this.Saveoferta();
                }
            }
        });
    }

    valCupo(e) {
        let valuePorcentaje = e / 100;
        var total = parseFloat(this.promo.cantidadAnterior) * valuePorcentaje;
        this.promo.descuento = parseFloat(total.toString()).toFixed(2);
        var descuento = this.promo.cantidadAnterior - this.promo.descuento;
        this.promo.cantidad = descuento.toFixed(2);
    }

    /*  valCupo() {
         var total = [this.promo.cantidadAnterior, this.promo.porcentaje].reduce(
             function (a, b) {
                 return a * (b / 100);
             });
         this.promo.descuento = total;
         var descuento = this.promo.cantidadAnterior - this.promo.descuento;
         this.promo.cantidad = descuento.toFixed(2);
     } */

    async validaSaveparameter() {
        if (this.permisions.guardar == "0") {
            this.toastr.info("Usuario no tiene permiso para guardar");
            this.router.navigateByUrl("dashboard");
        } else {
            let resp = await this.validateDataGlobal().then((respuesta) => {
                if (respuesta) {
                    this.confirmSave("Seguro desea guardar la Oferta?", "SAVE_OFERTA");
                }
            });
        }
    }

    validateDataGlobal() {
        return new Promise((resolve, reject) => {
            if (this.promo.producto == undefined) {
                this.toastr.info("Buscar y Seleccione un producto");
                let autFocus = document.getElementById("idbuscar").focus();
            } else if (this.promo.precio == 0) {
                this.toastr.info("Selecione Grupo Precio");
                let autFocus = document.getElementById("idPrecio").focus();
            } else if (this.promo.promocion == undefined) {
                this.toastr.info("Selecione si está en promoción");
                let autFocus = document.getElementById("idpromocion").focus();
            } else if (this.promo.porcentaje == 0) {
                this.toastr.info("Ingrese el porcentaje de la Oferta");
                let autFocus = document.getElementById("idPorcentaje").focus();
            } else if (
                this.promo.cantidadAnterior == 0 || this.promo.cantidad == 0 || this.promo.descuento == 0) {
                this.toastr.info("Ingrese el porcentaje para realizar el calculo");
                let autFocus = document.getElementById("idPorcentaje").focus();
            } else {
                return resolve(true);
            }
        });
    }

    getProducts() {
        this.ofertasSrv.getProducts().subscribe((res) => {
            this.dataShowProducts = res["data"];
            this.getDataTable();
        }, error => {
            this.lcargando.ctlSpinner(false);
        });
    }

    updateOfert(dt) {
        document.getElementById("idGrupoPrecio").style.border = "1px solid #1FA2D0";
        document.getElementById("idPorcentaje").style.border = "none";
        this.vmButtons[0].habilitar = false;
        this.vmButtons[1].habilitar = false;
        this.actions.dComponet = true;
        this.promo.cantidadAnterior = 0;
        this.promo.cantidad = 0;
        this.promo.promocion = false;
        this.promo.porcentaje = 0;
        this.promo.descuento = 0;
        this.promo.precio = 0;
        this.id_producto = dt.fk_product;
        let product = this.dataShowProducts.filter(
            (e) => e.id_producto == this.id_producto);
        let productPromonombre = product[0].nombre;
        let proGrupo = product[0].clase;
        let proCodigo = product[0].codigoProducto;
        let proTipo = product[0].tipo;
        this.promo.producto = productPromonombre;
        this.proNombre = productPromonombre;
        this.proCodigo = proCodigo;
        this.proTipo = proTipo;
        this.proGrupo = proGrupo;
    }

    FormatDecimalVal(event): boolean {
        let key = (event.which) ? event.which : event.keyCode;
        if (key > 31 && (key < 46 || key > 57)) {
            return false;
        }
        return true;
    }

    formatNumber(params) {
        let locality = 'en-EN';
        params = parseFloat(params).toLocaleString(locality, {
            minimumFractionDigits: 4
        })
        params = params.replace(/[,.]/g, function (m) {
            return m === ',' ? '.' : ',';
        });
        return params;
    }

}
