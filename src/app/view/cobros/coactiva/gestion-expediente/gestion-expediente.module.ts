import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExcelService } from 'src/app/services/excel.service';

import { GestionExpedienteRoutingModule } from './gestion-expediente-routing.module';
import { GestionExpedienteComponent } from './gestion-expediente.component';
import { AppCustomModule } from 'src/app/config/custom/app-custom.module';
import { ModalDetallesComponent } from './modal-detalles/modal-detalles.component';
import { ModalEditionComponent } from './modal-edition/modal-edition.component';


@NgModule({
  providers: [
    ExcelService
  ],
  declarations: [
    GestionExpedienteComponent,
    ModalDetallesComponent,
    ModalEditionComponent
  ],
  imports: [
    CommonModule,
    GestionExpedienteRoutingModule,
    AppCustomModule
  ]
})
export class GestionExpedienteModule { }
