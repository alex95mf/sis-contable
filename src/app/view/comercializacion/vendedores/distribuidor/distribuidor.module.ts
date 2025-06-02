import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DistribuidorRoutingModule } from './distribuidor.routing';
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
import { DistribuidorComponent } from './distribuidor.component';
//import { ContactosDistribuidorComponent } from './contactos/contactos.component';
import { ShowDistribuidorComponent } from './show-distribuidor/show-distribuidor.component';
import { AccordionModule } from 'primeng/accordion';

@NgModule({
  declarations: [DistribuidorComponent/*,ContactosDistribuidorComponent*/,ShowDistribuidorComponent],
  imports: [
    CommonModule,
    DistribuidorRoutingModule,
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
    AccordionModule
  ],
})

export class DistribuidorModule { }
