import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogoRoutingModule } from './catalogo.routing';
import { CatalogoComponent } from './catalogo.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { NgxCurrencyModule } from 'ngx-currency';
import { ExcelService } from 'src/app/services/excel.service';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    CatalogoComponent,
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    NgxCurrencyModule,
    CatalogoRoutingModule,
    MatTreeModule,
    MatIconModule,
  ],
  providers: [
    ExcelService,
  ]
})
export class CatalogoModule { }
