import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideCharts, withDefaultRegisterables, BaseChartDirective  } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { UsuariosOnlineComponent } from './usuarios-online.component';
import { UserOnlineRoutingModule } from './usuarios-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlatpickrModule } from 'angularx-flatpickr';
import {NgxPrintModule} from 'ngx-print';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';


@NgModule({
  imports: [
    FormsModule,
    UserOnlineRoutingModule,
    BaseChartDirective,
    BsDropdownModule,
    CommonModule,
    ButtonsModule.forRoot(),
    DataTablesModule,
    NgbModule,
    NgSelectModule,
    FlatpickrModule,
    NgxPrintModule,
    AppCustomModule
  ],
  declarations: [UsuariosOnlineComponent]
})

export class UsuariosOnlineModule { }
