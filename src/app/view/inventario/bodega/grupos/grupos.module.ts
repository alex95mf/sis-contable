import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';

import { GruposRoutingModule } from './grupos.routing';
import { GruposComponent } from './grupos.component';
import { ModalCuentPreComponent } from './modal-cuent-pre/modal-cuent-pre.component';


@NgModule({
  declarations: [
    GruposComponent,
    ModalCuentPreComponent
  ],
  imports: [
    CommonModule,
    GruposRoutingModule,
    TableModule,
    AppCustomModule,
  ]
})
export class GruposModule { }
