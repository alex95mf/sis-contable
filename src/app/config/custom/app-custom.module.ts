import { NgSelectModule } from "@ng-select/ng-select";
import { CcInputGroupPrepend } from "./cc-input-group-prepend.component";
import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import {
  NgbModule,
  NgbCollapse,
  NgbActiveModal,
} from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ToastrModule } from "ngx-toastr";
import { FileUploadModule } from "ng2-file-upload";
import { DatePipe } from "@angular/common";
// import { ChartsModule } from "ng2-charts";
import { provideCharts, withDefaultRegisterables, BaseChartDirective  } from 'ng2-charts';
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ButtonsModule } from "ngx-bootstrap/buttons";
import { CalendarModule, DatePickerModule } from "@syncfusion/ej2-angular-calendars";
import { NgxDocViewerModule } from "ngx-doc-viewer";
import { NgxExtendedPdfViewerModule } from "ngx-extended-pdf-viewer";
import { TreeViewModule } from "@syncfusion/ej2-angular-navigations";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { NgxPrintModule } from "ngx-print";
import { DataTablesModule } from "angular-datatables";
import { FlatpickrModule } from "angularx-flatpickr";
import { FilterByOriginPipe } from "./pipe/filter-by-origin.pipe";
import { AppMaterialModule } from "../app-material/app-material.module";
import { FilterPipe } from "./pipe/filter.pipe";
import { ConfirmationDialogService } from "./confirmation-dialog/confirmation-dialog.service";
import { ButtonRadioActiveComponent } from "./cc-panel-buttons/button-radio-active.component";
import { ButtonRadioActiveNewComponent } from "./cc-panel-buttons-new/button-radio-active-new.component";
import { Botones } from "./cc-buttons/buttons.componente";
import { ButtonActiveComponent } from "./cc-buttons/button-active.component";
import { PaginatorService } from "./paginator/paginator.service";
import { PaginatorComponent } from "./paginator/paginator.component";
import { CcSpinerProcesarComponent } from "./cc-spiner-procesar.component";
import { NgxSpinnerModule } from "ngx-spinner";
import { MspreguntaComponent } from "./mspregunta/mspregunta.component";
import { ImprimirRolComponent } from "../../view/rrhh/roles/adm-rol-pago/imprimir-rol/imprimir-rol.component";
import { ShowLiquidacionesComponent } from "../../view/importaciones/liquidacion/liquidaciones/show-liquidaciones/show-liquidaciones.component";
import { MultiSelectModule } from "@syncfusion/ej2-angular-dropdowns";
/* import { CommonModalModule } from "../../view/commons/modals/modal.module"; */
import { BusqProveedorComponent } from "../../view/caja-banco/cxp/pago-anticipado/busq-proveedor/busq-proveedor.component";
import { GeneraPagoComponent } from "../../view/caja-banco/cxp/pago-anticipado/genera-pago/genera-pago.component";
import { ImprimirComponent } from "../../view/caja-banco/cxp/pago-anticipado/imprimir/imprimir.component";
import { ButtonModule } from "@syncfusion/ej2-angular-buttons";
import { VistaArchivoComponent } from "../../view/contabilidad/centro-costo/cc-mantenimiento/vista-archivo/vista-archivo.component";
import { CcClientesComponent } from "../../view/contabilidad/centro-costo/cc-mantenimiento/cc-clientes/cc-clientes.component";
import { ShowDiarioComponent } from "../../view/contabilidad/centro-costo/consulta/show-diario/show-diario.component";
import { QRCodeComponent } from "angularx-qrcode";
// import { NgxBarcodeModule } from "ngx-barcode";
import { NgxBarcode6Module } from "ngx-barcode6";
import { BarcodeGeneratorAllModule, DataMatrixGeneratorAllModule, QRCodeGeneratorAllModule } from "@syncfusion/ej2-angular-barcode-generator";
import { ShowBoxComponent } from "../../view/caja-banco/caja-chica/creacion/show-box/show-box.component";
import { ShowActivosComponent } from "../../view/contabilidad/activo-fijo/adquisiciones/show-activos/show-activos.component";
import { DiferedCuotasComponent } from "../../view/contabilidad/activo-fijo/adquisiciones/difered-cuotas/difered-cuotas.component";
import { LstNotaDebitoComponent } from "../../view/caja-banco/cxp/proveedores/lst-nota-debito/lst-nota-debito.component";
import { PagoLetraComponent } from "../../view/caja-banco/cxp/proveedores/pago-letra/pago-letra.component";
import { ShowNotasDebitoComponent } from "../../view/inventario/compras/nota-debito/show-notas-debito/show-notas-debito.component";
import { ReportNotaDebitoComponent } from "src/app/view/cartera/cobranza/nota-debito/report-nota-debito/report-nota-debito.component";
import { ReportNotaDebitoInvComponent } from "../../view/inventario/compras/nota-debito/report-nota-debito/report-nota-debito.component";
import { ShowCuentasInvComponent } from "../../view/inventario/compras/nota-debito/show-cuentas/show-cuentas.component";
import { ListadoRepComponent } from "../../view/inventario/compras/nota-debito/report-nota-debito/listado-rep/listado-rep.component";
import { NgxEditorModule } from "ngx-editor";
import { VistaClientesComponent } from "../../view/comercializacion/facturacion/fac-electronica/vista-clientes/vista-clientes.component";
import { IngChqProtestadoComponent } from "src/app/view/caja-banco/cuentas/cheque-protestado/ing-chq-protestado/ing-chq-protestado.component";
import { InfoClienteComponent } from "src/app/view/caja-banco/cuentas/cheque-protestado/info-cliente/info-cliente.component";
import { ImprimirCheProComponent } from "src/app/view/caja-banco/cuentas/cheque-protestado/imprimir/imprimir.component";
import { ImprimirPrestamoComponent } from "src/app/view/rrhh/roles/prestamos/imprimir/imprimir.component";
import { ModalSupervivenciaComponent } from "./modal-supervivencia/modal-supervivencia.component";

import { ModalContribuyentesComponent } from "./modal-contribuyentes/modal-contribuyentes.component";
import { ModalUsuariosComponent } from "./modal-usuarios/modal-usuarios.component";
import { ModalProveedoresComponent } from "./modal-proveedores/modal-proveedores.component";
import { ModalConceptosComponent } from "./modal-conceptos/modal-conceptos.component";
// import { EncargadoComponent } from "./encargado/encargado.component";
import { ModalDepartamentosComponent } from "./modal-departamentos/modal-departamentos.component";
import { CcSelectMesesComponent } from "./cc-select-meses/cc-select-meses.component";
import { CcModalTablaCuentaComponent } from './cc-modal-tabla-cuenta/cc-modal-tabla-cuenta.component';
import { CcModalTablaProveedoresComponent } from "./cc-modal-tabla-proveedores/cc-modal-tabla-proveedores.component";
import { CcModalTablaComprasComponent } from "./cc-modal-tabla-compras/cc-modal-tabla-compras.component";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { CcModalEditarImpuestosComprasComponent } from "./cc-modal-editar-impuestos-compras/cc-modal-editar-impuestos-compras.component";
import { CcModalPreviewRetencionesComponent } from "./cc-modal-preview-retenciones/cc-modal-preview-retenciones.component";

import { TableModule } from 'primeng/table';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
//import { ButtonModule } from 'primeng/button';
import {TabMenuModule} from 'primeng/tabmenu';
import {TabViewModule} from 'primeng/tabview';
import {SkeletonModule} from 'primeng/skeleton';
import { CcModalTablaCatalogoPresupuestoComponent } from "./cc-modal-tabla-catalogo-presupuesto/cc-modal-tabla-catalogo-presupuesto.component";
import { CcModalTableEmpleadoComponent } from "./modal-component/cc-modal-table-empleado/cc-modal-table-empleado.component";
import { CcModalTableDepartamentoComponent } from "./modal-component/cc-modal-table-departamento/cc-modal-table-departamento.component";
import { CcModalTableJornadaComponent } from "./modal-component/cc-modal-table-jornada/cc-modal-table-jornada.component";
import { CcModalTableSueldoComponent } from "./modal-component/cc-modal-table-sueldo/cc-modal-table-sueldo.component";
import { CcSelectNomAreaComponent } from "./cc-select-nom-catalogo/cc-select-nom-area/cc-select-nom-area.component";
import { CcSelectNomCargoComponent } from "./cc-select-nom-catalogo/cc-select-nom-cargo/cc-select-nom-cargo.component";
import { CcSelectNomCargoParameterComponent } from "./cc-select-nom-catalogo/cc-select-nom-cargo-parameter/cc-select-nom-cargo-parameter.component";
import { CcSelectNomCatalogoComponent } from "./cc-select-nom-catalogo/cc-select-nom-catalogo/cc-select-nom-catalogo.component";
import { CcSelectNomCatalogoLoadComponent } from "./cc-select-nom-catalogo/cc-select-nom-catalogo-load/cc-select-nom-catalogo-load.component";
import { CcSelectNomDepartamentoComponent } from "./cc-select-nom-catalogo/cc-select-nom-departamento/cc-select-nom-departamento.component";
import { CcSelectPeriodosNomComponent } from "./cc-select-nom-catalogo/cc-select-periodos-nom/cc-select-periodos-nom.component";
import { CcModalListFaltasPermisosComponent } from './modal-component/cc-modal-list-faltas-permisos/cc-modal-list-faltas-permisos.component';
import { CcModalTableRubroComponent } from './modal-component/cc-modal-table-rubro/cc-modal-table-rubro.component';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { TreeTableModule } from 'primeng/treetable';

@NgModule({
    declarations: [
        CcInputGroupPrepend,
        ButtonRadioActiveComponent,
        ButtonRadioActiveNewComponent,
        FilterByOriginPipe,
        FilterPipe,
        ButtonActiveComponent,
        PaginatorComponent,
        CcSpinerProcesarComponent,
        MspreguntaComponent,
        ImprimirRolComponent,
        ShowLiquidacionesComponent,
        BusqProveedorComponent,
        GeneraPagoComponent,
        ImprimirComponent,
        VistaArchivoComponent,
        CcClientesComponent,
        ShowDiarioComponent,
        ShowBoxComponent,
        DiferedCuotasComponent,
        ShowActivosComponent,
        LstNotaDebitoComponent,
        PagoLetraComponent,
        ShowCuentasInvComponent,
        ShowNotasDebitoComponent,
        ReportNotaDebitoComponent,
        ReportNotaDebitoInvComponent,
        ListadoRepComponent,
        VistaClientesComponent,
        IngChqProtestadoComponent,
        InfoClienteComponent,
        ImprimirCheProComponent,
        ImprimirPrestamoComponent,
        ModalSupervivenciaComponent,

        ModalContribuyentesComponent,
        ModalProveedoresComponent,
        ModalConceptosComponent,
        // EncargadoComponent,
        ModalDepartamentosComponent,
        CcSelectMesesComponent,
        CcModalTablaCuentaComponent,
        CcModalTablaProveedoresComponent,
        CcModalTablaComprasComponent,
        CcModalEditarImpuestosComprasComponent,
        CcModalPreviewRetencionesComponent,
        CcModalTablaCatalogoPresupuestoComponent,
        CcModalTableEmpleadoComponent,
        CcModalTableDepartamentoComponent,
        CcModalTableJornadaComponent,
        CcModalTableSueldoComponent,
        CcSelectNomAreaComponent,
        CcSelectNomCargoComponent,
        CcSelectNomCargoParameterComponent,
        CcSelectNomCatalogoComponent,
        CcSelectNomCatalogoLoadComponent,
        CcSelectNomDepartamentoComponent,
        CcSelectPeriodosNomComponent,
        CcModalListFaltasPermisosComponent,
        CcModalTableRubroComponent,
        ModalUsuariosComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        FileUploadModule,
        // ChartsModule,
        BaseChartDirective,
        BsDropdownModule,
        ButtonsModule.forRoot(),
        DataTablesModule,
        FlatpickrModule.forRoot(),
        NgxPrintModule,
        InfiniteScrollModule,
        TreeViewModule,
        NgxExtendedPdfViewerModule,
        NgxDocViewerModule,
        DatePickerModule,
        AppMaterialModule,
        NgxSpinnerModule,
        ToastrModule.forRoot(),
        MultiSelectModule,
        TableModule,
        MessagesModule,
        MessageModule,
        TabMenuModule,
        TabViewModule,
        /* CommonModalModule, */
        CalendarModule,
        ButtonModule,
        QRCodeComponent,
        SkeletonModule,
        NgxBarcode6Module,
        BarcodeGeneratorAllModule,
        QRCodeGeneratorAllModule,
        DataMatrixGeneratorAllModule,
        ProgressSpinnerModule,
        TreeTableModule,

        NgxEditorModule.forRoot({
            locals: {
                // menu
                bold: 'Negrita',
                italic: 'Cursiva',
                code: 'Codigo',
                underline: 'Subrayar',
                strike: 'Rayado',
                blockquote: 'Sangria',
                bullet_list: 'Lista de viñetas',
                ordered_list: 'Lista ordenada',
                heading: 'Tamaño Texto',
                h1: 'Encabezado 1',
                h2: 'Encabezado 2',
                h3: 'Encabezado 3',
                h4: 'Encabezado 4',
                h5: 'Encabezado 5',
                h6: 'Encabezado 6',
                align_left: 'Alinear Izquierda',
                align_center: 'Alinear Centro',
                align_right: 'Alinear Derecha',
                align_justify: 'Justificar',
                text_color: 'Color de texto',
                background_color: 'Color de fondo',
                insertLink: 'Insertar Link',
                removeLink: 'Remover Link',
                insertImage: 'Insertar Imagen',
                // pupups, forms, others...
                url: 'URL',
                text: 'Texto',
                openInNewTab: 'Abrir nueva pestaña',
                insert: 'Insertar',
                altText: 'Texto',
                title: 'Titulo',
                remove: 'Por defecto',
            },
        })
    ],
    exports: [
        CommonModule,
        CcInputGroupPrepend,
        NgbModule,
        NgSelectModule,
        FileUploadModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonRadioActiveComponent,
        ButtonRadioActiveNewComponent,
        FilterByOriginPipe,
        DatePickerModule,
        AppMaterialModule,
        FilterPipe,
        ButtonActiveComponent,
        PaginatorComponent,
        CcSpinerProcesarComponent,
        NgxSpinnerModule,
        MspreguntaComponent,
        FlatpickrModule,
        NgxPrintModule,
        ImprimirRolComponent,
        NgxExtendedPdfViewerModule,
        NgxDocViewerModule,
        BusqProveedorComponent,
        GeneraPagoComponent,
        ImprimirComponent,
        DataTablesModule,
        ButtonModule,
        VistaArchivoComponent,
        CcClientesComponent,
        ShowDiarioComponent,
        ShowBoxComponent,
        DiferedCuotasComponent,
        ShowActivosComponent,
        QRCodeComponent,
        LstNotaDebitoComponent,
        PagoLetraComponent,
        ShowCuentasInvComponent,
        ShowNotasDebitoComponent,
        ReportNotaDebitoComponent,
        ReportNotaDebitoInvComponent,
        ListadoRepComponent,
        NgxBarcode6Module,
        NgxEditorModule,
        VistaClientesComponent,
        IngChqProtestadoComponent,
        InfoClienteComponent,
        ImprimirCheProComponent,
        ImprimirPrestamoComponent,
        CcSelectMesesComponent,
        CcModalTablaCuentaComponent,
        CcModalTablaProveedoresComponent,
        CcModalTablaComprasComponent,
        MatSlideToggleModule,
        TableModule,
        MessagesModule,
        MessageModule,
        TabMenuModule,
        TabViewModule,
        CcModalTableSueldoComponent,
        CcSelectNomAreaComponent,
        CcSelectNomCargoComponent,
        CcSelectNomCargoParameterComponent,
        CcSelectNomCatalogoComponent,
        CcSelectNomCatalogoLoadComponent,
        CcSelectNomDepartamentoComponent,
        CcSelectPeriodosNomComponent,
        CcModalListFaltasPermisosComponent,
        ProgressSpinnerModule,
        TreeTableModule
    ],
    providers: [
        DatePipe,
        NgbCollapse,
        NgbActiveModal,
        Botones,
        ConfirmationDialogService,
        PaginatorService
    ],
  entryComponents: [
    MspreguntaComponent,
    ImprimirRolComponent,
    ShowLiquidacionesComponent,
    BusqProveedorComponent,
    GeneraPagoComponent,
    ImprimirComponent,
    VistaArchivoComponent,
    CcClientesComponent,
    ShowDiarioComponent,
    ShowBoxComponent,
    DiferedCuotasComponent,
    ShowActivosComponent,
    LstNotaDebitoComponent,
    PagoLetraComponent,
    ShowCuentasInvComponent,
    ShowNotasDebitoComponent,
    ReportNotaDebitoComponent,
    ReportNotaDebitoInvComponent,
    ListadoRepComponent,
    VistaClientesComponent,
    IngChqProtestadoComponent,
    InfoClienteComponent,
    ImprimirCheProComponent,
    ImprimirPrestamoComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppCustomModule {}
