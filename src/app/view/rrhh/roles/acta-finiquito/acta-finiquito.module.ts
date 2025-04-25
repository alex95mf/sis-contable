import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCustomModule } from '../../../../config/custom/app-custom.module';
import { ActaFiniquitoRoutingModule } from './acta-finiquito-routing.module';
import { ActaFiniquitoComponent } from './acta-finiquito.component';
import { ListRecDocumentosComponent } from './list-rec-documentos/list-rec-documentos.component';
import { NgxCurrencyModule } from "ngx-currency";


@NgModule({
  declarations: [
    ActaFiniquitoComponent,
    ListRecDocumentosComponent
  ],
  imports: [
    CommonModule,
    ActaFiniquitoRoutingModule,
    AppCustomModule,
    NgxCurrencyModule
  ]
})
export class ActaFiniquitoModule { }
