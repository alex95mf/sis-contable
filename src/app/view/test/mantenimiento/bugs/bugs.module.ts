import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BugsRoutingModule } from './bugs-routing';
import { BugsComponent } from './bugs.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { NgxCurrencyModule } from 'ngx-currency';
import { ModelDetallesComponent } from './model-detalles/model-detalles.component';
import { ModalHistoryComponent } from './modal-history/modal-history.component';


@NgModule({
  declarations: [
    BugsComponent,
    ModelDetallesComponent,
    ModalHistoryComponent
  ],
  imports: [
    CommonModule,
    BugsRoutingModule,
    AppCustomModule,
    NgxCurrencyModule,
  ]
})
export class BugsModule { }
