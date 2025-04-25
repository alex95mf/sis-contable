import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { SumasySaldosRoutingModule } from './sumasysaldos.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SumasysaldosComponent } from './sumasysaldos.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ExcelService } from '../../../../services/excel.service';
import { CalendarModule } from 'primeng/calendar';

//import { ReporteEsigefComponent } from './reporte-esigef/reporte-esigef.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    SumasySaldosRoutingModule,
    ChartsModule,
    BsDropdownModule,
    NgbModule,
    AppCustomModule,
    CalendarModule,
    ButtonsModule.forRoot()
  ],
  declarations: [
    SumasysaldosComponent
  ],
  providers: [
      ExcelService

  ]
})

export class SumasySaldosModule { }


