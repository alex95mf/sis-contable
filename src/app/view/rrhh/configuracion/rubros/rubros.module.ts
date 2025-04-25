import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RubrosRoutingModule } from './rubros-routing.module';
import { RubrosComponent } from './rubros.component';
import { ModalModSetComponent } from './modal-mod-set/modal-mod-set.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ModalCuentPreComponent } from './modal-cuent-pre/modal-cuent-pre.component';


@NgModule({
  declarations: [
    RubrosComponent,
    ModalModSetComponent,
    ModalCuentPreComponent
  ],
  imports: [
    CommonModule,
    RubrosRoutingModule,
    AppCustomModule,
  ]
})
export class RubrosModule { }
