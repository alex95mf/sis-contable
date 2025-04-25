import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ListRecDocumentosComponent } from './list-rec-documentos/list-rec-documentos.component';

import { CostasRoutingModule } from './costas.routing';
import { CostasComponent } from './costas.component';
import { NgxCurrencyModule } from 'ngx-currency';


@NgModule({
  declarations: [
    CostasComponent,
    ListRecDocumentosComponent
  ],
  imports: [
    CommonModule,
    CostasRoutingModule,
    AppCustomModule,
    NgxCurrencyModule
  ]
})
export class CostasModule { }
