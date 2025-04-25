import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DescuentosRoutingModule } from './descuentos.routing';
import { DescuentosComponent } from './descuentos.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { NgxCurrencyModule } from 'ngx-currency';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalDescuentosComponent } from './modal-descuentos/modal-descuentos.component';


@NgModule({
  declarations: [
    DescuentosComponent,
    ModalDescuentosComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppCustomModule,
    NgxCurrencyModule,
    DescuentosRoutingModule
  ]
})
export class DescuentosModule { }
