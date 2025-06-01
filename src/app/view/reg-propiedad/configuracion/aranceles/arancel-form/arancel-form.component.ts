import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ArancelesService } from "./../aranceles.service";
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import * as myVarGlobals from "../../../../../global";
import { CommonService } from "src/app/services/commonServices";
import { CommonVarService } from "src/app/services/common-var.services";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";

@Component({
standalone: false,
    selector: "app-arancel-form",
    templateUrl: "./arancel-form.component.html",
    styleUrls: ["./arancel-form.component.scss"],
})
export class ArancelFormComponent implements OnInit {
    mensajeSppiner: string = "Cargando...";
    @ViewChild(CcSpinerProcesarComponent, { static: false }) lcargando: CcSpinerProcesarComponent;

    dataUser: any;

    @Input() module_comp: any;
    @Input() isNuevoArancel: any;
    @Input() arancelId: any;
    @Input() permissions: any;
    @Input() fTitle: any;
    vmButtons: any;

    calculo_base: any;
    tipo_base: any;
    doc_base: any;

    arancel: any;

    needRefesh: any = false;

    estadoList: any = [];

    constructor(
        public activeModal: NgbActiveModal,
        private toastr: ToastrService,
        private commonService: CommonService,
        private arancelesSrv: ArancelesService,
        private commonVarService: CommonVarService,
    ) { }

    ngOnInit(): void {
        this.vmButtons = [
            {
                orig: "btnArancelForm",
                paramAccion: "",
                boton: { icon: "fas fa-save", texto: " GUARDAR" },
                permiso: true,
                showtxt: true,
                showimg: true,
                showbadge: false,
                clase: "btn btn-success boton btn-sm",
                habilitar: false,
            },
            {
                orig: "btnArancelForm",
                paramAccion: "",
                boton: { icon: "fas fa-chevron-left", texto: " REGRESAR" },
                permiso: true,
                showtxt: true,
                showimg: true,
                showbadge: false,
                clase: "btn btn-danger boton btn-sm",
                habilitar: false,
            }
        ];
        this.dataUser = JSON.parse(localStorage.getItem("Datauser"));

        this.estadoList = [
            {
                value: "A",
                label: "Activo"
            },
            {
                value: "I",
                label: "Inactivo"
            },
        ]

        this.arancel = {
            id: "",
            codigo: "",
            descripcion: "",
            estado: 0,
            llenado_formulario: false,
            cuantia: false,
            avaluo: false,
            aplica_exoneracion: false,
            desc_calculo: 0,
            desc_tipo: 0,
            desc_doc: 0,
            valor: 0,
            porcentaje: 0,
            fk_calculo: 0,
            fk_tipo: 0,
            fk_doc: 0,
        }
        
        setTimeout(() => {
            this.fillCatalog();
            if (!this.isNuevoArancel) {
                this.getArancel(this.arancelId);
            }
        }, 0);
    }

    fillCatalog() {
        this.mensajeSppiner = "Cargando datos...";
        this.lcargando.ctlSpinner(true);
		let data = {
			params: "'ARAN_CALCULO', 'ARAN_TIPO', 'ARAN_CERT_INS'",
		};
		this.arancelesSrv.getCatalogs(data).subscribe(
            (res) => {
                this.calculo_base = res["data"]["ARAN_CALCULO"];
                this.tipo_base = res["data"]["ARAN_TIPO"];
                this.doc_base = res["data"]["ARAN_CERT_INS"];
                this.lcargando.ctlSpinner(false);
            },
            (error) => {
                this.lcargando.ctlSpinner(false);
                this.toastr.info(error.error.message);
            }
        );
	}

    validateDataGlobal() {
        let flag = false;
        return new Promise((resolve, reject) => {
            if (
                this.arancel.codigo == "" ||
                this.arancel.codigo == undefined
            ) {
                this.toastr.info("Introduzca un código para el Arancel");
                flag = true;
            } else if (this.arancel.estado == 0) {
                this.toastr.info("Seleccione un estado para el Arancel.");
                flag = true;
            } else if (
                this.arancel.descripcion == "" ||
                this.arancel.descripcion == undefined
            ) {
                this.toastr.info("Introduzca una descripción para el Arancel");
                flag = true;
            } else if (
                this.arancel.descripcion == "" ||
                this.arancel.descripcion == undefined
            ) {
                this.toastr.info("Introduzca una descripción para el Arancel");
                flag = true;
            } else if (this.arancel.desc_tipo == 0) {
                this.toastr.info("Seleccione un tipo para el Arancel");
                flag = true;
            } else if (this.arancel.desc_doc == 0) {
                this.toastr.info("Seleccione un documento para el Arancel");
                flag = true;
            } else if (this.arancel.desc_calculo == 0) {
                this.toastr.info("Seleccione un tipo de cálculo para el Arancel");
                flag = true;
            } else if (
                (this.arancel.desc_calculo == 'FI' || this.arancel.desc_calculo == 'FO') &&
                this.arancel.valor == 0
            ) {
                this.toastr.info("Introduzca un valor para el Arancel");
                flag = true;
            } else if (
                this.arancel.desc_calculo == 'FO' &&
                this.arancel.porcentaje == 0
            ) {
                this.toastr.info("Introduzca un porcentaje para el Arancel");
                flag = true;
            } 
            !flag ? resolve(true) : resolve(false);
        });
    }

    changeCalculo() {
        console.log(this.arancel.desc_calculo)
        if (this.arancel.desc_calculo !== "FI" && this.arancel.desc_calculo !== "FO") {
            this.arancel.valor = 0;
        }
        if (this.arancel.desc_calculo !== "FO") {
            this.arancel.porcentaje = 0;
        }
    }

   

    getArancel(id) {
        this.mensajeSppiner = "Obteniendo arancel..."
        this.lcargando.ctlSpinner(true);
        this.arancelesSrv.getArancel(id).subscribe(
            (res) => {
                this.arancel = res["data"];
                this.lcargando.ctlSpinner(false);
            },
            (error) => {
                this.lcargando.ctlSpinner(false);
                this.toastr.info(error.error.message);
            }
        );
    }

    metodoGlobal(evento: any) {
        switch (evento.items.boton.texto) {
            case " REGRESAR":
                this.closeModal();
                break;
            case " GUARDAR":
                this.validateArancel();
                break;
        }
    }

    async validateArancel() {
        if (this.isNuevoArancel && this.permissions.guardar == "0") {
            this.toastr.warning("No tiene permisos para crear nuevos Aranceles.", this.fTitle);
        } else if (!this.isNuevoArancel && this.permissions.editar == "0") {
            this.toastr.warning("No tiene permisos para editar Aranceles.", this.fTitle);
        } else {
            let resp = await this.validateDataGlobal().then((respuesta) => {
                if (respuesta) {
                    if (this.isNuevoArancel) {
                        this.createArancel();
                    } else {
                        this.editArancel();
                    }
                }
            });
        }
    }

    createArancel() {
        Swal.fire({
            icon: "warning",
            title: "¡Atención!",
            text: "¿Seguro que desea crear un nuevo Arancel?",
            showCloseButton: true,
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonText: "Aceptar",
            cancelButtonColor: '#F86C6B',
            confirmButtonColor: '#4DBD74',
        }).then((result) => {
            if (result.isConfirmed) {
                this.mensajeSppiner = "Guardando arancel..."
                this.lcargando.ctlSpinner(true);
                this.arancel.fk_calculo = this.calculo_base.filter(e => e.descripcion == this.arancel.desc_calculo)[0]['id_catalogo'];
                this.arancel.fk_tipo = this.tipo_base.filter(e => e.descripcion == this.arancel.desc_tipo)[0]['id_catalogo'];
                this.arancel.fk_doc = this.doc_base.filter(e => e.descripcion == this.arancel.desc_doc)[0]['id_catalogo'];
                this.arancel.porcentaje = +this.arancel.porcentaje / 100;
                this.arancelesSrv.createArancel({arancel: this.arancel}).subscribe(
                    (res) => {
                        if (res["status"] == 1) {
                        Object.assign(this.arancel, res["data"]);
                        this.arancel.porcentaje = +res["data"]["porcentaje"] * 100;
                        this.isNuevoArancel = false;
                        this.needRefesh = true;
                        this.lcargando.ctlSpinner(false);
                        Swal.fire({
                            icon: "success",
                            title: "Arancel Creado",
                            text: res['message'],
                            showCloseButton: true,
                            confirmButtonText: "Aceptar",
                            confirmButtonColor: '#20A8D8',
                        });
                        } else {
                        this.lcargando.ctlSpinner(false);
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: res['message'],
                            showCloseButton: true,
                            confirmButtonText: "Aceptar",
                            confirmButtonColor: '#20A8D8',
                        });
                        }
                    },
                        (error) => {
                            this.lcargando.ctlSpinner(false);
                            this.toastr.info(error.error.message);
                    }
                )
            }
        });
    }

    editArancel() {
        Swal.fire({
            icon: "warning",
            title: "¡Atención!",
            text: "¿Seguro que desea editar este Arancel?",
            showCloseButton: true,
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonText: "Aceptar",
            cancelButtonColor: '#F86C6B',
            confirmButtonColor: '#4DBD74',
        }).then((result) => {
            if (result.isConfirmed) {
                this.mensajeSppiner = "Guardando arancel..."
                this.lcargando.ctlSpinner(true);
                this.arancel.fk_calculo = this.calculo_base.filter(e => e.descripcion == this.arancel.desc_calculo)[0]['id_catalogo'];
                this.arancel.fk_tipo = this.tipo_base.filter(e => e.descripcion == this.arancel.desc_tipo)[0]['id_catalogo'];
                this.arancel.fk_doc = this.doc_base.filter(e => e.descripcion == this.arancel.desc_doc)[0]['id_catalogo'];
                this.arancelesSrv.editArancel(this.arancel.id, {arancel: this.arancel}).subscribe(
                    (res) => {
                        if (res["status"] == 1) {
                        this.needRefesh = true;
                        this.lcargando.ctlSpinner(false);
                        Swal.fire({
                            icon: "success",
                            title: "Arancel Actualizado",
                            text: res['message'],
                            showCloseButton: true,
                            confirmButtonText: "Aceptar",
                            confirmButtonColor: '#20A8D8',
                        });
                        this.closeModal()
                        } else {
                        this.lcargando.ctlSpinner(false);
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: res['message'],
                            showCloseButton: true,
                            confirmButtonText: "Aceptar",
                            confirmButtonColor: '#20A8D8',
                        });
                        }
                    },
                        (error) => {
                            this.lcargando.ctlSpinner(false);
                            this.toastr.info(error.error.message);
                    }
                )
            }
        });
    }

    onlyNumberDot(event): boolean {
        let key = event.which ? event.which : event.keyCode;
        if (key !== 46 && key > 31 && (key < 48 || key > 57)) {
            return false;
        }
        return true;
    }

    closeModal() {
        this.commonVarService.editArancel.next(this.needRefesh);
        this.activeModal.dismiss();
    }

}
