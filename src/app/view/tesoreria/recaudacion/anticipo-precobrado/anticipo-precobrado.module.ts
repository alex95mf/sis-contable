import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnticipoPrecobradoRoutingModule } from './anticipo-precobrado-routing.module';
import { AnticipoPrecobradoComponent } from './anticipo-precobrado.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ModalLiquidacionesComponent } from './modal-liquidaciones/modal-liquidaciones.component';
import { ListRecDocumentosComponent } from './list-rec-documentos/list-rec-documentos.component';
import { NgxCurrencyDirective } from 'ngx-currency';
import { CheckboxModule } from 'primeng/checkbox';


@NgModule({
  declarations: [
    AnticipoPrecobradoComponent,
    ModalLiquidacionesComponent,
    ListRecDocumentosComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    AnticipoPrecobradoRoutingModule,
    NgxCurrencyDirective,
    CheckboxModule
  ]
})
export class AnticipoPrecobradoModule { }
