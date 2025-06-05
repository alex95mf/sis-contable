import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadoCuentaRoutingModule } from './estado-cuenta.routing';
import { DataTablesModule } from 'angular-datatables';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { provideCharts, withDefaultRegisterables, BaseChartDirective  } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgxPrintModule} from 'ngx-print';
import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { EstadoCuentaComponent } from './estado-cuenta.component';
import { ShowContribuyenteComponent } from './show-contribuyente/show-contribuyente.component';
import { ModalContribuyentesComponent } from './modal-contribuyentes/modal-contribuyentes.component';
import { DetalleInteresesComponent } from './detalle-intereses/detalle-intereses.component';
//import { ContactosContribuyenteComponent } from './contactos/contactos.component';
import { ConceptoDetComponent } from './concepto-det/concepto-det.component';
import { ValidacionesFactory } from 'src/app/config/custom/utils/ValidacionesFactory';

@NgModule({
  declarations: [
    EstadoCuentaComponent/*,ContactosContribuyenteComponent*/,
    ShowContribuyenteComponent,
    ConceptoDetComponent,
    ModalContribuyentesComponent,
    DetalleInteresesComponent
  ],
  imports: [
    CommonModule,
    EstadoCuentaRoutingModule,
    DataTablesModule,
    NgSelectModule,
    FormsModule,
    BaseChartDirective,
    BsDropdownModule,
    ButtonsModule,
    NgbModule,
    NgxPrintModule,
    MultiSelectModule,
    NgxDocViewerModule,
    DatePickerModule,
    AppCustomModule
  ],
  providers: [
    ValidacionesFactory
  ]
})

export class EstadoCuentaModule { }
