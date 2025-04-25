import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { OrganigramaComponent } from './organigrama.component';
import { OrganigramaRoutingModule } from './organigrama.routing';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlatpickrModule } from 'angularx-flatpickr';
import {NgxPrintModule} from 'ngx-print';
import { TreeviewModule } from 'ngx-treeview';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { FancyGridModule } from 'fancy-grid-angular';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ExcelService } from 'src/app/services/excel.service';



@NgModule({
  imports: [
    FormsModule,
    FancyGridModule,
    OrganigramaRoutingModule,
    //ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    DataTablesModule,
    NgbModule,
    NgSelectModule,
    CommonModule,
    FlatpickrModule.forRoot(),
    NgxPrintModule,
    AppCustomModule,
    InfiniteScrollModule,
    TreeViewModule
  ],
  declarations: [OrganigramaComponent],
  providers: [
      ExcelService

  ]
})
export class OrganigramaModule { }
