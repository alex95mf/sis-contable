import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContribuyenteRoutingModule } from './contribuyente.routing';
import { DataTablesModule } from 'angular-datatables';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgxPrintModule} from 'ngx-print';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { ContribuyenteComponent } from './contribuyente.component';
//import { ContactosContribuyenteComponent } from './contactos/contactos.component';
import { ShowContribuyenteComponent } from './show-contribuyente/show-contribuyente.component';
import { AnexosListComponent } from './anexos-list/anexos-list.component';
import { ConyugueComponent } from './conyugue/conyugue.component';
import { DiscapacidadComponent } from './discapacidad/discapacidad.component';
import { TutorApoderadoComponent } from './tutor-apoderado/tutor-apoderado.component';
import { PrestamoHipotecarioComponent } from './prestamo-hipotecario/prestamo-hipotecario.component';
import { PerteneceCooperativaComponent } from './pertenece-cooperativa/pertenece-cooperativa.component';
import { AnexosListComponentDis } from './discapacidad/anexos-list/anexos-list-dis.component';
import { AnexosListComponentCoo } from './pertenece-cooperativa/anexos-list/anexos-list-coop.component';
import { AnexosListComponentPrest } from './prestamo-hipotecario/anexos-list/anexos-list-prestamo.component';
import { AnexosListComponentTutor } from './tutor-apoderado/anexos-list/anexos-list-tutor.component';
import { ModalActivosComponent } from './modal-activos/modal-activos.component';
import { ModalNuevolocalComponent } from './modal-nuevolocal/modal-nuevolocal.component';
import { ArtesanoComponent } from './artesano/artesano.component';
import { EnfermedadCatastroficasComponent } from './enfermedad-catastroficas/enfermedad-catastroficas.component';
import { AnexosListArtesaComponent } from './artesano/anexos-list/anexos-list-artesa.component';
import { AnexosListEnfermedadComponent } from './enfermedad-catastroficas/anexos-list/anexos-list-enfermedad.component';
import { ModalActivosCiudadComponent } from './modal-activos/modal-activos-ciudad/modal-activos-ciudad.component';
import { TutorEnfermedadCatastroComponent } from './tutor-enfermedad-catastro/tutor-enfermedad-catastro.component';
import { AnexosListTutorenfermedadComponent } from './tutor-enfermedad-catastro/anexos-list/anexos-list-tutor-enfermedad.component';
import { ModalSolaresComponent } from './modal-solares/modal-solares.component';
import { ModalConvenioComponent } from './modal-convenio/modal-convenio.component';
import { ModalPagosDetComponent } from './modal-pagos-det/modal-pagos-det.component';
import { MatTableModule } from '@angular/material/table';
import { FolderDigitalComponent } from './folder-digital/folder-digital.component';
import { TableModule } from 'primeng/table';
import { NgxCurrencyModule } from 'ngx-currency';
import { ConsultaLotesComponent } from './consulta-lotes/consulta-lotes.component';
import { DetalleInteresesComponent } from './detalle-intereses/detalle-intereses.component';

@NgModule({
  declarations: [
    ContribuyenteComponent/*,ContactosContribuyenteComponent*/,
    ShowContribuyenteComponent,
    AnexosListComponent,
    ConyugueComponent,
    DiscapacidadComponent,
    TutorApoderadoComponent,
    PrestamoHipotecarioComponent,
    PerteneceCooperativaComponent,
    AnexosListComponentDis,
    AnexosListComponentCoo,
    AnexosListComponentPrest,
    AnexosListComponentTutor,
    ModalActivosComponent,
    ModalNuevolocalComponent,
    ArtesanoComponent,
    EnfermedadCatastroficasComponent,
    AnexosListArtesaComponent,
    AnexosListEnfermedadComponent,
    ModalActivosCiudadComponent,
    TutorEnfermedadCatastroComponent,
    AnexosListTutorenfermedadComponent,
    ModalSolaresComponent,
    ModalConvenioComponent,
    ModalPagosDetComponent,
    FolderDigitalComponent,
    ConsultaLotesComponent,
    DetalleInteresesComponent,
  ],
  imports: [
    CommonModule,
    ContribuyenteRoutingModule,
    DataTablesModule,
    NgSelectModule,
    FormsModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule,
    NgbModule,
    NgxPrintModule,
    MultiSelectModule,
    NgxDocViewerModule,
    DatePickerModule,
    AppCustomModule,
    MatTableModule,
    TableModule,
    NgxCurrencyModule,
  ],
  entryComponents: [
    
  ]
})

export class ContribuyenteModule { }
