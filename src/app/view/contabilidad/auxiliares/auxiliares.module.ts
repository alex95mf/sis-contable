import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuxiliaresRoutingModule } from './auxiliares.routing';
import { AuxiliaresComponent } from './auxiliares.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ModalCreateComponent } from './modal-create/modal-create.component';


@NgModule({
  declarations: [
    AuxiliaresComponent,
    ModalCreateComponent
  ],
  imports: [
    CommonModule,
    AppCustomModule,
    AuxiliaresRoutingModule
  ]
})
export class AuxiliaresModule { }
