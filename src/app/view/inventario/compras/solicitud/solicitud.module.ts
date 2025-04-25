import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SolicitudComponent} from './solicitud.component';
import {SolicitudRoutingModule} from './solicitud.routing'
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import {CommonModalModule} from '../../../commons/modals/modal.module';
import { TabsComponent } from './tabs/tabs.component';
import { DetalleComponent } from './tabs/detalle/detalle.component';
import { AnexosComponent } from './tabs/anexos/anexos.component'
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { DataTablesModule } from 'angular-datatables';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';

@NgModule({
  declarations: [SolicitudComponent, TabsComponent, DetalleComponent, AnexosComponent],
  imports: [
    CommonModule,
    SolicitudRoutingModule,
    DataTablesModule,
    NgxExtendedPdfViewerModule,
    NgxDocViewerModule,
    FormsModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule,
    NgbModule,
    NgSelectModule,
    CommonModalModule,
    DatePickerModule,
    AppCustomModule
  ],
  entryComponents: [
  ]
})
export class SolicitudModule { }
