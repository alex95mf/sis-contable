import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SolaresRoutingModule } from './solares.routing';
import { SolaresComponent } from './solares.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { NgxCurrencyDirective } from 'ngx-currency';
import { ExcelService } from 'src/app/services/excel.service';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { ConsultaLotesComponent } from './consulta-lotes/consulta-lotes.component';


@NgModule({
  declarations: [
    SolaresComponent,
    ConsultaLotesComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    NgxCurrencyDirective,
    SolaresRoutingModule,
    MatTreeModule,
    MatIconModule,
  ],
  providers: [
    ExcelService,
  ]
})
export class SolaresModule { }
