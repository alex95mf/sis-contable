import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParametrosRoutingModule } from './parametros.routing';
import { ParametrosComponent } from './parametros.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { NgxCurrencyDirective } from 'ngx-currency';
import { ExcelService } from 'src/app/services/excel.service';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { ConsultaParametrosComponent } from './consulta-parametros/consulta-parametros.component';


@NgModule({
  declarations: [
    ParametrosComponent,
    ConsultaParametrosComponent,
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    NgxCurrencyDirective,
    ParametrosRoutingModule,
    MatTreeModule,
    MatIconModule,
  ],
  providers: [
    ExcelService,
  ]
})
export class ParametrosModule { }
