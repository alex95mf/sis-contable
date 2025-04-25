import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConvenioRoutingModule } from './convenio-routing.module';
import { ConvenioArrienteTComponent } from './convenio-arriente-t/convenio-arriente-t.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ReporteComponent } from './reporte/reporte.component';
import { NgxCurrencyModule } from 'ngx-currency';



@NgModule({
  declarations: [
    ConvenioArrienteTComponent,
    ReporteComponent,

  ],
  imports: [
    CommonModule,
    ConvenioRoutingModule,
    AppCustomModule,
    NgxCurrencyModule
  ]
})
export class ConvenioModule { }
